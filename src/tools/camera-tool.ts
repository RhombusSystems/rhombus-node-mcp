import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCameraSettings, getImageForCameraAtTime, getCameraMediaUris, getCameraAIThresholds } from "../api/camera-tool-api.js";
import { getLogger } from "../logger.js";
import { BASE_TOOL_ARGS, type ToolArgs } from "../types/camera-tool-types.js";
import { extractFromToolExtra } from "../util.js";

const TOOL_NAME = "camera-tool";

const TOOL_DESCRIPTION = `
This tool can perform some action pertaining to the video stream of a camera. There are four types of requests
that can be passed into "requestType":
- image
- get-settings
- get-media-uris
- get-ai-thresholds

What follows is a description of the behavior of this tool given the requestType "image"

This tool should be used any time someone wants to specify a subset of cameras to use for a task, based on some features that the camera sees.  For example, interior cameras, cameras facing the street, cameras with a view of X, Y, Z, etc.

For instance if someone says "I want X using cameras with Y" then this tool should get a snapshot of the image to answer the question of if the camera satisfies the Y predicate.

This tool captures and returns a real-time snapshot from a designated security camera.
The image reflects the current scene in the camera's field of view and serves as a contextual
input source for downstream tasks such as object recognition, anomaly detection, incident investigation,
or situational assessment. When invoked, the tool provides the following: 
- Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects.  
- The frameUri that was used to fetch the image. It may be useful to show the user this image as well through the frameUri.

What follows is a description of the behavior of this tool given the requestType "get-settings"

This tool retrieves the current configuration for a specified camera or associated device (e.g., sensor, access controller). The returned JSON object can include detailed camera settings (e.g., resolution, bitrate) and various device-specific configurations (e.g. storage settings).

NOTE: To update camera settings, use the update-tool instead.
`;

const logger = getLogger("camera-tool");

const TOOL_ARGS = BASE_TOOL_ARGS;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
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

  // biome-ignore lint/suspicious/noExplicitAny: this will be returned, and can be any type since it will be JSON.stringify'd
  let response: any;
  const timestampMs = timestampISO ? new Date(timestampISO).getTime() : Date.now() - 1000 * 60 * 5;

  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  switch (requestType) {
    case "image":
      response = await getImageForCameraAtTime(
        cameraUuid,
        timestampMs,
        requestModifiers,
        sessionId
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
              frameUri: response.frameUri,
            }),
          },
        ],
      };

    case "get-settings":
      response = await getCameraSettings(cameraUuid, requestModifiers, sessionId);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    case "get-media-uris":
      response = await getCameraMediaUris(cameraUuid, requestModifiers, sessionId);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    case "get-ai-thresholds":
      response = await getCameraAIThresholds(cameraUuid, requestModifiers, sessionId);
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
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
    },
    TOOL_HANDLER
  );
}
