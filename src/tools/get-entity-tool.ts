import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import DeviceType from "../types/deviceType.js";
import { createToolTextContent, RequestModifiers } from "../util.js";
import { TOOL_ARGS, ToolArgs } from "../types/get-entity-tool-types.js";
import {
  getCameraList,
  getDoorbellCameras,
  getBadgeReaders,
  getAccessControlledDoors,
  getAudioGateways,
  getDoorSensors,
  getEnvironmentalSensors,
  getMotionSensors,
  getButtons,
  getKeypads,
} from "../api/get-entity-tool-api.js";

const TOOL_NAME = "get-entity-tool";

const TOOL_DESCRIPTION = `
Retrieves entities (or devices) of certain types.
Can request multiple entity types at once.
The return structure is a JSON string that continues the states of the requested entities.
This data is exact. Whatever entities exist will be returned here.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { entityTypes } = args;
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
    ...(await responses).reduce(
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
