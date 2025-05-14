import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";

import { CreateVideoWallOptions, CreateVideoWallOptionsT } from "../types.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { postApi, BASE_URL } from "../network.js";

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

export function createTool(server: McpServer) {
  server.tool(
    "create-tool",
    "Tool for creating many entity types such as video walls.",
    createToolArgs({
      entityType: z
        .enum(["video-wall"])
        .describe("The entity type to create.  Example: video wall."),
      videoWallCreateOptions: CreateVideoWallOptions,
    }),
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
}
