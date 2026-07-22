import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-conversion-tool-types.js";

const TOOL_NAME = "time-conversion-tool";
const TOOL_DESCRIPTION = `This tool converts between epoch (Unix milliseconds) and ISO 8601 timestamps, auto-detecting the input format: an ISO string returns epoch ms, a number returns the ISO string.

This is the most accurate way to convert timestamps — do NOT convert timestamps yourself.

Accepts a single value or a comma-separated list (results returned in the same order). If a timestamp is timezoned, include the original UTC offset (e.g. '2025-03-05T09:00:00-08:00') rather than converting to UTC yourself.

Example: "2025-03-05T09:00:00-08:00,1741190400000" returns the epoch ms of the first and the ISO string of the second.`;

/** Convert one trimmed value, auto-detecting ISO vs epoch. */
function convertOne(value: string | number): { input: string | number; epoch?: number; iso?: string; error?: string } {
  // Numbers (or all-digit strings from a comma-separated batch) are epochs.
  const asNumber = typeof value === "number" ? value : /^-?\d+$/.test(value) ? Number(value) : null;
  if (asNumber !== null) {
    const date = new Date(asNumber);
    if (Number.isNaN(date.getTime())) return { input: value, error: "Invalid epoch timestamp" };
    return { input: value, iso: date.toISOString() };
  }
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return { input: value, error: "Unparseable ISO 8601 timestamp" };
  return { input: value, epoch: date.getTime() };
}

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { time_to_convert } = args;

  const values: (string | number)[] =
    typeof time_to_convert === "string" && time_to_convert.includes(",")
      ? time_to_convert.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [time_to_convert];

  const results = values.map(convertOne);

  // Preserve the original single-value shapes ({epoch} / {iso}) for compatibility.
  const payload =
    results.length === 1
      ? results[0].error
        ? { error: results[0].error }
        : results[0].epoch !== undefined
          ? { epoch: results[0].epoch }
          : { iso: results[0].iso }
      : { results };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Time Conversion",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
