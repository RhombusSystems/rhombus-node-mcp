import { logger } from "../logger.js";
import { postApi } from "../network/network.js";
import { RhombusAppEnum, type Customer_GetCurrentUserWSResponse } from "../types/schema.js";

export type AccessibleApp = RhombusAppEnum;

/**
 * Fetches `user.accessibleRhombusApps` from getCurrentUser for the given session.
 * Result is cached in-memory for the lifetime of the session. Returns null on
 * error or missing session; callers should fall back to a permissive default.
 */
const cache = new Map<string, AccessibleApp[] | null>();

export async function resolveAccessibleApps(sessionId?: string): Promise<AccessibleApp[] | null> {
  if (!sessionId) return null;

  if (cache.has(sessionId)) return cache.get(sessionId) ?? null;

  try {
    const res = await postApi<Customer_GetCurrentUserWSResponse>({
      route: "/customer/getCurrentUser",
      body: {},
      sessionId,
    });

    if (res.error) {
      logger.warn(`resolveAccessibleApps: getCurrentUser failed for session ${sessionId}`);
      cache.set(sessionId, null);
      return null;
    }

    const apps = (res.user?.accessibleRhombusApps ?? []).filter(
      (a): a is AccessibleApp => a !== null && a !== undefined
    );

    cache.set(sessionId, apps);
    logger.info(`resolveAccessibleApps: session ${sessionId} -> [${apps.join(", ")}]`);
    return apps;
  } catch (e) {
    logger.warn(`resolveAccessibleApps: error for session ${sessionId}: ${String(e)}`);
    cache.set(sessionId, null);
    return null;
  }
}

/** Drop the cached entry — call when a session ends. */
export function clearAccessibleAppsCache(sessionId: string) {
  cache.delete(sessionId);
}
