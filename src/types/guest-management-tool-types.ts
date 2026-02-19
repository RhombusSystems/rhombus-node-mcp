import { z } from "zod";

export enum GuestManagementRequestType {
  GET_ALL_GUESTS = "get-all-guests",
  GET_ACTIVITY_LOGS = "get-activity-logs",
  GET_ACTIVITIES_FOR_LOCATION = "get-activities-for-location",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(GuestManagementRequestType)
    .describe("The type of guest management request to make."),
  locationUuid: z
    .string()
    .nullable()
    .describe("Location UUID. Required for 'get-activities-for-location'."),
  startTimeMs: z
    .number()
    .nullable()
    .describe("Start time filter in milliseconds since epoch. Optional for activity queries."),
  endTimeMs: z
    .number()
    .nullable()
    .describe("End time filter in milliseconds since epoch. Optional for activity queries."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const GuestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
  locationUuid: z.string().optional(),
  hostUserUuid: z.string().optional(),
  guestType: z.string().optional(),
  checkedInStatus: z.string().optional(),
  lastCheckedInMs: z.number().optional(),
  lastCheckedOutMs: z.number().optional(),
  phoneNumber: z.string().optional(),
});

const GuestActivitySchema = z.object({
  activity: z.string().optional(),
  email: z.string().optional(),
  guestType: z.string().optional(),
  locationUuid: z.string().optional(),
  hostUserUuid: z.string().optional(),
  timestampMs: z.number().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  guests: z.array(GuestSchema).optional().describe("List of guests in the organization"),
  activities: z
    .array(GuestActivitySchema)
    .optional()
    .describe("List of guest activity log entries"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
