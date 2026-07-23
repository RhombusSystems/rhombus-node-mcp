import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCameraSettings, getImageForCameraAtTime, getCameraMediaUris, getCameraAIThresholds } from "../api/camera-tool-api.js";
import { getLogger } from "../logger.js";
import { BASE_TOOL_ARGS, type ToolArgs } from "../types/camera-tool-types.js";
import { extractFromToolExtra } from "../util.js";

const TOOL_NAME = "camera-tool";

const TOOL_DESCRIPTION = `
This tool can perform some action pertaining to the video stream of a camera. There are four types of requests
that can be passed into "requestType":
- image
- get-settings
- get-media-uris
- get-ai-thresholds

What follows is a description of the behavior of this tool given the requestType "image"

This tool should be used any time someone wants to specify a subset of cameras to use for a task, based on some features that the camera sees.  For example, interior cameras, cameras facing the street, cameras with a view of X, Y, Z, etc.

For instance if someone says "I want X using cameras with Y" then this tool should get a snapshot of the image to answer the question of if the camera satisfies the Y predicate.

This tool fetches a frame from a designated security camera at a given time (timestampISO — defaults to ~5 minutes
before now for a near-live view; pass a historical timestamp to see a past moment, e.g. the time of a badge event).
The image serves as a contextual input source for downstream tasks such as object recognition, anomaly detection,
incident investigation, or situational assessment. When invoked, the tool provides the following:
- Visual Scene Capture: A high-resolution image of what the camera observed at that time, including people, vehicles, license plates, and any detectable objects.
- Optional zoom: pass cropX, cropY, cropWidth, cropHeight (each a percentage 0-100, origin at the top-left) to return only a sub-region of the frame so you can inspect a detail (e.g. a license plate or a doorway) more closely. Omit them for the full frame. When zooming into a small crop, pass a smaller downscaleFactor (e.g. 1-3) to preserve detail.

What follows is a description of the behavior of this tool given the requestType "get-settings"

This tool retrieves the current configuration for a specified camera or associated device (e.g., sensor, access controller). The returned JSON object can include detailed camera settings (e.g., resolution, bitrate) and various device-specific configurations (e.g. storage settings).

By default (detail: "core") bulky geometry/table sub-configs (metering tables, ROI polygons, PTZ/motor config) are elided with an "<omitted...>" placeholder — everything you need to read or change image/video/exposure/storage settings is included. Pass detail: "full" only when the user asks about one of the elided areas.

NOTE: To update camera settings, use the update-tool instead.

What follows is a description of the behavior of this tool given the requestType "get-media-uris"

Returns the camera's streaming/playback media URIs (LAN and WAN live-stream and VOD URLs, e.g. H.264 and M3U8 endpoints). Use when the user needs direct stream/playback endpoints for a camera.

What follows is a description of the behavior of this tool given the requestType "get-ai-thresholds"

Returns the camera's AI detection threshold configuration (e.g. confidence thresholds for detection events). Use when diagnosing why a camera is or isn't generating AI events.

---

**AUTOMATIC SNAPSHOT FOR IMAGE QUALITY ISSUES** — When a user mentions camera image quality (darkness, brightness, blur, washed out, "doesn't look great", "fix the image", etc.), you MUST IMMEDIATELY:
1. Call camera-tool with requestType "image" to capture a snapshot WITHOUT asking first.
2. Analyze the image to identify quality issues.
3. Call camera-tool with requestType "get-settings" to check current camera settings.
4. Propose specific setting changes based on your analysis (store the exact values you plan to change, e.g. img_brightness, wdr_strength).
5. When the user confirms ("yes", "confirm", "fix it", "apply", "go ahead", "ok", etc.), call update-tool with those stored settings — see update-tool's description for the confirmation flow. NEVER skip the update-tool call.

Examples that REQUIRE the automatic snapshot flow:
- "This camera's image doesn't look great"
- "The image quality is poor"
- "Can you fix the image"
- "Adjust settings to be optimal"
- "The camera looks blurry/dark/washed out"
- Any mention of image appearance problems.

**VISUAL-FEATURE CAMERA FILTERING** — When the user asks for cameras filtered by what they can see (indoors/outdoors, "facing the street", "with a view of X", parking lot, entrance), you MUST:
1. First get the camera list via get-entity-tool or location-tool.
2. Then call camera-tool with requestType "image" for EACH candidate camera (in PARALLEL).
3. Analyze each image to determine if it meets the user's criteria.
4. Return only the cameras that match.
`;

