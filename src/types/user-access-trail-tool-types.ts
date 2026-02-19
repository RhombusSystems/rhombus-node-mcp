import { z } from "zod";

export enum UserAccessTrailRequestType {
  GET_ACCESS_EVENTS_BY_USER = "get-access-events-by-user",
  GET_ACCESS_EVENTS_BY_EMAIL = "get-access-events-by-email",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(UserAccessTrailRequestType)
    .describe("The type of access trail request."),
  userUuid: z
    .string()
    .nullable()
    .describe("User UUID. Required for 'get-access-events-by-user'."),
  email: z
    .string()
    .nullable()
    .describe("User email address. Required for 'get-access-events-by-email'. Will resolve to userUuid automatically."),
  startTimeMs: z
    .number()
    .nullable()
    .describe("Start time filter in milliseconds since epoch."),
  endTimeMs: z
    .number()
    .nullable()
    .describe("End time filter in milliseconds since epoch."),
  limit: z
    .number()
    .nullable()
    .describe("Maximum number of events to return. Defaults to 100."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const AccessEventSchema = z.object({
  eventUuid: z.string().optional(),
  eventType: z.string().optional(),
  timestampMs: z.number().optional(),
  locationUuid: z.string().optional(),
  componentUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  authorizationResult: z.string().optional(),
  authenticationResult: z.string().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  userUuid: z.string().optional().describe("Resolved user UUID"),
  userName: z.string().optional().describe("Resolved user name"),
  accessEvents: z
    .array(AccessEventSchema)
    .optional()
    .describe("List of access control events for the user, ordered by time"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
