import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { searchElementsEvents } from "../api/elements-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/elements-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "elements-events-tool";

const TOOL_DESCRIPTION = `
Searches Honeywell Elements (LenelS2 Elements) badge / access-control events for the organization. Use this to answer
"who entered WHERE and WHEN" questions, e.g. "who entered the back office yesterday".

NOTE: an organization may run any combination of Honeywell OnGuard (Lenel), Honeywell Elements (LenelS2
Elements), and Lenel S2 NetBox badge integrations — each searched by its own sibling tool
(onguard-events-tool / elements-events-tool / netbox-events-tool), all taking identical arguments and
returning the same shape. For a general "who badged in / did anyone enter" question you usually do NOT
know which integration recorded the event, so call ALL THREE sibling tools (in parallel) and combine the
results — each returns an empty list when its integration isn't configured. Restrict to one vendor only
when the user explicitly names it.

Each returned event includes:
- cardholderName: the person's name
- deviceUuid: the camera that saw the event
- timestampMs / datetime: when it happened
- label: e.g. "Elements: Badge Authorized" (a grant) or an anomaly label
- badgeStatus, badgeType, areaEntering, areaExiting, entryMade, isAnomaly

Filters (all optional): area, locationUuids, deviceUuids, cardholderQuery, badgeStatus, badgeType,
anomalyOnly, entryMade, startTime, endTime, limit. Resolve relative times like "yesterday" to ISO 8601
first (use the timestamp tool), then pass startTime/endTime.

IMPORTANT — to show pictures and video of each person so the user can visually identify them: after this
returns, for each event (or the most relevant ones) call the camera-tool (requestType "image",
cameraUuid = the event's deviceUuid, timestamp = the event's time) to get a still you can see, and/or the
clips-tool (requestType "createClip") with a short window around the timestamp for video. Issue those
per-event media calls in PARALLEL.
`;

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
