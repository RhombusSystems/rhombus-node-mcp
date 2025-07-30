import { z } from "zod";

export const TOOL_ARGS = {
  eventType: z.enum(["access-control"]),
  startTime: z
    .number()
    .describe(
      "A timestamp in milliseconds representing when to start the search for access controll events."
    ),
  endTime: z
    .number()
    .describe(
      "A timestamp in milliseconds representing when to end the search for access controll events."
    ),
  accessControlledDoorUuid: z.string().nullable(),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
