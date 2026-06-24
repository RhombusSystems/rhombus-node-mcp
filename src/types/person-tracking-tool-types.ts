import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  personQuery: z
    .string()
    .nullable()
    .describe(
      'The recognized person to track, full-text name match against registered faces, e.g. "Eve" or "Eve Adams". ' +
        "Provide this OR personUuid OR faceEventUuid."
    ),
  personUuid: z
    .string()
    .nullable()
    .describe("The exact person UUID to track (from faces-tool get-registered-faces). Takes precedence over personQuery."),
  faceEventUuid: z
    .string()
    .nullable()
    .describe(
      "Track by appearance from a specific face sighting (a faceEvent UUID), even when the person isn't a registered/named face. " +
        "Use this for 'track THIS person' from a sighting. Takes precedence over personQuery/personUuid."
    ),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Optional: restrict to these Rhombus location UUIDs. Use the location-tool to resolve names."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Start of the window (inclusive). " + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
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
  .object({
    deviceUuid: z.string(),
    startTimeMs: z.number(),
    endTimeMs: z.number(),
  })
  .describe("Pass to clips-tool createClip to get video of this sighting.");

const StillHintSchema = z
  .object({
    deviceUuid: z.string(),
    timestampMs: z.number(),
  })
  .describe("Pass to camera-tool (requestType image) to get a still of this sighting.");

const PersonRefSchema = z.object({
  name: z.string().optional(),
  personUuid: z.string().optional(),
});

export const SightingSchema = z.object({
  timestampMs: z.number().optional(),
  datetime: z.string().optional().describe("Human-readable sighting time in the requested timezone."),
  deviceUuid: z
    .string()
    .optional()
    .describe("The camera that saw the person. Pass to camera-tool (image) or clips-tool (createClip)."),
  locationUuid: z.string().optional().describe("The location where the sighting occurred."),
  faceName: z.string().optional().describe("The recognized name on this sighting, if any."),
  similarity: z
    .number()
    .optional()
    .describe("Appearance-match similarity (0-1) when tracking from a faceEventUuid seed."),
  thumbnailS3Key: z.string().optional().describe("Thumbnail key for the detected face on this sighting."),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
  gapToNextSeconds: z
    .number()
    .optional()
    .describe("Seconds until the next sighting — large gaps mean the person was unobserved between cameras."),
});

export const OUTPUT_SCHEMA = z.object({
  resolvedPerson: PersonRefSchema.optional().describe("The person actually tracked (name + UUID), when resolved."),
  ambiguousPeople: z
    .array(PersonRefSchema)
    .optional()
    .describe("Set when personQuery matched more than one registered person — disambiguate with the user before trusting the track."),
  sightings: z
    .array(SightingSchema)
    .optional()
    .describe("The person's camera sightings in chronological order (oldest first)."),
  path: z
    .array(z.string())
    .optional()
    .describe("Camera UUIDs the person passed through, in order (consecutive repeats collapsed)."),
  lastKnownSighting: SightingSchema.optional().describe("The most recent sighting — the person's last-known location."),
  count: z.number().optional().describe("Number of sightings returned."),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
