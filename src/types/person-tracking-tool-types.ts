import { z } from "zod";

import { createUuidSchema } from "../types.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  personQuery: z
    .string()
    .describe(
      'The person to track, full-text name match against their access-control (badge) records, e.g. "Brandon" or "Brandon Salzberg".'
    ),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("Start of the window to search badge taps and track over (inclusive). " + ISOTimestampFormatDescription),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
    .nullable()
    .describe("End of the window (inclusive). " + ISOTimestampFormatDescription),
  locationUuids: z
    .array(createUuidSchema())
    .nullable()
    .describe("Optional: restrict badge search and the re-id track to these Rhombus location UUIDs."),
  badgeMatchWindowSeconds: z
    .number()
    .nullable()
    .describe(
      "± seconds around the badge tap to look on the door camera for the person's re-id embedding (default 30)."
    ),
  clipPaddingSeconds: z
    .number()
    .nullable()
    .describe("Seconds of video before/after each sighting to include in the clip hint (default 15)."),
  limit: z.number().nullable().describe("Maximum sightings to include (default 200)."),
  timeZone: z
    .string()
    .nullable()
    .describe("IANA timezone used to format times, e.g. America/New_York. Defaults to UTC."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ClipHintSchema = z
  .object({ deviceUuid: z.string(), startTimeMs: z.number(), endTimeMs: z.number() })
  .describe("Pass to clips-tool createClip to get video of this sighting.");

const StillHintSchema = z
  .object({ deviceUuid: z.string(), timestampMs: z.number() })
  .describe("Pass to camera-tool (requestType image) to get a still of this sighting.");

export const RouteStopSchema = z.object({
  kind: z.enum(["badge", "camera"]).describe('"badge" = the badge tap that started the track; "camera" = a re-id visit.'),
  cameraUuid: z.string().optional().describe("The camera (for the badge stop: the door camera)."),
  cameraName: z.string().optional(),
  deviceType: z
    .enum(["camera", "doorbell-camera"])
    .optional()
    .describe('"doorbell-camera" = a DR40 video intercom (still has video, like a camera).'),
  locationUuid: z.string().optional(),
  doorUuid: z.string().optional().describe("Badge stop only: the Rhombus access-controlled door."),
  doorName: z.string().optional().describe("Badge stop only: door name (Rhombus) or area entered (vendor)."),
  integration: z.string().optional().describe("Badge stop only: Rhombus / OnGuard / Elements / NetBox."),
  timestampMs: z.number().describe("Arrival — the badge tap, or the visit's first sighting."),
  datetime: z.string().optional().describe("Arrival, human-readable in the requested timezone."),
  endTimestampMs: z.number().optional().describe("The visit's last sighting (unset for a single sighting)."),
  endDatetime: z.string().optional(),
  sightingCount: z.number().optional().describe("Re-id sightings merged into this visit."),
  thumbnailUri: z.string().optional().describe("Best-matching re-id crop of the person for this visit."),
  clipHint: ClipHintSchema.optional(),
  stillHint: StillHintSchema.optional(),
});

const RouteSchema = z
  .object({
    stops: z.array(RouteStopSchema).describe("The badge tap, then each camera visit, in chronological order."),
    totalStops: z.number().describe("Stops before sampling (badge tap included)."),
    truncated: z.boolean().describe("True when the visits were sampled down to fit the cap (first and last kept)."),
  })
  .describe(
    "The person's route after the badge tap. Consecutive sightings on one camera are one stop; at most 20 stops."
  );

const AnchorSchema = z
  .object({
    deviceUuid: z.string().optional().describe("The door camera where the badge tap happened."),
    timestampMs: z.number().optional(),
    datetime: z.string().optional(),
    integration: z
      .string()
      .optional()
      .describe("Which badge system the tap came from (Rhombus = native Rhombus door, OnGuard / Elements / NetBox)."),
    area: z.string().optional().describe("Door name (Rhombus) or area entered (vendor integrations)."),
    doorUuid: z.string().optional().describe("The Rhombus access-controlled door, for native Rhombus taps."),
  })
  .describe("The access-control badge tap used to ground the re-id track (the known identity moment).");

export const OUTPUT_SCHEMA = z.object({
  resolvedPerson: z
    .object({ name: z.string().optional() })
    .optional()
    .describe("The person resolved from the badge record."),
  anchor: AnchorSchema.optional(),
  route: RouteSchema.optional(),
  lastKnownLocation: RouteStopSchema.optional().describe("The last camera stop — last-known location."),
  count: z.number().optional().describe("Re-id sightings behind the track (before merging into stops)."),
  badgeEvents: z
    .array(
      z.object({
        integration: z.string().optional(),
        datetime: z.string().optional(),
        timestampMs: z.number().optional(),
        cardholderName: z.string().optional(),
        area: z.string().optional().describe("Door name (Rhombus) or area entered (vendor integrations)."),
        doorUuid: z.string().optional(),
        cameraUuid: z.string().optional().describe("A camera that sees this door, when one is known."),
        granted: z.boolean().optional().describe("False when the door denied the credential."),
      })
    )
    .optional()
    .describe("The person's badge taps across all sources, oldest first (capped at 25)."),
  sourcesChecked: z
    .array(z.string())
    .optional()
    .describe("Badge sources that answered (Rhombus, OnGuard, Elements, NetBox)."),
  sourceErrors: z
    .array(z.object({ source: z.string(), error: z.string() }))
    .optional()
    .describe("Badge sources that failed — their events are UNKNOWN, not zero."),
  note: z
    .string()
    .optional()
    .describe("Set when the track couldn't be built (no badge tap, door without a camera, or no re-id at the door)."),
  error: z.string().optional(),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
