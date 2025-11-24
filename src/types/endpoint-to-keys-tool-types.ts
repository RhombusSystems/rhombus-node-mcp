import { z } from "zod";

export const TOOL_ARGS = {
  endpoint: z
    .string()
    .describe(
      "The API endpoint to get output keys for (e.g., 'POST /api/camera/getMinimalCameraStateList')"
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
