import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	createSchedule,
	deleteSchedule,
	findSchedules,
	getPoliciesUsingSchedule,
	updateSchedule,
} from "../api/schedule-tool-api.js";
import {
	INTERVALS_EXAMPLE,
	OUTPUT_SCHEMA,
	ScheduleToolRequestType,
	TOOL_ARGS,
	WEEKLY_REPEATING_STRATEGY,
	describeIntervals,
	parseWeeklyIntervals,
	type ToolArgs,
	type WeeklyScheduleInput,
} from "../types/schedule-tool-types.js";
import {
	createToolStructuredContent,
	createToolTextContent,
	extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "schedule-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus schedules — the named weekly time windows that policies attach to, e.g. "Business Hours" or "After Hours".

Use it to resolve a schedule NAME to the scheduleUuid that other tools require. create-camera-policy-tool needs a scheduleUuid and has no other legitimate source for one, so start here rather than guessing a UUID.

It has the following modes of operation, determined by the "requestType" parameter:
- ${ScheduleToolRequestType.LIST}: List every schedule in the organization with its UUID, name and active windows.
- ${ScheduleToolRequestType.GET}: Get one schedule by scheduleUuid.
- ${ScheduleToolRequestType.CREATE}: Create a weekly schedule. Requires name and intervals, e.g. intervals=${INTERVALS_EXAMPLE}.
- ${ScheduleToolRequestType.UPDATE}: Rename a schedule and/or replace its windows. Requires scheduleUuid plus name and/or intervals. Fields you omit are left unchanged; passing intervals REPLACES all existing windows.
- ${ScheduleToolRequestType.DELETE}: Delete a schedule. Requires scheduleUuid. Refuses (without deleting) when policies still reference the schedule, and lists them — see confirmDeleteInUse.
- ${ScheduleToolRequestType.GET_POLICIES_USING}: List the policies that reference a schedule. Requires scheduleUuid.

Schedules are org-wide and shared: editing one changes the behaviour of every policy attached to it. Schedules reported with "mutable": false are system-managed and cannot be updated or deleted.
`;

/** Look a schedule up in the org list; the API has no get-one endpoint. */
async function findScheduleByUuid(
	scheduleUuid: string,
	requestModifiers: ReturnType<typeof extractFromToolExtra>["requestModifiers"],
	sessionId?: string,
) {
	const { schedules } = await findSchedules(requestModifiers, sessionId);
	return schedules.find(schedule => schedule.uuid === scheduleUuid);
}

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	try {
		switch (args.requestType) {
			case ScheduleToolRequestType.LIST: {
				const { schedules, warningMsg } = await findSchedules(requestModifiers, sessionId);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					schedules,
					warningMsg,
					// A bare [] reads as "no schedules exist" indistinguishably from
					// "this org has none configured yet"; say which it is.
					note:
						schedules.length === 0
							? "This organization has no schedules configured. A camera or door policy cannot be scheduled until one is created — offer to create one with requestType 'create'."
							: undefined,
				});
			}

			case ScheduleToolRequestType.GET: {
				if (!args.scheduleUuid) {
					return createToolTextContent("scheduleUuid is required for 'get'.");
				}
				const schedule = await findScheduleByUuid(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				if (!schedule) {
					return createToolTextContent(
						`No schedule in this organization has the uuid "${args.scheduleUuid}". Use requestType 'list' to see the schedules that exist — do not guess a uuid.`,
					);
				}
				return createToolStructuredContent<OUTPUT_SCHEMA>({ schedule });
			}

			case ScheduleToolRequestType.CREATE: {
				if (!args.name?.trim()) {
					return createToolTextContent("name is required for 'create'.");
				}
				if (!args.intervals) {
					return createToolTextContent(
						`intervals is required for 'create'. Example: ${INTERVALS_EXAMPLE}`,
					);
				}
				const parsed = parseWeeklyIntervals(args.intervals);
				if (!parsed.ok) {
					// Pre-mutation: nothing was created, so a corrected retry is safe.
					return createToolTextContent(
						`RETRYABLE — nothing was created. ${parsed.message}`,
					);
				}

				const scheduleInput: WeeklyScheduleInput = {
					name: args.name.trim(),
					strategy: WEEKLY_REPEATING_STRATEGY,
					intervalList: parsed.value,
				};
				const { scheduleUuid, warningMsg } = await createSchedule(
					scheduleInput,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					created: { success: true, scheduleUuid },
					warningMsg,
					note: `Created "${args.name.trim()}" active ${describeIntervals(parsed.value)}.`,
				});
			}

			case ScheduleToolRequestType.UPDATE: {
				if (!args.scheduleUuid) {
					return createToolTextContent("scheduleUuid is required for 'update'.");
				}
				if (!args.name?.trim() && !args.intervals) {
					return createToolTextContent(
						"'update' needs at least one of name or intervals — both were empty, so there is nothing to change.",
					);
				}

				// api2's updateSchedule takes the WHOLE schedule, so sending only the
				// changed field would blank the other one. Read first and merge.
				const existing = await findScheduleByUuid(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				if (!existing) {
					return createToolTextContent(
						`No schedule in this organization has the uuid "${args.scheduleUuid}". Use requestType 'list' to see the schedules that exist.`,
					);
				}
				if (existing.mutable === false) {
					return createToolTextContent(
						`Schedule "${existing.name ?? args.scheduleUuid}" is system-managed (mutable: false) and cannot be edited. Tell the user this schedule is read-only; creating a new schedule is the alternative.`,
					);
				}

				let intervalList = existing.intervals
					?.flatMap(interval =>
						typeof interval.minuteOfWeekStart === "number" &&
						typeof interval.minuteOfWeekStop === "number"
							? [
									{
										minuteOfWeekStart: interval.minuteOfWeekStart,
										minuteOfWeekStop: interval.minuteOfWeekStop,
									},
								]
							: [],
					)
					.slice();
				let replacedWindows = false;

				if (args.intervals) {
					const parsed = parseWeeklyIntervals(args.intervals);
					if (!parsed.ok) {
						return createToolTextContent(
							`RETRYABLE — nothing was changed. ${parsed.message}`,
						);
					}
					intervalList = parsed.value;
					replacedWindows = true;
				}

				const { updated, warningMsg } = await updateSchedule(
					{
						uuid: args.scheduleUuid,
						name: args.name?.trim() || existing.name,
						strategy: WEEKLY_REPEATING_STRATEGY,
						intervalList,
					},
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					updated,
					warningMsg,
					note: replacedWindows
						? `Replaced all windows on "${args.name?.trim() || existing.name}" — it is now active ${describeIntervals(intervalList ?? [])}. Every policy using this schedule now follows the new windows.`
						: `Renamed to "${args.name?.trim()}". Its windows are unchanged.`,
				});
			}

			case ScheduleToolRequestType.DELETE: {
				if (!args.scheduleUuid) {
					return createToolTextContent("scheduleUuid is required for 'delete'.");
				}

				const existing = await findScheduleByUuid(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				if (!existing) {
					return createToolTextContent(
						`No schedule in this organization has the uuid "${args.scheduleUuid}". Use requestType 'list' to see the schedules that exist.`,
					);
				}
				if (existing.mutable === false) {
					return createToolTextContent(
						`Schedule "${existing.name ?? args.scheduleUuid}" is system-managed (mutable: false) and cannot be deleted.`,
					);
				}

				// Deleting a schedule silently rewires every policy attached to it, so
				// check usage first and make the caller confirm.
				const { usedBy } = await getPoliciesUsingSchedule(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				if (usedBy.length > 0 && !args.confirmDeleteInUse) {
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						usedBy,
						note:
							`NOT DELETED — nothing was changed. "${existing.name ?? args.scheduleUuid}" is still used by ` +
							`${usedBy.length} ${usedBy.length === 1 ? "policy" : "policies"}: ` +
							`${usedBy.map(policy => `${policy.name ?? policy.uuid} (${policy.policyType})`).join(", ")}. ` +
							`Deleting it changes how those policies behave. Tell the user which policies are affected and ask them to ` +
							`confirm, then call this tool again with confirmDeleteInUse: true.`,
					});
				}

				const { deleted, warningMsg } = await deleteSchedule(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					deleted,
					warningMsg,
					note:
						usedBy.length > 0
							? `Deleted "${existing.name ?? args.scheduleUuid}", which was in use by ${usedBy.length} ${usedBy.length === 1 ? "policy" : "policies"}: ${usedBy.map(policy => policy.name ?? policy.uuid).join(", ")}. Those policies no longer have this schedule.`
							: `Deleted "${existing.name ?? args.scheduleUuid}". No policies referenced it.`,
				});
			}

			case ScheduleToolRequestType.GET_POLICIES_USING: {
				if (!args.scheduleUuid) {
					return createToolTextContent(
						"scheduleUuid is required for 'get-policies-using'.",
					);
				}
				const { usedBy, warningMsg } = await getPoliciesUsingSchedule(
					args.scheduleUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					usedBy,
					warningMsg,
					note:
						usedBy.length === 0
							? "No policies reference this schedule, so it can be deleted or edited without affecting anything."
							: undefined,
				});
			}
		}
	} catch (error: unknown) {
		return createToolStructuredContent<OUTPUT_SCHEMA>({
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}

	return createToolStructuredContent<OUTPUT_SCHEMA>({
		error: `Invalid requestType. Valid values are: ${Object.values(ScheduleToolRequestType).join(", ")}.`,
	});
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Schedules",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: false, destructiveHint: true },
		},
		TOOL_HANDLER,
	);
}
