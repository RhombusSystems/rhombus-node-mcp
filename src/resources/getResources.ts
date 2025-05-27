import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "path";

async function getResources() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));

  const fileNames = fs.readdirSync(currentDir);

  const resources: {
    name: string;
    create: (server: McpServer) => void;
  }[] = [];
  for (const fileName of fileNames) {
    const imported = (await import(`./${fileName}`)) as {
      createResource: ((server: McpServer) => void) | undefined;
    };
    if (imported.createResource !== undefined) {
      resources.push({
        name: fileName,
        create: imported.createResource,
      });
    }
  }

  return resources;
}

export default getResources;
