import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS, ToolArgs, OUTPUT_SCHEMA } from "../types/events-tools-types.js";
import {
  getAccessControlEvents,
  getEventsForEnvironmentalGateway,
} from "../api/events-tool-api.js";

const TOOL_NAME = "events-tool";

// "faces" | "people" | "human" | "access-control"
const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus events system to retrieve information about various types of events within the system. It has 2 modes of operation, determined by the "eventType" parameter: access-control and environmental-gateway

This tool should should be used any time someone is asking for specifics or reports for access control related events like unlocks, badge ins, credentials, arrivals etc. or environmental gateway events.

This tool retrieves a list of events captured by the access control door system pertaining to arrivals, badge ins, credentials received, etc. 

This tool can return a lot of data. Please make sure the time range provided is not too large.
  This tool takes 3 arguments:
  * **accessControlledDoorUuid (string):** The unique identifier for the access controlled door.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start or earliest time of access control events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end or latest time of access control events.

  The tool returns a JSON object with the following structure and important fields:
  * **componentEvents (array of objects | null):** An array where each object represents a single access control event. Each event object contains the following important fields:
      * **authenticationResult (string):** The result of the authentication process.
      * **authorizationResult (string):** The result of the authorization process.
      * **doorUuid (string):** The unique identifier for the access controlled door.
      * **locationUuid (string):** The unique identifier for the location where the event occurred.
      * **credentials (array of objects | null):** An array where each object represents a single credential. Each credential object contains the following important fields:
          * **credSource (string):** The source of the credential.
          * **credentialId (string):** The unique identifier for the credential.
          * **firstInEligible (boolean):** Whether the credential is eligible for first in.
          * **originator (string):** The originator of the event.
      * **originator (string):** The originator of the event.
      * **credentialUuid (string):** The unique identifier for the credential.
      * **credSource (string):** The source of the credential. Is what generated the event.
        - "BLE_WAVE" is a user badging in by physically waving their hand over the reader. This is presented as "Credential Received" in the web console.
        - "NFC" is a user badging in by tapping their badge or their phone on the reader. This is presented as "Credential Received" in the web console.
        - "REMOTE" is unlocking the door remotely through the Rhombus app. This is presented as "Mobile Remote Unlock" in the web console.
      * **datetime:** Datetime string of when the event occured.

When eventType is "environmental-gateway":

This tool retrieves environmental gateway events for a specific environmental gateway device within a time range.

This tool takes 3 arguments:
  * **deviceUuid (string):** The unique identifier for the environmental gateway device.
  * **startTime (string):** The timestamp (in ISO 8601 format) representing the start time of events.
  * **endTime (string):** The timestamp (in ISO 8601 format) representing the end time of events.

The tool returns a JSON object with the following structure:
  * **events (array of objects):** An array where each object represents a single environmental event containing sensor readings and derived values.
  * **lastEvaluatedKey (string | null):** A key for pagination if more results are available.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { eventType, accessControlledDoorUuid, deviceUuid, startTime, endTime } = args;

  if (eventType === "access-control") {
    if (!accessControlledDoorUuid) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              needUserInput: true,
              commandForUser: "Which door are you asking about?",
            }),
          },
        ],
      };
    } else {
      const events = await getAccessControlEvents(
        accessControlledDoorUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
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
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              needUserInput: true,
              commandForUser: "Which environmental gateway device are you asking about?",
            }),
          },
        ],
      };
    } else {
      const events = await getEventsForEnvironmentalGateway(
        deviceUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
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
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({}),
      },
    ],
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
