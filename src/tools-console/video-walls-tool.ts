import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getVideoWalls,
  handleCreateVideoWallRequest,
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

The layout of created video walls is automatically determined by the number of cameras in video wall settings "numVisibleDevicesAtOnce".
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestType, videoWallCreateOptions } = args;
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	switch (requestType) {
		case "create":
			if (!videoWallCreateOptions) {
				return createToolTextContent(
					JSON.stringify({
						error: "videoWallCreateOptions is required. Please try again.",
					}),
				);
			}

			return createToolStructuredContent<OutputSchema>(
				await handleCreateVideoWallRequest(
					videoWallCreateOptions,
					requestModifiers,
					sessionId,
				),
			);
		case "list":
			return createToolStructuredContent<OutputSchema>(
				await getVideoWalls(requestModifiers, sessionId),
			);
		default:
	}

	return {
		content: [
			{
				type: "text" as const,
				text: "Invalid entity type. Please try again.",
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
		TOOL_HANDLER,
	);
}
