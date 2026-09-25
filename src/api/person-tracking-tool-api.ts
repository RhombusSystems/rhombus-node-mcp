import { buildMediaHints } from "./badge-correlation.js";
import { searchElementsEvents } from "./elements-tool-api.js";
import { getCameraList } from "./get-entity-tool-api.js";
import { searchNetboxEvents } from "./netbox-tool-api.js";
import { searchOnGuardEvents } from "./onguard-tool-api.js";
import { listReidentificationEmbeddings, searchReidentificationMatchesByEmbedding } from "./reid-tool-api.js";
import { searchRhombusBadgeEvents } from "./rhombus-badge-events-api.js";
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
const MAX_BADGE_EVENTS_OUT = 25;

/** RUUID without any `.vN` facet suffix, so a badge event's camera matches the camera-state list. */
function stripFacet(uuid?: string): string {
  return (uuid ?? "").split(".")[0];
}

type BadgeSource = "Rhombus" | "OnGuard" | "Elements" | "NetBox";

/** One badge tap from any source, normalized for anchoring. */
type BadgeTap = {
  integration: BadgeSource;
  timestampMs: number;
  datetime?: string;
  cardholderName?: string;
  /** Cameras that can see the tap, primary first. Empty = can't anchor re-id on it. */
  cameraUuids: string[];
  /** Rhombus door location — saves a camera-list lookup. */
  locationUuid?: string;
  area?: string;
  doorUuid?: string;
  /** False only for a tap we know was denied. */
  granted: boolean;
};

