import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "path";

export function createResource(server: McpServer) {
  server.resource("knowledge-base", "knowledge-base://llms.pdf", async uri => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.resolve(currentDir, "../../assets/llms.pdf");

    return {
      contents: [
        {
          uri: uri.href,
          text: fs.readFileSync(filePath).toString(),
        },
      ],
    };
  });
  return;
}
