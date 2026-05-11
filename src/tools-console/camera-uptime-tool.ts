import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCameraUptime, getFleetUptime } from "../api/camera-uptime-tool-api.js";
import {
  CameraUptimeRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/camera-uptime-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "camera-uptime-tool";

const TOOL_DESCRIPTION = `
This tool analyzes camera uptime and reliability over a time period. It computes uptime percentages, outage counts, and longest outage durations.

It has the following modes of operation, determined by the "requestType" parameter:
- ${CameraUptimeRequestType.GET_CAMERA_UPTIME}: Get uptime statistics for a single camera. Requires cameraUuid, startTimeSec, and endTimeSec.
- ${CameraUptimeRequestType.GET_FLEET_UPTIME}: Get uptime statistics for ALL cameras in the organization, sorted by worst uptime first. Includes a fleet-wide summary with averages. Requires startTimeSec and endTimeSec.

startTimeSec and endTimeSec are UNIX timestamps in seconds.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case CameraUptimeRequestType.GET_CAMERA_UPTIME: {
        if (!args.cameraUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "cameraUuid is required for get-camera-uptime.",
          });
        }
        const cameraUptime = await getCameraUptime(
          args.cameraUuid,
          args.startTimeSec,
          args.endTimeSec,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ cameraUptime });
      }
      case CameraUptimeRequestType.GET_FLEET_UPTIME: {
        const result = await getFleetUptime(
          args.startTimeSec,
          args.endTimeSec,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          fleetUptime: result.cameras,
          fleetSummary: result.summary,
        });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
