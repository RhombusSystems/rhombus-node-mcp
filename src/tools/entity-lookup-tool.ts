import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllEntities } from "../api/entity-lookup-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/entity-lookup-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "entity-lookup-tool";

const TOOL_DESCRIPTION = `
Retrieves specific entities (or devices) by their UUIDs, including license and feature details.
Use this tool ONLY when you already have exact device UUIDs (e.g. from get-entity-tool, get-org-information, or an earlier tool result).

To look up a device by NAME, do NOT use this tool — use get-entity-tool with a filterBy name predicate instead. NEVER invent or guess placeholder UUIDs; an unknown UUID matches nothing and returns empty results.

Pass deviceUuids: null to return ALL entities of every type (no UUID filter) and narrow with filterBy/includeFields — note that license/feature details are only included when explicit UUIDs are provided.
The return structure is a JSON object that contains the states of the requested entities.
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
      title: "Entity Lookup",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
