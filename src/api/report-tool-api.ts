import { logger } from "../logger.js";
import { postApi } from "../network.js";

export async function getSummaryCountReport(
  interval: "MINUTELY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
  scope: "REGION" | "LOCATION" | "DEVICE" | "ORG",
  type:
    | "CROWD"
    | "PEOPLE"
    | "FACES"
    | "MOTION"
    | "BANDWIDTH"
    | "VEHICLES"
    | "LICENSEPLATES"
    | "ALERTS"
    | "AM_VERIFICATION"
    | "DWELL",
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
      type,
      endTimeMs,
      startTimeMs,
    })
  );
  const body = {
    endTimeMs,
    interval,
    scope,
    startTimeMs,
    type,
  };
  const response = await postApi({
    route: "/report/getSummaryCountReport",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Process response to convert date strings to UTC milliseconds timestamps
  if (response && response.timeSeriesDataPoints && Array.isArray(response.timeSeriesDataPoints)) {
    response.timeSeriesDataPoints = response.timeSeriesDataPoints.map((dataPoint: any) => {
      const processedDataPoint = { ...dataPoint };

      if (processedDataPoint.dateLocal) {
        processedDataPoint.dateLocalMs = new Date(processedDataPoint.dateLocal + "Z").getTime();
        delete processedDataPoint.dateLocal;
      }

      if (processedDataPoint.dateUtc) {
        processedDataPoint.dateUtcMs = new Date(processedDataPoint.dateUtc + "Z").getTime();
        delete processedDataPoint.dateUtc;
      }

      return processedDataPoint;
    });
  }

  return response;
}
