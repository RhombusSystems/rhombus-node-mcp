import { getLogger } from "../logger.js";
import { constructRequestHeaders, postApi } from "../network.js";
import type {
  CameraFullStateResponse,
  CameraStorageData,
  ExternalUpdateableFacetedUserConfig,
  PresenceWindowsResponse,
  TimeWindowSeconds,
} from "../types/camera-tool-types.js";
import type schema from "../types/schema.js";
import { removeNullFields, type RequestModifiers } from "../util.js";

const logger = getLogger("camera-tool");

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export async function getImageForCameraAtTime(
  cameraUuid: string,
  timestampMs: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<
  | {
      success: true;
      status: string;
      frameUri: string;
      imageType: "base64";
      imageData: string;
    }
  | {
      success: false;
      status: string;
    }
> {
  const body = {
    cameraUuid: cameraUuid,
    downscaleFactor: 10,
    jpgQuality: 70,
    timestampMs: timestampMs,
  };

  logger.debug(`Getting frameUri from UUID: ${cameraUuid} at timestampMs: ${timestampMs}`);

  let frameUri: string | undefined;
  const base64Image = await postApi<schema["Video_GetExactFrameUriWSResponse"]>({
    route: "/video/getExactFrameUri",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(async res => {
    logger.debug(`Received frameUri ${res.frameUri}`);

    if (!res.frameUri) {
      throw new Error("No frameUri given. Maybe camera does not support it.");
    }

    // construct request headers
    const { url: _frameUri, requestHeaders } = constructRequestHeaders(
      res.frameUri,
      requestModifiers,
      sessionId
    );
    frameUri = _frameUri;

    // remove content type
    delete requestHeaders["Content-Type"];
    delete requestHeaders["accept"];

    logger.debug(`Fetching with headers\n${JSON.stringify(requestHeaders, null, 2)}`);

    return await fetch(frameUri, {
      method: "GET",
      headers: requestHeaders as HeadersInit,
    }).then(async res => {
      if (!res.ok) {
        logger.error(`Failed to fetch image: ${await res.text()}`);
        logger.error(res);
        return null;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      logger.debug(`Received image base64:\n ${base64}`);
      return base64;
    });
  });
  if (!base64Image) {
    return {
      success: false,
      status: "failed to fetch image",
    };
  }
  return {
    success: true,
    status: "successfully fetched image",
    frameUri: frameUri ?? "",
    imageType: "base64",
    imageData: base64Image,
  };
}

async function getCameraStorageData(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<CameraStorageData> {
  // First, get the camera's full state to determine the time range and cloud archive days
  const stateResponse = await postApi<CameraFullStateResponse>({
    route: "/camera/getFullCameraState",
    body: {
      cameraUuid: cameraUuid,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  const cloudArchiveDays =
    (stateResponse.fullCameraState?.onCloudState?.cloud_archive_days as
      | number
      | null
      | undefined) ?? null;

  // Get the oldest segment time (in seconds) to use as start time
  const oldestSegmentSecs = stateResponse.fullCameraState?.onCameraState?.oldest_segment_secs ?? 0;

  const endTimeSec = Math.floor(Date.now() / 1000);
  const startTimeSec = oldestSegmentSecs || 0;
  const durationSec = endTimeSec - startTimeSec;

  const presenceResponse = await postApi<PresenceWindowsResponse>({
    route: "/camera/getPresenceWindows",
    body: {
      cameraUuid: cameraUuid,
      startTimeSec: startTimeSec,
      durationSec: durationSec,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  const calculateTotalDays = (timeWindows: TimeWindowSeconds[] | null | undefined): number => {
    if (!timeWindows || timeWindows.length === 0) {
      return 0;
    }

    let totalMilliseconds = 0;

    timeWindows.forEach(window => {
      if (window.startSeconds && window.durationSeconds) {
        const durationMs = window.durationSeconds * 1000;
        totalMilliseconds += durationMs;
      }
    });

    return Math.floor(totalMilliseconds / MILLISECONDS_PER_DAY);
  };

  const presenceWindows = presenceResponse.presenceWindows;

  const daysOnCamera = calculateTotalDays(presenceWindows?.VideoLocal);
  const daysInCloud = calculateTotalDays(presenceWindows?.VideoCloud);

  return {
    daysInCloud,
    daysOnCamera,
    cloudArchiveDays,
  };
}

export async function getCameraSettings(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<any>({
    route: "/camera/getFacetedConfig",
    body: {
      deviceUuid: cameraUuid,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    return {
      success: false,
      status: "failed to fetch camera settings",
    };
  }

  const storageData = await getCameraStorageData(cameraUuid, requestModifiers, sessionId);

  return {
    success: true,
    config: res.config,
    daysInCloud: storageData.daysInCloud,
    daysOnCamera: storageData.daysOnCamera,
    cloudArchiveDays: storageData.cloudArchiveDays,
    status: "fetched camera settings",
  };
}

export async function updateCameraSettings(
  cameraUuid: string,
  update: ExternalUpdateableFacetedUserConfig,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  // remove any "null" values
  const res = await postApi<any>({
    route: "/camera/updateFacetedConfig",
    body: {
      configUpdate: {
        deviceUuid: cameraUuid,
        ...removeNullFields(update),
      },
    },
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    return {
      success: false,
      status: "failed to update camera settings",
    };
  }

  return {
    success: true,
    config: res.config,
    status: "updated camera settings",
  };
}
