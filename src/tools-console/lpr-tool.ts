import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSavedVehicles, getVehicleEvents, getVehicleLabels, searchLicensePlates, saveVehicle } from "../api/lpr-tool-api.js";
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
Rhombus LPR (license plate recognition): plate/vehicle events, saved vehicles, vehicle labels, and org-wide plate search. Users say "vehicle", "car" and "license plate" interchangeably — all route here.

**Vs events-tool (camera):** events-tool with eventType camera returns that camera's VOD timeline seekpoints (which include vehicle activity). lpr-tool is the LPR product surface — the plate registry, labeling, and org-wide LPR queries. Use lpr-tool when the user needs plates/vehicles as entities, not just "what showed up on this camera's timeline".

Modes via "requestType": ${LprToolRequestType.GET_VEHICLE_EVENTS}, ${LprToolRequestType.GET_SAVED_VEHICLES}, ${LprToolRequestType.GET_VEHICLE_LABELS} (plus plate search / save-vehicle) — usage details, label workflow and defaults are documented on the parameters.
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

        return createToolStructuredContent<OUTPUT_SCHEMA>({ vehicleEvents });
      }
      case LprToolRequestType.GET_SAVED_VEHICLES: {
        const savedVehicles = await getSavedVehicles(args.timeZone, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ savedVehicles });
      }
      case LprToolRequestType.GET_VEHICLE_LABELS: {
        const vehicleLabels = await getVehicleLabels(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ vehicleLabels });
      }
      case LprToolRequestType.SEARCH_LICENSE_PLATES: {
        if (!args.licensePlateQuery) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "licensePlateQuery is required for search-license-plates.",
          });
        }
        const results = await searchLicensePlates(args.licensePlateQuery, args.timeZone, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ licensePlateSearchResults: results });
      }
      case LprToolRequestType.SAVE_VEHICLE: {
        if (!args.vehicleName || !args.vehicleLicensePlate) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "vehicleName and vehicleLicensePlate are required for save-vehicle.",
          });
        }
        const result = await saveVehicle(args.vehicleName, args.vehicleLicensePlate, args.vehicleDescription ?? undefined, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ saveVehicleResult: result });
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
      title: "License Plate Recognition",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    TOOL_HANDLER
  );
}
