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

  // Filter each response to only include devices with matching UUIDs
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    // Look through keys and find any with an array
    for (const key of Object.keys(response)) {
      const value = response[key];
      if (Array.isArray(value)) {
        // Filter to only include devices with matching UUIDs
        response[key] = value.filter((item: { uuid: string }) => {
          return deviceUuids.includes(item.uuid);
        });

        response[`${key}Count`] = (response[key] as unknown[]).length;
      }
    }
  }

  const result: Record<string, unknown> = {};
  for (const response of responses) {
    Object.assign(result, response);
  }
  return result;
}
