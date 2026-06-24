import { buildMediaHints } from "./badge-correlation.js";
import { searchElementsEvents } from "./elements-tool-api.js";
import { getCameraList } from "./get-entity-tool-api.js";
import { searchNetboxEvents } from "./netbox-tool-api.js";
import { searchOnGuardEvents } from "./onguard-tool-api.js";
import { listReidentificationEmbeddings, searchReidentificationMatchesByEmbedding } from "./reid-tool-api.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

export interface GetPersonTrackArgs {
  personQuery: string;
  afterMs?: number;
  beforeMs?: number;
  locationUuids?: string[];
  badgeMatchWindowSeconds?: number;
  clipPaddingSeconds?: number;
  limit?: number;
}

const DEFAULT_BADGE_MATCH_WINDOW_S = 30;
const DEFAULT_TRACK_FORWARD_MS = 6 * 60 * 60 * 1000; // track 6h forward from the badge tap if no endTime

/** RUUID without any `.vN` facet suffix, so a badge event's camera matches the camera-state list. */
function stripFacet(uuid?: string): string {
  return (uuid ?? "").split(".")[0];
}

/**
 * Reconstructs where a named person went, grounded in access control + person re-identification:
 *   1. find the person's badge tap(s) (OnGuard / Elements / NetBox) → a camera + time we KNOW is them,
 *   2. pull the re-id embedding recorded on that camera nearest the badge time (the person at the door),
 *   3. re-id-search that embedding across cameras over the window → their cross-camera movement track.
 *
 * Identity comes from the badge (not face recognition); the track is appearance/re-id based.
 */
