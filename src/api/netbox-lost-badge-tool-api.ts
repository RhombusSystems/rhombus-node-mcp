import { buildMediaHints, type ClipHint, type StillHint } from "./badge-correlation.js";
import { searchNetboxEvents } from "./netbox-tool-api.js";
import { getFaceEvents, searchSimilarFaces } from "./faces-tool-api.js";
import type { RequestModifiers } from "../util.js";

export interface GetNetboxLostBadgeResponseArgs {
  area?: string;
  locationUuids?: string[];
  deviceUuids?: string[];
  afterMs?: number;
  beforeMs?: number;
  faceWindowSeconds?: number;
  limit?: number;
}

interface FaceAtDoor {
  faceName?: string;
  personUuid?: string;
  thumbnailS3Key?: string;
  faceEventUuid?: string;
  eventTimestamp?: string;
}
interface Sighting {
  deviceUuid?: string;
  datetime?: string;
  timestampMs?: number;
  similarity?: number;
  personUuid?: string;
}
interface LostBadgeIncident {
  cardholderOfRecord?: string;
  badgeStatus?: string;
  datetime?: string;
  timestampMs?: number;
  deviceUuid?: string;
  area?: string;
  clipHint?: ClipHint;
  stillHint?: StillHint;
  facesAtDoor: FaceAtDoor[];
  sightings: Sighting[];
  lastKnownSighting?: { deviceUuid?: string; datetime?: string };
}

/**
 * Lost / stolen-badge live response for Lenel S2 NetBox. Finds recent lost/inactive-badge use, and for
 * each: the door clip/still, the face captured at the door (identified or UNIDENTIFIED), and a cross-camera
 * track of that same face (via similar-face search) ordered to a last-known location. Detection + door
 * evidence are exact; the track is best-effort (depends on face capture + recognition coverage).
 */
export async function getNetboxLostBadgeResponse(
  args: GetNetboxLostBadgeResponseArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ incidents: LostBadgeIncident[]; count: number }> {
  const scope = { area: args.area, locationUuids: args.locationUuids, deviceUuids: args.deviceUuids };
  const { events } = await searchNetboxEvents(
    { ...scope, anomalyOnly: true, afterMs: args.afterMs, beforeMs: args.beforeMs, limit: args.limit ?? 50 },
    timeZone,
    requestModifiers,
    sessionId
  );

  // anomalyOnly returns lost-badge AND no-entry anomalies; keep the lost/inactive-badge ones. NetBox
  // credentialStatus uses values like Lost/Stolen/Terminated — anything that isn't "active".
  const lostEvents = events.filter((e) => e.badgeStatus && e.badgeStatus.toLowerCase() !== "active");
  const winMs = (args.faceWindowSeconds ?? 30) * 1000;

  const incidents: LostBadgeIncident[] = [];
  for (const e of lostEvents) {
    const { clipHint, stillHint } = buildMediaHints({ deviceUuid: e.deviceUuid, timestampMs: e.timestampMs });
    let facesAtDoor: FaceAtDoor[] = [];
    let sightings: Sighting[] = [];

    if (e.deviceUuid && e.timestampMs != null) {
      try {
        // Face(s) at the door: query by time window (the faces tool can't filter by device), then match
        // the door camera client-side.
        const { faceEvents } = await getFaceEvents(
          {
            pageRequest: { lastEvaluatedKey: null, maxPageSize: 75 },
            searchFilter: {
              faceNameContains: null,
              faceNames: [],
              hasEmbedding: null,
              hasName: null,
              labels: [],
              locationUuids: [],
              personUuids: [],
              timestampFilter: {
                rangeStart: new Date(e.timestampMs - winMs).toISOString(),
                rangeEnd: new Date(e.timestampMs + winMs).toISOString(),
              },
            },
          },
          timeZone,
          requestModifiers,
          sessionId
        );
        facesAtDoor = faceEvents
          .filter((f) => f.deviceUuid === e.deviceUuid)
          .map((f) => ({
            faceName: f.faceName ?? undefined,
            personUuid: f.personUuid ?? undefined,
            thumbnailS3Key: f.thumbnailS3Key ?? undefined,
            faceEventUuid: f.uuid ?? undefined,
            eventTimestamp: f.eventTimestamp,
          }));

        // Track that face across cameras, ordered in time.
        const seed = facesAtDoor.find((f) => f.faceEventUuid);
        if (seed?.faceEventUuid) {
          const similar = await searchSimilarFaces(seed.faceEventUuid, timeZone, requestModifiers, sessionId);
          sightings = similar
            .map((s) => ({
              deviceUuid: s.deviceUuid,
              datetime: s.eventTimestamp,
              timestampMs: s.eventTimestampMs,
              similarity: s.similarity,
              personUuid: s.personUuid,
            }))
            .sort((a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0));
        }
      } catch {
        // Face enrichment is best-effort — never fail the whole response over it.
      }
    }

    const last = sightings.length ? sightings[sightings.length - 1] : undefined;
    incidents.push({
      cardholderOfRecord: e.cardholderName,
      badgeStatus: e.badgeStatus,
      datetime: e.datetime,
      timestampMs: e.timestampMs,
      deviceUuid: e.deviceUuid,
      area: e.areaEntering ?? e.areaExiting,
      clipHint,
      stillHint,
      facesAtDoor,
      sightings,
      lastKnownSighting: last ? { deviceUuid: last.deviceUuid, datetime: last.datetime } : undefined,
    });
  }

  return { incidents, count: incidents.length };
}
