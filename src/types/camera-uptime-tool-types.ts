import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum CameraUptimeRequestType {
  GET_CAMERA_UPTIME = "get-camera-uptime",
  GET_FLEET_UPTIME = "get-fleet-uptime",
}

/**
 * Mirrors the webservice's UptimeSourceEnum.
 *
 * Kept as a local enum rather than read off the generated schema so this file
 * does not have to wait on a schema regeneration
 * (`yarn update-schema --mcp <path>` in rhombus-cloud-frontend).
 */
export enum UptimeSource {
  /** Real hardware heartbeat uptime. The numbers mean what they say. */
  HARDWARE = "HARDWARE",
  /**
   * Derived from recorded video, for cameras with no Rhombus hardware of their
   * own (3rd party cameras). A proxy for uptime, not a heartbeat.
   */
  MEDIA_PRESENCE = "MEDIA_PRESENCE",
  /**
   * No uptime signal exists for this camera. The stats are omitted entirely -
   * this is NOT zero uptime and the camera must not be reported as down.
   */
  UNAVAILABLE = "UNAVAILABLE",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(CameraUptimeRequestType)
    .describe("The type of uptime request to make."),
  cameraUuid: z
    .string()
    .nullable()
    .describe("Camera UUID. Required for 'get-camera-uptime'."),
  startTimeSec: z
    .number()
    .describe("Start time as UNIX timestamp in seconds. Required for all requests."),
  endTimeSec: z
    .number()
    .describe("End time as UNIX timestamp in seconds. Required for all requests."),
  includeFields: INCLUDE_FIELDS_ARG,
  filterBy: FILTER_BY_ARG,
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const CameraUptimeSchema = z.object({
  cameraUuid: z.string().optional(),
  cameraName: z.string().optional(),
  locationUuid: z.string().optional(),
  totalUptimeSeconds: z.number().optional(),
  totalPeriodSeconds: z.number().optional(),
  uptimePercentage: z.number().optional(),
  outageCount: z.number().optional(),
  longestOutageSeconds: z.number().optional(),
  uptimeSource: z
    .nativeEnum(UptimeSource)
    .optional()
    .describe(
      "Where these numbers came from. UNAVAILABLE means no uptime signal exists for this " +
        "camera and the stats are omitted - report it as unknown, never as down or as 0% uptime."
    ),
});

export const OUTPUT_SCHEMA = z.object({
  cameraUptime: CameraUptimeSchema.optional().describe("Uptime stats for a single camera"),
  fleetUptime: z
    .array(CameraUptimeSchema)
    .optional()
    .describe("Uptime stats for all cameras in the fleet, sorted by worst uptime first"),
  fleetSummary: z
    .object({
      totalCameras: z.number().optional(),
      camerasWithKnownUptime: z.number().optional(),
      camerasWithUnknownUptime: z
        .number()
        .optional()
        .describe("Cameras with no uptime signal. Excluded from the average and from worstCamera."),
      averageUptimePercentage: z.number().optional(),
      worstCamera: z.string().optional(),
      worstUptimePercentage: z.number().optional(),
    })
    .optional()
    .describe("Fleet-wide uptime summary"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
