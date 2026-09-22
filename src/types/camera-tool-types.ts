import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { createUuidSchema } from "../types.js";

export const TimeWindowSecondsSchema = z.object({
  startSeconds: z.number(),
  durationSeconds: z.number(),
});

export const PresenceWindowsResponseSchema = z.object({
  presenceWindows: z
    .object({
      VideoLocal: z.array(TimeWindowSecondsSchema).nullable().optional(),
      VideoCloud: z.array(TimeWindowSecondsSchema).nullable().optional(),
    })
    .nullable(),
});

export const CameraDaysResultSchema = z.object({
  daysInCloud: z.number(),
  daysOnCamera: z.number(),
});

export const CameraFullStateResponseSchema = z.object({
  fullCameraState: z
    .object({
      onCloudState: z
        .object({
          cloud_archive_days: z.number().optional(),
        })
        .nullable()
        .optional(),
      onCameraState: z
        .object({
          oldest_segment_secs: z.number().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable(),
});

export const CameraStorageDataSchema = z.object({
  daysInCloud: z.number(),
  daysOnCamera: z.number(),
  cloudArchiveDays: z.number().nullable(),
});

export type TimeWindowSeconds = z.infer<typeof TimeWindowSecondsSchema>;
export type PresenceWindowsResponse = z.infer<typeof PresenceWindowsResponseSchema>;
export type CameraDaysResult = z.infer<typeof CameraDaysResultSchema>;
export type CameraFullStateResponse = z.infer<typeof CameraFullStateResponseSchema>;
export type CameraStorageData = z.infer<typeof CameraStorageDataSchema>;

export const VideoFacetSettings = z
  .object({
    // blocked_debounce_time_ms: z.number().int().nullable(),
    // blocked_threshold: z.number().int().nullable(),
    // dewarpMode: z.enum([
    //   'NO_TRANSFORM',
    //   'NORMAL',
    //   'PANORAMA',
    //   'SUB_REGION',
    //   'VERTICAL_PANORAMA',
    //   'TRANSVERSE_MERCATOR',
    //   'MERCATOR',
    //   'EQUIRECTANGULAR',
    // ]).nullable(),
    // disabled_schedule: z.array(
    //   z.object({
    //     minuteOfWeekStart: z.number().int().nullable(),
    //     minuteOfWeekStop: z.number().int().nullable(),
    //   }).nullable()
    // ).nullable(),
    // disabled_schedule_inverted: z.boolean().nullable(),
    // disabled_schedule_uuid: z.string().nullable(),
    // exposure_level: z.number().nullable(),
    // fisheye_display_mode: z.enum(['RAW', 'IMMERSIVE', 'TILES', 'RAW_PANO']).nullable(),
    // floorplan_homography: z.array(z.array(z.number().nullable()).nullable()).nullable(),
    hdr_enabled: z.boolean().nullable(),
    img_brightness: z
      .number()
      .nullable()
      .describe(
        "Ranges from [-255, 255]. The image is described as a range from [0, 255], and the brightness slider will ADD this value to whatever the original value is. Use this accordingly."
      ),
    img_contrast: z
      .number()
      .nullable()
      .describe(
        "Ranges from [0, 128]. In general, 64 works for most situations, but adjust accordingly."
      ),
    img_saturation: z
      .number()
      .nullable()
      .describe(
        "Ranges from [0, 255]. In general, 64 works for most situations, but adjust accordingly."
      ),
    img_sharpness: z
      .number()
      .nullable()
      .describe(
        "Ranges from [0, 11]. In general, 6 works for most situations, but adjust accordingly."
      ),
    // metering_config: z.object({
    //   rotation: z.number().nullable(),
    //   table: z.string().nullable(),
    // }).nullable(),
    // motor_config: z.object({
    //   af_enabled: z.boolean().nullable(),
    //   af_region: z.object({
    //     x: z.number().int().min(0).max(10000).nullable(),
    //     y: z.number().int().min(0).max(10000).nullable(),
    //     width: z.number().int().min(0).max(10000).nullable(),
    //     height: z.number().int().min(0).max(10000).nullable(),
    //   }).nullable(),
    //   focus: z.number().nullable(),
    //   piris: z.number().nullable(),
    //   zoom: z.number().nullable(),
    // }).nullable(),
    // mounting_direction: z.enum(['DOWN', 'UP', 'SIDEWAYS', 'UNKNOWN']).nullable(),
    night_exposure_level: z.number().nullable(),
    night_img_brightness: z.number().nullable(),
    night_img_contrast: z.number().nullable(),
    night_img_saturation: z.number().nullable(),
    night_img_sharpness: z.number().nullable(),
    // night_metering_config: CameraMeteringConfigTypeSchema.nullable(),
    night_sensor_gain_max: z.number().nullable(),
    night_shutter_time_max: z.number().nullable(),
    night_shutter_time_min: z.number().nullable(),
    // object_search: z.boolean().nullable(),
    // privacy_windows: z.array(
    //   z.object({
    //     x: z.number().int().min(0).max(10000).nullable(),
    //     y: z.number().int().min(0).max(10000).nullable(),
    //     width: z.number().int().min(0).max(10000).nullable(),
    //     height: z.number().int().min(0).max(10000).nullable(),
    //   }).nullable()
    // ).nullable(),
    // ptz_config: z.object({
    //   offset_x_percent: z.number().nullable(),
    //   offset_y_percent: z.number().nullable(),
    //   rotation: z.number().nullable(),
    //   size_percent: z.number().nullable(),
    // }).nullable(),
    // region_for_occupancy: z.object({
    //   inverted: z.boolean().nullable(),
    //   polygons: z.array(
    //     z.object({
    //       coordinates: z.array(
    //         z.object({
    //           x: z.number().nullable(),
    //           y: z.number().nullable(),
    //         }).nullable()
    //       ).nullable(),
    //     }).nullable()
    //   ).nullable(),
    // }).nullable(),
    // region_of_interest: z.object({
    //   inverted: z.boolean().nullable(),
    //   polygons: z.array(
    //     z.object({
    //       coordinates: z.array(
    //         z.object({
    //           x: z.number().nullable(),
    //           y: z.number().nullable(),
    //         }).nullable()
    //       ).nullable(),
    //     }).nullable()
    //   ).nullable(),
    // }).nullable(),
    // region_of_interest_groups: z.array(
    //   z.object({
    //     inclusive: z.boolean().nullable(),
    //     regionsOfInterest: z.array(
    //       z.object({
    //         activities: z.array(z.string()).nullable(), // Assuming ActivityEnumSchema is just string
    //         name: z.string().nullable(),
    //         polygon: z.object({
    //           coordinates: z.array(
    //             z.object({
    //               x: z.number().nullable(),
    //               y: z.number().nullable(),
    //             }).nullable()
    //           ).nullable(),
    //         }).nullable(),
    //         uuid: z.string().nullable(),
    //       }).nullable()
    //     ).nullable(),
    //     type: z.enum(['ACTIVITY', 'REPORTING', 'CROSSING']).nullable(),
    //   }).nullable()
    // ).nullable(),
    resolution: z
      .object({
        width: z.number().int().positive().nullable(),
        height: z.number().int().positive().nullable(),
      })
      .nullable(),
    rotation: z.number().nullable(),
    segment_max_bytes: z.number().nullable(),
    sensor_gain_max: z.number().nullable(),
    shutter_time_max: z.number().nullable(),
    shutter_time_min: z.number().nullable(),
    snapshot_height: z.number().nullable(),
    snapshot_interval_secs: z.number().nullable(),
    // tile_views: z.array(
    //   z.object({
    //     aspectRatio: z.object({
    //       width: z.number().nullable(),
    //       height: z.number().nullable(),
    //     }).nullable(),
    //     pitchDegrees: z.number().nullable(),
    //     rollDegrees: z.number().nullable(),
    //     verticalFieldOfViewDegrees: z.number().nullable(),
    //     yawDegrees: z.number().nullable(),
    //   }).nullable()
    // ).nullable(),
    // updatedSetMethodMap: z.record(z.boolean().nullable()).nullable(),
    video_persist_disabled: z.boolean().nullable(),
    // wdr_enabled: z.boolean().nullable(), TODO: find a way to tell the LLM which devices support this
    wdr_strength: z.number().nullable().describe("Ranges from [0, 128]."),
    zero_motion_video_bitrate_percent: z.number().nullable(),
  })
  .nullable()
  .describe(
    "This describes the kind of settings that you can manipulate for a camera. If the user asks to change settings, only change what is necessary and don't pass in any fields that you do not need."
  );

export const ExternalUpdateableFacetedUserConfigSchema = z.object({
  /** Update Video Settings */
  videoFacetSettings: z
    .object({
      v0: VideoFacetSettings,
    })
    .describe(
      "For each of the object keys: v0, v1, v2, v3, they correspond to a specific facet of the camera, since a camera may have multiple facets, up to 4. Hence, why they are zero-indexed."
    ),
});

export type ExternalUpdateableFacetedUserConfig = z.infer<
  typeof ExternalUpdateableFacetedUserConfigSchema
>;

export const BASE_TOOL_ARGS = {
  cameraUuid: createUuidSchema().describe("the camera uuid requested"),
  timestampISO: z
    .string()
    .datetime({ message: "Invalid ISO 8601 date format.", offset: true })
    .nullable()
    .describe(
      `
      the timestamp for the image. This will default to 5 minutes before the current time. You can also call time-tool to parse the user's time description.
      ` + ISOTimestampFormatDescription
    ),
  requestType: z
    .enum(["image", "get-settings", "get-media-uris", "get-ai-thresholds"])
    .describe(
      `Which camera action to run: "image" (fetch a frame), "get-settings" (current device configuration), "get-media-uris" (live-stream and VOD URLs), "get-ai-thresholds" (AI detection thresholds).

**AUTOMATIC SNAPSHOT FOR IMAGE QUALITY ISSUES** — when a user mentions camera image quality (darkness, brightness, blur, washed out, "doesn't look great", "fix the image", etc.), you MUST IMMEDIATELY:
1. Call camera-tool with requestType "image" to capture a snapshot WITHOUT asking first.
2. Analyze the image to identify quality issues.
3. Call camera-tool with requestType "get-settings" to check current camera settings.
4. Propose specific setting changes based on your analysis (store the exact values you plan to change, e.g. img_brightness, wdr_strength).
5. When the user confirms ("yes", "confirm", "fix it", "apply", "go ahead", "ok", etc.), call update-tool with those stored settings — see update-tool's description for the confirmation flow. NEVER skip the update-tool call.

**VISUAL-FEATURE CAMERA FILTERING** — when the user asks for cameras filtered by what they can see (indoors/outdoors, "facing the street", "with a view of X", parking lot, entrance), you MUST:
1. First get the camera list via get-entity-tool or location-tool.
2. Then call camera-tool with requestType "image" for EACH candidate camera (in PARALLEL).
3. Analyze each image to determine if it meets the user's criteria.
4. Return only the cameras that match.`,
    ),
  detail: z
    .enum(["core", "full"])
    .nullish()
    .transform((v) => v ?? "core")
    .describe(
      "For requestType 'get-settings' only. 'core' (default) elides bulky geometry/table sub-configs (metering tables, ROI polygons, PTZ/motor config) and oversized values, keeping the settings you can read and change (image/video/exposure/storage). Pass 'full' for the complete raw config."
    ),
  cropX: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe(
      "For requestType 'image' only. Left edge of the crop region as a percentage (0-100) of image width, measured from the left. 0 = left edge. Omit for full frame."
    ),
  cropY: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe(
      "For requestType 'image' only. Top edge of the crop region as a percentage (0-100) of image height, measured from the top. 0 = top edge. Omit for full frame."
    ),
  cropWidth: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe(
      "For requestType 'image' only. Width of the crop region as a percentage (0-100) of image width. Omit for full frame (100)."
    ),
  cropHeight: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe(
      "For requestType 'image' only. Height of the crop region as a percentage (0-100) of image height. Omit for full frame (100)."
    ),
  downscaleFactor: z
    .number()
    .min(1)
    .nullable()
    .optional()
    .describe(
      "For requestType 'image' only. Ratio to shrink the image pixels by (default 10). Use a smaller value (e.g. 1-3) when zooming into a crop to keep detail."
    ),
};

const BASE_TOOL_ARGS_SCHEMA = z.object(BASE_TOOL_ARGS);
export type BaseToolArgs = z.infer<typeof BASE_TOOL_ARGS_SCHEMA>;

// Type for tool args
export type ToolArgs = BaseToolArgs;

// TODO: replace with the generated schema["Video_GetExactFrameDataWSResponse"] once the
// OpenAPI spec includes /video/getExactFrameData and schemas are regenerated
// (npm run generate-schemas). The endpoint is new in ITG and not yet in schema.ts.
export type Video_GetExactFrameDataWSResponse = {
  error?: boolean | null;
  errorMsg?: string | null;
  warningMsg?: string | null;
  /** base64-encoded JPEG */
  frameData?: string | null;
  responseMessage?: string | null;
};

// Output schema — registered so the filtering proxy can project results and
// generate the includeFields path catalog. All fields optional: which subset
// appears depends on requestType. Every handler return must carry
// structuredContent (or isError: true) once this is registered — the SDK
// otherwise replaces the real message with an opaque -32602 (see CLAUDE.md).
export const OUTPUT_SCHEMA = {
  // asked for a camera without saying which
  needUserInput: z.boolean().optional(),
  commandForUser: z.string().optional(),

  // requestType: "image"
  success: z.boolean().optional(),
  status: z.string().optional(),
  cameraUuid: z.string().optional(),
  timestampMs: z.number().optional(),
  cropApplied: z
    .object({
      x: z.number().nullable().optional(),
      y: z.number().nullable().optional(),
      width: z.number().nullable().optional(),
      height: z.number().nullable().optional(),
    })
    .nullable()
    .optional()
    .describe("The crop actually applied to the returned frame, if any"),

  // requestType: "get-settings" — the faceted config is free-form (~150 fields
  // per facet), so it is an open record; project with paths like
  // "config.videoFacetSettings".
  config: z.record(z.string(), z.unknown()).optional(),
  daysInCloud: z.number().optional(),
  daysOnCamera: z.number().optional(),
  cloudArchiveDays: z.number().nullable().optional(),

  // requestType: "get-media-uris" (subset of Camera_GetMediaUrisWSResponse)
  lanCheckUrls: z.array(z.string().nullable()).nullable().optional(),
  lanLiveH264Uris: z.array(z.string().nullable()).nullable().optional(),
  lanLiveM3u8Uris: z.array(z.string().nullable()).nullable().optional(),
  lanLiveMpdUris: z.array(z.string().nullable()).nullable().optional(),
  lanLiveOpusUris: z.array(z.string().nullable()).nullable().optional(),
  lanVodM3u8UrisTemplates: z.array(z.string().nullable()).nullable().optional(),
  lanVodMpdUrisTemplates: z.array(z.string().nullable()).nullable().optional(),
  wanLiveH264Uri: z.string().nullable().optional(),
  wanLiveM3u8Uri: z.string().nullable().optional(),
  wanLiveMpdUri: z.string().nullable().optional(),
  wanLiveOpusUri: z.string().nullable().optional(),
  wanVodH264UriTemplate: z.string().nullable().optional(),
  wanVodM3u8UriTemplate: z.string().nullable().optional(),
  wanVodMpdUriTemplate: z.string().nullable().optional(),

  // requestType: "get-ai-thresholds" (Camera_GetCameraAIThresholdsWSResponse)
  consecutiveHumanFilter: z.number().nullable().optional(),
  consecutiveVehicleFilter: z.number().nullable().optional(),
  faceConfidenceThreshold: z.number().nullable().optional(),
  faceMatchConfidenceThreshold: z.number().nullable().optional(),
  humanConfidenceThreshold: z.number().nullable().optional(),
  lprConfidenceThreshold: z.number().nullable().optional(),
  vehicleConfidenceThreshold: z.number().nullable().optional(),
  maxEventDurationMs: z.number().nullable().optional(),

  // api2's success-with-caveat channel; in ALWAYS_PROTECTED_FIELDS so a
  // projection cannot strip it
  warningMsg: z.string().nullable().optional(),
};
