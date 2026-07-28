import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const ANOMALY_RULES = [
  "lost_or_inactive_badge",
  "entry_not_made",
  "off_hours",
  "impossible_travel",
  "area_novelty",
] as const;

/**
 * Description shared by the three access-anomaly tools (OnGuard / Elements /
 * NetBox), which differ only in vendor. Kept short because tool descriptions
 * are billed on every LLM call even while deferred, and this text is
 * duplicated across all three siblings; rule detail and triage guidance live
 * on the arguments below. See PERF_MASTER_PLAN P2 #4a.
 */
export function buildAccessAnomalyToolDescription(vendor: string): string {
  return `
Scans ${vendor} access events over a time window and flags anomalous badge activity. Use for "find unusual badge activity", "anything suspicious in access this week", or proactive access review.

Runs deterministic rules — a lost/suspended badge was used, access granted but no entry made (possible tailgating), off-hours entry, impossible travel between areas, and first-ever entry to an area — and returns ranked findings (high severity first) with cardholderName, the rule, severity, datetime, area, the camera deviceUuid, a plain-language rationale, and clip/still hints.
`;
}

export const TOOL_ARGS = {
  area: z.string().nullable().describe("Optional: restrict analysis to events entering this area (full-text)."),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Optional: restrict to these Rhombus location UUIDs."),
  deviceUuids: z.array(createUuidSchema()).nullable().describe("Optional: restrict to these camera UUIDs."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe(
      'Start of the window to analyze (inclusive). Resolve relative phrasing like "this week" with time-tool first, then pass ISO 8601 here. ' +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window to analyze (inclusive). " + ISOTimestampFormatDescription),
  rules: z
    .array(z.enum(ANOMALY_RULES))
    .nullable()
    .describe(
      "Which rules to run; default all. Options: lost_or_inactive_badge (a non-active badge — lost or suspended — was used), " +
        "entry_not_made (access granted but no entry made, possible tailgating), off_hours (entry outside business hours, configurable), " +
        "impossible_travel (one cardholder at two different areas seconds apart), area_novelty (a cardholder's first-ever entry to an area vs their prior history; needs a baseline window). " +
        "This tool is a triage aid: present findings grouped by severity, and for the notable ones call camera-tool " +
        '(requestType "image", cameraUuid = finding.deviceUuid, timestampISO = the finding\'s time — convert finding.timestampMs with time-conversion-tool) ' +
        'and/or clips-tool ("createClip" using finding.clipHint) IN PARALLEL so a human can confirm. Do not assert wrongdoing; surface the evidence.'
    ),
  baselineDays: z
    .number()
    .nullable()
    .describe("Days of prior history used to learn each person's normal areas for area_novelty (default 30; 0 disables it)."),
  offHoursStartHour: z
    .number()
    .nullable()
    .describe("Local business-hours start hour 0–23; entries before it are off-hours (default 7)."),
  offHoursEndHour: z
    .number()
    .nullable()
    .describe("Local business-hours end hour 0–23; entries at/after it are off-hours (default 19)."),
  impossibleTravelMaxSeconds: z
    .number()
    .nullable()
    .describe("Max seconds between two different-area taps by one person to flag impossible travel (default 30)."),
  limit: z.number().nullable().describe("Max events to analyze in the window (default 500)."),
  timeZone: z
    .string()
    .nullable()
    .describe("IANA timezone for hour-of-day checks and formatting, e.g. America/New_York. Defaults to UTC."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ClipHintSchema = z.object({ deviceUuid: z.string(), startTimeMs: z.number(), endTimeMs: z.number() });
const StillHintSchema = z.object({ deviceUuid: z.string(), timestampMs: z.number() });

export const AnomalyFindingSchema = z.object({
  cardholderName: z.string().optional(),
  rule: z.string().describe("Which rule fired."),
  severity: z.string().describe('"high" or "medium".'),
  datetime: z.string().optional(),
  timestampMs: z.number().optional(),
  deviceUuid: z.string().optional().describe("Camera at the event. Pass to camera-tool (image) / clips-tool (createClip)."),
  area: z.string().optional(),
  rationale: z.string().describe("Plain-language explanation of why this was flagged."),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
});

export const OUTPUT_SCHEMA = z.object({
  findings: z
    .array(AnomalyFindingSchema)
    .optional()
    .describe("Anomalies, ranked high severity first then most-recent."),
  eventsAnalyzed: z.number().optional(),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
