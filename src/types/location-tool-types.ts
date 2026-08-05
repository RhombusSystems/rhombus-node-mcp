import { z } from "zod";

export enum LocationToolAction {
	GET = "get",
	CREATE = "create",
	UPDATE = "update",
	DELETE = "delete",
	GET_LABELS = "get-labels",
	ADD_LABEL = "add-label",
	REMOVE_LABEL = "remove-label",
}

export const TOOL_ARGS = {
	action: z
		.nativeEnum(LocationToolAction)
		.describe(
			"'get' = list all locations with their address, timezone and labels; " +
				"'create' = create a location (requires locationName); " +
				"'update' = change a location's name, address, timezone and/or labels (requires locationUuid); " +
				"'delete' = delete a location (requires locationUuid); " +
				"'get-labels' = list all location labels used in the org; " +
				"'add-label' / 'remove-label' = attach or detach one label on one location (requires locationUuid and label).",
		),
	locationUuid: z
		.string()
		.nullable()
		.describe(
			"UUID of the location. Required for 'update', 'delete', 'add-label' and 'remove-label'. Get it from 'get' — do not guess one.",
		),
	locationName: z
		.string()
		.nullable()
		.describe(
			"Name for the location. Required for 'create'; for 'update' it is the new name (omit to leave the name unchanged).",
		),
	locationAddress: z
		.string()
		.nullable()
		.describe(
			"Street address for the location. Optional for 'create' and 'update'. For 'update', omit to leave the address unchanged.",
		),
	postalCode: z
		.string()
		.nullable()
		.describe("Postal/ZIP code. Optional for 'update'; omit to leave it unchanged."),
	countryCode: z
		.string()
		.nullable()
		.describe(
			"Two-letter ISO country code, e.g. \"US\". Optional for 'update'; omit to leave it unchanged.",
		),
	timezoneId: z
		.string()
		.nullable()
		.describe(
			'IANA timezone id for the location, e.g. "America/Los_Angeles". Optional for \'update\'; omit to leave it unchanged. ' +
				"A location's timezone decides how its schedules and reports are interpreted, so changing it shifts every schedule at that location — say so before doing it.",
		),
	label: z
		.string()
		.nullable()
		.describe("A single label name. Required for 'add-label' and 'remove-label'."),
	confirmDelete: z
		.boolean()
		.nullable()
		.describe(
			"Only for 'delete'. Deleting a location is not reversible and affects every device assigned to it, so 'delete' refuses by default. Set true to delete anyway, after the user has confirmed.",
		),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const LOCATION_OUTPUT = z.object({
	uuid: z.string().optional(),
	name: z.string().optional(),
	address: z
		.string()
		.optional()
		.describe("The address parts joined for reading. Prefer this over reassembling them."),
	address1: z.string().optional(),
	address2: z.string().optional(),
	postalCode: z.string().optional(),
	countryCode: z.string().optional(),
	timezone: z
		.string()
		.optional()
		.describe("IANA timezone id. Schedules and reports at this location are interpreted in it."),
	labels: z.array(z.string()).optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	policyUuid: z.string().optional(),
});
export type Location = z.infer<typeof LOCATION_OUTPUT>;

export const OUTPUT_SCHEMA = z.object({
	locations: z.array(LOCATION_OUTPUT).optional().describe("All locations in the organization."),
	createdLocation: z
		.object({ uuid: z.string().optional(), success: z.boolean().optional() })
		.optional(),
	updated: z
		.object({ success: z.boolean().optional(), locationUuid: z.string().optional() })
		.optional(),
	deleted: z
		.object({ success: z.boolean().optional(), locationUuid: z.string().optional() })
		.optional(),
	labelChanged: z
		.object({
			success: z.boolean().optional(),
			locationUuid: z.string().optional(),
			label: z.string().optional(),
		})
		.optional(),
	locationLabels: z
		.array(z.object({ uuid: z.string().optional(), name: z.string().optional() }))
		.optional(),
	note: z
		.string()
		.optional()
		.describe("A caveat about this result that the user needs to be told."),
	warningMsg: z
		.string()
		.optional()
		.describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
	error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
