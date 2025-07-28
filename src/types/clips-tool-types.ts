import { z } from "zod";
import { UUID } from "../types.js";

export const TOOL_ARGS = {
  deviceUuidFilters: z
    .array(z.string())
    .nullable()
    .describe(
      "A list of UUIDs representing specific devices to filter clips by. Only clips emitted by these devices will be returned. Please truncate any facets, such as .v0"
    ),
  locationUuidFilters: z
    .array(z.string())
    .nullable()
    .describe(
      "A list of UUIDs representing specific locations to filter clips by. Only clips associated with these locations will be returned. Please truncate any facets, such as .v0"
    ),
  searchFilter: z
    .string()
    .nullable()
    .describe("A simple string to search for within the names of the clips."),
  timestampMsAfter: z
    .number()
    .describe(
      "The start of the time range (in milliseconds since epoch) for which to retrieve clips. Only clips that occurred AFTER this timestamp will be returned."
    ),
  timestampMsBefore: z
    .number()
    .describe(
      "The end of the time range (in milliseconds since epoch) for which to retrieve clips. Only clips that occurred BEFORE this timestamp will be returned."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
