import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { requireConfirmation } from "../utils/confirmation.js";
import { handleCreateVideoWallRequest } from "../api/create-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/create-tool-types.js";

const TOOL_NAME = "create-tool";
const TOOL_DESCRIPTION = "Tool for creating many entity types such as video walls.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { entityType, videoWallCreateOptions, confirmationId } = args;
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
          type: "text" as const,
          text: "",
        },
      ],
    };
  } else {
    return confirmation;
  }
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
