import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  area: z
    .string()
    .nullable()
    .describe('Filter to events whose entered area matches this, e.g. "back office". Full-text match.'),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Filter to these Rhombus location UUIDs. Use the location-tool to resolve names to UUIDs."),
  deviceUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Filter to these camera UUIDs (the camera that saw the badge event)."),
  cardholderQuery: z
    .string()
    .nullable()
    .describe("Match the cardholder's name (full-text), e.g. a person you are looking for."),
  badgeStatus: z.string().nullable().describe("Filter by badge status, e.g. Active or Lost."),
  badgeType: z.string().nullable().describe("Filter by badge type."),
  anomalyOnly: z
    .boolean()
    .nullable()
    .describe(
      "Only return anomaly events: an inactive/lost badge was used, or access was granted but no entry was made (possible tailgating)."
    ),
  entryMade: z
    .boolean()
    .nullable()
    .describe("Filter by whether access was granted AND entry was actually made."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Only events at or after this time (inclusive). " + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Only events at or before this time (inclusive). " + ISOTimestampFormatDescription),
  limit: z
    .number()
    .nullable()
    .describe("Maximum number of events to return (default 200; the server caps at 1000)."),
  timeZone: z
    .string()
    .nullable()
    .describe("IANA timezone used to format event times, e.g. America/New_York. Defaults to UTC."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OnGuardEventSchema = z.object({
  timestampMs: z.number().optional(),
  datetime: z.string().optional().describe("Human-readable event time in the requested timezone."),
  deviceUuid: z
    .string()
    .optional()
    .describe(
      "The camera that saw this event. Pass to camera-tool (requestType image) or clips-tool (createClip) to get a still/video."
    ),
  label: z.string().optional().describe('Event label, e.g. "OnGuard: Badge Authorized" or an anomaly label.'),
  cardholderName: z.string().optional().describe("The cardholder (person) name."),
  badgeStatus: z.string().optional(),
  badgeType: z.string().optional(),
  areaEntering: z.string().optional(),
  areaExiting: z.string().optional(),
  entryMade: z.boolean().optional(),
  isAnomaly: z.boolean().optional().describe("True if this is an alerting/anomalous event."),
});

export const OUTPUT_SCHEMA = z.object({
  events: z.array(OnGuardEventSchema).optional(),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
