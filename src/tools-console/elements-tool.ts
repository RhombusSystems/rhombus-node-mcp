import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { searchElementsEvents } from "../api/elements-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/elements-tool-types.js";
import { buildBadgeEventsToolDescription } from "../types/onguard-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "elements-events-tool";

const TOOL_DESCRIPTION = buildBadgeEventsToolDescription("Honeywell Elements (LenelS2 Elements)");

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await searchElementsEvents(
      {
        area: args.area ?? undefined,
        locationUuids: args.locationUuids ?? undefined,
        deviceUuids: args.deviceUuids ?? undefined,
        cardholderQuery: args.cardholderQuery ?? undefined,
        badgeStatus: args.badgeStatus ?? undefined,
        badgeType: args.badgeType ?? undefined,
        anomalyOnly: args.anomalyOnly ?? undefined,
        entryMade: args.entryMade ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
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
      title: "Elements Events",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
