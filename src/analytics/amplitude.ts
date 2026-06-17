import { flush, init, track } from "@amplitude/analytics-node";

import { logger } from "../logger.js";

/**
 * Amplitude analytics for the Rhombus MCP server.
 *
 * Analytics are **opt-in**: nothing is sent unless `AMPLITUDE_API_KEY` is set.
 * This keeps the published npm package / self-hosted deployments silent by
 * default and confines telemetry to Rhombus-operated deployments that supply
 * the key. Every function here is defensive — analytics must never throw into,
 * slow down, or otherwise affect the request path.
 */

let enabled = false;

/** Identity attached to an analytics event, derived from `getCurrentUser`. */
export type AnalyticsIdentity = {
  /** Stable per-user id (Rhombus user uuid) → Amplitude `user_id`. */
  userId?: string;
  /** Org uuid → Amplitude group, so events roll up per organization. */
  orgUuid?: string;
  /** Fallback identifier (e.g. session id) when no user id is known. */
  deviceId?: string;
};

/**
 * Initialize the Amplitude client once at process start. No-op (and leaves
 * analytics disabled) when `AMPLITUDE_API_KEY` is unset or init fails.
 */
export function initAnalytics(): void {
  const apiKey = process.env.AMPLITUDE_API_KEY;
  if (!apiKey) {
    logger.info("📊 Amplitude analytics disabled (AMPLITUDE_API_KEY not set)");
    return;
  }

  const serverZone =
    (process.env.AMPLITUDE_SERVER_ZONE ?? "US").toUpperCase() === "EU" ? "EU" : "US";

  try {
    init(apiKey, {
      serverZone,
      // Batch in the background; the request path never waits on Amplitude.
      flushIntervalMillis: 10_000,
      flushQueueSize: 50,
    });
    enabled = true;
    logger.info(`📊 Amplitude analytics enabled (zone=${serverZone})`);
  } catch (error) {
    logger.warn(`📊 Failed to initialize Amplitude analytics: ${String(error)}`);
  }
}

/** Whether analytics are active (key present and init succeeded). */
export function analyticsEnabled(): boolean {
  return enabled;
}

/**
 * Record an analytics event. Fire-and-forget and fully guarded — callers do
 * not await this and a failure here is logged at debug level only.
 */
export function trackEvent(
  eventType: string,
  eventProperties: Record<string, unknown>,
  identity: AnalyticsIdentity = {}
): void {
  if (!enabled) return;

  try {
    const { userId, orgUuid, deviceId } = identity;
    track(eventType, eventProperties, {
      // Amplitude requires a user_id or a device_id. Prefer the stable user id;
      // fall back to a device id (session id) and finally a constant so the
      // event is still accepted for stateless (api-key / oauth) callers.
      user_id: userId,
      ...(userId ? {} : { device_id: deviceId || "mcp-stateless" }),
      ...(orgUuid ? { groups: { org: orgUuid } } : {}),
    });
  } catch (error) {
    logger.debug(`📊 trackEvent("${eventType}") failed: ${String(error)}`);
  }
}

/** Flush any buffered events. Call on graceful shutdown. */
export async function flushAnalytics(): Promise<void> {
  if (!enabled) return;
  try {
    await flush().promise;
  } catch (error) {
    logger.debug(`📊 flushAnalytics failed: ${String(error)}`);
  }
}
