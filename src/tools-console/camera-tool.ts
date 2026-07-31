import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCameraSettings, getImageForCameraAtTime, getCameraMediaUris, getCameraAIThresholds } from "../api/camera-tool-api.js";
import { getLogger } from "../logger.js";
import { BASE_TOOL_ARGS, type ToolArgs } from "../types/camera-tool-types.js";
import { extractFromToolExtra } from "../util.js";

const TOOL_NAME = "camera-tool";

// Tool descriptions are billed on EVERY LLM call even while the tool is
// deferred behind hosted tool_search, so this string carries only what the
// model needs to CHOOSE this tool (including the triggers that MUST route
// here). The step-by-step flows live on the requestType parameter description
// — unbilled until the tool is loaded, and in front of the model exactly when
// it is acting. See PERF_MASTER_PLAN P2 #4a.
const TOOL_DESCRIPTION = `
Acts on a camera's video stream. Set "requestType":
- **image** — a frame from the camera at a given time (timestampISO defaults to ~5 minutes before now for a near-live view; pass a historical timestamp for a past moment, e.g. the time of a badge event). A high-resolution capture of what the camera saw — people, vehicles, license plates, any detectable object — for object recognition, anomaly detection, incident investigation, or situational assessment. Optional crop args zoom into a sub-region.
- **get-settings** — current configuration of a camera or associated device (sensor, access controller): resolution, bitrate, image/exposure settings, storage. To CHANGE settings use **update-tool** instead.
- **get-media-uris** — the camera's streaming/playback URIs (LAN and WAN live-stream and VOD URLs, e.g. H.264 and M3U8). Use when the user needs direct stream or playback endpoints.
- **get-ai-thresholds** — the camera's AI detection threshold configuration (confidence thresholds for detection events). Use when diagnosing why a camera is or isn't generating AI events.

**This tool is REQUIRED, not optional, for two situations** (the exact steps are on the requestType parameter):
1. **Camera image quality** — "doesn't look great", poor image quality, dark, bright, blurry, washed out, "fix the image", "adjust settings to be optimal", or any mention of image appearance problems: snapshot immediately without asking, then check settings, then propose changes.
2. **Filtering cameras by what they see** — interior vs exterior, "facing the street", "with a view of X", parking lot, entrance, or any "I want X using cameras with Y": snapshot each candidate camera and judge the predicate from the images.
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
