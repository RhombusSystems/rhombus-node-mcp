import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import {
  GetRegisteredFacesArgs,
  GetFaceEventsArgs,
  TOOL_ARGS,
  ToolArgs,
  RequestType,
} from "../types/faces-tools-types.js";
import { getFaceEvents, getRegisteredFaces } from "../api/faces-tool-api.js";

const TOOL_NAME = "faces-tool";

const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus face recognition system to retrieve information about face sightings and registered faces. It has two primary modes of operation, determined by the "requestType" parameter:

It should only be used if someone is specifically asking about faces.  If they are asking about people or humans, you should use the events-tool with eventType "people" instead as this tool is for face sightings only.

If the requestType is "get-face-events":

  Use this tool to answer questions about face sightings, including questions like "who was in the office" or "who was seen today".  Can be used for reporting, to generate a report on who was seen by the camera system.

  This tool retrieves detailed face events such as detections and recognitions. It provides comprehensive information about each event, including details about the detected face, the person matched (if any), and the event context.

  You can filter face events using parameters like 'deviceUuids', 'faceNameContains', 'faceNames', 'hasEmbedding', 'hasName', 'labels', 'locationUuids', 'personUuids', and a time range using 'rangeStart' and 'rangeEnd' (timestamps in milliseconds).

  The tool returns a JSON object with the following structure and important fields:
  * **lastEvaluatedKey (string | null):** A key for pagination; if not null, it can be used to retrieve the next page of results.
  * **faceEvents (array of objects | null):** An array where each object represents a single face event. Each face event object contains the following important fields:
      * **uuid (string):** The unique identifier for this specific face event.
      * **eventTimestamp (int64):** The timestamp (in milliseconds since epoch) when the face event occurred.
      * **faceName (string | null):** The name of the person that matched the face image, if a match was found.
      * **personUuid (string | null):** The UUID of the person that matched the face image, if a match was found.
      * **deviceUuid (string):** The UUID of the device (e.g., camera) where the face event was detected.
      * **locationUuid (string | null):** The UUID of the location where the face event occurred.
      * **orgUuid (string | null):** The UUID of the organization associated with the event.
      * **detectionConfidence (float | null):** A confidence value (between 0.0 and 1.0) indicating the likelihood that the detected image is a face.
      * **thumbnailS3Key (string | null):** The S3 key for accessing the thumbnail image of the detected face.
      * **selectedPersonMatch (object | null):** An object containing details about the top person match found for the face image, if any. Important fields within this object include:
          * **confidence (float | null):** The match confidence level, expressed as a value in the range [0,1].
          * **faceId (string | null):** The face ID of the matched person.
          * **name (string | null):** The name of the matched person.
          * **uuid (string | null):** The UUID of the matched person.

If the requestType is "get-registered-faces":

  This tool retrieves a list of all people (registered faces) currently known to the Rhombus system for your organization. This list includes information about each registered person.

  This tool takes no arguments.

  The tool returns a JSON object with the following structure and important fields:
  * **people (array of objects | null):** An array where each object represents a registered person. Each person object contains the following important fields:
      * **uuid (string):** The unique identifier for the registered person.
      * **name (string | null):** The name associated with the registered person.
      * **createdOn (date-time | null):** The date and time when the person was registered.
      * **updatedOn (date-time | null):** The date and time when the person's information was last updated.
      * **orgUuid (string | null):** The UUID of the organization to which the person belongs.

`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  let ret: any = {};
  if (args.requestType === RequestType.GET_FACE_EVENTS) {
    ret = await getFaceEvents(
      args as GetFaceEventsArgs,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
  } else if (args.requestType === RequestType.GET_REGISTERED_FACES) {
    ret = await getRegisteredFaces(
      args as GetRegisteredFacesArgs,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
