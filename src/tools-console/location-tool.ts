import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	addLocationLabel,
	createLocation,
	deleteLocation,
	findLocation,
	getLocationLabels,
	getLocations,
	removeLocationLabel,
	updateLocation,
} from "../api/location-tool-api.js";
import {
	LocationToolAction,
	OUTPUT_SCHEMA,
	TOOL_ARGS,
	type ToolArgs,
} from "../types/location-tool-types.js";
import {
	createToolStructuredContent,
	createToolTextContent,
	extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "location-tool";
const TOOL_DESCRIPTION = `This tool performs operations on locations.
- '${LocationToolAction.GET}': Retrieves all locations with their address, timezone and labels. When generating reports with location details, use location names not uuids.
- '${LocationToolAction.CREATE}': Creates a new location with a name and optional address.
- '${LocationToolAction.UPDATE}': Updates an existing location. Requires locationUuid plus at least one of locationName, locationAddress, postalCode, countryCode, timezoneId. Fields you omit are left unchanged.
- '${LocationToolAction.DELETE}': Deletes a location. Requires locationUuid. Refuses by default — see confirmDelete.
- '${LocationToolAction.GET_LABELS}': Retrieves all location labels for the organization.
- '${LocationToolAction.ADD_LABEL}' / '${LocationToolAction.REMOVE_LABEL}': Attaches or detaches one label on one location. Requires locationUuid and label.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	try {
		switch (args.action) {
			case LocationToolAction.GET: {
				const { locations, warningMsg } = await getLocations(requestModifiers, sessionId);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					locations,
					warningMsg,
					note:
						locations.length === 0
							? "This organization has no locations configured, so the empty result is not a failed lookup."
							: undefined,
				});
			}

			case LocationToolAction.CREATE: {
				if (!args.locationName?.trim()) {
					return createToolTextContent("locationName is required for 'create'.");
				}
				const created = await createLocation(
					args.locationName.trim(),
					args.locationAddress ?? undefined,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					createdLocation: { uuid: created.uuid, success: created.success },
					warningMsg: created.warningMsg,
					note: `Created "${args.locationName.trim()}". Its timezone has not been set — schedules and reports at a location are interpreted in its timezone, so set one with 'update' (timezoneId) if it is not the org default.`,
				});
			}

			case LocationToolAction.UPDATE: {
				if (!args.locationUuid) {
					return createToolTextContent("locationUuid is required for 'update'.");
				}
				const hasChange =
					!!args.locationName?.trim() ||
					!!args.locationAddress?.trim() ||
					!!args.postalCode?.trim() ||
					!!args.countryCode?.trim() ||
					!!args.timezoneId?.trim();
				if (!hasChange) {
					return createToolTextContent(
						"'update' needs at least one of locationName, locationAddress, postalCode, countryCode or timezoneId — all were empty, so there is nothing to change.",
					);
				}

				const existing = await findLocation(args.locationUuid, requestModifiers, sessionId);
				if (!existing) {
					return createToolTextContent(
						`No location in this organization has the uuid "${args.locationUuid}". Use action 'get' to see the locations that exist — do not guess a uuid.`,
					);
				}

				const { updated, warningMsg } = await updateLocation(
					{
						locationUuid: args.locationUuid,
						// selectiveUpdateLocation leaves omitted fields alone, so only the
						// fields the caller actually set are sent.
						name: args.locationName?.trim() || undefined,
						address1: args.locationAddress?.trim() || undefined,
						postalCode: args.postalCode?.trim() || undefined,
						countryCode: args.countryCode?.trim() || undefined,
						timezoneId: args.timezoneId?.trim() || undefined,
					},
					requestModifiers,
					sessionId,
				);

				const notes: string[] = [];
				if (args.timezoneId?.trim() && args.timezoneId.trim() !== existing.timezone) {
					notes.push(
						`The timezone changed from ${existing.timezone ?? "unset"} to ${args.timezoneId.trim()}. Every schedule and report at "${existing.name ?? args.locationUuid}" is now interpreted in the new zone, which shifts when they take effect.`,
					);
				}
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					updated,
					warningMsg,
					note: notes.length > 0 ? notes.join(" ") : undefined,
				});
			}

			case LocationToolAction.DELETE: {
				if (!args.locationUuid) {
					return createToolTextContent("locationUuid is required for 'delete'.");
				}
				const existing = await findLocation(args.locationUuid, requestModifiers, sessionId);
				if (!existing) {
					return createToolTextContent(
						`No location in this organization has the uuid "${args.locationUuid}". Use action 'get' to see the locations that exist.`,
					);
				}
				if (!args.confirmDelete) {
					// Deleting a location is not reversible and cascades to every device
					// assigned to it, so never do it on an inferred intent.
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						locations: [existing],
						note:
							`NOT DELETED — nothing was changed. Deleting the location "${existing.name ?? args.locationUuid}" cannot be undone and ` +
							`affects every camera, door and sensor assigned to it, plus its schedules and reports. Confirm with the user ` +
							`explicitly, then call this tool again with confirmDelete: true.`,
					});
				}

				const { deleted, warningMsg } = await deleteLocation(
					args.locationUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					deleted,
					warningMsg,
					note: `Deleted the location "${existing.name ?? args.locationUuid}".`,
				});
			}

			case LocationToolAction.GET_LABELS: {
				const locationLabels = await getLocationLabels(requestModifiers, sessionId);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					locationLabels,
					note:
						locationLabels.length === 0
							? "This organization has no location labels defined. 'add-label' creates a label by using it."
							: undefined,
				});
			}

			case LocationToolAction.ADD_LABEL:
			case LocationToolAction.REMOVE_LABEL: {
				const removing = args.action === LocationToolAction.REMOVE_LABEL;
				if (!args.locationUuid) {
					return createToolTextContent(`locationUuid is required for '${args.action}'.`);
				}
				if (!args.label?.trim()) {
					return createToolTextContent(`label is required for '${args.action}'.`);
				}

				const existing = await findLocation(args.locationUuid, requestModifiers, sessionId);
				if (!existing) {
					return createToolTextContent(
						`No location in this organization has the uuid "${args.locationUuid}". Use action 'get' to see the locations that exist.`,
					);
				}
				const label = args.label.trim();
				const alreadyHas = existing.labels?.includes(label) ?? false;
				if (removing && !alreadyHas) {
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						locations: [existing],
						note: `Nothing was changed — "${existing.name ?? args.locationUuid}" does not have the label "${label}". Its labels are: ${existing.labels?.length ? existing.labels.join(", ") : "(none)"}.`,
					});
				}
				if (!removing && alreadyHas) {
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						locations: [existing],
						note: `Nothing was changed — "${existing.name ?? args.locationUuid}" already has the label "${label}".`,
					});
				}

				const { labelChanged, warningMsg } = removing
					? await removeLocationLabel(args.locationUuid, label, requestModifiers, sessionId)
					: await addLocationLabel(args.locationUuid, label, requestModifiers, sessionId);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					labelChanged,
					warningMsg,
					note: `${removing ? "Removed" : "Added"} the label "${label}" ${removing ? "from" : "to"} "${existing.name ?? args.locationUuid}".`,
				});
			}
		}
	} catch (error: unknown) {
		return createToolStructuredContent<OUTPUT_SCHEMA>({
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}

	return createToolTextContent(
		`Invalid action. Valid values are: ${Object.values(LocationToolAction).join(", ")}.`,
	);
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Locations",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			// Previously declared but never passed, so results came back as raw text
			// and the filtering proxy had nothing to project.
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: false, destructiveHint: true },
		},
		TOOL_HANDLER,
	);
}
