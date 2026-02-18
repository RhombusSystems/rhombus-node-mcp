import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessControlEvents,
  getEventsForEnvironmentalGateway,
  getClimateEventsForSensor,
  getComponentEventsByLocation,
  getHumanMotionEvents,
} from "../api/events-tool-api.js";
import {
  EventsToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/events-tools-types.js";
import { createToolStructuredContent, type RequestModifiers } from "../util.js";
import { getLogger } from "../logger.js";
import { TempUnit } from "../utils/temp.js";

const logger = getLogger("events-tool");

const TOOL_NAME = "events-tool";

// "faces" | "people" | "human" | "access-control"
const TOOL_DESCRIPTION = `
**Scope:** This tool returns **raw, event-level data** (individual events with timestamps). Use **report-tool** when you need aggregated counts, time-series summaries, or analytics over intervals.

This tool has 5 modes, set by "eventType": access-control, environmental-gateway, climate-sensor, component-events, camera. Use it when the user asks for specific events (unlocks, badge ins, credentials, arrivals, environmental readings, climate data, camera motion, or other component events). It can return large result sets; keep time ranges narrow. For ranges spanning more than ~24 hours, prefer report-tool for aggregates. For maximum flexibility across event types at a location, use eventType "component-events".

---

When eventType is "access-control":

Retrieves access control events (arrivals, badge ins, credentials, unlocks) for the given door(s). Can return a lot of data—use a narrow time range.

Arguments:
  * **accessControlledDoorUuids (array of strings):** UUIDs of the access-controlled doors.
  * **startTime (string):** Start of the time range (ISO 8601).
  * **endTime (string):** End of the time range (ISO 8601).

The \`credSource\` field indicates how the event was triggered:
  * **REMOTE:** Rhombus Key app remote unlock.
  * **REMOTE (Admin):** Unlock via Rhombus console or browser/mobile app.
  * **BLE_WAVE:** User waved hand over the reader.
  * **NFC:** User tapped badge or phone on the reader.

---

Retrieves environmental gateway events (sensor readings, derived values) for a device in a time range. Timestamps are in the **device** timezone, not necessarily UTC.

Arguments:
  * **deviceUuid (string):** UUID of the environmental gateway device.
  * **startTime (string):** Start of range (ISO 8601).
  * **endTime (string):** End of range (ISO 8601).

---

When eventType is "climate-sensor":

Retrieves climate sensor events (temperature, humidity, air quality, etc.) for a sensor in a time range. Timestamps are in the **sensor** timezone, not necessarily UTC.

Arguments:
  * **sensorUuid (string):** UUID of the climate sensor.
  * **startTime (string):** Start of range (ISO 8601).
  * **endTime (string):** End of range (ISO 8601).
  * **limit (number, optional):** Max events to return. Default 1000.

---

When eventType is "component-events":

Retrieves all component event types for a location in a time range. Most flexible option; filter by event type via componentEventTypes. Timestamps are in the **location** timezone, not necessarily UTC.

Arguments:
  * **locationUuid (string):** UUID of the location.
  * **componentEventTypes (array, optional):** Event types to include. If empty or omitted, returns all types.
  * **startTime (string):** Start of range (ISO 8601).
  * **endTime (string):** End of range (ISO 8601).

Valid event types include:
  * **DoorbellEvent:** Doorbell button press events
  * **CredentialReceivedEvent:** Badge/credential scans (NFC, BLE_WAVE, REMOTE unlocks)
  * **DoorStateChangeEvent:** Door state changes (locked/unlocked)
  * **ButtonEvent:** Generic button press events
  * **PanicButtonEvent:** Panic/emergency button activations
  * **DoorReaderStateChangeEvent:** Changes in door reader state
  * **DoorRelayStateChangeEvent:** Changes in door relay state
  * **AccessControlUnitTamperEvent:** Tamper detection events
  * **AccessControlUnitBatteryStateChangeEvent:** Battery state changes
  * **WaveToUnlockIntentExpiredEvent:** Wave-to-unlock timeout events
  * **DoorAuthFirstInStateEvent:** First-in authentication state events
  * **DoorScheduleFirstInStateEvent:** First-in schedule state events
  * And more (see input schema for full list).

---

When eventType is "camera":

Retrieves human motion events for a camera in a time range. Timestamps in milliseconds.

Arguments:
  * **cameraUuid (string):** UUID of the camera.
  * **startTime (string):** Start of range (ISO 8601).
  * **duration (number):** Search window in seconds. Default 3600 (1 hour).
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const {
    eventType,
    accessControlledDoorUuids,
    deviceUuid,
    sensorUuid,
    locationUuid,
    componentEventTypes,
    startTime,
    endTime,
    limit,
    timeZone,
    tempUnit,
    cameraUuid,
    duration,
  } = args;

  logger.debug(`eventType: ${eventType}`);

  switch (eventType) {
    case "access-control": {
      if (!accessControlledDoorUuids || accessControlledDoorUuids.length === 0) {
        const result = {
          needUserInput: true,
          commandForUser: "Which door are you asking about?",
        };
        return createToolStructuredContent(result);
      } else {
        const events = await getAccessControlEvents(
          accessControlledDoorUuids,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        const result = {
          eventType: "access-control",
          accessControlEvents: events,
        };

        return createToolStructuredContent(result);
      }
    }
    case "environmental-gateway": {
      if (!deviceUuid) {
        const result = {
          needUserInput: true,
          commandForUser: "Which environmental gateway device are you asking about?",
        };

        return createToolStructuredContent(result);
      } else {
        const events = await getEventsForEnvironmentalGateway(
          deviceUuid,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          tempUnit ?? TempUnit.CELSIUS,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        const result = {
          eventType: "environmental-gateway",
          environmentalGatewayEvents: events,
        } as OUTPUT_SCHEMA;

        return createToolStructuredContent<OUTPUT_SCHEMA>(result);
      }
    }
    case "climate-sensor": {
      if (!sensorUuid) {
        const result = {
          needUserInput: true,
          commandForUser: "Which climate sensor are you asking about?",
        };

        return createToolStructuredContent(result);
      } else {
        const events = await getClimateEventsForSensor(
          sensorUuid,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          limit ?? null,
          timeZone,
          tempUnit ?? TempUnit.CELSIUS,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        const result = {
          eventType: "climate-sensor",
          climateSensorEvents: events,
        };

        return createToolStructuredContent(result);
      }
    }
    case "component-events": {
      if (!locationUuid) {
        const result = {
          needUserInput: true,
          commandForUser: "Which location are you asking about?",
        };

        return createToolStructuredContent(result);
      } else {
        const events = await getComponentEventsByLocation(
          locationUuid,
          componentEventTypes || [],
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        const result = {
          eventType: "component-events",
          componentEvents: events,
        };
        return createToolStructuredContent(result);
      }
    }
    case EventsToolRequestType.CAMERA: {
      if (!cameraUuid) {
        const result = {
          needUserInput: true,
          commandForUser: "Which camera are you asking about?",
        };

        return createToolStructuredContent(result);
      } else {
        const events = await getHumanMotionEvents(
          cameraUuid,
          duration ?? 3600, // Default to 1 hour if not provided
          startTime ? new Date(startTime).getTime() : Date.now() - 3600000, // Default to 1 hour ago if not provided
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );

        return createToolStructuredContent<OUTPUT_SCHEMA>({
          eventType: "camera",
          cameraEvents: events.uniqueHumanEvents,
        });
      }
    }
  }

  // This should not happen, but return empty result if eventType is unknown
  const result = {};
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result),
      },
    ],
    structuredContent: result,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
