import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { parseTimeDescription } from "../api/time-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-tool-types.js";

const TOOL_NAME = "time-tool";
const TOOL_DESCRIPTION = `This tool converts a natural-language description of time ("today", "5 days ago", "last week", "this morning") into concrete timestamps. Use it when you need a timestamp as input to another tool, or when the user explicitly asks for the current time. Keep time_description as close to the user's original phrasing as possible.

**Call it at most once per distinct time reference.** The current time does not change during this conversation — once you have retrieved "now"/"today", reuse that result and reason about other relative dates from it. Do NOT call time-tool again for a time reference you already resolved, and do not call it at all for questions that have no time component.

**Timezone:** Pass the timezone of the relevant device/location when known; otherwise a timezone the user stated; otherwise UTC.`;

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
  server.registerTool(
    TOOL_NAME,
    {
      title: "Current Time",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
