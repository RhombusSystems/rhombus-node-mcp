import { postApi } from "../network.js";
import type { RequestModifiers } from "../util.js";
import type { TempUnit } from "../utils/temp.js";
import {
  getAccessControlledDoors,
  getAudioGateways,
  getBadgeReaders,
  getButtons,
  getCameraList,
  getDoorbellCameras,
  getDoorSensors,
  getEnvironmentalGateways,
  getEnvironmentalSensors,
  getKeypads,
  getMotionSensors,
} from "./get-entity-tool-api.js";

async function getDeviceFeatures(
  deviceUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const response = await postApi<{
    error: boolean;
    features?: {
      assignedLicense?: string;
      deviceUuid: string;
      featureMap?: Record<string, boolean>;
    };
  }>({
    route: "/feature/getDeviceFeatures",
    body: { deviceUuid },
    modifiers: requestModifiers,
    sessionId,
  });

  if (response.error || !response.features) {
    return null;
  }

  return {
    assignedLicense: response.features.assignedLicense,
    featureMap: response.features.featureMap,
  };
}

export async function getAllEntities(
  deviceUuids: string[],
  timeZone: string,
  tempUnit: TempUnit | null,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const promises = [
    getCameraList(requestModifiers, sessionId),
    getDoorbellCameras(requestModifiers, sessionId),
    getBadgeReaders(requestModifiers, sessionId),
    getAccessControlledDoors(requestModifiers, sessionId),
    getAudioGateways(timeZone, requestModifiers, sessionId),
    getDoorSensors(requestModifiers, sessionId),
    getEnvironmentalSensors(timeZone, tempUnit, requestModifiers, sessionId),
    getMotionSensors(requestModifiers, sessionId),
    getButtons(timeZone, requestModifiers, sessionId),
    getKeypads(requestModifiers, sessionId),
    getEnvironmentalGateways(timeZone, requestModifiers, sessionId),
  ];

  const responses = await Promise.all<Record<string, unknown>>(promises);

  // Filter each response to only include devices with matching UUIDs and fetch device features
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    // Look through keys and find any with an array
    for (const key of Object.keys(response)) {
      const value = response[key];
      if (Array.isArray(value)) {
        // Filter to only include devices with matching UUIDs
        const filteredDevices = value.filter((item: { uuid: string }) => {
          return deviceUuids.includes(item.uuid);
        });

        // Fetch device features for each filtered device
        const devicesWithFeatures = await Promise.all(
          filteredDevices.map(async (device: { uuid: string }) => {
            const features = await getDeviceFeatures(device.uuid, requestModifiers, sessionId);
            return {
              ...device,
              ...(features && {
                assignedLicense: features.assignedLicense,
                featureMap: features.featureMap,
              }),
            };
          })
        );

        response[key] = devicesWithFeatures;
        response[`${key}Count`] = devicesWithFeatures.length;
      }
    }
  }

  const result: Record<string, unknown> = {};
  for (const response of responses) {
    Object.assign(result, response);
  }
  return result;
}
