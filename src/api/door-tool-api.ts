import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function getDoorControllerRules(
  doorControllerUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Doorcontroller_GetDoorControllerRulesWSResponse"]>({
    route: "/doorcontroller/getDoorControllerRules",
    body: { doorControllerUuid } satisfies schema["Doorcontroller_GetDoorControllerRulesWSRequest"],
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
      deviceUuid: rule.deviceUuid ?? undefined,
      enabled: rule.enabled ?? undefined,
      ruleType: rule.ruleType ?? undefined,
    })) ?? []
  );
}

export async function createDoorControllerRule(
  ruleConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Doorcontroller_CreateDoorControllerRuleWSResponse"]>({
    route: "/doorcontroller/createDoorControllerRule",
    body: ruleConfig as schema["Doorcontroller_CreateDoorControllerRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return {
    uuid: (res as any).ruleUuid ?? undefined,
    success: true,
  };
}

export async function getDoorPolicies(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Policy_GetDoorPoliciesWSResponse"]>({
    route: "/policy/getDoorPolicies",
    body: {} satisfies schema["Policy_GetDoorPoliciesWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.policies?.map((policy: any) => ({
      uuid: policy.uuid ?? undefined,
      name: policy.name ?? undefined,
      orgUuid: policy.orgUuid ?? undefined,
      enabled: policy.enabled ?? undefined,
    })) ?? []
  );
}

export async function createDoorPolicy(
  policyConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Policy_CreateDoorPolicyWSResponse"]>({
    route: "/policy/createDoorPolicy",
    body: policyConfig as schema["Policy_CreateDoorPolicyWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return {
    uuid: res.policyUuid ?? undefined,
    success: true,
  };
}

/**
 * api2's `updateDoorPolicy` REPLACES the policy object, so the caller must read
 * the current policy and merge before calling this.
 */
export async function updateDoorPolicy(
  policyConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Policy_UpdateDoorPolicyWSResponse"]>({
    route: "/policy/updateDoorPolicy",
    body: { policy: policyConfig } as schema["Policy_UpdateDoorPolicyWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, warningMsg: res.warningMsg ?? undefined };
}

export async function deleteDoorPolicy(
  policyUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Policy_DeleteDoorPolicyWSResponse"]>({
    route: "/policy/deleteDoorPolicy",
    body: { policyUuid } satisfies schema["Policy_DeleteDoorPolicyWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: policyUuid, warningMsg: res.warningMsg ?? undefined };
}

export async function getDoorControllerRule(
  doorControllerUuid: string,
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Doorcontroller_GetDoorControllerRuleWSResponse"]>({
    route: "/doorcontroller/getDoorControllerRule",
    body: {
      doorControllerUuid,
      ruleUuid,
    } satisfies schema["Doorcontroller_GetDoorControllerRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return res.rule ?? undefined;
}

/**
 * api2's `updateDoorControllerRule` REPLACES the rule, so the caller must read
 * the current rule and merge before calling this.
 */
export async function updateDoorControllerRule(
  doorControllerUuid: string,
  ruleConfig: object,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Doorcontroller_UpdateDoorControllerRuleWSResponse"]>({
    route: "/doorcontroller/updateDoorControllerRule",
    body: {
      doorControllerUuid,
      rule: ruleConfig,
    } as schema["Doorcontroller_UpdateDoorControllerRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  // Doorcontroller_UpdateDoorControllerRuleWSResponse carries only `rule` — no
  // warningMsg channel exists on it, unlike the policy endpoints.
  return { success: true, rule: res.rule ?? undefined };
}

export async function deleteDoorControllerRule(
  doorControllerUuid: string,
  ruleUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Doorcontroller_DeleteDoorControllerRuleWSResponse"]>({
    route: "/doorcontroller/deleteDoorControllerRule",
    body: {
      doorControllerUuid,
      ruleUuid,
    } satisfies schema["Doorcontroller_DeleteDoorControllerRuleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: ruleUuid };
}
