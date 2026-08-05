import { apiWarning, postApi, throwIfApiError } from "../network/network.js";
import { cachedPostApi } from "../network/org-reference-cache.js";
import type { schema } from "../types/schema.js";
import type {
  AccessControlGroup,
  AccessGrant,
  LockdownPlanSummary,
} from "../types/access-control-tool-types.js";
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
): Promise<AccessControlGroup[]> {
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
): Promise<LockdownPlanSummary[]> {
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
): Promise<AccessGrant[]> {
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
    cachedPostApi<schema["Component_FindAccessControlledDoorsWSResponse"]>({
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

// ---------------------------------------------------------------------------
// Access control groups
// ---------------------------------------------------------------------------

export async function createAccessControlGroup(
  name: string,
  description?: string,
  userUuids?: string[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Group_CreateOrgGroupWSResponse"]>({
    route: "/accesscontrol/createAccessControlGroup",
    body: {
      name,
      description: description || undefined,
      userUuids: userUuids ?? [],
    } satisfies schema["Group_CreateOrgGroupWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return {
    success: true,
    uuid: res.group?.uuid ?? undefined,
    memberCount: res.groupMembers?.length ?? userUuids?.length ?? 0,
  };
}

export async function updateAccessControlGroup(
  groupUuid: string,
  changes: { name?: string; description?: string },
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Group_UpdateOrgGroupWSResponse"]>({
    route: "/accesscontrol/updateAccessControlGroup",
    body: {
      groupUuid,
      name: changes.name,
      description: changes.description,
    } satisfies schema["Group_UpdateOrgGroupWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: groupUuid };
}

export async function deleteAccessControlGroup(
  groupUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Group_DeleteOrgGroupWSResponse"]>({
    route: "/accesscontrol/deleteAccessControlGroup",
    body: { groupUuid } satisfies schema["Group_DeleteOrgGroupWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: groupUuid };
}

export async function changeAccessControlGroupMembers(
  groupUuid: string,
  userUuids: string[],
  action: "add" | "remove",
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Group_AddUsersToOrgGroupWSResponse"]>({
    route:
      action === "add"
        ? "/accesscontrol/addUsersToAccessControlGroup"
        : "/accesscontrol/removeUsersFromAccessControlGroup",
    body: { groupUuid, userUuids } satisfies schema["Group_AddUsersToOrgGroupWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: groupUuid, userCount: userUuids.length };
}

// ---------------------------------------------------------------------------
// Location access grants
// ---------------------------------------------------------------------------

/**
 * `createAccessGrant` / `updateAccessGrant` both take the WHOLE grant object,
 * so update callers must read the current grant and merge. Both can also
 * succeed while reporting doors whose access-control licences are expired or
 * unassigned — those doors silently do not get access, so they are surfaced.
 */
export async function writeAccessGrant(
  accessGrant: Record<string, unknown>,
  mode: "create" | "update",
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_accessgrant_CreateAccessGrantWSResponse"]>({
    route:
      mode === "create"
        ? "/accesscontrol/createAccessGrant"
        : "/accesscontrol/updateAccessGrant",
    body: {
      accessGrant,
    } as schema["Accesscontrol_accessgrant_CreateAccessGrantWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  // `src/types/schema.ts` is generated from an older assets/openapi.json than
  // the one in the repo, so these three response fields exist on the wire and in
  // the current spec but not yet in the generated type. Read them through a
  // narrow local shape rather than dropping them — an expired-licence door is
  // one that silently grants nobody access.
  const licenceInfo = res as {
    expiredACDLicensesDoorUuids?: (string | null)[] | null;
    unassignedACDLicensesDoorUuids?: (string | null)[] | null;
    warningMsg?: string | null;
  };

  return {
    success: true,
    uuid: res.accessGrant?.uuid ?? (accessGrant.uuid as string | undefined),
    expiredACDLicensesDoorUuids:
      licenceInfo.expiredACDLicensesDoorUuids?.filter((value): value is string => !!value) ?? [],
    unassignedACDLicensesDoorUuids:
      licenceInfo.unassignedACDLicensesDoorUuids?.filter((value): value is string => !!value) ??
      [],
    warningMsg: licenceInfo.warningMsg ?? undefined,
  };
}

export async function deleteAccessGrant(
  accessGrantUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<
    schema["Accesscontrol_accessgrant_DeleteLocationAccessGrantWSResponse"]
  >({
    route: "/accesscontrol/deleteLocationAccessGrant",
    body: {
      accessGrantUuid,
    } satisfies schema["Accesscontrol_accessgrant_DeleteLocationAccessGrantWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: accessGrantUuid, warningMsg: res.warningMsg ?? undefined };
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/** Attach an existing (unassigned) physical credential to a user. */
export async function assignCredential(
  credentialHexValue: string,
  userUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<
    schema["Accesscontrol_credentials_AssignAccessControlCredentialWSResponse"]
  >({
    route: "/accesscontrol/assignAccessControlCredential",
    body: {
      credentialHexValue,
      userUuid,
    } satisfies schema["Accesscontrol_credentials_AssignAccessControlCredentialWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, userUuid, warningMsg: apiWarning(res) };
}

/**
 * The four credential state changes that share a `{credentialUuid}` body.
 *
 * They are NOT interchangeable and the difference matters operationally:
 * suspend is reversible (unsuspend restores it), revoke detaches the credential
 * from its user but keeps the record, and delete destroys the record entirely.
 */
export async function changeCredentialState(
  credentialUuid: string,
  action: "revoke" | "suspend" | "unsuspend" | "delete",
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const routes = {
    revoke: "/accesscontrol/revokeAccessControlCredential",
    suspend: "/accesscontrol/suspendAccessControlCredential",
    unsuspend: "/accesscontrol/unsuspendAccessControlCredential",
    delete: "/accesscontrol/deleteAccessControlCredential",
  } as const;

  const res = await postApi<
    schema["Accesscontrol_credentials_RevokeAccessControlCredentialWSResponse"]
  >({
    route: routes[action],
    body: {
      credentialUuid,
    } satisfies schema["Accesscontrol_credentials_RevokeAccessControlCredentialWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: credentialUuid, warningMsg: apiWarning(res) };
}

export async function updateCredentialNote(
  credentialUuid: string,
  note: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<
    schema["Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSResponse"]
  >({
    route: "/accesscontrol/updateAccessControlCredentialNote",
    body: {
      credentialUuid,
      note,
    } satisfies schema["Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: credentialUuid, warningMsg: apiWarning(res) };
}

// ---------------------------------------------------------------------------
// Lockdown plans
// ---------------------------------------------------------------------------

export async function getLockdownPlan(
  lockdownPlanUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_lockdownplan_GetLockdownPlanWSResponse"]>({
    route: "/accesscontrol/lockdownPlan/getLockdownPlan",
    body: {
      lockdownPlanUuid,
    } satisfies schema["Accesscontrol_lockdownplan_GetLockdownPlanWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return res.lockdownPlan ?? undefined;
}

/**
 * Rename a lockdown plan.
 *
 * `updateLocationLockdownPlan` takes the plan's door-state map, activation,
 * deactivation and test plans as sibling fields, so a name-only body would blank
 * them — which on a lockdown plan means doors silently stop locking in an
 * emergency. Everything except the name is therefore read back and resent
 * verbatim. Authoring those nested plans from natural language is deliberately
 * NOT exposed.
 */
export async function renameLockdownPlan(
  lockdownPlanUuid: string,
  name: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const existing = await getLockdownPlan(lockdownPlanUuid, requestModifiers, sessionId);
  if (!existing) return { success: false as const, missing: true as const };

  const res = await postApi<
    schema["Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSResponse"]
  >({
    route: "/accesscontrol/lockdownPlan/updateLocationLockdownPlan",
    body: {
      lockdownPlanUuid,
      name,
      activationPlan: existing.activationPlan,
      deactivationPlan: existing.deactivationPlan,
      defaultLockdownState: existing.defaultLockdownState,
      doorLockdownStateMap: existing.doorLockdownStateMap,
      physicalAccess: existing.physicalAccess,
      testPlan: existing.testPlan,
    } as schema["Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return {
    success: true as const,
    missing: false as const,
    uuid: lockdownPlanUuid,
    previousName: existing.name ?? undefined,
  };
}

export async function deleteLockdownPlan(
  lockdownPlanUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<
    schema["Accesscontrol_lockdownplan_DeleteLockdownPlanWSResponse"]
  >({
    route: "/accesscontrol/lockdownPlan/deleteLockdownPlan",
    body: {
      lockdownPlanUuid,
    } satisfies schema["Accesscontrol_lockdownplan_DeleteLockdownPlanWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: lockdownPlanUuid };
}
