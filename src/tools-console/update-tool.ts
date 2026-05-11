import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  updateCameraConfig,
  getCameraDetails,
  cleanUpdatePayload,
  formatCameraSettings,
  validateCameraFeatureSupport,
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
This tool allows updating configuration settings for various Rhombus entities. Currently supports:
- **Cameras**: Update video settings (resolution, HDR, WDR, brightness, contrast, etc.), audio settings (recording, microphone, speaker), and device settings (name, timezone, LED control).

For LED control, use EXACTLY these field names in cameraDeviceSettings:
- To turn LED off: {"led_stealth_mode": true} (recommended) or {"led_mode": "always_off"}
- To turn LED on: {"led_stealth_mode": false} or {"led_mode": "always_on"} or {"led_mode": "auto"}
- IMPORTANT: Use underscore in field names (led_mode, led_stealth_mode), not camelCase

The tool supports faceted UUIDs (e.g., "cameraUuid.v0" or "cameraUuid.v1") to update specific camera facets. If no facet is specified, defaults to "v0".

The tool guides users through a multi-step process:
1. Entity selection (if not provided)
2. Settings configuration with current values shown
3. Confirmation and application of changes

Future support planned for:
- Climate sensors
- Door controllers
- Environmental gateways
- Audio gateways
- Doorbell cameras
- Badge readers

The tool uses elicitation forms for rich user interaction and shows current settings before updates.

---

**CAMERA SETTINGS UPDATE FLOW** — Use this tool for ALL camera settings updates (brightness, contrast, WDR, resolution, audio, LED, etc.).
- For camera image-quality fixes: provide entityType="camera", entityUuid, and the specific settings to change in cameraVideoSettings.
- Example for dark image: update-tool(entityType="camera", entityUuid="<uuid>", cameraVideoSettings='{"img_brightness": 0, "wdr_strength": 64}').
- Example for washed out: update-tool(entityType="camera", entityUuid="<uuid>", cameraVideoSettings='{"img_brightness": -50, "img_contrast": 80}').
- Saturation matters — saturation 0 yields a grayscale image. Most cameras look best with mid-range values; tune from there.

**CONFIRMATION FLOW (MANDATORY)** — When the conversation history shows you analyzed a camera and proposed fixes, and the user replies with any affirmative ("yes", "confirm", "fix it", "apply", "do it", "go ahead", "proceed", "sure", "ok"):
1. DO NOT generate any text response first.
2. IMMEDIATELY call update-tool with the camera settings you previously identified.
3. Only after update-tool returns successfully, say "Done! Check your camera now…".

NEVER respond saying settings were updated without first calling update-tool — without the call, no changes take effect. Avoid multiple rounds of confirmation; get one confirmation for all proposed changes.
`;

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
          const videoSettings = JSON.parse(cameraVideoSettings);
          // Validate with zod schema
          const validatedVideo = CameraVideoSettings.parse(videoSettings);
          updatePayload.configUpdate.videoFacetSettings = {
            [facet]: cleanUpdatePayload(validatedVideo),
          };
        }

        // Parse and add audio settings
        if (cameraAudioSettings && cameraAudioSettings.trim()) {
          const audioSettings = JSON.parse(cameraAudioSettings);
          // Validate with zod schema
          const validatedAudio = CameraAudioSettings.parse(audioSettings);
          updatePayload.configUpdate.audioFacetSettings = {
            [facet]: cleanUpdatePayload(validatedAudio),
          };
        }

        // Parse and add device settings
        if (cameraDeviceSettings && cameraDeviceSettings.trim()) {
          const deviceSettings = JSON.parse(cameraDeviceSettings);
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

          // Validate with zod schema
          const validatedDevice = CameraDeviceSettings.parse(deviceSettings);
          logger.debug("[update-tool] Validated device settings:", validatedDevice);

          const cleaned = cleanUpdatePayload(validatedDevice);
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
          return {
            content: [
              {
                type: "text" as const,
                text:
                  featureValidation.error ||
                  "This camera does not support one or more requested features.",
              },
            ],
          };
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
          return {
            content: [
              {
                type: "text" as const,
                text: `Failed to update camera settings: ${normalizedError}`,
              },
            ],
          };
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
        return {
          content: [
            {
              type: "text" as const,
              text: `Error updating camera settings: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
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
          return {
            content: [
              {
                type: "text" as const,
                text: `Failed to get camera details: ${cameraDetails.error || "Camera not found"}`,
              },
            ],
          };
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
        return {
          content: [
            {
              type: "text" as const,
              text: `Error retrieving camera details: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
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

  // Handle other entity types (future implementation)
  if (entityType === "climate-sensor") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Climate sensor updates are not yet implemented. Coming soon!",
        },
      ],
    };
  }

  if (entityType === "door-controller") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Door controller updates are not yet implemented. Coming soon!",
        },
      ],
    };
  }

  if (entityType === "environmental-gateway") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Environmental gateway updates are not yet implemented. Coming soon!",
        },
      ],
    };
  }

  if (entityType === "audio-gateway") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Audio gateway updates are not yet fully implemented. Coming soon!",
        },
      ],
    };
  }

  if (entityType === "doorbell-camera") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Doorbell camera updates are not yet fully implemented. Coming soon!",
        },
      ],
    };
  }

  if (entityType === "badge-reader") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Badge reader updates are not yet fully implemented. Coming soon!",
        },
      ],
    };
  }

  // Step 0: Show initial form (no entityType provided)
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({
          needUserInput: true,
          message:
            "Welcome to the Rhombus entity update tool!\n\nWhat type of entity would you like to update?\n\n• **camera** - Update camera video, audio, or device settings\n• **climate-sensor** - Update climate sensor settings (coming soon)\n• **door-controller** - Update door controller settings (coming soon)\n• **environmental-gateway** - Update environmental gateway settings (coming soon)\n\nPlease specify the entity type to continue.",
          requestType: "entity-type-selection",
          submitAction: "update-tool",
        }),
      },
    ],
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
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
