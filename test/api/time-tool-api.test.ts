import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";

import {
  matchLastWeekday,
  matchWeekdayInEarlierWeek,
  parseTimeDescription,
  weekdayInEarlierWeek,
} from "../../src/api/time-tool-api.js";

const LA = "America/Los_Angeles";

/** Pin "now" to a local wall-clock time in a zone (parseTimeDescription reads luxon's clock). */
function pinNow(isoLocal: string, zone = LA) {
  const fixed = DateTime.fromISO(isoLocal, { zone });
  if (!fixed.isValid) throw new Error(`bad pinned time ${isoLocal}`);
  Settings.now = () => fixed.toMillis();
  return fixed;
}

afterEach(() => {
  Settings.now = () => Date.now();
});

describe("time-tool: weekday in an earlier calendar week", () => {
  // The 2026-10-07 production case: asked on a Wednesday, "Tuesday last week"
  // came back as Tuesday the 6th (yesterday) instead of Tuesday the 29th.
  it("resolves 'Tuesday last week' to the previous calendar week's Tuesday", () => {
    pinNow("2026-10-07T13:38:00");
    const result = parseTimeDescription("Tuesday last week", LA);
    expect(result.iso).toBe("2026-09-29T00:00:00.000-07:00");
    expect(result.dayStartIso).toBe("2026-09-29T00:00:00.000-07:00");
    expect(result.dayEndIso).toBe("2026-09-29T23:59:59.999-07:00");
    expect(result.timezone).toBe(LA);
    expect(result.nowIso).toBe("2026-10-07T13:38:00.000-07:00");
    expect(result.note).toContain("Tuesday, September 29, 2026");
  });

  // Weeks run Sunday–Saturday: from any day of the week Sun Oct 4 – Sat Oct 10,
  // "last week" is Sep 27 – Oct 3. Sunday Oct 11 starts a new week.
  it.each([
    ["Sunday", "2026-10-04", "2026-09-29"],
    ["Monday", "2026-10-05", "2026-09-29"],
    ["Tuesday", "2026-10-06", "2026-09-29"],
    ["Wednesday", "2026-10-07", "2026-09-29"],
    ["Thursday", "2026-10-08", "2026-09-29"],
    ["Friday", "2026-10-09", "2026-09-29"],
    ["Saturday", "2026-10-10", "2026-09-29"],
    ["next Sunday", "2026-10-11", "2026-10-06"],
  ])("asked on %s %s, 'Tuesday last week' is %s", (_label, today, expected) => {
    pinNow(`${today}T09:15:00`);
    expect(parseTimeDescription("Tuesday last week", LA).iso).toBe(
      `${expected}T00:00:00.000-07:00`
    );
  });

  it.each([
    ["Sunday last week", "2026-09-27"],
    ["Monday last week", "2026-09-28"],
    ["Wednesday last week", "2026-09-30"],
    ["Saturday last week", "2026-10-03"],
    ["Tuesday of last week", "2026-09-29"],
    ["on the Tuesday of last week", "2026-09-29"],
    ["last week Tuesday", "2026-09-29"],
    ["last week's Tuesday", "2026-09-29"],
    ["Tuesday previous week", "2026-09-29"],
    ["Tues last week", "2026-09-29"],
    ["Tuesday the week before last", "2026-09-22"],
    ["Tuesday 2 weeks ago", "2026-09-22"],
    ["Tuesday two weeks ago", "2026-09-22"],
    ["Tuesday a week ago", "2026-09-29"],
    ["a week ago Tuesday", "2026-09-29"],
    ["2 weeks ago on Tuesday", "2026-09-22"],
    ["Friday 3 weeks ago", "2026-09-18"],
  ])("'%s' asked on Wed 2026-10-07 is %s", (phrase, expected) => {
    pinNow("2026-10-07T13:38:00");
    const result = parseTimeDescription(phrase, LA);
    expect(result.iso).toBe(`${expected}T00:00:00.000-07:00`);
    expect(result.dayStartIso).toBe(`${expected}T00:00:00.000-07:00`);
  });

  it("keeps a time of day given with the phrase", () => {
    pinNow("2026-10-07T13:38:00");
    const result = parseTimeDescription("Tuesday last week at 3pm", LA);
    expect(result.iso).toBe("2026-09-29T15:00:00.000-07:00");
    expect(result.dayStartIso).toBe("2026-09-29T00:00:00.000-07:00");
    expect(result.dayEndIso).toBe("2026-09-29T23:59:59.999-07:00");
  });

  it("resolves in the requested timezone (the production report came from Central time)", () => {
    pinNow("2026-10-07T15:38:00", "America/Chicago");
    const result = parseTimeDescription("Tuesday last week", "America/Chicago");
    expect(result.iso).toBe("2026-09-29T00:00:00.000-05:00");
    expect(result.timezone).toBe("America/Chicago");
    expect(result.nowIso).toBe("2026-10-07T15:38:00.000-05:00");
  });

  it("crosses a month boundary", () => {
    pinNow("2026-10-01T08:00:00"); // Thursday
    expect(parseTimeDescription("Monday last week", LA).iso).toBe("2026-09-21T00:00:00.000-07:00");
  });

  it("exposes the matcher", () => {
    expect(matchWeekdayInEarlierWeek("Tuesday last week")).toEqual({
      weekday: 2,
      weeksBack: 1,
      timeText: undefined,
    });
    expect(matchWeekdayInEarlierWeek("thu 2 weeks ago")).toEqual({
      weekday: 4,
      weeksBack: 2,
      timeText: undefined,
    });
    expect(matchWeekdayInEarlierWeek("Tuesday last week at noon")).toEqual({
      weekday: 2,
      weeksBack: 1,
      timeText: "noon",
    });
    expect(matchWeekdayInEarlierWeek("last week")).toBeNull();
    expect(matchWeekdayInEarlierWeek("last Tuesday")).toBeNull();
    expect(matchWeekdayInEarlierWeek("Tuesday")).toBeNull();
    expect(matchWeekdayInEarlierWeek("Tuesday 0 weeks ago")).toBeNull();
  });

  it("weekdayInEarlierWeek uses Sunday-start weeks", () => {
    const sunday = DateTime.fromISO("2026-10-04T12:00:00", { zone: LA });
    expect(weekdayInEarlierWeek(sunday, 0, 1).toISODate()).toBe("2026-09-27");
    expect(weekdayInEarlierWeek(sunday, 6, 1).toISODate()).toBe("2026-10-03");
    const saturday = DateTime.fromISO("2026-10-10T12:00:00", { zone: LA });
    expect(weekdayInEarlierWeek(saturday, 0, 1).toISODate()).toBe("2026-09-27");
  });
});

