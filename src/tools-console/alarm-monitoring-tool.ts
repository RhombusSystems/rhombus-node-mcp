import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getOrgAlarmStatus,
  getAlertMonitoringThreatCases,
  getLocationAlarmStatus,
  setLocationMonitoring,
  changeThreatCaseState,
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
- ${AlarmMonitoringRequestType.ENABLE_MONITORING} / ${AlarmMonitoringRequestType.DISABLE_MONITORING}: Turn alarm monitoring on or off for a location. Requires locationUuid and the location's alarm pin; disabling also requires confirmAction.
- ${AlarmMonitoringRequestType.DISMISS_THREAT_CASE}: Close a threat case as not requiring action. Requires threatCaseUuid.
- ${AlarmMonitoringRequestType.CANCEL_THREAT_CASE}: Cancel a threat case so no response is taken. Requires threatCaseUuid.
- ${AlarmMonitoringRequestType.ESCALATE_THREAT_CASE}: Escalate a threat case to an alarm, triggering a real monitoring response. Requires threatCaseUuid and confirmAction.

These write operations affect whether a real site is being watched and whether responders are dispatched. State plainly what will happen and get the user's confirmation first. Arming and disarming on a schedule is not available here — direct the user to the Rhombus Console for that.
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
      case AlarmMonitoringRequestType.ENABLE_MONITORING:
      case AlarmMonitoringRequestType.DISABLE_MONITORING: {
        const enabling = args.requestType === AlarmMonitoringRequestType.ENABLE_MONITORING;
        if (!args.locationUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `locationUuid is required for ${args.requestType}.`,
          });
        }
        if (!args.pin?.trim()) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `pin is required for ${args.requestType} — this is the location's alarm PIN. Ask the user for it; it cannot be looked up.`,
          });
        }
        if (!enabling && !args.confirmAction) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            note:
              "NOTHING WAS CHANGED. Disabling alarm monitoring means this location stops being watched and no threat cases will be raised " +
              "for it. Confirm with the user that this is what they want, then call again with confirmAction: true.",
          });
        }
        const monitoringChange = await setLocationMonitoring(
          args.locationUuid,
          args.pin.trim(),
          enabling,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          // Deliberately does not echo the PIN.
          monitoringChange: {
            success: monitoringChange.success,
            locationUuid: monitoringChange.locationUuid,
            enabled: monitoringChange.enabled,
          },
          warningMsg: monitoringChange.warningMsg,
          note: enabling
            ? "Alarm monitoring is now ENABLED for this location — threat cases will be raised again."
            : "Alarm monitoring is now DISABLED for this location. It is no longer being watched and no threat cases will be raised until it is re-enabled.",
        });
      }
      case AlarmMonitoringRequestType.DISMISS_THREAT_CASE:
      case AlarmMonitoringRequestType.CANCEL_THREAT_CASE:
      case AlarmMonitoringRequestType.ESCALATE_THREAT_CASE: {
        const action =
          args.requestType === AlarmMonitoringRequestType.DISMISS_THREAT_CASE
            ? "dismiss"
            : args.requestType === AlarmMonitoringRequestType.CANCEL_THREAT_CASE
              ? "cancel"
              : "escalate";
        if (!args.threatCaseUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `threatCaseUuid is required for ${args.requestType}.`,
          });
        }
        if (action === "escalate" && !args.confirmAction) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            note:
              "NOTHING WAS CHANGED. Escalating a threat case to an alarm dispatches a real monitoring response and can result in " +
              "responders being sent. Confirm with the user that they want to escalate, then call again with confirmAction: true.",
          });
        }
        const threatCaseChange = await changeThreatCaseState(
          args.threatCaseUuid,
          action,
          requestModifiers,
          sessionId
        );
        const notes = {
          dismiss:
            "Dismissed the threat case. It is closed as not requiring action and will no longer appear as open.",
          cancel: "Cancelled the threat case. No monitoring response will be taken on it.",
          escalate:
            "Escalated the threat case to an alarm. A monitoring response has been triggered.",
        } as const;
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          threatCaseChange,
          warningMsg: threatCaseChange.warningMsg,
          note: notes[action],
        });
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
      title: "Alarm Monitoring",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
