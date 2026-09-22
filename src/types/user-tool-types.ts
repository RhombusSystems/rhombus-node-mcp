import { z } from "zod";

export enum UserToolRequestType {
  LIST_USERS = "list-users",
  FIND_BY_EMAIL = "find-by-email",
  GET_PERMISSIONS = "get-permissions",
  GET_PERMISSION_GROUPS = "get-permission-groups",
  CREATE_USER = "create-user",
  UPDATE_USER = "update-user",
  DELETE_USER = "delete-user",
}

// NOTE: `includeFields` and `filterBy` are NOT declared here — the
// `createFilteringProxy` wrapper automatically injects them into every tool's
// inputSchema and post-processes the handler's output. Declaring them here
// would be dead code (the proxy overwrites them).
export const TOOL_ARGS = {
  requestType: z.nativeEnum(UserToolRequestType).describe("The type of user request to make."),
  email: z
    .string()
    .nullable()
    .describe(
      "The email address of the user. Required for 'find-by-email' and 'create-user'. For 'create-user' this is where the invitation is sent, so read it back to the user before creating — a typo invites a stranger into the organization."
    ),
  userUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the user. Required for 'update-user' and 'delete-user'. Get it from 'list-users' or 'find-by-email' — do not guess one."
    ),
  userName: z
    .string()
    .nullable()
    .describe(
      "The user's display name. Required for 'create-user'; for 'update-user' it is the new name (omit to leave it unchanged)."
    ),
  permissionGroupUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of the permission group (role) to assign. Required for 'create-user'; for 'update-user' it is the new role (omit to leave the role unchanged). Get it from 'get-permission-groups' with includeFields ['permissionGroups.uuid','permissionGroups.name','permissionGroups.description']. A role decides what the person can see and do, so confirm the role NAME with the user rather than picking one."
    ),
  suppressWelcomeEmail: z
    .boolean()
    .nullable()
    .describe(
      "Only for 'create-user'. Creating a user emails them an invitation by default. Set true only when the user explicitly asks not to notify the new person."
    ),
  confirmDelete: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'delete-user'. Deleting a user revokes their console access and their credentials, and cannot be undone, so it refuses without explicit confirmation."
    ),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

// Permission level assigned to a resource for a role. Typed loosely as string
// because the upstream schema enum (READONLY/ADMIN/LIVEONLY) may grow.
const PermissionEnumLoose = z.string();

const PermissionGroupSchema = z
  .object({
    uuid: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    orgUuid: z.string().optional(),
    mutable: z.boolean().optional(),
    superAdmin: z.boolean().optional(),
    installer: z.boolean().optional(),
    inLine: z.boolean().optional(),
    storedInS3: z.boolean().optional(),
    defaultPermissionForNewLocations: PermissionEnumLoose.optional(),
    defaultAccessControlPermissionForNewLocations: PermissionEnumLoose.optional(),
    functionalityList: z
      .array(z.string())
      .optional()
      .describe("List of functionality flags this role unlocks."),
    accessibleLocations: z
      .array(z.string())
      .optional()
      .describe("UUIDs of locations this role has any access to."),
    assignablePermissionGroups: z
      .array(z.string())
      .optional()
      .describe("UUIDs of other permission groups a member of this role may assign to users."),
    // The five maps below grow with the number of locations / devices /
    // other permission groups in the org. For large orgs a single row can be
    // hundreds of KB; use `includeFields` to request only the maps you need.
    locationAccessMap: z
      .record(z.string(), PermissionEnumLoose)
      .optional()
      .describe("locationUuid -> permission level. Size = O(#locations)."),
    accessControlLocationAccessMap: z
      .record(z.string(), PermissionEnumLoose)
      .optional()
      .describe("locationUuid -> access-control permission level. Size = O(#locations)."),
    deviceAccessMap: z
      .record(z.string(), PermissionEnumLoose)
      .optional()
      .describe("deviceUuid -> permission level. Size = O(#devices)."),
    userPermissionGroupAccessMap: z
      .record(z.string(), PermissionEnumLoose)
      .optional()
      .describe(
        "otherPermissionGroupUuid -> permission level. Total payload across all rows is O(N^2) in the number of permission groups — trim with includeFields."
      ),
    locationGranularAccessMap: z
      .record(z.string(), z.record(z.string(), PermissionEnumLoose))
      .optional()
      .describe("locationUuid -> (subResourceUuid -> permission level). Size = O(#locations * avg #sub-resources)."),
  })
  .describe("A permission group (role) definition.");

export const OUTPUT_SCHEMA = z.object({
  users: z
    .array(
      z.object({
        uuid: z.string().optional(),
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .optional()
    .describe("List of users in the organization"),
  user: z
    .object({
      uuid: z.string().optional(),
      email: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.string().optional(),
      orgUuid: z.string().optional(),
      lastLoginMs: z.number().optional(),
      enabled: z.boolean().optional(),
      mfaEnabled: z.boolean().optional(),
    })
    .optional()
    .describe("A single user found by email"),
  permissions: z
    .object({
      role: z.string().optional(),
      functionalityAccessMap: z.record(z.string(), z.string()).optional(),
    })
    .optional()
    .describe("Current user permissions"),
  permissionGroups: z
    .array(PermissionGroupSchema)
    .optional()
    .describe("List of permission groups in the organization."),
  created: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of 'create-user'."),
  updated: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of 'update-user'."),
  deleted: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of 'delete-user'."),
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
