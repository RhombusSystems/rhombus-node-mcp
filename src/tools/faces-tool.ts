import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import {
  GetRegisteredFacesArgs,
  GetFaceEventsArgs,
  TOOL_ARGS,
  ToolArgs,
  RequestType,
  OUTPUT_SCHEMA,
} from "../types/faces-tools-types.js";
import { getFaceEvents, getRegisteredFaces } from "../api/faces-tool-api.js";

const TOOL_NAME = "faces-tool";

// TODO: deviceUuids filter was removed, see TOOL_ARGS for reason
const TOOL_DESCRIPTION = `
This tool interacts with the Rhombus face recognition system to retrieve information about face sightings and registered faces. It has two primary modes of operation, determined by the "requestType" parameter:

It should only be used if someone is specifically asking about faces.  If they are asking about people or humans, you should use the events-tool with eventType "people" instead as this tool is for face sightings only.

If the requestType is "get-face-events":

Use this tool to answer questions about face sightings, including questions like "who was in the office" or "who was seen today".  Can be used for reporting, to generate a report on who was seen by the camera system.

This tool retrieves detailed face events such as detections and recognitions. It provides comprehensive information about each event, including details about the detected face, the person matched (if any), and the event context.

You can filter face events using parameters like 'faceNames', 'hasEmbedding', 'hasName', 'labels', 'locationUuids', 'personUuids', and a time range using 'rangeStart' and 'rangeEnd' (timestamps in milliseconds).

If you'd like to know about all face events at a location, pass in a location UUID and no device UUIDs. This will correctly return all face events at that location.

If the requestType is "get-registered-faces":

This tool retrieves a list of all people (registered faces) currently known to the Rhombus system for your organization. This list includes information about each registered person.

This is useful to call before calling "get-face-events" to get a list of all people that have been seen by the camera system, and then you can use personUuids or the name *in the system* to filter face events.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  let ret: any = {};
  if (args.requestType === RequestType.GET_FACE_EVENTS) {
    const response = await getFaceEvents(
      args.faceEventFilter as GetFaceEventsArgs,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    ret = {
      requestType: RequestType.GET_FACE_EVENTS,
      getFaceEventsResponse: response,
    };
  } else if (args.requestType === RequestType.GET_REGISTERED_FACES) {
    const response = await getRegisteredFaces(
      args as GetRegisteredFacesArgs,
      extra._meta?.requestModifiers as RequestModifiers,
      extra.sessionId
    );
    if (response.people) {
      ret = {
        requestType: RequestType.GET_REGISTERED_FACES,
        getSavedFacesResponse: response.people,
      };
    } else {
      ret = {
        requestType: RequestType.GET_REGISTERED_FACES,
        error: response.error,
      };
    }
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
    structuredContent: ret,
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
