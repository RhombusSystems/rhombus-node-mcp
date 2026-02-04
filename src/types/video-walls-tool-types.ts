import { z } from "zod";

export const VideoWallSettings = z.object({
	rowCount: z.number(),
	columnCount: z.number(),
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
		.enum(["list", "create"])
		.describe("The type of request to make."),
	videoWallCreateOptions: CreateVideoWallOptions,
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
			"If requestType is `get`, then this field will be populated with the video wall.",
		)
		.optional(),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
