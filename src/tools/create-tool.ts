import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { handleCreateVideoWallRequest } from "../api/create-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/create-tool-types.js";
import { extractFromToolExtra } from "../util.js";

const TOOL_NAME = "create-tool";
const TOOL_DESCRIPTION = "Tool for creating many entity types such as video walls.";

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { entityType, videoWallCreateOptions } = args;
  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  switch (entityType) {
    case "video-wall":
      return await handleCreateVideoWallRequest(
        videoWallCreateOptions,
        requestModifiers,
        sessionId
      );
    default:
  }

  return {
    content: [
      {
        type: "text" as const,
        text: "Invalid entity type. Please try again.",
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
