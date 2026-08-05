import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import { describeWeeklyInterval, type RequestModifiers } from "../util.js";
import type { WeeklySchedule, WeeklyScheduleInput } from "../types/schedule-tool-types.js";

/**
 * api2 models a weekly schedule as `{name, strategy, intervalList}` where every
 * interval is a pair of "minute of week" integers. We return the raw integers
 * *and* a rendered `window` string — see `describeWeeklyInterval`.
 */
function mapSchedule(
	raw: NonNullable<schema["WeeklyRepeatingScheduleType"]>,
): WeeklySchedule {
	return {
		uuid: raw.uuid ?? undefined,
		name: raw.name ?? undefined,
		strategy: raw.strategy ?? undefined,
		mutable: raw.mutable ?? undefined,
		oneTimeUse: raw.oneTimeUse ?? undefined,
		intervals:
			raw.intervalList?.map(interval => ({
				minuteOfWeekStart: interval.minuteOfWeekStart ?? undefined,
				minuteOfWeekStop: interval.minuteOfWeekStop ?? undefined,
				window: describeWeeklyInterval(
					interval.minuteOfWeekStart,
					interval.minuteOfWeekStop,
				),
			})) ?? [],
	};
}

export async function findSchedules(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_FindSchedulesWSResponse"]>({
		route: "/policy/findSchedules",
		body: {} satisfies schema["Policy_FindSchedulesWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		schedules: res.schedules?.flatMap(raw => (raw ? [mapSchedule(raw)] : [])) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function createSchedule(
	scheduleInput: WeeklyScheduleInput,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_CreateScheduleWSResponse"]>({
		route: "/policy/createSchedule",
		body: {
			schedule: scheduleInput,
		} as schema["Policy_CreateScheduleWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		scheduleUuid: res.scheduleUuid ?? undefined,
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function updateSchedule(
	scheduleInput: WeeklyScheduleInput & { uuid: string },
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_UpdateScheduleWSResponse"]>({
		route: "/policy/updateSchedule",
		body: {
			schedule: scheduleInput,
		} as schema["Policy_UpdateScheduleWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		updated: { success: true, scheduleUuid: scheduleInput.uuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function deleteSchedule(
	scheduleUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_DeleteScheduleWSResponse"]>({
		route: "/policy/deleteSchedule",
		body: { scheduleUuid } satisfies schema["Policy_DeleteScheduleWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		deleted: { success: true, scheduleUuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

/**
 * Which policies reference a schedule. Deleting a schedule that is still in use
 * silently changes the behaviour of every policy attached to it, so the delete
 * path calls this first and refuses when the list is non-empty.
 */
export async function getPoliciesUsingSchedule(
	scheduleUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_GetPoliciesUsingScheduleWSResponse"]>({
		route: "/policy/getPoliciesUsingSchedule",
		body: {
			scheduleUuid,
		} satisfies schema["Policy_GetPoliciesUsingScheduleWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	const collect = (
		list: readonly ({ uuid?: string | null; name?: string | null } | null)[] | null | undefined,
		policyType: string,
	) =>
		list?.flatMap(entry =>
			entry ? [{ uuid: entry.uuid ?? undefined, name: entry.name ?? undefined, policyType }] : [],
		) ?? [];

	return {
		usedBy: [
			...collect(res.cameraPolicyList, "camera"),
			...collect(res.doorPolicyList, "door"),
			...collect(res.accessControlledDoorPolicyList, "access-controlled-door"),
			...collect(res.audioPolicyList, "audio"),
			...collect(res.climatePolicyList, "climate"),
			...collect(res.occupancyPolicyList, "occupancy"),
			...collect(res.proximityPolicyList, "proximity"),
			...collect(res.videoIntercomPolicyList, "video-intercom"),
		],
		warningMsg: res.warningMsg ?? undefined,
	};
}
