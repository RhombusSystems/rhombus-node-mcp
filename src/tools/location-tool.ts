import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { getLocations } from "../api/location-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/location-tool-types.js";

const TOOL_NAME = "location-tool";
const TOOL_DESCRIPTION = `This tool performs operations on locations.
- 'get': Retrieves all locations.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { action } = args;
  let ret;
  switch (action) {
    case "get":
      ret = await getLocations(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      break;
    case "update":
      ret = { error: true, status: "not implemented" };
      break;
    default:
      ret = { error: true, status: `unsupported location tool call: ${action}` };
      break;
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
