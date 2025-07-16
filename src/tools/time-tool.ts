import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { parseTimeDescription } from "../api/time-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-tool-types.js";

const TOOL_NAME = "time-tool";
const TOOL_DESCRIPTION =
  "Tool for converting a natural language time description into a timestamp in milliseconds.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { time_description, timezone } = args;
  const result = parseTimeDescription(time_description, timezone, extra);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
