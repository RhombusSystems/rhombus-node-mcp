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

// The `status` string on a failed result is read by tools and relayed to the
// model almost verbatim, so it has to be a short, readable sentence. It used to
// be `JSON.stringify({body: <the entire request payload>, error: <raw text>})`,
// which buried the one useful line in a copy of the request — and collapsed to
// the literally useless "Request Error: {}" whenever the thrown value was an
// Error (JSON.stringify of an Error yields "{}").
const API_ERROR_DETAIL_LIMIT = 400;

function truncateDetail(text: string): string {
  return text.length > API_ERROR_DETAIL_LIMIT
    ? `${text.slice(0, API_ERROR_DETAIL_LIMIT)}…`
    : text;
}

/** Pull the human-readable message out of an api2 error body (JSON or plain text). */
function extractApiErrorDetail(responseText: string): string {
  const text = responseText.trim();
  if (!text) return "";
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      // `msg` is what api2's request deserializer returns on a malformed body
      // (e.g. {"msg":"JSON doesn't match expected object structure"}); without
      // it here the whole JSON blob got dumped into the model-facing message.
      for (const key of ["errorMsg", "message", "msg", "error", "status", "detail"]) {
        const value = (parsed as Record<string, unknown>)[key];
        if (typeof value === "string" && value.trim()) return truncateDetail(value.trim());
      }
    }
  } catch {
    // not JSON — fall through to the raw text
  }
  return truncateDetail(text);
}

function describeHttpFailure(status: number, responseText: string): string {
  const detail = extractApiErrorDetail(responseText);
  return detail
    ? `HTTP ${status}: ${detail}`
    : `HTTP ${status} from the Rhombus API (the response body carried no error message)`;
}

/** JSON.stringify(new Error(...)) === "{}", so unwrap thrown values by hand. */
function describeThrown(error: unknown): string {
  if (error instanceof Error) {
    const cause = error.cause instanceof Error ? ` (cause: ${error.cause.message})` : "";
    return `${error.name}: ${error.message}${cause}`;
  }
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const serialized = JSON.stringify(error);
    if (serialized && serialized !== "{}") return truncateDetail(serialized);
  }
  return String(error ?? "unknown error");
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
      const responseText = await response.text().catch(() => "");
      // The request body belongs in the log, not in the message the model reads.
      logger.error(
        `[POSTAPI] HTTP ${response.status} - ${redactUrlForLog(url)} - request: ${body} - response: ${truncateDetail(responseText)}`
      );
      if (response.status === 401 || response.status === 403) {
        return {
          error: true,
          status:
            "Sorry, I don't have permission to help with this request.  Consider upgrading my permissions by changing the role of the API Key I am using.",
        } as T & { error?: boolean; status?: string };
      }
      return {
        error: true,
        status: describeHttpFailure(response.status, responseText),
      } as T & { error?: boolean; status?: string };
    }
    const ret = await response.json();
    const jsonStr = JSON.stringify(ret);
    const truncatedJson = jsonStr.length > 150 ? jsonStr.substring(0, 150) + "..." : jsonStr;
    logger.debug(`✅ RESPONSE - ${response.ok} - ${truncatedJson}`);
    return ret as T & { error?: boolean; status?: string };
  } catch (error) {
    logger.error(
      `[POSTAPI] ERROR - ${redactUrlForLog(url)} - ${
        error instanceof Error ? (error.stack ?? error.message) : describeThrown(error)
      }`
    );

    return {
      error: true,
      status: `Request failed before a response was received: ${describeThrown(error)}`,
    } as T & { error?: boolean; status?: string };
  }
}

/**
 * api2 signals failure on TWO channels, and reading either one alone loses the
 * message on the other:
 *
 *  - **Transport / HTTP** failures are synthesised by `postApi` above as
 *    `{error: true, status: "<sentence>"}`. `status` is our field, not api2's.
 *  - **Domain** failures come back on HTTP **200** with `{error: true,
 *    errorMsg: "..."}` — api2's own in-band contract (734 response types in
 *    `types/schema.ts` declare `error`, 732 declare `errorMsg`).
 *
 * So a handler that checks only `status` reports "API request failed." for every
 * real api2 rejection ("that plate is already saved", "schedule not found"),
 * leaving the model nothing to correct. Returns undefined when the call
 * succeeded.
 */
export function apiFailureMessage(res: {
  error?: boolean;
  status?: string;
  errorMsg?: string | null;
}): string | undefined {
  if (!res.error) return undefined;
  const detail = res.status?.trim() || res.errorMsg?.trim();
  return detail || "The Rhombus API rejected the request without giving a reason.";
}

/**
 * api2's `warningMsg` — the "it worked, but" channel. A call can succeed while
 * reporting that part of it did not apply, and that caveat has to reach the
 * user.
 *
 * Takes `unknown` so any response shape can be checked without a cast at the
 * call site — the caveat should never be dropped just to satisfy the compiler.
 */
export function apiWarning(res: unknown): string | undefined {
  if (!res || typeof res !== "object") return undefined;
  const warning = (res as { warningMsg?: unknown }).warningMsg;
  return typeof warning === "string" && warning.trim() ? warning.trim() : undefined;
}

export function throwIfApiError(res: {
  error?: boolean;
  status?: string;
  errorMsg?: string | null;
}) {
  const message = apiFailureMessage(res);
  if (message) {
    throw new Error(message);
  }
}
