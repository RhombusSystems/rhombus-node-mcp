import type { RequestModifiers } from "../util.js";
import { getOrg } from "./get-org-information-tool-api.js";

/**
 * Org feature flags as /org/getOrgV2 reports them: a map of flag name to a
 * string value ("true" / "false", occasionally null). Read through the cached
 * org lookup, so a tool that consults a flag on every call costs one upstream
 * request per minute, not one per call.
 */
export async function isOrgFeatureFlagEnabled(
  flag: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<boolean> {
  try {
    const response = await getOrg(requestModifiers, sessionId);
    const value = response?.featureFlags?.[flag];
    if (typeof value !== "string" || !value) return false;
    // The Console's checkBooleanFlag: a flag value is JSON ("true", "1"); anything unparsable is off.
    try {
      return !!JSON.parse(value);
    } catch {
      return value.trim().toLowerCase() === "true";
    }
  } catch {
    // A flag lookup must never fail the tool that asked; callers fall back to their default.
    return false;
  }
}

/** Org flag the Console gates its AI Search model on: CHARON (Plumerai) instead of CLIP. */
export const PLUMERAI_MODEL_SELECTION_ENABLED = "plumeraiModelSelectionEnabled";
