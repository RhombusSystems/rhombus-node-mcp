#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CreateVideoWallOptions, CreateVideoWallOptionsT } from "./types.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { parse } from "chrono-node";
import { DateTime } from "luxon";

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const FIVE_SECONDS_MS = 5 * 1000;

const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

if (!RHOMBUS_API_KEY) {
  console.error("Missing RHOMBUS_API_KEY");
}

const enableLogs = process.env.ENABLE_LOGS;
const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

console.error("🌐 Using server url", serverUrl);

const BASE_URL = `https://${serverUrl}/api`;

const STATIC_HEADERS = {
  "Content-Type": "application/json",
  "x-rhombus-agent": "chatbot",
  accept: "application/json",
};

const AUTH_HEADERS = {
  "x-auth-apikey": RHOMBUS_API_KEY,
  "x-auth-scheme": "api-token",
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
  requestModifiers: z
    .optional(
      z.object({
        headers: z.optional(z.any()),
        query: z.optional(z.any()),
      })
    )
    .describe("Optional headers accepted by tools.  LLM should never ever use this. 😅"),
};

const log = (msg: string) => {
  if (!enableLogs) return;
  console.error(msg);
};

const appendQueryParams = (url: string, params: object | undefined): string => {
  if (!params || typeof params !== "object") return url;

  const urlObj = new URL(url);

  const existingSearchParams = new URLSearchParams(urlObj.search);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      existingSearchParams.append(key, String(value));
    }
  }
  const baseUrl = url.split("?")[0];
  const queryString = existingSearchParams.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

async function postApi(
  url: string,
  body: string,
  modifiers: { headers: any; query: any } | undefined
) {
  let requestHeaders = {
    ...(modifiers?.headers || AUTH_HEADERS),
    ...STATIC_HEADERS,
  };

  if (modifiers?.query) {
    url = appendQueryParams(url, modifiers.query);
  }

  try {
    log(`[POSTAPI] REQUEST - ${url} - ${body} - ${JSON.stringify(requestHeaders)}`);
    const response = await fetch(url, { method: "POST", headers: requestHeaders, body });
    log(`[POSTAPI] RESPONSE - ${JSON.stringify(response)}`);
    if (!response.ok) {
      log(`❌ RESPONSE - ${response.ok} - ${response.status}`);
      if (response.status === 401 || response.status === 403) {
        return {
          error: true,
          status:
            "Sorry, I don't have permission to help with this request.  Consider upgrading my permissions by changing the role of the API Key I am using.",
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const ret = await response.json();
    log(`❌ RESPONSE - ${response.ok} - ${JSON.stringify(ret)}`);
    return ret;
  } catch (error) {
    log(`[POSTAPI] ERROR - ${JSON.stringify(error || {})}`);
    return {
      error: true,
      status: `Request Error: ${error}`,
    };
  }
}

async function getOrg(requestModifiers?: any) {
  const url = BASE_URL + "/org/getOrgV2";
  return await postApi(url, "{}", requestModifiers);
}

async function getLocations(requestModifiers?: any) {
  const url = BASE_URL + "/location/getLocationsV2";
  return await postApi(url, "{}", requestModifiers);
}

async function getCameraList(requestModifiers?: any) {
  const url = BASE_URL + "/camera/getMinimalCameraStateList";
  return await postApi(url, "{}", requestModifiers).then(response => {
    return {
      cameraStates: response.cameraStates.filter(
        (camera: { locationUuid?: string }) => !!camera.locationUuid
      ),
    };
  });
}

async function getAccessControlledDoors(requestModifiers?: any) {
  const url = BASE_URL + "/component/findAccessControlledDoors";
  return await postApi(url, "{}", requestModifiers);
}

async function getFaceEvents(_locationUuid?: string, requestModifiers?: any) {
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
    requestModifiers
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

async function getAccessControlEvents(doorUuid: string, requestModifiers?: any) {
  const url = BASE_URL + "/component/findComponentEventsByAccessControlledDoor";
  const body = JSON.stringify({
    limit: 50,
    accessControlledDoorUuid: doorUuid,
  });
  const response = await postApi(url, body, requestModifiers).then(response => ({
    componentEvents: (response.componentEvents || []).map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestampMs).toString(),
    })),
  }));
  return response;
}

