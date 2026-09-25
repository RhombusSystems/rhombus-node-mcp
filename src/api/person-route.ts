import { buildMediaHints, type ClipHint, type StillHint } from "./badge-correlation.js";
import { formatTimestamp } from "../util.js";

/**
 * Turns a person-tracking result into the route the user actually asked for: the badge tap, then
 * each camera the person was re-identified at, in order. Consecutive sightings on one camera are one
 * visit, so a 200-hit re-id result becomes a handful of stops the model can list in full and the chat
 * UI can render as a timeline (the chatbot lifts `route` into a person-route component verbatim).
 */

/** Stops per route, badge tap included. Past this the visits are sampled, first and last kept. */
export const MAX_ROUTE_STOPS = 20;

export interface RouteSighting {
  deviceUuid?: string;
  timestampMs?: number;
  locationUuid?: string;
  distance?: number;
  thumbnailUri?: string;
}

export interface RouteBadge {
  timestampMs: number;
  datetime?: string;
  cameraUuid?: string;
  doorUuid?: string;
  /** Door name (Rhombus) or area entered (vendor integrations). */
  area?: string;
  locationUuid?: string;
  integration: string;
}

/** Doorbell cameras (DR40 intercoms) carry video too, but open on a different console page. */
export type RouteDeviceType = "camera" | "doorbell-camera";

export interface RouteCamera {
  name?: string;
  deviceType: RouteDeviceType;
}

export interface RouteStop {
  kind: "badge" | "camera";
  cameraUuid?: string;
  deviceType?: RouteDeviceType;
  cameraName?: string;
  locationUuid?: string;
  doorUuid?: string;
  doorName?: string;
  integration?: string;
  /** Arrival: the badge tap, or the visit's first sighting. */
  timestampMs: number;
  datetime?: string;
  /** The visit's last sighting; unset for a single sighting. */
  endTimestampMs?: number;
  endDatetime?: string;
  sightingCount?: number;
  /** The best-matching (lowest-distance) re-id crop of the visit. */
  thumbnailUri?: string;
  clipHint?: ClipHint;
  stillHint?: StillHint;
}

export interface PersonRoute {
  stops: RouteStop[];
  /** Stops before sampling (badge tap included). */
  totalStops: number;
  truncated: boolean;
}

/** RUUID without any `.vN` facet suffix, so camera ids match the camera list and console routes. */
export function stripFacet(uuid?: string): string {
  return (uuid ?? "").split(".")[0];
}

/** `count` indices spread evenly over [0, length), always including the first and last. */
function evenlySpacedIndices(length: number, count: number): number[] {
  if (count >= length) return Array.from({ length }, (_, i) => i);
  if (count <= 1) return [length - 1];
  const picked = new Set<number>();
  for (let k = 0; k < count; k++) picked.add(Math.round((k * (length - 1)) / (count - 1)));
  return [...picked].sort((a, b) => a - b);
}

export function buildPersonRoute(input: {
  badge: RouteBadge;
  sightings: RouteSighting[];
  cameras: Map<string, RouteCamera>;
  timeZone: string;
  clipPaddingSeconds?: number;
  /** Sightings this close before the tap still belong to the entry (the person at the door). */
  badgeLeadMs?: number;
  maxStops?: number;
}): PersonRoute {
  const { badge, cameras, timeZone, clipPaddingSeconds } = input;
  const maxStops = Math.max(2, input.maxStops ?? MAX_ROUTE_STOPS);
  const startMs = badge.timestampMs - (input.badgeLeadMs ?? 0);

  const badgeCamera = badge.cameraUuid ? stripFacet(badge.cameraUuid) : undefined;
  const badgeStop: RouteStop = {
    kind: "badge",
    cameraUuid: badgeCamera,
    ...describeCamera(cameras, badgeCamera),
    locationUuid: badge.locationUuid,
    doorUuid: badge.doorUuid,
    doorName: badge.area,
    integration: badge.integration,
    timestampMs: badge.timestampMs,
    datetime: badge.datetime ?? formatTimestamp(badge.timestampMs, timeZone),
    ...buildMediaHints({ deviceUuid: badgeCamera, timestampMs: badge.timestampMs }, clipPaddingSeconds),
  };

  // "Where did they go after they badged in": only what follows the tap.
  const ordered = input.sightings
    .filter((s): s is RouteSighting & { timestampMs: number; deviceUuid: string } =>
      s.timestampMs != null && !!s.deviceUuid && s.timestampMs >= startMs
    )
    .sort((a, b) => a.timestampMs - b.timestampMs);

  type Visit = { camera: string; first: RouteSighting & { timestampMs: number }; last: number; count: number; best: RouteSighting };
  const visits: Visit[] = [];
  for (const s of ordered) {
    const camera = stripFacet(s.deviceUuid);
    const open = visits[visits.length - 1];
    if (open && open.camera === camera) {
      open.last = s.timestampMs;
      open.count += 1;
      if ((s.distance ?? Infinity) < (open.best.distance ?? Infinity)) open.best = s;
    } else {
      visits.push({ camera, first: s, last: s.timestampMs, count: 1, best: s });
    }
  }

  const visitStops = visits.map((v): RouteStop => {
    const padMs = Math.max(0, clipPaddingSeconds ?? 15) * 1000;
    const { stillHint } = buildMediaHints({ deviceUuid: v.camera, timestampMs: v.first.timestampMs });
    return {
      kind: "camera",
      cameraUuid: v.camera,
      ...describeCamera(cameras, v.camera),
      locationUuid: v.first.locationUuid,
      timestampMs: v.first.timestampMs,
      datetime: formatTimestamp(v.first.timestampMs, timeZone),
      ...(v.last > v.first.timestampMs
        ? { endTimestampMs: v.last, endDatetime: formatTimestamp(v.last, timeZone) }
        : {}),
      sightingCount: v.count,
      thumbnailUri: v.best.thumbnailUri,
      clipHint: { deviceUuid: v.camera, startTimeMs: v.first.timestampMs - padMs, endTimeMs: v.last + padMs },
      stillHint,
    };
  });

  const kept = evenlySpacedIndices(visitStops.length, maxStops - 1).map((i) => visitStops[i]);
  return {
    stops: [badgeStop, ...kept],
    totalStops: visitStops.length + 1,
    truncated: kept.length < visitStops.length,
  };
}

function describeCamera(cameras: Map<string, RouteCamera>, uuid: string | undefined) {
  if (!uuid) return {};
  const camera = cameras.get(uuid);
  return { cameraName: camera?.name, deviceType: camera?.deviceType ?? "camera" };
}
