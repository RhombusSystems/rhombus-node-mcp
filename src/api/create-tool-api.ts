import { logger } from "../logger.js";
import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type {
	CreateVideoWallOptions,
	OutputSchema,
} from "../types/video-walls-tool-types.js";
import type { RequestModifiers } from "../util.js";

export async function createVideoWall(
	options: CreateVideoWallOptions,
	requestModifiers: RequestModifiers,
	sessionId?: string,
) {
	const body = {
		videoWall: {
			displayName: options?.displayName,
			deviceList: options?.deviceList,
			othersCanEdit: true,
			orgUuid: options?.orgUuid,
			shared: true,
			settings: {
				gridSize: {
					width: options?.settings.columnCount,
					height: options?.settings.columnCount,
				},
				gridLayout: "1 2\n3 4",
				intervalSeconds: options?.settings.intervalSeconds || 5,
			},
		},
	};
	const response = await postApi<schema["Camera_CreateVideoWallWSResponse"]>({
		route: "/camera/createVideoWall",
		body,
		modifiers: requestModifiers,
		sessionId,
	});
	return response;
}

export async function getVideoWalls(
	requestModifiers: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const response = await postApi<schema["Camera_GetVideoWallsWSResponse"]>({
		route: "/camera/getVideoWalls",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (response?.error) {
		return {
			error: response.errorMsg ?? "No error message.",
		};
	}

	return {
		videoWalls: response?.videoWalls ?? [],
	};
}

export async function handleCreateVideoWallRequest(
	videoWallCreateOptions: CreateVideoWallOptions,
	requestModifiers: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	logger.info("🔨 Creating video wall");
	if (!videoWallCreateOptions?.displayName) {
		return {
			needUserInput: true,
			commandForUser: "What should the name of the video wall be?",
		};
	} else if ((videoWallCreateOptions?.deviceList || []).length === 0) {
		return {
			needUserInput: true,
			commandForUser: "Which cameras would you like on this video wall?",
		};
	} else {
		logger.info(
			"Creating video wall with options: ",
			JSON.stringify(videoWallCreateOptions),
		);
		return await createVideoWall(
			videoWallCreateOptions,
			requestModifiers,
			sessionId,
		);
	}
}
