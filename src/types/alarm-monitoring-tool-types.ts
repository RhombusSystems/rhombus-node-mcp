import { z } from "zod";

export enum AlarmMonitoringRequestType {
  ORG_STATUS = "org-status",
  GET_THREAT_CASES = "get-threat-cases",
  LOCATION_STATUS = "location-status",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(AlarmMonitoringRequestType)
    .describe("The type of alarm monitoring request to make."),
  locationUuid: z
    .string()
    .nullable()
    .describe("Location UUID. Required for 'location-status'."),
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
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
