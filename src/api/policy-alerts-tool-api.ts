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
        labels: [
          ...(alert.alertingEventFaces || []),
          ...(alert.alertingEventVehicles || []),
        ].flatMap(alert => alert.labels),
        createdOnString: alert.timestampMs
          ? formatTimestamp(alert.timestampMs, args.timeZone)
          : undefined,
      })),
    };
  });
}

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

export async function getPolicyAlertDetails(
  alertUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const response = await postApi<schema["Event_GetPolicyAlertDetailsWSResponse"]>({
    route: "/event/getPolicyAlertDetails",
    body: { policyAlertUuid: alertUuid },
    modifiers: requestModifiers,
    sessionId,
  });

  return { policyAlerts: response.policyAlert ? [response.policyAlert] : [] };
}

export async function dismissPolicyAlert(
  alertUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const response = await postApi<any>({
    route: "/event/dismissPolicyAlertV2",
    body: { policyAlertUuid: alertUuid },
    modifiers: requestModifiers,
    sessionId,
  });

  return { policyAlerts: [], dismissed: true };
}

export async function getUnhealthyDeviceAlerts(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const response = await postApi<schema["Event_GetUnhealthyDeviceAlertsWSResponse"]>({
    route: "/event/getUnhealthyDeviceAlerts",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  return { policyAlerts: response.unhealthyDeviceAlerts || [] };
}

export async function getPolicyAlertGroups(
  payload: any,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: any = {};
  if (payload.afterTimestampMs) body.afterTimestampMs = payload.afterTimestampMs;
  if (payload.beforeTimestampMs) body.beforeTimestampMs = payload.beforeTimestampMs;
  if (payload.deviceFilter) body.deviceUuids = payload.deviceFilter;
  if (payload.locationFilter) body.locationUuids = payload.locationFilter;
  if (payload.maxResults) body.maxResults = payload.maxResults;

  const response = await postApi<schema["Event_GetPolicyAlertGroupsV2WSResponse"]>({
    route: "/event/getPolicyAlertGroupsV2",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  return { policyAlerts: response.policyAlertGroups || [] };
}