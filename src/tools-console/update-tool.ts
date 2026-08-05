import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  updateCameraConfig,
  getCameraDetails,
  cleanUpdatePayload,
  formatCameraSettings,
  validateCameraFeatureSupport,
  updateDoorbellCameraConfig,
  getDoorbellCameraDetails,
} from "../api/update-tool-api.js";
import {
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
  UpdateCameraConfigPayload,
  CameraVideoSettings,
  CameraAudioSettings,
  CameraDeviceSettings,
  parseFacetedUuid,
} from "../types/update-tool-types.js";
import type { RequestModifiers } from "../util.js";
import { logger } from "../logger.js";

const TOOL_NAME = "update-tool";

const TOOL_DESCRIPTION = `
Updates configuration settings for Rhombus cameras and doorbell cameras: video settings (resolution, HDR/WDR, brightness, contrast, saturation), audio settings (recording, microphone, speaker) and device settings (name, timezone, LED control). Use this tool for ALL camera settings changes, including image-quality fixes (too dark, washed out, blurry).

MANDATORY confirmation flow: when you have proposed camera-settings fixes and the user replies with any affirmative ("yes", "confirm", "apply", "go ahead", ...), do not send text first — IMMEDIATELY call this tool with the settings you identified, and only report success after it returns. NEVER claim settings were updated without calling it; one confirmation covers all proposed changes.

Exact field names, LED rules, example payloads and faceted-UUID handling are documented on the parameters. The tool shows current settings before applying updates.
`;

// EVERY result from this tool must carry structuredContent: the tool registers
// an outputSchema, and the MCP SDK rejects any non-isError result without
// structuredContent as "MCP error -32602: ... no structured content was
// provided" — which REPLACES the real failure text. That is how an out-of-range
// img_sharpness once reached the user as "a system error" with nothing for the
// model to correct, so it retried the identical bad value and gave up.
function errorResult(text: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text }],
    structuredContent: { needUserInput: false, success: false, message: text },
  };
}

function valueAtPath(root: unknown, path: readonly PropertyKey[]): unknown {
  return path.reduce<unknown>(
    (node, key) =>
      node && typeof node === "object" ? (node as Record<PropertyKey, unknown>)[key] : undefined,
    root
  );
}

// The settings blocks are free-form JSON strings, so an out-of-range value is
// the normal failure here, not an exotic one. The message MUST name the field,
// the bound, and what was received — otherwise the model has nothing to act on.
function describeSettingsIssues(label: string, error: z.ZodError, input: unknown): string {
  const details = error.issues.map(issue => {
    const field = issue.path.length ? issue.path.join(".") : label;
    const received = valueAtPath(input, issue.path);
    const suffix = received === undefined ? "" : ` (received ${JSON.stringify(received)})`;
    if (issue.code === "too_big") {
      return `${field} must be at most ${(issue as z.core.$ZodIssueTooBig).maximum}${suffix}`;
    }
    if (issue.code === "too_small") {
      return `${field} must be at least ${(issue as z.core.$ZodIssueTooSmall).minimum}${suffix}`;
    }
    return `${field}: ${issue.message}${suffix}`;
  });
  return `Invalid ${label}: ${details.join("; ")}. Check the allowed ranges documented on this tool's parameters, then call again with in-range values. No settings were changed.`;
}

