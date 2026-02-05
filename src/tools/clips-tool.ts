import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";
import {
	ApiPayloadSchema,
	OUTPUT_SCHEMA,
	TOOL_ARGS,
	type OutputSchema,
	type ToolArgs,
} from "../types/clips-tool-types.js";
import {
	getSavedClips,
	getExpiringClips,
	getSharedLiveStreams,
	getTimelapseClips,
} from "../api/clips-tool-api.js";

const TOOL_NAME = "clips-tool";

const TOOL_DESCRIPTION = `
Retrieves saved video clips from the Rhombus system. Saved clips can be viewed for up to 2 years and are typically found in the "Clips" tab of the "Saved Video" section of the Rhombus Console.
Clips are either manually saved by the user, or automatically by some defined policy. Therefore, this tool
is not for looking up the events that have occured.

This tool allows you to:
* Get saved clips or clips expiring soon (filter by devices, locations, search string, time range).
* Get all shared live video streams for the organization.
* Get all timelapse clips for the organization.

Filter options (for saved and expiringSoon only):
* Specific devices using their UUIDs (deviceUuidFilters).
* Specific locations using their UUIDs (locationUuidFilters).
* A simple string search on clip names (searchFilter).
* A time range: start (timestampISOAfter) and/or end (timestampISOBefore) timestamp in ISO 8601 format.

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
* **sharedLiveVideoStreams (array):** When requestType is sharedLiveStreams, list of shared live video stream objects.
* **timelapseClips (array):** When requestType is timelapseClips, list of timelapse clip objects.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	const payload = ApiPayloadSchema.parse(args);
	switch (args.requestType) {
		case "saved": {
			return createToolStructuredContent<OutputSchema>(
				await getSavedClips(payload, requestModifiers, sessionId),
			);
		}
		case "expiringSoon":
			return createToolStructuredContent<OutputSchema>(
				await getExpiringClips(payload, requestModifiers, sessionId),
			);
		case "sharedLiveStreams":
			return createToolStructuredContent<OutputSchema>(
				await getSharedLiveStreams(payload, requestModifiers, sessionId),
			);
		case "timelapseClips":
			return createToolStructuredContent<OutputSchema>(
				await getTimelapseClips(payload, requestModifiers, sessionId),
			);
	}

	return createToolStructuredContent<OutputSchema>({
		error: "Invalid requestType",
	});
};

export function createTool(server: McpServer) {
  server.registerTool(TOOL_NAME, {
    description: TOOL_DESCRIPTION,
    inputSchema: TOOL_ARGS,
    outputSchema: OUTPUT_SCHEMA.shape,
  }, TOOL_HANDLER);
}
