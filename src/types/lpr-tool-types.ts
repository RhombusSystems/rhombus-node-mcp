import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum LprToolRequestType {
  GET_VEHICLE_EVENTS = "get-vehicle-events",
  GET_SAVED_VEHICLES = "get-saved-vehicles",
  GET_VEHICLE_LABELS = "get-vehicle-labels",
  SEARCH_LICENSE_PLATES = "search-license-plates",
  SAVE_VEHICLE = "save-vehicle",
  UPDATE_VEHICLE = "update-vehicle",
  DELETE_VEHICLE = "delete-vehicle",
  ADD_VEHICLE_LABEL = "add-vehicle-label",
  REMOVE_VEHICLE_LABEL = "remove-vehicle-label",
}

export const VehicleEventsArgs = z.object({
  deviceUuidFilter: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "Filter license plate events by device UUIDs. An empty array will be the same as omitting the filter."
    ),
  locationUuidFilter: z
    .array(createUuidSchema())
    .nullable()
    .describe(
      "Filter license plate events by location UUIDs. An empty array will be the same as omitting the filter."
    ),
  vehicleLabelQuery: z
    .array(z.string())
    .nullable()
    .describe(
      "Filter license plates by vehicle labels. This will do a substring search on vehicle events with these labels."
    ),
  licensePlateFuzzyQuery: z
    .string()
    .nullable()
    .describe(
      "Filter license plates by fuzzy search. This will do a fuzzy search on vehicle events with this license plate. You'll likely want to use this more often than vehicleLabelQuery."
    ),

  // startTime and endTime are required because this endpoint could potentially return a lot of data
  startTime: z
    .string()
    .datetime({
      message: "Invalid datetime string. Expected ISO 8601 format.",
      offset: true,
    })
    .describe(
      "The start of the time range (inclusive) for filtering license plate events." +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({
      message: "Invalid datetime string. Expected ISO 8601 format.",
      offset: true,
    })
    .describe(
      "The end of the time range (inclusive) for filtering license plate events." +
        ISOTimestampFormatDescription
    ),
});
export type VehicleEventsArgs = z.infer<typeof VehicleEventsArgs>;

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(LprToolRequestType)
    .describe(
      `Org LPR operation (vehicle events, saved vehicles, labels, plate search, save vehicle). Per-camera VOD timeline seekpoints use events-tool (eventType camera).
- get-vehicle-events: detected plate events. Recognition can be a PARTIAL match — keep that in mind when asserting a plate was seen. When a saved vehicle has a label, its events carry that label.
- get-saved-vehicles: plates users saved (optionally named/labelled).
- get-vehicle-labels: the org's vehicle labels. For any label question, best practice is get-vehicle-labels first, then get-vehicle-events.
Pair events to locations by NAME via location-tool — never show location UUIDs in responses or reports.`
    ),
  vehicleEventsArgs: VehicleEventsArgs.nullable().describe(
    "Only necessary for requestType 'get-vehicle-events'. Can return a lot of data — if the user gives no time range, 7 days is a reasonable default."
  ),
  timeZone: z
    .string()
    .describe(
      "The timezone for formatting timestamps which should come from the location of the device for the LPR event, or the user's timezone. This is necessary for the tool to produce accurate formatted timestamps."
    ),
  licensePlateQuery: z.string().nullable().describe("License plate number to search. Required for 'search-license-plates'."),
  vehicleName: z
    .string()
    .nullable()
    .describe(
      "Name for the vehicle. Required for 'save-vehicle'; for 'update-vehicle' it is the new name (omit to leave it unchanged)."
    ),
  vehicleLicensePlate: z
    .string()
    .nullable()
    .describe(
      "License plate for the vehicle. This is the vehicle's identity — there is no separate UUID. Required for 'save-vehicle', 'update-vehicle', 'delete-vehicle', 'add-vehicle-label' and 'remove-vehicle-label'. A plate cannot be edited: to correct a mistyped plate, 'delete-vehicle' the wrong one and 'save-vehicle' the right one."
    ),
  vehicleDescription: z
    .string()
    .nullable()
    .describe(
      "Description for the vehicle. Optional for 'save-vehicle'; for 'update-vehicle' it is the new description (omit to leave it unchanged)."
    ),
  vehicleLabel: z
    .string()
    .nullable()
    .describe("A single vehicle label name. Required for 'add-vehicle-label' and 'remove-vehicle-label'."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

// cherry-picked fields from /getVehicleEvents
const VehicleEvent = z.object({
  uuid: createUuidSchema().describe("The UUID of the license plate event."),
  deviceUuid: z
    .string()
    .optional()
    .describe("The UUID of the device that emitted the license plate event."),
  eventTimestamp: z.string().optional().describe("The timestamp of the license plate event."),
  imageS3Key: z
    .string()
    .optional()
    .describe("The S3 key of the image of the license plate event. Do not modify this."),
  thumbnailS3Key: z
    .string()
    .optional()
    .describe("The S3 key of the thumbnail of the license plate event. Do not modify this."),
  locationUuid: z
    .string()
    .optional()
    .describe("The UUID of the location that emitted the license plate event."),
  vehicleLicensePlate: z
    .string()
    .optional()
    .describe("The license plate of the vehicle that was detected."),
});
export type VehicleEvent = z.infer<typeof VehicleEvent>;

const VehicleLabels = z.record(z.string(), z.array(z.string()));
export type VehicleLabels = z.infer<typeof VehicleLabels>;

const SavedVehicle = z.object({
  createdTimestamp: z.string().describe("The timestamp of the saved vehicle."),
  name: z.string().describe("The name of the saved vehicle."),
  description: z.string().describe("The description of the saved vehicle."),
  licensePlate: z.string().describe("The license plate of the saved vehicle."),
  orgUuid: createUuidSchema().describe(
    "The UUID of the organization that the saved vehicle belongs to."
  ),
});
export type SavedVehicle = z.infer<typeof SavedVehicle>;

export const OUTPUT_SCHEMA = z.object({
  vehicleEvents: z
    .array(VehicleEvent)
    .optional()
    .describe(
      `A list of license plate events, as requested by the request type${LprToolRequestType.GET_VEHICLE_EVENTS}`
    ),
  vehicleLabels: VehicleLabels.optional().describe(
    `A list of vehicle labels, as requested by the request type${LprToolRequestType.GET_VEHICLE_LABELS}`
  ),
  savedVehicles: z
    .array(SavedVehicle)
    .optional()
    .describe(
      `A list of saved vehicles, as requested by the request type${LprToolRequestType.GET_SAVED_VEHICLES}`
    ),
  licensePlateSearchResults: z.array(z.object({
    licensePlate: z.string().optional(),
    deviceUuid: z.string().optional(),
    timestampMs: z.number().optional(),
  })).optional().describe("License plate search results"),
  saveVehicleResult: z.object({
    success: z.boolean().optional(),
    licensePlate: z.string().optional(),
  }).optional().describe("Result of saving or updating a vehicle"),
  deleteVehicleResult: z.object({
    success: z.boolean().optional(),
    licensePlate: z.string().optional(),
  }).optional().describe("Result of deleting a saved vehicle"),
  vehicleLabelResult: z.object({
    success: z.boolean().optional(),
    licensePlate: z.string().optional(),
    label: z.string().optional(),
  }).optional().describe("Result of adding or removing a vehicle label"),
  note: z
    .string()
    .optional()
    .describe("A caveat about this result that the user needs to be told."),
  warningMsg: z
    .string()
    .optional()
    .describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
