import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function unlockDoor(
  doorUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_credentials_BaseUnlockAccessControlledDoorWSResponse"]>({
    route: "/accesscontrol/unlockAccessControlledDoor",
    body: { accessControlledDoorUuid: doorUuid } satisfies schema["Accesscontrol_UnlockAccessControlledDoorWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return { success: true, doorUuid };
}

export async function getAccessControlGroups(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Group_FindOrgGroupsByOrgWSResponse"]>({
    route: "/accesscontrol/findAccessControlGroupsByOrg",
    body: {} satisfies schema["Group_FindOrgGroupsByOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    (res as any).groups?.map((group: any) => ({
      uuid: group.uuid ?? undefined,
      name: group.name ?? undefined,
      description: group.description ?? undefined,
      orgUuid: group.orgUuid ?? undefined,
      userUuids: group.userUuids?.filter((u: any): u is string => u !== null) ?? [],
    })) ?? []
  );
}

export async function getCredentialsByUser(
  userUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse"]>({
    route: "/accesscontrol/findAccessControlCredentialByUser",
    body: { userUuid } satisfies schema["Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.credentials?.map((cred: any) => ({
      uuid: cred.uuid ?? undefined,
      userUuid: cred.userUuid ?? undefined,
      credentialType: cred.credentialType ?? undefined,
      status: cred.workflowStatus ?? undefined,
      note: cred.note ?? undefined,
    })) ?? []
  );
}

export async function getLockdownPlans(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_lockdownplan_FindLockdownPlansWSResponse"]>({
    route: "/accesscontrol/lockdownPlan/findLockdownPlans",
    body: {} satisfies schema["Accesscontrol_lockdownplan_FindLockdownPlansWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.lockdownPlans?.map((plan: any) => ({
      uuid: plan.uuid ?? undefined,
      name: plan.name ?? undefined,
      locationUuid: plan.locationUuid ?? undefined,
      description: plan.description ?? undefined,
      active: plan.active ?? undefined,
    })) ?? []
  );
}

export async function activateLockdown(
  locationUuid: string,
  lockdownPlanUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_lockdownplan_ActivateLockdownForLocationWSResponse"]>({
    route: "/accesscontrol/lockdownPlan/activateLockdownForLocation",
    body: { locationUuid, lockdownPlanUuids: [lockdownPlanUuid] } as any,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return { success: true, locationUuid, action: "activated" };
}

export async function deactivateLockdown(
  locationUuid: string,
  lockdownPlanUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSResponse"]>({
    route: "/accesscontrol/lockdownPlan/deactivateLockdownForLocation",
    body: { locationUuid, lockdownPlanUuids: [lockdownPlanUuid] } as any,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return { success: true, locationUuid, action: "deactivated" };
}

export async function getDoorScheduleExceptions(
  locationUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse"]>({
    route: "/accesscontrol/doorScheduleException/findExceptionsV2",
    body: { locationUuid } as any,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.exceptions?.map((exc: any) => ({
      uuid: exc.uuid ?? undefined,
      name: exc.name ?? undefined,
      startTime: exc.startTimeMs ?? undefined,
      endTime: exc.endTimeMs ?? undefined,
      doorUuids: exc.doorUuids?.filter((d: any): d is string => d !== null) ?? [],
    })) ?? []
  );
}

export async function getAccessGrants(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse"]>({
    route: "/accesscontrol/findLocationAccessGrantsByOrg",
    body: {} satisfies schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    (res as any).accessGrants?.map((grant: any) => ({
      uuid: grant.uuid ?? undefined,
      userUuid: grant.userUuid ?? undefined,
      locationUuid: grant.locationUuid ?? undefined,
      doorUuid: grant.accessControlledDoorUuid ?? undefined,
      groupUuid: grant.accessControlGroupUuid ?? undefined,
      scheduleUuid: grant.scheduleUuid ?? undefined,
    })) ?? []
  );
}