async function rebootCameras(cameraUuids: string[], requestModifiers?: any) {
  const url = BASE_URL + "/camera/reboot";
  let successCount = 0;
  let errorCount = 0;
  for (const cameraUuid in cameraUuids) {
    try {
      const body = JSON.stringify({ cameraUuid: cameraUuid });
      const response = await postApi(url, body, requestModifiers);
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

async function createVideoWall(options: CreateVideoWallOptionsT, headers: any) {
  const url = BASE_URL + "/camera/createVideoWall";
  const body = JSON.stringify({
    videoWall: {
      displayName: options?.displayName,
      deviceList: options?.deviceList,
      othersCanEdit: true,
      orgUuid: options?.orgUuid,
      shared: true,
      settings: {
        gridSize: { width: options?.settings.columnCount, height: options?.settings.columnCount },
        gridLayout: "1 2\n3 4",
        intervalSeconds: options?.settings.intervalSeconds || 5,
      },
    },
  });
  const response = await postApi(url, body, headers);
  return response;
}

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
  const base64Image = await postApi(url, body, requestModifiers).then(async res => {
    let requestHeaders = {
      ...(requestModifiers?.headers || AUTH_HEADERS),
      ...STATIC_HEADERS,
    };
    return await fetch(res.frameUri, { method: "GET", headers: requestHeaders }).then(async res => {
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
  async ({ requestModifiers }) => {
    const org = await getOrg(requestModifiers);
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

async function handleCreateVideoWallRequest(
  videoWallCreateOptions: CreateVideoWallOptionsT,
  headers: any
): Promise<CallToolResult> {
  let text = "Unable to create video wall!";
  // console.error("🔨 Creating video wall");
  if (!videoWallCreateOptions?.displayName) {
    text = JSON.stringify({
      needUserInput: true,
      commandForUser: "What should the name of the video wall be?",
    });
  } else if ((videoWallCreateOptions?.deviceList || []).length === 0) {
    text = JSON.stringify({
      needUserInput: true,
      commandForUser: "Which cameras would you like on this video wall?",
    });
  } else {
    // console.error("Creating video wall with options: ", JSON.stringify(videoWallCreateOptions));
    text = JSON.stringify(await createVideoWall(videoWallCreateOptions, headers));
  }
  return Promise.resolve({
    content: [
      {
        type: "text",
        text,
      },
    ],
  });
}
server.tool(
  "create-tool",
  "Tool for creating many entity types such as video walls.",
  {
    entityType: z.enum(["video-wall"]).describe("The entity type to create.  Example: video wall."),
    videoWallCreateOptions: CreateVideoWallOptions,
    ...STATIC_ARGS,
  },
  async ({ entityType, videoWallCreateOptions, requestModifiers }) => {
    switch (entityType) {
      case "video-wall":
        return await handleCreateVideoWallRequest(videoWallCreateOptions, requestModifiers);
      default:
    }

    return {
      content: [
        {
          type: "text",
          text: "",
        },
      ],
    };
  }
);

function nullToUndefined(value: number | null): number | undefined {
  return value === null ? undefined : value;
}

server.tool(
  "time-tool",
  "Tool for converting a natural language time description into a timestamp in milliseconds.",
  {
    time_description: z
      .string()
      .describe(
        "A natural language description of the time (e.g., '2pm today', 'tomorrow at noon')."
      ),
    timezone: z
      .optional(z.string())
      .describe(
        "Optional IANA timezone string (e.g., 'America/Los_Angeles', 'UTC'). Defaults to system timezone."
      ),
  },
  async ({ time_description, timezone }) => {
    // console.error(`🕛 handling tool call for time ${time_description} using timezone ${timezone}`);
    const now = DateTime.now()
      .setZone(timezone || undefined)
      .toJSDate();
    const parsed = parse(time_description, now, { forwardDate: true });

    if (!parsed || parsed.length === 0) {
      throw new Error(`Could not parse time description: ${time_description}`);
    }

    const dateComponents = parsed[0].start;
    if (!dateComponents) {
      throw new Error("Parsed time has no start component");
    }

    const dt = DateTime.fromObject(
      {
        year: nullToUndefined(dateComponents.get("year")),
        month: nullToUndefined(dateComponents.get("month")),
        day: nullToUndefined(dateComponents.get("day")),
        hour: nullToUndefined(dateComponents.get("hour")),
        minute: nullToUndefined(dateComponents.get("minute")),
        second: nullToUndefined(dateComponents.get("second")),
        millisecond: 0,
      },
      {
        zone: timezone || "local",
      }
    );

    if (!dt.isValid) {
      throw new Error(`Could not construct valid DateTime: ${dt.invalidReason}`);
    }

    const timestamp = dt.toMillis();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            timestamp,
            iso: dt.toISO(),
            timezone: dt.zoneName,
          }),
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
  async ({ entityType, requestModifiers }) => {
    let ret;
    switch (entityType) {
      case "camera":
        ret = await getCameraList(requestModifiers);
        break;
      case "access-controlled-doors":
        ret = await getAccessControlledDoors(requestModifiers);
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
  'This tool captures and returns a real-time snapshot from a designated security camera. The image reflects the current scene in the camera\'s field of view and serves as a contextual input source for downstream tasks such as object recognition, anomaly detection, incident investigation, or situational assessment. When invoked, the tool provides the following: \n •	Visual Scene Capture: A high-resolution image of what the camera is actively observing, including people, vehicles, license plates, and any detectable objects. \n•	Scene Context: Metadata such as camera ID, location name, timestamp, and motion detection status if available. \n•	Enriched Data Potential: The image can be paired with AI models or downstream analytics to extract insights such as: \n•	Number and type of objects in frame (e.g., humans, cars, packages) \n•	Unusual behaviors (e.g., loitering, unauthorized access) \n•	Environmental conditions (e.g., lighting, obstruction, cleanliness) \nUse Cases: \n•	Verify what triggered a motion alert or analytic rule. \n•	Provide visual context for access events or alarms. \n•	Support live incident triage or retrospective investigations. \n•	Feed contextual imagery to agents making security or operational decisions. \nInvocation Notes: \nTo use this tool correctly, the agent should provide the specific camera identifier or location name. If possible, include the intent (e.g., "verify unauthorized access", "identify vehicle", "check for obstructions") to enhance downstream processing or summarization.',
  {
    requestType: z.enum(["image"]),
    timestampMs: z
      .optional(z.number())
      .describe("the timestamp in milliseconds which should always be obtained using time-tool"),
    cameraUuid: z.optional(z.string()).describe("the camera uuid requested"),
    ...STATIC_ARGS,
  },
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
  async ({ eventType, locationUuid, accessControlledDoorUuid, requestModifiers }) => {
    if (eventType === "faces" || eventType === "people") {
      const response = await getFaceEvents(locationUuid, requestModifiers);
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
        const events = await getAccessControlEvents(accessControlledDoorUuid, requestModifiers);
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
    action: z.enum(["get", "update"]),
    locationUpdate: z.optional(z.object({ uuid: z.string(), name: z.optional(z.string()) })),
    ...STATIC_ARGS,
  },
  async ({ action, locationUpdate, requestModifiers }) => {
    let ret;
    switch (action) {
      case "get":
        ret = await getLocations(requestModifiers);
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
  async ({ cameraUuids, requestModifiers }) => {
    const cameraRebootData = await rebootCameras(cameraUuids, requestModifiers);

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
