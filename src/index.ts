#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const FIVE_SECONDS_MS = 5 * 1000;

const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

if (!RHOMBUS_API_KEY) {
  console.error("Missing RHOMBUS_API_KEY");
}

const enableLogs = process.env.ENABLE_LOGS;

const BASE_URL = "https://api2.rhombussystems.com/api";

const STATIC_HEADERS = {
  "Content-Type": "application/json",
  accept: "application/json",
};

const AUTH_HEADERS = {
  "x-auth-apikey": RHOMBUS_API_KEY,
  "x-auth-scheme": "api-token",
  "x-rhombus-agent": "chatbot",
};

const server = new McpServer({
  name: "rhombus",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const STATIC_ARGS = {
  headers: z
    .optional(z.any())
    .describe("Optional headers accepted by tools.  LLM should never ever use this. 😅"),
};

const log = (msg: string) => {
  if (!enableLogs) return;
  console.error(msg);
};

async function postApi(url: string, body: string, customHeaders: any) {
  let headers = {
    ...(customHeaders || AUTH_HEADERS),
    ...STATIC_HEADERS,
  };

  try {
    log(`[POSTAPI] REQUEST - ${url} - ${body} - ${JSON.stringify(customHeaders)}`);
    const response = await fetch(url, { method: "POST", headers, body });
    log(`[POSTAPI] RESPONSE - ${JSON.stringify(response || {})}`);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          error: true,
          status:
            "Sorry, I don't have permission to help with this request.  Consider upgrading my permissions by changing the role of the API Key I am using.",
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      error: true,
      status: `Request Error: ${error}`,
    };
  }
}

async function getOrg(headers?: any) {
  const url = BASE_URL + "/org/getOrgV2";
  return await postApi(url, "{}", headers);
}

async function getLocations(headers?: any) {
  const url = BASE_URL + "/location/getLocationsV2";
  return await postApi(url, "{}", headers);
}

async function getCameraList(headers?: any) {
  const url = BASE_URL + "/camera/getMinimalCameraStateList";
  return await postApi(url, "{}", headers).then(response => {
    return {
      cameraStates: response.cameraStates.filter(
        (camera: { locationUuid?: string }) => !!camera.locationUuid
      ),
    };
  });
}

async function getAccessControlledDoors(headers?: any) {
  const url = BASE_URL + "/component/findAccessControlledDoors";
  return await postApi(url, "{}", headers);
}

async function getFaceEvents(_locationUuid?: string, headers?: any) {
  const nowMs = Date.now();
  const rangeStartMs = nowMs - THREE_HOURS_MS;
  const rangeEndMs = nowMs - FIVE_SECONDS_MS;
  const body = JSON.stringify({
    pageRequest: {
      lastEvaluatedKey: undefined,
      maxPageSize: 75,
    },
    searchFilter: {
      deviceUuids: [],
      faceNames: [],
      labels: [],
      locationUuids: [],
      personUuids: [],
      timestampFilter: {
        rangeStart: rangeStartMs,
        rangeEnd: rangeEndMs,
      },
    },
  });
  const response = await postApi(
    BASE_URL + "/faceRecognition/faceEvent/findFaceEventsByOrg",
    body,
    headers
  ).then(response => {
    return {
      faceEvents: (response.faceEvents || []).map((event: any) => ({
        ...event,
        eventTimestamp: new Date(event.eventTimestamp).toString(),
      })),
    };
  });
  return response;
}

async function getAccessControlEvents(doorUuid: string, headers?: any) {
  const url = BASE_URL + "/component/findComponentEventsByAccessControlledDoor";
  const body = JSON.stringify({
    limit: 50,
    accessControlledDoorUuid: doorUuid,
  });
  const response = await postApi(url, body, headers).then(response => ({
    componentEvents: (response.componentEvents || []).map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestampMs).toString(),
    })),
  }));
  return response;
}

