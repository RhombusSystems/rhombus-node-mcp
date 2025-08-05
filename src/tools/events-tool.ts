import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { TOOL_ARGS, ToolArgs } from "../types/events-tools-types.js";
import { getAccessControlEvents } from "../api/events-tool-api.js";

const TOOL_NAME = "events-tool";

// "faces" | "people" | "human" | "access-control"
const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus events system to retrieve information about various types of events within the system. It has 1 mode of operation, determined by the "eventType" parameter: access-control

This tool should should be used any time someone is asking for specifics or reports for access control related events like unlocks, badge ins, credentials, arrivals etc.

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
`;
// * **timestampMs:** The timestamp (in milliseconds since epoch) when the event occurred.
// * **datetime:** Datetime string of when the event occured.

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { eventType, accessControlledDoorUuid, startTime, endTime } = args;

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
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(events),
          },
        ],
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
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
