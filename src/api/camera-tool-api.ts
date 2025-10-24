import { getLogger } from "../logger.js";
import { appendQueryParams, AUTH_HEADERS, postApi, STATIC_HEADERS } from "../network.js";
import { removeNullFields, RequestModifiers } from "../util.js";
import {
  ExternalUpdateableFacetedUserConfig,
  PresenceWindowsResponse,
  CameraDaysResult,
  CameraFullStateResponse,
  TimeWindowSeconds,
} from "../types/camera-tool-types.js";

const logger = getLogger("camera-tool");

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export async function getImageForCameraAtTime(
  cameraUuid: string,
  timestampMs: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    cameraUuid: cameraUuid,
    downscaleFactor: 10,
    jpgQuality: 70,
    permyriadCropHeight: 10000,
    permyriadCropWidth: 5625,
    permyriadCropX: 2188,
    permyriadCropY: 0,
    timestampMs: timestampMs,
  };
  logger.debug(`Getting frameUri from UUID: ${cameraUuid} at timestampMs: ${timestampMs}`);
  const base64Image = await postApi<any>({
    route: "/video/getExactFrameUri",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(async res => {
    logger.debug(`Received frameUri ${res.frameUri}`);

    // construct request headers
    let requestHeaders = {
      ...(requestModifiers?.headers ?? AUTH_HEADERS),
      ...STATIC_HEADERS,
    };

    // add query params
    if (requestModifiers?.query) {
      res.frameUri = appendQueryParams(res.frameUri, requestModifiers.query);
    }

    logger.trace(`Fetching with headers\n${JSON.stringify(requestHeaders)}`);

    return await fetch(res.frameUri, {
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
    imageType: "base64",
    imageData: base64Image,
  };
}

async function getCameraDays(
  cameraUuid: string,
  archiveDays: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<CameraDaysResult> {
  const endTimeSec = Math.floor(Date.now() / 1000);
  const lookbackMs = Date.now() - (archiveDays * 24 * 60 * 60 * 1000);
  const startTimeSec = Math.floor(lookbackMs / 1000);
  const durationSec = endTimeSec - startTimeSec;

  const res = await postApi<PresenceWindowsResponse>({
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

  const presenceWindows = res.presenceWindows;

  const daysOnCamera = calculateTotalDays(presenceWindows?.VideoLocal);
  const daysInCloud = calculateTotalDays(presenceWindows?.VideoCloud);

  return {
    daysInCloud,
    daysOnCamera,
  };
}

async function getCloudArchiveDays(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<number | null> {
  const res = await postApi<CameraFullStateResponse>({
    route: "/camera/getFullCameraState",
    body: {
      cameraUuid: cameraUuid,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  const cloudArchiveDays = res.fullCameraState?.onCloudState?.cloud_archive_days as number | null | undefined;

  return cloudArchiveDays ?? null;
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

  const cloudArchiveDays = await getCloudArchiveDays(cameraUuid, requestModifiers, sessionId);
  const defaultLookbackDays = 60;
  const lookbackDays = cloudArchiveDays ?? defaultLookbackDays;
  const storageDays = await getCameraDays(cameraUuid, lookbackDays, requestModifiers, sessionId);

  return {
    success: true,
    config: res.config,
    daysInCloud: storageDays.daysInCloud,
    daysOnCamera: storageDays.daysOnCamera,
    cloudArchiveDays: cloudArchiveDays,
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