/**
 * Reconstructs where a named person went, grounded in access control + person re-identification:
 *   1. find the person's badge tap(s) (native Rhombus doors / OnGuard / Elements / NetBox) → a camera
 *      + time we KNOW is them,
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
  // 1. Anchor on access-control events. Check native Rhombus doors and all three vendor
  // integrations; an org may use any of them. A failed source is reported, never read as "no taps".
  const badgeArgs = {
    cardholderQuery: args.personQuery,
    locationUuids: args.locationUuids,
    afterMs: args.afterMs,
    beforeMs: args.beforeMs,
    limit: args.limit ?? 200,
  };
  const sourceErrors: Array<{ source: BadgeSource; error: string }> = [];
  const settle = async <T>(source: BadgeSource, p: Promise<T>): Promise<T | undefined> => {
    try {
      return await p;
    } catch (e) {
      sourceErrors.push({ source, error: e instanceof Error ? e.message : String(e) });
      return undefined;
    }
  };
  type VendorEvent = {
    deviceUuid?: string;
    timestampMs?: number;
    datetime?: string;
    cardholderName?: string;
    areaEntering?: string;
    areaExiting?: string;
  };
  const vendorTaps = (source: BadgeSource, res?: { events: unknown[] }): BadgeTap[] =>
    ((res?.events ?? []) as VendorEvent[])
      .filter((e) => e.timestampMs != null)
      .map((e) => ({
        integration: source,
        timestampMs: e.timestampMs as number,
        datetime: e.datetime,
        cardholderName: e.cardholderName,
        cameraUuids: e.deviceUuid ? [e.deviceUuid] : [],
        area: e.areaEntering ?? e.areaExiting,
        granted: true,
      }));

  const [rh, og, el, nb] = await Promise.all([
    settle(
      "Rhombus",
      searchRhombusBadgeEvents(
        { personQuery: args.personQuery, afterMs: args.afterMs, beforeMs: args.beforeMs, locationUuids: args.locationUuids, limit: args.limit ?? 200 },
        timeZone,
        requestModifiers,
        sessionId
      )
    ),
    settle("OnGuard", searchOnGuardEvents(badgeArgs, timeZone, requestModifiers, sessionId)),
    settle("Elements", searchElementsEvents(badgeArgs, timeZone, requestModifiers, sessionId)),
    settle("NetBox", searchNetboxEvents(badgeArgs, timeZone, requestModifiers, sessionId)),
  ]);

  const allTaps: BadgeTap[] = [
    ...(rh?.events ?? []).map((e) => ({
      integration: "Rhombus" as const,
      timestampMs: e.timestampMs,
      datetime: e.datetime,
      cardholderName: e.cardholderName,
      cameraUuids: e.cameraUuids,
      locationUuid: e.locationUuid,
      area: e.doorName,
      doorUuid: e.doorUuid,
      granted: e.granted,
    })),
    ...vendorTaps("OnGuard", og),
    ...vendorTaps("Elements", el),
    ...vendorTaps("NetBox", nb),
  ].sort((a, b) => a.timestampMs - b.timestampMs);

  const sourcesChecked: BadgeSource[] = (["Rhombus", "OnGuard", "Elements", "NetBox"] as const).filter(
    (s) => !sourceErrors.some((e) => e.source === s)
  );
  const badgeEvents = allTaps.slice(0, MAX_BADGE_EVENTS_OUT).map((t) => ({
    integration: t.integration,
    datetime: t.datetime,
    timestampMs: t.timestampMs,
    cardholderName: t.cardholderName,
    area: t.area,
    doorUuid: t.doorUuid,
    cameraUuid: t.cameraUuids[0],
    granted: t.granted,
  }));
  const context = { badgeEvents, sourcesChecked, ...(sourceErrors.length ? { sourceErrors } : {}) };
  const failedNote = sourceErrors.length
    ? ` These sources could NOT be checked (unknown, not zero): ${sourceErrors.map((e) => `${e.source} (${e.error})`).join("; ")}.`
    : "";

  if (allTaps.length === 0) {
    return {
      sightings: [],
      path: [],
      count: 0,
      ...context,
      note: `No access-control (badge) events found for "${args.personQuery}" in the window. Checked: ${sourcesChecked.join(", ") || "none"}.${failedNote} Try a wider time range, or confirm the name as it appears on the badge / Rhombus user.`,
    };
  }

  // Earliest granted tap with a camera — track forward from there. A denied tap is still the
  // person at the door, so fall back to it before giving up.
  const anchorable = allTaps.filter((t) => t.cameraUuids.length > 0);
  const anchor = anchorable.find((t) => t.granted) ?? anchorable[0];
  if (!anchor) {
    const first = allTaps[0];
    return {
      resolvedPerson: first.cardholderName ? { name: first.cardholderName } : undefined,
      sightings: [],
      path: [],
      count: 0,
      ...context,
      note: `Found ${allTaps.length} badge event(s) for ${first.cardholderName ?? `"${args.personQuery}"`} (first at ${first.area ?? "an unnamed door"}, ${first.datetime}), but none of those doors has an associated camera, so no re-id track can be built. Report the badge events themselves (badgeEvents) — do NOT say the person has no badge events.${failedNote}`,
    };
  }

  const resolvedPerson = anchor.cardholderName ? { name: anchor.cardholderName } : undefined;
  const anchorCamera = anchor.cameraUuids[0];
  const anchorOut = {
    deviceUuid: anchorCamera,
    timestampMs: anchor.timestampMs,
    datetime: anchor.datetime,
    integration: anchor.integration,
    area: anchor.area,
    doorUuid: anchor.doorUuid,
  };

  // 2. Resolve the badge camera's location (re-id list is scoped by location).
  let anchorLocationUuid = anchor.locationUuid;
  if (!anchorLocationUuid) {
    try {
      const { cameras } = await getCameraList(requestModifiers, sessionId);
      const dev = stripFacet(anchorCamera);
      anchorLocationUuid = (cameras as Array<{ uuid?: string; locationUuid?: string }>).find(
        (c) => stripFacet(c.uuid) === dev
      )?.locationUuid;
    } catch {
      // best-effort; the re-id list can still run device-scoped without a location
    }
  }

  // 3. Ground the re-id embedding: the person detected on that camera nearest the badge tap.
  const winMs = (args.badgeMatchWindowSeconds ?? DEFAULT_BADGE_MATCH_WINDOW_S) * 1000;
  const anchorMs = anchor.timestampMs;
  // Re-id search is location-scoped server-side (the video-search service rejects a null
  // locationUuid), so a track needs the badge door's location when the caller gave none.
  const trackLocationUuid = args.locationUuids?.[0] ?? anchorLocationUuid;
  // The badge taps are already confirmed; a re-id failure must not hide them.
  const reidFailed = (step: string, e: unknown) => ({
    resolvedPerson,
    anchor: anchorOut,
    sightings: [],
    path: [],
    count: 0,
    ...context,
    note: `Found ${anchor.cardholderName ?? "the person"}'s badge tap at ${anchor.area ?? "the door"} (${anchor.datetime}), but the re-id ${step} failed (${e instanceof Error ? e.message : String(e)}), so no cross-camera track could be built. Report the badge events themselves (badgeEvents) — do NOT say the person has no badge events.`,
  });
  if (!trackLocationUuid) {
    return reidFailed("lookup", new Error("the badge door's location could not be resolved"));
  }

  let embeddings: Awaited<ReturnType<typeof listReidentificationEmbeddings>>;
  try {
    embeddings = await listReidentificationEmbeddings(
      {
        deviceUuids: anchor.cameraUuids,
        locationUuid: trackLocationUuid,
        startTimestampMs: anchorMs - winMs,
        endTimestampMs: anchorMs + winMs,
        limit: 100,
      },
      requestModifiers,
      sessionId
    );
  } catch (e) {
    return reidFailed("embedding lookup at the door", e);
  }

  if (embeddings.length === 0) {
    return {
      resolvedPerson,
      anchor: anchorOut,
      sightings: [],
      path: [],
      count: 0,
      ...context,
      note: `Found ${anchor.cardholderName ?? "the person"}'s badge tap at ${anchor.datetime}, but no person re-identification embedding was recorded on the door camera within ±${args.badgeMatchWindowSeconds ?? DEFAULT_BADGE_MATCH_WINDOW_S}s — can't build a re-id track. (Re-id needs human-detection coverage on the door camera.) Report the badge events themselves (badgeEvents).`,
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
      ...context,
      note: "The re-id detection at the door had no embedding vector; can't search for matches. Report the badge events themselves (badgeEvents).",
    };
  }

  // 4. Re-id search that appearance across cameras over the window.
  const searchStart = args.afterMs ?? anchorMs;
  const searchEnd = args.beforeMs ?? anchorMs + DEFAULT_TRACK_FORWARD_MS;
  let matches: Awaited<ReturnType<typeof searchReidentificationMatchesByEmbedding>>;
  try {
    matches = await searchReidentificationMatchesByEmbedding(
      {
        searchEmbedding: seed.embedding,
        locationUuid: trackLocationUuid,
        startTimestampMs: searchStart,
        endTimestampMs: searchEnd,
        limit: args.limit ?? 200,
      },
      requestModifiers,
      sessionId
    );
  } catch (e) {
    return reidFailed("search across cameras", e);
  }

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
    ...context,
  };
}
