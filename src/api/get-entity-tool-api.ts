import { logger } from "../logger.js";
import { postApi } from "../network.js";
import { formatTimestamp } from "../util.js";
import { tempFunc, TempUnit } from "../utils/temp.js";

export async function getCameraList(requestModifiers?: any, sessionId?: string) {
  return {
    cameras: (
      await postApi<any>({
        route: "/camera/getMinimalCameraStateList",
        body: {},
        modifiers: requestModifiers,
        sessionId,
      })
    ).cameraStates.filter((camera: { locationUuid?: string }) => !!camera.locationUuid),
  };
}

export async function getDoorbellCameras(requestModifiers?: any, sessionId?: string) {
  return {
    doorbellCameras: (
      await postApi<any>({
        route: "/doorbellcamera/getMinimalStateList",
        body: {},
        modifiers: requestModifiers,
        sessionId,
      })
    ).minimalStates.filter(
      (doorbellCamera: { locationUuid?: string }) => !!doorbellCamera.locationUuid
    ),
  };
}

export async function getBadgeReaders(requestModifiers?: any, sessionId?: string) {
  return await postApi<any>({
    route: "/badgereader/getMinimalStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      badgeReaders: response.minimalStates.filter(
        (badgeReader: { locationUuid?: string }) => !!badgeReader.locationUuid
      ),
    };
  });
}

export async function getAccessControlledDoors(requestModifiers?: any, sessionId?: string) {
  return await postApi<any>({
    route: "/component/findAccessControlledDoors",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return (response.accessControlledDoors || []).map((door: any) => {
      return {
        geofenceEnabled: door.geofenceEnabled,
        locationUuid: door.locationUuid,
        policyUuid: door.policyUuid,
        name: door.name,
        uuid: door.uuid,
      };
    });
  });
}

export async function getAudioGateways(
  timeZone: string,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi<any>({
    route: "/audiogateway/getMinimalAudioGatewayStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      audioGateways: response.audioGatewayStates
        .filter((camera: { locationUuid?: string }) => !!camera.locationUuid)
        .map((gateway: any) => ({
          ...gateway,
          createdAtString: gateway.createdAtMillis
            ? formatTimestamp(gateway.createdAtMillis, timeZone)
            : undefined,
        })),
    };
  });
}

export async function getDoorSensors(requestModifiers?: any, sessionId?: string) {
  return await postApi<any>({
    route: "/door/getMinimalDoorStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      doorStates: response.doorStates.filter(
        (door: { locationUuid?: string }) => !!door.locationUuid
      ),
    };
  });
}

export async function getEnvironmentalSensors(
  timeZone: string,
  tempUnit: TempUnit | null,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi<any>({
    route: "/climate/getMinimalClimateStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    logger.info("Using tempUnit: ", tempUnit);
    return {
      climateStates: response.climateStates
        .filter((sensor: { locationUuid?: string }) => !!sensor.locationUuid)
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

export async function getMotionSensors(requestModifiers?: any, sessionId?: string) {
  return await postApi<any>({
    route: "/occupancy/getMinimalOccupancySensorStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      occupancySensorStates: response.occupancySensorStates.filter(
        (occupancySensor: { locationUuid?: string }) => !!occupancySensor.locationUuid
      ),
    };
  });
}

export async function getButtons(timeZone: string, requestModifiers?: any, sessionId?: string) {
  return await postApi<any>({
    route: "/button/getMinimalButtonStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      buttonStates: response.states
        .filter((button: { locationUuid?: string }) => !!button.locationUuid)
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
  return await postApi<any>({
    route: "/keypad/getKeypadsForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      keypadStates: response.keypads.filter(
        (keypad: { locationUuid?: string }) => !!keypad.locationUuid
      ),
    };
  });
}

export async function getEnvironmentalGateways(
  timeZone: string,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi<any>({
    route: "/climate/getMinimalEnvironmentalGatewayStates",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      minimalEnvironmentalGatewayStates: response.minimalEnvironmentalGatewayStates
        .filter((gateway: { locationUuid?: string }) => !!gateway.locationUuid)
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
