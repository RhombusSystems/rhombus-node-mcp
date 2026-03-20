import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";
import { postApi } from "./network.js";
import createUuidMap from "./postApiMap.js";

/**
 * Get a list of locations from the API.
 * 
 * @param requestModifiers
 * @param sessionId 
 * @returns 
 */
export async function getLocations(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_GetLocationsV2WSResponse"]>({
		route: "/location/getLocationsV2",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) {
		throw new Error(JSON.stringify(res));
	}

	return res.locations ?? [];
}

/**
 * Get a map of locations by UUID from the API.
 * 
 * @param requestModifiers
 * @param sessionId 
 * @returns 
 */
export async function getLocationsMap(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const locations = await getLocations(requestModifiers, sessionId);
  
	return createUuidMap(locations, "uuid");
}

export type DoorLocationResolution = {
	locationUuid?: string;
	locationToDoorsMap?: Record<string, string[]>;
};

export async function resolveLocationFromDoorUuids(
	doorUuids: string[],
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<DoorLocationResolution> {
	if (doorUuids.length === 0) return {};

	const res = await postApi<schema["Component_FindAccessControlledDoorsWSResponse"]>({
		route: "/component/findAccessControlledDoors",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) {
		throw new Error(`Failed to resolve door locations: ${JSON.stringify(res)}`);
	}

	const requestedDoorUuidSet = new Set(doorUuids);
	const locationToDoorsMap: Record<string, string[]> = {};

	for (const door of res.accessControlledDoors ?? []) {
		if (!door?.uuid || !requestedDoorUuidSet.has(door.uuid) || !door.locationUuid) continue;
		if (!locationToDoorsMap[door.locationUuid]) {
			locationToDoorsMap[door.locationUuid] = [];
		}
		locationToDoorsMap[door.locationUuid].push(door.uuid);
	}

	const locationUuids = Object.keys(locationToDoorsMap);
	return {
		locationUuid: locationUuids.length === 1 ? locationUuids[0] : undefined,
		locationToDoorsMap: locationUuids.length > 0 ? locationToDoorsMap : undefined,
	};
}
