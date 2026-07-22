import { z } from "zod";
import DeviceType from "./deviceType.js";
import { TempUnit } from "../utils/temp.js";

export const TOOL_ARGS = {
  entityTypes: z
    .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
    .describe("What type of entities to retrieve."),
  detail: z
    .enum(["core", "full"])
    .nullish()
    .transform((v) => v ?? "core")
    .describe(
      'Level of per-device detail. "core" (default) returns each device\'s key fields: uuid, name, connection/health status, location, camera associations, temperature, door capabilities. "full" returns every field (model, firmware, serial, network info, ...) — when describing a single device, combine it with the filterBy output filter (e.g. [{field:"name", op:"contains", value:"..."}]) to avoid a huge response.'
    ),
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
