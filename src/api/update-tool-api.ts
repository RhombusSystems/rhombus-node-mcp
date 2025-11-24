import { postApi } from "../network.js";
import type { RequestModifiers } from "../util.js";
import type { UpdateCameraConfigPayload } from "../types/update-tool-types.js";
import schema from "../types/schema.js";

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
