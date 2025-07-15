import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS, ToolArgs } from "../types/events-tools-types.js";
import { getAccessControlEvents, getHumanMotionEvents } from "../api/events-tool-api.js";

const TOOL_NAME = "events_tool";

const TOOL_DESCRIPTION = "A tool for use in reporting on events.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { eventType, accessControlledDoorUuid, cameraUuids, startTime, duration } = args;
  if (eventType === "human" || eventType === "people") {
    if (!cameraUuids) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              needUserInput: true,
              commandForUser: "Please specify a camera, or a location.",
            }),
          },
        ],
      };
    }
    if (startTime && duration) {
      const responses = await Promise.all(
        cameraUuids.map(async cameraUuid => {
          return getHumanMotionEvents(
            cameraUuid,
            duration / 1000,
            startTime / 1000,
            extra._meta?.requestModifiers as RequestModifiers,
            extra.sessionId
          );
        })
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(responses),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              needUserInput: true,
              commandForUser:
                "Please define a time frame and camera for which to search human events.",
            }),
          },
        ],
      };
    }
  }

  if (eventType === "access-control") {
    if (!accessControlledDoorUuid) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              needUserInput: true,
              commandForUser: "Which door are you asking about?",
            }),
          },
        ],
      };
    } else {
      const events = await getAccessControlEvents(
        accessControlledDoorUuid,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(events),
          },
        ],
      };
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({}),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
