import { parse } from "chrono-node";
import { DateTime } from "luxon";
import { logger } from "../logger.js";

export function nullToUndefined(value: number | null): number | undefined {
  return value === null ? undefined : value;
}

function normalizeTimeDescription(description: string): string {
  const normalized = description.toLowerCase().trim();

  if (normalized.includes("current time")) {
    return "now";
  }

  // Handle plain day references as start of day
  if (normalized === "today") {
    return "today at 00:00";
  }
  if (normalized === "yesterday") {
    return "yesterday at 00:00";
  }
  if (normalized === "tomorrow") {
    return "tomorrow at 00:00";
  }

  // Handle "this" time periods - always refer to today
  if (normalized === "this morning") {
    // For occupancy/access-control investigations, "this morning" should include
    // all events since local midnight unless a narrower range is explicitly requested.
    return "today at 00:00";
  }
  if (normalized === "this afternoon") {
    return "today at 12:00";
  }
  if (normalized === "this evening") {
    return "today at 18:00";
  }
  if (normalized === "this night" || normalized === "tonight") {
    return "today at 20:00";
  }

  if (normalized.includes("start of today") || normalized.includes("beginning of today")) {
    return "today at 00:00";
  }
  if (normalized.includes("start of yesterday") || normalized.includes("beginning of yesterday")) {
    return "yesterday at 00:00";
  }
  if (normalized.includes("start of tomorrow") || normalized.includes("beginning of tomorrow")) {
    return "tomorrow at 00:00";
  }

  if (normalized.includes("end of today")) {
    return "today at 23:59:59";
  }
  if (normalized.includes("end of yesterday")) {
    return "yesterday at 23:59:59";
  }
  if (normalized.includes("end of tomorrow")) {
    return "tomorrow at 23:59:59";
  }

  return description;
}

// ---------------------------------------------------------------------------
// Weekday-in-an-earlier-week phrases ("Tuesday last week", "Monday two weeks ago").
//
// chrono-node reads "<weekday> last week" as the most recent past <weekday>:
// asked on Wednesday 2026-10-07, "Tuesday last week" came back as Tuesday
// 2026-10-06 — yesterday — and MIND reported the wrong day's entries to a user
// (2026-10-07). These phrases name a day in an earlier CALENDAR week, so they
// are resolved here by arithmetic and never reach chrono.
//
// Weeks run Sunday through Saturday (US calendars, and the product's default
// timezone is America/Los_Angeles). Only "Sunday last week" differs from an
// ISO Monday-start week, and the Sunday-start reading is the one that does not
// collapse into "this past Sunday".
// ---------------------------------------------------------------------------

const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const WEEKDAY_PATTERN =
  "(sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)";
const COUNT_PATTERN = "(\\d+|a|an|one|two|three|four|five|six)";
const TIME_SUFFIX = "(?:\\s+(?:at|@)\\s+(.+?))?";

type WeekdayPhrase = { weekday: number; weeksBack: number; timeText?: string };

const WEEKS_BACK_PATTERNS: { re: RegExp; weekday: number; count?: number; fixed?: number }[] = [
  // "tuesday last week", "on the tuesday of last week", "tuesday previous week"
  {
    re: new RegExp(
      `^(?:on\\s+)?(?:the\\s+)?${WEEKDAY_PATTERN}\\s+(?:of\\s+)?(?:the\\s+)?(?:last|previous|prior)\\s+week${TIME_SUFFIX}$`
    ),
    weekday: 1,
    fixed: 1,
  },
  // "last week tuesday", "last week's tuesday", "the previous week on tuesday"
  {
    re: new RegExp(
      `^(?:the\\s+)?(?:last|previous|prior)\\s+week(?:'s)?\\s+(?:on\\s+)?${WEEKDAY_PATTERN}${TIME_SUFFIX}$`
    ),
    weekday: 1,
    fixed: 1,
  },
  // "tuesday the week before last", "tuesday of the week before last"
  {
    re: new RegExp(
      `^(?:on\\s+)?(?:the\\s+)?${WEEKDAY_PATTERN}\\s+(?:of\\s+)?(?:the\\s+)?week\\s+before\\s+last${TIME_SUFFIX}$`
    ),
    weekday: 1,
    fixed: 2,
  },
  // "tuesday 2 weeks ago", "tuesday a week ago", "the tuesday three weeks ago"
  {
    re: new RegExp(
      `^(?:on\\s+)?(?:the\\s+)?${WEEKDAY_PATTERN}\\s+${COUNT_PATTERN}\\s+weeks?\\s+ago${TIME_SUFFIX}$`
    ),
    weekday: 1,
    count: 2,
  },
  // "2 weeks ago tuesday", "a week ago on tuesday", "a week ago last tuesday"
  {
    re: new RegExp(
      `^${COUNT_PATTERN}\\s+weeks?\\s+ago\\s+(?:on\\s+|last\\s+)?${WEEKDAY_PATTERN}${TIME_SUFFIX}$`
    ),
    weekday: 2,
    count: 1,
  },
];

