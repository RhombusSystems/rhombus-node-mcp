import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { BASE_URL, postApi } from "../network.js";

async function getLocations(requestModifiers?: any) {
  const url = BASE_URL + "/location/getLocationsV2";
  return await postApi(url, "{}", requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "location-tool",
    "contains basic operations for locations and response in JSON format.",
    createToolArgs({
      action: z.enum(["get", "update"]),
      locationUpdate: z.optional(z.object({ uuid: z.string(), name: z.optional(z.string()) })),
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
