import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { addReduceOutputParams } from "../utils/reduce-output.js";
import DeviceType from "./deviceType.js";

export const TOOL_ARGS = addReduceOutputParams({
  entityTypes: z
    .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
    .describe("What type of entities to retrieve."),
  filterBy: z
    .object({
      locationUuids: z
        .array(createUuidSchema())
        .describe("The UUIDs of the locations to filter by."),
    })
    .describe("Additional filters that can be applied to the result."),
  timeZone: z
    .string()
    .describe(
      "The timezone for formatting timestamps. This is necessary for the tool to produce accurate formatted timestamps."
    ),
});

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
