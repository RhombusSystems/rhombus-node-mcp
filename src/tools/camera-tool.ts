import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getLogger } from "../logger.js";
import { getCameraSettings, getImageForCameraAtTime } from "../api/camera-tool-api.js";
import { BASE_TOOL_ARGS, ToolArgs } from "../types/camera-tool-types.js";
import { RequestModifiers } from "../util.js";

const TOOL_NAME = "camera-tool";

const TOOL_DESCRIPTION = `
This tool can perform some action pertaining to the video stream of a camera. There are two types of requests
that can be passed into "requestType":
- image
- get-settings

What follows is a description of the behavior of this tool given the requestType "image"

This tool should be used any time someone wants to specify a subset of cameras to use for a task, based on some features that the camera sees.  For example, interior cameras, cameras facing the street, cameras with a view of X, Y, Z, etc.

For instance if someone says "I want X using cameras with Y" then this tool should get a snapshot of the image to answer the question of if the camera satisfies the Y predicate.

This tool captures and returns a real-time snapshot from a designated security camera.
The image reflects the current scene in the camera's field of view and serves as a contextual
input source for downstream tasks such as object recognition, anomaly detection, incident investigation,
or situational assessment. When invoked, the tool provides the following: 
•  Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects.  

What follows is a description of the behavior of this tool given the requestType "get-settings"

This tool retrieves the current configuration for a specified camera or associated device (e.g., sensor, access controller). The returned JSON object can include detailed camera settings (e.g., resolution, bitrate) and various device-specific configurations (e.g. storage settings).

NOTE: To update camera settings, use the update-tool instead.
`;

const logger = getLogger("camera-tool");

const TOOL_ARGS = BASE_TOOL_ARGS;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { cameraUuid, timestampISO, requestType } = args;

  if (!cameraUuid) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            needUserInput: true,
            commandForUser: "Which camera are you talking about?",
          }),
        },
      ],
    };
  }

  let response;
  const timestampMs = timestampISO
    ? new Date(timestampISO).getTime()
    : new Date().getTime() - 1000 * 60 * 5;

  switch (requestType) {
    case "image":
      response = await getImageForCameraAtTime(
        cameraUuid,
        timestampMs,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );

      if (!response.success || !response.imageData) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify(response) }],
        };
      }

      logger.debug(`Received image response:\n ${JSON.stringify(response)}`);

      return {
        content: [
          {
            type: "image" as const,
            data: response.imageData,
            mimeType: "image/jpeg",
          },
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              status: "image-attached",
              cameraUuid,
              timestampMs,
            }),
          },
        ],
      };

    case "get-settings":
      response = await getCameraSettings(
        cameraUuid,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    default:
      response = {
        error: true,
        status: "missing unknown type from tool call",
      };
      break;
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ response }),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
