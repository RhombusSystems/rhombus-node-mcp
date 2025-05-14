import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "path";

async function getTools() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));

  const fileNames = fs.readdirSync(currentDir);

  const tools: {
    name: string;
    create: (server: McpServer) => void;
  }[] = [];
  for (const fileName of fileNames) {
    const imported = (await import(`./${fileName}`)) as {
      createTool: ((server: McpServer) => void) | undefined;
    };
    if (imported.createTool !== undefined) {
      tools.push({
        name: fileName,
        create: imported.createTool,
      });
    }
  }

  return tools;
}

export default getTools;
