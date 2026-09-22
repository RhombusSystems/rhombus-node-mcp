import z from "zod";
import { postApi, throwIfApiError } from "../network/network.js";
import createUuidMap from "../network/postApiMap.js";
import type {
	CreateDoorScheduleExceptionInput,
	UpdateDoorScheduleExceptionInput,
} from "../types/door-schedule-exception-tool-types.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";
import { getAccessControlledDoors } from "./get-entity-tool-api.js";

export type ExceptionSummary = {
	uuid?: string;
	name?: string;
	description?: string;
	locationUuid?: string;
	localStartDate?: string;
	localEndDate?: string;
	defaultState?: string;
	doorUuids?: string[];
	intervalCount?: number;
	createdAtMillis?: number;
	updatedAtMillis?: number;
};

export const DateRangeFilter = z.object({
	localStartDateRangeStart: z.iso.datetime({ offset: true }).optional(),
	localStartDateRangeEnd: z.iso.datetime({ offset: true }).optional(),
	localEndDateRangeStart: z.iso.datetime({ offset: true }).optional(),
	localEndDateRangeEnd: z.iso.datetime({ offset: true }).optional(),
});
export type DateRangeFilter = z.infer<typeof DateRangeFilter>;

function mapException(
	exception: schema["DoorScheduleExceptionType"] | null | undefined,
): ExceptionSummary {
	const doorUuids =
		exception?.doorUuids?.filter((value): value is string => value !== null) ??
		[];
	const intervalCount = Array.isArray(exception?.intervals)
		? exception.intervals.length
		: 0;

	return {
		uuid: exception?.uuid ?? undefined,
		name: exception?.name ?? undefined,
		description: exception?.description ?? undefined,
		locationUuid: exception?.locationUuid ?? undefined,
		localStartDate: exception?.localStartDate ?? undefined,
		localEndDate: exception?.localEndDate ?? undefined,
		defaultState: exception?.defaultState ?? undefined,
		doorUuids,
		intervalCount,
		createdAtMillis: exception?.createdAtMillis ?? undefined,
		updatedAtMillis: exception?.updatedAtMillis ?? undefined,
	};
}

function buildDateRangeFilter(
	filter?: DateRangeFilter,
): schema["DateRangeFilter"] | undefined {
	if (!filter) return undefined;
	const {
		localStartDateRangeStart,
		localStartDateRangeEnd,
		localEndDateRangeStart,
		localEndDateRangeEnd,
	} = filter;
	const hasAnyFilter = Boolean(
		localStartDateRangeStart ||
			localStartDateRangeEnd ||
			localEndDateRangeStart ||
			localEndDateRangeEnd,
	);

	if (!hasAnyFilter) return undefined;

	return {
		localStartDateRangeStart,
		localStartDateRangeEnd,
		localEndDateRangeStart,
		localEndDateRangeEnd,
	} satisfies schema["DateRangeFilter"];
}

