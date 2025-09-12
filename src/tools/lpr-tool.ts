import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSavedVehicles, getVehicleEvents, getVehicleLabels } from "../api/lpr-tool-api.js";
import {
  LprToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/lpr-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "lpr-tool";

const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus LPR system to retrieve information about license plate recognition events and registered license plates.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const responseType = args.requestType;

  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  switch (responseType) {
    case LprToolRequestType.GET_VEHICLE_EVENTS: {
      const { vehicleEventsArgs } = args;

      if (!vehicleEventsArgs) {
        return createToolTextContent(
          JSON.stringify({
            error: "vehicleEventsArgs is required. Please try again.",
          })
        );
      }

      const vehicleEvents = await getVehicleEvents(
        vehicleEventsArgs,
        args.timeZone,
        requestModifiers,
        sessionId
      );

      return createToolStructuredContent<OUTPUT_SCHEMA>({
        vehicleEvents,
      });
    }
    case LprToolRequestType.GET_SAVED_VEHICLES: {
      const savedVehicles = await getSavedVehicles(args.timeZone, requestModifiers, sessionId);
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        savedVehicles,
      });
    }
    case LprToolRequestType.GET_VEHICLE_LABELS: {
      const vehicleLabels = await getVehicleLabels(requestModifiers, sessionId);
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        vehicleLabels,
      });
    }
  }

  return createToolStructuredContent({
    error: "Invalid request type",
  });
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
