import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum DoorToolRequestType {
  GET_DOOR_CONTROLLER_RULES = "get-door-controller-rules",
  CREATE_DOOR_CONTROLLER_RULE = "create-door-controller-rule",
  UPDATE_DOOR_CONTROLLER_RULE = "update-door-controller-rule",
  DELETE_DOOR_CONTROLLER_RULE = "delete-door-controller-rule",
  GET_DOOR_POLICIES = "get-door-policies",
  CREATE_DOOR_POLICY = "create-door-policy",
  UPDATE_DOOR_POLICY = "update-door-policy",
  DELETE_DOOR_POLICY = "delete-door-policy",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(DoorToolRequestType).describe("The type of door operation to perform."),
  doorControllerUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the door controller device. Required for every 'door-controller-rule' operation — a rule is addressed by controller AND rule uuid, never by rule uuid alone."
    ),
  ruleUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the door controller rule. Required for 'update-door-controller-rule' and 'delete-door-controller-rule'. Get it from 'get-door-controller-rules' — do not guess one."
    ),
  ruleConfig: z
    .string()
    .nullable()
    .describe(
      "JSON string of the door controller rule configuration. Required for 'create-door-controller-rule' and 'update-door-controller-rule'. For an update this is MERGED over the rule's current configuration, so send only the fields being changed."
    ),
  policyUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the door policy. Required for 'update-door-policy' and 'delete-door-policy'. Get it from 'get-door-policies' — do not guess one."
    ),
  policyName: z
    .string()
    .nullable()
    .describe(
      "The name for the door policy. Required for 'create-door-policy'; for 'update-door-policy' it is the new name (omit to leave the name unchanged)."
    ),
  policyConfig: z
    .string()
    .nullable()
    .describe(
      "JSON string of door policy configuration. Required for 'create-door-policy'; optional for 'update-door-policy', where it is MERGED over the policy's current configuration so only the fields being changed need sending."
    ),
  confirmDelete: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'delete-door-policy' and 'delete-door-controller-rule'. Both are irreversible and change how doors behave, so they refuse without it. Confirm with the user first."
    ),
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
  updated: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of an update request"),
  deleted: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of a delete request"),
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
