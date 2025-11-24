import { z } from "zod";

// Define the entity types that can be updated
export const ENTITY_TYPE = z.enum([
  "camera",
  "climate-sensor",
  "door-controller",
  "environmental-gateway",
]);
export type EntityType = z.infer<typeof ENTITY_TYPE>;

// Camera-specific update schemas
export const CameraVideoSettings = z.object({
  hdr_enabled: z.boolean().optional().describe("Enable HDR (High Dynamic Range)"),
  img_brightness: z
    .number()
    .min(-255)
    .max(255)
    .optional()
    .describe("Image brightness adjustment (-255 to 255)"),
  img_contrast: z.number().min(0).max(128).optional().describe("Image contrast (0 to 128)"),
  img_saturation: z.number().min(0).max(255).optional().describe("Image saturation (0 to 255)"),
  img_sharpness: z.number().min(0).max(255).optional().describe("Image sharpness (0 to 255)"),
  resolution: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional()
    .describe("Video resolution (width x height)"),
  wdr_enabled: z.boolean().optional().describe("Enable Wide Dynamic Range"),
  wdr_strength: z.number().min(0).max(128).optional().describe("WDR strength (0 to 128)"),
  video_persist_disabled: z.boolean().optional().describe("Disable video persistence"),
  zero_motion_video_bitrate_percent: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Zero motion video bitrate percentage"),
  // Night mode settings
  night_img_brightness: z
    .number()
    .min(-255)
    .max(255)
    .optional()
    .describe("Night mode brightness (-255 to 255)"),
  night_img_contrast: z
    .number()
    .min(0)
    .max(128)
    .optional()
    .describe("Night mode contrast (0 to 128)"),
  night_img_saturation: z
    .number()
    .min(0)
    .max(255)
    .optional()
    .describe("Night mode saturation (0 to 255)"),
  night_img_sharpness: z
    .number()
    .min(0)
    .max(255)
    .optional()
    .describe("Night mode sharpness (0 to 255)"),
});

export const CameraAudioSettings = z.object({
  audio_record: z.boolean().optional().describe("Enable audio recording"),
  device_mic_enabled: z.boolean().optional().describe("Enable device microphone"),
  device_speaker_enabled: z.boolean().optional().describe("Enable device speaker"),
  audio_internal_mic_volume: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Internal microphone volume (0-100)"),
  audio_internal_speaker_volume: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Internal speaker volume (0-100)"),
});

export const CameraDeviceSettings = z.object({
  camera_name: z.string().optional().describe("Camera display name"),
  camera_timezone: z.string().optional().describe("Camera timezone (e.g., 'America/Los_Angeles')"),
  led_intensity: z.number().min(0).max(100).optional().describe("LED intensity (0-100)"),
  led_mode: z
    .enum(["auto", "always_on", "always_off"])
    .optional()
    .describe("LED mode - use 'always_off' to turn LED off"),
  led_stealth_mode: z
    .boolean()
    .optional()
    .describe("Enable stealth mode to turn off LED completely - set to true to turn LED off"),
});

// Input schema for the tool
export const TOOL_ARGS = {
  entityType: ENTITY_TYPE.describe("Type of entity to update"),
  entityUuid: z.string().nullable().describe("UUID of the entity to update"),

  // Camera-specific update fields
  cameraVideoSettings: z
    .string()
    .nullable()
    .describe("JSON string of video settings to update for camera"),
  cameraAudioSettings: z
    .string()
    .nullable()
    .describe("JSON string of audio settings to update for camera"),
  cameraDeviceSettings: z
    .string()
    .nullable()
    .describe("JSON string of device settings to update for camera"),

  // Step tracking for multi-step updates
  step: z
    .enum(["entity-selection", "settings-configuration", "confirmation"])
    .nullable()
    .describe("Current step in the update process"),
} as const;

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

// Output schema
export const OUTPUT_SCHEMA = z.object({
  needUserInput: z.boolean().optional(),
  message: z.string().optional(),
  requestType: z.string().optional(),
  submitAction: z.string().optional(),
  entityType: z.string().optional(),
  entityUuid: z.string().optional(),
  currentSettings: z.any().optional(),
  success: z.boolean().optional(),
  error: z.string().optional(),
  updatedSettings: z.any().optional(),
});

// API payload types
export const UpdateCameraConfigPayload = z.object({
  configUpdate: z.object({
    deviceUuid: z.string(),
    videoFacetSettings: z
      .record(
        z.string(),
        z.object({
          hdr_enabled: z.boolean().nullable().optional(),
          img_brightness: z.number().nullable().optional(),
          img_contrast: z.number().nullable().optional(),
          img_saturation: z.number().nullable().optional(),
          img_sharpness: z.number().nullable().optional(),
          resolution: z
            .object({
              width: z.number().nullable().optional(),
              height: z.number().nullable().optional(),
            })
            .nullable()
            .optional(),
          wdr_enabled: z.boolean().nullable().optional(),
          wdr_strength: z.number().nullable().optional(),
          video_persist_disabled: z.boolean().nullable().optional(),
          zero_motion_video_bitrate_percent: z.number().nullable().optional(),
          night_img_brightness: z.number().nullable().optional(),
          night_img_contrast: z.number().nullable().optional(),
          night_img_saturation: z.number().nullable().optional(),
          night_img_sharpness: z.number().nullable().optional(),
        })
      )
      .optional(),
    audioFacetSettings: z
      .record(
        z.string(),
        z.object({
          audio_record: z.boolean().nullable().optional(),
          device_mic_enabled: z.boolean().nullable().optional(),
          device_speaker_enabled: z.boolean().nullable().optional(),
          audio_internal_mic_volume: z.number().nullable().optional(),
          audio_internal_speaker_volume: z.number().nullable().optional(),
        })
      )
      .optional(),
    deviceSettings: z
      .object({
        camera_name: z.string().nullable().optional(),
        camera_timezone: z.string().nullable().optional(),
        led_intensity: z.number().nullable().optional(),
        led_mode: z.string().nullable().optional(),
        led_stealth_mode: z.boolean().nullable().optional(),
      })
      .optional(),
  }),
});

export type UpdateCameraConfigPayload = z.infer<typeof UpdateCameraConfigPayload>;

// Helper function to parse faceted UUIDs
export function parseFacetedUuid(uuid: string): { baseUuid: string; facet: string } {
  const parts = uuid.split(".");
  if (parts.length === 2) {
    return { baseUuid: parts[0], facet: parts[1] };
  }
  // Default to v0 facet if not specified
  return { baseUuid: uuid, facet: "v0" };
}
