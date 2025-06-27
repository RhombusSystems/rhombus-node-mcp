import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import express from "express";
import crypto from "node:crypto";
import { IncomingMessage } from "node:http";
import createServer from "../createServer.js";
import { logger } from "../logger.js";

const JWT_SECRET = process.env.SECRET;

export const authStore = new Map<
  string,
  | {
      sessionId: string;
      latestRecordUuid: string;
      createdMs: number;
    }
  | {
      apiKey: string;
      createdMs: number;
    }
>();

const transports = new Map<string, StreamableHTTPServerTransport>();

export default function streamableHttpTransport() {
  if (!JWT_SECRET) {
    throw new Error("SECRET is not set");
  }

  const app = express();
  app.use(express.json());

  app.use(
    cors({
      // TODO: domain
      origin: ["*"],
      exposedHeaders: ["mcp-session-id"],
      allowedHeaders: ["Content-Type", "mcp-session-id"],
    })
  );

  app.post("/mcp", async (req, res) => {
    logger.info(`Received MCP request`, req.body);

    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      // Reuse existing transport
      transport = transports.get(sessionId)!;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: crypto.randomUUID,
        onsessioninitialized: sessionId => {
          // Store the transport by session ID
          transports.set(sessionId, transport);

          logger.info(`🔒 MCP request initialized with sessionId: ${sessionId}`);

          // if api key is provided
          const authScheme = req.headers["x-auth-scheme"] ?? "api-token";
          if (authScheme === "api-token") {
            const apiKey =
              "x-auth-apikey" in req.headers
                ? (req.headers["x-auth-apikey"] as string)
                : process.env.RHOMBUS_API_KEY;

            if (!apiKey) {
              logger.error(
                "Invalid API Key provided! Please check the headers or environment variables"
              );
              throw new Error(
                "Invalid API Key provided! Please check the headers or environment variables"
              );
            }

            logger.info(`🔒 MCP request authenticated with api key: ${apiKey}`);

            authStore.set(sessionId, {
              apiKey: apiKey,
              createdMs: Date.now(),
            });
          } else if (
            authScheme === "chatbot" &&
            "x-auth-session" in req.headers &&
            "x-auth-chat" in req.headers
          ) {
            logger.info(
              `🔒 MCP request authenticated with x-auth-session: ${req.headers["x-auth-session"]} and x-auth-chat: ${req.headers["x-auth-chat"]}`
            );
            // otherwise, store the sessionId and latestRecordUuid in authStore
            authStore.set(sessionId, {
              sessionId: req.headers["x-auth-session"] as string,
              latestRecordUuid: req.headers["x-auth-chat"] as string,
              createdMs: Date.now(),
            });
          } else {
            logger.error(
              `Invalid auth scheme provided! x-auth-scheme: ${req.headers["x-auth-scheme"]}, x-auth-session: ${req.headers["x-auth-session"]}, x-auth-chat: ${req.headers["x-auth-chat"]}`
            );
            throw new Error("Invalid auth scheme");
          }
        },
        // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
        // locally, make sure to set:
        // enableDnsRebindingProtection: true,
        // allowedHosts: ['127.0.0.1'],
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          transports.delete(transport.sessionId);
          authStore.delete(transport.sessionId);
        }
      };

      const server = await createServer();
      // Connect to the MCP server
      await server.connect(transport);
      logger.info(`🔗 Transport connected with sessionId: ${sessionId}`);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", async (req, res) => {
    logger.warn("Received Not Allowed GET MCP request");
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed.",
        },
        id: null,
      })
    );
  });

  app.delete("/mcp", async (req, res) => {
    logger.warn("Received Not Allowed DELETE MCP request");
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed.",
        },
        id: null,
      })
    );
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`rhombus-node-mcp listening on port ${PORT}`);
  });
}
