import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

async function getLocations(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/location/getLocationsV2",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}

export function createTool(server: McpServer) {
  server.tool(
    "location-tool",
    `This tool performs operations on locations.
- 'get': Retrieves all locations.`,
    {
      action: z.enum(["get", "update"]),
      locationUpdate: z
        .object({
          uuid: z.string(),
          name: z.string(),
        })
        .optional(),
    },
    async ({ action }, extra) => {
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
        content: [{ type: "text", text: JSON.stringify(ret) }],
      };
    }
  );
}
