import { z } from "zod";
import { createEpochSchema, ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { createUuidSchema } from "../types.js";

export const TOOL_ARGS = {
  queryType: z
    .enum(["saved", "expiringSoon"])
    .describe(
      'The type of clips to retrieve. Use "saved" to get regular saved clips, and "expiringSoon" to get clips that are nearing their expiration date.'
    ),
  deviceUuidFilters: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "A list of UUIDs representing specific devices to filter clips by. Only clips emitted by these devices will be returned. Please truncate any facets, such as .v0. It is always 22 characters long."
    ),
  locationUuidFilters: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "A list of UUIDs representing specific locations to filter clips by. Only clips associated with these locations will be returned. Please truncate any facets, such as .v0. It is always 22 characters long."
    ),
  searchFilter: z
    .string()
    .nullable()
    .describe("A simple string to search for within the names of the clips."),
  timestampISOAfter: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .describe(
      "The start of the time range for which to retrieve clips. Only clips that occurred AFTER this timestamp will be returned."
      + ISOTimestampFormatDescription
    ),
  timestampISOBefore: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .describe(
      "The end of the time range for which to retrieve clips. Only clips that occurred BEFORE this timestamp will be returned."
      + ISOTimestampFormatDescription
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const ApiPayloadSchema = TOOL_ARGS_SCHEMA.transform((args) => {
  const { queryType, timestampISOAfter, timestampISOBefore, ...rest } = args;
  const timestampMsAfter = createEpochSchema().parse(timestampISOAfter);
  const timestampMsBefore = createEpochSchema().parse(timestampISOBefore);

  return {
    ...rest,
    timestampMsAfter,
    timestampMsBefore,
  };
});
export type ApiPayload = z.infer<typeof ApiPayloadSchema>;