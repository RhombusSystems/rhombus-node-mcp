#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";
import getTools from "./tools/getTools.js";

import { logger } from "./logger.js";
import getResources from "./resources/getResources.js";

const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

if (!RHOMBUS_API_KEY) {
  logger.info("Missing RHOMBUS_API_KEY");
}

const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

logger.info(`Using API_KEY: ${RHOMBUS_API_KEY}`);
logger.info(`To hit API server: ${serverUrl}`);

logger.info("🌐 Using server url", serverUrl);
export const server = new McpServer({
  name: "rhombus",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  const resources = await getResources();

  logger.info(`🛠️ Registering ${resources.length} resources`);

  for (const resource of resources) {
    resource.create(server);
    logger.debug(`🔧 Registered resource ${resource.name}`);
  }

  const tools = await getTools();
  
  logger.info(`🛠️ Registering ${tools.length} tools`);

  for (const tool of tools) {
    tool.create(server);
    logger.debug(`🔧 Registered tool ${tool.name}`);
  }

  const transport = new StdioServerTransport();
  logger.info(`🚙 Starting stdio transport`);
  await server.connect(transport);
  logger.info(`🚙🌬️ Connected.`);
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
