import { postApi } from "../network/network.js";
import { ActivityEnum } from "../types/schema.js";
import type { schema } from "../types/schema.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

export interface SearchElementsEventsArgs {
  area?: string;
  locationUuids?: string[];
  deviceUuids?: string[];
  cardholderQuery?: string;
  badgeStatus?: string;
  badgeType?: string;
  anomalyOnly?: boolean;
  entryMade?: boolean;
  afterMs?: number;
  beforeMs?: number;
  limit?: number;
}

/**
 * Honeywell Elements (LenelS2 Elements) activity enum values. Passing these as `activityTypes` to the
 * generalized access-control event search scopes results to Elements events only — exactly mirroring the
 * OnGuard search, which is implicitly scoped to ONGUARD_* types server-side.
 */
export const ELEMENTS_ACTIVITY_TYPES = [
  ActivityEnum.ELEMENTS_BADGE_AUTHORIZED,
  ActivityEnum.ELEMENTS_BADGE_ANOMALY,
  ActivityEnum.ELEMENTS_NO_ENTRY_MADE,
] as const;

/**
 * Calls the generalized webservice access-control event search
 * (POST /eventSearchV2/searchIntegrationAccessEvents) scoped to Honeywell Elements via `activityTypes`, and
 * maps the raw seekpoints to the same agent-friendly shape as searchOnGuardEvents. Typed against the
 * generated public OpenAPI schema (Eventsearch_SearchIntegrationAccessEventsWSRequest/Response).
 */
export async function searchElementsEvents(
  args: SearchElementsEventsArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: schema["Eventsearch_SearchIntegrationAccessEventsWSRequest"] = {
    deviceUuids: args.deviceUuids,
    locationUuids: args.locationUuids,
    afterMs: args.afterMs,
    beforeMs: args.beforeMs,
    cardholderQuery: args.cardholderQuery,
    badgeStatus: args.badgeStatus,
    badgeType: args.badgeType,
    area: args.area,
    anomalyOnly: args.anomalyOnly,
    entryMade: args.entryMade,
    limit: args.limit ?? 200,
    activityTypes: [...ELEMENTS_ACTIVITY_TYPES],
  };

  const res = await postApi<schema["Eventsearch_SearchIntegrationAccessEventsWSResponse"]>({
    route: "/eventSearchV2/searchIntegrationAccessEvents",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.status ?? res.errorMsg ?? "Elements event search failed");
  }

  const events = (res.events ?? []).map((e) => ({
    timestampMs: e.timestampMs ?? undefined,
    datetime: e.timestampMs != null ? formatTimestamp(e.timestampMs, timeZone) : undefined,
    deviceUuid: e.deviceUuid ?? undefined,
    label: e.customDisplayName ?? e.objectType ?? undefined,
    // Dedicated-event-types put the cardholder in its own `cardholderName` field (customDescription
    // is null on those docs); keep customDescription as a legacy fallback. The generated schema
    // predates the field, so read it through a cast until `assets/openapi.json` is regenerated.
    cardholderName:
      (e as { cardholderName?: string | null }).cardholderName ?? e.customDescription ?? undefined,
    badgeStatus: e.badgeStatus ?? undefined,
    badgeType: e.badgeType ?? undefined,
    areaEntering: e.areaEntering ?? undefined,
    areaExiting: e.areaExiting ?? undefined,
    entryMade: e.entryMade ?? undefined,
    isAnomaly: e.alert ?? undefined,
  }));

  return { events };
}
