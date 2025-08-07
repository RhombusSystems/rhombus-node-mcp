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
    return "today at 06:00";
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

export function parseTimeDescription(time_description: string, timezone?: string, extra?: any) {
  logger.info("EXTRA", extra);

  const now = new Date(DateTime.now().setZone(timezone || "America/Los_Angeles").toISO({ includeOffset: false })!);

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

  return {
    timestamp,
    iso: dt.toISO(),
    timezone: dt.zoneName,
  };
}
