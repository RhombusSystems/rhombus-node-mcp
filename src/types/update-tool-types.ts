import { z } from "zod";

/**
 * The entity types this tool can actually update.
 *
 * Deliberately narrow. It previously listed climate-sensor, door-controller,
 * environmental-gateway, audio-gateway and badge-reader, none of which had a
 * handler — every one returned "not yet implemented. Coming soon!". Because the
 * chatbot adapts MCP tools with `strict: false`, an enum is advisory: nothing
 * stopped the model picking one of those, and each attempt burned a turn on a
 * guaranteed dead end. Add a value here only once its handler exists.
 */
export const ENTITY_TYPE = z.enum(["camera", "doorbell-camera"]);
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

// Privacy regions — blacked-out areas (rectangles or polygons) on live and
// recorded video. The
// geometry (rotation, PTZ, permyriad units, polygon vs legacy window by
// firmware) lives in api/privacy-region-geometry.ts.
const percent = (label: string) =>
  z.number().min(0).max(100).describe(`${label}, as a percentage (0 to 100) of the image as shown in the Console`);

export const PrivacyRegionRect = z
  .object({
    leftPercent: percent("Distance from the left edge of the image to the region's left edge"),
    topPercent: percent("Distance from the top edge of the image to the region's top edge"),
    widthPercent: percent("Region width"),
    heightPercent: percent("Region height"),
  })
  .strict()
  .refine(r => r.widthPercent > 0 && r.heightPercent > 0, {
    message: "widthPercent and heightPercent must both be greater than 0",
  })
  .refine(r => r.leftPercent + r.widthPercent <= 100.001 && r.topPercent + r.heightPercent <= 100.001, {
    message: "the region must fit inside the image (leftPercent + widthPercent and topPercent + heightPercent must be at most 100)",
  });

// Any simple polygon, vertices in drawing order. Shape rules the Console's
// editor enforces (no self-intersection, non-zero area, rectangles only on old
// firmware, R1/R2 coverage cap) need the camera, so they run in the handler via
// validatePrivacyShapes.
export const PrivacyRegionPolygon = z
  .object({
    points: z
      .array(
        z
          .object({
            xPercent: percent("Vertex distance from the left edge of the image"),
            yPercent: percent("Vertex distance from the top edge of the image"),
          })
          .strict()
      )
      .min(3)
      .max(64)
      .describe("The polygon's vertices in order around its outline (3 to 64 points)"),
  })
  .strict();

export const PrivacyRegionShape = z.union([PrivacyRegionRect, PrivacyRegionPolygon]);

export const PrivacyRegionsSpec = z
  .object({
    mode: z
      .enum(["add", "replace", "clear"])
      .describe('"add" keeps the regions already on the camera, "replace" removes them first, "clear" removes all regions'),
    regions: z.array(PrivacyRegionShape).optional(),
  })
  .strict()
  .refine(spec => spec.mode === "clear" || (spec.regions?.length ?? 0) > 0, {
    message: 'regions must contain at least one shape unless mode is "clear"',
    path: ["regions"],
  });
export type PrivacyRegionsSpec = z.infer<typeof PrivacyRegionsSpec>;

// Input schema for the tool
export const TOOL_ARGS = {
  entityType: ENTITY_TYPE.describe(
    "Type of entity to update. Only 'camera' and 'doorbell-camera' can be updated through this tool; " +
      "for climate sensors, door controllers, environmental gateways, audio gateways and badge readers, tell the " +
      "user the change has to be made in the Rhombus Console rather than attempting it here."
  ),
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

  // Optional (unlike its siblings) so callers built before this field existed
  // keep validating.
  privacyRegions: z
    .string()
    .nullable()
    .optional()
    .describe(
      `JSON string that adds, replaces or clears PRIVACY REGIONS on a camera (areas blacked out in live and recorded video). This is the ONLY way to change privacy regions — never put privacy fields in cameraVideoSettings. Coordinates are PERCENTAGES (0 to 100) of the image as the user sees it in the Console, measured from the top-left corner; the tool converts them for the camera's rotation and firmware. Shape: {"mode": "add" | "replace" | "clear", "regions": [...]}, where each region is EITHER a rectangle {"leftPercent": n, "topPercent": n, "widthPercent": n, "heightPercent": n} OR a polygon {"points": [{"xPercent": n, "yPercent": n}, ...]} with 3 to 64 vertices listed in order around the outline (any simple shape: triangle, slanted quadrilateral, an outline that follows a window or doorway at an angle; edges must not cross). Use a polygon whenever the area is not an upright rectangle — do not approximate a slanted area with a bounding rectangle. Cameras on firmware older than 2025_0626 accept rectangles only; the tool says so if a polygon is sent to one. "add" keeps existing regions (default choice), "replace" removes existing regions first, "clear" removes all regions (omit "regions"). Examples — the left quarter of the top half: '{"mode": "add", "regions": [{"leftPercent": 0, "topPercent": 0, "widthPercent": 25, "heightPercent": 50}]}'; a slanted quadrilateral: '{"mode": "add", "regions": [{"points": [{"xPercent": 10, "yPercent": 5}, {"xPercent": 40, "yPercent": 15}, {"xPercent": 35, "yPercent": 60}, {"xPercent": 5, "yPercent": 50}]}]}'. The tool reads the camera config back and reports the regions now in effect. Cameras only (not doorbell cameras).`,
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
  // Doorbell writes are verified by reading /doorbellcamera/getConfig back;
  // these carry the before values and anything the read-back contradicted.
  previousSettings: z.any().optional(),
  settingsNotApplied: z.any().optional(),
  settingsNotVerified: z.any().optional(),
  // Privacy-region writes: the regions in effect after the read-back, in the
  // same percent units the caller used.
  privacyRegions: z.any().optional(),
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
          // Sent only by the privacyRegions path; null is meaningful here (the
          // Console nulls the field the camera's firmware does not read).
          privacy_windows: z
            .array(
              z.object({
                x: z.number().int(),
                y: z.number().int(),
                w: z.number().int(),
                h: z.number().int(),
              })
            )
            .nullable()
            .optional(),
          privacy_window_polygons: z
            .array(z.object({ coordinates: z.array(z.object({ x: z.number(), y: z.number() })) }))
            .nullable()
            .optional(),
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
