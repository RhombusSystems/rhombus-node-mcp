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
	getClipGroups,
	getSharedClipGroups,
	createClip,
	deleteClip,
} from "../api/clips-tool-api.js";

const TOOL_NAME = "clips-tool";

const TOOL_DESCRIPTION = `
Retrieves saved video clips from the Rhombus system. Saved clips can be viewed for up to 2 years and are typically found in the "Clips" tab of the "Saved Video" section of the Rhombus Console.
Clips are either manually saved by the user, or automatically by some defined policy. Therefore, this tool
is not for looking up the events that have occured.

Set "requestType" to: get saved clips or clips expiring soon (filter by devices, locations, name search, and time range); list the org's shared live video streams, timelapse clips, clip groups, or shared clip groups; **createClip** to save a new clip from a camera's footage (video evidence around an event); or **deleteClip** to permanently delete a saved clip — destructive and irreversible, confirm with the user first.

Each saved clip carries uuid, title, description, start and creation timestamps, the recording device(s), durationSec, processing status (INITIATING / UPLOADING / RENDERING / FAILED / COMPLETE / OFFLINE / UNKNOWN), and the alert that triggered it when there was one. Results paginate via pageToken (null when there is no more data).
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	const payload = ApiPayloadSchema.parse(args);
	switch (args.requestType) {
		case "saved":
			return createToolStructuredContent<OutputSchema>(
				await getSavedClips(payload, requestModifiers, sessionId),
			);
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
		case "clipGroups":
			return createToolStructuredContent<OutputSchema>(
				await getClipGroups(requestModifiers, sessionId),
			);
		case "sharedClips":
			return createToolStructuredContent<OutputSchema>(
				await getSharedClipGroups(requestModifiers, sessionId),
			);
		case "createClip": {
			if (!args.spliceRequest) {
				throw new Error("spliceRequest is required for 'createClip' requestType");
			}
			return createToolStructuredContent<OutputSchema>(
				await createClip(
					args.spliceRequest.cameraUuid,
					args.spliceRequest.startTimeMs,
					args.spliceRequest.endTimeMs,
					requestModifiers,
					sessionId,
				),
			);
		}
		case "deleteClip": {
			if (!args.clipUuid) {
				throw new Error("clipUuid is required for 'deleteClip' requestType");
			}
			return createToolStructuredContent<OutputSchema>(
				await deleteClip(args.clipUuid, requestModifiers, sessionId),
			);
		}
	}

	return createToolStructuredContent<OutputSchema>({ error: "Invalid requestType" });
};

export function createTool(server: McpServer) {
  server.registerTool(TOOL_NAME, {
    title: "Clips",
    description: TOOL_DESCRIPTION,
    inputSchema: TOOL_ARGS,
    outputSchema: OUTPUT_SCHEMA.shape,
    annotations: { readOnlyHint: false, destructiveHint: true },
  }, TOOL_HANDLER);
}