const logger = getLogger("camera-tool");

const TOOL_ARGS = BASE_TOOL_ARGS;

// get-settings `detail: "core"` — the faceted config carries geometry/table
// sub-configs that dwarf the settings anyone reads or edits. Elide those
// (recursively, so facet nesting doesn't matter) and cap any remaining
// oversized leaf so the default response stays well under the 5k
// LLM-compaction threshold. `detail: "full"` skips this entirely.
const SETTINGS_BLOAT_KEYS = new Set([
  "metering_config",
  "motor_config",
  "ptz_config",
  "region_for_occupancy",
  "region_of_interest",
  "privacy_window_config",
  "alert_regions",
]);
const SETTINGS_VALUE_CHAR_LIMIT = 1_500;
const OMITTED_PLACEHOLDER = '<omitted at detail:"core" — pass detail:"full" to include>';

function compactSettings(value: unknown): unknown {
  if (Array.isArray(value)) {
    const json = JSON.stringify(value);
    if (json && json.length > SETTINGS_VALUE_CHAR_LIMIT) return OMITTED_PLACEHOLDER;
    return value.map(compactSettings);
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (SETTINGS_BLOAT_KEYS.has(key)) {
        out[key] = OMITTED_PLACEHOLDER;
        continue;
      }
      out[key] = compactSettings(child);
    }
    return out;
  }
  if (typeof value === "string" && value.length > SETTINGS_VALUE_CHAR_LIMIT) {
    return OMITTED_PLACEHOLDER;
  }
  return value;
}

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { cameraUuid, timestampISO, requestType, cropX, cropY, cropWidth, cropHeight, downscaleFactor } =
    args;

  if (!cameraUuid) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            needUserInput: true,
            commandForUser: "Which camera are you talking about?",
          }),
        },
      ],
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: this will be returned, and can be any type since it will be JSON.stringify'd
  let response: any;
  const timestampMs = timestampISO ? new Date(timestampISO).getTime() : Date.now() - 1000 * 60 * 5;

  const { requestModifiers, sessionId } = extractFromToolExtra(extra);

  switch (requestType) {
    case "image":
      response = await getImageForCameraAtTime(cameraUuid, timestampMs, requestModifiers, sessionId, {
        crop: {
          x: cropX ?? null,
          y: cropY ?? null,
          width: cropWidth ?? null,
          height: cropHeight ?? null,
        },
        downscaleFactor: downscaleFactor ?? null,
      });

      if (!response.success || !response.imageData) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify(response) }],
        };
      }

      logger.debug(`Received image response (base64 length ${response.imageData.length})`);

      return {
        content: [
          {
            type: "image" as const,
            data: response.imageData,
            mimeType: "image/jpeg",
          },
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              status: "image-attached",
              cameraUuid,
              timestampMs,
              cropApplied: response.crop ?? null,
            }),
          },
        ],
      };

    case "get-settings": {
      response = await getCameraSettings(cameraUuid, requestModifiers, sessionId);
      if (args.detail !== "full" && response?.config) {
        response = { ...response, config: compactSettings(response.config) };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    }
    case "get-media-uris":
      response = await getCameraMediaUris(cameraUuid, requestModifiers, sessionId);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    case "get-ai-thresholds":
      response = await getCameraAIThresholds(cameraUuid, requestModifiers, sessionId);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(response) }],
      };
    default:
      response = {
        error: true,
        status: "missing unknown type from tool call",
      };
      break;
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ response }),
      },
    ],
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Cameras",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
