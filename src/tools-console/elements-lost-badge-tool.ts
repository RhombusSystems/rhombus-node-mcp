import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getElementsLostBadgeResponse } from "../api/elements-lost-badge-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/elements-lost-badge-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "elements-lost-badge-tool";

const TOOL_DESCRIPTION = `
Lost / stolen-badge live response for Honeywell Elements (LenelS2 Elements) access. Use for "a lost badge was just used —
who is it and where did they go?", or to review lost/inactive-badge use over a window.

For each lost/inactive-badge use it returns:
- cardholderOfRecord (who the badge belongs to — may NOT be who used it) and badgeStatus
- the door deviceUuid + time, plus clipHint / stillHint for the door footage
- facesAtDoor: the face(s) captured at the door at that moment — a recognized name, or UNIDENTIFIED (an unknown
  face on a valid badge is the strongest stolen/shared-badge signal), with a thumbnail
- sightings: that same face tracked across cameras, ordered in time, ending in lastKnownSighting (last-known location)

Resolve relative times (e.g. "in the last hour") to ISO 8601 first via time-tool.

To present: show the door still/clip (camera-tool image / clips-tool createClip with the hints), the face at the
door, and the cross-camera track to last-known location. Detection + door evidence are reliable; the face track
depends on face-recognition coverage, so treat it as investigative, not proof.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    const result = await getElementsLostBadgeResponse(
      {
        area: args.area ?? undefined,
        locationUuids: args.locationUuids ?? undefined,
        deviceUuids: args.deviceUuids ?? undefined,
        afterMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
        beforeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
        faceWindowSeconds: args.faceWindowSeconds ?? undefined,
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
      title: "Elements Lost Badge",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
