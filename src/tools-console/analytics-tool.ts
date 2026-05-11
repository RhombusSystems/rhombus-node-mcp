import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getCountReportsForDevicesAtLocation,
  getRunningAverage,
  getLineCrossingEnabledCameras,
  getBatchThresholdCrossingCountReport,
  getSummaryCountReport,
  triggerScenePrompt,
} from "../api/report-tool-api.js";
import {
  AnalyticsRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/analytics-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";
import { postApi } from "../network/network.js";
import { DateTime } from "luxon";

const TOOL_NAME = "analytics-tool";

const TOOL_DESCRIPTION = `
This tool generates composite operational analytics reports by combining multiple data sources.
Use it for high-level business questions about space utilization, traffic patterns, and real-time scene analysis.

It has the following modes of operation, determined by the "requestType" parameter:
- ${AnalyticsRequestType.SPACE_UTILIZATION}: Compare per-camera people counts against running averages at a location. Answers: "How busy is each area vs normal?"
- ${AnalyticsRequestType.TRAFFIC_FLOW}: Compare ingress/egress across ALL line-crossing cameras at a location. Answers: "Which entrance gets the most traffic?"
- ${AnalyticsRequestType.PEAK_VS_AVERAGE}: Show hourly actual counts vs historical averages. Answers: "When is it busiest? Is today above or below normal?"
- ${AnalyticsRequestType.SCENE_INTELLIGENCE}: Ask a camera an arbitrary question using AI vision (e.g. "How many treadmills are in use?"). Works in real-time or at a historical timestamp.
- ${AnalyticsRequestType.LOCATION_SUMMARY}: Generate a comprehensive multi-metric analytics summary for a location including people counts, traffic flow, and trend comparisons.
`;

async function handleSpaceUtilization(
  args: ToolArgs,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<OUTPUT_SCHEMA> {
  const req = args.spaceUtilizationRequest;
  if (!req) return { error: "spaceUtilizationRequest is required." };

  const [deviceDataMap, averageData, camerasRes] = await Promise.all([
    getCountReportsForDevicesAtLocation(
      req.locationUuid,
      req.startTimeMs,
      req.endTimeMs,
      req.interval,
      "PEOPLE",
      requestModifiers,
      sessionId
    ),
    getRunningAverage(
      req.locationUuid,
      req.startTimeMs,
      req.endTimeMs,
      req.interval,
      "LOCATION",
      undefined,
      requestModifiers,
      sessionId
    ).catch(() => []),
    getCameraNameMap(req.locationUuid, requestModifiers, sessionId),
  ]);

  const cameras: {
    cameraUuid: string;
    cameraName?: string;
    totalCount: number;
    averageCount?: number;
    deltaPercent?: number;
  }[] = [];

  let overallTotal = 0;

  for (const [deviceUuid, dataPoints] of Object.entries(deviceDataMap)) {
    let total = 0;
    for (const dp of dataPoints) {
      const counts = dp.eventCountMap ?? {};
      for (const val of Object.values(counts)) {
        if (typeof val === "number") total += val;
      }
    }
    overallTotal += total;

    cameras.push({
      cameraUuid: deviceUuid,
      cameraName: camerasRes[deviceUuid] ?? deviceUuid,
      totalCount: total,
    });
  }

  if (averageData.length > 0) {
    let totalAvg = 0;
    let avgCount = 0;
    for (const dp of averageData) {
      if (dp.stats) {
        for (const stat of Object.values(dp.stats) as any[]) {
          if (stat?.avg != null) {
            totalAvg += stat.avg;
            avgCount++;
          }
        }
      }
    }
    const overallAvg = avgCount > 0 ? totalAvg / avgCount : 0;

    for (const cam of cameras) {
      const camAvg = overallAvg > 0 ? (overallAvg * cam.totalCount) / (overallTotal || 1) : undefined;
      cam.averageCount = camAvg != null ? Math.round(camAvg * 100) / 100 : undefined;
      if (cam.averageCount && cam.averageCount > 0) {
        cam.deltaPercent = Math.round(((cam.totalCount - cam.averageCount) / cam.averageCount) * 10000) / 100;
      }
    }
  }

  cameras.sort((a, b) => b.totalCount - a.totalCount);

  return {
    spaceUtilization: {
      locationUuid: req.locationUuid,
      cameras,
      summary: {
        totalPeopleCount: overallTotal,
        busiestCamera: cameras[0]?.cameraName,
        quietestCamera: cameras[cameras.length - 1]?.cameraName,
      },
    },
  };
}

async function handleTrafficFlow(
  args: ToolArgs,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<OUTPUT_SCHEMA> {
  const req = args.trafficFlowRequest;
  if (!req) return { error: "trafficFlowRequest is required." };

  const lcCameras = await getLineCrossingEnabledCameras(
    req.locationUuid,
    requestModifiers,
    sessionId
  );

  const configMap = lcCameras?.camerasToConfigs ?? {};
  const deviceUuids = Object.keys(configMap);

  if (deviceUuids.length === 0) {
    return { error: "No line-crossing enabled cameras found at this location." };
  }

  const [batchData, cameraNames] = await Promise.all([
    getBatchThresholdCrossingCountReport(
      deviceUuids,
      req.startTimeMs,
      req.endTimeMs,
      req.bucketSize,
      req.crossingObject,
      true,
      undefined,
      requestModifiers,
      sessionId
    ),
    getCameraNameMap(req.locationUuid, requestModifiers, sessionId),
  ]);

  const cameras: {
    cameraUuid: string;
    cameraName?: string;
    totalIngress: number;
    totalEgress: number;
    totalTraffic: number;
    peakHour?: string;
    peakHourTraffic?: number;
  }[] = [];

  let grandIngress = 0;
  let grandEgress = 0;

  for (const deviceUuid of deviceUuids) {
    const counts = batchData[deviceUuid] ?? [];
    let totalIngress = 0;
    let totalEgress = 0;
    let peakTraffic = 0;
    let peakTimestamp: number | undefined;

    for (const c of counts) {
      const ing = c.ingressCount ?? 0;
      const eg = c.egressCount ?? 0;
      totalIngress += ing;
      totalEgress += eg;
      const total = ing + eg;
      if (total > peakTraffic) {
        peakTraffic = total;
        peakTimestamp = c.timestampMs;
      }
    }

    grandIngress += totalIngress;
    grandEgress += totalEgress;

    cameras.push({
      cameraUuid: deviceUuid,
      cameraName: cameraNames[deviceUuid] ?? deviceUuid,
      totalIngress,
      totalEgress,
      totalTraffic: totalIngress + totalEgress,
      peakHour: peakTimestamp
        ? DateTime.fromMillis(peakTimestamp).toFormat("h:mm a, MMM d")
        : undefined,
      peakHourTraffic: peakTraffic > 0 ? peakTraffic : undefined,
    });
  }

  cameras.sort((a, b) => b.totalTraffic - a.totalTraffic);

  return {
    trafficFlow: {
      locationUuid: req.locationUuid,
      cameras,
      summary: {
        totalIngress: grandIngress,
        totalEgress: grandEgress,
        totalTraffic: grandIngress + grandEgress,
        busiestEntrance: cameras[0]?.cameraName,
        busiestEntranceTraffic: cameras[0]?.totalTraffic,
      },
    },
  };
}

async function handlePeakVsAverage(
  args: ToolArgs,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<OUTPUT_SCHEMA> {
  const req = args.peakVsAverageRequest;
  if (!req) return { error: "peakVsAverageRequest is required." };

  const [actualReport, averageData] = await Promise.all([
    getSummaryCountReport(
      "HOURLY",
      req.scope as any,
      ["PEOPLE"],
      req.uuid ?? undefined,
      req.endTimeMs,
      req.startTimeMs,
      requestModifiers,
      sessionId,
      req.timeZone ?? undefined
    ),
    getRunningAverage(
      req.uuid ?? undefined,
      req.startTimeMs,
      req.endTimeMs,
      "HOURLY",
      req.scope as any,
      req.timeZone ?? undefined,
      requestModifiers,
      sessionId
    ).catch(() => []),
  ]);

  const avgByHour: Record<string, number> = {};
  for (const dp of averageData) {
    if (dp.date && dp.stats) {
      for (const stat of Object.values(dp.stats) as any[]) {
        if (stat?.avg != null) {
          const hourKey = DateTime.fromISO(dp.date).toFormat("h a");
          avgByHour[hourKey] = (avgByHour[hourKey] ?? 0) + stat.avg;
        }
      }
    }
  }

  const hourlyComparison: {
    hour: string;
    actualCount: number;
    averageCount?: number;
    deltaPercent?: number;
  }[] = [];

  const dataPoints = actualReport?.timeSeriesDataPoints ?? [];

  for (const dp of dataPoints) {
    const dateStr = dp.dateUtcString;
    if (!dateStr) continue;

    let count = 0;
    if (dp.eventCountMap) {
      for (const val of Object.values(dp.eventCountMap)) {
        if (typeof val === "number") count += val;
      }
    }

    const hourLabel = DateTime.fromISO(dateStr).toFormat("h a");
    const avg = avgByHour[hourLabel];

    hourlyComparison.push({
      hour: hourLabel,
      actualCount: count,
      averageCount: avg != null ? Math.round(avg * 100) / 100 : undefined,
      deltaPercent:
        avg != null && avg > 0
          ? Math.round(((count - avg) / avg) * 10000) / 100
          : undefined,
    });
  }

  let peakHour: string | undefined;
  let peakCount = -1;
  let quietHour: string | undefined;
  let quietCount = Infinity;

  for (const h of hourlyComparison) {
    if (h.actualCount > peakCount) {
      peakCount = h.actualCount;
      peakHour = h.hour;
    }
    if (h.actualCount < quietCount) {
      quietCount = h.actualCount;
      quietHour = h.hour;
    }
  }

  const totalActual = hourlyComparison.reduce((s, h) => s + h.actualCount, 0);
  const totalAvg = hourlyComparison.reduce((s, h) => s + (h.averageCount ?? 0), 0);
  const overallDelta =
    totalAvg > 0
      ? Math.round(((totalActual - totalAvg) / totalAvg) * 10000) / 100
      : undefined;

  return {
    peakVsAverage: {
      hourlyComparison,
      summary: {
        peakHour,
        peakHourCount: peakCount >= 0 ? peakCount : undefined,
        quietestHour: quietHour,
        quietestHourCount: quietCount < Infinity ? quietCount : undefined,
        overallAverageDelta: overallDelta,
      },
    },
  };
}

async function handleSceneIntelligence(
  args: ToolArgs,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<OUTPUT_SCHEMA> {
  const req = args.sceneIntelligenceRequest;
  if (!req) return { error: "sceneIntelligenceRequest is required." };

  const result = await triggerScenePrompt(
    req.deviceFacetUuid,
    req.prompt,
    req.promptType,
    req.timestampMs ?? undefined,
    requestModifiers,
    sessionId
  );

  return {
    sceneIntelligence: {
      value: result.value,
      prompt: result.prompt,
      timestampMs: result.timestampMs,
      checkCondition: result.checkCondition,
    },
  };
}

async function handleLocationSummary(
  args: ToolArgs,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<OUTPUT_SCHEMA> {
  const req = args.locationSummaryRequest;
  if (!req) return { error: "locationSummaryRequest is required." };

  const [deviceDataMap, averageData, lcCameras, cameraNames] = await Promise.all([
    getCountReportsForDevicesAtLocation(
      req.locationUuid,
      req.startTimeMs,
      req.endTimeMs,
      "HOURLY",
      "PEOPLE",
      requestModifiers,
      sessionId
    ).catch(() => ({}) as Record<string, any[]>),
    getRunningAverage(
      req.locationUuid,
      req.startTimeMs,
      req.endTimeMs,
      "HOURLY",
      "LOCATION",
      undefined,
      requestModifiers,
      sessionId
    ).catch(() => []),
    getLineCrossingEnabledCameras(req.locationUuid, requestModifiers, sessionId).catch(
      () => ({ camerasToConfigs: {} } as any)
    ),
    getCameraNameMap(req.locationUuid, requestModifiers, sessionId),
  ]);

  let totalPeople = 0;
  const hourlyTotals: Record<string, number> = {};

  for (const [, dataPoints] of Object.entries(deviceDataMap)) {
    for (const dp of dataPoints as any[]) {
      const counts = dp.eventCountMap ?? {};
      let dpTotal = 0;
      for (const val of Object.values(counts)) {
        if (typeof val === "number") dpTotal += val;
      }
      totalPeople += dpTotal;
      const hour = dp.dateUtcString ? DateTime.fromISO(dp.dateUtcString).toFormat("h a") : "unknown";
      hourlyTotals[hour] = (hourlyTotals[hour] ?? 0) + dpTotal;
    }
  }

  let peakHour: string | undefined;
  let peakCount = -1;
  for (const [hour, count] of Object.entries(hourlyTotals)) {
    if (count > peakCount) {
      peakCount = count;
      peakHour = hour;
    }
  }

  const periodHours = Math.max(1, (req.endTimeMs - req.startTimeMs) / (1000 * 60 * 60));
  const avgPerHour = Math.round((totalPeople / periodHours) * 100) / 100;

  let trafficFlow: { totalIngress?: number; totalEgress?: number; busiestEntrance?: string } | undefined = undefined;
  const lcDeviceUuids = Object.keys(lcCameras.camerasToConfigs ?? {});

  if (lcDeviceUuids.length > 0) {
    try {
      const batchData = await getBatchThresholdCrossingCountReport(
        lcDeviceUuids,
        req.startTimeMs,
        req.endTimeMs,
        "HOUR",
        "HUMAN",
        true,
        undefined,
        requestModifiers,
        sessionId
      );

      let totalIngress = 0;
      let totalEgress = 0;
      let busiestEntrance: string | undefined;
      let busiestTraffic = 0;

      for (const deviceUuid of lcDeviceUuids) {
        const counts = batchData[deviceUuid] ?? [];
        let devIngress = 0;
        let devEgress = 0;
        for (const c of counts) {
          devIngress += c.ingressCount ?? 0;
          devEgress += c.egressCount ?? 0;
        }
        totalIngress += devIngress;
        totalEgress += devEgress;
        const devTotal = devIngress + devEgress;
        if (devTotal > busiestTraffic) {
          busiestTraffic = devTotal;
          busiestEntrance = cameraNames[deviceUuid] ?? deviceUuid;
        }
      }

      trafficFlow = { totalIngress, totalEgress, busiestEntrance };
    } catch {
      // traffic flow data unavailable
    }
  }

  let totalAvg = 0;
  let avgPoints = 0;
  for (const dp of averageData) {
    if (dp.stats) {
      for (const stat of Object.values(dp.stats) as any[]) {
        if (stat?.avg != null) {
          totalAvg += stat.avg;
          avgPoints++;
        }
      }
    }
  }
  const overallAvg = avgPoints > 0 ? totalAvg : 0;
  const overallDelta =
    overallAvg > 0
      ? Math.round(((totalPeople - overallAvg) / overallAvg) * 10000) / 100
      : undefined;

  return {
    locationSummary: {
      locationUuid: req.locationUuid,
      peopleCounts: {
        totalPeople,
        averagePerHour: avgPerHour,
        peakHour,
        peakCount: peakCount >= 0 ? peakCount : undefined,
      },
      trafficFlow,
      comparison: overallDelta != null
        ? {
            overallDeltaPercent: overallDelta,
            trend: overallDelta > 0 ? "busier" : overallDelta < 0 ? "quieter" : "normal",
          }
        : undefined,
    },
  };
}

async function getCameraNameMap(
  locationUuid: string,
  requestModifiers: any,
  sessionId: string | undefined
): Promise<Record<string, string>> {
  try {
    const res = await postApi<any>({
      route: "/camera/getMinimalCameraStateList",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    });
    const map: Record<string, string> = {};
    for (const cam of res.cameraStates ?? []) {
      if (cam.locationUuid === locationUuid && cam.uuid && cam.name) {
        map[cam.uuid] = cam.name;
      }
    }
    return map;
  } catch {
    return {};
  }
}

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case AnalyticsRequestType.SPACE_UTILIZATION:
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          await handleSpaceUtilization(args, requestModifiers, sessionId)
        );
      case AnalyticsRequestType.TRAFFIC_FLOW:
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          await handleTrafficFlow(args, requestModifiers, sessionId)
        );
      case AnalyticsRequestType.PEAK_VS_AVERAGE:
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          await handlePeakVsAverage(args, requestModifiers, sessionId)
        );
      case AnalyticsRequestType.SCENE_INTELLIGENCE:
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          await handleSceneIntelligence(args, requestModifiers, sessionId)
        );
      case AnalyticsRequestType.LOCATION_SUMMARY:
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          await handleLocationSummary(args, requestModifiers, sessionId)
        );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
