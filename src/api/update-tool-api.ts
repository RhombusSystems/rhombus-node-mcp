import { postApi } from "../network.js";
import type { RequestModifiers } from "../util.js";
import type { UpdateCameraConfigPayload } from "../types/update-tool-types.js";
import schema from "../types/schema.js";

type CameraConfigOption = {
  wdrRange?: {
    min?: number | null;
    max?: number | null;
  } | null;
  resolution?: {
    width?: number | null;
    height?: number | null;
  } | null;
} | null;

type CameraFeatureValidationResult = {
  canProceed: boolean;
  error?: string;
};

/**
 * Updates camera configuration using the faceted config API
 */
export async function updateCameraConfig(
  payload: UpdateCameraConfigPayload,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  success: boolean;
  error?: string;
  updatedSettings?: any;
}> {
  try {
    const result = await postApi<schema["Common_devices_UpdateConfigWSResponse"]>({
      route: "/camera/updateFacetedConfig",
      body: payload,
      modifiers: requestModifiers,
      sessionId,
    });

    if (result.error) {
      return {
        success: false,
        error: result.errorMsg || "Failed to update camera configuration",
      };
    }

    return {
      success: true,
      updatedSettings: payload.configUpdate,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Gets current camera configuration
 */
export async function getCameraDetails(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const result = await postApi<any>({
      route: "/camera/getDetailsV2",
      body: {
        uuid: cameraUuid,
      },
      modifiers: requestModifiers,
      sessionId,
    });

    if (result.error) {
      return {
        success: false,
        error: result.errorMsg || "Failed to get camera details",
      };
    }

    return {
      success: true,
      data: result.camera,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function getCameraHardwareVariation(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  success: boolean;
  error?: string;
  hwVariation?: string;
}> {
  try {
    const result = await postApi<schema["Camera_GetCameraDetailsWSResponse"]>({
      route: "/camera/getDetails",
      body: {
        cameraUuids: [cameraUuid],
      },
      modifiers: requestModifiers,
      sessionId,
    });

    if (result.error) {
      return {
        success: false,
        error: result.errorMsg || "Failed to get camera hardware variation",
      };
    }

    const camera = result.cameras?.[0];
    return {
      success: true,
      hwVariation: camera?.hwVariation ?? undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function getOrgCameraConfigOptions(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  success: boolean;
  error?: string;
  cameraConfigOptions?: Record<string, CameraConfigOption[] | null>;
}> {
  try {
    const result = await postApi<schema["Org_GetOrgV2WSResponse"]>({
      route: "/org/getOrgV2",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    });

    if (result.error) {
      return {
        success: false,
        error: result.errorMsg || "Failed to get organization camera config options",
      };
    }

    return {
      success: true,
      cameraConfigOptions: (result.cameraConfigOptions as Record<
        string,
        CameraConfigOption[] | null
      > | null) ?? undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function getCameraFacetedConfig(
  cameraUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  success: boolean;
  error?: string;
  config?: schema["Device_config_userconfig_ExternalReadableFacetedUserConfig"];
}> {
  try {
    const result = await postApi<schema["Device_config_GetFacetedUserConfigWSResponse"]>({
      route: "/camera/getFacetedConfig",
      body: {
        deviceUuid: cameraUuid,
      },
      modifiers: requestModifiers,
      sessionId,
    });

    if (result.error) {
      return {
        success: false,
        error: result.errorMsg || "Failed to get camera faceted config",
      };
    }

    return {
      success: true,
      config: result.config,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function validateCameraFeatureSupport(
  payload: UpdateCameraConfigPayload,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<CameraFeatureValidationResult> {
  const requestedVideoSettings = Object.values(payload.configUpdate.videoFacetSettings ?? {});
  const requestedAudioSettings = Object.values(payload.configUpdate.audioFacetSettings ?? {});
  const requestedDeviceSettings = payload.configUpdate.deviceSettings;
  if (
    requestedVideoSettings.length === 0 &&
    requestedAudioSettings.length === 0 &&
    !requestedDeviceSettings
  ) {
    return { canProceed: true };
  }

  const requestedFacet =
    Object.keys(payload.configUpdate.videoFacetSettings ?? {})[0] ??
    Object.keys(payload.configUpdate.audioFacetSettings ?? {})[0] ??
    "v0";
  const requestedVideoSettingsForFacet = requestedVideoSettings[0];
  const requestedAudioSettingsForFacet = requestedAudioSettings[0];

  const requestedWdrStrength = requestedVideoSettings
    .map(settings => settings.wdr_strength)
    .find(value => value !== undefined && value !== null);
  const hasWdrRequest = requestedVideoSettings.some(
    settings => settings.wdr_enabled !== undefined || settings.wdr_strength !== undefined
  );
  const requestedResolution = requestedVideoSettingsForFacet?.resolution;
  const hasResolutionRequest =
    requestedResolution?.width !== undefined && requestedResolution?.height !== undefined;
  const hasAudioRequest = requestedAudioSettings.length > 0;

  const [hardwareVariationResult, orgOptionsResult, facetedConfigResult] = await Promise.all([
    getCameraHardwareVariation(payload.configUpdate.deviceUuid, requestModifiers, sessionId),
    getOrgCameraConfigOptions(requestModifiers, sessionId),
    getCameraFacetedConfig(payload.configUpdate.deviceUuid, requestModifiers, sessionId),
  ]);

  if (facetedConfigResult.success && facetedConfigResult.config) {
    const videoFacetConfig = facetedConfigResult.config.videoFacetSettings?.[requestedFacet] as
      | (schema["Device_config_settings_ExternalReadableVideoSettings"] & {
          updatedSetMethodMap?: Record<string, boolean | null> | null;
        })
      | undefined;
    const audioFacetConfig = facetedConfigResult.config.audioFacetSettings?.[requestedFacet] as
      | (schema["Device_config_settings_ExternalReadableAudioSettings"] & {
          updatedSetMethodMap?: Record<string, boolean | null> | null;
        })
      | undefined;
    const deviceConfig = facetedConfigResult.config.deviceSettings as
      | (schema["Device_config_settings_ExternalReadableDeviceSettings"] & {
          updatedSetMethodMap?: Record<string, boolean | null> | null;
        })
      | undefined;

    if (hasAudioRequest && audioFacetConfig?.audio_supported === false) {
      return {
        canProceed: false,
        error: "This camera does not support audio features.",
      };
    }

    const unsupportedVideoFields = getUnsupportedFieldsFromSetMethodMap(
      requestedVideoSettingsForFacet,
      videoFacetConfig?.updatedSetMethodMap
    );
    if (unsupportedVideoFields.length > 0) {
      return {
        canProceed: false,
        error: `This camera does not support updating video setting: ${unsupportedVideoFields[0]}.`,
      };
    }

    const unsupportedAudioFields = getUnsupportedFieldsFromSetMethodMap(
      requestedAudioSettingsForFacet,
      audioFacetConfig?.updatedSetMethodMap
    );
    if (unsupportedAudioFields.length > 0) {
      return {
        canProceed: false,
        error: `This camera does not support updating audio setting: ${unsupportedAudioFields[0]}.`,
      };
    }

    const unsupportedDeviceFields = getUnsupportedFieldsFromSetMethodMap(
      requestedDeviceSettings,
      deviceConfig?.updatedSetMethodMap
    );
    if (unsupportedDeviceFields.length > 0) {
      return {
        canProceed: false,
        error: `This camera does not support updating device setting: ${unsupportedDeviceFields[0]}.`,
      };
    }
  }

  // Model-level capability metadata can be unavailable on some deployments; do not hard-fail.
  if (!hardwareVariationResult.success || !orgOptionsResult.success) {
    return { canProceed: true };
  }

  const hwVariation = hardwareVariationResult.hwVariation;
  if (!hwVariation) {
    return { canProceed: true };
  }
  const cameraOptions = orgOptionsResult.cameraConfigOptions?.[hwVariation];
  if (
    (!hasWdrRequest && !hasResolutionRequest) ||
    !Array.isArray(cameraOptions) ||
    cameraOptions.length === 0
  ) {
    return { canProceed: true };
  }

  if (hasWdrRequest) {
    const wdrOption = cameraOptions.find(option => option?.wdrRange !== undefined);
    if (!wdrOption?.wdrRange) {
      return {
        canProceed: false,
        error: "This camera does not support WDR feature.",
      };
    }

    if (typeof requestedWdrStrength === "number") {
      const min = wdrOption.wdrRange.min;
      const max = wdrOption.wdrRange.max;
      if (typeof min === "number" && requestedWdrStrength < min) {
        return {
          canProceed: false,
          error: `This camera supports WDR, but wdr_strength=${requestedWdrStrength} is below the supported minimum (${min}).`,
        };
      }
      if (typeof max === "number" && requestedWdrStrength > max) {
        return {
          canProceed: false,
          error: `This camera supports WDR, but wdr_strength=${requestedWdrStrength} exceeds the supported maximum (${max}).`,
        };
      }
    }
  }

  if (hasResolutionRequest) {
    const isRequestedResolutionSupported = cameraOptions.some(option => {
      const optionWidth = option?.resolution?.width;
      const optionHeight = option?.resolution?.height;
      return (
        typeof optionWidth === "number" &&
        typeof optionHeight === "number" &&
        optionWidth === requestedResolution.width &&
        optionHeight === requestedResolution.height
      );
    });
    if (!isRequestedResolutionSupported) {
      return {
        canProceed: false,
        error: `This camera does not support resolution ${requestedResolution.width}x${requestedResolution.height}.`,
      };
    }
  }

  return { canProceed: true };
}

function getUnsupportedFieldsFromSetMethodMap(
  requestedSettings: Record<string, unknown> | undefined,
  setMethodMap: Record<string, boolean | null> | null | undefined
): string[] {
  if (!requestedSettings || !setMethodMap) {
    return [];
  }
  return Object.keys(requestedSettings).filter(field => setMethodMap[field] === false);
}

/**
 * Helper function to remove null/undefined fields from update payload
 */
export function cleanUpdatePayload(payload: any): any {
  const cleaned: any = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        const cleanedValue = cleanUpdatePayload(value);
        if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Formats camera settings for display
 */
export function formatCameraSettings(settings: any): string {
  const sections: string[] = [];

  if (settings.videoFacetSettings) {
    const videoSettings = Object.values(settings.videoFacetSettings)[0] as any;
    if (videoSettings) {
      const videoItems: string[] = [];
      if (videoSettings.resolution)
        videoItems.push(
          `Resolution: ${videoSettings.resolution.width}x${videoSettings.resolution.height}`
        );
      if (videoSettings.img_brightness !== undefined)
        videoItems.push(`Brightness: ${videoSettings.img_brightness}`);
      if (videoSettings.img_contrast !== undefined)
        videoItems.push(`Contrast: ${videoSettings.img_contrast}`);
      if (videoSettings.img_saturation !== undefined)
        videoItems.push(`Saturation: ${videoSettings.img_saturation}`);
      if (videoSettings.img_sharpness !== undefined)
        videoItems.push(`Sharpness: ${videoSettings.img_sharpness}`);
      if (videoSettings.hdr_enabled !== undefined)
        videoItems.push(`HDR: ${videoSettings.hdr_enabled ? "On" : "Off"}`);
      if (videoSettings.wdr_enabled !== undefined)
        videoItems.push(`WDR: ${videoSettings.wdr_enabled ? "On" : "Off"}`);
      if (videoSettings.wdr_strength !== undefined)
        videoItems.push(`WDR Strength: ${videoSettings.wdr_strength}`);
      if (videoSettings.video_persist_disabled !== undefined)
        videoItems.push(
          `Video Persist: ${videoSettings.video_persist_disabled ? "Disabled" : "Enabled"}`
        );
      if (videoSettings.zero_motion_video_bitrate_percent !== undefined)
        videoItems.push(`Zero Motion Bitrate: ${videoSettings.zero_motion_video_bitrate_percent}%`);

      if (videoItems.length > 0) {
        sections.push("**Video Settings:**\n" + videoItems.map(item => `• ${item}`).join("\n"));
      }
    }
  }

  if (settings.audioFacetSettings) {
    const audioSettings = Object.values(settings.audioFacetSettings)[0] as any;
    if (audioSettings) {
      const audioItems: string[] = [];
      if (audioSettings.audio_record !== undefined)
        audioItems.push(`Recording: ${audioSettings.audio_record ? "On" : "Off"}`);
      if (audioSettings.device_mic_enabled !== undefined)
        audioItems.push(`Microphone: ${audioSettings.device_mic_enabled ? "Enabled" : "Disabled"}`);
      if (audioSettings.device_speaker_enabled !== undefined)
        audioItems.push(
          `Speaker: ${audioSettings.device_speaker_enabled ? "Enabled" : "Disabled"}`
        );

      if (audioItems.length > 0) {
        sections.push("**Audio Settings:**\n" + audioItems.map(item => `• ${item}`).join("\n"));
      }
    }
  }

  if (settings.deviceSettings) {
    const deviceItems: string[] = [];
    if (settings.deviceSettings.camera_name)
      deviceItems.push(`Name: ${settings.deviceSettings.camera_name}`);
    if (settings.deviceSettings.camera_timezone)
      deviceItems.push(`Timezone: ${settings.deviceSettings.camera_timezone}`);
    if (settings.deviceSettings.led_mode)
      deviceItems.push(`LED Mode: ${settings.deviceSettings.led_mode}`);
    if (settings.deviceSettings.led_intensity !== undefined)
      deviceItems.push(`LED Intensity: ${settings.deviceSettings.led_intensity}`);
    if (settings.deviceSettings.led_stealth_mode !== undefined)
      deviceItems.push(
        `LED Stealth Mode: ${settings.deviceSettings.led_stealth_mode ? "On" : "Off"}`
      );

    if (deviceItems.length > 0) {
      sections.push("**Device Settings:**\n" + deviceItems.map(item => `• ${item}`).join("\n"));
    }
  }

  return sections.join("\n\n");
}
