import { logger } from "../logger.js";
import { postApi } from "../network/network.js";
import { RhombusAppEnum, type Customer_GetCurrentUserWSResponse } from "../types/schema.js";

export type AccessibleApp = RhombusAppEnum;

/**
 * Fetches `user.accessibleRhombusApps` from getCurrentUser for the given session.
 * Successful results are cached in-memory for the lifetime of the session;
 * failures are NOT cached so transient errors don't poison the session.
 * Returns null on error or missing session; callers should fall back to a
 * permissive default.
 */
const cache = new Map<string, AccessibleApp[]>();

export async function resolveAccessibleApps(sessionId?: string): Promise<AccessibleApp[] | null> {
  if (!sessionId) return null;

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

    const apps = (res.user?.accessibleRhombusApps ?? []).filter(
      (a): a is AccessibleApp => a !== null && a !== undefined
    );

    cache.set(sessionId, apps);
    logger.info(`resolveAccessibleApps: session ${sessionId} -> [${apps.join(", ")}]`);
    return apps;
  } catch (e) {
    logger.warn(`resolveAccessibleApps: error for session ${sessionId}: ${String(e)}`);
    return null;
  }
}

/** Drop the cached entry — call when a session ends. */
export function clearAccessibleAppsCache(sessionId: string) {
  cache.delete(sessionId);
}
