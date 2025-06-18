import { z } from "zod";
import { BASE_URL, postApi } from "../network.js";
import { createToolArgs } from "../util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

enum RequestType {
  GET_FACE_EVENTS = "get-face-events",
  GET_REGISTERED_FACES = "get-registered-faces",
}

// Zod Schema for 'get-registered-faces' arguments (no specific args)
const GetRegisteredFacesArgsSchema = z.object({
  requestType: z.literal(RequestType.GET_REGISTERED_FACES),
});
type GetRegisteredFacesArgs = z.infer<typeof GetRegisteredFacesArgsSchema>;

// --- GetFaceEventsArgs Schema ---
// All 'get-face-events' specific arguments are directly in this object,
// marked as nullable since they are conditional based on requestType.
const GetFaceEventsArgs = z.object({
  // Arguments for 'get-face-events' (flattened from original searchFilter)
  deviceUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "Optional filter by a set of device UUIDs. Only face events from these devices will be returned. Applicable when requestType is 'get-face-events'."
    ),
  faceNameContains: z
    .string()
    .nullable()
    .describe(
      "Optional filter for face events where the detected face's name contains this substring. The search is performed only if the value is at least 3 characters long after trimming spaces. This takes precedence over 'faceNames' if both are specified. Applicable when requestType is 'get-face-events'."
    ),
  faceNames: z
    .array(z.string())
    .nullable()
    .describe(
      "Optional filter by a set of specific person names. Only face events associated with these names will be returned. Applicable when requestType is 'get-face-events'."
    ),
  hasEmbedding: z
    .boolean()
    .nullable()
    .describe(
      "Optional filter by the presence (true) or absence (false) of a face embedding associated with the event. Applicable when requestType is 'get-face-events'."
    ),
  hasName: z
    .boolean()
    .nullable()
    .describe(
      "Optional filter by the presence (true) or absence (false) of a person name associated with the face event. Applicable when requestType is 'get-face-events'."
    ),
  labels: z
    .array(z.string())
    .nullable()
    .describe(
      "Optional filter by a set of labels associated with the face event. Applicable when requestType is 'get-face-events'."
    ),
  locationUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "Optional filter by a set of location UUIDs. Only face events from these locations will be returned. Applicable when requestType is 'get-face-events'."
    ),
  personUuids: z
    .array(z.string())
    .nullable()
    .describe(
      "Optional filter by a set of person UUIDs. Only face events associated with these specific people will be returned. Applicable when requestType is 'get-face-events'."
    ),

  // Arguments for 'get-face-events' (flattened from original timestampFilter)
  rangeEnd: z
    .string()
    .nullable()
    .describe(
      "The end of the time range (inclusive) for filtering face events. Expected format is a string containing a timestamp in milliseconds since epoch. Applicable when requestType is 'get-face-events'. If not specified, the filter defaults to the last 7 days."
    ),
  rangeStart: z
    .string()
    .nullable()
    .describe(
      "The start of the time range (inclusive) for filtering face events. Expected format is a string containing a timestamp in milliseconds since epoch. Applicable when requestType is 'get-face-events'. If not specified, the filter defaults to the last 7 days."
    ),
  // No specific arguments for 'get-registered-faces' beyond requestType itself.
});
type GetFaceEventsArgs = z.infer<typeof GetFaceEventsArgs>;

// --- Extracted PostAPI Calls into Functions ---

async function getFaceEvents(args: GetFaceEventsArgs, requestModifiers?: any) {
  const url = BASE_URL + "/faceRecognition/faceEvent/findFaceEventsByOrg";
  // Directly pass the args object as requested by the user
  return await postApi(url, JSON.stringify(args), requestModifiers);
}

async function getRegisteredFaces(args: GetRegisteredFacesArgs, requestModifiers?: any) {
  const url = BASE_URL + "/faceRecognition/person/findPeopleByOrg";
  // No specific arguments for this API call, so send an empty object.
  return await postApi(url, JSON.stringify({}), requestModifiers);
}

// --- Main Tool Definition ---

export function createTool(server: McpServer) {
  server.tool(
    "faces-tool",
    `
This tool interacts with the Rhombus face recognition system to retrieve information about face events and registered faces. It has two primary modes of operation, determined by the "requestType" parameter:

If the requestType is "get-face-events":

  This tool retrieves detailed face events recorded by your Rhombus cameras, such as detections and recognitions. It provides comprehensive information about each event, including details about the detected face, the person matched (if any), and the event context.

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

`,
    // FacesToolArgs directly passed here
    createToolArgs({
      requestType: z.nativeEnum(RequestType),
      args: z.union([
        z.object({
          args: GetFaceEventsArgs,
        }),
        z.object({
          requestType: z.literal(RequestType.GET_REGISTERED_FACES),
          args: GetRegisteredFacesArgsSchema,
        }),
      ]),
    }),
    async ({ requestModifiers, requestType, args }) => {
      let ret;
      if (requestType === "get-face-events") {
        // Pass the args directly, as requested
        ret = await getFaceEvents(args as unknown as GetFaceEventsArgs, requestModifiers);
      } else if (requestType === "get-registered-faces") {
        // Pass the args (will effectively be an empty object for this call)
        ret = await getRegisteredFaces(args as unknown as GetRegisteredFacesArgs, requestModifiers);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(ret) }],
      };
    }
  );
}
