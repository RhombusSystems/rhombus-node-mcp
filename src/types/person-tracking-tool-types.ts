import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  personQuery: z
    .string()
    .describe(
      'The person to track, full-text name match against their access-control (badge) records, e.g. "Brandon" or "Brandon Salzberg".'
    ),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Start of the window to search badge taps and track over (inclusive). " + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Optional: restrict badge search and the re-id track to these Rhombus location UUIDs."),
  badgeMatchWindowSeconds: z
    .number()
    .nullable()
    .describe(
      "± seconds around the badge tap to look on the door camera for the person's re-id embedding (default 30)."
    ),
  clipPaddingSeconds: z
    .number()
    .nullable()
    .describe("Seconds of video before/after each sighting to include in the clip hint (default 15)."),
  limit: z.number().nullable().describe("Maximum sightings to include (default 200)."),
  timeZone: z
    .string()
    .nullable()
    .describe("IANA timezone used to format times, e.g. America/New_York. Defaults to UTC."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ClipHintSchema = z
  .object({ deviceUuid: z.string(), startTimeMs: z.number(), endTimeMs: z.number() })
  .describe("Pass to clips-tool createClip to get video of this sighting.");

const StillHintSchema = z
  .object({ deviceUuid: z.string(), timestampMs: z.number() })
  .describe("Pass to camera-tool (requestType image) to get a still of this sighting.");

export const SightingSchema = z.object({
  timestampMs: z.number().optional(),
  datetime: z.string().optional().describe("Human-readable sighting time in the requested timezone."),
  deviceUuid: z.string().optional().describe("The camera that re-identified the person."),
  locationUuid: z.string().optional(),
  distance: z
    .number()
    .optional()
    .describe("Re-id match distance to the door embedding — LOWER means a closer appearance match."),
  stableTrackId: z.number().optional().describe("Per-camera track-consolidation id for this detection."),
  thumbnailUri: z.string().optional().describe("Thumbnail of the detected person."),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
  gapToNextSeconds: z
    .number()
    .optional()
    .describe("Seconds until the next sighting — large gaps mean the person was unobserved between cameras."),
});

const AnchorSchema = z
  .object({
    deviceUuid: z.string().optional().describe("The door camera where the badge tap happened."),
    timestampMs: z.number().optional(),
    datetime: z.string().optional(),
    integration: z.string().optional().describe("Which badge system the tap came from (OnGuard / Elements / NetBox)."),
    area: z.string().optional(),
  })
  .describe("The access-control badge tap used to ground the re-id track (the known identity moment).");

export const OUTPUT_SCHEMA = z.object({
  resolvedPerson: z
    .object({ name: z.string().optional() })
    .optional()
    .describe("The person resolved from the badge record."),
  anchor: AnchorSchema.optional(),
  sightings: z
    .array(SightingSchema)
    .optional()
    .describe("Re-id sightings of the person across cameras, in chronological order (oldest first)."),
  path: z
    .array(z.string())
    .optional()
    .describe("Camera UUIDs the person was re-identified at, in order (consecutive repeats collapsed)."),
  lastKnownSighting: SightingSchema.optional().describe("The most recent re-id sighting — last-known location."),
  count: z.number().optional().describe("Number of re-id sightings returned."),
  note: z.string().optional().describe("Set when the track couldn't be built (no badge tap, or no re-id at the door)."),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
