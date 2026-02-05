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
	// our grid layout settings is a little complicated. we'll dumb it down
	// to certain presets based on length of device list
	const numDevices =
		options?.settings.numVisibleDevicesAtOnce ??
		options?.deviceList?.length ??
		1;

	let gridSettings: {
		gridLayout: string;
		gridSize: {
			width: number;
			height: number;
		};
	};
	if (numDevices <= 1) {
		gridSettings = {
			gridLayout: "1",
			gridSize: {
				width: 1,
				height: 1,
			},
		};
	} else if (numDevices <= 2) {
		gridSettings = {
			gridLayout: "1\n2",
			gridSize: {
				width: 1,
				height: 2,
			},
		};
	} else if (numDevices <= 3) {
		gridSettings = {
			gridLayout: "1 2\n1 3",
			gridSize: {
				width: 2,
				height: 2,
			},
		};
	} else if (numDevices <= 4) {
		gridSettings = {
			gridLayout: "1 2\n3 4",
			gridSize: {
				width: 4,
				height: 4,
			},
		};
	} else if (numDevices <= 5) {
		gridSettings = {
			gridLayout: "1 1 1 2\n   1 1 1 3\n   1 1 1 4\n   1 1 1 5",
			gridSize: {
				width: 4,
				height: 4,
			},
		};
	} else if (numDevices <= 6) {
		gridSettings = {
			gridLayout: "1 2 3\n4 5 6",
			gridSize: {
				width: 3,
				height: 2,
			},
		};
	} else if (numDevices <= 7) {
		gridSettings = {
			gridLayout: "1 1 2\n   1 1 3\n   4 5 6",
			gridSize: {
				width: 3,
				height: 3,
			},
		};
	} else if (numDevices <= 9) {
		gridSettings = {
			gridLayout: "1 2 3\n4 5 6\n7 8 9",
			gridSize: { width: 3, height: 3 },
		};
	} else if (numDevices <= 12) {
		gridSettings = {
			gridLayout: "1 2 3 4\n5 6 7 8\n9 10 11 12",
			gridSize: { width: 4, height: 3 },
		};
	} else if (numDevices <= 16) {
		gridSettings = {
			gridLayout: "1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16",
			gridSize: { width: 4, height: 4 },
		};
	} else if (numDevices <= 25) {
		gridSettings = {
			gridLayout:
				"1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15\n16 17 18 19 20\n21 22 23 24 25",
			gridSize: { width: 5, height: 5 },
		};
	} else if (numDevices <= 30) {
		gridSettings = {
			gridLayout:
				"1 2 3 4 5 6\n7 8 9 10 11 12\n13 14 15 16 17 18\n19 20 21 22 23 24\n25 26 27 28 29 30",
			gridSize: { width: 6, height: 5 },
		};
	} else if (numDevices <= 36) {
		gridSettings = {
			gridLayout:
				"1 2 3 4 5 6\n7 8 9 10 11 12\n13 14 15 16 17 18\n19 20 21 22 23 24\n25 26 27 28 29 30\n31 32 33 34 35 36",
			gridSize: { width: 6, height: 6 },
		};
	} else if (numDevices <= 49) {
		gridSettings = {
			gridLayout:
				"1 2 3 4 5 6 7\n8 9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28\n29 30 31 32 33 34 35\n36 37 38 39 40 41 42\n43 44 45 46 47 48 49",
			gridSize: { width: 7, height: 7 },
		};
	} else {
		gridSettings = {
			gridLayout:
				"1 2 3 4 5 6 7 8\n9 10 11 12 13 14 15 16\n17 18 19 20 21 22 23 24\n25 26 27 28 29 30 31 32\n33 34 35 36 37 38 39 40\n41 42 43 44 45 46 47 48\n49 50 51 52 53 54 55 56\n57 58 59 60 61 62 63 64",
			gridSize: { width: 8, height: 8 },
		};
	}

	const body = {
		videoWall: {
			displayName: options?.displayName,
			deviceList: options?.deviceList,
			othersCanEdit: true,
			orgUuid: options?.orgUuid,
			shared: true,
			settings: {
				...gridSettings,
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
		const response = await createVideoWall(
			videoWallCreateOptions,
			requestModifiers,
			sessionId,
		);

		return {
			...response,
			error: response?.errorMsg ?? undefined,
		};
	}
}
