import { buildMediaHints } from "./badge-correlation.js";
import { getFaceEvents, getRegisteredFaces, searchSimilarFaces } from "./faces-tool-api.js";
import type { GetFaceEventsArgs, GetRegisteredFacesArgs } from "../types/faces-tools-types.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

export interface GetPersonTrackArgs {
  personQuery?: string;
  personUuid?: string;
  faceEventUuid?: string;
  locationUuids?: string[];
  afterMs?: number;
  beforeMs?: number;
  clipPaddingSeconds?: number;
  limit?: number;
}

interface PersonRef {
  name?: string;
  personUuid?: string;
}

/** A normalized face sighting before media hints are attached. */
interface RawSighting {
  deviceUuid?: string;
  timestampMs?: number;
  datetime?: string;
  locationUuid?: string;
  faceName?: string;
  similarity?: number;
  thumbnailS3Key?: string;
}

/**
 * Fuzzy-match a free-text name against the registered-faces directory. Mirrors faces-tool's scoring
 * (4 = exact full name, 3 = first name, 2 = last name, 1 = substring ≥3 chars) but returns every person
 * tied at the best score so the caller can flag ambiguity instead of silently tracking the wrong person.
 */
function matchRegisteredPeople(
  query: string,
  people: Array<{ name?: string | null; uuid?: string | null }>
): PersonRef[] {
  const input = query.toLowerCase().trim();
  if (!input) return [];

  let bestScore = 0;
  const scored: Array<{ name: string; uuid: string; score: number }> = [];
  for (const person of people) {
    if (!person.name || !person.uuid) continue;
    const fullName = person.name.toLowerCase().trim();
    const parts = fullName.split(/\s+/);

    let score = 0;
    if (fullName === input) score = 4;
    else if (parts[0] === input) score = 3;
    else if (parts.length > 1 && parts[parts.length - 1] === input) score = 2;
    else if (input.length >= 3 && fullName.includes(input)) score = 1;

    if (score > 0) {
      scored.push({ name: person.name, uuid: person.uuid, score });
      if (score > bestScore) bestScore = score;
    }
  }

  // Dedupe by uuid among the best-scoring tier.
  const seen = new Set<string>();
  const top: PersonRef[] = [];
  for (const s of scored) {
    if (s.score !== bestScore || seen.has(s.uuid)) continue;
    seen.add(s.uuid);
    top.push({ name: s.name, personUuid: s.uuid });
  }
  return top;
}

/**
 * Reconstructs one person's movements across cameras as a chronological track of face sightings, each
 * with the still/clip hints needed to show the moment. Pure orchestration over the face-recognition
 * APIs:
 *   - faceEventUuid  -> searchSimilarFaces (appearance match; works for unrecognized people)
 *   - personUuid     -> getFaceEvents filtered to that person
 *   - personQuery    -> resolve name against registered faces, then getFaceEvents
 */
