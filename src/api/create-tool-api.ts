import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../logger.js";
import { postApi } from "../network.js";
import { CreateVideoWallOptionsT } from "../types.js";
import { RequestModifiers } from "../util.js";

export async function createVideoWall(
  options: CreateVideoWallOptionsT,
  requestModifiers: RequestModifiers,
  sessionId?: string
) {
  const body = {
    videoWall: {
      displayName: options?.displayName,
      deviceList: options?.deviceList,
      othersCanEdit: true,
      orgUuid: options?.orgUuid,
      shared: true,
      settings: {
        gridSize: { width: options?.settings.columnCount, height: options?.settings.columnCount },
        gridLayout: "1 2\n3 4",
        intervalSeconds: options?.settings.intervalSeconds || 5,
      },
    },
  };
  const response = await postApi({
    route: "/camera/createVideoWall",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  return response;
}

export async function handleCreateVideoWallRequest(
  videoWallCreateOptions: CreateVideoWallOptionsT,
  requestModifiers: RequestModifiers,
  sessionId?: string
): Promise<CallToolResult> {
  let text = "Unable to create video wall!";
  logger.info("🔨 Creating video wall");
  if (!videoWallCreateOptions?.displayName) {
    text = JSON.stringify({
      needUserInput: true,
      commandForUser: "What should the name of the video wall be?",
    });
  } else if ((videoWallCreateOptions?.deviceList || []).length === 0) {
    text = JSON.stringify({
      needUserInput: true,
      commandForUser: "Which cameras would you like on this video wall?",
    });
  } else {
    logger.info("Creating video wall with options: ", JSON.stringify(videoWallCreateOptions));
    text = JSON.stringify(
      await createVideoWall(videoWallCreateOptions, requestModifiers, sessionId)
    );
  }
  return Promise.resolve({
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
  });
}
