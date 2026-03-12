import { postApi } from "../network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

const PERMISSION_RANK: Record<string, number> = {
  LIVEONLY: 0,
  READONLY: 1,
  ADMIN: 2,
};

function hasAtLeastReadonly(perm: string | undefined | null): boolean {
  return PERMISSION_RANK[perm ?? ""] >= PERMISSION_RANK.READONLY;
}

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
  locationUuid?: string | null,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = locationUuid
    ? await postApi<schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSResponse"]>({
        route: "/accesscontrol/findLocationAccessGrantsByLocation",
        body: { locationUuid } satisfies schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSRequest"],
        modifiers: requestModifiers,
        sessionId,
      })
    : await postApi<schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse"]>({
        route: "/accesscontrol/findLocationAccessGrantsByOrg",
        body: {} satisfies schema["Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest"],
        modifiers: requestModifiers,
        sessionId,
      });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  const filterNulls = (arr?: (string | null)[] | null): string[] =>
    arr?.filter((v): v is string => v !== null) ?? [];

  return (
    (res as any).accessGrants?.map((grant: any) => ({
      uuid: grant.uuid ?? undefined,
      name: grant.name ?? undefined,
      locationUuid: grant.locationUuid ?? undefined,
      userUuids: filterNulls(grant.userUuids),
      groupUuids: filterNulls(grant.groupUuids),
      doorUuids: filterNulls(grant.accessControlledDoorUuids),
      scheduleUuid: grant.scheduleUuid ?? undefined,
    })) ?? []
  );
}

function canRoleUnlockDoor(
  role: any,
  doorLocationUuid: string,
  doorAssociatedCameras: string[]
): boolean {
  if (role.superAdmin) return true;

  const hasDoorAdmin = role.functionalityList?.includes("DOOR_ACCESS_ADMINISTRATION");
  if (!hasDoorAdmin) return false;

  const acMap = role.accessControlLocationAccessMap ?? {};
  const granularMap = role.locationGranularAccessMap ?? {};
  const acLocationPerm = acMap[doorLocationUuid];
  const granularLocationPerms = granularMap[doorLocationUuid] ?? {};
  const accessConditionsPerm = granularLocationPerms["ACCESS_CONDITIONS"];

  if (hasAtLeastReadonly(acLocationPerm) && hasAtLeastReadonly(accessConditionsPerm)) {
    return true;
  }

  if (doorAssociatedCameras.length > 0) {
    const locationMap = role.locationAccessMap ?? {};
    const deviceMap = role.deviceAccessMap ?? {};

    if (hasAtLeastReadonly(locationMap[doorLocationUuid])) return true;

    for (const cameraUuid of doorAssociatedCameras) {
      if (hasAtLeastReadonly(deviceMap[cameraUuid])) return true;
    }
  }

  return false;
}

export async function getRemoteUnlockUsers(
  locationUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const [permGroupsRes, doorsRes, usersRes] = await Promise.all([
    postApi<schema["Permission_GetPermissionGroupsWSResponse"]>({
      route: "/permission/getPermissionGroups",
      body: {} satisfies schema["Permission_GetPermissionGroupsWSRequest"],
      modifiers: requestModifiers,
      sessionId,
    }),
    postApi<schema["Component_FindAccessControlledDoorsWSResponse"]>({
      route: "/component/findAccessControlledDoors",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    }),
    postApi<schema["User_GetUsersInOrgWSResponse"]>({
      route: "/user/getUsersInOrg",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    }),
  ]);

  if (permGroupsRes.error) throw new Error(JSON.stringify(permGroupsRes));
  if (doorsRes.error) throw new Error(JSON.stringify(doorsRes));
  if (usersRes.error) throw new Error(JSON.stringify(usersRes));

  const permissionGroups = permGroupsRes.permissionGroups ?? [];
  const groupMembership: Record<string, string[]> = {};
  for (const [groupUuid, userUuids] of Object.entries(permGroupsRes.groupMembership ?? {})) {
    groupMembership[groupUuid] = (userUuids ?? []).filter((u): u is string => u !== null);
  }

  const userMap = new Map<string, { uuid: string; firstName?: string; lastName?: string; email?: string }>();
  for (const user of usersRes.users ?? []) {
    if (user.uuid) {
      userMap.set(user.uuid, {
        uuid: user.uuid,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        email: user.email ?? undefined,
      });
    }
  }

  const doors = (doorsRes.accessControlledDoors ?? []).filter(
    (door: any) => door.locationUuid === locationUuid && door.remoteUnlockEnabled === true
  );

  const doorNames = doors.map((d: any) => d.name ?? "Unknown");
  const totalDoors = doorNames.length;

  type GroupResult = {
    permissionGroup: string;
    doors: "all" | string[];
    users: string[];
  };

  const groupResults = new Map<string, { doorNames: Set<string>; userEntries: Set<string> }>();
  const seenUsers = new Set<string>();

  for (const door of doors) {
    const doorLocationUuid = door.locationUuid ?? "";
    const doorName = door.name ?? "Unknown";
    const associatedCameras: string[] =
      door.associatedCameras?.filter((c: any): c is string => c !== null) ?? [];

    for (const role of permissionGroups) {
      if (!role.uuid) continue;
      if (!canRoleUnlockDoor(role, doorLocationUuid, associatedCameras)) continue;

      const roleName = role.name ?? "Unknown";
      let group = groupResults.get(roleName);
      if (!group) {
        group = { doorNames: new Set(), userEntries: new Set() };
        groupResults.set(roleName, group);
      }
      group.doorNames.add(doorName);

      for (const userUuid of groupMembership[role.uuid] ?? []) {
        if (!userMap.has(userUuid) || seenUsers.has(userUuid)) continue;
        seenUsers.add(userUuid);
        const user = userMap.get(userUuid)!;
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
        const label = name
          ? `${name} (${user.email ?? "no email"})`
          : (user.email ?? userUuid);
        group.userEntries.add(label);
      }
    }
  }

  const groups: GroupResult[] = Array.from(groupResults.entries()).map(([name, g]) => ({
    permissionGroup: name,
    doors: g.doorNames.size === totalDoors ? "all" : Array.from(g.doorNames),
    users: Array.from(g.userEntries),
  }));

  const totalUsers = seenUsers.size;
  return { doors: doorNames, totalUsers, groups };
}
