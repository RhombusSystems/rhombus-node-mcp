import { z } from "zod";
import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum SearchToolRequestType {
  LICENSE_PLATE = "license-plate",
  OBJECT_BY_COLOR = "object-by-color",
  OBJECT_BY_TEXT = "object-by-text",
  MOTION_SEARCH = "motion-search",
}

export const TOOL_ARGS = {
  requestType: z.nativeEnum(SearchToolRequestType).describe("The type of search to perform."),
  query: z
    .string()
    .nullable()
    .describe("The search query string. Required for 'license-plate' (plate number), 'object-by-text' (text description of object), 'object-by-color' (color name)."),
  cameraUuid: z
    .string()
    .nullable()
    .describe("The UUID of the camera to search. Required for 'motion-search' and 'object-by-color'."),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Start time for the search range." + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End time for the search range." + ISOTimestampFormatDescription),
  deviceUuids: z
    .array(z.string())
    .nullable()
    .describe("Optional list of device UUIDs to filter search results."),
  locationUuids: z
    .array(z.string())
    .nullable()
    .describe("Optional list of location UUIDs to filter search results."),
  timeZone: z
    .string()
    .nullable()
    .describe("The timezone for formatting timestamps."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  licensePlateResults: z
    .array(
      z.object({
        licensePlate: z.string().optional(),
        deviceUuid: z.string().optional(),
        timestampMs: z.number().optional(),
        confidence: z.number().optional(),
      })
    )
    .optional()
    .describe("License plate search results"),
  objectColorResults: z
    .array(
      z.object({
        deviceUuid: z.string().optional(),
        timestampMs: z.number().optional(),
        objectType: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .optional()
    .describe("Object color search results"),
  objectTextResults: z
    .array(
      z.object({
        deviceUuid: z.string().optional(),
        timestampMs: z.number().optional(),
        score: z.number().optional(),
      })
    )
    .optional()
    .describe("Object text search results"),
  motionResults: z
    .array(
      z.object({
        timestampMs: z.number().optional(),
        motionScore: z.number().optional(),
      })
    )
    .optional()
    .describe("Motion search results"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
