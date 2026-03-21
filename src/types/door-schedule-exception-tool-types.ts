import { z } from "zod";
import { FILTER_BY_ARG, INCLUDE_FIELDS_ARG } from "../util.js";
import { AccessControlledDoorStateEnumType } from "./schema.js";

export enum DoorScheduleExceptionRequestType {
	CREATE_EXCEPTION = "create-exception",
	DELETE_EXCEPTION = "delete-exception",
	FIND_EXCEPTIONS = "find-exceptions",
	FIND_EXCEPTIONS_FOR_LOCATION = "find-exceptions-for-location",
	FIND_EXCEPTIONS_FOR_DOOR = "find-exceptions-for-door",
	GET_EXCEPTION = "get-exception",
	UPDATE_EXCEPTION = "update-exception",
}

export const DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA = z
	.object({
		createdAtMillis: z.number().nullable(),
		defaultState: z.enum(AccessControlledDoorStateEnumType).nullable(),
		description: z.string().nullable(),
		doorUuids: z.array(z.string().nullable()).nullable().optional(),
		intervals: z
			.array(
				z.object({
					localEndDateTime: z.string().nullable(),
					localStartDateTime: z.string().nullable(),
					state: z.enum(AccessControlledDoorStateEnumType),
				}),
			)
			.nullable(),
		localEndDate: z.string().nullable(),
		localStartDate: z.string().nullable(),
		locationToDoorsMap: z
			.record(z.string(), z.array(z.string().nullable()).nullable())
			.nullable()
			.optional(),
		name: z.string().nullable(),
		updatedAtMillis: z.number().nullable(),
	})
	.superRefine((value, ctx) => {
		if (!value.name) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "exception.name is required.",
				path: ["name"],
			});
		}
		if (!value.localStartDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "exception.localStartDate is required.",
				path: ["localStartDate"],
			});
		}
		if (!value.localEndDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "exception.localEndDate is required.",
				path: ["localEndDate"],
			});
		}
		if (!value.intervals || value.intervals.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "exception.intervals must contain at least one interval.",
				path: ["intervals"],
			});
		}
		const hasDoorUuids =
			(value.doorUuids?.filter(
				(doorUuid): doorUuid is string => !!doorUuid,
			).length ?? 0) > 0;
		const hasLocationToDoorsMap = Object.values(value.locationToDoorsMap ?? {})
			.flatMap((doorUuids) => doorUuids ?? [])
			.some((doorUuid) => !!doorUuid);
		if (!hasDoorUuids && !hasLocationToDoorsMap) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"exception must include at least one door in doorUuids or locationToDoorsMap.",
				path: ["doorUuids"],
			});
		}
	});
export type DoorScheduleExceptionInput = z.infer<
	typeof DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA
>;

export const TOOL_ARGS = {
	requestType: z
		.nativeEnum(DoorScheduleExceptionRequestType)
		.describe("The type of door schedule exception request to make."),
	exceptionUuid: z
		.string()
		.nullable()
		.describe(
			"Door schedule exception UUID. Required for 'get-exception' and 'delete-exception'.",
		),
	locationUuid: z
		.string()
		.nullable()
		.describe("Location UUID. Required for 'find-exceptions-for-location'."),
	doorUuid: z
		.string()
		.nullable()
		.describe("Door UUID. Required for 'find-exceptions-for-door'."),
	exception: DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA.nullable().describe(
		"DoorScheduleExceptionType object. Required for 'create-exception' and 'update-exception'.",
	),
	localStartDateRangeStart: z.iso
		.datetime({ offset: true })
		.optional()
		.nullable()
		.describe(
			"Optional date range filter (inclusive) for local start date beginning (yyyy-MM-dd).",
		),
	localStartDateRangeEnd: z.iso
		.datetime({ offset: true })
		.optional()
		.nullable()
		.describe(
			"Optional date range filter (inclusive) for local start date end (yyyy-MM-dd).",
		),
	localEndDateRangeStart: z.iso
		.datetime({ offset: true })
		.optional()
		.nullable()
		.describe(
			"Optional date range filter (inclusive) for local end date beginning (yyyy-MM-dd).",
		),
	localEndDateRangeEnd: z.iso
		.datetime({ offset: true })
		.optional()
		.nullable()
		.describe(
			"Optional date range filter (inclusive) for local end date end (yyyy-MM-dd).",
		),
	includeFields: INCLUDE_FIELDS_ARG,
	filterBy: FILTER_BY_ARG,
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const EXCEPTION_SCHEMA = z.object({
	uuid: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	locationUuid: z.string().optional(),
	localStartDate: z.string().optional(),
	localEndDate: z.string().optional(),
	defaultState: z.string().optional(),
	doorUuids: z.array(z.string()).optional(),
	intervalCount: z.number().optional(),
	createdAtMillis: z.number().optional(),
	updatedAtMillis: z.number().optional(),
});

export const OUTPUT_SCHEMA = z.object({
	exception: EXCEPTION_SCHEMA.optional().describe(
		"Single door schedule exception result.",
	),
	exceptions: z
		.array(EXCEPTION_SCHEMA)
		.optional()
		.describe("List of door schedule exceptions."),
	deleted: z
		.object({
			success: z.boolean().optional(),
			exceptionUuid: z.string().optional(),
		})
		.optional()
		.describe("Delete result."),
	expiredACDLicensesDoorUuids: z
		.array(z.string())
		.optional()
		.describe("Door UUIDs with expired access control licenses."),
	unassignedACDLicensesDoorUuids: z
		.array(z.string())
		.optional()
		.describe("Door UUIDs with unassigned access control licenses."),
	warningMsg: z
		.string()
		.optional()
		.describe("Warning returned by backend, if any."),
	error: z
		.string()
		.optional()
		.describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
