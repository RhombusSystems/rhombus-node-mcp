import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { onTestFailed, vi } from "vitest";
import * as network from "../src/network/network.js";

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

/** Finds the first `{ type: "image" }` entry in a tool result. */
export function findImageContent(result: ToolResult): ImageContent | undefined {
  return result.content.find((c): c is ImageContent => c.type === "image");
}

// ---------------------------------------------------------------------------
// Camera state shape returned by getCameraList
// ---------------------------------------------------------------------------

export interface MinimalCameraState {
  uuid: string;
  name?: string;
  connectionStatus: string;
  locationUuid?: string;
}

// ---------------------------------------------------------------------------
// Environment — live test guards
// ---------------------------------------------------------------------------

/**
 * Returns `true` when `.env.test` has been populated with real credentials.
 * Use with `describe.skipIf(!isLiveConfigured())` to silently skip live
 * suites when credentials aren't available.
 */
export function isLiveConfigured(): boolean {
  const apiKey = process.env.RHOMBUS_API_KEY;
  const cameraUuid = process.env.CAMERA_UUID;
  return (
    !!apiKey &&
    apiKey !== "your_api_key_here" &&
    !!cameraUuid &&
    cameraUuid !== "your_camera_uuid_here"
  );
}

/**
 * Returns `true` when `TEST_HEAVY=true` is set in the environment.
 * Use with `describe.skipIf(!isHeavyTestEnabled())` to gate slow or
 * resource-intensive suites (e.g. sampling many live cameras).
 */
export function isHeavyTestEnabled(): boolean {
  return process.env.TEST_HEAVY === "true";
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

// ---------------------------------------------------------------------------
// API call spy + failure dump
// ---------------------------------------------------------------------------

/**
 * Creates a call-through spy on `postApi` (the lowest-level HTTP function).
 * Real requests still fire; every call + response is recorded for debugging.
 */
export function spyOnPostApi() {
  // ESM module namespaces are read-only; cast to a plain object whose `postApi`
  // property carries the real function type so vi.spyOn can both patch it and
  // infer correct call/return types on the spy.
  const target = network as unknown as { postApi: typeof network.postApi };
  return vi.spyOn(target, "postApi");
}

/** The type of the spy returned by `spyOnPostApi`. */
export type PostApiSpy = ReturnType<typeof spyOnPostApi>;

/**
 * Registers an `onTestFailed` hook that dumps every `postApi` call and its
 * resolved response to the console. Call this at the top of any `it()` block
 * that uses a `postApiSpy`.
 *
 * @example
 * ```ts
 * it("does something", async () => {
 *   dumpApiCallsOnFailure(postApiSpy);
 *   // ... test code ...
 * });
 * ```
 */
export function dumpApiCallsOnFailure(spy: PostApiSpy): void {
  onTestFailed(async () => {
    console.log("\n╔════════════════════════════════════════════════════╗");
    console.log("║   API CALLS DURING FAILED TEST                     ║");
    console.log("╚════════════════════════════════════════════════════╝");

    for (const [i, call] of spy.mock.calls.entries()) {
      const opts = call[0];
      console.log(`\n▶ Call ${i + 1}: ${opts.route}`);
      console.log("  body:", JSON.stringify(opts.body, null, 2));
    }

    console.log("\n╔════════════════════════════════════════════════════╗");
    console.log("║   API RESPONSES                                    ║");
    console.log("╚════════════════════════════════════════════════════╝");

    for (const [i, result] of spy.mock.results.entries()) {
      if (result.type === "return") {
        try {
          const val = await result.value;
          console.log(`\n◀ Response ${i + 1}:`, JSON.stringify(val, null, 2));
        } catch (err) {
          console.log(`\n◀ Response ${i + 1} rejected:`, err);
        }
      } else if (result.type === "throw") {
        console.log(`\n◀ Response ${i + 1} THREW:`, result.value);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Array helpers
// ---------------------------------------------------------------------------

/**
 * Fisher-Yates shuffles `arr` **in place**, then returns the first `max` items.
 */
export function shuffleAndSample<T>(arr: T[], max: number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, max);
}

/**
 * Maps over `items` in parallel, but no more than `ratePerSecond` items are
 * started per second. Each batch of `ratePerSecond` items fires concurrently;
 * after the batch resolves a 1 s pause is inserted before the next batch.
 *
 * @example
 * // Fire at most 5 requests per second
 * const results = await rateLimitedMap(cameras, cam => fetchImage(cam), 5);
 */
export async function rateLimitedMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  ratePerSecond: number
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += ratePerSecond) {
    const batch = items.slice(i, i + ratePerSecond);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    // Wait 1 s between batches unless this was the last one
    if (i + ratePerSecond < items.length) {
      await new Promise(resolve => setTimeout(resolve, 1_000));
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Results table
// ---------------------------------------------------------------------------

export interface TestResult {
  name: string;
  success: boolean;
  error?: string;
}

/**
 * Prints a dynamically-sized summary table of pass/fail results to the console.
 *
 * @param title  - Table heading (e.g. "Image Fetch Results")
 * @param results - Array of per-item outcomes
 */
export function printResultsTable(title: string, results: TestResult[]): void {
  const nameCol = Math.max(20, ...results.map(r => r.name.length)) + 2;
  const detailCol = Math.max(16, ...results.map(r => (r.error ? r.error.length + 3 : 0))) + 2;
  // Status column visual width = 4: " ✅ " renders as 1+2+1=4 terminal columns.
  // emoji are double-width (2 terminal cols) but .length===1, so hLine dashes
  // must equal the *visual* width (4), not the string length (3).
  const statusVisualWidth = 4;
  // inner width = visual width of everything between the two outer │ borders
  const innerWidth = nameCol + statusVisualWidth + detailCol + 2; // +2 for two inner │

  const hLine = (left: string, mid1: string, mid2: string, right: string) =>
    `${left}${"─".repeat(nameCol)}${mid1}${"─".repeat(statusVisualWidth)}${mid2}${"─".repeat(detailCol)}${right}`;

  console.log(`\n${hLine("┌", "┬", "┬", "┐")}`);
  console.log(`│ ${title.padEnd(innerWidth - 1)}│`);
  console.log(hLine("├", "┼", "┼", "┤"));

  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    const detail = r.error ? `(${r.error.slice(0, detailCol - 4)})` : "";
    console.log(`│ ${r.name.padEnd(nameCol - 1)}│ ${icon} │ ${detail.padEnd(detailCol - 1)}│`);
  }

  console.log(hLine("└", "┴", "┴", "┘"));

  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.warn(
      `\n⚠ ${failures.length}/${results.length} failed:`,
      failures.map(f => `${f.name} — ${f.error}`).join("; ")
    );
  }
}
