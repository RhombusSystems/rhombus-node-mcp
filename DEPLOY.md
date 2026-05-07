# Deploying rhombus-node-mcp (HTTP / OAuth mode)

Cloud-ops guide for hosting `rhombus-node-mcp` publicly so external MCP clients (Claude Desktop, etc.) can connect via OAuth 2.1.

For local development and the stdio (Claude Desktop bundled) flow, see `README.md` instead.

---

## 1. What this service is

A stateless HTTP server that exposes the Rhombus public MCP tools over OAuth 2.1 + Bearer tokens. It acts as **both** an OAuth resource server (validates tokens on `/mcp`) **and** an OAuth authorization server (handles `/authorize`, `/token`, `/register`, `/.well-known/*`) that federates user login to the Rhombus console. End users sign in to Rhombus; this server mints its own short-lived JWTs that wrap a Rhombus access token.

## 2. Prerequisites — one-time, owned by the Rhombus auth team

Before deployment, an OAuth client must exist on Rhombus with:

| Field | Value |
|---|---|
| Type | Authorization code + PKCE (S256) |
| Redirect URI whitelist | `https://<MCP_PUBLIC_HOSTNAME>/oauth/callback` (exactly — including scheme, host, path) |
| Grant types | `AUTHORIZATION_CODE`, `REFRESH_TOKEN` |

Hand the resulting `client_id` and `client_secret` to whoever populates the deployment secrets. If the public hostname changes, the redirect URI whitelist must be updated to match.

## 3. Required infrastructure

- **HTTPS termination** at a load balancer / ingress — OAuth callbacks must be HTTPS. The container itself listens on plain HTTP (port `3123` by default).
- **Stable public DNS name** — used as `MCP_SERVER_URL`. Cannot change without re-whitelisting on the OAuth client (step 2).
- **Health check** — the service exposes `GET /health` returning `{"status":"ok"}`. Use for liveness/readiness probes.
- **Replicas** — see §7 "Operational notes" below. **Default to 1 replica** unless you configure sticky sessions.

## 4. Environment variables

| Variable | Required | Description |
|---|---|---|
| `TRANSPORT_TYPE` | yes | Must be `streamable-http`. (Already defaulted in the Dockerfile.) |
| `PORT` | no | Listen port. Defaults to `3123`. |
| `MCP_SERVER_URL` | yes | Public HTTPS URL of this service, e.g. `https://mcp.rhombussystems.com`. Used as the OAuth issuer URL and to construct the callback URL. **Must match the OAuth client's whitelisted redirect URI host.** |
| `RHOMBUS_OAUTH_CLIENT_ID` | yes | OAuth client ID issued by the Rhombus auth team (step 2). |
| `RHOMBUS_OAUTH_CLIENT_SECRET` | yes | Matching client secret. Treat as a secret. |
| `MCP_JWT_SECRET` | yes | Symmetric secret used to sign the JWTs this server issues to MCP clients. Generate fresh per environment, e.g. `openssl rand -base64 64`. Treat as a secret. **Rotating invalidates all outstanding tokens.** |
| `RHOMBUS_AUTH_SERVER_URL` | no | Rhombus auth server base URL for token exchange. Defaults to `https://auth.rhombussystems.com`. |
| `RHOMBUS_CONSOLE_URL` | no | Rhombus console base URL (used for the user-facing login redirect). Defaults to `https://console.rhombussystems.com`. EU customers should set this to the EU console. |
| `ALLOWED_HOST` | recommended | Comma-separated list of `Host` header values the `/mcp` endpoint will accept (DNS-rebinding protection). Include the public hostname and any internal hostnames clients may use. Example: `mcp.rhombussystems.com,mcp-internal.svc.cluster.local`. Leave unset only if you accept that any `Host` header is allowed. |

If any of `MCP_SERVER_URL`, `RHOMBUS_OAUTH_CLIENT_ID`, `RHOMBUS_OAUTH_CLIENT_SECRET`, `MCP_JWT_SECRET` is missing, the OAuth endpoints are not mounted and the server starts up in legacy `x-auth-*`-headers-only mode. Check startup logs for `OAuth authorization server mounted` to confirm OAuth is active.

## 5. Build and run

The `Dockerfile` at the root of `rhombus-node-mcp/` produces a self-contained runtime image.

```bash
# From the rhombus-node-mcp directory
docker build -t rhombus-node-mcp:<tag> .
```

Run with the env vars from §4 supplied via your secret-management system. Minimal example:

