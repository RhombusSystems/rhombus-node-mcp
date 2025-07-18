import { logger } from "../logger.js";
import { postApi } from "../network.js";

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
        processedDataPoint.dateLocalMs = new Date(processedDataPoint.dateLocal + "Z").getTime();
        delete processedDataPoint.dateLocal;
      }

      if (processedDataPoint.dateUtc) {
        processedDataPoint.dateUtcMs = new Date(processedDataPoint.dateUtc + "Z").getTime();
        delete processedDataPoint.dateUtc;
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
