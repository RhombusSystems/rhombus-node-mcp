import { postApi } from "../network.js";
import type schema from "../types/schema.js";
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
