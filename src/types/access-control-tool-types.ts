import { z } from "zod";
import { createUuidSchema } from "../types.js";

export enum AccessControlRequestType {
  UNLOCK_DOOR = "unlock-door",
  GET_GROUPS = "get-groups",
  GET_CREDENTIALS_BY_USER = "get-credentials-by-user",
  GET_LOCKDOWN_PLANS = "get-lockdown-plans",
  ACTIVATE_LOCKDOWN = "activate-lockdown",
  DEACTIVATE_LOCKDOWN = "deactivate-lockdown",
  GET_DOOR_SCHEDULES = "get-door-schedules",
  GET_ACCESS_GRANTS = "get-access-grants",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(AccessControlRequestType).describe("The type of access control request to make."),
  doorUuid: z
    .string()
    .nullable()
    .describe("The UUID of the access controlled door. Required for 'unlock-door'."),
  userUuid: z
    .string()
    .nullable()
    .describe("The UUID of the user. Required for 'get-credentials-by-user'."),
  locationUuid: z
    .string()
    .nullable()
    .describe("The UUID of the location. Required for 'activate-lockdown', 'deactivate-lockdown', and 'get-door-schedules'."),
  lockdownPlanUuid: z
    .string()
    .nullable()
    .describe("The UUID of the lockdown plan. Required for 'activate-lockdown' and 'deactivate-lockdown'."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  unlockResult: z
    .object({
      success: z.boolean().optional(),
      doorUuid: z.string().optional(),
    })
    .optional()
    .describe("Result of unlocking a door"),
  accessControlGroups: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        orgUuid: z.string().optional(),
        userUuids: z.array(z.string()).optional(),
      })
    )
    .optional()
    .describe("List of access control groups"),
  credentials: z
    .array(
      z.object({
        uuid: z.string().optional(),
        userUuid: z.string().optional(),
        credentialType: z.string().optional(),
        status: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional()
    .describe("List of access control credentials for a user"),
  lockdownPlans: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        locationUuid: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .optional()
    .describe("List of lockdown plans"),
  lockdownResult: z
    .object({
      success: z.boolean().optional(),
      locationUuid: z.string().optional(),
      action: z.string().optional(),
    })
    .optional()
    .describe("Result of activating or deactivating a lockdown"),
  doorScheduleExceptions: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        doorUuids: z.array(z.string()).optional(),
      })
    )
    .optional()
    .describe("Door schedule exceptions"),
  accessGrants: z
    .array(
      z.object({
        uuid: z.string().optional(),
        userUuid: z.string().optional(),
        locationUuid: z.string().optional(),
        doorUuid: z.string().optional(),
        groupUuid: z.string().optional(),
        scheduleUuid: z.string().optional(),
      })
    )
    .optional()
    .describe("List of location access grants"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
