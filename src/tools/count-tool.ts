import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createTool(server: McpServer) {
  server.tool(
    "count-tool",
    `
      This tool will return the amount of data in an array of any type and shape. Please use this for a very accurate count.

      This takes in a JSON string. Ideally, it should be a JSON array of any type and shape.
      `,
    {
      dataString: z.string(),
    },
    async ({ dataString }) => {
      try {
        const data = JSON.parse(dataString);

        if (!Array.isArray(data)) {
          return {
            content: [{ type: "text", text: `Invalid JSON. Not an array.` }],
          };
        }

        return {
          content: [{ type: "text", text: `Count: ${data.length}` }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Invalid JSON.` }],
        };
      }
    }
  );
}
