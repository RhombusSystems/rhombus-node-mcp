import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

/**
 * Description shared by the three lost-badge tools (OnGuard / Elements /
 * NetBox), which differ only in vendor. Kept short because tool descriptions
 * are billed on every LLM call even while deferred, and this text is
 * duplicated across all three siblings; presentation guidance and the
 * reliability caveat live on the arguments below. See PERF_MASTER_PLAN P2 #4a.
 */
export function buildLostBadgeToolDescription(vendor: string): string {
  return `
Lost / stolen-badge live response for ${vendor} access. Use for "a lost badge was just used — who is it and where did they go?", or to review lost/inactive-badge use over a window.

For each lost/inactive-badge use it returns cardholderOfRecord (who the badge belongs to — may NOT be who used it) and badgeStatus, the door deviceUuid + time with clip/still hints, facesAtDoor (the face captured at the door — a recognized name, or UNIDENTIFIED, which on a valid badge is the strongest stolen/shared-badge signal), and sightings of that same face tracked across cameras in time order, ending in lastKnownSighting.
`;
}

export const TOOL_ARGS = {
  area: z.string().nullable().describe("Optional: restrict to events entering this area (full-text)."),
  locationUuids: z.array(createUuidSchema()).nullable().describe("Optional: restrict to these location UUIDs."),
  deviceUuids: z.array(createUuidSchema()).nullable().describe("Optional: restrict to these camera UUIDs."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe(
      'Start of the window to scan for lost/inactive-badge use (inclusive). Resolve relative phrasing like "in the last hour" with time-tool first, then pass ISO 8601 here. ' +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
  faceWindowSeconds: z
    .number()
    .nullable()
    .describe(
      "± seconds around each badge event to look for the face at the door (default 30). To present the result: show the door still/clip (camera-tool requestType \"image\" / clips-tool \"createClip\" with the returned hints), the face at the door, and the cross-camera track to the last-known location. Detection and door evidence are reliable; the face track depends on face-recognition coverage, so treat it as investigative, not proof."
    ),
  limit: z.number().nullable().describe("Max badge events to scan in the window (default 50)."),
  timeZone: z
    .string()
    .nullable()
    .describe("IANA timezone for formatting times, e.g. America/New_York. Defaults to UTC."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ClipHintSchema = z.object({ deviceUuid: z.string(), startTimeMs: z.number(), endTimeMs: z.number() });
const StillHintSchema = z.object({ deviceUuid: z.string(), timestampMs: z.number() });

const FaceAtDoorSchema = z.object({
  faceName: z.string().optional().describe('Recognized name, or absent/UNIDENTIFIED if no enrolled match.'),
  personUuid: z.string().optional(),
  thumbnailS3Key: z.string().optional().describe("Face crop thumbnail key for display."),
  faceEventUuid: z.string().optional(),
  eventTimestamp: z.string().optional(),
});

const SightingSchema = z.object({
  deviceUuid: z.string().optional().describe("Camera where the same face was seen."),
  datetime: z.string().optional(),
  timestampMs: z.number().optional(),
  similarity: z.number().optional(),
  personUuid: z.string().optional(),
});

export const LostBadgeIncidentSchema = z.object({
  cardholderOfRecord: z.string().optional().describe("The cardholder the badge is registered to (may not be who used it)."),
  badgeStatus: z.string().optional(),
  datetime: z.string().optional(),
  timestampMs: z.number().optional(),
  deviceUuid: z.string().optional().describe("Door camera. Pass to camera-tool (image) / clips-tool (createClip)."),
  area: z.string().optional(),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
  facesAtDoor: z.array(FaceAtDoorSchema).optional().describe("Face(s) captured at the door at the time of use."),
  sightings: z
    .array(SightingSchema)
    .optional()
    .describe("Same face seen across cameras, ordered in time — the track after the door."),
  lastKnownSighting: z
    .object({ deviceUuid: z.string().optional(), datetime: z.string().optional() })
    .optional()
    .describe("Most recent sighting — the person's last-known location."),
});

export const OUTPUT_SCHEMA = z.object({
  incidents: z.array(LostBadgeIncidentSchema).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
