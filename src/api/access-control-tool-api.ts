import { apiWarning, postApi, throwIfApiError } from "../network/network.js";
import { cachedPostApi } from "../network/org-reference-cache.js";
import type { schema } from "../types/schema.js";
import type {
  AccessControlCredential,
  AccessControlGroup,
  AccessGrant,
  CredentialEffectiveStatus,
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

  throwIfApiError(res);

  return { success: true, doorUuid };
}

/**
 * `findAccessControlGroupsByOrg` returns the groups only — `OrgGroupType` has
 * no member field, so reading `userUuids` off it always produced `[]` and every
 * group looked empty. Members come from `findAllUsersForAccessControlGroup`,
 * one call per group, so they are fetched only when the caller needs them
 * (`withMembers`); the write paths only need to know the group exists.
 */
export async function getAccessControlGroups(
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  options: { withMembers?: boolean } = {}
): Promise<AccessControlGroup[]> {
  const res = await postApi<schema["Group_FindOrgGroupsByOrgWSResponse"]>({
    route: "/accesscontrol/findAccessControlGroupsByOrg",
    body: {} satisfies schema["Group_FindOrgGroupsByOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  const groups: AccessControlGroup[] =
    res.groups?.flatMap(group =>
      group
        ? [
            {
              uuid: group.uuid ?? undefined,
              name: group.name ?? undefined,
              description: group.description ?? undefined,
              orgUuid: group.orgUuid ?? undefined,
            },
          ]
        : []
    ) ?? [];

  if (!options.withMembers) return groups;

  return mapWithConcurrency(groups, GROUP_MEMBER_FETCH_CONCURRENCY, async group => {
    if (!group.uuid) return group;
    try {
      const userUuids = await getAccessControlGroupMembers(group.uuid, requestModifiers, sessionId);
      return { ...group, userUuids, memberCount: userUuids.length };
    } catch (error) {
      // One unreadable group must not blank the whole list — and must not read
      // as "0 members" either.
      return {
        ...group,
        membersError: error instanceof Error ? error.message : "Could not read this group's members.",
      };
    }
  });
}

const GROUP_MEMBER_FETCH_CONCURRENCY = 8;

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

/** User UUIDs of one access control group's members. */
export async function getAccessControlGroupMembers(
  groupUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<string[]> {
  const res = await postApi<schema["Group_FindAllUsersForOrgGroupWSResponse"]>({
    route: "/accesscontrol/findAllUsersForAccessControlGroup",
    body: { groupUuid } satisfies schema["Group_FindAllUsersForOrgGroupWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return [
    ...new Set(
      res.groupMembers?.flatMap(member => (member?.userUuid ? [member.userUuid] : [])) ?? []
    ),
  ];
}

/** UUIDs of the access control groups one user is a member of. */
export async function getAccessControlGroupUuidsForUser(
  userUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<string[]> {
  const res = await postApi<schema["Group_FindOrgGroupMembershipsByUserWSResponse"]>({
    route: "/accesscontrol/findAccessControlGroupMembershipsByUser",
    body: { userUuid } satisfies schema["Group_FindOrgGroupMembershipsByUserWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return [
    ...new Set(
      res.userGroupMemberships?.flatMap(membership =>
        membership?.groupUuid &&
        (!membership.type || membership.type === "RHOMBUS_ACCESS_CONTROL")
          ? [membership.groupUuid]
          : []
      ) ?? []
    ),
  ];
}

/**
 * Human names for credential types and states. The raw enum values reach the
 * user otherwise, and the Console's markdown turns their underscores into
 * italics ("RHOMBUS_SECURE_MOBILE" renders as "RHOMBUS*SECURE*MOBILE").
 */
const CREDENTIAL_TYPE_LABELS: Record<string, string> = {
  STANDARD_CSN: "standard card (CSN)",
  RHOMBUS_SECURE_CSN: "Rhombus Secure card",
  RHOMBUS_SECURE_MOBILE: "Rhombus mobile credential",
  PIN_CODE: "PIN code",
  WIEGAND_H10301: "Wiegand card (H10301)",
  WIEGAND_H10302: "Wiegand card (H10302)",
  WIEGAND_H10304: "Wiegand card (H10304)",
  WIEGAND_D10202: "Wiegand card (D10202)",
  WIEGAND_64BIT_RAW: "Wiegand card (64-bit)",
  HID_CORP1000_STD_35: "HID Corporate 1000 card (35-bit)",
  HID_CORP1000_STD_48: "HID Corporate 1000 card (48-bit)",
  QR_CODE_STATIC: "QR code",
  CUSTOM: "custom credential",
  APPLE_WALLET_DESFIRE: "Apple Wallet credential",
};

export function credentialTypeLabel(type: string | undefined | null): string {
  if (!type) return "credential of unknown type";
  return CREDENTIAL_TYPE_LABELS[type] ?? type.toLowerCase().replace(/_/g, " ");
}

const CREDENTIAL_STATUS_LABELS: Record<CredentialEffectiveStatus, string> = {
  ACTIVE: "active",
  NOT_YET_VALID: "not yet valid",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
  REVOKED: "revoked",
  UNASSIGNED: "unassigned",
  UNKNOWN: "unknown status",
};

export function credentialStatusLabel(status: string | undefined | null): string {
  return CREDENTIAL_STATUS_LABELS[status as CredentialEffectiveStatus] ?? (status ? status.toLowerCase().replace(/_/g, " ") : "unknown status");
}

/**
 * The credential's effective state, in the order the Console derives it
 * (`getCredentialStatus`). Door controllers only receive ACTIVE credentials
 * inside their date window, so only "ACTIVE" here opens a door.
 */
export function effectiveCredentialStatus(
  cred: {
    workflowStatus?: string | null;
    startDateEpochSecInclusive?: number | null;
    endDateEpochSecExclusive?: number | null;
  },
  nowMs: number
): CredentialEffectiveStatus {
  const nowSec = nowMs / 1000;
  switch (cred.workflowStatus) {
    case "SUSPENDED":
      return "SUSPENDED";
    case "UNASSIGNED":
      return "UNASSIGNED";
    case "REVOKED":
      return "REVOKED";
    case "ACTIVE":
      if (cred.startDateEpochSecInclusive != null && nowSec < cred.startDateEpochSecInclusive) {
        return "NOT_YET_VALID";
      }
      if (cred.endDateEpochSecExclusive != null && nowSec >= cred.endDateEpochSecExclusive) {
        return "EXPIRED";
      }
      return "ACTIVE";
    default:
      return "UNKNOWN";
  }
}

function epochSecToIso(value: number | null | undefined): string | undefined {
  return value != null ? new Date(value * 1000).toISOString() : undefined;
}

export async function getCredentialsByUser(
  userUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<AccessControlCredential[]> {
  const res = await postApi<schema["Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse"]>({
    route: "/accesscontrol/findAccessControlCredentialByUser",
    body: { userUuid } satisfies schema["Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  const now = Date.now();
  return (
    res.credentials?.flatMap(cred =>
      cred
        ? [
            {
              uuid: cred.uuid ?? undefined,
              userUuid: cred.userUuid ?? undefined,
              // The API field is `type`; this used to read a non-existent
              // `credentialType` and was always empty.
              credentialType: cred.type ?? undefined,
              credentialTypeLabel: credentialTypeLabel(cred.type),
              status: cred.workflowStatus ?? undefined,
              effectiveStatus: effectiveCredentialStatus(cred, now),
              validFrom: epochSecToIso(cred.startDateEpochSecInclusive),
              validUntil: epochSecToIso(cred.endDateEpochSecExclusive),
              lastUsedAt:
                cred.lastUsedAtMillis != null
                  ? new Date(cred.lastUsedAtMillis).toISOString()
                  : undefined,
              note: cred.note ?? undefined,
            },
          ]
        : []
    ) ?? []
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

  throwIfApiError(res);

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

  throwIfApiError(res);

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

  throwIfApiError(res);

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

  throwIfApiError(res);

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

  throwIfApiError(res);

  const filterNulls = (arr?: (string | null)[] | null): string[] =>
    arr?.filter((v): v is string => v !== null) ?? [];

  return (
    res.accessGrants?.flatMap(grant =>
      grant
        ? [
            {
              uuid: grant.uuid ?? undefined,
              name: grant.name ?? undefined,
              locationUuid: grant.locationUuid ?? undefined,
              userUuids: filterNulls(grant.userUuids),
              groupUuids: filterNulls(grant.groupUuids),
              doorUuids: filterNulls(grant.accessControlledDoorUuids),
              // A grant also reaches every door carrying one of these labels,
              // and elevator landings. update-access-grant must send both
              // back, because updateAccessGrant replaces the whole grant.
              doorLabels: filterNulls(grant.doorLabelIds),
              elevatorLandingUuids: filterNulls(grant.accessControlledElevatorLandingUuids),
              mode: grant.mode ?? undefined,
              scheduleUuid: grant.scheduleUuid ?? undefined,
            },
          ]
        : []
    ) ?? []
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

  throwIfApiError(permGroupsRes);
  throwIfApiError(doorsRes);
  throwIfApiError(usersRes);

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

  return {
    success: true,
    uuid: res.accessGrant?.uuid ?? (accessGrant.uuid as string | undefined),
    expiredACDLicensesDoorUuids:
      res.expiredACDLicensesDoorUuids?.filter((value): value is string => !!value) ?? [],
    unassignedACDLicensesDoorUuids:
      res.unassignedACDLicensesDoorUuids?.filter((value): value is string => !!value) ?? [],
    warningMsg: res.warningMsg ?? undefined,
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
