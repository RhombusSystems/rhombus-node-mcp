import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getAccessAnomalies } from "../api/access-anomaly-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/access-anomaly-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "access-anomaly-tool";

const TOOL_DESCRIPTION = `
Scans Honeywell OnGuard (Lenel) access events over a time window and flags anomalous badge activity. Use for
"find unusual badge activity", "anything suspicious in access this week", or proactive access review.

Runs deterministic rules and returns ranked findings (high severity first):
- lost_or_inactive_badge: a non-active badge (lost/suspended) was used
- entry_not_made: access granted but no entry made (possible tailgating)
- off_hours: entry outside business hours (configurable)
- impossible_travel: one cardholder at two different areas seconds apart
- area_novelty: a cardholder's first-ever entry to an area vs their prior history (needs a baseline window)

Each finding includes cardholderName, the rule, severity, datetime, area, the camera deviceUuid, a plain-language
rationale, and clip/still hints. Resolve relative times (e.g. "this week") to ISO 8601 first via the timestamp tool.

This is a triage aid: present findings grouped by severity, and for the notable ones call the camera-tool
(requestType "image", cameraUuid = finding.deviceUuid, timestamp = finding.timestampMs) and/or clips-tool
("createClip" using finding.clipHint) — in PARALLEL — so a human can confirm. Don't assert wrongdoing; surface the
evidence.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getAccessAnomalies(
      {
        area: args.area ?? undefined,
        locationUuids: args.locationUuids ?? undefined,
        deviceUuids: args.deviceUuids ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        rules: args.rules ?? undefined,
        baselineDays: args.baselineDays ?? undefined,
        offHoursStartHour: args.offHoursStartHour ?? undefined,
        offHoursEndHour: args.offHoursEndHour ?? undefined,
        impossibleTravelMaxSeconds: args.impossibleTravelMaxSeconds ?? undefined,
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
      title: "Access Anomaly Detection",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
