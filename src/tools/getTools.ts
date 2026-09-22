import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import path from "path";
import { fileURLToPath } from "node:url";
import { getFilePathsInDirectory } from "../util.js";

export type ToolFactory = {
  name: string;
  create: (server: McpServer) => void | Promise<void>;
};

const SELF_BASENAME = "getTools.js";

async function loadFrom(dir: string): Promise<ToolFactory[]> {
  let filePaths: string[];
  try {
    filePaths = getFilePathsInDirectory(dir);
  } catch {
    // Directory doesn't exist (e.g. an empty `tools-partner` for a project that
    // hasn't filled it in yet) — return empty list rather than failing.
    return [];
  }
  const tools: ToolFactory[] = [];
  for (const filePath of filePaths) {
    if (!filePath.endsWith(".js")) continue;
    if (path.basename(filePath) === SELF_BASENAME) continue;
    const imported = (await import(filePath)) as {
      createTool: ((server: McpServer) => void | Promise<void>) | undefined;
    };
    if (imported.createTool !== undefined) {
      tools.push({ name: filePath, create: imported.createTool });
    }
  }
  return tools;
}

/** Tools visible to every caller (shared / universal — time, identity, lookups). */
export async function getSharedTools(): Promise<ToolFactory[]> {
  // This file lives in `src/tools/`, so its directory IS the shared tools dir.
  return loadFrom(path.dirname(fileURLToPath(import.meta.url)));
}

/** Tools visible only to console (non-partner) callers. From `src/tools-console/`. */
export async function getConsoleTools(): Promise<ToolFactory[]> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return loadFrom(path.resolve(here, "..", "tools-console"));
}

/** Tools visible only to partner callers. From `src/tools-partner/`. */
export async function getPartnerTools(): Promise<ToolFactory[]> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return loadFrom(path.resolve(here, "..", "tools-partner"));
}

// Backwards-compatible default — returns the shared set so existing callers
// don't break, but new code should pick the explicit functions.
export default getSharedTools;
