import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

async function getOrg(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/org/getOrgV2",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}

export function createTool(server: McpServer) {
  server.tool(
    "get-org-information",
    "Get general information about the organization including org name, camera configuration defaults, contact information, and org settings.",
    {},
    async (_, extra) => {
      const org = await getOrg(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(org),
          },
        ],
      };
    }
  );
}
