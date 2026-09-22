import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { vi } from "vitest";

// ---------------------------------------------------------------------------
// MCP tool response types — used to avoid `any` in test assertions
// ---------------------------------------------------------------------------

export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}

export type ContentItem = TextContent | ImageContent;

export interface ToolResult {
  content: ContentItem[];
}

/** Finds the first `{ type: "text" }` entry in a tool result. */
export function findTextContent(result: ToolResult): TextContent | undefined {
  return result.content.find((c): c is TextContent => c.type === "text");
}

// ---------------------------------------------------------------------------
// Tool handler capture
// ---------------------------------------------------------------------------

/**
 * Registers a tool against a fake `McpServer` and returns the captured handler
 * function so it can be called directly in tests.
 *
 * Supports both registration patterns used in the codebase:
 *   - `server.registerTool(name, config, handler)`
 *   - `server.tool(name, description, args, handler)`
 *
 * Note this bypasses the MCP SDK entirely, so it cannot see anything the SDK
 * does to a result after the handler returns — output-schema validation in
 * particular. For that, drive the tool through a real `Client`/`McpServer` pair
 * over `InMemoryTransport` instead (see `update-tool.output-validation.test.ts`).
 *
 * @example
 * ```ts
 * import { createTool } from "../../src/tools/camera-tool.js";
 * const handler = captureToolHandler<ToolArgs>(createTool);
 * const result = await handler({ cameraUuid: "...", ... }, {});
 * ```
 */
export function captureToolHandler<TArgs = Record<string, unknown>>(
  createTool: (server: McpServer) => void
): (args: TArgs, extra: unknown) => Promise<ToolResult> {
  let handler: ((args: TArgs, extra: unknown) => Promise<ToolResult>) | undefined;

  const mockServer = {
    // Pattern 1: server.registerTool(name, config, handler)
    registerTool: vi.fn((_name: string, _config: unknown, h: typeof handler) => {
      handler = h;
    }),
    // Pattern 2: server.tool(name, description, args, handler)
    tool: vi.fn((_name: string, _description: string, _args: unknown, h: typeof handler) => {
      handler = h;
    }),
  } as unknown as McpServer;

  createTool(mockServer);

  if (!handler) {
    throw new Error(
      "Tool handler was not captured — did the createTool function call " +
        "server.registerTool() or server.tool()?"
    );
  }

  return handler;
}
