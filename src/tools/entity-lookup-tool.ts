import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllEntities } from "../api/entity-lookup-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/entity-lookup-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "entity-lookup-tool";

const TOOL_DESCRIPTION = `
Retrieves specific entities (or devices) by their UUIDs.
Takes a list of device UUIDs and returns the device information for those specific devices. 
Use this tool when the user asks for details on devices' states and details about their licenses and features.
The return structure is a JSON object that contains the states of the requested entities.
This data is exact. Only devices with matching UUIDs will be returned.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { deviceUuids, timeZone, tempUnit } = args;
  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  try {
    const result = await getAllEntities(
      deviceUuids,
      timeZone,
      tempUnit,
      requestModifiers,
      sessionId
    );

    return createToolStructuredContent<OUTPUT_SCHEMA>(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        error: error.message,
      });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({
      error: "Unknown error",
    });
  }
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
