import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_ARGS, type ToolArgs } from "../types/time-conversion-tool-types.js";

const TOOL_NAME = "time-conversion-tool";
const TOOL_DESCRIPTION =
  "This tool is capable of converting to and from epoch and ISO 8601 timestamps. Use this tool when you have one time format and need to convert to the other format. The tool will automatically detect the input format and convert to the other format.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { time_to_convert } = args;
  if (typeof time_to_convert === "string") {
      // Input is ISO 8601, convert to epoch
      const date = new Date(time_to_convert);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ epoch: date.getTime() }),
        },
      ],
    };
  } else if (typeof time_to_convert === "number") {
      // Input is epoch, convert to ISO 8601
      const date = new Date(time_to_convert);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ iso: date.toISOString() }),
          },
        ],
      };
  } else {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ error: "Invalid input type for time_to_convert" }),
        },
      ],
    };
  }
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
