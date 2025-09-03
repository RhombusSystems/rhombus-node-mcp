import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

// Removed unused schema definitions since the output structure was simplified

export const TOOL_ARGS = {
  eventType: z.enum(["access-control", "environmental-gateway"]),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .describe(
      "A timestamp representing when to start the search for access control events." +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .describe(
      "A timestamp representing when to end the search for access control events." +
        ISOTimestampFormatDescription
    ),
  accessControlledDoorUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "The UUIDs (array) of the access controlled doors. Required when eventType is 'access-control'."
    ),
  deviceUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the environmental gateway device. Required when eventType is 'environmental-gateway'  Can be obtained from the get-entity-tool for ENVIRONMENTAL_GATEWAY."
    ),
  timeZone: z
    .string()
    .describe(
      "The timezone of the requested locations or devices. This is necessary for the tool to produce accurate formatted timestamps."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const StrippedEnvironmentalEvent = z.object({
  timestampString: z.string().optional().describe("Human-readable formatted timestamp"),
  temp: z.number().optional().describe("Temperature from CO2 sensor in Celsius"),
  probeTemp: z.number().optional().describe("Temperature from probe sensor in Celsius"),
  humidity: z.number().optional().describe("Relative humidity percentage"),
  pm25: z.number().optional().describe("PM2.5 particulate matter reading"),
  co2: z.number().optional().describe("CO2 concentration in PPM"),
  vapeDetected: z.boolean().optional().describe("Whether vape was detected"),
});

export const OUTPUT_SCHEMA = z.object({
  eventType: z.enum(["access-control", "environmental-gateway"]).optional(),
  accessControlEvents: z.optional(
    z
      .array(
        z.object({
          authenticationResult: z.string().optional(),
          authorizationResult: z.string().optional(),
          doorUuid: z.string().optional(),
          locationUuid: z.string().optional(),
          user: z.string().optional(),
          credSource: z.string().optional(),
          datetime: z.string().optional(),
        })
      )
      .nullable()
      .describe("Access control events data including badge ins, credentials, arrivals, etc.")
  ),
  environmentalGatewayEvents: z.optional(
    z
      .object({
        events: z.array(StrippedEnvironmentalEvent).optional(),
        lastEvaluatedKey: z.string().optional(),
      })
      .nullable()
      .describe("Environmental gateway events data including sensor readings and derived values")
  ),
  needUserInput: z.boolean().optional(),
  commandForUser: z.string().optional(),
});
