import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getElementsAccessAnomalies } from "../api/elements-access-anomaly-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/elements-access-anomaly-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";
import { buildAccessAnomalyToolDescription } from "../types/access-anomaly-tool-types.js";

const TOOL_NAME = "elements-access-anomaly-tool";

const TOOL_DESCRIPTION = buildAccessAnomalyToolDescription("Honeywell Elements (LenelS2 Elements)");

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getElementsAccessAnomalies(
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
      title: "Elements Access Anomaly Detection",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
