import { getLogger, logger } from "../logger.js";
import { postApi } from "../network.js";
import { formatTimestamp } from "../util.js";
import schema from "../types/schema.js";
import { OutputSchema, SanitizedTimeSeriesDataPoint } from "../types/report-tool-types.js";
import { GetCountReportV2WSRequestTypesEnum } from "../types/schema-components.js";
import { DateTime } from "luxon";

const REPORT_TYPES_THAT_RETURN_UTC = new Set([
  GetCountReportV2WSRequestTypesEnum.BANDWIDTH,
  GetCountReportV2WSRequestTypesEnum.VEHICLES,
  GetCountReportV2WSRequestTypesEnum.MOTION,
  GetCountReportV2WSRequestTypesEnum.DWELL,
]);

const logger = getLogger();

function getUtcTime(
  datetime: string,
  reportType: GetCountReportV2WSRequestTypesEnum,
  timeZone?: string
): string {
  if (REPORT_TYPES_THAT_RETURN_UTC.has(reportType)) {
    return datetime;
  } else {
    logger.info("timeZone", datetime);
    return DateTime.fromISO(datetime, { zone: timeZone }).toUTC().toISO()!;
  }
}

export async function getOccupancyCountReport(
  deviceUuid: string,
  startTimeMs: number,
  endTimeMs: number,
  interval: "MINUTELY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
  requestModifiers?: any,
  sessionId?: string
) {
  const body = {
    deviceUuid,
    startTimeMs,
    endTimeMs,
    interval,
  };

  const response: schema["Report_GetOccupancyCountsWSResponse"] = await postApi({
    route: "/report/getOccupancyCounts",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  response.timeSeriesDataPoints = (response.timeSeriesDataPoints || []).map(dataPoint => {
    const dateLocalMs = new Date(dataPoint.dateLocal || "").getTime();
    const dateUtcMs = new Date(dataPoint.dateUtc || "").getTime();
    logger.info("timeSeriesDataPoints dataPoint:", JSON.stringify(dataPoint));
    return {
      ...dataPoint,
      dateLocalString: formatTimestamp(dateLocalMs),
      dateUtcString: formatTimestamp(dateUtcMs),
    };
  });
  return response;
}

export async function getSummaryCountReport(
  interval: "MINUTELY" | "QUARTERHOURLY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
  scope: "REGION" | "LOCATION" | "DEVICE" | "ORG",
  types: (
    | "CROWD"
    | "PEOPLE"
    | "FACES"
    | "MOTION"
    | "BANDWIDTH"
    | "VEHICLES"
    | "LICENSEPLATES"
    | "ALERTS"
    | "AM_VERIFICATION"
    | "DWELL"
  )[],
  uuid: string | undefined,
  endTimeMs: number,
  startTimeMs: number,
  requestModifiers?: any,
  sessionId?: string,
  timeZone?: string
): Promise<OutputSchema["summaryCountReport"]> {
  logger.info(
    "📊 Getting summary count report",
    JSON.stringify({
      interval,
      scope,
      types,
      endTimeMs,
      startTimeMs,
      uuid,
    })
  );
  const body = {
    endTimeMs,
    interval,
    scope,
    startTimeMs,
    types,
    ...(uuid ? { uuid } : {}),
  };
  const response = await postApi<schema["Report_GetCountReportWSResponse"]>({
    route: "/report/getCountReportV2",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Process response to convert date strings to UTC milliseconds timestamps
  let newTimeSeriesDataPoints: SanitizedTimeSeriesDataPoint[] | undefined = undefined;
  if (response && response.timeSeriesDataPoints && Array.isArray(response.timeSeriesDataPoints)) {
    newTimeSeriesDataPoints = response.timeSeriesDataPoints.map((dataPoint: any) => {
      const sanitizedDataPoint: SanitizedTimeSeriesDataPoint = {
        eventCountMap: dataPoint.eventCountMap,
        dateUtcString: getUtcTime(dataPoint.dateLocal, dataPoint.type, timeZone),
      };

      return sanitizedDataPoint;
    });
  }

  return {
    error: response.error,
    errorMsg: response.errorMsg ?? undefined,
    timeSeriesDataPoints: newTimeSeriesDataPoints,
  };
}
