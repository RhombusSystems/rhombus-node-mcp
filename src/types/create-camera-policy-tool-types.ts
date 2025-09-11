import { z } from "zod";
import { schemas } from "./zod-schemas.js";

// Base schema for the elicitation request
export const PolicyInfoSchema = z
  .object({
    name: z.string().min(1, "Policy name is required"),
    description: z.string().optional(),
    orgUuid: z.string().optional(),
  })
  .describe("Camera policy information");

export const TOOL_ARGS = {} as const;

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const ApiPayloadSchema = schemas.Policy_CreateCameraPolicyWSRequest;
export type ApiPayload = z.infer<typeof ApiPayloadSchema>;

export const OUTPUT_SCHEMA = z.object({
  needUserInput: z.boolean().optional(),
  message: z
    .string()
    .optional()
    .describe(
      "The message for this stage in the policy creation process.  This message will be displayed to the user."
    ),
  requestType: z
    .enum(["policy-creation-form", "schedule-trigger-configuration", "camera-assignment"])
    .optional()
    .describe(
      "The type of form to display to the user as the next step in the policy creation process"
    ),
  submitAction: z
    .string()
    .optional()
    .describe(
      "The action to take when the user completes the form, corresponds to the tool name to interact with next"
    ),
  policyUuid: z
    .string()
    .optional()
    .describe("The UUID of the policy that was created during this workflow"),
  policyName: z
    .string()
    .optional()
    .describe("The name of the policy that was created during this workflow"),
  scheduleData: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
      })
    )
    .nullable()
    .optional()
    .describe(
      "The schedules that were created during this workflow, can be null or undefined if user has not created them yet with schedule-trigger-configuration"
    ),
});
