import { buildMediaHints } from "./badge-correlation.js";
import { searchNetboxEvents } from "./netbox-tool-api.js";
import type { RequestModifiers } from "../util.js";

export interface GetNetboxAccessAnomaliesArgs {
  area?: string;
  locationUuids?: string[];
  deviceUuids?: string[];
  afterMs?: number;
  beforeMs?: number;
  rules?: string[];
  baselineDays?: number;
  offHoursStartHour?: number;
  offHoursEndHour?: number;
  impossibleTravelMaxSeconds?: number;
  limit?: number;
}

type NetboxEvent = Awaited<ReturnType<typeof searchNetboxEvents>>["events"][number];

interface Finding {
  cardholderName?: string;
  rule: string;
  severity: "high" | "medium";
  datetime?: string;
  timestampMs?: number;
  deviceUuid?: string;
  area?: string;
  rationale: string;
  clipHint?: ReturnType<typeof buildMediaHints>["clipHint"];
  stillHint?: ReturnType<typeof buildMediaHints>["stillHint"];
}

const ALL_RULES = [
  "lost_or_inactive_badge",
  "entry_not_made",
  "off_hours",
  "impossible_travel",
  "area_novelty",
];

const DAY_MS = 86_400_000;

/**
 * Flags anomalous Lenel S2 NetBox access events over a window: deterministic rules (lost/inactive badge,
 * no-entry, off-hours, impossible travel, first-time-in-area vs a baseline) computed over searchNetboxEvents,
 * each finding carrying the still/clip hints to confirm it. The agent narrates/triages from here.
 */
export async function getNetboxAccessAnomalies(
  args: GetNetboxAccessAnomaliesArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const rules = new Set(args.rules && args.rules.length ? args.rules : ALL_RULES);
  const offStart = args.offHoursStartHour ?? 7;
  const offEnd = args.offHoursEndHour ?? 19;
  const maxTravelSec = args.impossibleTravelMaxSeconds ?? 30;
  const baselineDays = args.baselineDays ?? 30;
  const scope = { area: args.area, locationUuids: args.locationUuids, deviceUuids: args.deviceUuids };

  const { events } = await searchNetboxEvents(
    { ...scope, afterMs: args.afterMs, beforeMs: args.beforeMs, limit: args.limit ?? 500 },
    timeZone,
    requestModifiers,
    sessionId
  );

  // Baseline area-set per cardholder (for area_novelty).
  const baselineAreas = new Map<string, Set<string>>();
  if (rules.has("area_novelty") && baselineDays > 0 && args.afterMs != null) {
    const { events: baseEvents } = await searchNetboxEvents(
      { ...scope, afterMs: args.afterMs - baselineDays * DAY_MS, beforeMs: args.afterMs, limit: 1000 },
      timeZone,
      requestModifiers,
      sessionId
    );
    for (const e of baseEvents) {
      if (!e.cardholderName || !e.areaEntering) continue;
      const set = baselineAreas.get(e.cardholderName) ?? new Set<string>();
      set.add(e.areaEntering);
      baselineAreas.set(e.cardholderName, set);
    }
  }

  const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", hourCycle: "h23" });
  const localHour = (ms: number) => parseInt(hourFmt.format(new Date(ms)), 10);

  const findings: Finding[] = [];
  const seen = new Set<string>();
  const add = (e: NetboxEvent, rule: string, severity: "high" | "medium", rationale: string) => {
    const key = `${e.cardholderName ?? ""}|${rule}|${e.timestampMs ?? ""}|${e.areaEntering ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    const { clipHint, stillHint } = buildMediaHints({ deviceUuid: e.deviceUuid, timestampMs: e.timestampMs });
    findings.push({
      cardholderName: e.cardholderName,
      rule,
      severity,
      datetime: e.datetime,
      timestampMs: e.timestampMs,
      deviceUuid: e.deviceUuid,
      area: e.areaEntering ?? e.areaExiting,
      rationale,
      clipHint,
      stillHint,
    });
  };

  for (const e of events) {
    const at = e.areaEntering ? ` at "${e.areaEntering}"` : "";
    if (rules.has("lost_or_inactive_badge") && e.badgeStatus && e.badgeStatus.toLowerCase() !== "active") {
      add(e, "lost_or_inactive_badge", "high", `Badge status "${e.badgeStatus}" used${at}.`);
    }
    if (rules.has("entry_not_made") && e.entryMade === false) {
      add(e, "entry_not_made", "medium", `Access granted but no entry made${at} — possible tailgating or aborted entry.`);
    }
    if (rules.has("off_hours") && e.timestampMs != null) {
      const h = localHour(e.timestampMs);
      if (h < offStart || h >= offEnd) {
        add(e, "off_hours", "medium", `Entry ${e.datetime ?? `${h}:00`} is outside business hours (${offStart}:00–${offEnd}:00)${at}.`);
      }
    }
    if (rules.has("area_novelty") && baselineAreas.size > 0 && e.cardholderName && e.areaEntering) {
      const base = baselineAreas.get(e.cardholderName);
      if (base && !base.has(e.areaEntering)) {
        add(e, "area_novelty", "high", `First entry to "${e.areaEntering}" — not in ${e.cardholderName}'s prior ${baselineDays}-day pattern.`);
      }
    }
  }

  // Impossible travel: per cardholder, consecutive taps in different areas within the window.
  if (rules.has("impossible_travel")) {
    const byPerson = new Map<string, NetboxEvent[]>();
    for (const e of events) {
      if (!e.cardholderName || e.timestampMs == null) continue;
      const arr = byPerson.get(e.cardholderName) ?? [];
      arr.push(e);
      byPerson.set(e.cardholderName, arr);
    }
    for (const [name, evs] of byPerson) {
      const sorted = evs.slice().sort((a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0));
      for (let i = 1; i < sorted.length; i++) {
        const a = sorted[i - 1];
        const b = sorted[i];
        const gapSec = ((b.timestampMs ?? 0) - (a.timestampMs ?? 0)) / 1000;
        if (a.areaEntering && b.areaEntering && a.areaEntering !== b.areaEntering && gapSec <= maxTravelSec) {
          add(b, "impossible_travel", "high", `${name} at "${a.areaEntering}" then "${b.areaEntering}" ${Math.round(gapSec)}s apart — physically implausible for one person.`);
        }
      }
    }
  }

  const sev = (s: string) => (s === "high" ? 0 : 1);
  findings.sort((a, b) => sev(a.severity) - sev(b.severity) || (b.timestampMs ?? 0) - (a.timestampMs ?? 0));

  return { findings, eventsAnalyzed: events.length };
}
