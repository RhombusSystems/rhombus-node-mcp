import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import {
  TOOL_ARGS,
  type ToolArgs,
  OUTPUT_SCHEMA,
  RequestType,
} from "../types/report-tool-types.js";
import {
  getOccupancyCountReport,
  getSummaryCountReport,
  getOccupancyEnabledCameras,
  getLineCrossingEnabledCameras,
  getThresholdCrossingCountReport,
  findPromptConfigurations,
  getCustomLLMReport,
  getAuditFeed,
  getDiagnosticFeed,
  getThresholdCrossingEvents,
  getCustomEventsReport,
  getPeopleCountEvents,
} from "../api/report-tool-api.js";
import { GetCountReportV2WSRequestTypesEnum } from "../types/schema-components.js";
import { DateTime } from "luxon";
import { logger } from "../logger.js";

const TOOL_NAME = "report-tool";

const TOOL_DESCRIPTION = `
**Scope:** This tool returns **aggregated counts and time-series summaries** over specified intervals and scopes. Use **events-tool** when you need raw, event-level data (individual events with timestamps). Use this tool for high-level reports, analytics, and trends—especially over periods of a day or more.

**PEOPLE type:** Not a unique person count; it is a count of people-detection events. Use for high-level occupancy or activity trends, not for deduplicated head counts.

---

**Summary and occupancy**
- **GET_SUMMARY_COUNT_REPORT:** Aggregated counts (people, faces, motion, vehicles, etc.) over time at device, location, or org scope. Interval: minutely, hourly, daily, weekly, monthly, yearly.
- **GET_OCCUPANCY_ENABLED_CAMERAS:** List of cameras with occupancy reporting enabled. Call this first; the UUID used in GET_SUMMARY_COUNT_REPORT (when scope is DEVICE) should be one of the camera UUIDs returned here.
- **GET_OCCUPANCY_COUNT_REPORT:** Occupancy count time series for a specific device over a time range.

---

**Line crossing**
- **GET_LINE_CROSSING_ENABLED_CAMERAS:** Cameras at a location with line crossing enabled, plus their configs. Call first to see which cameras support threshold crossing reports.
- **GET_THRESHOLD_CROSSING_COUNT_REPORT:** Ingress/egress counts for line crossings over time. Supports human and vehicle detection; bucket size: quarter hour, hour, day, week. Response includes computed metrics: average entries/exits per hour, hour with most entries/exits, busiest hour (with breakdown).

---

**Custom LLM events**
- **FIND_PROMPT_CONFIGURATIONS:** All custom event prompt configurations (e.g. "black dog sightings", "delivery truck arrivals"). Each has prompt text, UUID, and promptType (COUNT, PERCENT, BOOLEAN). Call first to discover available custom events.
- **GET_CUSTOM_LLM_REPORT:** Time-series for one custom event by prompt UUID. promptType from the config selects the API: COUNT (numeric counts), PERCENT (percentages), BOOLEAN (true/false). Intervals: minutely, quarter-hourly, hourly, daily, weekly, monthly. Use after FIND_PROMPT_CONFIGURATIONS to get historical data.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { requestType } = args;

  if (requestType === RequestType.GET_SUMMARY_COUNT_REPORT) {
    const { summaryCountRequest } = args;

    if (!summaryCountRequest) {
      throw new Error("summaryCountRequest is required");
    }

    const { interval, scope, types, rangeStart, rangeEnd, uuid } = summaryCountRequest;
    const report = await getSummaryCountReport(
      interval,
      scope,
      types,
      uuid ?? undefined,
      new Date(rangeEnd).getTime(),
      new Date(rangeStart).getTime(),
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId,
      args.summaryCountRequest.timeZone
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        summaryCountReport: report,
      },
    };
  }
  if (requestType === RequestType.GET_OCCUPANCY_COUNT_REPORT) {
    const { occupancyCountRequest } = args;
    if (!occupancyCountRequest) {
      throw new Error("occupancyCountRequest is required");
    }
    const { deviceUuid, rangeStart, rangeEnd, interval } = occupancyCountRequest;
    const report = await getOccupancyCountReport(
      deviceUuid,
      new Date(rangeStart).getTime(),
      new Date(rangeEnd).getTime(),
      interval,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        occupancyCountReport: report,
      },
    };
  }

  if (requestType === RequestType.GET_OCCUPANCY_ENABLED_CAMERAS) {
    const report = await getOccupancyEnabledCameras(
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        occupancyEnabledCamerasReport: report,
      },
    };
  }

  if (requestType === RequestType.GET_LINE_CROSSING_ENABLED_CAMERAS) {
    const { lineCrossingEnabledCamerasRequest } = args;
    if (!lineCrossingEnabledCamerasRequest) {
      throw new Error("lineCrossingEnabledCamerasRequest is required");
    }
    const { locationUuid } = lineCrossingEnabledCamerasRequest;
    const report = await getLineCrossingEnabledCameras(
      locationUuid,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        lineCrossingEnabledCamerasReport: report,
      },
    };
  }

  if (requestType === RequestType.GET_THRESHOLD_CROSSING_COUNT_REPORT) {
    const { thresholdCrossingCountRequest } = args;
    if (!thresholdCrossingCountRequest) {
      throw new Error("thresholdCrossingCountRequest is required");
    }
    const { deviceUuid, rangeStart, rangeEnd, bucketSize, crossingObject, dedupe } =
      thresholdCrossingCountRequest;
    const report = await getThresholdCrossingCountReport(
      deviceUuid,
      new Date(rangeStart).getTime(),
      new Date(rangeEnd).getTime(),
      bucketSize,
      crossingObject,
      dedupe,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        thresholdCrossingCountReport: report,
      },
    };
  }

  if (requestType === RequestType.FIND_PROMPT_CONFIGURATIONS) {
    const report = await findPromptConfigurations(
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        promptConfigurationsReport: report,
      },
    };
  }

  if (requestType === RequestType.GET_CUSTOM_LLM_REPORT) {
    const { customLLMReportRequest } = args;
    if (!customLLMReportRequest) {
      throw new Error("customLLMReportRequest is required");
    }
    const { promptUuid, promptType, rangeStart, rangeEnd, interval } = customLLMReportRequest;
    const report = await getCustomLLMReport(
      promptUuid,
      promptType,
      new Date(rangeStart).getTime(),
      new Date(rangeEnd).getTime(),
      interval,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );

    // Log the report data to help debug
    logger.log(
      "📊 Custom LLM Report Tool Response:",
      JSON.stringify({
        promptType,
        hasError: report?.error,
        dataPointsCount: report?.timeSeriesDataPoints?.length,
        firstDataPoint: report?.timeSeriesDataPoints?.[0],
      })
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(report),
        },
      ],
      structuredContent: {
        customLLMReport: report,
      },
    };
  }

  if (requestType === RequestType.GET_AUDIT_FEED) {
    const { auditFeedRequest } = args;
    if (!auditFeedRequest) {
      throw new Error("auditFeedRequest is required");
    }
    const report = await getAuditFeed(
      new Date(auditFeedRequest.startTime).getTime(),
      new Date(auditFeedRequest.endTime).getTime(),
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(report) }],
      structuredContent: { auditFeedReport: report },
    };
  }

  if (requestType === RequestType.GET_DIAGNOSTIC_FEED) {
    const { diagnosticFeedRequest } = args;
    if (!diagnosticFeedRequest) {
      throw new Error("diagnosticFeedRequest is required");
    }
    const report = await getDiagnosticFeed(
      new Date(diagnosticFeedRequest.startTime).getTime(),
      new Date(diagnosticFeedRequest.endTime).getTime(),
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(report) }],
      structuredContent: { diagnosticFeedReport: report },
    };
  }

  if (requestType === RequestType.GET_THRESHOLD_CROSSING_EVENTS) {
    const { thresholdCrossingEventsRequest } = args;
    if (!thresholdCrossingEventsRequest) {
      throw new Error("thresholdCrossingEventsRequest is required");
    }
    const report = await getThresholdCrossingEvents(
      thresholdCrossingEventsRequest.deviceUuid,
      new Date(thresholdCrossingEventsRequest.startTime).getTime(),
      new Date(thresholdCrossingEventsRequest.endTime).getTime(),
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(report) }],
      structuredContent: { thresholdCrossingEventsReport: report },
    };
  }

  if (requestType === RequestType.GET_CUSTOM_EVENTS_REPORT) {
    const { customEventsReportRequest } = args;
    if (!customEventsReportRequest) {
      throw new Error("customEventsReportRequest is required");
    }
    const report = await getCustomEventsReport(
      customEventsReportRequest.promptUuid,
      new Date(customEventsReportRequest.startTime).getTime(),
      new Date(customEventsReportRequest.endTime).getTime(),
      customEventsReportRequest.interval,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(report) }],
      structuredContent: { customEventsReport: report },
    };
  }

  if (requestType === RequestType.GET_PEOPLE_COUNT_EVENTS) {
    const { peopleCountEventsRequest } = args;
    if (!peopleCountEventsRequest) {
      throw new Error("peopleCountEventsRequest is required");
    }
    const report = await getPeopleCountEvents(
      peopleCountEventsRequest.deviceUuids,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(report) }],
      structuredContent: { peopleCountEventsReport: report },
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: "",
      },
    ],
    structuredContent: {
      error: true,
      errorMsg: "Error while fetching report information",
    },
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS.shape,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
