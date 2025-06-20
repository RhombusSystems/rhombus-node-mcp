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
    "contains basic operations for locations and response in JSON format.",
    createToolArgs({
      action: z.enum(["get", "update"]),
      locationUpdate: z.nullable(z.object({ uuid: z.string(), name: z.nullable(z.string()) })),
    }),
    async ({ action, locationUpdate, requestModifiers }) => {
      let ret;
      switch (action) {
        case "get":
          ret = await getLocations(requestModifiers);
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
