import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum AlarmMonitoringRequestType {
  ORG_STATUS = "org-status",
  GET_THREAT_CASES = "get-threat-cases",
  LOCATION_STATUS = "location-status",
  ENABLE_MONITORING = "enable-monitoring",
  DISABLE_MONITORING = "disable-monitoring",
  DISMISS_THREAT_CASE = "dismiss-threat-case",
  CANCEL_THREAT_CASE = "cancel-threat-case",
  ESCALATE_THREAT_CASE = "escalate-threat-case",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(AlarmMonitoringRequestType)
    .describe("The type of alarm monitoring request to make."),
  locationUuid: z
    .string()
    .nullable()
    .describe(
      "Location UUID. Required for 'location-status', 'enable-monitoring' and 'disable-monitoring'."
    ),
  pin: z
    .string()
    .nullable()
    .describe(
      "The location's alarm PIN, required for 'enable-monitoring' and 'disable-monitoring'. Ask the user for it; never guess one and never repeat it back in your response."
    ),
  threatCaseUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of a threat case. Required for 'dismiss-threat-case', 'cancel-threat-case' and 'escalate-threat-case'. Get it from 'get-threat-cases' — do not guess one."
    ),
  confirmAction: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'disable-monitoring' and 'escalate-threat-case'. Disabling monitoring stops a location being watched, and escalating dispatches a real alarm response, so both refuse without explicit confirmation from the user."
    ),
  startTimeMs: z
    .number()
    .nullable()
    .describe("Filter threat cases after this timestamp (ms since epoch). Optional for 'get-threat-cases'."),
  endTimeMs: z
    .number()
    .nullable()
    .describe("Filter threat cases before this timestamp (ms since epoch). Optional for 'get-threat-cases'."),
  maxResults: z
    .number()
    .nullable()
    .describe("Maximum number of threat cases to return. Optional for 'get-threat-cases'."),
  includeFields: INCLUDE_FIELDS_ARG,
  filterBy: FILTER_BY_ARG,
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const LocationMonitoringStatusSchema = z.object({
  locationUuid: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledOnMs: z.number().optional(),
  disabledOnMs: z.number().optional(),
  notEnabledReason: z.string().optional(),
});

const ThreatCaseSchema = z.object({
  uuid: z.string().optional(),
  status: z.string().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  deviceUuid: z.string().optional(),
  createdAtMillis: z.number().optional(),
  promptTitle: z.string().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  locationStatuses: z
    .array(LocationMonitoringStatusSchema)
    .optional()
    .describe("Alarm monitoring status for each location"),
  threatCases: z
    .array(ThreatCaseSchema)
    .optional()
    .describe("List of alarm monitoring threat cases"),
  locationDetail: LocationMonitoringStatusSchema.optional().describe(
    "Detailed alarm monitoring status for a single location"
  ),
  monitoringChange: z
    .object({
      success: z.boolean().optional(),
      locationUuid: z.string().optional(),
      enabled: z.boolean().optional(),
    })
    .optional()
    .describe("Result of 'enable-monitoring' / 'disable-monitoring'."),
  threatCaseChange: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      action: z.string().optional(),
    })
    .optional()
    .describe("Result of a threat case state change."),
  note: z
    .string()
    .optional()
    .describe("A caveat about this result that the user needs to be told."),
  warningMsg: z
    .string()
    .optional()
    .describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
