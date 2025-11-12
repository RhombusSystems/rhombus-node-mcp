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
} from "../api/report-tool-api.js";
import { GetCountReportV2WSRequestTypesEnum } from "../types/schema-components.js";
import { DateTime } from "luxon";
import { logger } from "../logger.js";

const TOOL_NAME = "report-tool";

const TOOL_DESCRIPTION = `
This tool generates summary count reports for various types of data within the Rhombus system.
It provides aggregated counts over specified time intervals and scopes.
This tool should be used when users need high level summary reports, analytics, or aggregated counts of system events and activities.
If types contains PEOPLE please understand that this is not a unique person count, it is a count of people detection events. 
It's useful for getting a high level count of people, but not for getting a unique person count.

This tool can also retrieve a list of cameras that have occupancy reporting enabled, which is useful as a first step
before running GET_SUMMARY_COUNT_REPORT since the uuid pulled from summaryCountRequest should always be present on
the list returned from getOccupancyEnabledCameras.

Additionally, this tool supports line crossing analytics:
- GET_LINE_CROSSING_ENABLED_CAMERAS: Retrieves cameras at a location that have line crossing enabled, along with their configurations.
  This should be called first to identify which cameras can be used for threshold crossing reports.
- GET_THRESHOLD_CROSSING_COUNT_REPORT: Generates reports showing ingress and egress counts for line crossings over time.
  Automatically calculates key metrics including:
  • Average entries per hour
  • Average exits per hour
  • Hour with most entries (with timestamp and count)
  • Hour with most exits (with timestamp and count)
  • Busiest hour overall (total activity with breakdown)
  Supports human and vehicle crossing detection with configurable time buckets (quarter hour, hour, day, week).

The tool also supports custom user-defined event reporting:
- FIND_PROMPT_CONFIGURATIONS: Retrieves all custom event prompt configurations. This should be called first to discover
  what custom events are available for reporting (e.g., "black dog sightings", "delivery truck arrivals", etc.).
  Each configuration includes the prompt text, UUID, and promptType (COUNT, PERCENT, or BOOLEAN) needed for generating reports.
- GET_CUSTOM_LLM_REPORT: Generates time series reports for a specific custom event using the prompt UUID.
  The promptType field from the configuration determines which API endpoint is used:
  • COUNT: Returns numeric counts (e.g., "3 black dogs detected")
  • PERCENT: Returns percentage values (e.g., "75% occupancy")
  • BOOLEAN: Returns true/false values (e.g., "parking lot full: true")
  Returns aggregated data over specified time intervals (minutely, quarter-hourly, hourly, daily, weekly, monthly).
  Use this after finding the appropriate prompt configuration to get historical data for custom events.
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
