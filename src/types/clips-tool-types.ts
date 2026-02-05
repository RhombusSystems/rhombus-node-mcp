import { z } from "zod";
import { createUuidSchema } from "../types.js";
import {
	createEpochSchema,
	ISOTimestampFormatDescription,
} from "../utils/timestampInput.js";

export const TOOL_ARGS = {
	requestType: z
		.enum(["saved", "expiringSoon", "sharedLiveStreams", "timelapseClips"])
		.describe(
			'The type of data to retrieve. Use "saved" for regular saved clips, "expiringSoon" for clips nearing expiration, "sharedLiveStreams" for all shared live video streams, or "timelapseClips" for all timelapse clips.',
		),
	deviceUuidFilters: z
		.array(createUuidSchema())
		.nullable()
		.describe(
			"A list of UUIDs representing specific devices to filter clips by. Only clips emitted by these devices will be returned. Please truncate any facets, such as .v0. It is always 22 characters long.",
		),
	locationUuidFilters: z
		.array(createUuidSchema())
		.nullable()
		.describe(
			"A list of UUIDs representing specific locations to filter clips by. Only clips associated with these locations will be returned. Please truncate any facets, such as .v0. It is always 22 characters long.",
		),
	searchFilter: z
		.string()
		.nullable()
		.describe("A simple string to search for within the names of the clips."),
	timestampISOAfter: z
		.string()
		.datetime({
			message: "Invalid datetime string. Expected ISO 8601 format.",
			offset: true,
		})
		.nullable()
		.describe(
			"The start of the time range for which to retrieve clips. Only clips that occurred AFTER this timestamp will be returned. Required when requestType is saved or expiringSoon." +
				ISOTimestampFormatDescription,
		),
	timestampISOBefore: z
		.string()
		.datetime({
			message: "Invalid datetime string. Expected ISO 8601 format.",
			offset: true,
		})
		.nullable()
		.describe(
			"The end of the time range for which to retrieve clips. Only clips that occurred BEFORE this timestamp will be returned. Required when requestType is saved or expiringSoon." +
				ISOTimestampFormatDescription,
		),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const ApiPayloadSchema = TOOL_ARGS_SCHEMA.transform((args) => {
	if (
		args.requestType === "sharedLiveStreams" ||
		args.requestType === "timelapseClips"
	) {
		return {};
	}
	const { timestampISOAfter, timestampISOBefore, ...rest } = args;
	if (timestampISOAfter == null || timestampISOBefore == null) {
		throw new Error(
			"timestampISOAfter and timestampISOBefore are required when requestType is saved or expiringSoon",
		);
	}
	const timestampMsAfter = createEpochSchema().parse(timestampISOAfter);
	const timestampMsBefore = createEpochSchema().parse(timestampISOBefore);

	return {
		...rest,
		timestampMsAfter,
		timestampMsBefore,
	};
});
export type ApiPayload = z.infer<typeof ApiPayloadSchema>;

export const OUTPUT_SCHEMA = z.object({
	error: z.optional(z.string()),

	// set these as z.any() to prevent us from over-loading the context with tool
	savedClips: z.array(z.any()).optional(),
	expiringClips: z.array(z.any()).optional(),
	sharedLiveVideoStreams: z.array(z.any()).optional(),
	timelapseClips: z.array(z.any()).optional(),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
