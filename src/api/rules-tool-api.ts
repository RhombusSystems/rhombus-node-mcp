import { postApi } from "../network.js";
import type schema from "../types/schema.js";
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

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

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

export async function createRule(
  ruleConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_CreateRuleWSResponse"]>({
    route: "/rules/createRule",
    body: ruleConfig as schema["Rules_CreateRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return {
    uuid: res.ruleUuid ?? undefined,
    success: true,
  };
}

export async function updateRule(
  ruleConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Rules_UpdateRuleWSResponse"]>({
    route: "/rules/updateRule",
    body: ruleConfig as schema["Rules_UpdateRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

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

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return { uuid: ruleUuid, success: true };
}

export async function getRuleRecords(
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<any>({
    route: "/rulesRecords/getRulesEventRecords",
    body: { ruleUuid },
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.rulesEventRecords?.map((record: any) => ({
      uuid: record.uuid ?? undefined,
      ruleUuid: record.ruleUuid ?? undefined,
      triggeredAtMs: record.triggeredAtMs ?? undefined,
      deviceUuid: record.deviceUuid ?? undefined,
      locationUuid: record.locationUuid ?? undefined,
    })) ?? []
  );
}
