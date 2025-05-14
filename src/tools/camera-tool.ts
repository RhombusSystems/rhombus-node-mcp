import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { AUTH_HEADERS, BASE_URL, postApi, STATIC_HEADERS } from "../network.js";
import { getLogger } from "../logger.js";

const logger = getLogger("camera-tool");

async function getImageForCameraAtTime(
  cameraUuid: string,
  timestampMs: number,
  requestModifiers?: any
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
    };

    return await fetch(res.frameUri, { method: "GET", headers: requestHeaders }).then(async res => {
      if (!res.ok) {
        logger.error("Failed to fetch image");
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

export function createTool(server: McpServer) {
  server.tool(
    "camera-tool",
    'This tool captures and returns a real-time snapshot from a designated security camera. The image reflects the current scene in the camera\'s field of view and serves as a contextual input source for downstream tasks such as object recognition, anomaly detection, incident investigation, or situational assessment. When invoked, the tool provides the following: \n •	Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects. \n•	Scene Context: Metadata such as camera ID, location name, timestamp, and motion detection status if available. \n•	Enriched Data Potential: The image can be paired with AI models or downstream analytics to extract insights such as: \n•	Number and type of objects in frame (e.g., humans, cars, packages) \n•	Unusual behaviors (e.g., loitering, unauthorized access) \n•	Environmental conditions (e.g., lighting, obstruction, cleanliness) \nUse Cases: \n•	Verify what triggered a motion alert or analytic rule. \n•	Provide visual context for access events or alarms. \n•	Support live incident triage or retrospective investigations. \n•	Feed contextual imagery to agents making security or operational decisions. \nInvocation Notes: \nTo use this tool correctly, the agent should provide the specific camera identifier or location name. If possible, include the intent (e.g., "verify unauthorized access", "identify vehicle", "check for obstructions") to enhance downstream processing or summarization.',
    createToolArgs({
      requestType: z.enum(["image"]),
      timestampMs: z
        .optional(z.number())
        .describe("the timestamp in milliseconds which should always be obtained using time-tool"),
      cameraUuid: z.optional(z.string()).describe("the camera uuid requested"),
    }),
    async ({ cameraUuid, timestampMs, requestType, requestModifiers }) => {
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

      let response;

      switch (requestType) {
        case "image":
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
        default:
          response = {
            error: true,
            status: "mising unknown type from tool call",
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
