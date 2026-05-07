import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { parseTimeDescription } from "../api/time-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-tool-types.js";

const TOOL_NAME = "time-tool";
const TOOL_DESCRIPTION = `This tool returns timestamps from natural-language descriptions of time. If the user asks about the "current time", use this tool. Keep time_description as close to the user's original phrasing as possible — e.g. for "was X person seen today?" use time_description "today".

**When to call:** Whenever the user provides a natural-language time description ("today", "5 days ago", "last week", "this morning"), call time-tool to get accurate timestamps. Do not invent timestamps yourself. If you will need a timestamp as input to another tool, call time-tool first; multiple parallel calls are fine.

**Default timezone:** Assume "America/Los_Angeles" unless the user specifies otherwise or device/location context indicates a different one.`;

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
