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

// ---------------------------------------------------------------------------
// Output schema — drives the filtering proxy's auto-generated catalog of
// available includeFields / filterBy paths (unbilled: it lands on the param
// description). Fields mirror what "core" detail actually returns per type.
// ---------------------------------------------------------------------------

const ConnectedDeviceSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  connected: z
    .boolean()
    .optional()
    .describe(
      "True = online, false = offline. Filter on this for offline/online questions."
    ),
  connectionStatus: z
    .string()
    .optional()
    .describe('Raw platform status: GREEN, YELLOW, ORANGE or RED (RED = disconnected).'),
  healthStatus: z.string().optional(),
  healthStatusDetails: z.string().optional(),
  locationUuid: z.string().optional(),
  floorNumber: z.number().optional(),
  policyUuid: z.string().optional(),
});

const ClimateSensorSchema = ConnectedDeviceSchema.extend({
  // NUMBER, not a formatted string: the api layer converts the upstream
  // `temperatureCelcius` with tempFunc() and emits the raw value in whatever
  // unit `tempUnit` asked for. Declaring it a string made the SDK reject every
  // environmental-sensor call with "-32602 Output validation error" — the
  // proxy's deepOptionalizeSchema relaxes required-ness, never scalar types.
  temperature: z
    .number()
    .optional()
    .describe("Temperature in the unit requested via the tempUnit arg (Celsius by default)."),
  humidity: z.number().optional(),
  batteryStatus: z.string().optional(),
});

const AccessControlledDoorSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  locationUuid: z.string().optional(),
  policyUuid: z.string().optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  geofenceEnabled: z.boolean().optional(),
  associatedCameras: z.array(z.string()).optional(),
});

export const OUTPUT_SCHEMA = z.object({
  cameras: z.array(ConnectedDeviceSchema).optional(),
  camerasCount: z.number().optional(),
  doorbellCameras: z.array(ConnectedDeviceSchema).optional(),
  doorbellCamerasCount: z.number().optional(),
  badgeReaders: z.array(ConnectedDeviceSchema).optional(),
  badgeReadersCount: z.number().optional(),
  accessControlledDoors: z.array(AccessControlledDoorSchema).optional(),
  accessControlledDoorsCount: z.number().optional(),
  audioGateways: z.array(ConnectedDeviceSchema).optional(),
  audioGatewaysCount: z.number().optional(),
  doorStates: z.array(ConnectedDeviceSchema).optional(),
  doorStatesCount: z.number().optional(),
  climateStates: z.array(ClimateSensorSchema).optional(),
  climateStatesCount: z.number().optional(),
  occupancySensorStates: z.array(ConnectedDeviceSchema).optional(),
  occupancySensorStatesCount: z.number().optional(),
  buttonStates: z.array(ConnectedDeviceSchema).optional(),
  buttonStatesCount: z.number().optional(),
  keypadStates: z.array(ConnectedDeviceSchema).optional(),
  keypadStatesCount: z.number().optional(),
  minimalEnvironmentalGatewayStates: z.array(ConnectedDeviceSchema).optional(),
  minimalEnvironmentalGatewayStatesCount: z.number().optional(),
  filterByWarnings: z.array(z.string()).optional(),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
