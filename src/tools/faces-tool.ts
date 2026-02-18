import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFaceEvents, getPersonLabels, getRegisteredFaces } from "../api/faces-tool-api.js";
import {
  type GetFaceEventsArgs,
  type GetRegisteredFacesArgs,
  OUTPUT_SCHEMA,
  RequestType,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/faces-tools-types.js";
import { extractFromToolExtra } from "../util.js";
import { logger } from "../logger.js";

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

const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus face recognition system to retrieve information about face sightings and registered faces.

It should only be used if someone is specifically asking about faces. If they are asking about people or humans, you should use the events-tool with eventType "people" instead as this tool is for face sightings only.

**Important for person-presence questions:** When asked whether specific people were seen or are present, you should ALSO call events-tool with eventType "access-control" to check badge-in records. Face recognition and access control are complementary — someone may badge in without face recognition triggering, or be seen by a camera without badging in.

If the requestType is "get-face-events":
- Use this tool to answer questions about face sightings, including questions like "who was in the office" or "who was seen today". Can be used for reporting, to generate a report on who was seen by the camera system.
- **Automatic name resolution:** You can pass partial or first-name-only names in faceNames (e.g., "Brandon", "Omar"). The tool automatically looks up the registered faces directory and resolves them to exact names and person UUIDs before searching. Check the "resolvedNames" field in the response to see what each queried name was matched to (null means no match found).
- You can filter face events using parameters like 'faceNames', 'hasEmbedding', 'hasName', 'labels', 'locationUuids', 'personUuids', and a time range using 'rangeStart' and 'rangeEnd' (timestamps in milliseconds).
- If you'd like to know about all face events at a location, pass in a location UUID and no device UUIDs. This will correctly return all face events at that location.
- When the user asks about a specific person at a location (e.g. "Jane Doe at Main Office"), call get-registered-faces first to get the list of registered names, find the best match, then call get-face-events with that precise name. The tool expects precise names as stored in the system.
- When querying faces at a location, pass only the location UUID in searchFilter; do not pass device UUIDs in searchFilter.deviceUuids, so the API returns all faces detected at that location.

If the requestType is "get-registered-faces":
- This tool retrieves a list of all people (registered faces) currently known to the Rhombus system for your organization. This list includes information about each registered person, including their assigned labels.
- This returns ALL people registered in the system, regardless of the provided timestampFilter.
- Each person in the response includes a "labels" array showing which label groups they belong to (e.g., "Engineering", "Visitors"). Use these labels to answer questions about groups of people.

If the requestType is "get-person-labels":
- This retrieves a mapping of all person UUIDs to their assigned labels across the organization.
- Use this to discover what label groups exist and which registered faces belong to each group.
- Useful when the user asks about a group (e.g., "was anyone from Engineering seen today?") — get the labels first, find the person UUIDs for that label, then query face events filtered by those personUuids or labels.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  let ret: OUTPUT_SCHEMA = {
    requestType: args.requestType,
  };
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

    let response = await getFaceEvents(faceEventArgs, args.timeZone, requestModifiers, sessionId);

    const hadLocationFilter =
      faceEventArgs.searchFilter?.locationUuids &&
      faceEventArgs.searchFilter.locationUuids.length > 0;
    if (response.length === 0 && hadLocationFilter) {
      logger.info(
        `[faces-tool] Empty results with locationUuids filter ${JSON.stringify(faceEventArgs.searchFilter!.locationUuids)}, retrying without location filter`
      );
      const retryArgs = {
        ...faceEventArgs,
        searchFilter: { ...faceEventArgs.searchFilter!, locationUuids: [] },
      };
      response = await getFaceEvents(retryArgs as GetFaceEventsArgs, args.timeZone, requestModifiers, sessionId);
    }

    ret = {
      requestType: RequestType.GET_FACE_EVENTS,
      getFaceEventsResponse: response,
      ...(resolvedNamesOutput ? { resolvedNames: resolvedNamesOutput } : {}),
    };
  } else if (args.requestType === RequestType.GET_REGISTERED_FACES) {
    const [peopleResponse, labelsResponse] = await Promise.all([
      getRegisteredFaces(args as GetRegisteredFacesArgs, requestModifiers, sessionId),
      getPersonLabels(requestModifiers, sessionId),
    ]);
    const labelsByPerson = labelsResponse.labelsByPerson ?? {};
    if (peopleResponse.people) {
      ret = {
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
      };
    } else {
      ret = {
        requestType: RequestType.GET_REGISTERED_FACES,
        error: String(peopleResponse.error),
      };
    }
  } else if (args.requestType === RequestType.GET_PERSON_LABELS) {
    const response = await getPersonLabels(requestModifiers, sessionId);
    if (response.labelsByPerson) {
      const cleaned: Record<string, string[]> = {};
      for (const [personUuid, labels] of Object.entries(response.labelsByPerson)) {
        if (labels) {
          cleaned[personUuid] = labels.filter((l): l is string => l != null);
        }
      }
      ret = {
        requestType: RequestType.GET_PERSON_LABELS,
        getPersonLabelsResponse: cleaned,
      };
    } else {
      ret = {
        requestType: RequestType.GET_PERSON_LABELS,
        getPersonLabelsResponse: {},
      };
    }
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
    structuredContent: ret,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