describe("time-tool: ambiguous 'last <weekday>'", () => {
  it("keeps the most recent weekday but offers the previous calendar week's date", () => {
    pinNow("2026-10-07T13:38:00"); // Wednesday
    const result = parseTimeDescription("last Tuesday", LA);
    expect(result.iso.startsWith("2026-10-06T")).toBe(true);
    expect(result.note).toContain("Tuesday, October 6, 2026");
    expect(result.note).toContain("Tuesday, September 29, 2026");
    expect(result.note).toContain("2026-09-29T00:00:00.000-07:00");
    expect(matchLastWeekday("this past tuesday")).toBe(2);
  });

  it("adds no note when both readings agree", () => {
    pinNow("2026-10-12T09:00:00"); // Monday: most recent Tuesday = Oct 6 = previous week's Tuesday
    const result = parseTimeDescription("last Tuesday", LA);
    expect(result.iso.startsWith("2026-10-06T")).toBe(true);
    expect(result.note).toBeUndefined();
  });
});

describe("time-tool: existing behaviour", () => {
  it("'today' is the start of the local day with a day window", () => {
    pinNow("2026-10-07T13:38:00");
    const result = parseTimeDescription("today", LA);
    expect(result.iso).toBe("2026-10-07T00:00:00.000-07:00");
    expect(result.dayStartIso).toBe("2026-10-07T00:00:00.000-07:00");
    expect(result.dayEndIso).toBe("2026-10-07T23:59:59.999-07:00");
    expect(result.note).toBeUndefined();
  });

  it("'yesterday' is the start of the previous local day", () => {
    pinNow("2026-10-07T13:38:00");
    expect(parseTimeDescription("yesterday", LA).iso).toBe("2026-10-06T00:00:00.000-07:00");
  });

  it("'last week' is a single instant a week back, flagged as a period start", () => {
    pinNow("2026-10-07T13:38:00");
    const result = parseTimeDescription("last week", LA);
    expect(result.iso).toBe("2026-09-30T13:38:00.000-07:00");
    expect(result.note).toContain("START of the requested period");
  });

  it("'last 24 hours' keeps its period note", () => {
    pinNow("2026-10-07T13:38:00");
    expect(parseTimeDescription("last 24 hours", LA).note).toContain(
      "START of the requested period"
    );
  });

  it("rejects an unparseable description", () => {
    pinNow("2026-10-07T13:38:00");
    expect(() => parseTimeDescription("blorp", LA)).toThrow(/Could not parse/);
  });
});
