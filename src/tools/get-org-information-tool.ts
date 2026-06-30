import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getOrg } from "../api/get-org-information-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/get-org-information-tool-types.js";
import { RequestModifiers } from "../util.js";

const TOOL_NAME = "get-org-information";
const TOOL_DESCRIPTION =
  "Get general information about the organization including org name, camera configuration defaults, contact information, and org settings.";

const TOOL_HANDLER = async (_: ToolArgs, extra: any) => {
  const org = await getOrg(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(org),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Organization Information",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
