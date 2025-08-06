import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import DeviceType from "../types/deviceType.js";
import { createToolTextContent, RequestModifiers, filterIncludedFields } from "../util.js";
import { generateEndpointToKeysWorkflowText } from "../utils/reduce-output.js";
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
  getEnvironmentalGateways,
} from "../api/get-entity-tool-api.js";

const TOOL_NAME = "get-entity-tool";

const ENDPOINT_MAP = {
  CAMERA: "POST /api/camera/getMinimalCameraStateList",
  DOORBELL_CAMERA: "POST /api/doorbellcamera/getMinimalStateList",
  BADGE_READER: "POST /api/badgereader/getMinimalStateList",
  ACCESS_CONTROL_DOOR: "POST /api/component/findAccessControlledDoors",
  AUDIO_GATEWAY: "POST /api/audiogateway/getMinimalAudioGatewayStateList",
  DOOR_SENSOR: "POST /api/door/getMinimalDoorStateList",
  ENVIRONMENTAL_SENSOR: "POST /api/climate/getMinimalClimateStateList",
  MOTION_SENSOR: "POST /api/occupancy/getMinimalOccupancySensorStateList",
  BUTTON: "POST /api/button/getMinimalButtonStateList",
  KEYPAD: "POST /api/keypad/getKeypadsForOrg",
  ENVIRONMENTAL_GATEWAY: "POST /api/climate/getMinimalEnvironmentalGatewayStates",
};

const WORKFLOW_TEXT = generateEndpointToKeysWorkflowText(ENDPOINT_MAP);

const TOOL_DESCRIPTION = `
Retrieves entities (or devices) of certain types.
Can request multiple entity types at once.
The return structure is a JSON string that contains the states of the requested entities.
This data is exact. Whatever entities exist will be returned here.

${WORKFLOW_TEXT}`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { entityTypes, includeFields } = args;
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
  if (entityTypes.includes(DeviceType.ENVIRONMENTAL_GATEWAY)) {
    promises.push(getEnvironmentalGateways(requestModifiers, sessionId));
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

  return createToolTextContent(
    JSON.stringify(
      includeFields && includeFields.length > 0 ? filterIncludedFields(ret, includeFields) : ret
    )
  );
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
