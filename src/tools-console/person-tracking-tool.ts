import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getPersonTrack } from "../api/person-tracking-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/person-tracking-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "person-tracking-tool";

const TOOL_DESCRIPTION = `
Reconstructs where a named person went across cameras, e.g. "show me where Brandon Salzberg went" or
"track Eve through the building yesterday". Identity is grounded in ACCESS CONTROL and the track uses
person RE-IDENTIFICATION (appearance), NOT face recognition:

1. Finds the person's badge tap(s) (OnGuard / Elements / NetBox) in the window — a camera + time we KNOW
   is them. (Pass the name as it appears on the badge.)
2. Pulls the person re-id embedding recorded on that door camera nearest the badge tap (the person at the
   door).
3. Re-id-searches that appearance across all cameras over the window to reconstruct their movement.

Returns:
- resolvedPerson and "anchor" (the badge tap that grounded the track: door camera, time, integration).
- sightings: chronological re-id hits, each with deviceUuid (camera), timestampMs/datetime, distance
  (LOWER = closer appearance match), a thumbnail, clipHint/stillHint, and gapToNextSeconds.
- path (camera sequence) and lastKnownSighting (last-known location).
- note: set when no badge tap was found, or no re-id embedding existed on the door camera.

Resolve relative times like "yesterday" to ISO 8601 first (use the timestamp tool), then pass
startTime/endTime. Re-id depends on human-detection coverage, so treat the track as investigative, not proof.

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
        personQuery: args.personQuery,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        locationUuids: args.locationUuids ?? undefined,
        badgeMatchWindowSeconds: args.badgeMatchWindowSeconds ?? undefined,
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
      title: "Person Tracking",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
