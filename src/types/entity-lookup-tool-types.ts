import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { TempUnit } from "../utils/temp.js";

export const TOOL_ARGS = {
  deviceUuids: z.array(createUuidSchema()).describe("The UUIDs of the devices to look up."),
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

export const OUTPUT_SCHEMA = z.object({
  // Device arrays with their counts
  cameras: z.array(z.any()).optional().describe("List of cameras matching the provided UUIDs"),
  camerasCount: z.number().optional().describe("Number of cameras found"),
  doorbellCameras: z
    .array(z.any())
    .optional()
    .describe("List of doorbell cameras matching the provided UUIDs"),
  doorbellCamerasCount: z.number().optional().describe("Number of doorbell cameras found"),
  badgeReaders: z
    .array(z.any())
    .optional()
    .describe("List of badge readers matching the provided UUIDs"),
  badgeReadersCount: z.number().optional().describe("Number of badge readers found"),
  accessControlledDoors: z
    .array(z.any())
    .optional()
    .describe("List of access controlled doors matching the provided UUIDs"),
  accessControlledDoorsCount: z
    .number()
    .optional()
    .describe("Number of access controlled doors found"),
  audioGateways: z
    .array(z.any())
    .optional()
    .describe("List of audio gateways matching the provided UUIDs"),
  audioGatewaysCount: z.number().optional().describe("Number of audio gateways found"),
  doorStates: z
    .array(z.any())
    .optional()
    .describe("List of door sensors matching the provided UUIDs"),
  doorStatesCount: z.number().optional().describe("Number of door sensors found"),
  climateStates: z
    .array(z.any())
    .optional()
    .describe("List of environmental sensors matching the provided UUIDs"),
  climateStatesCount: z.number().optional().describe("Number of environmental sensors found"),
  occupancySensorStates: z
    .array(z.any())
    .optional()
    .describe("List of motion sensors matching the provided UUIDs"),
  occupancySensorStatesCount: z.number().optional().describe("Number of motion sensors found"),
  buttonStates: z.array(z.any()).optional().describe("List of buttons matching the provided UUIDs"),
  buttonStatesCount: z.number().optional().describe("Number of buttons found"),
  keypadStates: z.array(z.any()).optional().describe("List of keypads matching the provided UUIDs"),
  keypadStatesCount: z.number().optional().describe("Number of keypads found"),
  minimalEnvironmentalGatewayStates: z
    .array(z.any())
    .optional()
    .describe("List of environmental gateways matching the provided UUIDs"),
  minimalEnvironmentalGatewayStatesCount: z
    .number()
    .optional()
    .describe("Number of environmental gateways found"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
