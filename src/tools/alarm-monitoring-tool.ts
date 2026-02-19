import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getOrgAlarmStatus,
  getAlertMonitoringThreatCases,
  getLocationAlarmStatus,
} from "../api/alarm-monitoring-tool-api.js";
import {
  AlarmMonitoringRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/alarm-monitoring-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "alarm-monitoring-tool";

const TOOL_DESCRIPTION = `
This tool retrieves alarm monitoring status and threat case information across Rhombus locations.

It has the following modes of operation, determined by the "requestType" parameter:
- ${AlarmMonitoringRequestType.ORG_STATUS}: Get the armed/disarmed alarm monitoring status for ALL locations in the organization in a single call.
- ${AlarmMonitoringRequestType.GET_THREAT_CASES}: Retrieve alarm monitoring threat cases (security incidents). Supports filtering by time range and max results.
- ${AlarmMonitoringRequestType.LOCATION_STATUS}: Get detailed alarm monitoring status for a specific location. Requires locationUuid.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case AlarmMonitoringRequestType.ORG_STATUS: {
        const locationStatuses = await getOrgAlarmStatus(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ locationStatuses });
      }
      case AlarmMonitoringRequestType.GET_THREAT_CASES: {
        const threatCases = await getAlertMonitoringThreatCases(
          args.startTimeMs ?? undefined,
          args.endTimeMs ?? undefined,
          args.maxResults ?? undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ threatCases });
      }
      case AlarmMonitoringRequestType.LOCATION_STATUS: {
        if (!args.locationUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "locationUuid is required for location-status.",
          });
        }
        const locationDetail = await getLocationAlarmStatus(
          args.locationUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ locationDetail });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
