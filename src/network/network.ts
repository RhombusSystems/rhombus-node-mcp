import { logger } from "../logger.js";
import { requestAuthContext } from "../auth-context.js";
import type { RequestModifiers } from "../util.js";

export const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

export const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

export const BASE_URL = `https://${serverUrl}/api`;

export const STATIC_HEADERS = {
  "Content-Type": "application/json",
  "x-rhombus-agent": "chatbot",
  accept: "application/json",
};

export const AUTH_HEADERS = {
  "x-auth-apikey": RHOMBUS_API_KEY ?? "",
  "x-auth-scheme": "api-token",
};

export const appendQueryParams = (url: string, params: object | undefined): string => {
  if (!params || typeof params !== "object") return url;

  const urlObj = new URL(url);

  const existingSearchParams = new URLSearchParams(urlObj.search);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      existingSearchParams.append(key, String(value));
    }
  }
  const baseUrl = url.split("?")[0];
  const queryString = existingSearchParams.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export function constructRequestHeaders(
  url: string,
  modifiers?: RequestModifiers,
  sessionId?: string  // kept for API compatibility; ignored — always uses AsyncLocalStorage
) {
  // construct auth headers from async context (stateless: set per-request by the transport handler)
  let authHeaders: Record<string, string> = {};
  const contextAuth = requestAuthContext.getStore();
  if (contextAuth) {
    if ("oauthBearer" in contextAuth) {
      // The Bearer is an opaque Rhombus access token issued by the Rhombus
      // OAuth 2.1 authorization server. api2 validates it directly.
      authHeaders = {
        "x-auth-access-token": contextAuth.oauthBearer,
        "x-auth-scheme": "api-oauth-token",
      };
    } else if ("apiKey" in contextAuth) {
      authHeaders = {
        "x-auth-apikey": contextAuth.apiKey,
        "x-auth-scheme": "api-token",
      };
    } else if ("sessionId" in contextAuth) {
      authHeaders = {
        "x-auth-session": contextAuth.sessionId,
        "x-auth-chat": contextAuth.latestRecordUuid,
        "x-auth-scheme": "chatbot",
      };
      url = appendQueryParams(url, { _rs: contextAuth.sessionId });
    } else if ("cookie" in contextAuth) {
      authHeaders = {
        "x-auth-scheme": "web2",
        cookie: contextAuth.cookie,
      };
      if (contextAuth.sessionAlias) {
        url = appendQueryParams(url, { _rs: contextAuth.sessionAlias });
      }
    }
  } else {
    // no async context — fall back to env API key (local dev / stdio)
    authHeaders = AUTH_HEADERS;
  }

  // merge headers
  const requestHeaders: Record<string, string> = {
    ...STATIC_HEADERS,
    ...authHeaders,
    ...(modifiers?.headers ?? {}),
  };

  if (modifiers?.query) {
    url = appendQueryParams(url, modifiers.query);
  }

  return { url, requestHeaders };
}

// Credential-bearing headers must never reach the log store (they were being
// written verbatim to OpenSearch on every outbound call, prod included). The
// session token also rides in the URL as `_rs`, so redact that too.
const SENSITIVE_HEADERS = new Set([
  "x-auth-apikey",
  "x-auth-access-token",
  "x-auth-session",
  "cookie",
]);

function redactHeadersForLog(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    out[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? `<set, ${value.length} chars>` : value;
  }
  return out;
}

function redactUrlForLog(url: string): string {
  return url.replace(/([?&]_rs=)[^&]+/g, "$1<redacted>");
}

export async function postApi<T>({
  route,
  body,
  modifiers,
  sessionId,
}: {
  route: string;
  body: object | string;
  modifiers?: RequestModifiers;
  sessionId?: string;
}) {
  let url = BASE_URL + route;

  const { url: newUrl, requestHeaders } = constructRequestHeaders(
    BASE_URL + route,
    modifiers,
    sessionId
  );
  url = newUrl;

  // stringify body if it's not already a string
  if (typeof body === "object") {
    body = JSON.stringify(body);
  }

  try {
    logger.info(
      `[POSTAPI] REQUEST - ${redactUrlForLog(url)} - ${body} - ${JSON.stringify(redactHeadersForLog(requestHeaders))}`
    );
    const response = await fetch(url, {
      method: "POST",
      headers: requestHeaders as HeadersInit,
      body,
    });
    if (!response.ok) {
      logger.debug(`❌ RESPONSE - ${response.ok} - ${response.status}`);
      if (response.status === 401 || response.status === 403) {
        return {
          error: true,
          status:
            "Sorry, I don't have permission to help with this request.  Consider upgrading my permissions by changing the role of the API Key I am using.",
        } as T & { error?: boolean; status?: string };
      }
      throw {
        body: JSON.parse(body),
        error: await response.text(),
      };
      // throw new Error(`HTTP error! status: ${response.status}`);
    }
    const ret = await response.json();
    const jsonStr = JSON.stringify(ret);
    const truncatedJson = jsonStr.length > 150 ? jsonStr.substring(0, 150) + "..." : jsonStr;
    logger.debug(`✅ RESPONSE - ${response.ok} - ${truncatedJson}`);
    return ret as T & { error?: boolean; status?: string };
  } catch (error) {
    logger.error(`[POSTAPI] ERROR - ${JSON.stringify(error || {}, null, 4)}`);

    return {
      error: true,
      status: `Request Error: ${JSON.stringify(error)}`,
    } as T & { error?: boolean; status?: string };
  }
}

export function throwIfApiError(res: { error?: boolean; status?: string }) {
  if (res.error) {
    throw new Error(res.status ?? "API request failed.");
  }
}
