import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { postApi } from "../network.js";
import { THREE_HOURS_MS, FIVE_SECONDS_MS } from "../constants.js";

async function getFaceEvents(_locationUuid: string | null, requestModifiers?: any) {
  const nowMs = Date.now();
  const rangeStartMs = nowMs - THREE_HOURS_MS;
  const rangeEndMs = nowMs - FIVE_SECONDS_MS;
  const body = {
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
  };
  const response = await postApi("/faceRecognition/faceEvent/findFaceEventsByOrg", body, requestModifiers).then(
    response => {
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
  const body = {
    limit: 50,
    accessControlledDoorUuid: doorUuid,
  };
  const response = await postApi("/component/findComponentEventsByAccessControlledDoor", body, requestModifiers).then(response => ({
    componentEvents: (response.componentEvents || []).map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestampMs).toString(),
    })),
  }));
  return response;
}

export function createTool(server: McpServer) {
  server.tool(
    "events-tool",
    "event data for certain types of information like faces, license plates, and access-control events",
    createToolArgs({
      eventType: z.enum(["faces", "people", "access-control"]),
      locationUuid: z.nullable(z.string()),
      accessControlledDoorUuid: z.nullable(z.string()),
    }),
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
}
