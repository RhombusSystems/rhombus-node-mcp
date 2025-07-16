import { z } from "zod";

export const TOOL_ARGS = {
  eventType: z.enum(["access-control"]),
  createdAfterMs: z
    .optional(z.number())
    .describe(
      "A timestamp in milliseconds representing the start or earliest time of access controll events."
    ),
  createdBeforeMs: z
    .optional(z.number())
    .describe(
      "A timestamp in milliseconds representing the end or latest time of access controll events."
    ),
  accessControlledDoorUuid: z.optional(z.string()),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
