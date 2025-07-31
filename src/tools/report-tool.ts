import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS, type ToolArgs, OUTPUT_SCHEMA } from "../types/report-tool-types.js";
import { getSummaryCountReport } from "../api/report-tool-api.js";

const TOOL_NAME = "report_tool";

const TOOL_DESCRIPTION = `This tool generates summary count reports for various types of data within the Rhombus system. It provides aggregated counts over specified time intervals and scopes. This tool should be used when users need high level summary reports, analytics, or aggregated counts of system events and activities. If types contains PEOPLE please understand that this is not a unique person count, it is a count of people detection events.  It's useful for getting a high level count of people, but not for getting a unique person count.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { interval, scope, types, startTimeMs, endTimeMs, uuid } = args;

  const report = await getSummaryCountReport(
    interval,
    scope,
    types,
    uuid ?? undefined,
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
    structuredContent: report,
  };
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
