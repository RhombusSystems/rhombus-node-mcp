import { postApi } from "../network/network.js";
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
 * Calls the public webservice OnGuard event search (POST /eventSearchV2/searchOnGuardEvents).
 *
 * Typed as `any` for now: the endpoint post-dates the generated public OpenAPI schema
 * (`types/schema.ts`), so there is no `schema[...SearchOnGuardEvents...]` yet. Once the spec is
 * regenerated, swap `postApi<any>` for the generated request/response types and drop the casts.
 */
export async function searchOnGuardEvents(
  args: SearchOnGuardEventsArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<any>({
    route: "/eventSearchV2/searchOnGuardEvents",
    body: {
      ...(args.deviceUuids?.length ? { deviceUuids: args.deviceUuids } : {}),
      ...(args.locationUuids?.length ? { locationUuids: args.locationUuids } : {}),
      ...(args.afterMs != null ? { afterMs: args.afterMs } : {}),
      ...(args.beforeMs != null ? { beforeMs: args.beforeMs } : {}),
      ...(args.cardholderQuery ? { cardholderQuery: args.cardholderQuery } : {}),
      ...(args.badgeStatus ? { badgeStatus: args.badgeStatus } : {}),
      ...(args.badgeType ? { badgeType: args.badgeType } : {}),
      ...(args.area ? { area: args.area } : {}),
      ...(args.anomalyOnly != null ? { anomalyOnly: args.anomalyOnly } : {}),
      ...(args.entryMade != null ? { entryMade: args.entryMade } : {}),
      limit: args.limit ?? 200,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.status ?? "OnGuard event search failed");
  }

  const rawEvents: any[] = res.events ?? [];
  const events = rawEvents.map((e) => ({
    timestampMs: e.timestampMs ?? undefined,
    datetime: e.timestampMs != null ? formatTimestamp(e.timestampMs, timeZone) : undefined,
    deviceUuid: e.deviceUuid ?? undefined,
    label: e.customDisplayName ?? undefined,
    cardholderName: e.customDescription ?? undefined,
    badgeStatus: e.badgeStatus ?? undefined,
    badgeType: e.badgeType ?? undefined,
    areaEntering: e.areaEntering ?? undefined,
    areaExiting: e.areaExiting ?? undefined,
    entryMade: e.entryMade ?? undefined,
    isAnomaly: e.alert ?? undefined,
  }));

  return { events };
}
