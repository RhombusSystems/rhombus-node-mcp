import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export const VideoWallSettings = z.object({
  numVisibleDevicesAtOnce: z.number().nullable().describe(
    `The number of devices to display at once. If there is no rotation strategy and/or interval,
    then this value can be null.

    If there is a rotation strategy, then this value must be between 1 and the number of devices.
    Choose something reasonable, or ask the user for input.
    `
  ),
	intervalSeconds: z.number().nullable(),
	rotateStrategy: z.enum(["none", "motion", "interval"]),
});

export const CreateVideoWallOptions = z
	.object({
		displayName: z.string().nullable().describe("What to call the video wall"),
		orgUuid: z.string().describe("The uuid of the organization"),
		deviceList: z
			.array(z.string())
			.min(1)
			.describe(
				"The list of camera uuids (unique identifiers) to exist in the video wall.  You must provide this manually by prompting the user at least once.",
			),
		othersCanEdit: z
			.boolean()
			.nullable()
			.describe(
				"Whether or not other users can edit the wall, defaults to false",
			),
		settings: VideoWallSettings,
	})
	.nullable()
	.describe(
		"The options for creating a video wall. This is required if your requestType === `create`",
	);
export type CreateVideoWallOptions = z.infer<typeof CreateVideoWallOptions>;

export const TOOL_ARGS = {
	requestType: z
		.enum(["list", "create", "update", "delete"])
		.describe("The type of request to make."),
	videoWallCreateOptions: CreateVideoWallOptions,
	videoWallUuid: z
		.string()
		.nullable()
		.describe(
			"The uuid of the video wall to act on. Required for `update` and `delete`. Get it from `list` — do not guess one.",
		),
	displayName: z
		.string()
		.nullable()
		.describe(
			"Only for `update`: a new name for the wall. Omit to leave the name unchanged.",
		),
	deviceList: z
		.array(z.string())
		.nullable()
		.describe(
			"Only for `update`: the camera uuids the wall should contain AFTER the update. This REPLACES the wall's current cameras rather than adding to them, so include the ones being kept. To add or remove a few, read the wall with `list` first and send the full resulting set. The grid layout is recomputed from the new count.",
		),
	includeFields: INCLUDE_FIELDS_ARG,
	filterBy: FILTER_BY_ARG,
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
	error: z
		.optional(z.string())
		.describe(
			"If this field exists, then an error occured and contains the error message.",
		),
	needUserInput: z
		.boolean()
		.optional()
		.describe(
			"If this field exists and is true, then the tool requires additional input from the user.",
		),
	commandForUser: z
		.string()
		.optional()
		.describe(
			"If this field exists, then the tool requires additional input from the user.",
		),
	videoWalls: z
		.array(z.any())
		.describe(
			"If requestType is `list`, then this field will be populated with the list of video walls.",
		)
		.optional(),
	videoWall: z
		.array(z.any())
		.describe(
			"Unused — no current requestType populates this field. Use `videoWalls` (from 'list') or `uuid` (from 'create').",
		)
		.optional(),
  uuid: z.string().describe("The uuid of the created video wall.").optional(),
	updated: z
		.object({ success: z.boolean().optional(), uuid: z.string().optional() })
		.optional()
		.describe("Result of an `update` request."),
	deleted: z
		.object({ success: z.boolean().optional(), uuid: z.string().optional() })
		.optional()
		.describe("Result of a `delete` request."),
	note: z
		.string()
		.optional()
		.describe("A caveat about this result that the user needs to be told."),
	warningMsg: z
		.string()
		.optional()
		.describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
