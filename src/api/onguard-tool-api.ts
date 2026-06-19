import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

export interface SearchOnGuardEventsArgs {
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
 * Calls the webservice OnGuard event search (POST /eventSearchV2/searchOnGuardEvents) and maps the
 * raw seekpoints to an agent-friendly shape. Typed against the generated public OpenAPI schema.
 */
export async function searchOnGuardEvents(
  args: SearchOnGuardEventsArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: schema["Eventsearch_SearchOnGuardEventsWSRequest"] = {
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
  };

  const res = await postApi<schema["Eventsearch_SearchOnGuardEventsWSResponse"]>({
    route: "/eventSearchV2/searchOnGuardEvents",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.status ?? res.errorMsg ?? "OnGuard event search failed");
  }

  const events = (res.events ?? []).map((e) => ({
    timestampMs: e.timestampMs ?? undefined,
    datetime: e.timestampMs != null ? formatTimestamp(e.timestampMs, timeZone) : undefined,
    deviceUuid: e.deviceUuid ?? undefined,
    label: e.customDisplayName ?? e.objectType ?? undefined,
    // Dedicated-event-types put the cardholder in its own `cardholderName` field (customDescription
    // is null on ONGUARD_* docs); keep customDescription as a legacy fallback. The generated schema
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
