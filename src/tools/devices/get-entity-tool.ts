import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postApi } from "../../network.js";
import DeviceType from "../../types/deviceType.js";
import { createToolTextContent, RequestModifiers } from "../../util.js";

async function getCameraList(requestModifiers?: any, sessionId?: string) {
  return {
    cameras: (await postApi({
      route: "/camera/getMinimalCameraStateList",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    })).cameraStates.filter(
      (camera: { locationUuid?: string }) => !!camera.locationUuid
    ),
  };
}

async function getDoorbellCameras(requestModifiers?: any, sessionId?: string) {
  return {
    doorbellCameras: (await postApi({
      route: "/doorbellcamera/getMinimalStateList",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    })).minimalStates.filter(
      (doorbellCamera: { locationUuid?: string }) => !!doorbellCamera.locationUuid
    ),
  };
}

async function getBadgeReaders(requestModifiers?: any, sessionId?: string) {
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

async function getAccessControlledDoors(requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/component/findAccessControlledDoors",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}

async function getAudioGateways(requestModifiers?: any, sessionId?: string) {
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

async function getDoorSensors(requestModifiers?: any, sessionId?: string) {
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

async function getEnvironmentalSensors(requestModifiers?: any, sessionId?: string) {
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

async function getMotionSensors(requestModifiers?: any, sessionId?: string) {
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

async function getButtons(requestModifiers?: any, sessionId?: string) {
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

async function getKeypads(requestModifiers?: any, sessionId?: string) {
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

export function createTool(server: McpServer) {
  server.tool(
    "get-entity-tool",
    `
    Retrieves entities (or devices) of certain types.
    Can request multiple entity types at once.
    The return structure is a JSON string that continues the states of the requested entities.
    This data is exact. Whatever entities exist will be returned here.`,
    {
      entityTypes: z
        .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
        .describe("What type of entities to retrieve."),
    },
    async ({ entityTypes }, extra) => {
      const requestModifiers = extra._meta?.requestModifiers as RequestModifiers;
      const sessionId = extra.sessionId;

      const promises = [];
      if (entityTypes.includes(DeviceType.CAMERA)) {
        promises.push(getCameraList(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.DOORBELL_CAMERA)) {
        promises.push(getDoorbellCameras(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.BADGE_READER)) {
        promises.push(getBadgeReaders(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.ACCESS_CONTROL_DOOR)) {
        promises.push(getAccessControlledDoors(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.AUDIO_GATEWAY)) {
        promises.push(getAudioGateways(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.DOOR_SENSOR)) {
        promises.push(getDoorSensors(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.ENVIRONMENTAL_SENSOR)) {
        promises.push(getEnvironmentalSensors(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.MOTION_SENSOR)) {
        promises.push(getMotionSensors(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.BUTTON)) {
        promises.push(getButtons(requestModifiers, sessionId));
      }
      if (entityTypes.includes(DeviceType.KEYPAD)) {
        promises.push(getKeypads(requestModifiers, sessionId));
      }
      const responses = Promise.all<object>(promises);
      const ret = {
        ...(await responses).reduce((prev, curr) => ({
          ...prev,
          ...curr
        }), {})
      } 

      return createToolTextContent(JSON.stringify(ret));
    }
  );
}
