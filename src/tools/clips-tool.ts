import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

const ClipsArgs = z.object({
  deviceUuidFilters: z
    .array(z.string())
    .optional()
    .describe(
      "A list of UUIDs representing specific devices to filter clips by. Only clips emitted by these devices will be returned."
    ),
  locationUuidFilters: z
    .array(z.string())
    .optional()
    .describe(
      "A list of UUIDs representing specific locations to filter clips by. Only clips associated with these locations will be returned."
    ),

  searchFilter: z
    .string()
    .optional()
    .describe("A simple string to search for within the names of the clips."),

  timestampMsAfter: z
    .number()
    .describe(
      "The start of the time range (in milliseconds since epoch) for which to retrieve clips. Only clips that occurred AFTER this timestamp will be returned."
    ),
  timestampMsBefore: z
    .number()
    .describe(
      "The end of the time range (in milliseconds since epoch) for which to retrieve clips. Only clips that occurred BEFORE this timestamp will be returned."
    ),
});
type ClipsArgs = z.infer<typeof ClipsArgs>;

async function getSavedClips(args: ClipsArgs, requestModifiers?: any) {
  return await postApi("/event/getClipsWithProgress", args, requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "clips-tool",
    `
Retrieves saved video clips from the Rhombus system. Saved clips can be viewed for up to 2 years and are typically found in the "Clips" tab of the "Saved Video" section of the Rhombus Console.

This tool allows you to filter clips by:
* Specific devices using their UUIDs.
* Specific locations using their UUIDs.
* A simple string search on clip names.
* A time range, specifying a start (timestampMsAfter) and/or end (timestampMsBefore) timestamp in milliseconds since epoch.

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
    * **deviceUuid (string):** The UUID of the primary device (e.g., camera) that recorded the clip.
    * **deviceUuids (array of strings or null):** A list of UUIDs for all devices associated with the clip.
    * **durationSec (int32):** The length of the video clip in seconds.
    * **status (string):** The current processing status of the clip, with possible values such as INITIATING, UPLOADING, RENDERING, FAILED, COMPLETE, OFFLINE, or UNKNOWN.
    * **userUuid (string | null):** The UUID of the user associated with the clip, if applicable.
    * **sourceAlertUuid (string | null):** The UUID of the alert that triggered the creation of this clip, if any.
`,
    {
      ...ClipsArgs.shape,
    },
    async ({ ...args }, extra) => {
      let ret;
      ret = await getSavedClips(args, extra._meta?.requestModifiers as RequestModifiers);

      return {
        content: [{ type: "text", text: JSON.stringify(ret) }],
      };
    }
  );
}
