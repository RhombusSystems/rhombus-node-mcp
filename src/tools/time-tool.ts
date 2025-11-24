import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { parseTimeDescription } from "../api/time-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-tool-types.js";

const TOOL_NAME = "time-tool";
const TOOL_DESCRIPTION =
  "This tool is capable of returning the time from a natural language query.  If the user asks about the 'current time' use this tool.  Try to kee time_description as close to the users initial query as possible.  For example if someone says 'was X person seen today?' then time_description should be 'today'.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { time_description, timezone } = args;
  const result = parseTimeDescription(time_description ?? undefined, timezone ?? undefined, extra);

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
