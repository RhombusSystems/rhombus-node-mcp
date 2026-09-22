import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  addVehicleLabel,
  deleteVehicle,
  findSavedVehicle,
  getSavedVehicles,
  getVehicleEvents,
  getVehicleLabels,
  removeVehicleLabel,
  saveVehicle,
  searchLicensePlates,
} from "../api/lpr-tool-api.js";
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

Modes via "requestType": ${LprToolRequestType.GET_VEHICLE_EVENTS}, ${LprToolRequestType.GET_SAVED_VEHICLES}, ${LprToolRequestType.GET_VEHICLE_LABELS}, ${LprToolRequestType.SEARCH_LICENSE_PLATES}, ${LprToolRequestType.SAVE_VEHICLE}, ${LprToolRequestType.UPDATE_VEHICLE}, ${LprToolRequestType.DELETE_VEHICLE}, ${LprToolRequestType.ADD_VEHICLE_LABEL}, ${LprToolRequestType.REMOVE_VEHICLE_LABEL} — usage details, label workflow and defaults are documented on the parameters.

A saved vehicle is identified by its PLATE, not a UUID, and the plate itself cannot be edited: correcting a mistyped plate means delete-vehicle then save-vehicle. Deleting a saved vehicle does not delete its past detection events.
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
        // The plate is the key, so saving one that already exists overwrites it.
        // Say which happened rather than reporting a create either way.
        const existing = await findSavedVehicle(
          args.vehicleLicensePlate,
          requestModifiers,
          sessionId
        );
        const result = await saveVehicle(args.vehicleName, args.vehicleLicensePlate, args.vehicleDescription ?? undefined, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          saveVehicleResult: { success: result.success, licensePlate: result.licensePlate },
          warningMsg: result.warningMsg,
          note: existing
            ? `Plate ${args.vehicleLicensePlate} was already saved as "${existing.name ?? "unnamed"}" and has been OVERWRITTEN with the new name and description, not added a second time.`
            : undefined,
        });
      }
      case LprToolRequestType.UPDATE_VEHICLE: {
        if (!args.vehicleLicensePlate) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "vehicleLicensePlate is required for update-vehicle.",
          });
        }
        if (!args.vehicleName?.trim() && !args.vehicleDescription?.trim()) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error:
              "update-vehicle needs at least one of vehicleName or vehicleDescription — both were empty, so there is nothing to change.",
          });
        }
        const existing = await findSavedVehicle(
          args.vehicleLicensePlate,
          requestModifiers,
          sessionId
        );
        if (!existing) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `No saved vehicle has the plate ${args.vehicleLicensePlate}. Use get-saved-vehicles to see the plates that are saved. To save a new one, use save-vehicle.`,
          });
        }
        // saveVehicle is a whole-record write keyed on the plate, so resend the
        // fields the caller did not change.
        const result = await saveVehicle(
          args.vehicleName?.trim() || existing.name || "",
          args.vehicleLicensePlate,
          args.vehicleDescription?.trim() || existing.description || undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          saveVehicleResult: { success: result.success, licensePlate: result.licensePlate },
          warningMsg: result.warningMsg,
          note: `Updated the saved vehicle for plate ${args.vehicleLicensePlate}. Fields you did not pass were left as they were. The plate itself cannot be changed — delete and re-save to correct one.`,
        });
      }
      case LprToolRequestType.DELETE_VEHICLE: {
        if (!args.vehicleLicensePlate) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "vehicleLicensePlate is required for delete-vehicle.",
          });
        }
        const existing = await findSavedVehicle(
          args.vehicleLicensePlate,
          requestModifiers,
          sessionId
        );
        if (!existing) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `No saved vehicle has the plate ${args.vehicleLicensePlate}, so there is nothing to delete. Use get-saved-vehicles to see the plates that are saved.`,
          });
        }
        const result = await deleteVehicle(
          args.vehicleLicensePlate,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleteVehicleResult: { success: result.success, licensePlate: result.licensePlate },
          warningMsg: result.warningMsg,
          note: `Removed "${existing.name ?? "unnamed"}" (plate ${args.vehicleLicensePlate}) from the saved-vehicle registry, along with its labels. Past detection events for this plate are NOT deleted — they remain in the vehicle event history.`,
        });
      }
      case LprToolRequestType.ADD_VEHICLE_LABEL:
      case LprToolRequestType.REMOVE_VEHICLE_LABEL: {
        const removing = responseType === LprToolRequestType.REMOVE_VEHICLE_LABEL;
        if (!args.vehicleLicensePlate || !args.vehicleLabel?.trim()) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `vehicleLicensePlate and vehicleLabel are both required for ${responseType}.`,
          });
        }
        const existing = await findSavedVehicle(
          args.vehicleLicensePlate,
          requestModifiers,
          sessionId
        );
        if (!existing) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `No saved vehicle has the plate ${args.vehicleLicensePlate}. A label can only be attached to a SAVED vehicle — save it first with save-vehicle.`,
          });
        }
        const label = args.vehicleLabel.trim();
        const result = removing
          ? await removeVehicleLabel(args.vehicleLicensePlate, label, requestModifiers, sessionId)
          : await addVehicleLabel(args.vehicleLicensePlate, label, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          vehicleLabelResult: {
            success: result.success,
            licensePlate: result.licensePlate,
            label: result.label,
          },
          warningMsg: result.warningMsg,
          note: `${removing ? "Removed" : "Added"} the label "${label}" ${removing ? "from" : "to"} plate ${args.vehicleLicensePlate}. Labels flow through to that plate's detection events, so ${removing ? "past events will stop showing" : "past and future events will show"} this label.`,
        });
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
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
