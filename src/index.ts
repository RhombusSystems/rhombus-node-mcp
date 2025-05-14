#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BASE_URL, postApi } from "./network.js";
import getTools from "./tools/getTools.js";
import { CreateVideoWallOptionsT } from "./types.js";

const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

if (!RHOMBUS_API_KEY) {
  console.error("Missing RHOMBUS_API_KEY");
}

const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

console.error("🌐 Using server url", serverUrl);
export const server = new McpServer({
  name: "rhombus",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  const tools = await getTools();

  console.error(`got ${tools.length} tools`);

  for (const tool of tools) {
    tool(server);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
