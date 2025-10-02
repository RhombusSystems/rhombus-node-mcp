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
This tool interacts with the Rhombus events system to retrieve information about various types of events within the system. It has 5 modes of operation, determined by the "eventType" parameter: access-control, environmental-gateway, climate-sensor, component-events, and camera

This tool should should be used any time someone is asking for specifics or reports for access control related events like unlocks, badge ins, credentials, arrivals etc., environmental gateway events, climate sensor events, camera motion events, or any other component events.

For maximum flexibility, use eventType "component-events" which allows querying any combination of event types (doorbell pushes, badge scans, door state changes, button presses, etc.) for a location.

This tool retrieves a list of events captured by the access control door system pertaining to arrivals, badge ins, credentials received, etc. 

This tool can return a lot of data. Please make sure the time range provided is not too large.
  This tool takes 3 arguments:
  * **accessControlledDoorUuid (string):** The unique identifier for the access controlled door.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start or earliest time of access control events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end or latest time of access control events.

  The tool returns a JSON object with access control events data.

When eventType is "environmental-gateway":

This tool retrieves environmental gateway events for a specific environmental gateway device within a time range. The data returned will have a timestamp that is in
the timezone of the **device**, not necessarily UTC time.

This tool takes 3 arguments:
  * **deviceUuid (string):** The unique identifier for the environmental gateway device.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.

The tool returns a JSON object with environmental gateway events data.

When eventType is "climate-sensor":

This tool retrieves climate sensor events for a specific climate sensor within a time range. The data returned will have a timestamp that is in
the timezone of the **sensor**, not necessarily UTC time.

This tool takes 4 arguments:
  * **sensorUuid (string):** The unique identifier for the climate sensor.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.
  * **limit (number, optional):** Maximum number of climate events to return. Default is 1000.

The tool returns a JSON object with climate sensor events data.

When eventType is "component-events":

This tool retrieves ALL types of component events for a specific location within a time range. This is the most flexible option and allows filtering by specific event types. The data returned will have a timestamp that is in the timezone of the **location**, not necessarily UTC time.

This tool takes 4 arguments:
  * **locationUuid (string):** The unique identifier for the location.
  * **componentEventTypes (array of strings, optional):** Array of event types to filter by. If empty or not provided, returns all event types.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.

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
  * And more...

When eventType is "camera":

This tool retrieves human motion events detected by a specific camera within a time range. The data returned will have timestamps in milliseconds.

This tool takes 3 arguments:
  * **cameraUuid (string):** The unique identifier for the camera.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **duration (number):** Duration in seconds to search for human motion events. Default is 3600 (1 hour).

The tool returns a JSON object with camera events data.
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
        };

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
