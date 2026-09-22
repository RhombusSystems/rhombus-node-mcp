import { apiWarning, postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
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

// ---------------------------------------------------------------------------
// Alarm monitoring write paths
//
// `armMonitoring` / `disarmMonitoring` are deliberately NOT exposed: their
// `armingRule` / `disarmingRule` bodies (activeSinceMs, armAllUntilMs,
// armedAlarmPolicies) have semantics that are not documented in the api2 spec,
// and getting them wrong leaves a real alarm system in a state nobody asked
// for. enable/disable below are the unambiguous pair, and they require the
// location's alarm PIN.
// ---------------------------------------------------------------------------

/**
 * Turn alarm monitoring on or off for a location.
 *
 * `pin` is the location's alarm PIN, supplied by the user. It is passed straight
 * through to api2 and must never be echoed into a tool result, a note, or a log
 * line.
 */
export async function setLocationMonitoring(
  locationUuid: string,
  pin: string,
  enabled: boolean,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Alertmonitoring_EnableLocationResponse"]>({
    route: enabled
      ? "/alertmonitoring/enableMonitoringForLocation"
      : "/alertmonitoring/disableMonitoringForLocation",
    body: {
      locationUuid,
      pin,
    } satisfies schema["Alertmonitoring_EnableLocationRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, locationUuid, enabled, warningMsg: res.warningMsg ?? undefined };
}

export async function changeThreatCaseState(
  threatCaseUuid: string,
  action: "dismiss" | "cancel" | "escalate",
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const routes = {
    dismiss: "/alertmonitoring/dismissThreatCase",
    cancel: "/alertmonitoring/cancelThreatCase",
    escalate: "/alertmonitoring/escalateThreatCaseToAlarm",
  } as const;

  const res = await postApi<schema["Alertmonitoring_DismissThreatCaseWSResponse"]>({
    route: routes[action],
    body: {
      uuid: threatCaseUuid,
    } satisfies schema["Alertmonitoring_DismissThreatCaseWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: threatCaseUuid, action, warningMsg: apiWarning(res) };
}
