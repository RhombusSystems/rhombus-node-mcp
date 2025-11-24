import { z } from "zod";
import { createUuidSchema } from "../types.js";
import DeviceType from "./deviceType.js";
import { TempUnit } from "../utils/temp.js";

export const TOOL_ARGS = {
  entityTypes: z
    .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
    .describe("What type of entities to retrieve."),
  filterBy: z
    .object({
      locationUuids: z
        .array(createUuidSchema())
        .nullable()
        .describe(
          "The UUIDs of the locations to filter by. Set to null or an enmpty array to not filter by location."
        ),
    })
    .describe("Additional filters that can be applied to the result."),
  timeZone: z
    .string()
    .describe(
      "The timezone for formatting timestamps. This is necessary for the tool to produce accurate formatted timestamps."
    ),
  tempUnit: z
    .nativeEnum(TempUnit)
    .nullable()
    .describe("The unit of temperature to return, if applicable. Default is Celsius."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
