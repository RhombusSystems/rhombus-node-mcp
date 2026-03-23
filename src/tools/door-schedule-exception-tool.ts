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
This tool manages Rhombus door schedule exceptions. 
A door lock/unlock exception is a one-time rule used to change an access controlled door's locked/unlocked state. 
If a lock/unlock exception is enabled, it will overwrite the existing lock/unlock schedule. 
A schedule exception allows you to create a custom schedule that is only active for the specified dates/times. 
Once the date/time a schedule exception is set for passes, the original schedule will resume.

Door schedule exceptions can be either expired or not expired. If its scheduled date is in the past, then it is expired.
Users through the web console can toggle whether to see expired door schedule exceptions or not. Please mirror this behavior
when responding to the user.

It has the following modes of operation, determined by the "requestType" parameter:
- ${DoorScheduleExceptionRequestType.CREATE_EXCEPTION}: Create a door schedule exception. Requires exception (DoorScheduleExceptionType object). If locationUuid is missing but doorUuids are provided, the tool will resolve the location automatically.
- ${DoorScheduleExceptionRequestType.DELETE_EXCEPTION}: Delete a door schedule exception. Requires exceptionUuid.
- ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS}: Find door schedule exceptions across the organization, optionally filtered by date range.
- ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_LOCATION}: Find door schedule exceptions for a location. Requires locationUuid. Supports optional date range filters.
- ${DoorScheduleExceptionRequestType.FIND_EXCEPTIONS_FOR_DOOR}: Find door schedule exceptions for a door. Requires doorUuid. Supports optional date range filters.
- ${DoorScheduleExceptionRequestType.GET_EXCEPTION}: Get a single door schedule exception by UUID. Requires exceptionUuid.
- ${DoorScheduleExceptionRequestType.UPDATE_EXCEPTION}: Update a door schedule exception. Requires exception (DoorScheduleExceptionType object). If intervals are omitted but defaultState and date range are provided, the tool will generate a full-day interval.

Use get-entity-tool to look up location and door UUIDs when needed.
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
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			outputSchema: OUTPUT_SCHEMA.shape,
		},
		TOOL_HANDLER,
	);
}