export async function getPersonTrack(
  args: GetPersonTrackArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  resolvedPerson?: PersonRef;
  ambiguousPeople?: PersonRef[];
  sightings: ReturnType<typeof buildSightings>;
  path: string[];
  lastKnownSighting?: ReturnType<typeof buildSightings>[number];
  count: number;
}> {
  let resolvedPerson: PersonRef | undefined;
  let raw: RawSighting[] = [];

  if (args.faceEventUuid) {
    // Appearance-based track from a seed sighting — handles people who aren't registered/named.
    const similar = await searchSimilarFaces(args.faceEventUuid, timeZone, requestModifiers, sessionId);
    raw = similar.map((s) => ({
      deviceUuid: s.deviceUuid,
      timestampMs: s.eventTimestampMs,
      datetime: s.eventTimestamp,
      similarity: s.similarity,
      faceName: undefined,
    }));
  } else {
    // Resolve to a person UUID (directly or by name) before pulling their face events.
    let personUuid = args.personUuid;
    if (!personUuid && args.personQuery) {
      const peopleResponse = await getRegisteredFaces({} as GetRegisteredFacesArgs, requestModifiers, sessionId);
      const matches = matchRegisteredPeople(args.personQuery, peopleResponse.people ?? []);
      if (matches.length > 1) {
        return { ambiguousPeople: matches, sightings: [], path: [], count: 0 };
      }
      if (matches.length === 0) {
        return { sightings: [], path: [], count: 0 };
      }
      resolvedPerson = matches[0];
      personUuid = matches[0].personUuid;
    } else if (personUuid) {
      resolvedPerson = { personUuid };
    }

    if (!personUuid) {
      return { sightings: [], path: [], count: 0 };
    }

    const faceEventArgs: GetFaceEventsArgs = {
      pageRequest: { maxPageSize: args.limit ?? 200, lastEvaluatedKey: null },
      searchFilter: {
        faceNameContains: null,
        faceNames: [],
        hasEmbedding: null,
        hasName: null,
        labels: [],
        locationUuids: args.locationUuids ?? [],
        personUuids: [personUuid],
        timestampFilter:
          args.afterMs != null || args.beforeMs != null
            ? {
                rangeStart: args.afterMs != null ? new Date(args.afterMs).toISOString() : null,
                rangeEnd: args.beforeMs != null ? new Date(args.beforeMs).toISOString() : null,
              }
            : null,
      },
    };
    const { faceEvents } = await getFaceEvents(faceEventArgs, timeZone, requestModifiers, sessionId);
    raw = faceEvents.map((e) => ({
      deviceUuid: e.deviceUuid,
      timestampMs: e.eventTimestampMs,
      datetime: e.eventTimestamp,
      locationUuid: e.locationUuid,
      faceName: e.faceName,
      thumbnailS3Key: e.thumbnailS3Key,
    }));
    if (!resolvedPerson?.name) {
      const named = raw.find((r) => r.faceName);
      if (named?.faceName) resolvedPerson = { name: named.faceName, personUuid };
    }
  }

  // Always enforce the time window client-side (searchSimilarFaces has no time filter, and the face-event
  // time filter defaults to the last 7 days if unset) and order chronologically.
  const ordered = raw
    .filter((r) => r.timestampMs != null)
    .filter((r) => (args.afterMs == null || (r.timestampMs as number) >= args.afterMs))
    .filter((r) => (args.beforeMs == null || (r.timestampMs as number) <= args.beforeMs))
    .sort((a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0))
    .slice(0, args.limit ?? 200);

  const sightings = buildSightings(ordered, timeZone, args.clipPaddingSeconds);

  // Camera sequence the person moved through, collapsing consecutive repeats.
  const path: string[] = [];
  for (const s of sightings) {
    if (s.deviceUuid && s.deviceUuid !== path[path.length - 1]) path.push(s.deviceUuid);
  }

  return {
    resolvedPerson,
    sightings,
    path,
    lastKnownSighting: sightings[sightings.length - 1],
    count: sightings.length,
  };
}

function buildSightings(ordered: RawSighting[], timeZone: string, clipPaddingSeconds?: number) {
  return ordered.map((s, i) => {
    const next = ordered[i + 1];
    const gapToNextSeconds =
      next?.timestampMs != null && s.timestampMs != null
        ? Math.round((next.timestampMs - s.timestampMs) / 1000)
        : undefined;
    const { clipHint, stillHint } = buildMediaHints(
      { deviceUuid: s.deviceUuid, timestampMs: s.timestampMs },
      clipPaddingSeconds
    );
    return {
      timestampMs: s.timestampMs,
      datetime: s.datetime ?? (s.timestampMs != null ? formatTimestamp(s.timestampMs, timeZone) : undefined),
      deviceUuid: s.deviceUuid,
      locationUuid: s.locationUuid,
      faceName: s.faceName,
      similarity: s.similarity,
      thumbnailS3Key: s.thumbnailS3Key,
      clipHint,
      stillHint,
      gapToNextSeconds,
    };
  });
}
