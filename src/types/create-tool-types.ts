import { z } from "zod";
import { CreateVideoWallOptions } from "../types.js";
import { addConfirmationParams } from "../utils/confirmation.js";

export const TOOL_ARGS = addConfirmationParams({
  entityType: z.enum(["video-wall"]).describe("The entity type to create.  Example: video wall."),
  videoWallCreateOptions: CreateVideoWallOptions,
});

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
