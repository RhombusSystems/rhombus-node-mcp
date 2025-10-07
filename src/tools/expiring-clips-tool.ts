import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS_SCHEMA, TOOL_ARGS, ToolArgs } from "../types/expiring-clips-tool-types.js";
import { getExpiringClips } from "../api/expiring-clips-tool-api.js";

const TOOL_NAME = "expiring-clips-tool";

const TOOL_DESCRIPTION = `
Retrieves saved video clips from the Rhombus system that are expiring soon. This tool helps identify clips that will be automatically deleted from the system in the near future.

The system automatically determines which clips are expiring based on retention policies. You don't need to specify an expiration timestamp - the system returns clips that are approaching their retention deadline.

This tool allows you to:
* Filter clips by specific devices using deviceUuidFilters.
* Filter clips by specific locations using locationUuidFilters.
* Search for clips by name using searchFilter.
* Control pagination using pageSize and pageToken parameters.

The tool returns a JSON object with the page token and the saved clips that are expiring soon. 
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const payload = TOOL_ARGS_SCHEMA.parse(args);

  const result = await getExpiringClips(
    payload,
    extra._meta?.requestModifiers as RequestModifiers,
    extra.sessionId
  );

  return {
    content: [{ type: "text" as const, text: JSON.stringify(result) }],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
