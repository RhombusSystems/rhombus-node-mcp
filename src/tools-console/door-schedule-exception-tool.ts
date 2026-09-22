import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	createDoorScheduleException,
	deleteDoorScheduleException,
	findDoorScheduleExceptions,
	findDoorScheduleExceptionsForDoor,
	findDoorScheduleExceptionsForLocation,
	getDoorScheduleException,
	updateDoorScheduleException,
} from "../api/door-schedule-exception-tool-api.js";
import {
	CREATE_DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA,
	DoorScheduleExceptionRequestType,
	OUTPUT_SCHEMA,
	TOOL_ARGS,
	UPDATE_DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA,
	type ToolArgs,
} from "../types/door-schedule-exception-tool-types.js";
import {
	createToolStructuredContent,
	createToolTextContent,
	extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "door-schedule-exception-tool";

const TOOL_DESCRIPTION = `
Manages Rhombus door schedule exceptions — one-time overrides of an access-controlled door's lock/unlock schedule for specific dates/times; the regular schedule resumes once the exception passes. Use for requests like "unlock the front door this Saturday", "cancel/modify the holiday exception", "what schedule exceptions are set for <door/location>", including adding or removing doors on an existing exception.

Modes via "requestType": ${DoorScheduleExceptionRequestType.CREATE_EXCEPTION}, ${DoorScheduleExceptionRequestType.UPDATE_EXCEPTION}, ${DoorScheduleExceptionRequestType.DELETE_EXCEPTION}, ${DoorScheduleExceptionRequestType.GET_EXCEPTION}, ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS}, ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_LOCATION}, ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_DOOR} — per-mode requirements and the add/remove-doors procedure are documented on the parameters. Use get-entity-tool to resolve location and door UUIDs.
`;

function buildDateRangeFilter(args: ToolArgs) {
	return {
		localStartDateRangeStart: args.localStartDateRangeStart ?? undefined,
		localStartDateRangeEnd: args.localStartDateRangeEnd ?? undefined,
		localEndDateRangeStart: args.localEndDateRangeStart ?? undefined,
		localEndDateRangeEnd: args.localEndDateRangeEnd ?? undefined,
	};
}

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

	try {
		switch (args.requestType) {
			case DoorScheduleExceptionRequestType.CREATE_EXCEPTION: {
				if (!args.exception) {
					return createToolTextContent(
						JSON.stringify({
							error: "exception is required for create-exception.",
						}),
					);
				}
				const parsedException =
					CREATE_DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA.safeParse(args.exception);
				if (!parsedException.success) {
					return createToolTextContent(
						JSON.stringify({
							error: parsedException.error.issues[0]?.message ?? "Invalid exception payload for create-exception.",
						}),
					);
				}
				const created = await createDoorScheduleException(
					parsedException.data,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(created);
			}
			case DoorScheduleExceptionRequestType.DELETE_EXCEPTION: {
				if (!args.exceptionUuid) {
					return createToolTextContent(
						JSON.stringify({
							error: "exceptionUuid is required for delete-exception.",
						}),
					);
				}
				const deleted = await deleteDoorScheduleException(
					args.exceptionUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(deleted);
			}
			case DoorScheduleExceptionRequestType.FIND_EXCEPTIONS: {
				const results = await findDoorScheduleExceptions(
					buildDateRangeFilter(args),
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(results);
			}
			case DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_LOCATION: {
				if (!args.locationUuid) {
					return createToolTextContent(
						JSON.stringify({
							error:
								"locationUuid is required for find-exceptions-for-location.",
						}),
					);
				}
				const results = await findDoorScheduleExceptionsForLocation(
					args.locationUuid,
					buildDateRangeFilter(args),
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(results);
			}
			case DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_DOOR: {
				if (!args.doorUuid) {
					return createToolTextContent(
						JSON.stringify({
							error: "doorUuid is required for find-exceptions-for-door.",
						}),
					);
				}
				const results = await findDoorScheduleExceptionsForDoor(
					args.doorUuid,
					buildDateRangeFilter(args),
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(results);
			}
			case DoorScheduleExceptionRequestType.GET_EXCEPTION: {
				if (!args.exceptionUuid) {
					return createToolTextContent(
						JSON.stringify({
							error: "exceptionUuid is required for get-exception.",
						}),
					);
				}
				const exception = await getDoorScheduleException(
					args.exceptionUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(exception);
			}
			case DoorScheduleExceptionRequestType.UPDATE_EXCEPTION: {
				if (!args.exception) {
					return createToolTextContent(
						JSON.stringify({
							error: "exception is required for update-exception.",
						}),
					);
				}
				const parsedException =
					UPDATE_DOOR_SCHEDULE_EXCEPTION_INPUT_SCHEMA.safeParse(args.exception);
				if (!parsedException.success) {
					return createToolTextContent(
						JSON.stringify({
							error:
								parsedException.error.issues[0]?.message ??
								"Invalid exception payload for update-exception.",
						}),
					);
				}
				const updated = await updateDoorScheduleException(
					parsedException.data,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>(updated);
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

	return createToolStructuredContent({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Door Schedule Exceptions",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: false, destructiveHint: true },
		},
		TOOL_HANDLER,
	);
}
