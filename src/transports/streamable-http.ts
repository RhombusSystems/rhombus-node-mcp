import crypto from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import express from "express";
import { clearAccessibleAppsCache } from "../api/get-accessible-apps.js";
import createServer from "../createServer.js";
import { logger } from "../logger.js";

enum AuthScheme {
  OAUTH = "oauth",
  API_TOKEN = "api-token",
  CHATBOT = "chatbot",
  WEB2 = "web2",
}

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
  | {
      cookie: string;
      sessionAlias?: string;
      createdMs: number;
    }
  | {
      oauthToken: string;
      createdMs: number;
    }
>();

const transports = new Map<string, StreamableHTTPServerTransport>();

/**
 * Populate authStore for the given sessionId based on the request headers.
 * Done up-front (before createServer) so resolveAccessibleApps can read auth
 * during tool registration. Returns true on success.
 */
function populateAuthStore(req: express.Request, sessionId: string): boolean {
  const oauthToken = req.headers["x-auth-access-token"];
  const authScheme = req.headers["x-auth-scheme"] ?? AuthScheme.API_TOKEN;

  if (oauthToken && typeof oauthToken === "string") {
    authStore.set(sessionId, { oauthToken, createdMs: Date.now() });
    logger.info(`🔒 MCP request authenticated with oauth token (session ${sessionId})`);
    return true;
  }

  if (authScheme === AuthScheme.API_TOKEN) {
    const apiKey =
      "x-auth-apikey" in req.headers
        ? (req.headers["x-auth-apikey"] as string)
        : process.env.RHOMBUS_API_KEY;

    if (!apiKey) {
      logger.warn("populateAuthStore: API_TOKEN scheme but no api key found");
      return false;
    }

    logger.info(`🔒 MCP request authenticated with api key (session ${sessionId})`);
    authStore.set(sessionId, { apiKey, createdMs: Date.now() });
    return true;
  }

  if (
    authScheme === AuthScheme.CHATBOT &&
    "x-auth-session" in req.headers &&
    "x-auth-chat" in req.headers
  ) {
    logger.info(
      `🔒 MCP request authenticated with x-auth-session: ${req.headers["x-auth-session"]} and x-auth-chat: ${req.headers["x-auth-chat"]}`
    );
    authStore.set(sessionId, {
      sessionId: req.headers["x-auth-session"] as string,
      latestRecordUuid: req.headers["x-auth-chat"] as string,
      createdMs: Date.now(),
    });
    return true;
  }

  if (authScheme === AuthScheme.WEB2 && "x-auth-cookie" in req.headers) {
    logger.info(`🔒 MCP request authenticated with x-auth-cookie (session ${sessionId})`);
    authStore.set(sessionId, {
      cookie: req.headers["x-auth-cookie"] as string,
      sessionAlias: req.headers["x-auth-session-alias"] as string | undefined,
      createdMs: Date.now(),
    });
    return true;
  }

  logger.warn(
    `populateAuthStore: invalid auth scheme. x-auth-scheme: ${req.headers["x-auth-scheme"]}, x-auth-session: ${req.headers["x-auth-session"]}, x-auth-chat: ${req.headers["x-auth-chat"]}`
  );
  return false;
}

export default function streamableHttpTransport() {
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

  /**
   * STATEFUL ENDPOINT
   */
  const authRequired = ["tools/call"];
  app.post("/mcp", async (req, res) => {
    logger.info(`Received MCP request`, JSON.stringify(req.body, null, 2));

    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      // Reuse existing transport
      const _transport = transports.get(sessionId);
      if (!_transport) {
        throw new Error(`Transport not found for sessionId: ${sessionId}`);
      }
      transport = _transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request — mint our sessionId up front so we can
      // populate authStore and gate tool registration BEFORE the SDK calls
      // onsessioninitialized.
      const newSessionId = crypto.randomUUID();
      const authOk = populateAuthStore(req, newSessionId);
      if (!authOk && authRequired.includes(req.body.method)) {
        logger.error(`Auth required for ${req.body.method} but auth could not be populated`);
        res
          .status(401)
          .setHeader(
            "WWW-Authenticate",
            `Bearer realm="${process.env.REALM}", error="invalid_token", error_description="The access token is missing or invalid"`
          )
          .send("Unauthorized");
        return;
      }

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => newSessionId,
        onsessioninitialized: sessionId => {
          transports.set(sessionId, transport);
          logger.info(`🔒 MCP request initialized with sessionId: ${sessionId}`);
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
          clearAccessibleAppsCache(transport.sessionId);
        }
      };

      // newSessionId is already in authStore; createServer can resolve
      // accessibleRhombusApps and pick the right tool set.
      const server = await createServer({ sessionId: newSessionId });
      // Connect to the MCP server
      await server.connect(transport);
      logger.info(`🔗 Transport connected with sessionId: ${newSessionId}`);
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

    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", async (_, res) => {
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

  /**
   * STATELESS ENDPOINT
   */

  app.post("/mcp-stateless", async (req, res) => {
    logger.info(`Received stateless MCP request`, req.body);

    let transport: StreamableHTTPServerTransport;

    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const server = await createServer();
    // Connect to the MCP server
    await server.connect(transport);
    logger.info(`🔗 Stateless Transport connected`);

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp-stateless", async (req, res) => {
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

  app.delete("/mcp-stateless", async (req, res) => {
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
