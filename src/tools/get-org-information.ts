import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createToolArgs } from "../util.js";
import { BASE_URL, postApi } from "../network.js";

async function getOrg(requestModifiers?: any) {
  const url = BASE_URL + "/org/getOrgV2";
  return await postApi(url, "{}", requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "get-org-information",
    "Get general information about the organization including org name, camera configuration defaults, contact information, and org settings.",
    createToolArgs({}),
    async ({ requestModifiers }) => {
      const org = await getOrg(requestModifiers);
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
