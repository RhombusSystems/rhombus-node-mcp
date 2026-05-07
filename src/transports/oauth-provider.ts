import crypto from "node:crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import type {
  OAuthClientInformationFull,
  OAuthTokens,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import type {
  OAuthServerProvider,
  AuthorizationParams,
} from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { logger } from "../logger.js";

// ---------------------------------------------------------------------------
// In-memory clients store
// ---------------------------------------------------------------------------

class RhombusClientsStore implements OAuthRegisteredClientsStore {
  private clients = new Map<string, OAuthClientInformationFull>();

  getClient(clientId: string): OAuthClientInformationFull | undefined {
    return this.clients.get(clientId);
  }

  registerClient(
    client: Omit<OAuthClientInformationFull, "client_id" | "client_id_issued_at">
  ): OAuthClientInformationFull {
    const full: OAuthClientInformationFull = {
      ...client,
      client_id: crypto.randomUUID(),
      client_id_issued_at: Math.floor(Date.now() / 1000),
    };
    this.clients.set(full.client_id, full);
    logger.info(`Registered OAuth client: ${full.client_id} (${full.client_name ?? "unnamed"})`);
    return full;
  }
}

// ---------------------------------------------------------------------------
// In-flight state
// ---------------------------------------------------------------------------

interface PendingAuthorization {
  codeChallenge: string;
  clientId: string;
  redirectUri: string;
  state?: string;
  rhombusCodeVerifier: string;
  createdAt: number;
}

interface PendingCode {
  codeChallenge: string;
  rhombusToken: string;
  rhombusRefreshToken?: string;
  expiresAt: number;
  clientId: string;
}

// ---------------------------------------------------------------------------
// PKCE helpers
// ---------------------------------------------------------------------------

function generateCodeVerifier(): string {
  return crypto.randomBytes(64).toString("base64url").slice(0, 128);
}

function computeCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export class RhombusOAuthProvider implements OAuthServerProvider {
  readonly clientsStore: RhombusClientsStore;
  // Let the SDK validate the Claude Desktop PKCE leg locally
  readonly skipLocalPkceValidation = false;

  private pendingAuthorizations = new Map<string, PendingAuthorization>();
  private pendingCodes = new Map<string, PendingCode>();

  constructor(
    private readonly rhombusClientId: string,
    private readonly rhombusClientSecret: string,
    private readonly callbackUrl: string,
    private readonly jwtSecret: string,
    private readonly authServerUrl: string
  ) {
    this.clientsStore = new RhombusClientsStore();
  }

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    // Generate a fresh PKCE pair for the Rhombus leg
    const rhombusState = crypto.randomBytes(16).toString("hex");
    const rhombusCodeVerifier = generateCodeVerifier();
    const rhombusCodeChallenge = computeCodeChallenge(rhombusCodeVerifier);

    this.pendingAuthorizations.set(rhombusState, {
      codeChallenge: params.codeChallenge,
      clientId: client.client_id,
      redirectUri: params.redirectUri,
      state: params.state,
      rhombusCodeVerifier,
      createdAt: Date.now(),
    });

    // The Rhombus console accepts authorization code + PKCE only when called with
    // snake_case param names (client_id, redirect, challenge). Camel-case variants
    // are silently ignored and the page falls back to implicit flow. See the
    // rhombus-cli login command for the canonical working pattern.
    const consoleUrl = process.env.RHOMBUS_CONSOLE_URL ?? "https://console.rhombussystems.com";
    const loginUrl = new URL(`${consoleUrl}/login`);
    loginUrl.searchParams.set("type", "oauth");
    loginUrl.searchParams.set("client_id", this.rhombusClientId);
    loginUrl.searchParams.set("redirect", this.callbackUrl);
    loginUrl.searchParams.set("state", rhombusState);
    loginUrl.searchParams.set("challenge", rhombusCodeChallenge);

    logger.info(`Redirecting to Rhombus authorize for client ${client.client_id}`);
    res.redirect(loginUrl.toString());
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const pending = this.pendingCodes.get(authorizationCode);
    if (!pending) throw new Error("Authorization code not found");
    return pending.codeChallenge;
  }

  async exchangeAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<OAuthTokens> {
    const pending = this.pendingCodes.get(authorizationCode);
    if (!pending) throw new Error("Authorization code not found or expired");
    this.pendingCodes.delete(authorizationCode);

    const expiresIn = Math.max(60, pending.expiresAt - Math.floor(Date.now() / 1000));

    const accessToken = this.signToken(
      { sub: pending.clientId, rhombus_token: pending.rhombusToken },
      expiresIn
    );
    const refreshToken = pending.rhombusRefreshToken
      ? this.signToken(
          { sub: pending.clientId, rhombus_refresh_token: pending.rhombusRefreshToken },
          60 * 60 * 24 * 30
        )
      : undefined;

    return {
      access_token: accessToken,
      token_type: "bearer",
      expires_in: expiresIn,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }

  async exchangeRefreshToken(
    client: OAuthClientInformationFull,
    refreshToken: string
  ): Promise<OAuthTokens> {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(refreshToken, this.jwtSecret) as jwt.JwtPayload;
    } catch {
      throw new Error("Invalid refresh token");
    }

    const rhombusRefreshToken = payload["rhombus_refresh_token"] as string | undefined;
    if (!rhombusRefreshToken) throw new Error("Invalid refresh token format");

    const resp = await axios.post(
      `${this.authServerUrl}/oauth/token`,
      {
        grantType: "REFRESH_TOKEN",
        refreshToken: rhombusRefreshToken,
        clientId: this.rhombusClientId,
        clientSecret: this.rhombusClientSecret,
      },
      { headers: { "x-auth-scheme": "web2", "Content-Type": "application/json" } }
    );

    const data = resp.data as {
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpirationSec?: number;
      error?: boolean;
      errorMsg?: string;
    };
    if (data.error || !data.accessToken) {
      throw new Error(data.errorMsg ?? "Rhombus refresh failed");
    }

    const expiresIn = data.accessTokenExpirationSec ?? 3600;
    const newAccessToken = this.signToken(
      { sub: client.client_id, rhombus_token: data.accessToken },
      expiresIn
    );
    const newRefreshToken = data.refreshToken
      ? this.signToken(
          { sub: client.client_id, rhombus_refresh_token: data.refreshToken },
          60 * 60 * 24 * 30
        )
      : undefined;

    return {
      access_token: newAccessToken,
      token_type: "bearer",
      expires_in: expiresIn,
      ...(newRefreshToken ? { refresh_token: newRefreshToken } : {}),
    };
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Invalid access token: ${msg}`);
    }

    const rhombusToken = payload["rhombus_token"] as string | undefined;
    if (!rhombusToken) throw new Error("Token missing rhombus_token claim");

    return {
      token: rhombusToken,
      clientId: (payload.sub as string) ?? "unknown",
      scopes: [],
      expiresAt: payload.exp,
    };
  }

  /**
   * Handle GET /oauth/callback — called after Rhombus redirects back.
   * Exchanges the Rhombus auth code for tokens, issues our own code,
   * and returns the redirect URL to send Claude Desktop to.
   */
  async handleRhombusCallback(rhombusCode: string, rhombusState: string): Promise<string> {
    const pending = this.pendingAuthorizations.get(rhombusState);
    if (!pending) throw new Error("Unknown or expired state parameter");
    this.pendingAuthorizations.delete(rhombusState);

    logger.info(`Exchanging Rhombus auth code for tokens (client: ${pending.clientId})`);

    const resp = await axios.post(
      `${this.authServerUrl}/oauth/token`,
      {
        grantType: "AUTHORIZATION_CODE",
        authorizationCode: rhombusCode,
        clientId: this.rhombusClientId,
        clientSecret: this.rhombusClientSecret,
        redirectUri: this.callbackUrl,
        codeVerifier: pending.rhombusCodeVerifier,
        codeChallengeType: "S256",
      },
      { headers: { "x-auth-scheme": "web2", "Content-Type": "application/json" } }
    );

    const data = resp.data as {
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpirationSec?: number;
      error?: boolean;
      errorMsg?: string;
    };

    if (data.error || !data.accessToken) {
      throw new Error(data.errorMsg ?? "Rhombus token exchange failed");
    }

    // Issue our own authorization code
    const ourCode = crypto.randomBytes(32).toString("base64url");
    this.pendingCodes.set(ourCode, {
      codeChallenge: pending.codeChallenge,
      rhombusToken: data.accessToken,
      rhombusRefreshToken: data.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + (data.accessTokenExpirationSec ?? 3600),
      clientId: pending.clientId,
    });

    // Redirect Claude Desktop to its callback with our code
    const redirectUrl = new URL(pending.redirectUri);
    redirectUrl.searchParams.set("code", ourCode);
    if (pending.state) redirectUrl.searchParams.set("state", pending.state);

    logger.info(`Issuing auth code for client ${pending.clientId}, redirecting to ${pending.redirectUri}`);
    return redirectUrl.toString();
  }

  private signToken(payload: object, expiresIn: number): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }
}
