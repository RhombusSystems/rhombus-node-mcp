import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import createServer from "../createServer.js";
import { logger } from "../logger.js";

export default async function stdioTransport() {
  const server = await createServer();

  const transport = new StdioServerTransport();
  logger.info(`🚙 Starting stdio transport`);
  await server.connect(transport);
  logger.info(`🚙🌬️ Connected.`);
}
