import { z } from "zod";

export const TOOL_ARGS = {
  time_to_convert: z.union([
    z.string(),
    z.number(),
  ]).describe(
    "The time to convert. This can be either an ISO 8601 timestamp string (e.g., '2023-10-05T14:48:00.000Z') or a Unix timestamp in milliseconds."
  ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
