import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpAuthRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import cors from "cors";
import express from "express";
import { type AuthPayload, requestAuthContext } from "../auth-context.js";
import createServer from "../createServer.js";
import { logger } from "../logger.js";
import { RhombusOAuthProvider } from "./oauth-provider.js";

// ---------------------------------------------------------------------------
// x-auth-* header extraction (internal chatbot / API key clients)
// ---------------------------------------------------------------------------

enum AuthScheme {
  API_TOKEN = "api-token",
  CHATBOT = "chatbot",
  WEB2 = "web2",
}

function extractAuth(req: express.Request): AuthPayload | null {
  const scheme = (req.headers["x-auth-scheme"] as string | undefined) ?? AuthScheme.API_TOKEN;

  if (scheme === AuthScheme.API_TOKEN) {
    const apiKey = req.headers["x-auth-apikey"] as string | undefined;
    if (!apiKey) return null;
    return { apiKey };
  }

  if (scheme === AuthScheme.CHATBOT) {
    const sessionId = req.headers["x-auth-session"] as string | undefined;
    const latestRecordUuid = req.headers["x-auth-chat"] as string | undefined;
    if (!sessionId || !latestRecordUuid) return null;
    return { sessionId, latestRecordUuid };
  }

  if (scheme === AuthScheme.WEB2) {
    const cookie = req.headers["x-auth-cookie"] as string | undefined;
    if (!cookie) return null;
    return { cookie, sessionAlias: req.headers["x-auth-session-alias"] as string | undefined };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

export default function streamableHttpTransport() {
  const app = express();
  app.use(express.json());

  const mcpServerUrl = process.env.MCP_SERVER_URL;
  const authServerUrl =
    process.env.RHOMBUS_AUTH_SERVER_URL ?? "https://auth.rhombussystems.com";
  const allowedHost = process.env.ALLOWED_HOST;
  const allowedHosts = allowedHost
    ? allowedHost.split(",").map((h) => h.trim()).filter(Boolean)
    : [];
  const rhombusClientId = process.env.RHOMBUS_OAUTH_CLIENT_ID;
  const rhombusClientSecret = process.env.RHOMBUS_OAUTH_CLIENT_SECRET;
  const jwtSecret = process.env.MCP_JWT_SECRET;

  // CORS — include Authorization so external OAuth clients can send Bearer tokens
  app.use(
    cors({
      origin: ["*"],
      exposedHeaders: ["mcp-session-id"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "mcp-session-id",
        "x-auth-scheme",
        "x-auth-apikey",
        "x-auth-session",
        "x-auth-chat",
        "x-auth-cookie",
        "x-auth-session-alias",
      ],
    })
  );

  // Health check — required for load balancers / Kubernetes liveness probes
  app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
  });

  // ---------------------------------------------------------------------------
  // OAuth 2.1 authorization server — mounted when all three OAuth env vars are set
  // ---------------------------------------------------------------------------

  let oauthProvider: RhombusOAuthProvider | undefined;

  if (mcpServerUrl && rhombusClientId && rhombusClientSecret && jwtSecret) {
    const callbackUrl = `${new URL(mcpServerUrl).origin}/oauth/callback`;

    oauthProvider = new RhombusOAuthProvider(
      rhombusClientId,
      rhombusClientSecret,
      callbackUrl,
      jwtSecret,
      authServerUrl
    );

    // Rhombus callback — must be registered before mcpAuthRouter takes over routing
    app.get("/oauth/callback", async (req, res) => {
      const code = req.query["code"] as string | undefined;
      const state = req.query["state"] as string | undefined;

      if (!code || !state) {
        res.status(400).send("Missing code or state parameter");
        return;
      }

      try {
        const redirectTo = await oauthProvider!.handleRhombusCallback(code, state);
        res.redirect(redirectTo);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.error(`OAuth callback error: ${msg}`);
        res.status(500).send(`OAuth callback failed: ${msg}`);
      }
    });

    // Standard MCP OAuth authorization server endpoints
    app.use(
      mcpAuthRouter({
        provider: oauthProvider,
        issuerUrl: new URL(mcpServerUrl),
        resourceServerUrl: new URL(mcpServerUrl),
        resourceName: "Rhombus MCP Server",
      })
    );

    logger.info(`OAuth authorization server mounted (issuer: ${mcpServerUrl})`);
  } else {
    logger.info(
      "OAuth not configured — set MCP_SERVER_URL, RHOMBUS_OAUTH_CLIENT_ID, RHOMBUS_OAUTH_CLIENT_SECRET, MCP_JWT_SECRET to enable"
    );
  }

  // ---------------------------------------------------------------------------
  // Stateless MCP endpoint
  //
  // Accepts either:
  //   - OAuth 2.1 Bearer token (Authorization: Bearer <jwt>) — for public MCP clients
  //   - x-auth-* headers — for the internal Rhombus chatbot
  // ---------------------------------------------------------------------------

  const handleMcpRequest = async (req: express.Request, res: express.Response) => {
    logger.info("Received MCP request");

    let auth: AuthPayload | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        if (!oauthProvider) throw new Error("OAuth not configured on this server");
        // verifyAccessToken decodes our JWT and returns the Rhombus token as authInfo.token
        const authInfo = await oauthProvider.verifyAccessToken(token);
        auth = { oauthToken: authInfo.token };
        logger.info("MCP request authenticated via Bearer token");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.warn(`Bearer token validation failed: ${msg}`);
        const resourceMetadataUrl = mcpServerUrl
          ? `${new URL(mcpServerUrl).origin}/.well-known/oauth-protected-resource`
          : undefined;
        const wwwAuth = resourceMetadataUrl
          ? `Bearer error="invalid_token", error_description="${msg}", resource_metadata="${resourceMetadataUrl}"`
          : `Bearer error="invalid_token", error_description="${msg}"`;
        res
          .status(401)
          .set("WWW-Authenticate", wwwAuth)
          .json({
            jsonrpc: "2.0",
            error: { code: -32000, message: `Unauthorized: ${msg}` },
            id: null,
          });
        return;
      }
    } else {
      // x-auth-* path (internal chatbot)
      auth = extractAuth(req);
      if (!auth) {
        const authServerOrigin = new URL(authServerUrl).origin;
        const resourceMetadataUrl = mcpServerUrl
          ? `${new URL(mcpServerUrl).origin}/.well-known/oauth-protected-resource`
          : undefined;
        const wwwAuth = resourceMetadataUrl
          ? `Bearer realm="${authServerOrigin}", resource_metadata="${resourceMetadataUrl}"`
          : `Bearer realm="${authServerOrigin}"`;
        res
          .status(401)
          .set("WWW-Authenticate", wwwAuth)
          .json({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message:
                "Unauthorized: provide Authorization: Bearer <token> or x-auth-* headers",
            },
            id: null,
          });
        return;
      }
      logger.info("MCP request authenticated via x-auth-* headers");
    }

    await requestAuthContext.run(auth, async () => {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        ...(allowedHosts.length > 0
          ? { enableDnsRebindingProtection: true, allowedHosts }
          : {}),
      });

      const server = await createServer();
      await server.connect(transport);
      logger.info("🔗 Stateless MCP Transport connected");

      await transport.handleRequest(req, res, req.body);
    });
  };

  app.post("/mcp", handleMcpRequest);

  app.get("/mcp", (_, res) => {
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      })
    );
  });

  app.delete("/mcp", (_, res) => {
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      })
    );
  });

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    logger.info(`rhombus-node-mcp listening on port ${PORT}`);
  });
}
