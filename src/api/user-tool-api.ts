import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";
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

/**
 * Keep only non-null string entries from a nullable string[] coming back from
 * the generated schema types.
 */
function cleanStringArray(arr: (string | null)[] | null | undefined): string[] | undefined {
  if (!arr) return undefined;
  const cleaned = arr.filter((v): v is string => typeof v === "string");
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Map a `{ [k]: PermissionEnum }` to a `Record<string, string>` dropping null
 * values. Returns undefined when the input is nullish so the field is omitted
 * from the JSON payload entirely (and the filtering proxy's `includeFields`
 * can omit it without ambiguity).
 */
function toStringMap(
  map: { [key: string]: string | null | undefined } | null | undefined
): Record<string, string> | undefined {
  if (!map) return undefined;
  const entries = Object.entries(map).filter(
    (pair): pair is [string, string] => typeof pair[1] === "string"
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function toNestedStringMap(
  map:
    | {
        [outer: string]: { [inner: string]: string | null | undefined } | null | undefined;
      }
    | null
    | undefined
): Record<string, Record<string, string>> | undefined {
  if (!map) return undefined;
  const result: Record<string, Record<string, string>> = {};
  for (const [outer, inner] of Object.entries(map)) {
    const cleanedInner = toStringMap(inner);
    if (cleanedInner) result[outer] = cleanedInner;
  }
  return Object.keys(result).length > 0 ? result : undefined;
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
      description: group.description ?? undefined,
      orgUuid: group.orgUuid ?? undefined,
      mutable: group.mutable ?? undefined,
      superAdmin: group.superAdmin ?? undefined,
      installer: group.installer ?? undefined,
      inLine: group.inLine ?? undefined,
      storedInS3: group.storedInS3 ?? undefined,
      defaultPermissionForNewLocations: group.defaultPermissionForNewLocations ?? undefined,
      defaultAccessControlPermissionForNewLocations:
        group.defaultAccessControlPermissionForNewLocations ?? undefined,
      functionalityList: (group.functionalityList as string[] | null | undefined) ?? undefined,
      accessibleLocations: cleanStringArray(group.accessibleLocations),
      assignablePermissionGroups: cleanStringArray(group.assignablePermissionGroups),
      // Heavy maps — callers should typically prune these out via includeFields.
      locationAccessMap: toStringMap(group.locationAccessMap as any),
      accessControlLocationAccessMap: toStringMap(group.accessControlLocationAccessMap as any),
      deviceAccessMap: toStringMap(group.deviceAccessMap as any),
      userPermissionGroupAccessMap: toStringMap(group.userPermissionGroupAccessMap as any),
      locationGranularAccessMap: toNestedStringMap(group.locationGranularAccessMap as any),
    })) ?? []
  );
}
