import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getPersonTrack } from "../api/person-tracking-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/person-tracking-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "person-tracking-tool";

const TOOL_DESCRIPTION = `
Tracks one person's movements across cameras using face recognition. Use this for "track this person",
"where did X go", "follow this person across the building", or "where was X last seen" — the camera-based
counterpart to the badge-timeline tools (which follow door taps).

Identify the person ONE of three ways (in priority order):
- faceEventUuid: track by APPEARANCE from a specific sighting — works even for an unrecognized/unnamed
  person (e.g. follow the person in this face event). Get a faceEventUuid from the faces-tool.
- personUuid: the exact registered-person UUID (from faces-tool get-registered-faces).
- personQuery: a full-text name (e.g. "Eve" or "Eve Adams"); it is resolved against the registered-faces
  directory. If "ambiguousPeople" is returned the name matched more than one person — ask the user which
  one before trusting the track.

Returns the person's sightings in CHRONOLOGICAL order (oldest first), each with:
- datetime / timestampMs, deviceUuid (the camera), and locationUuid
- similarity (only on appearance/faceEventUuid tracks) and a face thumbnail key
- clipHint (camera + start/end window) and stillHint (camera + timestamp)
- gapToNextSeconds: time until the next sighting (a large gap = unobserved movement between cameras)
plus a "path" array (the camera sequence, consecutive repeats collapsed) and "lastKnownSighting" (the
person's last-known location).

Resolve relative times like "yesterday" to ISO 8601 first (use the timestamp tool), then pass
startTime/endTime. Face tracking depends on face-recognition coverage, so treat the track as investigative.

IMPORTANT — to show the movement visually: for each sighting (or the key transitions), call the camera-tool
(requestType "image", cameraUuid = sighting.deviceUuid, timestamp = sighting.timestampMs) for a still, and/or
the clips-tool (requestType "createClip", using sighting.clipHint) for video. Issue those per-sighting media
calls in PARALLEL, then present the track as a chronological narrative.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getPersonTrack(
      {
        personQuery: args.personQuery ?? undefined,
        personUuid: args.personUuid ?? undefined,
        faceEventUuid: args.faceEventUuid ?? undefined,
        locationUuids: args.locationUuids ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        clipPaddingSeconds: args.clipPaddingSeconds ?? undefined,
        limit: args.limit ?? undefined,
      },
      args.timeZone ?? "UTC",
      requestModifiers,
      sessionId
    );
    return createToolStructuredContent<OUTPUT_SCHEMA>(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: message });
  }
};

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
