import { z } from "zod";
import { createEpochSchema, ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  expiresBeforeISO: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .describe(
      "The timestamp before which policy alerts should expire. Only policy alerts that will expire BEFORE this timestamp will be returned."
      + ISOTimestampFormatDescription + " This parameter is required."
    ),
  lastEvaluatedKey: z
    .string()
    .nullable()
    .describe("A key for pagination. Use this to get the next page of results."),
  maxPageSize: z
    .number()
    .int()
    .nullable()
    .describe("The maximum number of policy alerts to return per page."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const ApiPayloadSchema = TOOL_ARGS_SCHEMA.transform((args) => {
  const { expiresBeforeISO, ...rest } = args;
  const expiresBeforeMs = createEpochSchema().parse(expiresBeforeISO);

  return {
    ...rest,
    expiresBeforeMs,
  };
});

export type ApiPayload = z.infer<typeof ApiPayloadSchema>;