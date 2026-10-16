import { logger } from "../logger.js";
import { cachedPostApi } from "../network/org-reference-cache.js";
import type { schema } from "../types/schema.js";
import { formatTimestamp, RequestModifiers } from "../util.js";
import { tempFunc, TempUnit } from "../utils/temp.js";

// Every list below returns the device states exactly as the API reports them,
// including devices that are not assigned to a location (the API omits
// `locationUuid` for those; the Rhombus Console lists them as "No Location").
// An earlier version dropped any state without a `locationUuid`, which hid
// unassigned devices entirely — a registered, online camera that had simply
// not been placed in a location was reported as not existing.

export async function getCameraList(
	requestModifiers?: any,
	sessionId?: string,
) {
	const body = await cachedPostApi<any>({
		route: "/camera/getMinimalCameraStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});
	return {
		cameras: (body.cameraStates ?? []),
	};
}

export async function getDoorbellCameras(
	requestModifiers?: any,
	sessionId?: string,
) {
	const body = await cachedPostApi<any>({
		route: "/doorbellcamera/getMinimalStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});
	return {
		doorbellCameras: (body.minimalStates ?? []),
	};
}

export async function getBadgeReaders(
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/badgereader/getMinimalStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			badgeReaders: (response.minimalStates ?? []),
		};
	});
}

export async function getAccessControlledDoors(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<schema["Component_FindAccessControlledDoorsWSResponse"]> {
	return await cachedPostApi<schema["Component_FindAccessControlledDoorsWSResponse"]>(
		{
			route: "/component/findAccessControlledDoors",
			body: {},
			modifiers: requestModifiers,
			sessionId,
		},
	).then((response) => {
		return {
			accessControlledDoors: (response.accessControlledDoors || []).map(
				(door) => {
					return {
						geofenceEnabled: door.geofenceEnabled,
						locationUuid: door.locationUuid,
						policyUuid: door.policyUuid,
						remoteUnlockEnabled: door.remoteUnlockEnabled,
						associatedCameras:
							door.associatedCameras?.filter((c): c is string => c !== null) ??
							[],
						name: door.name,
						uuid: door.uuid,
					};
				},
			),
		};
	});
}

export async function getAudioGateways(
	timeZone: string,
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/audiogateway/getMinimalAudioGatewayStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			audioGateways: (response.audioGatewayStates ?? [])
					.map((gateway: any) => ({
					...gateway,
					createdAtString: gateway.createdAtMillis
						? formatTimestamp(gateway.createdAtMillis, timeZone)
						: undefined,
				})),
		};
	});
}

export async function getDoorSensors(
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/door/getMinimalDoorStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			doorStates: (response.doorStates ?? []),
		};
	});
}

export async function getEnvironmentalSensors(
	timeZone: string,
	tempUnit: TempUnit | null,
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/climate/getMinimalClimateStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		logger.info("Using tempUnit: ", tempUnit);
		return {
			climateStates: (response.climateStates ?? [])
					.map((_sensor: any) => {
					const { temperatureCelcius, ...sensor } = _sensor;

					return {
						...sensor,
						temperature: tempFunc(temperatureCelcius ?? 0, tempUnit),
						createdAtString: sensor.createdAtMillis
							? formatTimestamp(sensor.createdAtMillis, timeZone)
							: undefined,
					};
				}),
		};
	});
}

export async function getMotionSensors(
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/occupancy/getMinimalOccupancySensorStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			occupancySensorStates: (response.occupancySensorStates ?? []),
		};
	});
}

export async function getButtons(
	timeZone: string,
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/button/getMinimalButtonStateList",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			buttonStates: (response.states ?? [])
					.map((button: any) => ({
					...button,
					createdAtString: button.createdAtMillis
						? formatTimestamp(button.createdAtMillis, timeZone)
						: undefined,
				})),
		};
	});
}

export async function getKeypads(requestModifiers?: any, sessionId?: string) {
	return await cachedPostApi<any>({
		route: "/keypad/getKeypadsForOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			keypadStates: (response.keypads ?? []),
		};
	});
}

export async function getEnvironmentalGateways(
	timeZone: string,
	requestModifiers?: any,
	sessionId?: string,
) {
	return await cachedPostApi<any>({
		route: "/climate/getMinimalEnvironmentalGatewayStates",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	}).then((response) => {
		return {
			minimalEnvironmentalGatewayStates: (
				response.minimalEnvironmentalGatewayStates ?? []
			)
					.map((gateway: any) => ({
						...gateway,
						createdAtString: gateway.createdAtMillis
							? formatTimestamp(gateway.createdAtMillis, timeZone)
							: undefined,
						timestampString: gateway.timestampMs
							? formatTimestamp(gateway.timestampMs, timeZone)
							: undefined,
					})),
		};
	});
}