export async function getPersonTrack(
  args: GetPersonTrackArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  // 1. Anchor on access-control events. Check all three badge integrations; an org may use any.
  const badgeArgs = {
    cardholderQuery: args.personQuery,
    locationUuids: args.locationUuids,
    afterMs: args.afterMs,
    beforeMs: args.beforeMs,
    limit: args.limit ?? 200,
  };
  const empty = { events: [] as Array<Record<string, unknown>> };
  const [og, el, nb] = await Promise.all([
    searchOnGuardEvents(badgeArgs, timeZone, requestModifiers, sessionId).catch(() => empty),
    searchElementsEvents(badgeArgs, timeZone, requestModifiers, sessionId).catch(() => empty),
    searchNetboxEvents(badgeArgs, timeZone, requestModifiers, sessionId).catch(() => empty),
  ]);
  type BadgeEvent = {
    deviceUuid?: string;
    timestampMs?: number;
    datetime?: string;
    cardholderName?: string;
    areaEntering?: string;
    areaExiting?: string;
  };
  const badgeEvents = [
    ...(og.events as BadgeEvent[]).map((e) => ({ ...e, integration: "OnGuard" })),
    ...(el.events as BadgeEvent[]).map((e) => ({ ...e, integration: "Elements" })),
    ...(nb.events as BadgeEvent[]).map((e) => ({ ...e, integration: "NetBox" })),
  ]
    .filter((e) => e.deviceUuid && e.timestampMs != null)
    .sort((a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0));

  if (badgeEvents.length === 0) {
    return {
      sightings: [],
      path: [],
      count: 0,
      note: `No access-control (badge) events found for "${args.personQuery}" in the window — can't anchor a re-id track. Try a wider time range, or confirm the name as it appears on the badge.`,
    };
  }

  // Earliest badge tap in the window — track forward from there.
  const anchor = badgeEvents[0];
  const resolvedPerson = anchor.cardholderName ? { name: anchor.cardholderName } : undefined;
  const anchorOut = {
    deviceUuid: anchor.deviceUuid,
    timestampMs: anchor.timestampMs,
    datetime: anchor.datetime,
    integration: anchor.integration,
    area: anchor.areaEntering ?? anchor.areaExiting,
  };

  // 2. Resolve the badge camera's location (re-id list is scoped by location).
  let anchorLocationUuid: string | undefined;
  try {
    const { cameras } = await getCameraList(requestModifiers, sessionId);
    const dev = stripFacet(anchor.deviceUuid);
    anchorLocationUuid = (cameras as Array<{ uuid?: string; locationUuid?: string }>).find(
      (c) => stripFacet(c.uuid) === dev
    )?.locationUuid;
  } catch {
    // best-effort; the re-id list can still run device-scoped without a location
  }

  // 3. Ground the re-id embedding: the person detected on that camera nearest the badge tap.
  const winMs = (args.badgeMatchWindowSeconds ?? DEFAULT_BADGE_MATCH_WINDOW_S) * 1000;
  const anchorMs = anchor.timestampMs as number;
  const embeddings = await listReidentificationEmbeddings(
    {
      deviceUuids: [anchor.deviceUuid as string],
      locationUuid: anchorLocationUuid,
      startTimestampMs: anchorMs - winMs,
      endTimestampMs: anchorMs + winMs,
      limit: 100,
    },
    requestModifiers,
    sessionId
  );

  if (embeddings.length === 0) {
    return {
      resolvedPerson,
      anchor: anchorOut,
      sightings: [],
      path: [],
      count: 0,
      note: `Found ${anchor.cardholderName ?? "the person"}'s badge tap at ${anchor.datetime}, but no person re-identification embedding was recorded on that camera within ±${args.badgeMatchWindowSeconds ?? DEFAULT_BADGE_MATCH_WINDOW_S}s — can't build a re-id track. (Re-id needs human-detection coverage on the door camera.)`,
    };
  }

  // The detection closest in time to the badge tap is the best proxy for the badge holder.
  const seed = embeddings.reduce((best, e) =>
    Math.abs((e.timestamp ?? 0) - anchorMs) < Math.abs((best.timestamp ?? 0) - anchorMs) ? e : best
  );
  if (!seed.embedding || seed.embedding.length === 0) {
    return {
      resolvedPerson,
      anchor: anchorOut,
      sightings: [],
      path: [],
      count: 0,
      note: "The re-id detection at the door had no embedding vector; can't search for matches.",
    };
  }

  // 4. Re-id search that appearance across cameras over the window.
  const searchStart = args.afterMs ?? anchorMs;
  const searchEnd = args.beforeMs ?? anchorMs + DEFAULT_TRACK_FORWARD_MS;
  const matches = await searchReidentificationMatchesByEmbedding(
    {
      searchEmbedding: seed.embedding,
      locationUuid: args.locationUuids?.[0],
      startTimestampMs: searchStart,
      endTimestampMs: searchEnd,
      limit: args.limit ?? 200,
    },
    requestModifiers,
    sessionId
  );

  // 5. Build the chronological track with media hints.
  const ordered = matches
    .filter((m) => m.timestamp != null)
    .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

  const sightings = ordered.map((m, i) => {
    const next = ordered[i + 1];
    const gapToNextSeconds =
      next?.timestamp != null && m.timestamp != null
        ? Math.round((next.timestamp - m.timestamp) / 1000)
        : undefined;
    const { clipHint, stillHint } = buildMediaHints(
      { deviceUuid: m.deviceUuid, timestampMs: m.timestamp },
      args.clipPaddingSeconds
    );
    return {
      timestampMs: m.timestamp,
      datetime: m.timestamp != null ? formatTimestamp(m.timestamp, timeZone) : undefined,
      deviceUuid: m.deviceUuid,
      locationUuid: m.locationUuid,
      distance: m.distance,
      stableTrackId: m.stableTrackId,
      thumbnailUri: m.thumbnailUri,
      clipHint,
      stillHint,
      gapToNextSeconds,
    };
  });

  const path: string[] = [];
  for (const s of sightings) {
    if (s.deviceUuid && s.deviceUuid !== path[path.length - 1]) path.push(s.deviceUuid);
  }

  return {
    resolvedPerson,
    anchor: anchorOut,
    sightings,
    path,
    lastKnownSighting: sightings[sightings.length - 1],
    count: sightings.length,
  };
}
