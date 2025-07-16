import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS, type ToolArgs } from "../types/report-tool-types.js";
import { getSummaryCountReport } from "../api/report-tool-api.js";

const TOOL_NAME = "report_tool";

const TOOL_DESCRIPTION = `
This tool generates summary count reports for various types of data within the Rhombus system. It provides aggregated counts over specified time intervals and scopes.

The tool takes the following parameters:

* **interval (string):** The time interval for report aggregation. Must be one of:
  - "MINUTELY" - Aggregate data by minute
  - "HOURLY" - Aggregate data by hour  
  - "DAILY" - Aggregate data by day
  - "WEEKLY" - Aggregate data by week
  - "MONTHLY" - Aggregate data by month
  - "YEARLY" - Aggregate data by year

* **scope (string):** The scope level for the report data. Must be one of:
  - "REGION" - Regional scope
  - "LOCATION" - Location-based scope
  - "DEVICE" - Device-level scope
  - "ORG" - Organization-wide scope

* **type (string):** The type of data to include in the summary count report. Must be one of:
  - "CROWD" - Crowd detection events
  - "PEOPLE" - People detection events
  - "FACES" - Face detection events
  - "MOTION" - Motion detection events
  - "BANDWIDTH" - Bandwidth usage data
  - "VEHICLES" - Vehicle detection events
  - "LICENSEPLATES" - License plate detection events
  - "ALERTS" - Alert events
  - "AM_VERIFICATION" - Access management verification events
  - "DWELL" - Dwell time analysis

* **startTimeMs (number):** A timestamp in milliseconds representing the start time of the report period.

* **endTimeMs (number):** A timestamp in milliseconds representing the end time of the report period.

The tool returns a JSON object containing the aggregated count data for the specified parameters and time range.

This tool should be used when users need summary reports, analytics, or aggregated counts of system events and activities.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { interval, scope, type, startTimeMs, endTimeMs } = args;

  const report = await getSummaryCountReport(
    interval,
    scope,
    type,
    endTimeMs,
    startTimeMs,
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
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
