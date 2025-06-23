import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { postApi } from "../network.js";

async function getLocations(requestModifiers?: any) {
  return await postApi("/location/getLocationsV2", {}, requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "location-tool",
    `This tool performs operations on locations.
- 'get': Retrieves all locations.`,
    createToolArgs({
      action: z.enum(["get", "update"]),
      locationUpdate: z
        .object({
          uuid: z.string(),
          name: z.string(),
        })
        .optional(),
    }),
    async ({ action, requestModifiers }) => {
      let ret;
      switch (action) {
        case "get":
          ret = await getLocations(requestModifiers);
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
