import { logger } from "../logger.js";
import { postApi } from "../network.js";
import { formatTimestamp } from "../util.js";
import schema from "../types/schema.js";

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
  sessionId?: string
) {
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
  const response = await postApi({
    route: "/report/getCountReportV2",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Process response to convert date strings to UTC milliseconds timestamps
  if (response && response.timeSeriesDataPoints && Array.isArray(response.timeSeriesDataPoints)) {
    response.timeSeriesDataPoints = response.timeSeriesDataPoints.map((dataPoint: any) => {
      const processedDataPoint = { ...dataPoint };

      if (processedDataPoint.dateLocal) {
        try {
          processedDataPoint.dateLocalMs = new Date(processedDataPoint.dateLocal + "Z").getTime();
          processedDataPoint.dateLocalString = formatTimestamp(processedDataPoint.dateLocalMs);
          delete processedDataPoint.dateLocal;
        } catch (e) {}
      }

      if (processedDataPoint.dateUtc) {
        try {
          processedDataPoint.dateUtcMs = new Date(processedDataPoint.dateUtc + "Z").getTime();
          processedDataPoint.dateUtcString = formatTimestamp(processedDataPoint.dateUtcMs);
          delete processedDataPoint.dateUtc;
        } catch (e) {}
      }

      if (processedDataPoint.maxEventCountMap) {
        Object.keys(processedDataPoint.maxEventCountMap).forEach(key => {
          const uuid = processedDataPoint.maxEventCountMap[key].uuid;
          if (scope === "LOCATION") {
            processedDataPoint.maxEventCountMap[key].locationUuid = uuid;
          } else if (scope === "DEVICE") {
            processedDataPoint.maxEventCountMap[key].cameraUuid = uuid;
          } else if (scope === "ORG") {
            processedDataPoint.maxEventCountMap[key].orgUuid = uuid;
          }
          delete processedDataPoint.maxEventCountMap[key].uuid;
        });
      }

      return processedDataPoint;
    });
  }

  return response;
}
