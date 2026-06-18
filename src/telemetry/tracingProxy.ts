import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  context,
  SpanKind,
  SpanStatusCode,
  trace,
  TraceFlags,
  type Span,
} from "@opentelemetry/api";

import { resolveSessionIdentity } from "../api/get-accessible-apps.js";
import { logger } from "../logger.js";
import { extractFromToolExtra } from "../util.js";

const TRACER_NAME = "rhombus-node-mcp";
const TOOL_CALL_SPAN = "mcp.tool.call";
const INVALID_TRACE_ID = "00000000000000000000000000000000";

let warnedNoopTracer = false;

// biome-ignore lint/suspicious/noExplicitAny: MCP tool handler signature is dynamic
type ToolHandler = (args: any, extra: unknown) => Promise<CallToolResult> | CallToolResult;

function warnIfNoopTracer(span: Span): void {
  if (warnedNoopTracer) return;
  const { traceId, traceFlags } = span.spanContext();
  if (traceId === INVALID_TRACE_ID || traceFlags === TraceFlags.NONE) {
    warnedNoopTracer = true;
    logger.warn(
      "📡 OpenTelemetry custom spans are no-ops — @opentelemetry/api is not sharing the SDK TracerProvider. Check for duplicate @opentelemetry/api in node_modules.",
    );
  }
}

function setArgKeys(span: Span, args: unknown): void {
  if (args && typeof args === "object") {
    const keys = Object.keys(args);
    span.setAttribute("mcp.tool.arg_keys", keys.join(","));
    const requestType = (args as { requestType?: unknown }).requestType;
    if (typeof requestType === "string") {
      span.setAttribute("mcp.tool.request_type", requestType);
    }
  }
}

async function attachSessionIdentity(span: Span, extra: unknown): Promise<void> {
  try {
    const { sessionId } = extractFromToolExtra(extra);
    if (!sessionId) return;

    span.setAttribute("mcp.session.id", sessionId);
    const identity = await resolveSessionIdentity(sessionId);
    if (identity?.userId) span.setAttribute("enduser.id", identity.userId);
    if (identity?.orgUuid) span.setAttribute("mcp.org.uuid", identity.orgUuid);
  } catch (error) {
    logger.debug(`tracing: attachSessionIdentity failed: ${String(error)}`);
  }
}

/** Wrap a tool handler so each invocation emits an `mcp.tool.call` span. */
function wrapHandler(toolName: string, handler: ToolHandler): ToolHandler {
  return async (args: unknown, extra: unknown) => {
    const tracer = trace.getTracer(TRACER_NAME);
    const parentContext = context.active();

    return tracer.startActiveSpan(
      TOOL_CALL_SPAN,
      { kind: SpanKind.INTERNAL },
      parentContext,
      async (span) => {
        warnIfNoopTracer(span);

        const start = Date.now();
        span.setAttribute("mcp.tool.name", toolName);
        span.setAttribute("mcp.transport", process.env.TRANSPORT_TYPE ?? "stdio");
        setArgKeys(span, args);

        try {
          await attachSessionIdentity(span, extra);

          const result = await handler(args, extra);
          const isError =
            result && typeof result === "object" && (result as CallToolResult).isError;
          span.setAttribute("mcp.tool.success", !isError);
          if (isError) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: "tool returned isError",
            });
          } else {
            span.setStatus({ code: SpanStatusCode.OK });
          }
          return result;
        } catch (error) {
          span.setAttribute("mcp.tool.success", false);
          span.recordException(error instanceof Error ? error : new Error(String(error)));
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
          });
          throw error;
        } finally {
          span.setAttribute("mcp.tool.duration_ms", Date.now() - start);
          span.end();
        }
      },
    );
  };
}

/**
 * Returns a Proxy over an `McpServer` that wraps every tool handler with an
 * OpenTelemetry span. Both registration methods are intercepted: `registerTool`
 * (most tools) and the legacy `tool` (a handful, including the
 * filtering-blacklisted ones), so coverage is complete.
 *
 * Uses only `@opentelemetry/api` — spans are no-ops unless a host process (e.g.
 * Rhombus EB deploy with `otel-init.mjs`) registers a tracer provider.
 *
 * Compose it *inside* the filtering proxy —
 * `createFilteringProxy(createTracingProxy(server))` — so handlers are traced
 * after filtering strips `includeFields`/`filterBy`, keeping those synthetic
 * args out of `mcp.tool.arg_keys`.
 */
export function createTracingProxy(server: McpServer): McpServer {
  return new Proxy(server, {
    get(target, prop, receiver) {
      if (prop === "registerTool") {
        // biome-ignore lint/suspicious/noExplicitAny: proxy intercept
        return (name: string, config: any, handler: ToolHandler) =>
          (target as any).registerTool(name, config, wrapHandler(name, handler));
      }

      if (prop === "tool") {
        // Legacy signature: tool(name, [description], [paramsSchema], [annotations], handler).
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
