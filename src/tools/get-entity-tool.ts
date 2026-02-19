import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
} from "../api/get-entity-tool-api.js";
import DeviceType from "../types/deviceType.js";
import { TOOL_ARGS, type ToolArgs } from "../types/get-entity-tool-types.js";
import { createToolTextContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "get-entity-tool";

const TOOL_DESCRIPTION = `
Retrieves entities (or devices) of certain types.
Can request multiple entity types at once.
The return structure is a JSON string that contains the states of the requested entities.
This data is exact. Whatever entities exist will be returned here.

This is the primary tool for checking device health and connectivity status. Each device in the response
includes a "connected" boolean field indicating whether it is currently online (true) or offline (false).
When asked about device health, offline devices, or connectivity issues, use this tool to fetch all device
types and check the "connected" field to identify which devices are offline or unreachable.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { entityTypes, timeZone, filterBy, tempUnit } = args;
  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

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
    promises.push(getAudioGateways(timeZone, requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.DOOR_SENSOR)) {
    promises.push(getDoorSensors(requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.ENVIRONMENTAL_SENSOR)) {
    promises.push(getEnvironmentalSensors(timeZone, tempUnit, requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.MOTION_SENSOR)) {
    promises.push(getMotionSensors(requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.BUTTON)) {
    promises.push(getButtons(timeZone, requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.KEYPAD)) {
    promises.push(getKeypads(requestModifiers, sessionId));
  }
  if (entityTypes.includes(DeviceType.ENVIRONMENTAL_GATEWAY)) {
    promises.push(getEnvironmentalGateways(timeZone, requestModifiers, sessionId));
  }
  const responses = await Promise.all<Record<string, unknown>>(promises);

  // apply filters
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    // look through keys and find any with an array
    for (const key of Object.keys(response)) {
      const value = response[key];
      if (Array.isArray(value)) {
        // then filter
        response[key] = value.filter((item: any) => {
          let pass = true;
          if (item.locationUuid && filterBy.locationUuids && filterBy.locationUuids.length > 0) {
            pass = pass && filterBy.locationUuids.includes(item.locationUuid);
          }
          return pass;
        });

        response[`${key}Count`] = (response[key] as unknown[]).length;
      }
    }
  }

  const ret = {
    ...responses.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr,
      }),
      {}
    ),
  };

  return createToolTextContent(JSON.stringify(ret));
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
