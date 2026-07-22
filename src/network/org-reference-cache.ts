import { createHash } from "node:crypto";
import { requestAuthContext } from "../auth-context.js";
import type { RequestModifiers } from "../util.js";
import { postApi } from "./network.js";

/**
 * Short-TTL cache for slow-changing org-reference fetches (device state
 * lists, locations, org info). Within a single chatbot query the model
 * routinely calls several tools that each re-fetch the same org-wide lists
 * (e.g. entity-lookup's 11-way fan-out plus get-entity-tool plus a camera
 * tool); this collapses those into one upstream call per route.
 *
 * - Keyed on hash(auth identity + route + body + modifiers). The auth
 *   payload comes from requestAuthContext (AsyncLocalStorage) because
 *   `extra.sessionId` is undefined in the stateless HTTP transport; when no
 *   auth context is present we bypass the cache entirely rather than share
 *   entries across unknown callers.
 * - The IN-FLIGHT promise is cached, so concurrent callers (Promise.all
 *   fan-outs) share one request. Rejections evict immediately — failures are
 *   never cached.
 * - TTL is deliberately short: staleness after a mutation (e.g. a camera
 *   rename) is bounded at ORG_REFERENCE_TTL_MS.
 */
export const ORG_REFERENCE_TTL_MS = 60_000;
const MAX_ENTRIES = 500;

type CacheEntry = { expiresAt: number; promise: Promise<unknown> };
const cache = new Map<string, CacheEntry>();

function evictIfNeeded(now: number): void {
  if (cache.size <= MAX_ENTRIES) return;
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
  // Still over cap (many live sessions): drop oldest-inserted first.
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

/** Test hook / mutation hook: drop every cached entry. */
export function clearOrgReferenceCache(): void {
  cache.clear();
}

/**
 * Drop-in replacement for postApi on org-reference routes. Do NOT use for
 * mutations or fast-changing data.
 */
export function cachedPostApi<T>(
  params: {
    route: string;
    body: object | string;
    modifiers?: RequestModifiers;
    sessionId?: string;
  },
  ttlMs: number = ORG_REFERENCE_TTL_MS,
): ReturnType<typeof postApi<T>> {
  const auth = requestAuthContext.getStore();
  if (!auth) return postApi<T>(params);

  const key = createHash("sha256")
    .update(JSON.stringify([auth, params.route, params.body ?? null, params.modifiers ?? null]))
    .digest("hex");
  const now = Date.now();

  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.promise as ReturnType<typeof postApi<T>>;

  const promise = postApi<T>(params);
  cache.set(key, { expiresAt: now + ttlMs, promise });
  promise.catch(() => {
    if (cache.get(key)?.promise === promise) cache.delete(key);
  });
  evictIfNeeded(now);
  return promise;
}
