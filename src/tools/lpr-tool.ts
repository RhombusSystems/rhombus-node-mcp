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

The system's cameras may have LPR enabled, and when it is enabled, it will detect "license plate recognition" events when it sees a license plate
come into view. However, it is possible that the recognized license is only a partial match, so keep that in mind when using this tool.
Users will be able to save license plates into the system, and then additionally label them with a name.

This tool has 3 modes of operation, determined by the "requestType" parameter:
- ${LprToolRequestType.GET_VEHICLE_EVENTS}: Retrieves a list of vehicle events that have been detected by the system. Please keep in mind that this has the *potential*
  to return a lot of data. However, 7 days should be a reasonable time range to start from if the user is not specific.
- ${LprToolRequestType.GET_SAVED_VEHICLES}: Retrieves a list of saved vehicles that have been saved in the organization.
- ${LprToolRequestType.GET_VEHICLE_LABELS}: Retrieves a list of vehicle labels that have been saved in the organization.

Its very likely that "vehicle", "car", and "license plates" are used interchangeably. Please keep this in mind.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const responseType = args.requestType;

  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
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
