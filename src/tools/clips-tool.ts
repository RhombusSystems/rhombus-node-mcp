import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { ApiPayloadSchema, TOOL_ARGS, ToolArgs } from "../types/clips-tool-types.js";
import { getSavedClips, getExpiringClips } from "../api/clips-tool-api.js";

const TOOL_NAME = "clips-tool";

const TOOL_DESCRIPTION = `
Retrieves saved video clips from the Rhombus system. Saved clips can be viewed for up to 2 years and are typically found in the "Clips" tab of the "Saved Video" section of the Rhombus Console.
Clips are either manually saved by the user, or automatically by some defined policy. Therefore, this tool
is not for looking up the events that have occured.

This tool allows you to filter clips by:
* Whether or not they are expiring soon.
* Specific devices using their UUIDs.
* Specific locations using their UUIDs.
* A simple string search on clip names.
* A time range, specifying a start (timestampISOAfter) and/or end (timestampISOBefore) timestamp in ISO 8601 format.

The tool returns a JSON object with the following structure and important fields:
* **errorMsg (string | null):** An error message if the request failed.
* **objecterror (boolean | null):** Indicates if an object-level error occurred.
* **pageToken (string | null):** A token to be supplied on the next search request to get the next page of results. If this token is null, there is no more data available.
* **savedClips (array of objects | null):** An array where each object represents a saved video clip. Each clip object contains the following important fields:
    * **uuid (string):** The unique identifier for the video clip.
    * **title (string):** The name given to the video clip.
    * **description (string | null):** An optional description for the clip.
    * **timestampMs (int64):** The start time of the video clip in milliseconds since epoch.
    * **createdAtMs (int64):** The creation timestamp of the clip in milliseconds since epoch.
    * **createdAtTimestamp (string):** The creation timestamp of the clip in ISO 8601 format.
    * **deviceUuid (string):** The UUID of the primary device (e.g., camera) that recorded the clip.
    * **deviceUuids (array of strings or null):** A list of UUIDs for all devices associated with the clip.
    * **durationSec (int32):** The length of the video clip in seconds.
    * **status (string):** The current processing status of the clip, with possible values such as INITIATING, UPLOADING, RENDERING, FAILED, COMPLETE, OFFLINE, or UNKNOWN.
    * **userUuid (string | null):** The UUID of the user associated with the clip, if applicable.
    * **sourceAlertUuid (string | null):** The UUID of the alert that triggered the creation of this clip, if any.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const payload = ApiPayloadSchema.parse(args);
  let ret;
  switch (args.queryType) {
    case "saved":
      ret = await getSavedClips(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
    case "expiringSoon":
      ret = await getExpiringClips(
        payload,
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
