import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum LprToolRequestType {
  GET_VEHICLE_EVENTS = "get-vehicle-events",
  GET_SAVED_VEHICLES = "get-saved-vehicles",
  GET_VEHICLE_LABELS = "get-vehicle-labels",
}

export const VehicleEventsArgs = z.object({
  deviceUuidFilter: z.array(createUuidSchema()).nullable(),
  locationUuidFilter: z.array(createUuidSchema()).nullable(),
  vehicleLabelQuery: z.array(z.string()).nullable(),
  licensePlateFuzzyQuery: z.string().nullable(),

  // startTime and endTime are required because this endpoint could potentially return a lot of data
  startTime: z
    .string()
    .datetime({
      message: "Invalid datetime string. Expected ISO 8601 format.",
      offset: true,
    })
    .describe(
      "The end of the time range (inclusive) for filtering face events. If not specified, the filter defaults to the last 7 days." +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({
      message: "Invalid datetime string. Expected ISO 8601 format.",
      offset: true,
    })
    .describe(
      "The start of the time range (inclusive) for filtering face events. If not specified, the filter defaults to the last 7 days." +
        ISOTimestampFormatDescription
    ),
});
export type VehicleEventsArgs = z.infer<typeof VehicleEventsArgs>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(LprToolRequestType),
  vehicleEventsArgs: VehicleEventsArgs.nullable().describe(
    "Only necessary for requestType 'get-vehicle-events'"
  ),
  timeZone: z
    .string()
    .describe(
      "The timezone for formatting timestamps which should come from the location of the device for the LPR event, or the user's timezone. This is necessary for the tool to produce accurate formatted timestamps."
    ),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

// cherry-picked fields from /getVehicleEvents
const VehicleEvent = z.object({
  uuid: createUuidSchema(),
  deviceUuid: z.string().optional(),
  eventTimestamp: z.string().optional(),
  imageS3Key: z.string().optional(),
  locationUuid: z.string().optional(),
  vehicleLicensePlate: z.string().optional(),
});
export type VehicleEvent = z.infer<typeof VehicleEvent>;

const VehicleLabels = z.record(z.string(), z.array(z.string()));
export type VehicleLabels = z.infer<typeof VehicleLabels>;

const SavedVehicle = z.object({
  createdTimestamp: z.string(),
  name: z.string(),
  description: z.string(),
  licensePlate: z.string(),
  orgUuid: createUuidSchema(),
});
export type SavedVehicle = z.infer<typeof SavedVehicle>;

export const OUTPUT_SCHEMA = z.object({
  vehicleEvents: z.array(VehicleEvent).optional(),
  vehicleLabels: VehicleLabels.optional(),
  savedVehicles: z.array(SavedVehicle).optional(),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
