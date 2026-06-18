#!/usr/bin/env node

import "dotenv/config";

import { serverInit } from "./createServer.js";
import { logger } from "./logger.js";
import stdioTransport from "./transports/stdio.js";
import streamableHttpTransport from "./transports/streamable-http.js";

const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;
const TRANSPORT_TYPE: "stdio" | "streamable-http" =
  (process.env.TRANSPORT_TYPE as "stdio" | "streamable-http") || "stdio";

async function main() {
  const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

  if (RHOMBUS_API_KEY) {
    logger.info(`🔑 Using API_KEY: ${RHOMBUS_API_KEY}`);
  }
  logger.info("🌐 Using server url", serverUrl);

  await serverInit();

  if (TRANSPORT_TYPE === "stdio") {
    await stdioTransport();
  } else if (TRANSPORT_TYPE === "streamable-http") {
    await streamableHttpTransport();
  } else {
    throw new Error(`Invalid transport type: ${TRANSPORT_TYPE}`);
  }
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
