import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";

import { type AuthPayload, requestAuthContext } from "../auth-context.js";
import createServer from "../createServer.js";
import { logger } from "../logger.js";

// ---------------------------------------------------------------------------
// x-auth-* header extraction (internal chatbot / API key clients) — UNCHANGED
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
//
// Pure RFC 9728 OAuth 2.1 Resource Server. The Rhombus authorization server
// (RFC 8414 issuer) is configured via OAUTH_AS_ISSUER_URL — e.g. set it to
// the Rhombus auth host whose /.well-known/oauth-authorization-server
// document advertises /authorize, /token, /register, /revoke per
// RFC 6749 + 7636 + 7591 + 7009.
//
// The AS issues opaque Rhombus access tokens, so the MCP server does no
// local validation — it just forwards the Bearer to api2 as
// x-auth-access-token, which api2 already knows how to validate.
//
// The legacy x-auth-* dispatch for internal callers (chatbot, API-key, web2)
// is unchanged.
// ---------------------------------------------------------------------------

export default function streamableHttpTransport() {
  const app = express();
  app.use(express.json());

  const oauthAsIssuerUrl = process.env.OAUTH_AS_ISSUER_URL;
  const mcpServerUrl = process.env.MCP_SERVER_URL;
  const allowedHost = process.env.ALLOWED_HOST;
  const allowedHosts = allowedHost
    ? allowedHost.split(",").map((h) => h.trim()).filter(Boolean)
    : [];

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

  app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
  });

  if (oauthAsIssuerUrl) {
    logger.info(`OAuth Resource Server — AS at ${oauthAsIssuerUrl}`);
  } else {
    logger.info(
      "OAUTH_AS_ISSUER_URL not set — Bearer tokens will be rejected. Set this to the Rhombus authorization server issuer URL (e.g. https://auth-web.<env>.rhombussystems.com/)."
    );
  }

  // RFC 9728 — Protected Resource Metadata. Points clients at the Rhombus AS.
  // Preserves the issuer URL verbatim so the value matches the `issuer` field
  // strict OAuth clients (Claude Desktop, etc.) read from the AS metadata.
  app.get("/.well-known/oauth-protected-resource", (req, res) => {
    if (!oauthAsIssuerUrl) {
      res.status(404).json({ error: "oauth_not_configured" });
      return;
    }
    res.json({
      resource: mcpServerUrl ?? `${getSelfOrigin(req, mcpServerUrl)}/mcp`,
      authorization_servers: [oauthAsIssuerUrl],
      scopes_supported: ["rhombus:access"],
      bearer_methods_supported: ["header"],
    });
  });

  const handleMcpRequest = async (req: express.Request, res: express.Response) => {
    logger.info("Received MCP request");

    let auth: AuthPayload | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      if (!oauthAsIssuerUrl) {
        return reject401(req, res, mcpServerUrl, "OAuth not configured: set OAUTH_AS_ISSUER_URL");
      }
      const token = authHeader.slice(7).trim();
      if (!token) {
        return reject401(req, res, mcpServerUrl, "empty Bearer token");
      }
      auth = { oauthBearer: token };
      logger.info("MCP request authenticated via Bearer (opaque, forwarded to api2)");
    } else {
      auth = extractAuth(req);
      if (!auth) {
        return reject401(req, res, mcpServerUrl, "no credentials presented");
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function reject401(
  req: express.Request,
  res: express.Response,
  mcpServerUrl: string | undefined,
  msg: string
) {
  const resourceMetadataUrl = `${getSelfOrigin(req, mcpServerUrl)}/.well-known/oauth-protected-resource`;
  res
    .status(401)
    .set(
      "WWW-Authenticate",
      `Bearer error="invalid_token", error_description="${escapeWwwAuth(msg)}", resource_metadata="${resourceMetadataUrl}"`
    )
    .json({
      jsonrpc: "2.0",
      error: { code: -32000, message: `Unauthorized: ${msg}` },
      id: null,
    });
}

function getSelfOrigin(req: express.Request, mcpServerUrl?: string): string {
  if (mcpServerUrl) {
    try {
      return new URL(mcpServerUrl).origin;
    } catch {
      // fall through
    }
  }
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
  const host = req.headers.host ?? "localhost";
  return `${proto}://${host}`;
}

function escapeWwwAuth(s: string): string {
  return s.replace(/["\r\n]/g, "");
}