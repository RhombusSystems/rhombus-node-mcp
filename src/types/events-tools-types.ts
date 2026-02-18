import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { ComponentEventEnumType } from "./schema-components.js";
import { HumanEvent } from "../api/events-tool-api.js";
import { TempUnit } from "../utils/temp.js";

export enum EventsToolRequestType {
  ACCESS_CONTROL = "access-control",
  ENVIRONMENTAL_GATEWAY = "environmental-gateway",
  CLIMATE_SENSOR = "climate-sensor",
  COMPONENT_EVENTS = "component-events",
  CAMERA = "camera",
}

export const TOOL_ARGS = {
  eventType: z
    .nativeEnum(EventsToolRequestType)
    .describe(
      "The type of events to retrieve. " +
        "access-control: Access control events like unlocks, badge ins, credentials, arrivals. " +
        "environmental-gateway: Environmental gateway events with sensor readings and derived values. " +
        "climate-sensor: Climate sensor events with temperature, humidity, air quality readings. " +
        "component-events: All types of component events for a location (most flexible option). " +
        "camera: Human motion events detected by cameras."
    ),
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
  cameraUuid: z
    .string()
    .nullable()
    .describe(
      "The unique identifier for the camera. Required when eventType is 'camera'. Can be obtained from the get-entity-tool for CAMERA."
    ),
  duration: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe(
      "Duration in seconds to search for human motion events. Required when eventType is 'camera'. Default is 3600 (1 hour)."
    ),
  tempUnit: z
    .nativeEnum(TempUnit)
    .nullable()
    .describe("The unit of temperature to return. Default is Celsius."),
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

  probeTemp: z.number().optional().describe("Temperature from probe sensor"),

  // probeTempC: z.number().optional().describe("Temperature from probe sensor in Celsius"),
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
    .enum([
      "access-control",
      "environmental-gateway",
      "climate-sensor",
      "component-events",
      "camera",
    ])
    .optional(),
  accessControlEvents: z.optional(
    z
      .array(
        z.object({
          authenticationResult: z
            .string()
            .optional()
            .describe("The result of the authentication process"),
          authorizationResult: z
            .string()
            .optional()
            .describe("The result of the authorization process"),
          doorUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the access controlled door"),
          locationUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the location where the event occurred"),
          user: z
            .string()
            .optional()
            .describe("The username of the person who triggered the event"),
          credSource: z
            .string()
            .optional()
            .describe(
              "The source of the credential. Is what generated the event. " +
                "BLE_WAVE is a user badging in by physically waving their hand over the reader. " +
                "NFC is a user badging in by tapping their badge or their phone on the reader. " +
                "REMOTE is unlocking the door remotely through the Rhombus app."
            ),
          timestampMs: z
            .number()
            .optional()
            .describe("Timestamp in milliseconds when the event occurred"),
          datetime: z.string().optional().describe("Datetime string of when the event occurred"),
        })
      )
      .nullable()
      .describe(
        "Access control events data including badge ins, credentials, arrivals, etc., sorted by timestamp (newest first)."
      )
  ),
  environmentalGatewayEvents: z.optional(
    z
      .object({
        events: z
          .array(StrippedEnvironmentalEvent)
          .optional()
          .describe(
            "An array where each object represents a single environmental event containing sensor readings and derived values"
          ),
        lastEvaluatedKey: z
          .string()
          .optional()
          .describe("A key for pagination if more results are available"),
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
          eventType: z
            .string()
            .optional()
            .describe(
              "The type of component event (e.g., DoorbellEvent, CredentialReceivedEvent, etc.)"
            ),
          componentUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the component that generated the event"),
          locationUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the location where the event occurred"),
          orgUuid: z.string().optional().describe("The unique identifier for the organization"),
          correlationId: z
            .string()
            .optional()
            .describe("A correlation ID for tracking related events"),
          ownerDeviceUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the device that owns this component"),
          datetime: z
            .string()
            .optional()
            .describe("Human-readable datetime string of when the event occurred"),
          timestampMs: z
            .number()
            .optional()
            .describe("Timestamp in milliseconds when the event occurred"),
          uuid: z.string().optional().describe("The unique identifier for this specific event"),
          // Event-specific fields
          authenticationResult: z
            .string()
            .optional()
            .describe("The result of the authentication process (for credential events)"),
          authorizationResult: z
            .string()
            .optional()
            .describe("The result of the authorization process (for credential events)"),
          user: z
            .string()
            .optional()
            .describe("The username of the person who triggered the event (for credential events)"),
          credSource: z
            .string()
            .optional()
            .describe("The source of the credential (for credential events)"),
          doorUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the door (for door-related events)"),
          doorbellCameraUuid: z
            .string()
            .optional()
            .describe("The unique identifier for the doorbell camera (for doorbell events)"),
          previousState: z
            .string()
            .optional()
            .describe("The previous state before the change (for state change events)"),
          newState: z
            .string()
            .optional()
            .describe("The new state after the change (for state change events)"),
          reason: z.string().optional().describe("The reason for the state change or event"),
          buttonState: z
            .string()
            .optional()
            .describe("The state of the button (for button events)"),
        })
      )
      .nullable()
      .describe(
        "Component events data for all types of access control events at a location, sorted by timestamp (newest first)"
      )
  ),
  cameraEvents: z
    .array(HumanEvent)
    .optional()
    .describe(`Camera events data, as requested with requestType ${EventsToolRequestType.CAMERA}`),
  needUserInput: z.boolean().optional(),
  commandForUser: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
