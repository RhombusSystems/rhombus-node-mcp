import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  searchLicensePlates,
  searchObjectsByColor,
  searchObjectsByText,
  searchMotionGrid,
} from "../api/search-tool-api.js";
import {
  SearchToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/search-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "search-tool";

const TOOL_DESCRIPTION = `
This tool performs visual and data searches across Rhombus camera footage and events.

It has the following modes of operation, determined by the "requestType" parameter:
- ${SearchToolRequestType.LICENSE_PLATE}: Search for license plate sightings by plate number. Requires query (the plate number or partial match).
- ${SearchToolRequestType.OBJECT_BY_COLOR}: Search for objects by color in camera footage. Requires query (color name) and cameraUuid.
- ${SearchToolRequestType.OBJECT_BY_TEXT}: Semantic search for objects in footage using a text description. Requires query (text description).
- ${SearchToolRequestType.MOTION_SEARCH}: Search for motion events in a camera's field of view. Requires cameraUuid, startTime, and endTime.

All search types support optional startTime and endTime to narrow the search window.
Use the get-entity-tool with entityType CAMERA to get camera UUIDs.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const startTimeMs = args.startTime ? new Date(args.startTime).getTime() : undefined;
    const endTimeMs = args.endTime ? new Date(args.endTime).getTime() : undefined;

    switch (args.requestType) {
      case SearchToolRequestType.LICENSE_PLATE: {
        if (!args.query) {
          return createToolTextContent(
            JSON.stringify({ error: "query is required for license-plate search." })
          );
        }
        const licensePlateResults = await searchLicensePlates(
          args.query, startTimeMs, endTimeMs, args.deviceUuids, args.locationUuids,
          requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ licensePlateResults });
      }
      case SearchToolRequestType.OBJECT_BY_COLOR: {
        if (!args.query || !args.cameraUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "query and cameraUuid are required for object-by-color search." })
          );
        }
        const objectColorResults = await searchObjectsByColor(
          args.query, args.cameraUuid, startTimeMs, endTimeMs,
          requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ objectColorResults });
      }
      case SearchToolRequestType.OBJECT_BY_TEXT: {
        if (!args.query) {
          return createToolTextContent(
            JSON.stringify({ error: "query is required for object-by-text search." })
          );
        }
        const objectTextResults = await searchObjectsByText(
          args.query, startTimeMs, endTimeMs, args.deviceUuids,
          requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ objectTextResults });
      }
      case SearchToolRequestType.MOTION_SEARCH: {
        if (!args.cameraUuid || !startTimeMs || !endTimeMs) {
          return createToolTextContent(
            JSON.stringify({ error: "cameraUuid, startTime, and endTime are required for motion-search." })
          );
        }
        const motionResults = await searchMotionGrid(
          args.cameraUuid, startTimeMs, endTimeMs, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ motionResults });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent({ error: "Invalid request type" });
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
