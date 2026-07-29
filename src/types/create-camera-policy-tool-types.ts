import { z } from "zod";
import { schemas } from "./zod-schemas.js";

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
  policyUuid: z
    .string()
    .optional()
    .describe("The UUID of the policy that was created during this workflow"),
  policyName: z
    .string()
    .optional()
    .describe("The name of the policy that was created during this workflow"),
});
