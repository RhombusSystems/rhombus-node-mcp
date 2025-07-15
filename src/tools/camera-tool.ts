import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createToolTextContent, RequestModifiers } from "../util.js";
import { addConfirmationParams, isConfirmed, requireConfirmation } from "../utils/confirmation.js";
import {
  ExternalUpdateableFacetedUserConfig,
  BASE_TOOL_ARGS,
  ToolArgs,
} from "../types/camera-tool-types.js";
import {
  getImageForCameraAtTime,
  getCameraSettings,
  updateCameraSettings,
} from "../api/camera-tool-api.js";

const TOOL_NAME = "camera-tool";

const TOOL_DESCRIPTION = `
This tool can perform some action pertaining to the video stream of a camera. There are three types of requests
that can be passed into "requestType":
- image
- get-settings
- update-settings

What follows is a description of the behavior of this tool given the requestType

If the requestType is "image":

This tool captures and returns a real-time snapshot from a designated security camera.
The image reflects the current scene in the camera\'s field of view and serves as a contextual
input source for downstream tasks such as object recognition, anomaly detection, incident investigation,
or situational assessment. When invoked, the tool provides the following: \n
 •  Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects. \n
 •  Enriched Data Potential: The image can be paired with AI models or downstream analytics to extract insights such as: \n•  Number and type of objects in frame (e.g., humans, cars, packages) \n•  Unusual behaviors (e.g., loitering, unauthorized access) \n•  Environmental conditions (e.g., lighting, obstruction, cleanliness) \nUse Cases: \n•  Verify what triggered a motion alert or analytic rule. \n•  Provide visual context for access events or alarms. \n• Support live incident triage or retrospective investigations. \n• Feed contextual imagery to agents making security or operational decisions. \nInvocation Notes: \nTo use this tool correctly, the agent should provide the specific camera identifier or location name. If possible, include the intent (e.g., "verify unauthorized access", "identify vehicle", "check for obstructions") to enhance downstream processing or summarization.
 
If the requestType is "get-settings":

THIS TOOL UPDATES AND SETS DATA.

This tool retrieves the current configuration for a specified camera or associated device (e.g., sensor, access controller). The returned JSON object can include detailed camera settings (e.g., resolution, bitrate) and various device-specific configurations.
Use Cases: Retrieve the current resolution of Camera A.

If the requestType is "update-settings":

THIS TOOL UPDATES AND SETS DATA.

You can call call this tool with requestType "get-settings" and/or with "image" first to get a better idea of what needs to be updated.
This tool updates the configuration for a camera or associated device using the "configUpdate" parameter, which must be a JSON object containing the specific fields and their new values. For example, you can modify streaming parameters.
Thus, "configUpdate' is a necessary parameter if updating settings.
Please make sure you only update the necessary fields, since any unnecessary changes may cause the camera to behave improperly.
It may be a good idea to call "image" on this tool again after updating settings to make sure the new settings were effective in fulfilling
the user's request.
Use Cases: Adjust streaming parameters for Camera E.
`;

const TOOL_ARGS = addConfirmationParams(BASE_TOOL_ARGS);

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { cameraUuid, timestampMs, requestType, configUpdate, confirmationId } = args;

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

  switch (requestType) {
    case "image":
      if (!timestampMs) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                needUserInput: true,
                commandForUser: "At what time?",
              }),
            },
          ],
        };
      }

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
      return {
        content: [
          {
            type: "image" as const,
            data: response.imageData,
            mimeType: "image/jpeg",
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
    case "update-settings":
      const confirmation = requireConfirmation(confirmationId);

      if (!isConfirmed(confirmation)) {
        return confirmation;
      }

      if (!configUpdate) {
        return createToolTextContent("Missing configUpdate");
      }
      response = await updateCameraSettings(
        cameraUuid,
        configUpdate,
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
