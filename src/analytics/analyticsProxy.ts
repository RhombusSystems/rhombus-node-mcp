import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { resolveSessionIdentity } from "../api/get-accessible-apps.js";
import { logger } from "../logger.js";
import { extractFromToolExtra } from "../util.js";
import { analyticsEnabled, trackEvent } from "./amplitude.js";

const TOOL_CALLED_EVENT = "MCP Tool Called";

// biome-ignore lint/suspicious/noExplicitAny: MCP tool handler signature is dynamic
type ToolHandler = (args: any, extra: unknown) => Promise<CallToolResult> | CallToolResult;

/**
 * Resolve identity (cached `getCurrentUser` — no extra API call for session
 * callers) and emit the tool-call event. Fire-and-forget: never awaited by the
 * handler and fully guarded so analytics cannot affect the response.
 */
async function emitToolCall(
  toolName: string,
  // biome-ignore lint/suspicious/noExplicitAny: dynamic tool args
  args: any,
  extra: unknown,
  success: boolean,
  durationMs: number,
  errorMessage?: string
): Promise<void> {
  try {
    const { sessionId } = extractFromToolExtra(extra);
    const identity = sessionId ? await resolveSessionIdentity(sessionId) : null;

    trackEvent(
      TOOL_CALLED_EVENT,
      {
        tool_name: toolName,
        success,
        duration_ms: durationMs,
        // Record which arguments were supplied, never their values (avoid PII).
        arg_keys: args && typeof args === "object" ? Object.keys(args) : [],
        transport: process.env.TRANSPORT_TYPE ?? "stdio",
        ...(errorMessage ? { error_message: errorMessage } : {}),
      },
      {
        userId: identity?.userId,
        orgUuid: identity?.orgUuid,
        deviceId: sessionId,
      }
    );
  } catch (error) {
    logger.debug(`📊 emitToolCall("${toolName}") failed: ${String(error)}`);
  }
}

/** Wrap a tool handler so each invocation is timed and tracked. */
function wrapHandler(toolName: string, handler: ToolHandler): ToolHandler {
  return async (args: unknown, extra: unknown) => {
    const start = Date.now();
    let success = true;
    let errorMessage: string | undefined;
    try {
      const result = await handler(args, extra);
      // A tool can signal failure via `isError` rather than throwing.
      if (result && typeof result === "object" && (result as CallToolResult).isError) {
        success = false;
      }
      return result;
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      void emitToolCall(toolName, args, extra, success, Date.now() - start, errorMessage);
    }
  };
}

/**
 * Returns a Proxy over an `McpServer` that wraps every tool handler to emit a
 * `"${TOOL_CALLED_EVENT}"` analytics event. Both registration methods are
 * intercepted: `registerTool` (most tools) and the legacy `tool` (a handful,
 * including the filtering-blacklisted ones), so coverage is complete.
 *
 * When analytics are disabled the proxy returns the server untouched, so there
 * is zero overhead on deployments without `AMPLITUDE_API_KEY`.
 *
 * Compose it *inside* the filtering proxy — `createFilteringProxy(createAnalyticsProxy(server))`
 * — so handlers are timed after filtering strips `includeFields`/`filterBy`,
 * keeping those synthetic args out of `arg_keys`.
 */
export function createAnalyticsProxy(server: McpServer): McpServer {
  if (!analyticsEnabled()) return server;

  return new Proxy(server, {
    get(target, prop, receiver) {
      if (prop === "registerTool") {
        // biome-ignore lint/suspicious/noExplicitAny: proxy intercept
        return (name: string, config: any, handler: ToolHandler) =>
          (target as any).registerTool(name, config, wrapHandler(name, handler));
      }

      if (prop === "tool") {
        // Legacy signature: tool(name, [description], [paramsSchema], [annotations], handler).
        // The handler is always the final argument.
        // biome-ignore lint/suspicious/noExplicitAny: proxy intercept
        return (...toolArgs: any[]) => {
          const name = toolArgs[0];
          const lastIdx = toolArgs.length - 1;
          if (typeof toolArgs[lastIdx] === "function") {
            toolArgs[lastIdx] = wrapHandler(name, toolArgs[lastIdx]);
          }
          return (target as any).tool(...toolArgs);
        };
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