async function rebootCameras(cameraUuids: string[], headers?: any) {
  const url = BASE_URL + "/camera/reboot";
  let successCount = 0;
  let errorCount = 0;
  for (const cameraUuid in cameraUuids) {
    try {
      const body = JSON.stringify({ cameraUuid: cameraUuid });
      const response = await postApi(url, body, headers);
      if (response.error) {
        errorCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      const ret = `Error rebooting cameras: ${error}`;
      return { error: true, status: ret };
    }

    let status;
    if (successCount === cameraUuids.length) status = "SUCCESS";
    else if (successCount > 0 && successCount < cameraUuids.length) status = "PARTIAL_SUCCESS";
    else status = "ERROR";

    return { status, successCount, errorCount };
  }
}

async function getImageForCameraAtTime(cameraUuid: string, timestampMs: number, headers?: any) {
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
  const base64Image = await postApi(url, body, headers).then(async res => {
    return await fetch(res.frameUri, { method: "GET", headers: headers }).then(async res => {
      if (!res.ok) return null;
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

server.tool(
  "get-org-information",
  "Get general information about the organization including org name, camera configuration defaults, contact information, and org settings.",
  { ...STATIC_ARGS },
  async ({ headers }) => {
    const org = await getOrg(headers);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(org),
        },
      ],
    };
  }
);

server.tool(
  "get-entity-tool",
  "get a list of entities like cameras, access controlled doors, sensors, etc",
  {
    entityType: z
      .enum(["camera", "access-controlled-doors"])
      .describe("The entity type to retreive.  Example: cameras."),
    ...STATIC_ARGS,
  },
  async ({ entityType, headers }) => {
    let ret;
    switch (entityType) {
      case "camera":
        ret = await getCameraList(headers);
        break;
      case "access-controlled-doors":
        ret = await getAccessControlledDoors(headers);
        break;
      default:
        ret = {};
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(ret),
        },
      ],
    };
  }
);

server.tool(
  "camera-tool",
  "get specific requested information about a camera such as an image snapshot, or detailed analytics info.  this can be used to answer questions about tracking people across cameras",
  {
    requestType: z.enum(["image"]),
    timestampMs: z.optional(z.number()).describe("the timestamp in milliseconds"),
    cameraUuid: z.optional(z.string()).describe("the camera uuid requested"),
    ...STATIC_ARGS,
  },
  async ({ cameraUuid, timestampMs, requestType, headers }) => {
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
        response = await getImageForCameraAtTime(cameraUuid, timestampMs, headers);
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
        break;
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

server.tool(
  "events-tool",
  "event data for certain types of information like faces and license plates",
  {
    eventType: z.enum(["faces", "people", "access-control"]),
    locationUuid: z.optional(z.string()),
    accessControlledDoorUuid: z.optional(z.string()),
    ...STATIC_ARGS,
  },
  async ({ eventType, locationUuid, accessControlledDoorUuid, headers }) => {
    if (eventType === "faces" || eventType === "people") {
      const response = await getFaceEvents(locationUuid, headers);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    }

    if (eventType === "access-control") {
      if (!accessControlledDoorUuid) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                needUserInput: true,
                commandForUser: "Which door are you asking about?",
              }),
            },
          ],
        };
      } else {
        const events = await getAccessControlEvents(accessControlledDoorUuid, headers);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events),
            },
          ],
        };
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({}),
        },
      ],
    };
  }
);

server.tool(
  "location-tool",
  "contains basic operations for locations and response in JSON format.",
  {
    action: z.enum(["get"]),
    locationUpdate: z.optional(z.object({ uuid: z.string(), name: z.optional(z.string()) })),
    ...STATIC_ARGS,
  },
  async ({ action, locationUpdate, headers }) => {
    let ret;
    switch (action) {
      case "get":
        ret = await getLocations(headers);
        break;
      default:
        ret = { error: true, status: `unsupported location tool call: ${action}` };
        break;
    }

    return {
      content: [{ type: "text", text: JSON.stringify(ret) }],
    };
  }
);

server.tool(
  "reboot-cameras",
  "this tool is for rebooting one or more cameras causing them to reconnect to the server, this is a helpful option when a camera is experiencing connectivity issues or is in need of troubleshooting",
  {
    cameraUuids: z
      .array(z.string())
      .describe("An array of camera UUID strings which are unique identifiers for cameras"),
    ...STATIC_ARGS,
  },
  async ({ cameraUuids, headers }) => {
    const cameraRebootData = await rebootCameras(cameraUuids, headers);

    if (!cameraRebootData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to reboot cameras",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(cameraRebootData),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
