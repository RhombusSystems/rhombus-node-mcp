import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum AccessControlRequestType {
  UNLOCK_DOOR = "unlock-door",
  GET_GROUPS = "get-groups",
  CREATE_GROUP = "create-group",
  UPDATE_GROUP = "update-group",
  DELETE_GROUP = "delete-group",
  ADD_USERS_TO_GROUP = "add-users-to-group",
  REMOVE_USERS_FROM_GROUP = "remove-users-from-group",
  GET_CREDENTIALS_BY_USER = "get-credentials-by-user",
  ASSIGN_CREDENTIAL = "assign-credential",
  REVOKE_CREDENTIAL = "revoke-credential",
  SUSPEND_CREDENTIAL = "suspend-credential",
  UNSUSPEND_CREDENTIAL = "unsuspend-credential",
  DELETE_CREDENTIAL = "delete-credential",
  UPDATE_CREDENTIAL_NOTE = "update-credential-note",
  GET_LOCKDOWN_PLANS = "get-lockdown-plans",
  RENAME_LOCKDOWN_PLAN = "rename-lockdown-plan",
  DELETE_LOCKDOWN_PLAN = "delete-lockdown-plan",
  ACTIVATE_LOCKDOWN = "activate-lockdown",
  DEACTIVATE_LOCKDOWN = "deactivate-lockdown",
  /**
   * Reads door schedule EXCEPTIONS, not schedules — the name is retained
   * because it is the published request type. Prefer door-schedule-exception-tool
   * for anything beyond a location-scoped list, and schedule-tool for schedules
   * themselves.
   */
  GET_DOOR_SCHEDULES = "get-door-schedules",
  GET_ACCESS_GRANTS = "get-access-grants",
  CREATE_ACCESS_GRANT = "create-access-grant",
  UPDATE_ACCESS_GRANT = "update-access-grant",
  DELETE_ACCESS_GRANT = "delete-access-grant",
  GET_REMOTE_UNLOCK_USERS = "get-remote-unlock-users",
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
    .describe("The UUID of the location. Required for 'activate-lockdown', 'deactivate-lockdown', 'get-door-schedules', and 'get-remote-unlock-users'. Optional for 'get-access-grants' to filter by location."),
  lockdownPlanUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the lockdown plan. Required for 'activate-lockdown', 'deactivate-lockdown', 'rename-lockdown-plan' and 'delete-lockdown-plan'."
    ),
  groupUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the access control group. Required for 'update-group', 'delete-group', 'add-users-to-group' and 'remove-users-from-group'. Get it from 'get-groups' — do not guess one."
    ),
  groupName: z
    .string()
    .nullable()
    .describe(
      "Name of the access control group. Required for 'create-group'; for 'update-group' it is the new name (omit to leave it unchanged). Also the new name for 'rename-lockdown-plan'."
    ),
  groupDescription: z
    .string()
    .nullable()
    .describe(
      "Description of the access control group. Optional for 'create-group' and 'update-group'."
    ),
  userUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "User UUIDs. Required for 'add-users-to-group' and 'remove-users-from-group'; optional for 'create-group' to seed the initial members. Resolve names and emails to UUIDs with user-tool first — never guess a user UUID, because granting the wrong person physical door access is not something the user can see from the response."
    ),
  credentialUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the access control credential. Required for 'revoke-credential', 'suspend-credential', 'unsuspend-credential', 'delete-credential' and 'update-credential-note'. Get it from 'get-credentials-by-user'."
    ),
  credentialHexValue: z
    .string()
    .nullable()
    .describe(
      "The hex value printed on / encoded in a physical badge or fob. Required for 'assign-credential'. The credential must already exist in the org as an unassigned credential; this attaches it to a user."
    ),
  credentialNote: z
    .string()
    .nullable()
    .describe("Free-text note to store on the credential. Required for 'update-credential-note'."),
  accessGrantUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the location access grant. Required for 'update-access-grant' and 'delete-access-grant'. Get it from 'get-access-grants'."
    ),
  accessGrantName: z
    .string()
    .nullable()
    .describe(
      "Name for the access grant. Required for 'create-access-grant'; for 'update-access-grant' it is the new name (omit to leave it unchanged)."
    ),
  doorUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "Access controlled door UUIDs the grant provides access to. Required for 'create-access-grant'. For 'update-access-grant' this REPLACES the grant's current door list rather than adding to it, so include the doors being kept; omit to leave the doors unchanged. Get UUIDs from get-entity-tool with entityType ACCESS_CONTROL_DOOR."
    ),
  groupUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "Access control group UUIDs the grant applies to. For 'update-access-grant' this REPLACES the grant's current group list; omit to leave it unchanged."
    ),
  scheduleUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of the schedule limiting when the grant applies. Optional. Resolve schedule names to UUIDs with schedule-tool — never invent one."
    ),
  confirmDelete: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'delete-group', 'delete-credential', 'delete-access-grant' and 'delete-lockdown-plan'. All four remove physical access or the ability to restore it, so they refuse without explicit confirmation from the user."
    ),
  includeFields: INCLUDE_FIELDS_ARG,
  filterBy: FILTER_BY_ARG,
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
        name: z.string().optional(),
        locationUuid: z.string().optional(),
        userUuids: z.array(z.string()).optional(),
        groupUuids: z.array(z.string()).optional(),
        doorUuids: z.array(z.string()).optional(),
        scheduleUuid: z.string().optional(),
      })
    )
    .optional()
    .describe("List of location access grants. Each grant contains userUuids and groupUuids that have access to the doorUuids in the grant."),
  remoteUnlockUsers: z
    .object({
      doors: z.array(z.string()).optional().describe("Names of doors with remote unlock enabled at this location."),
      totalUsers: z.number().optional().describe("Total number of unique users who can remotely unlock doors."),
      groups: z.array(
        z.object({
          permissionGroup: z.string().optional().describe("Name of the permission group/role."),
          doors: z.union([z.literal("all"), z.array(z.string())]).optional()
            .describe("Which doors users in this group can unlock. 'all' means every door at the location."),
          users: z.array(z.string()).optional()
            .describe("Users in this group, formatted as 'Name (email)'. Always list ALL users completely."),
        })
      ).optional(),
    })
    .optional()
    .describe("Users who can remotely unlock doors at a location, grouped by permission group. Always present the COMPLETE list of all users to the end user."),
  created: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      memberCount: z.number().optional(),
    })
    .optional()
    .describe("Result of a create request."),
  updated: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      userCount: z.number().optional(),
    })
    .optional()
    .describe("Result of an update / membership-change request."),
  deleted: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of a delete request."),
  credentialChange: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      userUuid: z.string().optional(),
      action: z.string().optional(),
    })
    .optional()
    .describe("Result of a credential state change."),
  doorsWithoutLicense: z
    .array(z.string())
    .optional()
    .describe(
      "Doors named in an access grant whose access-control license is expired or unassigned. The grant saved, but these doors grant NOBODY access until their license is fixed — always report them."
    ),
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

/**
 * Element types of the list-shaped outputs. The read helpers in
 * `api/access-control-tool-api.ts` map through `any`, which made their return
 * type `any` and left every `.find()` callback implicitly untyped downstream —
 * annotating those helpers with these keeps the write paths type-checked.
 */
export type AccessControlGroup = NonNullable<OUTPUT_SCHEMA["accessControlGroups"]>[number];
export type AccessGrant = NonNullable<OUTPUT_SCHEMA["accessGrants"]>[number];
export type LockdownPlanSummary = NonNullable<OUTPUT_SCHEMA["lockdownPlans"]>[number];
