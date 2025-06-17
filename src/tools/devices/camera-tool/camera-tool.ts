import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createToolArgs,
  createToolTextContent,
  removeNullFields,
  RequestModifiers,
} from "../../../util.js";
import {
  appendQueryParams,
  AUTH_HEADERS,
  BASE_URL,
  postApi,
  STATIC_HEADERS,
} from "../../../network.js";
import { getLogger } from "../../../logger.js";
import {
  ExternalUpdateableFacetedUserConfig,
  ExternalUpdateableFacetedUserConfigSchema,
} from "./types.js";
import {
  addConfirmationParams,
  isConfirmed,
  requireConfirmation,
} from "../../../utils/confirmation.js";

const logger = getLogger("camera-tool");

async function getImageForCameraAtTime(
  cameraUuid: string,
  timestampMs: number,
  requestModifiers?: RequestModifiers
) {
  const url = BASE_URL + "/video/getExactFrameUri";
  const body = JSON.stringify({
    cameraUuid: cameraUuid,
    downscaleFactor: 10,
    jpgQuality: 70,
    permyriadCropHeight: 10000,
    permyriadCropWidth: 5625,
    permyriadCropX: 2188,
    permyriadCropY: 0,
    timestampMs: timestampMs,
  });
  logger.debug(`Getting frameUri from UUID: ${cameraUuid} at timestampMs: ${timestampMs}`);
  const base64Image = await postApi(url, body, requestModifiers).then(async res => {
    logger.debug(`Received frameUri ${res.frameUri}`);

    let requestHeaders = {
      ...(requestModifiers?.headers || AUTH_HEADERS),
      ...STATIC_HEADERS,
      accept: "image/jpeg",
    };

    if (requestModifiers?.query)
      res.frameUri = appendQueryParams(res.frameUri, requestModifiers.query);

    logger.trace(`Fetching with headers\n${JSON.stringify(requestHeaders)}`);

    return await fetch(res.frameUri, {
      method: "GET",
      headers: requestHeaders as HeadersInit,
    }).then(async res => {
      if (!res.ok) {
        logger.error(`Failed to fetch image: ${await res.text()}`);
        logger.error(res);
        return null;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      return base64;
    });
  });
  if (!base64Image) {
    return {
      success: false,
      status: "failed to fetch image",
    };
  }
  return {
    success: true,
    status: "successfully fetched image",
    imageType: "base64",
    imageData: base64Image,
  };
}

export async function getCameraSettings(cameraUuid: string, requestModifiers?: RequestModifiers) {
  const res = await postApi(
    `${BASE_URL}/camera/getFacetedConfig`,
    JSON.stringify({
      deviceUuid: cameraUuid,
    }),
    requestModifiers
  );

  if (res.error) {
    return {
      success: false,
      status: "failed to fetch camera settings",
    };
  }

  return {
    success: true,
    config: res.config,
    status: "fetched camera settings",
  };
}

export async function updateCameraSettings(
  cameraUuid: string,
  update: ExternalUpdateableFacetedUserConfig,
  requestModifiers?: RequestModifiers
) {
  // remove any "null" values
  const res = await postApi(
    `${BASE_URL}/camera/updateFacetedConfig`,
    JSON.stringify({
      configUpdate: {
        deviceUuid: cameraUuid,
        ...removeNullFields(update),
      },
    }),
    requestModifiers
  );

  if (res.error) {
    return {
      success: false,
      status: "failed to update camera settings",
    };
  }

  return {
    success: true,
    config: res.config,
    status: "updated camera settings",
  };
}

export function createTool(server: McpServer) {
  server.tool(
    "camera-tool",
    `
This tool can perform some action pertaining to the video stream of a camera. There are two types of requests
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
 •	Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects. \n
 •	Scene Context: Metadata such as camera ID, location name, timestamp, and motion detection status if available. \n•	Enriched Data Potential: The image can be paired with AI models or downstream analytics to extract insights such as: \n•	Number and type of objects in frame (e.g., humans, cars, packages) \n•	Unusual behaviors (e.g., loitering, unauthorized access) \n•	Environmental conditions (e.g., lighting, obstruction, cleanliness) \nUse Cases: \n•	Verify what triggered a motion alert or analytic rule. \n•	Provide visual context for access events or alarms. \n•	Support live incident triage or retrospective investigations. \n•	Feed contextual imagery to agents making security or operational decisions. \nInvocation Notes: \nTo use this tool correctly, the agent should provide the specific camera identifier or location name. If possible, include the intent (e.g., "verify unauthorized access", "identify vehicle", "check for obstructions") to enhance downstream processing or summarization.
 
If the requestType is "get-settings":

THIS TOOL UPDATES AND SETS DATA.

This tool will return a JSON object that represents the current configuration for a camera.
This often includes information such as:
- device settings
- associated sensor settings
- camera settings

In general, the JSON object's keys are self-explanatory of what the value does

If the requestType is "update-settings":

THIS TOOL UPDATES AND SETS DATA.

You can call call this tool with requestType "get-settings" and/or with "image" first to get a better idea of what needs to be updated.
This tool will update the configuration for a camera with the "configUpdate" parameter passed into the tool.
Thus, "configUpdate' is a necessary parameter if updating settings.
Please make sure you only update the necessary fields, since any unnecessary changes may cause the camera to behave improperly.
It may be a good idea to call "image" on this tool again after updating settings to make sure the new settings were effective in fulfilling
the user's request.
`,
    addConfirmationParams(
      createToolArgs({
        requestType: z.enum(["image", "get-settings", "update-settings"]),
        timestampMs: z.nullable(z.number()).describe(`
          the timestamp in milliseconds. You can default to the current time if the user didn't specify a time, or you can call time-tool to parse the user's time description
          `),
        cameraUuid: z.nullable(z.string()).describe("the camera uuid requested"),
        configUpdate: ExternalUpdateableFacetedUserConfigSchema.nullable(),
      })
    ),
    async ({ cameraUuid, timestampMs, requestType, configUpdate, requestModifiers, confirmationId }) => {
      if (!cameraUuid) {
        return {
          content: [
            {
              type: "text",
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
                  type: "text",
                  text: JSON.stringify({
                    needUserInput: true,
                    commandForUser: "At what time?",
                  }),
                },
              ],
            };
          }

          response = await getImageForCameraAtTime(cameraUuid, timestampMs, requestModifiers);
          if (!response.success || !response.imageData) {
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          return {
            content: [
              {
                type: "image",
                data: response.imageData,
                mimeType: "image/jpeg",
              },
            ],
          };

        case "get-settings":
          response = await getCameraSettings(cameraUuid, requestModifiers);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        case "update-settings":
          const confirmation = requireConfirmation(confirmationId);

          if (!isConfirmed(confirmation)) {
            return confirmation;
          }

          if (!configUpdate) {
            return createToolTextContent("Missing configUpdate");
          }
          response = await updateCameraSettings(cameraUuid, configUpdate, requestModifiers);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
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
            type: "text",
            text: JSON.stringify({ response }),
          },
        ],
      };
    }
  );
}
