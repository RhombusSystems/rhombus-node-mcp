import { postApi } from "../network.js";
import { formatTimestamp, RequestModifiers } from "../util.js";
import { ToolArgs } from "../types/policy-alerts-tool-types.js";
import { components } from "../types/schema-components.js";

type PolicyAlert = components["schemas"]["PolicyAlertV2Type"];

export async function getPolicyAlerts(
  args: ToolArgs,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi({
    route: "/event/getPolicyAlertsV2",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      ...response,
      policyAlerts: response.policyAlerts.map((alert: PolicyAlert) => ({
        ...alert,
        createdOnString: alert.timestampMs ? formatTimestamp(alert.timestampMs) : undefined,
      })),
    };
  });
}
