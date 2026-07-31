import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getNetboxLostBadgeResponse } from "../api/netbox-lost-badge-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/netbox-lost-badge-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";
import { buildLostBadgeToolDescription } from "../types/lost-badge-tool-types.js";

const TOOL_NAME = "netbox-lost-badge-tool";

const TOOL_DESCRIPTION = buildLostBadgeToolDescription("Lenel S2 NetBox (Honeywell NetBox)");

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getNetboxLostBadgeResponse(
      {
        area: args.area ?? undefined,
        locationUuids: args.locationUuids ?? undefined,
        deviceUuids: args.deviceUuids ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        faceWindowSeconds: args.faceWindowSeconds ?? undefined,
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
      title: "NetBox Lost Badge",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
