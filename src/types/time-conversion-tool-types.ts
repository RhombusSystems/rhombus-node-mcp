import { z } from "zod";

export const TOOL_ARGS = {
  time_to_convert: z
    .union([z.string(), z.number()])
    .describe(
      "The time(s) to convert. Either an ISO 8601 timestamp string (e.g. '2023-10-05T14:48:00.000Z' or '2023-10-05T14:48:00-07:00'), a Unix timestamp in milliseconds, or a comma-separated list of several such values (converted in order)."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
