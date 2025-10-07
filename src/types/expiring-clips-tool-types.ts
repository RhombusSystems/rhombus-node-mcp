import { z } from "zod";
import { createUuidSchema } from "../types.js";

export const TOOL_ARGS = {
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(200)
    .nullable()
    .describe("The maximum number of clips to return per page. Must be between 1 and 200. Default is system-defined."),
  pageToken: z
    .string()
    .nullable()
    .describe("A token for pagination. Use this to get the next page of results."),
  deviceUuidFilters: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "A list of UUIDs representing specific devices to filter clips by. Only clips emitted by these devices will be returned."
    ),
  locationUuidFilters: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "A list of UUIDs representing specific locations to filter clips by. Only clips associated with these locations will be returned."
    ),
  searchFilter: z
    .string()
    .nullable()
    .describe("A simple string to search for within the names of the clips."),
};

export const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;