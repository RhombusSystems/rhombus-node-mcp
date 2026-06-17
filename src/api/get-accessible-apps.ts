import { logger } from "../logger.js";
import { postApi } from "../network/network.js";
import { RhombusAppEnum, type Customer_GetCurrentUserWSResponse } from "../types/schema.js";

export type AccessibleApp = RhombusAppEnum;

/** Identity derived from `getCurrentUser`, used to tag analytics events. */
export type SessionIdentity = {
  userId?: string;
  orgUuid?: string;
  email?: string;
};

type CachedSession = {
  apps: AccessibleApp[];
  identity: SessionIdentity;
};

/**
 * Single cached `getCurrentUser` fetch per session. Both `resolveAccessibleApps`
 * and `resolveSessionIdentity` read from this cache, so identity for analytics
 * costs no extra API call. Successful results are cached for the lifetime of
 * the session; failures are NOT cached so transient errors don't poison it.
 */
const cache = new Map<string, CachedSession>();

async function fetchSession(sessionId: string): Promise<CachedSession | null> {
  const cached = cache.get(sessionId);
  if (cached !== undefined) return cached;

  try {
    const res = await postApi<Customer_GetCurrentUserWSResponse>({
      route: "/customer/getCurrentUser",
      body: {},
      sessionId,
    });

    if (res.error) {
      logger.warn(`resolveAccessibleApps: getCurrentUser failed for session ${sessionId}`);
      return null;
    }

    const user = res.user;
    const apps = (user?.accessibleRhombusApps ?? []).filter(
      (a): a is AccessibleApp => a !== null && a !== undefined
    );
    const identity: SessionIdentity = {
      userId: user?.uuid ?? user?.rhombusUserUuid ?? undefined,
      orgUuid: user?.orgUuid ?? undefined,
      email: user?.email ?? undefined,
    };

    const entry: CachedSession = { apps, identity };
    cache.set(sessionId, entry);
    logger.info(`resolveAccessibleApps: session ${sessionId} -> [${apps.join(", ")}]`);
    return entry;
  } catch (e) {
    logger.warn(`resolveAccessibleApps: error for session ${sessionId}: ${String(e)}`);
    return null;
  }
}

/**
 * Fetches `user.accessibleRhombusApps` from getCurrentUser for the given session.
 * Returns null on error or missing session; callers should fall back to a
 * permissive default.
 */
export async function resolveAccessibleApps(sessionId?: string): Promise<AccessibleApp[] | null> {
  if (!sessionId) return null;
  return (await fetchSession(sessionId))?.apps ?? null;
}

/**
 * Fetches identity (user uuid, org uuid, email) from getCurrentUser for the
 * given session, reusing the same cached response as `resolveAccessibleApps`.
 * Returns null on error or missing session.
 */
export async function resolveSessionIdentity(sessionId?: string): Promise<SessionIdentity | null> {
  if (!sessionId) return null;
  return (await fetchSession(sessionId))?.identity ?? null;
}

/** Drop the cached entry — call when a session ends. */
export function clearAccessibleAppsCache(sessionId: string) {
  cache.delete(sessionId);
}
