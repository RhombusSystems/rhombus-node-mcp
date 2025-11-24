import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logger } from "../logger.js";

export function createTool(server: McpServer) {
  server.tool(
    "count-tool",
    `
      This tool counts the number of items by accepting an array of UUIDs. It can count anything that has UUIDs - users, devices, 
      records, or any other entities. Simply provide an array of UUID strings and it will return the precise count.
      `,
    {
      uuids: z
        .array(z.string().describe("UUID string of an individual item"))
        .describe(
          "An array of UUID strings representing the items to count. Each string should be a valid UUID."
        ),
    },
    async ({ uuids }) => {
      try {
        logger.info("Counting UUIDs", uuids);
        return {
          content: [{ type: "text", text: `Count: ${uuids.length}` }],
        };
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : `Unknown error: ${e}`;

        return {
          content: [{ type: "text", text: `Error counting UUIDs: ${errorMessage}` }],
        };
      }
    }
  );
}
