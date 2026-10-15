import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function listRules(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_GetRulesForOrgWSResponse"]>({
    route: "/rules/getRulesForOrg",
    body: {} satisfies schema["Rules_GetRulesForOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.rules?.map((rule: any) => ({
      uuid: rule.uuid ?? undefined,
      name: rule.name ?? undefined,
      enabled: rule.enabled ?? undefined,
      orgUuid: rule.orgUuid ?? undefined,
      ruleType: rule.ruleType ?? undefined,
      createdAtMs: rule.createdAtMs ?? undefined,
      updatedAtMs: rule.updatedAtMs ?? undefined,
    })) ?? []
  );
}

/** One rule in full (triggers, action, filters), or undefined when the org has no such rule. */
export async function getRule(
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<schema["RuleType"] | undefined> {
  const res = await postApi<schema["Rules_GetRulesForOrgWSResponse"]>({
    route: "/rules/getRulesForOrg",
    body: {} satisfies schema["Rules_GetRulesForOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return res.rules?.find(rule => rule?.uuid === ruleUuid) ?? undefined;
}

export async function createRule(
  rule: schema["RuleType"],
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_CreateRuleWSResponse"]>({
    route: "/rules/createRule",
    body: { rule } satisfies schema["Rules_CreateRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return {
    uuid: res.ruleUuid ?? undefined,
    success: true,
  };
}

/** The API replaces the stored rule with ruleUpdate, so pass the complete rule. */
export async function updateRule(
  ruleUpdate: schema["RuleType"],
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_UpdateRuleWSResponse"]>({
    route: "/rules/updateRule",
    body: { ruleUpdate } satisfies schema["Rules_UpdateRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true };
}

export async function deleteRule(
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_DeleteRuleWSResponse"]>({
    route: "/rules/deleteRule",
    body: { ruleUuid } satisfies schema["Rules_DeleteRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { uuid: ruleUuid, success: true };
}

/** The rule's most recent firings, newest first. */
export async function getRuleRecords(
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  // getRulesEventRecords has no rule filter and returns every rule's records; this route filters.
  const res = await postApi<schema["Rules_records_GetLatestRulesEventRecordsWSResponse"]>({
    route: "/rulesRecords/getLatestRulesEventRecords",
    body: { ruleUuid, n: 50 } satisfies schema["Rules_records_GetLatestRulesEventRecordsWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.rulesEventRecords?.map(record => {
      const deviceEvent = record.deviceEventRecords?.[0];
      return {
        uuid: record.uuid ?? undefined,
        ruleUuid: record.ruleUuid ?? undefined,
        triggeredAtMs: record.triggeredTimestampMs ?? undefined,
        deviceUuid: deviceEvent?.deviceUuid ?? undefined,
        locationUuid: deviceEvent?.locationUuid ?? undefined,
        activities: deviceEvent?.activities?.map(String) ?? undefined,
        audioPlayback:
          record.audioPlaybackActionRecords?.map(playback => ({
            audioClipUuid: playback.audioClipUuid ?? undefined,
            gatewayStatuses: playback.audioGatewayStatuses ?? undefined,
          })) ?? undefined,
      };
    }) ?? []
  );
}

export async function listAudioClips(requestModifiers?: RequestModifiers, sessionId?: string) {
  const res = await postApi<schema["Audioplayback_GetAudioUploadMetadataForOrgWSResponse"]>({
    route: "/audioplayback/getAudioUploadMetadataForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.audioUploadMetadata?.map(clip => ({
      uuid: clip.uuid ?? undefined,
      displayName: clip.displayName ?? undefined,
      text: clip.audioPlaintext ?? undefined,
      durationMs: clip.durationMs ?? undefined,
    })) ?? []
  );
}
