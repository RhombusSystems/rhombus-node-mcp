import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function getOrgAlarmStatus(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Alertmonitoring_OrgStatusWSResponse"]>({
    route: "/alertmonitoring/orgStatus",
    body: {} satisfies schema["Alertmonitoring_OrgStatusWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get org alarm status");
  }

  const statuses = res.locationStatuses ?? {};
  return Object.entries(statuses).map(([locationUuid, status]) => ({
    locationUuid,
    enabled: status?.enabled ?? undefined,
    enabledOnMs: status?.enabledOnMs ?? undefined,
    disabledOnMs: status?.disabledOnMs ?? undefined,
    notEnabledReason: status?.notEnabledReason ?? undefined,
  }));
}

export async function getAlertMonitoringThreatCases(
  startTimeMs?: number,
  endTimeMs?: number,
  maxResults?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: schema["Event_GetAlertMonitoringThreatCasesWSRequest"] = {};
  if (startTimeMs) body.afterTimestampMs = startTimeMs;
  if (endTimeMs) body.beforeTimestampMs = endTimeMs;
  if (maxResults) body.maxResults = maxResults;

  const res = await postApi<schema["Event_GetAlertMonitoringThreatCasesWSResponse"]>({
    route: "/event/getAlertMonitoringThreatCases",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get threat cases");
  }

  return (
    res.threatCases?.map(tc => ({
      uuid: tc.uuid ?? undefined,
      status: (tc.status as string) ?? undefined,
      locationName: tc.locationName ?? undefined,
      locationUuid: tc.locationUuid ?? undefined,
      deviceUuid: tc.deviceUuid ?? undefined,
      createdAtMillis: tc.createdAtMillis ?? undefined,
      promptTitle: tc.promptTitle ?? undefined,
    })) ?? []
  );
}

export async function getLocationAlarmStatus(
  locationUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Alertmonitoring_LocationStatusWSResponse"]>({
    route: "/alertmonitoring/locationStatus",
    body: { locationUuid } satisfies schema["Alertmonitoring_LocationStatusWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get location alarm status");
  }

  return {
    locationUuid,
    enabled: res.status?.enabled ?? undefined,
    enabledOnMs: res.status?.enabledOnMs ?? undefined,
    disabledOnMs: res.status?.disabledOnMs ?? undefined,
    notEnabledReason: res.status?.notEnabledReason ?? undefined,
  };
}
