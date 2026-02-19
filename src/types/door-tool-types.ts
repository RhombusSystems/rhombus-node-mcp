import { z } from "zod";

export enum DoorToolRequestType {
  GET_DOOR_CONTROLLER_RULES = "get-door-controller-rules",
  CREATE_DOOR_CONTROLLER_RULE = "create-door-controller-rule",
  GET_DOOR_POLICIES = "get-door-policies",
  CREATE_DOOR_POLICY = "create-door-policy",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(DoorToolRequestType).describe("The type of door operation to perform."),
  doorControllerUuid: z
    .string()
    .nullable()
    .describe("The UUID of the door controller device. Required for 'get-door-controller-rules' and 'create-door-controller-rule'."),
  ruleConfig: z
    .string()
    .nullable()
    .describe("JSON string of the door controller rule configuration. Required for 'create-door-controller-rule'."),
  policyName: z
    .string()
    .nullable()
    .describe("The name for the new door policy. Required for 'create-door-policy'."),
  policyConfig: z
    .string()
    .nullable()
    .describe("JSON string of door policy configuration. Required for 'create-door-policy'."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  doorControllerRules: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        deviceUuid: z.string().optional(),
        enabled: z.boolean().optional(),
        ruleType: z.string().optional(),
      })
    )
    .optional()
    .describe("List of door controller rules"),
  createdRule: z
    .object({
      uuid: z.string().optional(),
      success: z.boolean().optional(),
    })
    .optional()
    .describe("Result of creating a door controller rule"),
  doorPolicies: z
    .array(
      z.object({
        uuid: z.string().optional(),
        name: z.string().optional(),
        orgUuid: z.string().optional(),
        enabled: z.boolean().optional(),
      })
    )
    .optional()
    .describe("List of door policies"),
  createdPolicy: z
    .object({
      uuid: z.string().optional(),
      success: z.boolean().optional(),
    })
    .optional()
    .describe("Result of creating a door policy"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
