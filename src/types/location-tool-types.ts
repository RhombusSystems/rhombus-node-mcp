import { z } from "zod";

export const TOOL_ARGS = {
  action: z.enum(["get", "update"]),
  locationUpdate: z
    .object({
      uuid: z.string(),
      name: z.string(),
    })
    .optional(),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
