import { z } from "zod";

export const TOOL_ARGS = {
  time_description: z
    .string()
    .describe(
      "A natural language description of the time (e.g., '2pm today', 'tomorrow at noon')."
    ),
  timezone: z
    .string()
    .nullable()
    .describe(
      "IANA timezone to resolve the description in (e.g. 'America/Los_Angeles'). Pass the relevant location's timezone when you know it, or one the user stated; otherwise pass null and the organization's timezone (shared by most of its locations) is used. Do not pass 'UTC' unless the user asked for UTC."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
