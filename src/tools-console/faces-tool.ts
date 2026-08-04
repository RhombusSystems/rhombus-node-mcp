import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFaceEvents, getFaceEventsByPerson, getFaceMatchmakers, getPersonLabels, getRegisteredFaces, searchSimilarFaces } from "../api/faces-tool-api.js";
import { logger } from "../logger.js";
import {
  type GetFaceEventsArgs,
  type GetRegisteredFacesArgs,
  OUTPUT_SCHEMA,
  RequestType,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/faces-tools-types.js";
import { protectFields } from "../filtering-utils.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "faces-tool";

/**
 * Fuzzy-match user-provided names against the registered faces directory.
 * Scoring: 4 = exact full name, 3 = first name, 2 = last name, 1 = substring (min 3 chars).
 * Returns the best match per queried name.
 */
function resolveNamesToRegisteredFaces(
  userNames: string[],
  registeredPeople: Array<{ name?: string | null; uuid?: string | null }>
): Array<{ queriedName: string; resolvedName: string | null; resolvedPersonUuid: string | null }> {
  return userNames.map(userName => {
    const input = userName.toLowerCase().trim();
    if (!input) return { queriedName: userName, resolvedName: null, resolvedPersonUuid: null };

    let best: { name: string; uuid: string; score: number } | null = null;

    for (const person of registeredPeople) {
      if (!person.name || !person.uuid) continue;
      const fullName = person.name.toLowerCase().trim();
      const parts = fullName.split(/\s+/);

      let score = 0;
      if (fullName === input) score = 4;
      else if (parts[0] === input) score = 3;
      else if (parts.length > 1 && parts[parts.length - 1] === input) score = 2;
      else if (input.length >= 3 && fullName.includes(input)) score = 1;

      if (score > 0 && (!best || score > best.score)) {
        best = { name: person.name, uuid: person.uuid, score };
      }
    }

    return {
      queriedName: userName,
      resolvedName: best?.name ?? null,
      resolvedPersonUuid: best?.uuid ?? null,
    };
  });
}

/**
 * Roll a page of face events up into a distinct-person roster.
 *
 * Enumerating "who was seen" from a 200-event page is exactly the operation the
 * response model does badly: the raw page is well over the chatbot's compaction
 * threshold, so the model never sees it directly, and when it reads the compacted
 * form it tends to answer from whatever chunk arrived last. Doing the dedupe here
 * means the answer is a field lookup rather than a 200-row scan.
 */
function summarizeFaceEvents(
  faceEvents: Array<{ faceName?: string | null; eventTimestamp?: string | null; eventTimestampMs?: number | null }>,
  morePagesAvailable: boolean
) {
  const byName = new Map<
    string,
    { name: string; eventCount: number; firstMs: number; lastMs: number; firstSeen: string; lastSeen: string }
  >();
  let unnamedEvents = 0;

  for (const event of faceEvents) {
    const name = event.faceName?.trim();
    if (!name) {
      unnamedEvents++;
      continue;
    }
    const ms = event.eventTimestampMs ?? 0;
    const label = event.eventTimestamp ?? String(ms);
    const existing = byName.get(name);
    if (!existing) {
      byName.set(name, { name, eventCount: 1, firstMs: ms, lastMs: ms, firstSeen: label, lastSeen: label });
      continue;
    }
    existing.eventCount++;
    if (ms < existing.firstMs) {
      existing.firstMs = ms;
      existing.firstSeen = label;
    }
    if (ms > existing.lastMs) {
      existing.lastMs = ms;
      existing.lastSeen = label;
    }
  }

  const identifiedPeople = [...byName.values()]
    // Most-seen first, then alphabetical so the ordering is stable across pages.
    .sort((a, b) => b.eventCount - a.eventCount || a.name.localeCompare(b.name))
    .map(({ name, eventCount, firstSeen, lastSeen }) => ({ name, eventCount, firstSeen, lastSeen }));

  return {
    totalEventsThisPage: faceEvents.length,
    namedEvents: faceEvents.length - unnamedEvents,
    unnamedEvents,
    identifiedPeople,
    morePagesAvailable,
  };
}

const TOOL_DESCRIPTION = `
Rhombus **face recognition**: face sightings and registered faces. Use it to identify *who* was seen (unique individuals by name) — "who was in the office", "who was seen today" — to list the people registered in the org, or to work with person label groups (e.g. "Engineering", "Visitors").

**Head counts are a different tool:** if the user asks how MANY people were seen (head count / occupancy), use report-tool with GET_OCCUPANCY_ENABLED_CAMERAS and GET_OCCUPANCY_COUNT_REPORT instead. Its people-counting responses already carry this tool's unique-face data in the faceCountEnrichment field.

**Important for person-presence questions:** when asked whether specific people were seen or are present, you should ALSO check badge-in records for the same time range — the vendor badge tools (onguard-events-tool / elements-events-tool / netbox-events-tool; call all three in parallel, each returns empty when not configured) and events-tool with eventType "access-control" (native Rhombus doors) or "brivo-access-control" (Brivo). Face recognition and access control are complementary: someone may badge in without face recognition triggering, or be seen by a camera without badging in.

Per-requestType behaviour — automatic name resolution, the available filters, and how to query a whole location — is documented on the requestType parameter.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  if (args.requestType === RequestType.GET_FACE_EVENTS) {
    const faceEventArgs = args.faceEventFilter as GetFaceEventsArgs;
    let resolvedNamesOutput: Record<string, string | null> | undefined;

    const providedNames = faceEventArgs.searchFilter?.faceNames ?? [];
    if (providedNames.length > 0 && faceEventArgs.searchFilter) {
      try {
        const peopleResponse = await getRegisteredFaces(
          {} as GetRegisteredFacesArgs,
          requestModifiers,
          sessionId
        );
        if (peopleResponse.people) {
          const resolutions = resolveNamesToRegisteredFaces(providedNames, peopleResponse.people);
          resolvedNamesOutput = {};
          const resolvedUuids: string[] = [];
          const resolvedExactNames: string[] = [];
          const unresolvedNames: string[] = [];

          for (const r of resolutions) {
            resolvedNamesOutput[r.queriedName] = r.resolvedName;
            if (r.resolvedPersonUuid && r.resolvedName) {
              resolvedUuids.push(r.resolvedPersonUuid);
              resolvedExactNames.push(r.resolvedName);
            } else {
              unresolvedNames.push(r.queriedName);
            }
          }

          if (resolvedUuids.length > 0) {
            const existingUuids = faceEventArgs.searchFilter.personUuids ?? [];
            const mergedUuids = [...new Set([...existingUuids, ...resolvedUuids])];
            (faceEventArgs.searchFilter as any).personUuids = mergedUuids;
            faceEventArgs.searchFilter.faceNames = [...resolvedExactNames, ...unresolvedNames];
            logger.info(
              `[faces-tool] Auto-resolved names: ${JSON.stringify(resolvedNamesOutput)}`
            );
          }
        }
      } catch (e) {
        logger.warn("[faces-tool] Name resolution failed, proceeding with original args", e);
      }
    }

    let { faceEvents, lastEvaluatedKey } = await getFaceEvents(faceEventArgs, args.timeZone, requestModifiers, sessionId);

    const requestedLocationUuids = faceEventArgs.searchFilter?.locationUuids ?? [];
    const hadLocationFilter = requestedLocationUuids.length > 0;
    let note: string | undefined;
    if (faceEvents.length === 0 && hadLocationFilter) {
      logger.info(
        `[faces-tool] Empty results with locationUuids filter ${JSON.stringify(requestedLocationUuids)}, retrying without location filter`
      );
      const retryArgs = {
        ...faceEventArgs,
        searchFilter: { ...faceEventArgs.searchFilter!, locationUuids: [] },
      };
      const retry = await getFaceEvents(retryArgs as GetFaceEventsArgs, args.timeZone, requestModifiers, sessionId);
      faceEvents = retry.faceEvents;
      lastEvaluatedKey = retry.lastEvaluatedKey;
      // Without this the caller cannot tell a location-scoped result from an
      // org-wide one, and reports org-wide sightings as having happened at the
      // requested location (observed in prod, 2026-08-03).
      if (faceEvents.length > 0) {
        note =
          `SCOPE CHANGED: no face events were found at the requested location(s) ` +
          `[${requestedLocationUuids.join(", ")}], so this search was re-run ACROSS THE WHOLE ORG. ` +
          `The events below are NOT limited to those locations — check each event's locationUuid before ` +
          `attributing a sighting to the location the user asked about, and tell the user the scope was widened.`;
      } else {
        note =
          `No face events at the requested location(s) [${requestedLocationUuids.join(", ")}], ` +
          `and none org-wide for this time range either.`;
      }
    }

    return createToolStructuredContent({
      requestType: RequestType.GET_FACE_EVENTS,
      getFaceEventsResponse: faceEvents,
      faceEventSummary: summarizeFaceEvents(faceEvents, Boolean(lastEvaluatedKey)),
      lastEvaluatedKey: lastEvaluatedKey ?? undefined,
      resolvedNames: resolvedNamesOutput ?? undefined,
      note,
    });
  }

  if (args.requestType === RequestType.GET_REGISTERED_FACES) {
    const [peopleResponse, labelsResponse] = await Promise.all([
      getRegisteredFaces(args as GetRegisteredFacesArgs, requestModifiers, sessionId),
      getPersonLabels(requestModifiers, sessionId),
    ]);
    const labelsByPerson = labelsResponse.labelsByPerson ?? {};
    if (peopleResponse.people) {
      return createToolStructuredContent({
        requestType: RequestType.GET_REGISTERED_FACES,
        getSavedFacesResponse: peopleResponse.people.map(p => ({
          createdOn: p.createdOn ? parseInt(p.createdOn, 10) : undefined,
          name: p.name ?? undefined,
          orgUuid: p.orgUuid ?? undefined,
          updatedOn: p.updatedOn ? parseInt(p.updatedOn, 10) : undefined,
          uuid: p.uuid ?? undefined,
          labels: p.uuid
            ? (labelsByPerson[p.uuid] ?? []).filter((l): l is string => l != null)
            : undefined,
        })),
      });
    }
    return createToolStructuredContent({
      requestType: RequestType.GET_REGISTERED_FACES,
      error: String(peopleResponse.error),
    });
  }

  if (args.requestType === RequestType.GET_PERSON_LABELS) {
    const response = await getPersonLabels(requestModifiers, sessionId);
    const cleaned: Record<string, string[]> = {};
    if (response.labelsByPerson) {
      for (const [personUuid, labels] of Object.entries(response.labelsByPerson)) {
        if (labels) {
          cleaned[personUuid] = labels.filter((l): l is string => l != null);
        }
      }
    }
    return createToolStructuredContent({
      requestType: RequestType.GET_PERSON_LABELS,
      getPersonLabelsResponse: cleaned,
    });
  }

  if (args.requestType === RequestType.SEARCH_SIMILAR_FACES) {
    if (!args.faceEventUuid) {
      return createToolStructuredContent({
        requestType: RequestType.SEARCH_SIMILAR_FACES,
        error: "faceEventUuid is required for search-similar-faces",
      });
    }
    const similarEvents = await searchSimilarFaces(args.faceEventUuid, args.timeZone, requestModifiers, sessionId);
    return createToolStructuredContent({
      requestType: RequestType.SEARCH_SIMILAR_FACES,
      similarFaceEvents: similarEvents,
    });
  }

  if (args.requestType === RequestType.GET_FACE_MATCHMAKERS) {
    const matchmakers = await getFaceMatchmakers(requestModifiers, sessionId);
    return createToolStructuredContent({
      requestType: RequestType.GET_FACE_MATCHMAKERS,
      faceMatchmakers: matchmakers,
    });
  }

  if (args.requestType === RequestType.GET_FACE_EVENTS_BY_PERSON) {
    if (!args.personUuid) {
      return createToolStructuredContent({
        requestType: RequestType.GET_FACE_EVENTS_BY_PERSON,
        error: "personUuid is required for get-face-events-by-person",
      });
    }
    const { faceEvents: personEvents } = await getFaceEventsByPerson(args.personUuid, args.timeZone, requestModifiers, sessionId);
    return createToolStructuredContent({
      requestType: RequestType.GET_FACE_EVENTS_BY_PERSON,
      personFaceEvents: personEvents,
    });
  }

  return createToolStructuredContent({
    requestType: args.requestType,
  });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    // faceEventSummary is the whole point of the roster: a caller that projects
    // down to the raw event rows must not lose the deduplicated person list.
    protectFields(
      {
        title: "Faces",
        description: TOOL_DESCRIPTION,
        inputSchema: TOOL_ARGS,
        outputSchema: OUTPUT_SCHEMA.shape,
        annotations: { readOnlyHint: true },
      },
      ["faceEventSummary"]
    ),
    TOOL_HANDLER
  );
}
