import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum RulesToolRequestType {
  LIST = "list",
  GET = "get",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  GET_RECORDS = "get-records",
  LIST_AUDIO_CLIPS = "list-audio-clips",
}

/**
 * Top-level fields of the API's RuleType. A ruleConfig may only use these keys; anything else
 * (e.g. "trigger", "actions") is a guessed shape the API would deserialize as an empty rule.
 */
export const RULE_FIELDS = [
  "name",
  "triggers",
  "action",
  "conjunction",
  "ruleFilters",
  "ruleType",
  "uuid",
  "orgUuid",
  "ownerUuid",
] as const;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RulesToolRequestType).describe("The type of rules operation to perform."),
  ruleUuid: z
    .string()
    .nullable()
    .describe("The UUID of the rule. Required for 'get', 'update', 'delete', and 'get-records'."),
  ruleName: z
    .string()
    .nullable()
    .describe("The name of the rule. Required for 'create'; renames the rule on 'update'."),
  ruleConfig: z
    .string()
    .nullable()
    .describe(
      "JSON string of rule fields, using the same shape 'get' returns: triggers, action, conjunction, ruleFilters, name. Required for 'create' and 'update'. On 'update', send only the top-level fields you change — each one you send REPLACES the existing value (arrays are not merged), so copy it from 'get' and edit it."
    ),
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
      ruleType: z.string().optional(),
      conjunction: z.string().optional(),
      triggers: z.array(z.record(z.string(), z.unknown())).optional(),
      action: z.record(z.string(), z.unknown()).optional(),
      ruleFilters: z.record(z.string(), z.unknown()).optional(),
      changedFields: z.array(z.string()).optional(),
      doorSensorAjarSeconds: z
        .array(
          z.object({
            deviceUuid: z.string().optional(),
            ajarThresholdEnabled: z.boolean().optional(),
            ajarThresholdSec: z.number().optional(),
            effectiveAjarSeconds: z.number().optional(),
          })
        )
        .optional()
        .describe(
          "For DOOR_AJAR triggers: how long each door sensor waits before reporting DOOR_AJAR. This, not the trigger, sets the delay."
        ),
    })
    .optional()
    .describe("The full rule for 'get'; the result of create/update/delete otherwise"),
  ruleRecords: z
    .array(
      z.object({
        uuid: z.string().optional(),
        ruleUuid: z.string().optional(),
        triggeredAtMs: z.number().optional(),
        deviceUuid: z.string().optional(),
        locationUuid: z.string().optional(),
        activities: z.array(z.string()).optional(),
        audioPlayback: z
          .array(
            z.object({
              audioClipUuid: z.string().optional(),
              gatewayStatuses: z.record(z.string(), z.string()).optional(),
            })
          )
          .optional(),
      })
    )
    .optional()
    .describe("The rule's most recent firings, newest first"),
  audioClips: z
    .array(
      z.object({
        uuid: z.string().optional(),
        displayName: z.string().optional(),
        text: z.string().optional().describe("The spoken text of a text-to-speech clip"),
        durationMs: z.number().optional(),
      })
    )
    .optional()
    .describe("Saved audio clips (uploads and text-to-speech) a Play Audio action can reference"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
