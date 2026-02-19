import { z } from "zod";

export enum RulesToolRequestType {
  LIST = "list",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  GET_RECORDS = "get-records",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RulesToolRequestType).describe("The type of rules operation to perform."),
  ruleUuid: z
    .string()
    .nullable()
    .describe("The UUID of the rule. Required for 'update', 'delete', and 'get-records'."),
  ruleName: z
    .string()
    .nullable()
    .describe("The name of the rule. Required for 'create'."),
  ruleConfig: z
    .string()
    .nullable()
    .describe("JSON string of the rule configuration. Required for 'create' and 'update'. Contains the rule definition."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  rules: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        enabled: z.boolean().optional(),
        orgUuid: z.string().optional(),
        ruleType: z.string().optional(),
        createdAtMs: z.number().optional(),
        updatedAtMs: z.number().optional(),
      })
    )
    .optional()
    .describe("List of rules"),
  rule: z
    .object({
      uuid: z.string().optional(),
      name: z.string().optional(),
      success: z.boolean().optional(),
    })
    .optional()
    .describe("Result of create/update/delete operation"),
  ruleRecords: z
    .array(
      z.object({
        uuid: z.string().optional(),
        ruleUuid: z.string().optional(),
        triggeredAtMs: z.number().optional(),
        deviceUuid: z.string().optional(),
        locationUuid: z.string().optional(),
      })
    )
    .optional()
    .describe("Rule trigger event records"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
