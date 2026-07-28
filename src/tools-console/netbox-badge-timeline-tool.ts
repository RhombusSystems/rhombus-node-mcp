import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getNetboxBadgeTimeline } from "../api/netbox-badge-timeline-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/netbox-badge-timeline-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";
import { buildBadgeTimelineToolDescription } from "../types/badge-timeline-tool-types.js";

const TOOL_NAME = "netbox-badge-timeline-tool";

const TOOL_DESCRIPTION = buildBadgeTimelineToolDescription("Lenel S2 NetBox (Honeywell NetBox)");

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getNetboxBadgeTimeline(
      {
        cardholderQuery: args.cardholderQuery,
        locationUuids: args.locationUuids ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        clipPaddingSeconds: args.clipPaddingSeconds ?? undefined,
        limit: args.limit ?? undefined,
      },
      args.timeZone ?? "UTC",
      requestModifiers,
      sessionId
    );
    return createToolStructuredContent<OUTPUT_SCHEMA>(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: message });
  }
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "NetBox Badge Timeline",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
