import { z } from "zod";
import DeviceType from "./deviceType.js";
import { addReduceOutputParams } from "../utils/reduce-output.js";

export const TOOL_ARGS = addReduceOutputParams({
  entityTypes: z
    .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
    .describe("What type of entities to retrieve."),
});

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
