import { parse } from "chrono-node";
import { DateTime } from "luxon";
import { logger } from "../logger.js";

export function nullToUndefined(value: number | null): number | undefined {
  return value === null ? undefined : value;
}

export function parseTimeDescription(time_description: string, timezone?: string, extra?: any) {
  logger.info("EXTRA", extra);

  const now = DateTime.now()
    .setZone(timezone || undefined)
    .toJSDate();
  const parsed = parse(time_description, now, { forwardDate: true });

  if (!parsed || parsed.length === 0) {
    throw new Error(`Could not parse time description: ${time_description}`);
  }

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
