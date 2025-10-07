import { postApi } from "../network.js";
import { formatTimestamp, RequestModifiers } from "../util.js";
import { ApiPayload } from "../types/expiring-policy-alerts-tool-types.js";
import { components } from "../types/schema-components.js";
import schema from "../types/schema.js";

type PolicyAlert = components["schemas"]["BasePolicyAlertType"];

export async function getExpiringPolicyAlerts(
  args: ApiPayload,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi<schema["Event_GetExpiringPolicyAlertsWSResponse"]>({
    route: "/event/getExpiringPolicyAlerts",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      ...response,
      policyAlerts: (response.policyAlerts || []).map((alert: PolicyAlert) => ({
        ...alert,
        createdOnString: alert.timestampMs
          ? formatTimestamp(alert.timestampMs)
          : undefined,
      })),
    };
  });
}