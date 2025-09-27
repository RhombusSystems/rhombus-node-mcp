import { getLogger } from "../logger.js";
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

export async function getOccupancyEnabledCameras(
  requestModifiers?: any,
  sessionId?: string
): Promise<OutputSchema["occupancyEnabledCamerasReport"]> {
  logger.info("📷 Getting occupancy enabled cameras");

  const body = {};

  const response = await postApi<schema["Camera_GetFacetedCameraDetailsWSResponse"]>({
    route: "/camera/getOccupancyEnabledCameras",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Transform the response to handle null values
  const cameras = response.cameras
    ? response.cameras.map(camera => ({
        uuid: camera.uuid ?? undefined,
        deviceUuid: camera.deviceUuid ?? undefined,
        name: camera.name ?? undefined,
        serialNumber: camera.serialNumber ?? undefined,
        locationUuid: camera.locationUuid ?? undefined,
        facetNameMap: camera.facetNameMap ?? undefined,
        deleted: camera.deleted ?? undefined,
        pending: camera.pending ?? undefined,
        mummified: camera.mummified ?? undefined,
      }))
    : undefined;

  return {
    error: response.error ?? undefined,
    errorMsg: response.errorMsg ?? undefined,
    cameras,
  };
}

export async function getLineCrossingEnabledCameras(
  locationUuid: string,
  requestModifiers?: any,
  sessionId?: string
): Promise<OutputSchema["lineCrossingEnabledCamerasReport"]> {
  logger.info("🚶 Getting line crossing enabled cameras for location", locationUuid);

  const body = {
    locationUuid,
  };

  const response = await postApi<
    schema["Camera_GetLineCrossingEnabledCamerasForLocationWSResponse"]
  >({
    route: "/camera/getLineCrossingEnabledCamerasForLocation",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  return {
    error: response.error ?? undefined,
    errorMsg: response.errorMsg ?? undefined,
    camerasToConfigs: response.camerasToConfigs ?? undefined,
  };
}

export async function getThresholdCrossingCountReport(
  deviceUuid: string,
  startTimeMs: number,
  endTimeMs: number,
  bucketSize: "QUARTER_HOUR" | "HOUR" | "DAY" | "WEEK",
  crossingObject: "HUMAN" | "VEHICLE" | "UNKNOWN",
  dedupe: boolean,
  requestModifiers?: any,
  sessionId?: string
): Promise<OutputSchema["thresholdCrossingCountReport"]> {
  logger.info(
    "🚪 Getting threshold crossing count report",
    JSON.stringify({
      deviceUuid,
      startTimeMs,
      endTimeMs,
      bucketSize,
      crossingObject,
      dedupe,
    })
  );

  const body = {
    deviceUuid,
    startTimeMs,
    endTimeMs,
    bucketSize,
    crossingObject,
    dedupe,
  };

  const response = await postApi<schema["Report_GetThresholdCrossingCountReportWSResponse"]>({
    route: "/report/getThresholdCrossingCountReport",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Transform the response to handle null values
  const crossingCounts = response.crossingCounts
    ? response.crossingCounts.map(count => ({
        timestampMs: count.timestampMs ?? undefined,
        ingressCount: count.ingressCount ?? undefined,
        egressCount: count.egressCount ?? undefined,
      }))
    : undefined;

  // Calculate metrics if we have crossing counts and the bucket size is appropriate
  let metrics: NonNullable<OutputSchema["thresholdCrossingCountReport"]>["metrics"] = undefined;

  if (crossingCounts && crossingCounts.length > 0) {
    // Calculate total entries and exits
    let totalEntries = 0;
    let totalExits = 0;
    let maxEntries = 0;
    let maxExits = 0;
    let maxTotal = 0;
    let maxEntriesTimestamp: number | undefined;
    let maxExitsTimestamp: number | undefined;
    let maxTotalTimestamp: number | undefined;
    let maxTotalEntries = 0;
    let maxTotalExits = 0;

    crossingCounts.forEach(count => {
      const entries = count.ingressCount || 0;
      const exits = count.egressCount || 0;
      const total = entries + exits;

      totalEntries += entries;
      totalExits += exits;

      // Track max entries
      if (entries > maxEntries) {
        maxEntries = entries;
        maxEntriesTimestamp = count.timestampMs;
      }

      // Track max exits
      if (exits > maxExits) {
        maxExits = exits;
        maxExitsTimestamp = count.timestampMs;
      }

      // Track busiest hour (max total)
      if (total > maxTotal) {
        maxTotal = total;
        maxTotalTimestamp = count.timestampMs;
        maxTotalEntries = entries;
        maxTotalExits = exits;
      }
    });

    // Calculate hours based on bucket size
    let hoursInPeriod = 1;
    const periodMs = endTimeMs - startTimeMs;

    if (bucketSize === "HOUR") {
      hoursInPeriod = periodMs / (1000 * 60 * 60);
    } else if (bucketSize === "QUARTER_HOUR") {
      // For quarter hour buckets, we need to aggregate to hourly
      hoursInPeriod = periodMs / (1000 * 60 * 60);
      // Note: For more accurate hourly calculations with quarter-hour buckets,
      // we'd need to group by hour, but for now we'll use the total period
    } else if (bucketSize === "DAY") {
      hoursInPeriod = periodMs / (1000 * 60 * 60);
    } else if (bucketSize === "WEEK") {
      hoursInPeriod = periodMs / (1000 * 60 * 60);
    }

    // Helper function to format hour labels
    const formatHourLabel = (timestampMs: number | undefined): string => {
      if (!timestampMs) return "Unknown";

      const date = DateTime.fromMillis(timestampMs);
      if (bucketSize === "HOUR") {
        const endHour = date.plus({ hours: 1 });
        return `${date.toFormat("h:mm a")} - ${endHour.toFormat("h:mm a")} (${date.toFormat("MMM d, yyyy")})`;
      } else if (bucketSize === "QUARTER_HOUR") {
        const endTime = date.plus({ minutes: 15 });
        return `${date.toFormat("h:mm a")} - ${endTime.toFormat("h:mm a")} (${date.toFormat("MMM d, yyyy")})`;
      } else if (bucketSize === "DAY") {
        return date.toFormat("MMM d, yyyy");
      } else if (bucketSize === "WEEK") {
        const endWeek = date.plus({ weeks: 1 }).minus({ days: 1 });
        return `Week of ${date.toFormat("MMM d")} - ${endWeek.toFormat("MMM d, yyyy")}`;
      }
      return date.toISO() || "Unknown";
    };

    metrics = {
      averageEntriesPerHour: totalEntries / hoursInPeriod,
      averageExitsPerHour: totalExits / hoursInPeriod,
      mostEntriesInHour: {
        count: maxEntries,
        timestamp: maxEntriesTimestamp ? DateTime.fromMillis(maxEntriesTimestamp).toISO()! : "",
        hourLabel: formatHourLabel(maxEntriesTimestamp),
      },
      mostExitsInHour: {
        count: maxExits,
        timestamp: maxExitsTimestamp ? DateTime.fromMillis(maxExitsTimestamp).toISO()! : "",
        hourLabel: formatHourLabel(maxExitsTimestamp),
      },
      busiestHour: {
        totalCount: maxTotal,
        timestamp: maxTotalTimestamp ? DateTime.fromMillis(maxTotalTimestamp).toISO()! : "",
        hourLabel: formatHourLabel(maxTotalTimestamp),
        entries: maxTotalEntries,
        exits: maxTotalExits,
      },
    };
  }

  return {
    error: response.error ?? undefined,
    errorMsg: response.errorMsg ?? undefined,
    crossingCounts,
    metrics,
  };
}

export async function findPromptConfigurations(
  requestModifiers?: any,
  sessionId?: string
): Promise<OutputSchema["promptConfigurationsReport"]> {
  logger.info("🔍 Finding custom event prompt configurations");

  const body = {};

  const response = await postApi<schema["Scenequery_FindAllPromptConfigurationsWSResponse"]>({
    route: "/scenequery/findPromptConfigurations",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  // Transform the response to handle null values
  const promptConfigurations = response.promptConfigurations
    ? response.promptConfigurations.map(config => ({
        active: config.active ?? undefined,
        cameraConfigurations: config.cameraConfigurations ?? undefined,
        checkEquations: config.checkEquations ?? undefined,
        description: config.description ?? undefined,
        minuteTriggerRate: config.minuteTriggerRate ?? undefined,
        name: config.name ?? undefined,
        orgUuid: config.orgUuid ?? undefined,
        prompt: config.prompt ?? undefined,
        promptType: config.promptType ?? undefined,
        scheduleUuid: config.scheduleUuid ?? undefined,
        shortName: config.shortName ?? undefined,
        uuid: config.uuid ?? undefined,
      }))
    : undefined;

  return {
    error: response.error ?? undefined,
    errorMsg: response.errorMsg ?? undefined,
    promptConfigurations,
  };
}

export async function getCustomLLMReport(
  promptUuid: string,
  promptType: "COUNT" | "PERCENT" | "BOOLEAN",
  startTimeMs: number,
  endTimeMs: number,
  interval: "MINUTELY" | "QUARTERHOURLY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY",
  requestModifiers?: any,
  sessionId?: string
): Promise<OutputSchema["customLLMReport"]> {
  logger.info(
    "📊 Getting custom LLM report",
    JSON.stringify({
      promptUuid,
      promptType,
      startTimeMs,
      endTimeMs,
      interval,
    })
  );

  const body = {
    promptUuid,
    startTimeMs,
    endTimeMs,
    interval,
  };

  // Determine the correct endpoint based on promptType
  let route: string;
  switch (promptType) {
    case "COUNT":
      route = "/report/getCustomLLMNumericCounts";
      break;
    case "PERCENT":
      route = "/report/getCustomLLMReport";
      break;
    case "BOOLEAN":
      route = "/report/getCustomLLMBinaryCounts";
      break;
    default:
      throw new Error(`Unknown prompt type: ${promptType}`);
  }

  const response = await postApi<any>({
    route,
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  logger.info(
    "📊 Custom LLM API response:",
    JSON.stringify({
      promptType,
      hasReports: !!response.reports,
      hasTimeSeriesDataPoints: !!response.timeSeriesDataPoints,
      error: response.error,
    })
  );

  // Different prompt types return different response structures
  let timeSeriesDataPoints;

  if ((promptType === "BOOLEAN" || promptType === "PERCENT") && response.reports) {
    // BOOLEAN and PERCENT types return a reports object with device UUIDs as keys
    const reportEntries = Object.entries(response.reports);
    logger.info(
      `📊 ${promptType} response structure:`,
      JSON.stringify({ reportEntries: reportEntries.length })
    );

    // Aggregate data from all devices
    const aggregatedData: Record<string, any> = {};

    reportEntries.forEach(([deviceId, reportData]) => {
      if (Array.isArray(reportData)) {
        reportData.forEach((item: any) => {
          const dateKey = item.localDate || new Date().toISOString();
          if (!aggregatedData[dateKey]) {
            aggregatedData[dateKey] = {
              dateLocal: item.localDate,
              eventCount: 0,
              true: 0,
              false: 0,
              // For PERCENT type, store percentage values
              percentages: {},
            };
          }

          if (promptType === "BOOLEAN") {
            aggregatedData[dateKey].eventCount += item.eventCount || 0;
            aggregatedData[dateKey].true += item.true || 0;
            aggregatedData[dateKey].false += item.false || 0;
          } else if (promptType === "PERCENT") {
            // For PERCENT type, aggregate percentage data
            aggregatedData[dateKey].eventCount += item.eventCount || 0;
            // Store any percentage-related fields from the response
            Object.entries(item).forEach(([key, value]) => {
              if (key !== "localDate" && key !== "eventCount") {
                // Store any numeric values as percentages (could be number or string percentage)
                aggregatedData[dateKey].percentages[key] = value;
              }
            });
          }
        });
      }
    });

    // Convert aggregated data to timeSeriesDataPoints format
    timeSeriesDataPoints = Object.entries(aggregatedData).map(([date, data]) => ({
      dateLocal: data.dateLocal ?? undefined,
      dateUtc: data.dateLocal ?? undefined, // Convert to UTC if needed
      eventCountMap:
        promptType === "BOOLEAN"
          ? {
              total: data.eventCount,
              true: data.true,
              false: data.false,
            }
          : {
              total: data.eventCount,
              ...data.percentages,
            },
    }));
  } else if (response.timeSeriesDataPoints) {
    // COUNT type uses the standard timeSeriesDataPoints format
    timeSeriesDataPoints = response.timeSeriesDataPoints.map((dataPoint: any) => ({
      dateLocal: dataPoint.dateLocal ?? undefined,
      dateUtc: dataPoint.dateUtc ?? undefined,
      eventCountMap: dataPoint.eventCountMap
        ? Object.entries(dataPoint.eventCountMap).reduce(
            (acc, [key, value]) => {
              if (value !== null && value !== undefined) {
                acc[key] = value as number | boolean | string;
              }
              return acc;
            },
            {} as Record<string, number | boolean | string>
          )
        : undefined,
    }));
  }

  const result = {
    error: response.error ?? undefined,
    errorMsg: response.errorMsg ?? undefined,
    timeSeriesDataPoints,
  };

  logger.info(
    "📊 Custom LLM report result:",
    JSON.stringify({
      hasError: !!result.error,
      dataPointsCount: timeSeriesDataPoints?.length ?? 0,
      firstDataPoint: timeSeriesDataPoints?.[0],
    })
  );

  return result;
}
