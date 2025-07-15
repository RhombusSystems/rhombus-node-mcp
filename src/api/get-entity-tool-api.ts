import { postApi } from "../network.js";

export async function getCameraList(requestModifiers?: any, sessionId?: string) {
  return {
    cameras: (
      await postApi({
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
      await postApi({
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
  return await postApi({
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
  return await postApi({
    route: "/component/findAccessControlledDoors",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}

export async function getAudioGateways(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/audiogateway/getMinimalAudioGatewayStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      audioGateways: response.audioGatewayStates.filter(
        (camera: { locationUuid?: string }) => !!camera.locationUuid
      ),
    };
  });
}

export async function getDoorSensors(requestModifiers?: any, sessionId?: string) {
  return await postApi({
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

export async function getEnvironmentalSensors(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/climate/getMinimalClimateStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      climateStates: response.climateStates.filter(
        (sensor: { locationUuid?: string }) => !!sensor.locationUuid
      ),
    };
  });
}

export async function getMotionSensors(requestModifiers?: any, sessionId?: string) {
  return await postApi({
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

export async function getButtons(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/button/getMinimalButtonStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      buttonStates: response.states.filter(
        (button: { locationUuid?: string }) => !!button.locationUuid
      ),
    };
  });
}

export async function getKeypads(requestModifiers?: any, sessionId?: string) {
  return await postApi({
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
