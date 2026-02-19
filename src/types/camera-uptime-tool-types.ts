import { z } from "zod";

export enum CameraUptimeRequestType {
  GET_CAMERA_UPTIME = "get-camera-uptime",
  GET_FLEET_UPTIME = "get-fleet-uptime",
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
      averageUptimePercentage: z.number().optional(),
      worstCamera: z.string().optional(),
      worstUptimePercentage: z.number().optional(),
    })
    .optional()
    .describe("Fleet-wide uptime summary"),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
