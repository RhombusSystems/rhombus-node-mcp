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
} from "../api/report-tool-api.js";
import { GetCountReportV2WSRequestTypesEnum } from "../types/schema-components.js";
import { DateTime } from "luxon";

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
  Useful for analyzing entry/exit patterns, calculating averages per hour, identifying peak hours, and understanding traffic flow.
  Supports human and vehicle crossing detection with configurable time buckets (quarter hour, hour, day, week).
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