// "last tuesday", "this past tuesday", "past tuesday" — ambiguous in English (the most
// recent Tuesday, or the Tuesday of last week?). chrono's reading (most recent) is kept,
// and the previous-calendar-week date is offered beside it.
const LAST_WEEKDAY_RE = new RegExp(
  `^(?:on\\s+)?(?:last|this\\s+past|past|the\\s+previous)\\s+${WEEKDAY_PATTERN}${TIME_SUFFIX}$`
);

const WORD_COUNTS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function weekdayIndex(token: string): number {
  const idx = WEEKDAY_NAMES.findIndex(name => name.startsWith(token.slice(0, 3)));
  return idx === -1 ? 0 : idx;
}

function parseCount(token: string): number {
  return WORD_COUNTS[token] ?? Number.parseInt(token, 10);
}

function cleanDescription(description: string): string {
  return description.toLowerCase().replace(/[.,!?]+$/g, "").replace(/\s+/g, " ").trim();
}

/** "tuesday last week" → { weekday: 2, weeksBack: 1 }; null when the phrase is not of that family. */
export function matchWeekdayInEarlierWeek(description: string): WeekdayPhrase | null {
  const text = cleanDescription(description);
  for (const pattern of WEEKS_BACK_PATTERNS) {
    const match = pattern.re.exec(text);
    if (!match) continue;
    const weeksBack = pattern.fixed ?? parseCount(match[pattern.count!]);
    if (!Number.isFinite(weeksBack) || weeksBack < 1) continue;
    const timeText = match[match.length - 1];
    return { weekday: weekdayIndex(match[pattern.weekday]), weeksBack, timeText: timeText || undefined };
  }
  return null;
}

/** "last tuesday" → weekday index; null otherwise. */
export function matchLastWeekday(description: string): number | null {
  const match = LAST_WEEKDAY_RE.exec(cleanDescription(description));
  return match ? weekdayIndex(match[1]) : null;
}

/** Start of the Sunday-to-Saturday week that contains `moment`. */
function startOfSundayWeek(moment: DateTime): DateTime {
  const day = moment.startOf("day");
  // luxon: Monday = 1 … Sunday = 7, so Sunday % 7 = 0 days back.
  return day.minus({ days: day.weekday % 7 });
}

/** The given weekday in the calendar week `weeksBack` weeks before the one containing `now`. */
export function weekdayInEarlierWeek(now: DateTime, weekday: number, weeksBack: number): DateTime {
  return startOfSundayWeek(now).minus({ weeks: weeksBack }).plus({ days: weekday });
}

function dayWindow(dt: DateTime) {
  return { dayStartIso: dt.startOf("day").toISO(), dayEndIso: dt.endOf("day").toISO() };
}

function describeDay(dt: DateTime): string {
  return dt.toFormat("cccc, LLLL d, yyyy");
}

function applyTimeOfDay(day: DateTime, timeText: string | undefined): DateTime {
  if (!timeText) return day;
  const parsed = parse(timeText, day.toJSDate());
  const start = parsed[0]?.start;
  if (!start || !start.isCertain("hour")) return day;
  return day.set({
    hour: start.get("hour") ?? 0,
    minute: start.get("minute") ?? 0,
    second: start.get("second") ?? 0,
  });
}

