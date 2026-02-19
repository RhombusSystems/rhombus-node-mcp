import { z } from "zod";

export enum UserToolRequestType {
  LIST_USERS = "list-users",
  FIND_BY_EMAIL = "find-by-email",
  GET_PERMISSIONS = "get-permissions",
  GET_PERMISSION_GROUPS = "get-permission-groups",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(UserToolRequestType).describe("The type of user request to make."),
  email: z
    .string()
    .nullable()
    .describe("The email address of the user to find. Required for 'find-by-email'."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  users: z
    .array(
      z.object({
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
      functionalityAccessMap: z.record(z.string()).optional(),
    })
    .optional()
    .describe("Current user permissions"),
  permissionGroups: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        orgUuid: z.string().optional(),
        role: z.string().optional(),
      })
    )
    .optional()
    .describe("List of permission groups"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
