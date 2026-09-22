import { z } from "zod";
import { addConfirmationParams } from "../utils/confirmation.js";

export const TOOL_ARGS = addConfirmationParams({
  cameraUuids: z
    .array(z.string())
    .describe("An array of camera UUID strings which are unique identifiers for cameras"),
});

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
