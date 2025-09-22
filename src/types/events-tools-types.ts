import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { ComponentEventEnumType } from "./schema-components.js";

// Removed unused schema definitions since the output structure was simplified

export const TOOL_ARGS = {
  eventType: z.enum([
    "access-control",
    "environmental-gateway",
    "climate-sensor",
    "component-events",
  ]),
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
  sensorUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the climate sensor. Required when eventType is 'climate-sensor'. Can be obtained from the get-entity-tool for SENSOR."
    ),
  limit: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe(
      "Maximum number of climate events to return. Only applicable when eventType is 'climate-sensor'. Default is 1000. Pass null for other event types."
    ),
  locationUuid: z
    .string()
    .nullable()
    .describe("The UUID of the location. Required when eventType is 'component-events'."),
  componentEventTypes: z
    .array(z.nativeEnum(ComponentEventEnumType))
    .nullable()
    .describe(
      "Array of component event types to filter by. Only applicable when eventType is 'component-events'. " +
        "If empty or null, returns all event types. Valid values: " +
        "DoorbellEvent, DoorReaderStateChangeEvent, DoorRelayStateChangeEvent, DoorPositionIndicatorStateChangeEvent, " +
        "RequestToExitStateChangeEvent, CredentialReceivedEvent, ButtonEvent, GenericInputStateChangeEvent, " +
        "GenericRelayStateChangeEvent, AccessControlUnitTamperEvent, AccessControlUnitLocationLockdownStateEvent, " +
        "DoorLocationLockdownStateEvent, PanicButtonEvent, AccessControlUnitBatteryStateChangeEvent, " +
        "WaveToUnlockIntentExpiredEvent, DoorStateChangeEvent, DoorAuthFirstInStateEvent, DoorScheduleFirstInStateEvent, " +
        "AccessControlUnitDoorFirstInStateEvent, AperioDoorExtensionStateEvent, AperioGatewayStateEvent, " +
        "AperioGatewayConnectionStateChangeEvent, AperioDtcEvent, AperioTamperStateEvent."
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

const ClimateSensorEvent = z.object({
  timestampString: z.string().optional().describe("Human-readable formatted timestamp"),
  timestampMs: z.number().optional().describe("Timestamp in milliseconds"),
  temp: z.number().optional().describe("Temperature reading in Celsius"),
  probeTempC: z.number().optional().describe("Temperature from probe sensor in Celsius"),
  humidity: z.number().optional().describe("Relative humidity percentage"),
  pm25: z.number().optional().describe("PM2.5 particulate matter reading"),
  co2: z.number().optional().describe("CO2 concentration in PPM"),
  tvoc: z.number().optional().describe("Total Volatile Organic Compounds"),
  iaq: z.number().optional().describe("Indoor Air Quality index"),
  ethanol: z.number().optional().describe("Ethanol concentration"),
  heatIndexDegF: z.number().optional().describe("Heat index in Fahrenheit"),
  heatIndexRangeWarning: z.string().optional().describe("Heat index warning level"),
  vapeSmokeDetected: z.boolean().optional().describe("Whether vape or smoke was detected"),
  vapeSmokePercent: z.number().optional().describe("Vape/smoke confidence percentage"),
  thcDetected: z.boolean().optional().describe("Whether THC was detected"),
  thcPercent: z.number().optional().describe("THC confidence percentage"),
  tampered: z.boolean().optional().describe("Whether the sensor was tampered with"),
  batteryPercentage: z.number().optional().describe("Battery level percentage"),
  locationUuid: z.string().optional().describe("Location UUID"),
  orgUuid: z.string().optional().describe("Organization UUID"),
});

export const OUTPUT_SCHEMA = z.object({
  eventType: z
    .enum(["access-control", "environmental-gateway", "climate-sensor", "component-events"])
    .optional(),
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
  climateSensorEvents: z.optional(
    z
      .array(ClimateSensorEvent)
      .nullable()
      .describe(
        "Climate sensor events data including temperature, humidity, air quality, and other readings"
      )
  ),
  componentEvents: z.optional(
    z
      .array(
        z.object({
          eventType: z.string().optional(),
          componentUuid: z.string().optional(),
          locationUuid: z.string().optional(),
          orgUuid: z.string().optional(),
          correlationId: z.string().optional(),
          ownerDeviceUuid: z.string().optional(),
          datetime: z.string().optional(),
          timestampMs: z.number().optional(),
          uuid: z.string().optional(),
          // Event-specific fields
          authenticationResult: z.string().optional(),
          authorizationResult: z.string().optional(),
          user: z.string().optional(),
          credSource: z.string().optional(),
          doorUuid: z.string().optional(),
          doorbellCameraUuid: z.string().optional(),
          previousState: z.string().optional(),
          newState: z.string().optional(),
          reason: z.string().optional(),
          buttonState: z.string().optional(),
        })
      )
      .nullable()
      .describe("Component events data for all types of access control events at a location")
  ),
  needUserInput: z.boolean().optional(),
  commandForUser: z.string().optional(),
});
