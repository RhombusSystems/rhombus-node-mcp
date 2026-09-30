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
import { getLocations } from "../api/location-tool-api.js";
import DeviceType from "../types/deviceType.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/get-entity-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "get-entity-tool";

const TOOL_DESCRIPTION = `
Retrieves entities (or devices) of certain types — cameras, doorbell cameras, badge readers, access-controlled doors, audio gateways, door sensors, environmental sensors, motion sensors, buttons, keypads, environmental gateways. Can request multiple entity types at once. The return structure is a JSON string that contains the states (including names, UUIDs, location, model, firmware, connection status) of the requested entities. This data is exact.

**Primary use cases:**
1. **Looking up a device by name.** When the user mentions a specific camera, door, sensor, etc. by name (e.g. "describe camera 1919 Front Door Entrance", "what's the status of HW Lab door"), call this tool with the matching entityType, scan the returned list, and **fuzzy/case-insensitive substring match** the user's reference against the \`name\` field. Don't ask the user to clarify — try this lookup first, and only ask if there are genuinely multiple plausible matches in the results. To describe one device in depth (model, firmware, serial, network), pass \`detail: "full"\` together with a \`filterBy\` name predicate so only that device comes back at full size.
2. **Listing all devices of a type** (cameras, doors, sensors, etc.) for a location or org-wide. The default \`detail: "core"\` keeps lists compact (uuid, name, connection/health status, location, associations).
3. **Checking device health and connectivity.** Devices with a connection state include a \`connected\` boolean (true = online, false = offline). For "how many devices are offline?" / "which are offline?", pass \`filterBy: [{"field": "connected", "op": "=", "value": false}]\` — the returned list and its \`<type>Count\` sibling then reflect exactly the offline devices, so the count needs no manual tallying. For per-group questions ("per location", "which location has the most offline"), add \`groupBy: "locationUuid"\` to get exact server-computed counts per group — never tally rows yourself.
   Access-controlled doors are logical entities with no connection state of their own. For "offline doors", check the hardware that serves them — \`badge-reader\`, \`keypad\` and \`door-sensor\` — with the same filter, and relate each device to its door by name or location.

When the user asks to "describe", "look up", "find", "show me", or "tell me about" a named device, this is almost always the right starting tool — call it before asking the user for more specifics.`;

// Fields kept per device when detail is "core" (the default) — the union of
// the identifying/health/association fields across every entity type. Fields a
// type doesn't have are simply absent. "full" skips the projection entirely.
const CORE_FIELDS = new Set([
  "uuid",
  "name",
  "connectionStatus",
  "connected",
  "healthStatus",
  "healthStatusDetails",
  "locationUuid",
  "locationName",
  "floorNumber",
  "temperature",
  "humidity",
  "batteryStatus",
  "associatedCameras",
  "policyUuid",
  "remoteUnlockEnabled",
  "geofenceEnabled",
]);

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { entityTypes, timeZone, tempUnit, detail } = args;
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
  const locationNames = await getLocationNames(responses, requestModifiers, sessionId);

  // apply filters
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    // look through keys and find any with an array
    for (const key of Object.keys(response)) {
      const value = response[key];
      if (Array.isArray(value)) {
        // The upstream states only carry a 4-color connectionStatus
        // (RED = disconnected). Derive the uniform `connected` boolean the
        // description promises so "offline" questions are a filterBy, not a
        // model-side tally over the raw statuses.
        let items = value.map((item: any) =>
          item && typeof item === "object" && "connectionStatus" in item && !("connected" in item)
            ? { ...item, connected: item.connectionStatus !== "RED" }
            : item,
        );
        // States carry only locationUuid, so the advertised locationName filter matched nothing
        // and was dropped; a report draft then read every location's doors as one location's.
        items = items.map((item: any) =>
          item &&
          typeof item === "object" &&
          item.locationName == null &&
          locationNames.has(item.locationUuid)
            ? { ...item, locationName: locationNames.get(item.locationUuid) }
            : item,
        );

        if (detail !== "full") {
          items = items.map((item: any) =>
            Object.fromEntries(
              Object.entries(item).filter(([field]) => CORE_FIELDS.has(field)),
            ),
          );
        }

        response[key] = items;
        response[`${key}Count`] = items.length;
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

  return createToolStructuredContent<OUTPUT_SCHEMA>(ret);
};

async function getLocationNames(
  responses: Record<string, unknown>[],
  requestModifiers: Parameters<typeof getLocations>[0],
  sessionId: string | undefined,
): Promise<Map<string, string>> {
  const hasLocations = responses.some(response =>
    Object.values(response).some(
      value => Array.isArray(value) && value.some((item: any) => item?.locationUuid)
    )
  );
  if (!hasLocations) return new Map();

  try {
    const { locations } = await getLocations(requestModifiers, sessionId);
    return new Map(
      locations.flatMap(location =>
        location.uuid && location.name ? [[location.uuid, location.name] as const] : []
      )
    );
  } catch {
    // Names are a convenience for filtering and display; the entities stand without them.
    return new Map();
  }
}

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Get Entities",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
