import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getNetboxBadgeTimeline } from "../api/netbox-badge-timeline-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/netbox-badge-timeline-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "netbox-badge-timeline-tool";

const TOOL_DESCRIPTION = `
Reconstructs one person's movements through a building from their Lenel S2 NetBox (Honeywell NetBox) badge taps.
Use this for incident reconstruction / "follow the badge" requests, e.g. "reconstruct Eve's movements
yesterday" or "where did this cardholder go".

Returns the cardholder's badge taps in CHRONOLOGICAL order (oldest first), each with:
- datetime / timestampMs and the area entered
- deviceUuid: the camera at that door
- clipHint (camera + start/end window) and stillHint (camera + timestamp)
- gapToNextSeconds: time until the next tap (a large gap = unobserved movement between doors)
plus a "path" array summarizing the areas traversed in order.

Resolve relative times like "yesterday" to ISO 8601 first (use the timestamp tool), then pass
startTime/endTime. cardholderQuery is a full-text name match; if "ambiguousCardholders" is returned the
query matched more than one person — ask the user which one before trusting the timeline.

IMPORTANT — to show the movement visually: for each stop (or the key transitions), call the camera-tool
(requestType "image", cameraUuid = stop.deviceUuid, timestamp = stop.timestampMs) for a still you can see,
and/or the clips-tool (requestType "createClip", using stop.clipHint) for video. Issue those per-stop
media calls in PARALLEL, then present the timeline as a chronological narrative.
`;

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
