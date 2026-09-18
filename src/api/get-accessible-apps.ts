import { logger } from "../logger.js";
import { postApi } from "../network/network.js";
import { RhombusAppEnum, type CustomerGetCurrentUserWsResponse } from "../types/schema.js";

export type AccessibleApp = RhombusAppEnum;

/** "SUPPORT" = a Rhombus / partner support-authority session acting inside a customer org. */
export type SessionType = "USER" | "SUPPORT";

/** Identity derived from `getCurrentUser`, used to tag trace spans and logs. */
export type SessionIdentity = {
  userId?: string;
  orgUuid?: string;
  email?: string;
  /** Display name — populated for support sessions (from `supportSession.name`). */
  name?: string;
  sessionType?: SessionType;
};

/**
 * `enduser.id` for a support session whose payload carries no `supportSession`
 * block (webservice older than the additive `sessionType`/`supportSession` fields).
 */
export const SUPPORT_SESSION_MARKER = "support-session";

type CachedSession = {
  apps: AccessibleApp[];
  identity: SessionIdentity;
};

/**
 * Single cached `getCurrentUser` fetch per session. Both `resolveAccessibleApps`
 * and `resolveSessionIdentity` read from this cache, so identity for tracing
 * costs no extra API call. Successful results are cached for the lifetime of
 * the session; failures are NOT cached so transient errors don't poison it.
 */
const cache = new Map<string, CachedSession>();

type SupportSessionFields = {
  authorityUuid?: string;
  name?: string;
  email?: string;
  orgUuid?: string;
};

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * `sessionType` and `supportSession` are ADDITIVE fields on
 * GetCurrentUserWSResponse (webservice, SUPPORT_AUTHORITY_MIND C.4). They are
 * not in the generated client type until the openapi is regenerated, so they
 * are read off the raw payload and tolerated when absent.
 */
function readSupportFields(res: unknown): {
  sessionType?: string;
  supportSession?: SupportSessionFields;
} {
  if (!res || typeof res !== "object") return {};
  const raw = res as { sessionType?: unknown; supportSession?: unknown };
  const sessionType = optionalString(raw.sessionType);
  const ss = raw.supportSession;
  if (!ss || typeof ss !== "object") return { sessionType };
  const s = ss as Record<string, unknown>;
  return {
    sessionType,
    supportSession: {
      authorityUuid: optionalString(s.authorityUuid),
      name: optionalString(s.name),
      email: optionalString(s.email),
      orgUuid: optionalString(s.orgUuid),
    },
  };
}

function describeIdentity(identity: SessionIdentity): string {
  const who = [identity.name, identity.email].filter(Boolean).join(" ");
  return `${who ? `${who} ` : ""}(${identity.userId ?? "no id"})`;
}

async function fetchSession(sessionId: string): Promise<CachedSession | null> {
  const cached = cache.get(sessionId);
  if (cached !== undefined) return cached;

  try {
    const res = await postApi<CustomerGetCurrentUserWsResponse>({
      route: "/customer/getCurrentUser",
      body: {},
      sessionId,
    });

    if (res.error) {
      logger.warn(`resolveAccessibleApps: getCurrentUser failed for session ${sessionId}`);
      return null;
    }

    const user = res.user;
    const { sessionType, supportSession } = readSupportFields(res);

    // A successful getCurrentUser with no `user` is a support-authority session
    // (the webservice never populates `user` for a SupportUserPrincipal). Such a
    // session acts inside the customer's console, so it gets exactly the
    // CONSOLE tool set — never the permissive console+partner union that an
    // empty accessibleRhombusApps list used to fall into.
    if (sessionType === "SUPPORT" || user === null || user === undefined) {
      const identity: SessionIdentity = {
        userId: supportSession?.authorityUuid ?? SUPPORT_SESSION_MARKER,
        orgUuid: supportSession?.orgUuid,
        email: supportSession?.email,
        name: supportSession?.name,
        sessionType: "SUPPORT",
      };
      const entry: CachedSession = { apps: [RhombusAppEnum.CONSOLE], identity };
      cache.set(sessionId, entry);
      logger.info(
        `resolveAccessibleApps: session ${sessionId} -> support session ${describeIdentity(identity)}; tool set=CONSOLE`
      );
      return entry;
    }

    const apps = (user.accessibleRhombusApps ?? []).filter(
      (a): a is AccessibleApp => a !== null && a !== undefined
    );
    const identity: SessionIdentity = {
      userId: user.uuid ?? user.rhombusUserUuid ?? undefined,
      orgUuid: user.orgUuid ?? undefined,
      email: user.email ?? undefined,
      sessionType: "USER",
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
 * Support-authority sessions resolve to exactly `[CONSOLE]`.
 * Returns null on error or missing session; callers should fall back to a
 * permissive default.
 */
export async function resolveAccessibleApps(sessionId?: string): Promise<AccessibleApp[] | null> {
  if (!sessionId) return null;
  return (await fetchSession(sessionId))?.apps ?? null;
}

/**
 * Fetches identity (user uuid, org uuid, email, session type) from
 * getCurrentUser for the given session, reusing the same cached response as
 * `resolveAccessibleApps`. For support sessions the identity comes from
 * `supportSession` (authorityUuid / name / email) when the webservice sends it,
 * else `userId` is the fixed {@link SUPPORT_SESSION_MARKER}.
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
