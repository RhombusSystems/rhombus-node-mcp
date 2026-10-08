import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import createServer from "../createServer.js";
import { logger } from "../logger.js";
import { RHOMBUS_PARTNER_ORG } from "../network/network.js";

export default async function stdioTransport() {
  const server = await createServer({ partnerOrg: RHOMBUS_PARTNER_ORG });

  const transport = new StdioServerTransport();
  logger.info(`🚙 Starting stdio transport`);
  await server.connect(transport);
  logger.info(`🚙🌬️ Connected.`);
}
