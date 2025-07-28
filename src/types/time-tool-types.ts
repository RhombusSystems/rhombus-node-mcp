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
      "Optional IANA timezone string (e.g., 'America/Los_Angeles', 'UTC'). Will default to system timezone if not provided."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
