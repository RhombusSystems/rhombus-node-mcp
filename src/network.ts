import { logger } from "./logger.js";
import { authStore } from "./transports/streamable-http.js";
import { RequestModifiers } from "./util.js";

export const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

export const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

export const BASE_URL = `https://${serverUrl}/api`;

export const STATIC_HEADERS = {
  "Content-Type": "application/json",
  "x-rhombus-agent": "chatbot",
  accept: "application/json",
};

export const AUTH_HEADERS = {
  "x-auth-apikey": RHOMBUS_API_KEY!,
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
export async function postApi({
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

  // construct auth headers
  let authHeaders: Record<string, string> = {};
  if (!sessionId) {
    // if no sessionId, we fall back to the api key in our environment variables
    authHeaders = AUTH_HEADERS;
  } else {
    // use sessionId to get auth

    const auth = authStore.get(sessionId);
    if (!auth) {
      logger.error(`No auth found for sessionId: ${sessionId}`);
      throw new Error(`No auth found for sessionId: ${sessionId}`);
    }

    if ("apiKey" in auth) {
      authHeaders = {
        "x-auth-apikey": auth.apiKey,
        "x-auth-scheme": "api-token",
      };
    } else if ("sessionId" in auth) {
      authHeaders = {
        "x-auth-session": auth.sessionId,
        "x-auth-chat": auth.latestRecordUuid,
        "x-auth-scheme": "chatbot",
      };
      url = appendQueryParams(url, { _rs: auth.sessionId });
    }
  }

  // merge headers
  let requestHeaders: Record<string, string> = {
    ...STATIC_HEADERS,
    ...authHeaders,
    ...(modifiers?.headers ?? {}),
  };

  if (modifiers?.query) {
    url = appendQueryParams(url, modifiers.query);
  }

  // stringify body if it's not already a string
  if (typeof body === "object") {
    body = JSON.stringify(body);
  }

  try {
    logger.info(`[POSTAPI] REQUEST - ${url} - ${body} - ${JSON.stringify(requestHeaders)}`);
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
        };
      }
      throw {
        body: JSON.parse(body),
        error: await response.text(),
      };
      // throw new Error(`HTTP error! status: ${response.status}`);
    }
    const ret = await response.json();
    logger.debug(`✅ RESPONSE - ${response.ok} - ${JSON.stringify(ret)}`);
    return ret;
  } catch (error) {
    logger.error(`[POSTAPI] ERROR - ${JSON.stringify(error || {}, null, 4)}`);
    return {
      error: true,
      status: `Request Error: ${error}`,
    };
  }
}