function parseSettingsBlock<T extends z.ZodType>(
  label: string,
  raw: string,
  schema: T,
  normalize?: (value: Record<string, unknown>) => void
): { ok: true; value: z.infer<T> } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return {
      ok: false,
      message: `Invalid ${label}: not valid JSON (${
        error instanceof Error ? error.message : "parse error"
      }). Pass a JSON object string, e.g. '{"img_brightness": 0}'. No settings were changed.`,
    };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      message: `Invalid ${label}: expected a JSON object, received ${
        Array.isArray(parsed) ? "an array" : String(parsed === null ? "null" : typeof parsed)
      }. No settings were changed.`,
    };
  }

  normalize?.(parsed as Record<string, unknown>);
  const result = schema.safeParse(parsed);
  if (!result.success) {
    return { ok: false, message: describeSettingsIssues(label, result.error, parsed) };
  }
  return { ok: true, value: result.data };
}

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const {
    entityType,
    entityUuid,
    cameraVideoSettings,
    cameraAudioSettings,
    cameraDeviceSettings,
    step,
  } = args;

  // Handle camera updates
  if (entityType === "camera") {
    // Step 3: Apply settings (if settings provided)
    if (
      entityUuid &&
      ((cameraVideoSettings && cameraVideoSettings.trim()) ||
        (cameraAudioSettings && cameraAudioSettings.trim()) ||
        (cameraDeviceSettings && cameraDeviceSettings.trim()))
    ) {
      try {
        // Parse the faceted UUID to extract base UUID and facet
        const { baseUuid, facet } = parseFacetedUuid(entityUuid);

        const updatePayload: any = {
          configUpdate: {
            deviceUuid: baseUuid,
          },
        };

        // Parse and add video settings
        if (cameraVideoSettings && cameraVideoSettings.trim()) {
          const video = parseSettingsBlock(
            "camera video settings",
            cameraVideoSettings,
            CameraVideoSettings
          );
          if (!video.ok) {
            return errorResult(video.message);
          }
          updatePayload.configUpdate.videoFacetSettings = {
            [facet]: cleanUpdatePayload(video.value),
          };
        }

        // Parse and add audio settings
        if (cameraAudioSettings && cameraAudioSettings.trim()) {
          const audio = parseSettingsBlock(
            "camera audio settings",
            cameraAudioSettings,
            CameraAudioSettings
          );
          if (!audio.ok) {
            return errorResult(audio.message);
          }
          updatePayload.configUpdate.audioFacetSettings = {
            [facet]: cleanUpdatePayload(audio.value),
          };
        }

        // Parse and add device settings
        if (cameraDeviceSettings && cameraDeviceSettings.trim()) {
          const device = parseSettingsBlock(
            "camera device settings",
            cameraDeviceSettings,
            CameraDeviceSettings,
            deviceSettings => {
              logger.debug("[update-tool] Raw device settings:", deviceSettings);

              // Transform ledMode to led_mode and OFF to always_off before validation
              if ("ledMode" in deviceSettings) {
                deviceSettings.led_mode =
                  deviceSettings.ledMode === "OFF" ? "always_off" : deviceSettings.ledMode;
                delete deviceSettings.ledMode;
              }

              // Convert string "true"/"false" to boolean for led_stealth_mode
              if (
                "led_stealth_mode" in deviceSettings &&
                typeof deviceSettings.led_stealth_mode === "string"
              ) {
                deviceSettings.led_stealth_mode = deviceSettings.led_stealth_mode === "true";
              }
            }
          );
          if (!device.ok) {
            return errorResult(device.message);
          }
          logger.debug("[update-tool] Validated device settings:", device.value);

          const cleaned = cleanUpdatePayload(device.value);
          logger.debug("[update-tool] Cleaned device settings:", cleaned);

          updatePayload.configUpdate.deviceSettings = cleaned;
        }

        // Validate the full payload
        const validatedPayload = UpdateCameraConfigPayload.parse(updatePayload);

        const featureValidation = await validateCameraFeatureSupport(
          validatedPayload,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        if (!featureValidation.canProceed) {
          return errorResult(
            featureValidation.error ||
              "This camera does not support one or more requested features."
          );
        }

        // Apply the updates
        const result = await updateCameraConfig(
          validatedPayload,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );

        if (!result.success) {
          const hasCapabilitySensitiveChange = hasCapabilitySensitiveSettings(validatedPayload);
          const normalizedError = hasCapabilitySensitiveChange
            ? "This camera may not support one or more requested settings."
            : result.error;
          return errorResult(`Failed to update camera settings: ${normalizedError}`);
        }

        // Format the updated settings for display
        const formattedSettings = formatCameraSettings(validatedPayload.configUpdate);

        const jsonResultResponse = {
          needUserInput: false,
          success: true,
          message: `✅ Camera settings updated successfully!\n\n${formattedSettings}`,
          entityType: "camera",
          entityUuid,
          updatedSettings: validatedPayload.configUpdate,
        };

        return {
          content: [
            {
              type: "text" as const,
              text: jsonResultResponse.message,
            },
          ],
          structuredContent: jsonResultResponse,
        };
      } catch (error) {
        return errorResult(
          `Error updating camera settings: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Step 2: Show settings configuration form (if entityUuid provided but no settings)
    if (entityUuid && step !== "entity-selection") {
      try {
        // Parse the faceted UUID to extract base UUID
        const { baseUuid } = parseFacetedUuid(entityUuid);

        // Get current camera details
        const cameraDetails = await getCameraDetails(
          baseUuid,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );

        if (!cameraDetails.success || !cameraDetails.data) {
          return errorResult(
            `Failed to get camera details: ${cameraDetails.error || "Camera not found"}`
          );
        }

        const camera = cameraDetails.data;
        const currentVideoSettings = camera.videoSettings || {};
        const currentAudioSettings = camera.audioSettings || {};
        const currentDeviceSettings = {
          camera_name: camera.name,
          camera_timezone: camera.timezone,
          led_intensity: camera.ledIntensity,
          led_mode: camera.ledMode,
        };

        const jsonResultResponse = {
          needUserInput: true,
          message: `Configure settings for camera "${camera.name}" (${entityUuid})\n\nCurrent settings are shown below. Modify the values you want to change:`,
          requestType: "camera-settings-configuration",
          submitAction: "update-tool",
          entityType: "camera",
          entityUuid,
          currentSettings: {
            video: currentVideoSettings,
            audio: currentAudioSettings,
            device: currentDeviceSettings,
          },
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(jsonResultResponse),
            },
          ],
          structuredContent: jsonResultResponse,
        };
      } catch (error) {
        return errorResult(
          `Error retrieving camera details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Step 1: Entity selection (if no entityUuid)
    if (!entityUuid) {
      const jsonResultResponse = {
        needUserInput: true,
        message:
          "Please provide the camera UUID you want to update.\n\nYou can provide a faceted UUID (e.g., 'cameraUuid.v0' or 'cameraUuid.v1') to update a specific facet, or just the base UUID to update facet v0 by default.\n\nYou can find the camera UUID in the Rhombus console or by using the search tools.",
        requestType: "entity-selection",
        submitAction: "update-tool",
        entityType: "camera",
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(jsonResultResponse),
          },
        ],
        structuredContent: jsonResultResponse,
      };
    }
  }

  // Doorbell cameras take the same setting names as cameras, but through
  // /doorbellcamera/updateConfig with ONE FLAT configUpdate rather than the
  // faceted video/audio/device split. Validation reuses the camera schemas, so
  // the documented ranges apply identically.
  if (entityType === "doorbell-camera") {
    if (
      !entityUuid ||
      !(
        (cameraVideoSettings && cameraVideoSettings.trim()) ||
        (cameraAudioSettings && cameraAudioSettings.trim()) ||
        (cameraDeviceSettings && cameraDeviceSettings.trim())
      )
    ) {
      return errorResult(
        "To update a doorbell camera, pass entityUuid plus at least one of cameraVideoSettings, cameraAudioSettings or cameraDeviceSettings. Use get-entity-tool with entityType doorbell-camera to find the uuid."
      );
    }

    try {
      // Doorbell configs are not faceted, so any .v0 suffix is dropped.
      const { baseUuid } = parseFacetedUuid(entityUuid);

      const flatSettings: Record<string, unknown> = {};

      if (cameraVideoSettings && cameraVideoSettings.trim()) {
        const video = parseSettingsBlock(
          "doorbell camera video settings",
          cameraVideoSettings,
          CameraVideoSettings
        );
        if (!video.ok) {
          return errorResult(video.message);
        }
        Object.assign(flatSettings, cleanUpdatePayload(video.value));
      }

      if (cameraAudioSettings && cameraAudioSettings.trim()) {
        const audio = parseSettingsBlock(
          "doorbell camera audio settings",
          cameraAudioSettings,
          CameraAudioSettings
        );
        if (!audio.ok) {
          return errorResult(audio.message);
        }
        Object.assign(flatSettings, cleanUpdatePayload(audio.value));
      }

      if (cameraDeviceSettings && cameraDeviceSettings.trim()) {
        const device = parseSettingsBlock(
          "doorbell camera device settings",
          cameraDeviceSettings,
          CameraDeviceSettings,
          deviceSettings => {
            if ("ledMode" in deviceSettings) {
              deviceSettings.led_mode =
                deviceSettings.ledMode === "OFF" ? "always_off" : deviceSettings.ledMode;
              delete deviceSettings.ledMode;
            }
            if (
              "led_stealth_mode" in deviceSettings &&
              typeof deviceSettings.led_stealth_mode === "string"
            ) {
              deviceSettings.led_stealth_mode = deviceSettings.led_stealth_mode === "true";
            }
          }
        );
        if (!device.ok) {
          return errorResult(device.message);
        }
        Object.assign(flatSettings, cleanUpdatePayload(device.value));
      }

      if (Object.keys(flatSettings).length === 0) {
        return errorResult(
          "No doorbell camera settings were recognised in the provided values, so nothing was changed."
        );
      }

      // Confirm the device exists first: /doorbellcamera/updateConfig accepts an
      // unknown uuid without complaining, which would report success for a
      // change that reached no device.
      const details = await getDoorbellCameraDetails(
        baseUuid,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      if (!details.success) {
        return errorResult(details.error ?? "Could not verify the doorbell camera.");
      }

      const result = await updateDoorbellCameraConfig(
        baseUuid,
        flatSettings,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      if (!result.success) {
        return errorResult(`Failed to update doorbell camera settings: ${result.error}`);
      }

      const changedKeys = Object.keys(flatSettings);
      const doorbellResponse = {
        needUserInput: false,
        message: `Updated ${changedKeys.length} setting(s) on the doorbell camera "${details.name ?? baseUuid}": ${changedKeys.join(", ")}.`,
        entityType: "doorbell-camera",
        entityUuid: baseUuid,
        success: true,
        updatedSettings: flatSettings,
      };
      return {
        content: [{ type: "text" as const, text: JSON.stringify(doorbellResponse) }],
        structuredContent: doorbellResponse,
      };
    } catch (error) {
      return errorResult(
        `Failed to update doorbell camera settings: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Step 0: Show initial form (no entityType provided)
  const entityTypeFormResponse = {
    needUserInput: true,
    message:
      "Welcome to the Rhombus entity update tool!\n\nWhat type of entity would you like to update?\n\n• **camera** - Update camera video, audio, or device settings\n• **doorbell-camera** - Update doorbell camera video, audio, or device settings\n\nPlease specify the entity type to continue.",
    requestType: "entity-type-selection",
    submitAction: "update-tool",
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(entityTypeFormResponse),
      },
    ],
    structuredContent: entityTypeFormResponse,
  };
};

function hasCapabilitySensitiveSettings(payload: UpdateCameraConfigPayload): boolean {
  const requestedVideoSettings = Object.values(payload.configUpdate.videoFacetSettings ?? {});
  const hasCapabilityDependentVideoChange = requestedVideoSettings.some(
    settings =>
      settings.resolution !== undefined ||
      settings.hdr_enabled !== undefined ||
      settings.wdr_enabled !== undefined ||
      settings.wdr_strength !== undefined
  );
  const requestedAudioSettings = Object.values(payload.configUpdate.audioFacetSettings ?? {});
  const hasCapabilityDependentAudioChange = requestedAudioSettings.some(
    settings =>
      settings.audio_record !== undefined ||
      settings.device_mic_enabled !== undefined ||
      settings.device_speaker_enabled !== undefined
  );
  return hasCapabilityDependentVideoChange || hasCapabilityDependentAudioChange;
}

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Update Settings",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    TOOL_HANDLER
  );
}