```bash
docker run -d \
  --name rhombus-node-mcp \
  -p 3123:3123 \
  -e MCP_SERVER_URL=https://mcp.rhombussystems.com \
  -e RHOMBUS_OAUTH_CLIENT_ID=... \
  -e RHOMBUS_OAUTH_CLIENT_SECRET=... \
  -e MCP_JWT_SECRET=... \
  -e ALLOWED_HOST=mcp.rhombussystems.com \
  rhombus-node-mcp:<tag>
```

In production, inject secrets via Kubernetes `Secret`/AWS Secrets Manager/HashiCorp Vault — never via `-e` flags or `docker run` history.

## 6. Post-deploy verification

After the load balancer points at the new instance, run these from any host (no auth needed):

```bash
PUBLIC=https://mcp.rhombussystems.com   # set to your MCP_SERVER_URL

# 6.1 Health check — must return 200 + {"status":"ok"}
curl -fsS "$PUBLIC/health"

# 6.2 OAuth resource metadata — must return JSON with "resource" = $PUBLIC
curl -fsS "$PUBLIC/.well-known/oauth-protected-resource" | jq .

# 6.3 OAuth authorization server metadata — must return JSON with "issuer" = $PUBLIC
#     and authorization_endpoint / token_endpoint / registration_endpoint URLs under $PUBLIC
curl -fsS "$PUBLIC/.well-known/oauth-authorization-server" | jq .

# 6.4 Dynamic Client Registration — must return 201/200 with a generated client_id
curl -fsS -X POST "$PUBLIC/register" \
  -H 'Content-Type: application/json' \
  -d '{"redirect_uris":["http://localhost/cb"],"client_name":"deploy-smoke-test"}' | jq .

# 6.5 Unauthenticated /mcp call — must return 401 with WWW-Authenticate header
#     pointing at /.well-known/oauth-protected-resource
curl -i -X POST "$PUBLIC/mcp" -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1}'
```

Then, for the full end-to-end check, connect Claude Desktop (or any OAuth-capable MCP client) to `$PUBLIC/mcp` and complete the login flow. The expected log lines on the server are, in order:

```
Registered OAuth client: <uuid> (<client_name>)         # DCR
Redirecting to Rhombus authorize for client <uuid>      # /authorize
Exchanging Rhombus auth code for tokens (client: <uuid>)   # /oauth/callback
Issuing auth code for client <uuid>, redirecting to ...    # /oauth/callback
MCP request authenticated via Bearer token              # first /mcp call after login
```

If any line is missing, that's the failing hop.

## 7. Operational notes

**State is in-process.** Two short-lived maps live in process memory:
- `pendingAuthorizations` — created during `/authorize`, consumed at `/oauth/callback` (typically <1 minute).
- `pendingCodes` — created at `/oauth/callback`, consumed at `/token` (typically seconds).

This means **a single OAuth flow must hit the same replica for every step.** Options:
- **Single replica** — simplest. The service is light; one replica suffices for moderate traffic. *Recommended for v1.*
- **Sticky sessions** — load-balance by client IP or by a session cookie. Note that the OAuth flow involves a browser redirect from Rhombus → `/oauth/callback`, so the stickiness key needs to survive that redirect (client-IP stickiness works; cookie stickiness only works if Rhombus's redirect carries the cookie back, which it generally won't).
- **External state store** — would require a code change to back the maps with Redis or similar. Not implemented today.

**`/mcp` itself is fully stateless** and safe to scale across replicas — only the OAuth flow has the affinity requirement above.

**Token lifetime.** Access tokens this service issues default to whatever Rhombus returns for `accessTokenExpirationSec` (commonly 1 hour). Refresh tokens, if Rhombus returns one, are wrapped and returned to the client; the client refreshes through this server's `/token` endpoint, which calls Rhombus again. Rotating `MCP_JWT_SECRET` invalidates all outstanding access and refresh tokens — clients will be forced through the full login flow again.

**Logs.** All logs go to stdout in JSON-ish line format. There is no separate audit log. Useful greps:
- `OAuth callback failed: ...` — Rhombus token exchange or state lookup failed.
- `Bearer token validation failed: ...` — incoming Bearer JWT was invalid/expired.
- `MCP request authenticated via Bearer token` — successful auth on `/mcp`.

**No persistence.** This service does not write to disk. Restart drops in-flight OAuth flows (users will see "Unknown or expired state parameter" if they were mid-login) but does not invalidate already-issued tokens.

## 8. Updating the OAuth client redirect-URI whitelist

The redirect URI must exactly match `${MCP_SERVER_URL}/oauth/callback`. Whenever the public hostname changes (rare — typically only environment promotions), file a request with the Rhombus auth team to update the whitelist on the OAuth client. Until that's done, every login will fail at the Rhombus consent step.