export function parseTimeDescription(time_description: string, timezone?: string, extra?: any) {
  logger.info("EXTRA", extra);

  const zone = timezone || "America/Los_Angeles";
  const nowInZone = DateTime.now().setZone(zone);
  const nowIso = nowInZone.set({ millisecond: 0 }).toISO();

  const earlierWeek = matchWeekdayInEarlierWeek(time_description);
  if (earlierWeek) {
    const day = weekdayInEarlierWeek(nowInZone, earlierWeek.weekday, earlierWeek.weeksBack);
    const dt = applyTimeOfDay(day, earlierWeek.timeText);
    logger.info(
      `TIME TOOL ${timezone}: "${time_description}" is ${describeDay(day)} (weekday ${earlierWeek.weekday}, ${earlierWeek.weeksBack} week(s) back from ${nowInZone.toISODate()})`
    );
    const weeks = earlierWeek.weeksBack === 1 ? "the week before" : `${earlierWeek.weeksBack} weeks before`;
    return {
      timestamp: dt.toMillis(),
      iso: dt.toISO(),
      timezone: dt.zoneName,
      nowIso,
      ...dayWindow(day),
      note:
        `"${time_description.trim()}" is ${describeDay(day)}: the ${WEEKDAY_NAMES[earlierWeek.weekday]} of the calendar week ` +
        `${weeks} the current one (today is ${describeDay(nowInZone)}). ` +
        `Use dayStartIso to dayEndIso for that whole day.`,
    };
  }

  const now = new Date(nowInZone.toISO({ includeOffset: false })!);

  const normalizedDescription = normalizeTimeDescription(time_description);
  logger.info(
    `TIME TOOL ${timezone}: Normalized "${time_description}" to "${normalizedDescription}"`
  );

  // Use the timezone-adjusted date as the reference date for chrono-node
  const parsed = parse(normalizedDescription, now);

  if (!parsed || parsed.length === 0) {
    throw new Error(`Could not parse time description: ${time_description}`);
  }

  logger.info(`TIME TOOLPARSED ${time_description}`, JSON.stringify(parsed));

  const dateComponents = parsed[0].start;
  if (!dateComponents) {
    throw new Error("Parsed time has no start component");
  }

  const dt = DateTime.fromObject(
    {
      year: nullToUndefined(dateComponents.get("year")),
      month: nullToUndefined(dateComponents.get("month")),
      day: nullToUndefined(dateComponents.get("day")),
      hour: nullToUndefined(dateComponents.get("hour")),
      minute: nullToUndefined(dateComponents.get("minute")),
      second: nullToUndefined(dateComponents.get("second")),
      millisecond: 0,
    },
    {
      zone: timezone || "local",
    }
  );

  if (!dt.isValid) {
    throw new Error(`Could not construct valid DateTime: ${dt.invalidReason}`);
  }

  const timestamp = dt.toMillis();

  let note: string | undefined;
  if (RELATIVE_PAST_SPAN.test(time_description.trim())) {
    // A single instant for "last 24 hours" was once read as the END of the window, and a
    // report covered the day before the one asked for.
    note = "iso is the START of the requested period; the period ends now (nowIso).";
  } else {
    const lastWeekday = matchLastWeekday(time_description);
    if (lastWeekday !== null) {
      const previousWeek = weekdayInEarlierWeek(nowInZone, lastWeekday, 1);
      if (previousWeek.toISODate() !== dt.toISODate()) {
        note =
          `"${time_description.trim()}" was read as the most recent ${WEEKDAY_NAMES[lastWeekday]} before today, ` +
          `${describeDay(dt)}. The ${WEEKDAY_NAMES[lastWeekday]} of the previous calendar week is ` +
          `${describeDay(previousWeek)} (${previousWeek.toISO()}). If the user's wording means last week, use that date instead, ` +
          `and say which date you used.`;
      }
    }
  }

  return {
    timestamp,
    iso: dt.toISO(),
    timezone: dt.zoneName,
    nowIso,
    ...dayWindow(dt),
    ...(note ? { note } : {}),
  };
}

const RELATIVE_PAST_SPAN =
  /^(?:the\s+)?(?:last|past|previous)\s+(?:\d+|a|an|one)?\s*(?:minutes?|hours?|days?|weeks?|months?)\b/i;
