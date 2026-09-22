import { buildMediaHints } from "./badge-correlation.js";
import { searchElementsEvents } from "./elements-tool-api.js";
import type { RequestModifiers } from "../util.js";

export interface GetElementsBadgeTimelineArgs {
  cardholderQuery: string;
  locationUuids?: string[];
  afterMs?: number;
  beforeMs?: number;
  clipPaddingSeconds?: number;
  limit?: number;
}

/**
 * Reconstructs a single cardholder's movements as a chronological timeline of Honeywell Elements badge taps,
 * each with the still/clip hints needed to show what happened. Pure orchestration over
 * searchElementsEvents + the shared correlation helper.
 */
export async function getElementsBadgeTimeline(
  args: GetElementsBadgeTimelineArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const { events } = await searchElementsEvents(
    {
      cardholderQuery: args.cardholderQuery,
      locationUuids: args.locationUuids,
      afterMs: args.afterMs,
      beforeMs: args.beforeMs,
      limit: args.limit ?? 200,
    },
    timeZone,
    requestModifiers,
    sessionId
  );

  // searchElementsEvents returns newest-first; a timeline reads chronologically.
  const ordered = events
    .filter((e) => e.timestampMs != null)
    .sort((a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0));

  const stops = ordered.map((e, i) => {
    const next = ordered[i + 1];
    const gapToNextSeconds =
      next?.timestampMs != null && e.timestampMs != null
        ? Math.round((next.timestampMs - e.timestampMs) / 1000)
        : undefined;
    const { clipHint, stillHint } = buildMediaHints(
      { deviceUuid: e.deviceUuid, timestampMs: e.timestampMs },
      args.clipPaddingSeconds
    );
    return {
      timestampMs: e.timestampMs,
      datetime: e.datetime,
      deviceUuid: e.deviceUuid,
      area: e.areaEntering ?? e.areaExiting,
      label: e.label,
      isAnomaly: e.isAnomaly,
      clipHint,
      stillHint,
      gapToNextSeconds,
    };
  });

  // The sequence of areas traversed, collapsing consecutive repeats.
  const path: string[] = [];
  for (const stop of stops) {
    if (stop.area && stop.area !== path[path.length - 1]) {
      path.push(stop.area);
    }
  }

  // cardholderQuery is full-text, so it can match more than one person — surface that so the agent
  // can disambiguate rather than silently merge two people's movements.
  const distinctCardholders = [
    ...new Set(ordered.map((e) => e.cardholderName).filter((n): n is string => !!n)),
  ];

  return {
    cardholderName: distinctCardholders[0],
    ambiguousCardholders: distinctCardholders.length > 1 ? distinctCardholders : undefined,
    stops,
    path,
  };
}
