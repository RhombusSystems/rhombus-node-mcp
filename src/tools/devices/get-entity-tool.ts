import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BASE_URL, postApi } from "../../network.js";
import { createToolArgs, createToolTextContent } from "../../util.js";
import DeviceType from "../../types/deviceType.js";

async function getCameraList(requestModifiers?: any) {
  return {
    cameras: (await postApi("/camera/getMinimalCameraStateList", "{}", requestModifiers)).cameraStates.filter(
      (camera: { locationUuid?: string }) => !!camera.locationUuid
    ),
  };
}

async function getDoorbellCameras(requestModifiers?: any) {
  return {
    doorbellCameras: (await postApi("/doorbellcamera/getMinimalStateList", "{}", requestModifiers)).minimalStates.filter(
      (doorbellCamera: { locationUuid?: string }) => !!doorbellCamera.locationUuid
    ),
  };
}

async function getBadgeReaders(requestModifiers?: any) {
  return await postApi("/badgereader/getMinimalStateList", "{}", requestModifiers).then(response => {
    return {
      badgeReaders: response.minimalStates.filter(
        (badgeReader: { locationUuid?: string }) => !!badgeReader.locationUuid
      ),
    };
  });
}

async function getAccessControlledDoors(requestModifiers?: any) {
  return await postApi("/component/findAccessControlledDoors", "{}", requestModifiers);
}

async function getAudioGateways(requestModifiers?: any) {
  return await postApi("/audiogateway/getMinimalAudioGatewayStateList", "{}", requestModifiers).then(response => {
    return {
      audioGateways: response.audioGatewayStates.filter(
        (camera: { locationUuid?: string }) => !!camera.locationUuid
      ),
    };
  });
}

async function getDoorSensors(requestModifiers?: any) {
  return await postApi("/door/getMinimalDoorStateList", "{}", requestModifiers).then(response => {
    return {
      doorStates: response.doorStates.filter(
        (door: { locationUuid?: string }) => !!door.locationUuid
      ),
    };
  });
}

async function getEnvironmentalSensors(requestModifiers?: any) {
  return await postApi("/climate/getMinimalClimateStateList", "{}", requestModifiers).then(response => {
    return {
      climateStates: response.climateStates.filter(
        (sensor: { locationUuid?: string }) => !!sensor.locationUuid
      ),
    };
  });
}

async function getMotionSensors(requestModifiers?: any) {
  return await postApi("/occupancy/getMinimalOccupancySensorStateList", "{}", requestModifiers).then(response => {
    return {
      occupancySensorStates: response.occupancySensorStates.filter(
        (occupancySensor: { locationUuid?: string }) => !!occupancySensor.locationUuid
      ),
    };
  });
}

async function getButtons(requestModifiers?: any) {
  return await postApi("/button/getMinimalButtonStateList", "{}", requestModifiers).then(response => {
    return {
      buttonStates: response.states.filter(
        (button: { locationUuid?: string }) => !!button.locationUuid
      ),
    };
  });
}

async function getKeypads(requestModifiers?: any) {
  return await postApi("/keypad/getKeypadsForOrg", "{}", requestModifiers).then(response => {
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
    createToolArgs({
      entityTypes: z
        .array(z.nativeEnum(DeviceType).describe("The entity type to retreive"))
        .describe("What type of entities to retrieve."),
    }),
    async ({ entityTypes, requestModifiers }) => {
      const promises = [];
      if (entityTypes.includes(DeviceType.CAMERA)) {
        promises.push(getCameraList(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.DOORBELL_CAMERA)) {
        promises.push(getDoorbellCameras(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.BADGE_READER)) {
        promises.push(getBadgeReaders(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.ACCESS_CONTROL_DOOR)) {
        promises.push(getAccessControlledDoors(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.AUDIO_GATEWAY)) {
        promises.push(getAudioGateways(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.DOOR_SENSOR)) {
        promises.push(getDoorSensors(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.ENVIRONMENTAL_SENSOR)) {
        promises.push(getEnvironmentalSensors(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.MOTION_SENSOR)) {
        promises.push(getMotionSensors(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.BUTTON)) {
        promises.push(getButtons(requestModifiers));
      }
      if (entityTypes.includes(DeviceType.KEYPAD)) {
        promises.push(getKeypads(requestModifiers));
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
