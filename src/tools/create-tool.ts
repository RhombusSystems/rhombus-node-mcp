import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../logger.js";
import { postApi } from "../network.js";
import { CreateVideoWallOptions, CreateVideoWallOptionsT } from "../types.js";
import { addConfirmationParams, requireConfirmation } from "../utils/confirmation.js";

async function createVideoWall(
  options: CreateVideoWallOptionsT,
  requestModifiers: RequestModifiers,
  sessionId?: string
) {
  const body = {
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
  };
  const response = await postApi({
    route: "/camera/createVideoWall",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  return response;
}

async function handleCreateVideoWallRequest(
  videoWallCreateOptions: CreateVideoWallOptionsT,
  requestModifiers: RequestModifiers,
  sessionId?: string
): Promise<CallToolResult> {
  let text = "Unable to create video wall!";
  logger.info("🔨 Creating video wall");
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
    logger.info("Creating video wall with options: ", JSON.stringify(videoWallCreateOptions));
    text = JSON.stringify(await createVideoWall(videoWallCreateOptions, requestModifiers, sessionId));
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

export function createTool(server: McpServer) {
  server.tool(
    "create-tool",
    "Tool for creating many entity types such as video walls.",
    addConfirmationParams({
      entityType: z
        .enum(["video-wall"])
        .describe("The entity type to create.  Example: video wall."),
      videoWallCreateOptions: CreateVideoWallOptions,
    }),
    async ({ entityType, videoWallCreateOptions, confirmationId }, extra) => {
      const confirmation = requireConfirmation(confirmationId);

      if (confirmation === true) {
        switch (entityType) {
          case "video-wall":
            return await handleCreateVideoWallRequest(
              videoWallCreateOptions,
              extra._meta?.requestModifiers as RequestModifiers,
              extra.sessionId
            );
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
      } else {
        return confirmation;
      }
    }
  );
}
