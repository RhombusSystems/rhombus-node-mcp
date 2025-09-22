import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessControlEvents,
  getEventsForEnvironmentalGateway,
  getClimateEventsForSensor,
  getComponentEventsByLocation,
} from "../api/events-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/events-tools-types.js";
import type { RequestModifiers } from "../util.js";

const TOOL_NAME = "events-tool";

// "faces" | "people" | "human" | "access-control"
const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus events system to retrieve information about various types of events within the system. It has 4 modes of operation, determined by the "eventType" parameter: access-control, environmental-gateway, climate-sensor, and component-events

This tool should should be used any time someone is asking for specifics or reports for access control related events like unlocks, badge ins, credentials, arrivals etc., environmental gateway events, climate sensor events, or any other component events.

For maximum flexibility, use eventType "component-events" which allows querying any combination of event types (doorbell pushes, badge scans, door state changes, button presses, etc.) for a location.

This tool retrieves a list of events captured by the access control door system pertaining to arrivals, badge ins, credentials received, etc. 

This tool can return a lot of data. Please make sure the time range provided is not too large.
  This tool takes 3 arguments:
  * **accessControlledDoorUuid (string):** The unique identifier for the access controlled door.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start or earliest time of access control events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end or latest time of access control events.

  The tool returns a JSON object with the following structure and important fields:
  * **accessControlEvents (array of objects | null):** An array where each object represents a single access control event. Each event object contains the following important fields:
      * **authenticationResult (string):** The result of the authentication process.
      * **authorizationResult (string):** The result of the authorization process.
      * **doorUuid (string):** The unique identifier for the access controlled door.
      * **locationUuid (string):** The unique identifier for the location where the event occurred.
      * **user (string):** The username of the person who triggered the event.
      * **credSource (string):** The source of the credential. Is what generated the event.
        - "BLE_WAVE" is a user badging in by physically waving their hand over the reader. This is presented as "Credential Received" in the web console.
        - "NFC" is a user badging in by tapping their badge or their phone on the reader. This is presented as "Credential Received" in the web console.
        - "REMOTE" is unlocking the door remotely through the Rhombus app. This is presented as "Mobile Remote Unlock" in the web console.
      * **datetime:** Datetime string of when the event occured.

When eventType is "environmental-gateway":

This tool retrieves environmental gateway events for a specific environmental gateway device within a time range. The data returned will have a timestamp that is in
the timezone of the **device**, not necessarily UTC time.

This tool takes 3 arguments:
  * **deviceUuid (string):** The unique identifier for the environmental gateway device.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.

The tool returns a JSON object with the following structure:
  * **events (array of objects):** An array where each object represents a single environmental event containing sensor readings and derived values.
  * **lastEvaluatedKey (string | null):** A key for pagination if more results are available.

When eventType is "climate-sensor":

This tool retrieves climate sensor events for a specific climate sensor within a time range. The data returned will have a timestamp that is in
the timezone of the **sensor**, not necessarily UTC time.

This tool takes 4 arguments:
  * **sensorUuid (string):** The unique identifier for the climate sensor.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.
  * **limit (number, optional):** Maximum number of climate events to return. Default is 1000.

The tool returns a JSON object with the following structure:
  * **climateSensorEvents (array of objects):** An array where each object represents a single climate event containing sensor readings such as:
      * **timestampString:** Human-readable formatted timestamp
      * **temp:** Temperature reading in Celsius
      * **humidity:** Relative humidity percentage
      * **co2:** CO2 concentration in PPM
      * **pm25:** PM2.5 particulate matter reading
      * **tvoc:** Total Volatile Organic Compounds
      * **iaq:** Indoor Air Quality index
      * **vapeSmokeDetected:** Whether vape or smoke was detected
      * **thcDetected:** Whether THC was detected
      * **batteryPercentage:** Battery level percentage
      * And other sensor readings

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

The tool returns a JSON object with the following structure:
  * **componentEvents (array of objects | null):** An array where each object represents a component event, sorted by timestamp (newest first). Each event contains base fields plus event-specific fields based on the event type.
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
  } = args;

  if (eventType === "access-control") {
    if (!accessControlledDoorUuids || accessControlledDoorUuids.length === 0) {
      const result = {
        needUserInput: true,
        commandForUser: "Which door are you asking about?",
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
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
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }
  } else if (eventType === "environmental-gateway") {
    if (!deviceUuid) {
      const result = {
        needUserInput: true,
        commandForUser: "Which environmental gateway device are you asking about?",
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    } else {
      const events = await getEventsForEnvironmentalGateway(
        deviceUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      const result = {
        eventType: "environmental-gateway",
        environmentalGatewayEvents: events,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }
  } else if (eventType === "climate-sensor") {
    if (!sensorUuid) {
      const result = {
        needUserInput: true,
        commandForUser: "Which climate sensor are you asking about?",
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    } else {
      const events = await getClimateEventsForSensor(
        sensorUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        limit ?? null,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      const result = {
        eventType: "climate-sensor",
        climateSensorEvents: events,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }
  } else if (eventType === "component-events") {
    if (!locationUuid) {
      const result = {
        needUserInput: true,
        commandForUser: "Which location are you asking about?",
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
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
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
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
