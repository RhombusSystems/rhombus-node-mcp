import { z } from "zod";

export enum UserAuditRequestType {
  AUDIT_BY_USER = "audit-by-user",
  AUDIT_BY_TARGET = "audit-by-target",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(UserAuditRequestType)
    .describe("The type of audit request to make."),
  userUuid: z
    .string()
    .nullable()
    .describe("User UUID whose actions to audit. Required for 'audit-by-user'. Use user-tool to find this."),
  targetUuid: z
    .string()
    .nullable()
    .describe("Target entity UUID (camera, door, policy, etc.) to see what has been done to it. Required for 'audit-by-target'."),
  maxResults: z
    .number()
    .nullable()
    .describe("Maximum number of audit events to return. Defaults to 50."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const AuditEventSchema = z.object({
  uuid: z.string().optional(),
  action: z.string().optional(),
  displayText: z.string().optional(),
  principalName: z.string().optional(),
  principalUuid: z.string().optional(),
  targetName: z.string().optional(),
  targetUuid: z.string().optional(),
  timestamp: z.string().optional(),
  failure: z.boolean().optional(),
  sourceIp: z.string().optional(),
  sourceCity: z.string().optional(),
  sourceCountry: z.string().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  auditEvents: z
    .array(AuditEventSchema)
    .optional()
    .describe("List of audit events, most recent first"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
