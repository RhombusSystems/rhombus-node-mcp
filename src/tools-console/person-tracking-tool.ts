import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getPersonTrack } from "../api/person-tracking-tool-api.js";
import { OUTPUT_SCHEMA, TOOL_ARGS, type ToolArgs } from "../types/person-tracking-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "person-tracking-tool";

const TOOL_DESCRIPTION = `
Reconstructs where a named person went across cameras, e.g. "show me where Brandon Salzberg went" or
"track Eve through the building yesterday". Identity is grounded in ACCESS CONTROL and the track uses
person RE-IDENTIFICATION (appearance), NOT face recognition:

1. Finds the person's badge tap(s) in the window — a camera + time we KNOW is them. It searches EVERY badge
   source itself: native Rhombus access-controlled doors (by Rhombus user name) and the OnGuard / Elements /
   NetBox integrations. Do not pre-check or restrict to one vendor. (Pass the person's name.)
2. Pulls the person re-id embedding recorded on that door camera nearest the badge tap (the person at the
   door).
3. Re-id-searches that appearance across all cameras over the window to reconstruct their movement.

Returns:
- resolvedPerson and "anchor" (the badge tap that grounded the track: door camera, time, integration).
- route: the person's path AFTER the badge tap — stops[0] is the badge tap (kind "badge"), then each camera
  visit (kind "camera") in chronological order, with cameraName, arrival datetime, endDatetime (last sighting
  of that visit), sightingCount, clipHint and stillHint. Consecutive sightings on one camera are one stop; at
  most 20 stops (truncated=true when longer routes were sampled, first and last kept; totalStops = full count).
- lastKnownLocation: the last camera stop. count: re-id sightings behind the route.
- badgeEvents: the person's badge taps from all sources (door/area, time, integration, granted) and
  sourcesChecked / sourceErrors. These stand on their own: when the re-id track can't be built, still answer
  with the doors the person badged at. A source in sourceErrors is UNKNOWN, not "no events".
- note: set when no badge tap was found, the door has no camera, or the re-id step failed.

HOW TO ANSWER:
- Give the FULL route in order: the badge tap, then EVERY stop in route.stops as a numbered list,
  "cameraName — datetime" (add "until endDatetime" when set). Do not summarize it to the last sighting or
  skip stops. If truncated, say it shows N of totalStops stops.
- In Rhombus MIND the route is also rendered automatically as a clickable timeline (each stop opens that
  camera at that time), so do NOT add a list component of the route's cameras there.
- Resolve relative times like "yesterday" to ISO 8601 first (use time-tool), then pass startTime/endTime.
- Re-id is appearance-based and depends on human-detection coverage: call the track investigative, not proof.
- Only fetch stills (camera-tool requestType "image" with a stop's stillHint) or clips (clips-tool
  "createClip" with a stop's clipHint) when the user asks to see footage; issue those calls in PARALLEL.
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
