import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function listUsers(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["User_GetUsersInOrgWSResponse"]>({
    route: "/user/getUsersInOrg",
    body: {} satisfies schema["User_GetUsersInOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.users?.map(user => ({
      uuid: user.uuid ?? undefined,
      email: user.email ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      role: (user as any).roleUuid ?? undefined,
      orgUuid: user.orgUuid ?? undefined,
      lastLoginMs: (user as any).lastLoginMs ?? undefined,
      enabled: (user as any).enabled ?? undefined,
      mfaEnabled: user.mfaEnabled ?? undefined,
    })) ?? []
  );
}

export async function findUserByEmail(
  email: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["User_FindUserWSResponse"]>({
    route: "/user/findUserByEmail",
    body: { email } satisfies schema["User_FindUserByEmailWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  const user = res.user;
  if (!user) return undefined;

  return {
    uuid: user.uuid ?? undefined,
    email: user.email ?? undefined,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    role: (user as any).roleUuid ?? undefined,
    orgUuid: user.orgUuid ?? undefined,
    lastLoginMs: (user as any).lastLoginMs ?? undefined,
    enabled: (user as any).enabled ?? undefined,
    mfaEnabled: user.mfaEnabled ?? undefined,
  };
}

export async function getPermissionsForCurrentUser(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Permission_GetPermissionsForCurrentUserWSResponse"]>({
    route: "/permission/getPermissionsForCurrentUser",
    body: {} satisfies schema["Permission_GetPermissionsForCurrentUserWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return {
    role: (res as any).role ?? undefined,
    functionalityAccessMap: (res as any).functionalityAccessMap
      ? Object.fromEntries(
          Object.entries((res as any).functionalityAccessMap).map(([k, v]) => [k, String(v)])
        )
      : undefined,
  };
}

export async function getPermissionGroups(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Permission_GetPermissionGroupsForOrgWSResponse"]>({
    route: "/permission/getPermissionGroupsForOrg",
    body: {} satisfies schema["Permission_GetPermissionGroupsForOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.permissionGroups?.map(group => ({
      uuid: group.uuid ?? undefined,
      name: group.name ?? undefined,
      orgUuid: group.orgUuid ?? undefined,
      role: (group as any).role ?? undefined,
    })) ?? []
  );
}
