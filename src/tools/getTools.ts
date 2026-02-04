import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fileURLToPath } from "node:url";
import path from "path";
import { getFilePathsInDirectory } from "../util.js";

async function getTools() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));

  const filePaths = getFilePathsInDirectory(currentDir);

  const tools: {
    name: string;
    create: (server: McpServer) => void | Promise<void>;
  }[] = [];
  for (const filePath of filePaths) {
    // ensure it's a js file
    if (!filePath.endsWith(".js")) continue;

    const imported = (await import(filePath)) as {
      createTool: ((server: McpServer) => void | Promise<void>) | undefined;
    };
    if (imported.createTool !== undefined) {
      tools.push({
        name: filePath,
        create: imported.createTool,
      });
    }
  }

  return tools;
}

export default getTools;
