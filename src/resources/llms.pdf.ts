import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "path";

// change from _createResource to createResource to add it back in
export function _createResource(server: McpServer) {
  server.resource("knowledge-base.pdf", "knowledge-base://llms.pdf", async uri => {
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
