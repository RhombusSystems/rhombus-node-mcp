import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  area: z.string().nullable().describe("Optional: restrict to events entering this area (full-text)."),
  locationUuids: z.array(createUuidSchema()).nullable().describe("Optional: restrict to these location UUIDs."),
  deviceUuids: z.array(createUuidSchema()).nullable().describe("Optional: restrict to these camera UUIDs."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Start of the window to scan for lost/inactive-badge use (inclusive). " + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
  faceWindowSeconds: z
    .number()
    .nullable()
    .describe("± seconds around each badge event to look for the face at the door (default 30)."),
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
