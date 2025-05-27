import { logger } from "./logger.js";
import { RequestModifiers } from "./util.js";

export const RHOMBUS_API_KEY = process.env.RHOMBUS_API_KEY;

if (!RHOMBUS_API_KEY) {
  console.error("Missing RHOMBUS_API_KEY");
}

export const serverUrl = process.env.RHOMBUS_API_SERVER || "api2.rhombussystems.com";

export const BASE_URL = `https://${serverUrl}/api`;

export const STATIC_HEADERS = {
  "Content-Type": "application/json",
  "x-rhombus-agent": "chatbot",
  accept: "application/json",
};

export const AUTH_HEADERS = {
  "x-auth-apikey": RHOMBUS_API_KEY,
  "x-auth-scheme": "api-token",
};

const enableLogs = process.env.ENABLE_LOGS;
const log = (msg: any) => {
  if (!enableLogs) return;
  console.error(msg);
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

export async function postApi(url: string, body: string, modifiers: RequestModifiers = null) {
  let requestHeaders = {
    ...(modifiers?.headers ?? AUTH_HEADERS),
    ...STATIC_HEADERS,
  };

  if (modifiers?.query) {
    url = appendQueryParams(url, modifiers.query);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const ret = await response.json();
    logger.debug(`✅ RESPONSE - ${response.ok} - ${JSON.stringify(ret)}`);
    return ret;
  } catch (error) {
    logger.error(`[POSTAPI] ERROR - ${JSON.stringify(error || {})}`);
    return {
      error: true,
      status: `Request Error: ${error}`,
    };
  }
}
