import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fileURLToPath } from "node:url";
import path from "path";
import { getFilePathsInDirectory } from "../util.js";

async function getResources() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));

  const filePaths = getFilePathsInDirectory(currentDir);

  const resources: {
    name: string;
    create: (server: McpServer) => void;
  }[] = [];
  for (const filePath of filePaths) {
    const imported = (await import(filePath)) as {
      createResource: ((server: McpServer) => void) | undefined;
    };
    if (imported.createResource !== undefined) {
      resources.push({
        name: filePath,
        create: imported.createResource,
      });
    }
  }

  return resources;
}

export default getResources;
