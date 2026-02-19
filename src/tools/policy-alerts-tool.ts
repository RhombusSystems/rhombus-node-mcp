import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import {
  getExpiringPolicyAlerts,
  getPolicyAlerts,
  getPolicyAlertDetails,
  dismissPolicyAlert,
  getUnhealthyDeviceAlerts,
  getPolicyAlertGroups,
} from "../api/policy-alerts-tool-api.js";
import {
  ApiPayloadSchema,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/policy-alerts-tool-types.js";

const TOOL_NAME = "policy-alerts-tool";
const TOOL_DESCRIPTION = `
Retrieves Rhombus policy alerts. Policy alerts in the Rhombus system are generated based on user-defined alert
policies configured in the Rhombus Console. These policies trigger alerts when specific events occur, such as:
* AI & Computer Vision Events: Based on intelligent video analytics for motion, people, vehicles, facial recognition,
  license plate recognition, or unusual behavior.
* Device Status Changes: Like camera disconnections or sensor low battery.
* Physical or Visual Tamper: Detection of physical movement of a device or obstruction of a camera's field of view.
* Access Control Events: Such as unauthorized access attempts in restricted areas.

Alerts are generated on triggers, but are NOT the same as notifications. Only certain alerts generate notifications based on user settings.

Can inquire about labels that have been seen.

Please note, this is not an exhaustive list, and there may be other types of triggers or events that generate
policy alerts within the Rhombus system.

This tool allows you to filter existing alerts by existing/expiring, a specific time range (before or after a timestamp in ISO 8601 format),
by a list of device UUIDs, or by a list of location UUIDs.
You can also specify the maximum number of results to return.
The output is provided in JSON format.

IMPORTANT: The "unhealthy-devices" queryType returns historical alert notifications that were triggered for device health issues.
It does NOT return live/real-time device connection status. If no device health alert policies are configured, or alerts were
dismissed, this may return empty even when devices are offline.

**To check which devices are currently online/offline, use the get-entity-tool instead.** The get-entity-tool returns the
current state of all devices including their live connection status (the "connected" field). Request all entity types
(CAMERA, DOORBELL_CAMERA, BADGE_READER, etc.) and check the "connected" field on each device to determine which are offline.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const payload = ApiPayloadSchema.parse(args);

  let ret;
  switch (args.queryType) {
    case "existing":
      ret = await getPolicyAlerts(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    case "expiringSoon":
      ret = await getExpiringPolicyAlerts(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    case "details":
      if (!args.alertUuid) {
        throw new Error("alertUuid is required for 'details' queryType");
      }
      ret = await getPolicyAlertDetails(
        args.alertUuid,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    case "dismiss":
      if (!args.alertUuid) {
        throw new Error("alertUuid is required for 'dismiss' queryType");
      }
      ret = await dismissPolicyAlert(
        args.alertUuid,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    case "unhealthy-devices":
      ret = await getUnhealthyDeviceAlerts(
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    case "alert-groups":
      ret = await getPolicyAlertGroups(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      break;
    default:
      throw new Error(`Unsupported queryType: ${args.queryType}`);
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
    structuredContent: ret,
  };
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
