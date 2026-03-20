import { postApi } from "../network/network.js";
import type {
	GetFaceEventsArgs,
	GetRegisteredFacesArgs,
} from "../types/faces-tools-types.js";
import type { schema } from "../types/schema.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";
import { removeNulls } from "../utils/remove-nulls.js";

// https://stackoverflow.com/questions/72165227/how-to-make-nullable-properties-optional-in-typescript
// nice :)
type PickNullable<T> = {
	[P in keyof T as null extends T[P] ? P : never]: T[P];
};

type PickNotNullable<T> = {
	[P in keyof T as null extends T[P] ? never : P]: T[P];
};

type OptionalNullable<T> = T extends object
	? {
			[K in keyof PickNullable<T>]?: OptionalNullable<Exclude<T[K], null>>;
		} & {
			[K in keyof PickNotNullable<T>]: OptionalNullable<T[K]>;
		}
	: T;

export async function getFaceEvents(
	args: GetFaceEventsArgs,
	timeZone: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	// OptionalNullable so that we can remove some fields before sending to the API
	let filteredArgs = { ...args } as OptionalNullable<GetFaceEventsArgs>;

	if (filteredArgs.pageRequest && filteredArgs.pageRequest.lastEvaluatedKey === "") {
		delete filteredArgs.pageRequest.lastEvaluatedKey;
	}

	if (filteredArgs.searchFilter) {
		if (
			filteredArgs.searchFilter.faceNames &&
			filteredArgs.searchFilter.faceNames.length === 0
		) {
			// @ts-expect-error - we can break typing
			delete filteredArgs.searchFilter.faceNames;
		}
		if (
			filteredArgs.searchFilter.labels &&
			filteredArgs.searchFilter.labels.length === 0
		) {
			// @ts-expect-error - we can break typing
			delete filteredArgs.searchFilter.labels;
		}
		if (filteredArgs.searchFilter.hasEmbedding === false) {
			delete filteredArgs.searchFilter.hasEmbedding;
		}
		if (filteredArgs.searchFilter.hasName === false) {
			delete filteredArgs.searchFilter.hasName;
		}
		if (filteredArgs.searchFilter.timestampFilter) {
			if (filteredArgs.searchFilter.timestampFilter.rangeEnd === null) {
				delete filteredArgs.searchFilter.timestampFilter.rangeEnd;
			}
			if (filteredArgs.searchFilter.timestampFilter.rangeStart === null) {
				delete filteredArgs.searchFilter.timestampFilter.rangeStart;
			}
		}
	}

	filteredArgs = removeNulls(filteredArgs);

	const response = await postApi<
		schema["Facerecognition_faceevent_FindFaceEventsByOrgWSResponse"]
	>({
		route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
		body: filteredArgs,
		modifiers: requestModifiers,
		sessionId,
	});

	const faceEvents = (response?.faceEvents ?? []).map((event: any) => ({
		deviceUuid: event.deviceUuid,
		eventTimestampMs: event.eventTimestamp,
		eventTimestamp: formatTimestamp(event.eventTimestamp, timeZone),
		faceName: event.faceName,
		locationUuid: event.locationUuid,
		personUuid: event.personUuid,
		thumbnailS3Key: event.thumbnailS3Key,
		uuid: event.uuid,
	}));

	return {
		faceEvents,
		lastEvaluatedKey: response?.lastEvaluatedKey,
	};
}

export async function getRegisteredFaces(
	_args: GetRegisteredFacesArgs,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	return await postApi<
		schema["Facerecognition_person_FindPeopleByOrgWSResponse"]
	>({
		route: "/faceRecognition/person/findPeopleByOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});
}

export async function getPersonLabels(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	return await postApi<
		schema["Facerecognition_person_FindPersonLabelsByOrgWSResponse"]
	>({
		route: "/faceRecognition/person/findPersonLabelsByOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});
}

export async function searchSimilarFaces(
	faceEventUuid: string,
	timeZone: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Facerecognition_faceevent_FindSimilarFaceEventsWSResponse"]
	>({
		route: "/faceRecognition/faceEvent/findSimilarFaceEvents",
		body: { faceEventUuid },
		modifiers: requestModifiers,
		sessionId,
	});
	if (res.error) throw new Error(JSON.stringify(res));
	return (res.faceEvents || []).map((event: any) => ({
		uuid: event.uuid ?? undefined,
		personUuid: event.personUuid ?? undefined,
		similarity: event.similarity ?? undefined,
		eventTimestamp: event.eventTimestamp
			? formatTimestamp(event.eventTimestamp, timeZone)
			: undefined,
	}));
}

export async function getFaceMatchmakers(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Facerecognition_matchmaker_FindFaceMatchmakersByOrgWSResponse"]
	>({
		route: "/faceRecognition/matchmaker/findFaceMatchmakersByOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});
	if (res.error) throw new Error(JSON.stringify(res));
	return (res.faceMatchmakers || []).map((m: any) => ({
		uuid: m.uuid ?? undefined,
		personUuid: m.personUuid ?? undefined,
		name: m.name ?? undefined,
	}));
}

export async function getFaceEventsByPerson(
	personUuid: string,
	timeZone: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<
		schema["Facerecognition_faceevent_FindFaceEventsByOrgWSResponse"]
	>({
		route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
		body: {
			pageRequest: { maxPageSize: 75 },
			searchFilter: {
				personUuids: [personUuid],
				deviceUuids: [],
				faceNames: [],
				labels: [],
				locationUuids: [],
			},
		},
		modifiers: requestModifiers,
		sessionId,
	});
	if (res.error) throw new Error(JSON.stringify(res));

	const faceEvents = (res.faceEvents || []).map((event) => ({
		uuid: event.uuid ?? undefined,
		personUuid: event.personUuid ?? undefined,
		eventTimestamp: event.eventTimestamp
			? formatTimestamp(event.eventTimestamp, timeZone)
			: undefined,
		deviceUuid: event.deviceUuid ?? undefined,
	}));

	return {
		faceEvents,
		lastEvaluatedKey: res.lastEvaluatedKey,
	};
}