async function verifyExceptionConfig(
	exception: CreateDoorScheduleExceptionInput | UpdateDoorScheduleExceptionInput,
	options: { isUpdate: boolean },
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<schema["DoorScheduleExceptionType"]> {
	const verified: schema["DoorScheduleExceptionType"] = {
		...exception,
	} as unknown as schema["DoorScheduleExceptionType"];

	const doorUuidsProvided = Array.isArray(exception.doorUuids);
	const cleanedDoorUuids = doorUuidsProvided
		? (exception.doorUuids?.filter(
				(doorUuid): doorUuid is string => !!doorUuid,
			) ?? [])
		: undefined;
	if (cleanedDoorUuids !== undefined) {
		verified.doorUuids = cleanedDoorUuids;
	}

	if (
		(!Array.isArray(exception.intervals) || exception.intervals.length === 0) &&
		exception.defaultState &&
		exception.localStartDate &&
		exception.localEndDate
	) {
		verified.intervals = [
			{
				localStartDateTime: `${exception.localStartDate}T00:00:00`,
				localEndDateTime: `${exception.localEndDate}T23:59:59`,
				state: exception.defaultState,
			},
		];
	}

	// construct locationToDoorsMap only when doors are explicitly provided.
	// For update, omitting doorUuids should preserve the existing map.
	if (cleanedDoorUuids !== undefined) {
		const locationToDoorsMap: Record<string, string[]> = {};
		if (cleanedDoorUuids.length > 0) {
			const doors = await getAccessControlledDoors(requestModifiers, sessionId);
			const doorsMap = await createUuidMap(
				doors.accessControlledDoors ?? [],
				"uuid",
			);

			for (const doorUuid of cleanedDoorUuids) {
				const door = doorsMap.get(doorUuid);
				const locationUuid = door?.locationUuid;

				if (locationUuid) {
					if (!locationToDoorsMap[locationUuid]) {
						locationToDoorsMap[locationUuid] = [];
					}

					locationToDoorsMap[locationUuid].push(doorUuid);
				}
			}
		}
		verified.locationToDoorsMap = locationToDoorsMap;
	} else if (!options.isUpdate) {
		verified.locationToDoorsMap = {};
	}

	return verified as schema["DoorScheduleExceptionType"];
}

export async function createDoorScheduleException(
	exception: CreateDoorScheduleExceptionInput,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const normalizedException = await verifyExceptionConfig(
		exception,
		{ isUpdate: false },
		requestModifiers,
		sessionId,
	);

	const res = await postApi<
		schema["Accesscontrol_doorexception_CreateDoorScheduleExceptionWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/createExceptionV2",
		body: {
			exception: normalizedException,
		} as schema["Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exception: res.exception ? mapException(res.exception) : undefined,
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function updateDoorScheduleException(
	exception: UpdateDoorScheduleExceptionInput,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const normalizedException = await verifyExceptionConfig(
		exception,
		{ isUpdate: true },
		requestModifiers,
		sessionId,
	);

	const res = await postApi<
		schema["Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/updateExceptionV2",
		body: {
			exception: normalizedException,
		} as schema["Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exception: res.exception ? mapException(res.exception) : undefined,
		expiredACDLicensesDoorUuids:
			res.expiredACDLicensesDoorUuids?.filter(
				(value): value is string => value !== null,
			) ?? [],
		unassignedACDLicensesDoorUuids:
			res.unassignedACDLicensesDoorUuids?.filter(
				(value): value is string => value !== null,
			) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function deleteDoorScheduleException(
	exceptionUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/deleteExceptionV2",
		body: {
			exceptionUuid,
		} satisfies schema["Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		deleted: { success: true, exceptionUuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function getDoorScheduleException(
	exceptionUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Accesscontrol_doorexception_GetDoorScheduleExceptionWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/getExceptionV2",
		body: {
			exceptionUuid,
		} satisfies schema["Accesscontrol_doorexception_GetDoorScheduleExceptionWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exception: res.exception ? mapException(res.exception) : undefined,
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function findDoorScheduleExceptions(
	filter?: DateRangeFilter,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/findExceptionsV2",
		body: {
			dateRangeFilter: buildDateRangeFilter(filter),
		} satisfies schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exceptions: res.exceptions?.map(mapException) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function findDoorScheduleExceptionsForLocation(
	locationUuid: string,
	filter?: DateRangeFilter,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/findExceptionsForLocationV2",
		body: {
			locationUuid,
			dateRangeFilter: buildDateRangeFilter(filter),
		} satisfies schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exceptions: res.exceptions?.map(mapException) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function findDoorScheduleExceptionsForDoor(
	doorUuid: string,
	filter?: DateRangeFilter,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSResponse"]
	>({
		route: "/accesscontrol/doorScheduleException/findExceptionsForDoor",
		body: {
			doorUuid,
			dateRangeFilter: buildDateRangeFilter(filter),
		} satisfies schema["Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		exceptions: res.exceptions?.map(mapException) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}
