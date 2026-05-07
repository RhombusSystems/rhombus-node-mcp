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
Retrieves entities (or devices) of certain types — cameras, doorbell cameras, badge readers, access-controlled doors, audio gateways, door sensors, environmental sensors, motion sensors, buttons, keypads, environmental gateways. Can request multiple entity types at once. The return structure is a JSON string that contains the states (including names, UUIDs, location, model, firmware, connection status) of the requested entities. This data is exact.

**Primary use cases:**
1. **Looking up a device by name.** When the user mentions a specific camera, door, sensor, etc. by name (e.g. "describe camera 1919 Front Door Entrance", "what's the status of HW Lab door"), call this tool with the matching entityType, scan the returned list, and **fuzzy/case-insensitive substring match** the user's reference against the \`name\` field. Don't ask the user to clarify — try this lookup first, and only ask if there are genuinely multiple plausible matches in the results.
2. **Listing all devices of a type** (cameras, doors, sensors, etc.) for a location or org-wide.
3. **Checking device health and connectivity.** Each device includes a \`connected\` boolean (true = online, false = offline). For "which devices are offline?" / "is X online?" / health questions, fetch the relevant entityTypes and inspect \`connected\`.

When the user asks to "describe", "look up", "find", "show me", or "tell me about" a named device, this is almost always the right starting tool — call it before asking the user for more specifics.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { entityTypes, timeZone, tempUnit } = args;
  const filterBy = args.filterBy ?? { locationUuids: null };
  const locationFilter = filterBy.locationUuids;
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
          if (
            item.locationUuid &&
            locationFilter &&
            locationFilter.length > 0
          ) {
            pass = pass && locationFilter.includes(item.locationUuid);
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
