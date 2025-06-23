import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path from "path";

// change from _createResource to createResource to add it back in
export function createResource(server: McpServer) {
  server.resource(
    "routes.json",
    "file://routes.json/",
    {
      mimeType: "application/json",
      description: `
This resource provides a comprehensive catalog of application paths within the Rhombus Console, including both common and parameterized routes.
Each path is accompanied by a brief description derived from KBA support articles, offering context on its function within the product.
The resource also lists relevant external support links.
The paths are categorized into "common_paths", "parameterized_paths", and "external_paths" for easy navigation and understanding.

It is in the form of a JSON file.

Use these paths to help the user navigate to the correct that they may want to go to. However, try not directly reference the path itself, rather describe it, and make sure to show the user a button to help navigate with.
When providing a path, make sure to be very exact. You're only allowed to substitute in path segments that begin with : or are surrounded by brackets []. For example, /locations/:locationUuid, you need to get a location's UUID and replace :locationUuid with the actual UUID`,
    },
    async uri => {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const filePath = path.resolve(currentDir, "../../assets/routes.json");

      return {
        contents: [
          {
            uri: uri.href,
            text: fs.readFileSync(filePath).toString(),
          },
        ],
      };
    }
  );
  return;
}
