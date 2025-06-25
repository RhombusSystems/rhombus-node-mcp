import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "./logger.js";
import getResources from "./resources/getResources.js";
import getTools from "./tools/getTools.js";

let initiated = false;
let resources: Awaited<ReturnType<typeof getResources>>;
let tools: Awaited<ReturnType<typeof getTools>>;

export async function serverInit() {
  resources = await getResources();

  logger.info(`📚 Found ${resources.length} resources`);

  for (const resource of resources) {
    logger.debug(`📕 - ${resource.name}`);
  }

  tools = await getTools();

  logger.info(`🛠️ Found ${tools.length} tools`);

  for (const tool of tools) {
    logger.debug(`🔧 - ${tool.name}`);
  }

  initiated = true;
}

export default async function createServer() {
  if (!initiated) {
    await serverInit();
  }

  logger.info(`🖥️ Creating Server`);

  const server = new McpServer({
    name: "rhombus-node-mcp",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  for (const resource of resources) {
    resource.create(server);
  }
  logger.info(`🛠️ Registered ${resources.length} resources`);

  for (const tool of tools) {
    tool.create(server);
  }
  logger.info(`🛠️ Registered ${tools.length} tools`);

  logger.info(`✅ Server created`);

  return server;
}
