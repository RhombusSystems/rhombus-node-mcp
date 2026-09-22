import { getLocations } from "../api/location-tool-api.js";
import { getLogger } from "../logger.js";
import type { RequestModifiers } from "../util.js";

const logger = getLogger("org-timezone");

/** Where formatted timestamps land when neither the caller nor the org's locations say otherwise. */
export const DEFAULT_TIME_ZONE = "America/Los_Angeles";

/**
 * The organization's working timezone: the IANA zone shared by most of its
 * locations (getLocations is cached, so this is one call per minute per org),
 * else DEFAULT_TIME_ZONE. Used when a tool's timezone argument is null — the
 * model is told to omit it rather than guess "UTC" (small models passed
 * timezone "UTC" whenever they did not know one and then reported "this
 * morning" as a UTC window).
 */
export async function resolveOrgTimeZone(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<string> {
  try {
    const { locations } = await getLocations(requestModifiers, sessionId);
    const counts = new Map<string, number>();
    for (const location of locations) {
      if (location.timezone) counts.set(location.timezone, (counts.get(location.timezone) ?? 0) + 1);
    }
    let best: [string, number] | undefined;
    for (const entry of counts) if (!best || entry[1] > best[1]) best = entry;
    return best?.[0] ?? DEFAULT_TIME_ZONE;
  } catch (e) {
    logger.warn(`could not read locations for the org timezone: ${e instanceof Error ? e.message : e}`);
    return DEFAULT_TIME_ZONE;
  }
}
