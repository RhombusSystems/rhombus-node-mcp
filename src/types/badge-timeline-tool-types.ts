import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

/**
 * Description shared by the three badge-timeline tools (OnGuard / Elements /
 * NetBox), which differ only in vendor. Kept short because tool descriptions
 * are billed on every LLM call even while deferred, and this text is
 * duplicated across all three siblings; the how-to-present guidance lives on
 * the arguments below. See PERF_MASTER_PLAN P2 #4a.
 */
export function buildBadgeTimelineToolDescription(vendor: string): string {
  return `
Reconstructs one person's movements through a building from their ${vendor} badge taps. Use this for incident reconstruction / "follow the badge" requests, e.g. "reconstruct Eve's movements yesterday" or "where did this cardholder go".

Returns the cardholder's badge taps in CHRONOLOGICAL order (oldest first) — datetime, the area entered, deviceUuid of the camera at that door, clip/still hints, and gapToNextSeconds (a large gap means unobserved movement between doors) — plus a "path" array summarizing the areas traversed in order.
`;
}

export const TOOL_ARGS = {
  cardholderQuery: z
    .string()
    .describe(
      'The cardholder (person) to reconstruct, full-text name match, e.g. "Eve" or "Eve Adams". If the response contains "ambiguousCardholders" the query matched more than one person — ask the user which one before trusting the timeline.'
    ),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Optional: restrict to these Rhombus location UUIDs. Use the location-tool to resolve names."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe(
      'Start of the window (inclusive). Resolve relative phrasing like "yesterday" with time-tool first, then pass ISO 8601 here. ' +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
  clipPaddingSeconds: z
    .number()
    .nullable()
    .describe(
      "Seconds of video before/after each badge tap to include in the clip hint (default 15). To show the movement visually after this returns: for each stop (or the key transitions) call camera-tool (requestType \"image\", cameraUuid = stop.deviceUuid, timestampISO = the stop's time — convert stop.timestampMs with time-conversion-tool) for a still, and/or clips-tool (requestType \"createClip\", using stop.clipHint) for video. Issue those per-stop media calls IN PARALLEL, then present the timeline as a chronological narrative."
    ),
  limit: z.number().nullable().describe("Maximum badge taps to include (default 200)."),
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
  .describe("Pass to clips-tool createClip to get video of this tap.");

const StillHintSchema = z
  .object({
    deviceUuid: z.string(),
    timestampMs: z.number(),
  })
  .describe("Pass to camera-tool (requestType image) to get a still of this tap.");

export const BadgeTimelineStopSchema = z.object({
  timestampMs: z.number().optional(),
  datetime: z.string().optional().describe("Human-readable tap time in the requested timezone."),
  deviceUuid: z
    .string()
    .optional()
    .describe("The camera at this door. Pass to camera-tool (image) or clips-tool (createClip)."),
  area: z.string().optional().describe("The area entered (or exited) at this tap."),
  label: z.string().optional(),
  isAnomaly: z.boolean().optional().describe("True if this tap was an alerting/anomalous event."),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
  gapToNextSeconds: z
    .number()
    .optional()
    .describe("Seconds until the next tap — large gaps are unobserved movement between doors."),
});

export const OUTPUT_SCHEMA = z.object({
  cardholderName: z.string().optional().describe("The resolved cardholder name."),
  ambiguousCardholders: z
    .array(z.string())
    .optional()
    .describe("Set when the query matched more than one person — disambiguate with the user before trusting the timeline."),
  stops: z
    .array(BadgeTimelineStopSchema)
    .optional()
    .describe("The cardholder's badge taps in chronological order (oldest first)."),
  path: z.array(z.string()).optional().describe("Areas traversed, in order (consecutive repeats collapsed)."),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
