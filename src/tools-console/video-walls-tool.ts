import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  computeGridSettings,
  deleteVideoWall,
  findVideoWall,
  getVideoWalls,
  handleCreateVideoWallRequest,
  updateVideoWall,
} from "../api/create-tool-api.js";
import {
  OUTPUT_SCHEMA,
  type OutputSchema,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/video-walls-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "video-walls-tool";
const TOOL_DESCRIPTION = `
This tool interacts with Rhombus video walls. Rhombus video walls are a collection of camera feeds combined into a single view,
allowing users to monitor multiple cameras.

It has the following modes of operation, determined by the "requestType" parameter:
- 'list': List all video walls in the organization.
- 'create': Create a new video wall. Requires videoWallCreateOptions with a displayName and a deviceList of camera UUIDs (use get-entity-tool or location-tool to resolve camera UUIDs first). Returns the new video wall's uuid.
- 'update': Rename a video wall and/or change which cameras it shows. Requires videoWallUuid plus displayName and/or deviceList.
- 'delete': Delete a video wall. Requires videoWallUuid.

The layout of created video walls is automatically determined by the number of cameras in video wall settings "numVisibleDevicesAtOnce".
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestType, videoWallCreateOptions, videoWallUuid, displayName, deviceList } =
		args;
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	try {
		switch (requestType) {
			case "create": {
				if (!videoWallCreateOptions) {
					return createToolTextContent(
						"videoWallCreateOptions is required for 'create'.",
					);
				}

				return createToolStructuredContent<OutputSchema>(
					await handleCreateVideoWallRequest(
						videoWallCreateOptions,
						requestModifiers,
						sessionId,
					),
				);
			}
			case "list":
				return createToolStructuredContent<OutputSchema>(
					await getVideoWalls(requestModifiers, sessionId),
				);
			case "update": {
				if (!videoWallUuid) {
					return createToolTextContent("videoWallUuid is required for 'update'.");
				}
				if (!displayName?.trim() && !deviceList) {
					return createToolTextContent(
						"'update' needs at least one of displayName or deviceList — both were empty, so there is nothing to change.",
					);
				}
				if (deviceList && deviceList.length === 0) {
					return createToolTextContent(
						"RETRYABLE — nothing was changed. deviceList was an empty array, which would leave the video wall with no cameras. Pass the full set of camera uuids the wall should show, or use 'delete' to remove the wall.",
					);
				}

				// api2's updateVideoWalls REPLACES the whole wall object, so sending
				// only the changed field would blank the rest.
				const existing = await findVideoWall(videoWallUuid, requestModifiers, sessionId);
				if (!existing) {
					return createToolTextContent(
						`No video wall in this organization has the uuid "${videoWallUuid}". Use requestType 'list' to see the walls that exist — do not guess a uuid.`,
					);
				}

				const existingDevices =
					existing.deviceList?.filter((uuid): uuid is string => !!uuid) ?? [];
				const nextDevices = deviceList ?? existingDevices;
				const existingSettings = (existing.settings ?? {}) as Record<string, unknown>;

				const { updated, warningMsg } = await updateVideoWall(
					{
						uuid: videoWallUuid,
						displayName: displayName?.trim() || existing.displayName || undefined,
						deviceList: nextDevices,
						orgUuid: existing.orgUuid ?? undefined,
						othersCanEdit: existing.othersCanEdit ?? undefined,
						shared: existing.shared ?? undefined,
						settings: {
							...existingSettings,
							// The grid is a preset chosen by camera count, so a wall that
							// grew would otherwise keep a layout too small to show the new
							// cameras at all.
							...computeGridSettings(nextDevices.length),
						},
					},
					requestModifiers,
					sessionId,
				);

				const removed = existingDevices.filter(uuid => !nextDevices.includes(uuid));
				const added = nextDevices.filter(uuid => !existingDevices.includes(uuid));
				const changes: string[] = [];
				if (added.length > 0) changes.push(`added ${added.length}`);
				if (removed.length > 0) changes.push(`removed ${removed.length}`);
				return createToolStructuredContent<OutputSchema>({
					updated,
					warningMsg,
					note: deviceList
						? `The wall now shows ${nextDevices.length} camera(s)${changes.length > 0 ? ` (${changes.join(", ")})` : ""}, and its grid layout was resized to match.`
						: `Renamed to "${displayName?.trim()}". Its cameras are unchanged.`,
				});
			}
			case "delete": {
				if (!videoWallUuid) {
					return createToolTextContent("videoWallUuid is required for 'delete'.");
				}
				const existing = await findVideoWall(videoWallUuid, requestModifiers, sessionId);
				if (!existing) {
					return createToolTextContent(
						`No video wall in this organization has the uuid "${videoWallUuid}". Use requestType 'list' to see the walls that exist.`,
					);
				}
				const { deleted, warningMsg } = await deleteVideoWall(
					videoWallUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OutputSchema>({
					deleted,
					warningMsg,
					note:
						(existing.numShares ?? 0) > 0
							? `Deleted "${existing.displayName ?? videoWallUuid}". It had ${existing.numShares} active share(s), which no longer work.`
							: `Deleted "${existing.displayName ?? videoWallUuid}". Deleting a wall does not affect the cameras that were on it.`,
				});
			}
		}
	} catch (error: unknown) {
		return createToolStructuredContent<OutputSchema>({
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}

	// Must carry structuredContent (or isError) — this tool registers an
	// outputSchema, and the SDK replaces a bare text result with an opaque -32602.
	return createToolTextContent(
		"Invalid requestType. Valid values are: list, create, update, delete.",
	);
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Video Walls",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: false, destructiveHint: true },
		},
		TOOL_HANDLER,
	);
}
