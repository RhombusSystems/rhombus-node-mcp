import { postApi } from "../network.js";
import { formatTimestamp, RequestModifiers } from "../util.js";
import { ApiPayload } from "../types/policy-alerts-tool-types.js";
import { components } from "../types/schema-components.js";
import schema from "../types/schema.js";

type PolicyAlert = components["schemas"]["PolicyAlertV2Type"];

export async function getPolicyAlerts(
  args: ApiPayload,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi<schema["Event_GetPolicyAlertsWSResponse"]>({
    route: "/event/getPolicyAlerts",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      ...response,
      policyAlerts: (response.policyAlerts || []).map((alert: PolicyAlert) => ({
        ...alert,
        createdOnString: alert.timestampMs
          ? formatTimestamp(alert.timestampMs, args.timeZone)
          : undefined,
      })),
    };
  });
}
