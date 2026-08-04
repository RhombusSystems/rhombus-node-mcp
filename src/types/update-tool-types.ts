import { z } from "zod";

// Define the entity types that can be updated
export const ENTITY_TYPE = z.enum([
  "camera",
  "climate-sensor",
  "door-controller",
  "environmental-gateway",
  "audio-gateway",
  "doorbell-camera",
  "badge-reader",
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
  img_sharpness: z.number().min(0).max(11).optional().describe("Image sharpness (0 to 11; 6 works for most situations)"),
  resolution: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional()
    .describe("Video resolution (width x height)"),
  wdr_enabled: z.boolean().optional().describe("Enable Wide Dynamic Range"),
  wdr_strength: z.number().min(0).max(128).optional().describe("WDR strength (0 minimum to 128 maximum)"),
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
    .max(11)
    .optional()
    .describe("Night mode sharpness (0 to 11; 6 works for most situations)"),
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
  entityUuid: z
    .string()
    .nullable()
    .describe(
      'UUID of the entity to update. Faceted UUIDs are supported (e.g. "cameraUuid.v0" / "cameraUuid.v1") to target a specific camera facet; defaults to "v0" when no facet is given.',
    ),

  // Camera-specific update fields
  // These three arrive as free-form JSON strings, so the field schemas below are
  // NOT part of the input schema the model sees — this description text is the
  // only range guidance it ever gets. Keep it in sync with CameraVideoSettings /
  // CameraAudioSettings / CameraDeviceSettings.
  //
  // Promoting them to real object schemas would NOT make out-of-range values
  // impossible: the chatbot sends MCP tools to OpenAI with `strict: false`
  // (chatbot src/mcp/toolAdapters.ts), so there is no constrained decoding, and
  // even under `strict: true` JSON Schema `minimum`/`maximum` are not enforced
  // keywords. Range checking is therefore ALWAYS the tool's job — which is why
  // parseSettingsBlock reports the field, the bound, and the received value.
  cameraVideoSettings: z
    .string()
    .nullable()
    .describe(
      `JSON string of video settings to update for camera. Values outside these ranges are REJECTED — img_brightness: -255 to 255 · img_contrast: 0 to 128 · img_saturation: 0 to 255 · img_sharpness: 0 to 11 (6 is typical — NOT a 0-100 scale) · wdr_strength: 0 to 128 (64 is typical) · zero_motion_video_bitrate_percent: 0 to 100 · hdr_enabled / wdr_enabled / video_persist_disabled: booleans · resolution: {"width": n, "height": n}. The night-mode fields (night_img_brightness, night_img_contrast, night_img_saturation, night_img_sharpness) take the same ranges as their daytime counterparts. Example for a dark image: '{"img_brightness": 0, "wdr_strength": 64}'; for a washed-out image: '{"img_brightness": -50, "img_contrast": 80}'; for a blurry image: '{"img_sharpness": 8}'. Saturation matters — 0 yields grayscale; most cameras look best mid-range, tune from there.`,
    ),
  cameraAudioSettings: z
    .string()
    .nullable()
    .describe(
      `JSON string of audio settings to update for camera. audio_record / device_mic_enabled / device_speaker_enabled: booleans · audio_internal_mic_volume: 0 to 100 · audio_internal_speaker_volume: 0 to 100. Example: '{"audio_record": true, "audio_internal_mic_volume": 80}'.`,
    ),
  cameraDeviceSettings: z
    .string()
    .nullable()
    .describe(
      `JSON string of device settings to update for camera (name, timezone, LED). camera_name / camera_timezone: strings · led_intensity: 0 to 100 · led_mode: one of "auto", "always_on", "always_off" · led_stealth_mode: boolean. LED control uses EXACTLY these underscore field names (not camelCase): LED off = '{"led_stealth_mode": true}' (recommended) or '{"led_mode": "always_off"}'; LED on = '{"led_stealth_mode": false}' or '{"led_mode": "always_on"}' or '{"led_mode": "auto"}'.`,
    ),

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
