import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessControlEvents,
  getBrivoAccessControlEvents,
  getEventsForEnvironmentalGateway,
  getClimateEventsForSensor,
  getComponentEventsByLocation,
  describeEmptyComponentEventResult,
  getCameraFootageSeekpointEvents,
  resolveCameraWindow,
  summarizeCameraFootageEvents,
  totalActivityCounts,
  CAMERA_EVENTS_DEFAULT_LIMIT,
  CAMERA_SCAN_CONCURRENCY,
  CAMERA_SCAN_MAX_CAMERAS,
  CAMERA_SCAN_PER_CAMERA_TIMEOUT_MS,
  CAMERA_SCAN_TIME_BUDGET_MS,
  type CameraActivitySummary,
  type CameraWindow,
  getButtonPressEvents,
  getOccupancyEvents,
  getProximityEvents,
  getDoorbellEvents,
} from "../api/events-tool-api.js";
import { getCameraList } from "../api/get-entity-tool-api.js";
import {
  EventsToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/events-tools-types.js";
import { createToolStructuredContent, formatTimestamp, type RequestModifiers } from "../util.js";
import { getLogger } from "../logger.js";
import { TempUnit } from "../utils/temp.js";

const logger = getLogger("events-tool");

const TOOL_NAME = "events-tool";

// "faces" | "people" | "human" | "access-control"
//
// Tool descriptions are billed on EVERY LLM call even while the tool is
// deferred behind hosted tool_search, so this string carries only what the
// model needs to CHOOSE this tool. Per-mode arguments, field semantics, and
// enum catalogs live on the input-parameter descriptions (unbilled until the
// tool is loaded, still in front of the model when it builds the call).
// See PERF_MASTER_PLAN P2 #4a.
const TOOL_DESCRIPTION = `
**Raw, event-level records** — individual events, each with a timestamp. Modes are set by "eventType": access-control, brivo-access-control, environmental-gateway, climate-sensor, component-events, camera, button-press, occupancy, proximity, doorbell.

Use it when the user asks for specific events: unlocks, badge ins, credentials, arrivals, Brivo access control, door state changes, panic or doorbell button presses, environmental gateway readings, climate data (temperature, humidity, air quality, vape), occupancy counts, proximity tags, or a camera's timeline activity. For maximum flexibility across event types at a location, use eventType "component-events".

**Not this tool:** use **report-tool** for aggregated counts, time-series summaries, or analytics over intervals — including any range spanning more than ~24 hours. Use **lpr-tool** for org LPR workflows: saved vehicles, vehicle labels, fuzzy plate search, and vehicle event APIs. eventType "camera" returns that camera's own **footage seekpoints** — **every activity type** on its recording timeline (human motion, vehicle motion, and others depending on camera and analytics), sometimes carrying plate or vehicle metadata — which is not a replacement for lpr-tool's plate search.

Result sets can be large: keep time ranges narrow. Per-mode required arguments, field semantics, and the full component-event-type list are documented on the input parameters.
`;

type MinimalCamera = {
  uuid: string;
  name?: string;
  locationUuid?: string;
  connectionStatus?: string;
};

/** Connected cameras first (they are the ones with footage), then by name. */
function connectedFirst(a: MinimalCamera, b: MinimalCamera): number {
  const ac = a.connectionStatus === "GREEN" ? 0 : 1;
  const bc = b.connectionStatus === "GREEN" ? 0 : 1;
  if (ac !== bc) return ac - bc;
  return (a.name ?? "").localeCompare(b.name ?? "");
}

/** Reject after `ms` — the underlying request is left to finish on its own. */
function withTimeout<T>(promise: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${what} timed out after ${Math.round(ms / 1000)} s`)),
      ms
    );
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Query each camera's seekpoints for the window through a pool of
 * CAMERA_SCAN_CONCURRENCY workers and roll them up. A camera whose query fails
 * or exceeds CAMERA_SCAN_PER_CAMERA_TIMEOUT_MS gets an `error` entry (unknown ≠
 * zero) — so a few very dense cameras cannot starve the rest. Workers stop
 * taking cameras once CAMERA_SCAN_TIME_BUDGET_MS is spent; `skipped` counts the
 * cameras never reached.
 */
async function scanCameraActivity(
  cameras: ReadonlyArray<MinimalCamera>,
  window: CameraWindow,
  timeZone: string | undefined,
  modifiers: RequestModifiers | undefined,
  sessionId: string | undefined
): Promise<{ summaries: CameraActivitySummary[]; skipped: number }> {
  const summaries: CameraActivitySummary[] = [];
  const queue = [...cameras];
  const deadline = Date.now() + CAMERA_SCAN_TIME_BUDGET_MS;
  const failed = (camera: MinimalCamera, message: string): CameraActivitySummary => ({
    cameraUuid: camera.uuid,
    ...(camera.name ? { cameraName: camera.name } : {}),
    ...(camera.locationUuid ? { locationUuid: camera.locationUuid } : {}),
    eventCount: 0,
    activityCounts: {},
    error: message,
  });
  const worker = async () => {
    while (queue.length > 0 && Date.now() < deadline) {
      const camera = queue.shift();
      if (!camera) break;
      try {
        const result = await withTimeout(
          getCameraFootageSeekpointEvents(
            camera.uuid,
            window.durationSec,
            window.startMs,
            modifiers,
            sessionId
          ),
          Math.min(CAMERA_SCAN_PER_CAMERA_TIMEOUT_MS, Math.max(1, deadline - Date.now())),
          `seekpoints for camera ${camera.uuid}`
        );
        summaries.push(summarizeCameraFootageEvents(camera, result.cameraFootageEvents, timeZone));
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        logger.warn(`camera scan: ${camera.uuid} failed: ${message}`);
        summaries.push(failed(camera, message));
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(CAMERA_SCAN_CONCURRENCY, cameras.length) }, worker)
  );
  const skipped = queue.length;
  if (skipped > 0) {
    logger.warn(
      `camera scan: time budget spent after ${summaries.length} of ${cameras.length} cameras; ${skipped} not queried`
    );
  }
  return { summaries, skipped };
}

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const {
    eventType,
    accessControlledDoorUuids,
    deviceUuid,
    sensorUuid,
    locationUuid,
    componentEventTypes,
    startTime,
    endTime,
    limit,
    timeZone,
    tempUnit,
    cameraUuid,
    duration,
    buttonSensorUuid,
    occupancySensorUuid,
    proximityTagUuids,
    doorbellCameraUuid,
  } = args;

  logger.debug(`eventType: ${eventType}`);

  switch (eventType) {
    case EventsToolRequestType.BRIVO_ACCESS_CONTROL: {
      const result = await getBrivoAccessControlEvents(
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        eventType: "brivo-access-control",
        brivoAccessControlEvents: result,
      });
    }
    case "access-control": {
      if (!accessControlledDoorUuids || accessControlledDoorUuids.length === 0) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which door are you asking about?",
        });
      } else {
        const events = await getAccessControlEvents(
          accessControlledDoorUuids,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        return createToolStructuredContent({ eventType: "access-control", accessControlEvents: events });
      }
    }
    case "environmental-gateway": {
      if (!deviceUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which environmental gateway device are you asking about?",
        });
      } else {
        const events = await getEventsForEnvironmentalGateway(
          deviceUuid,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          tempUnit ?? TempUnit.CELSIUS,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          { eventType: "environmental-gateway", environmentalGatewayEvents: events } as OUTPUT_SCHEMA
        );
      }
    }
    case "climate-sensor": {
      if (!sensorUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which climate sensor are you asking about?",
        });
      } else {
        const events = await getClimateEventsForSensor(
          sensorUuid,
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          limit ?? null,
          timeZone,
          tempUnit ?? TempUnit.CELSIUS,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        return createToolStructuredContent({ eventType: "climate-sensor", climateSensorEvents: events });
      }
    }
    case "component-events": {
      if (!locationUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which location are you asking about?",
        });
      } else {
        const events = await getComponentEventsByLocation(
          locationUuid,
          componentEventTypes || [],
          startTime ? new Date(startTime).getTime() : undefined,
          endTime ? new Date(endTime).getTime() : undefined,
          timeZone,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        // An empty result from a doorless location reads identically to "nothing
        // happened" — say which it is rather than letting the model guess.
        const note =
          events.length === 0
            ? await describeEmptyComponentEventResult(
                locationUuid,
                componentEventTypes || [],
                extra._meta?.requestModifiers as RequestModifiers,
                extra.sessionId
              )
            : undefined;
        return createToolStructuredContent({
          eventType: "component-events",
          componentEvents: events,
          ...(note ? { note } : {}),
        });
      }
    }
    case EventsToolRequestType.CAMERA: {
      const window = resolveCameraWindow({ startTime, endTime, duration });
      const modifiers = extra._meta?.requestModifiers as RequestModifiers;
      const windowOut = {
        startTime: formatTimestamp(window.startMs, timeZone),
        endTime: formatTimestamp(window.startMs + window.durationSec * 1000, timeZone),
      };
      if (cameraUuid) {
        const events = await getCameraFootageSeekpointEvents(
          cameraUuid,
          window.durationSec,
          window.startMs,
          modifiers,
          extra.sessionId
        );
        // newest first (getCameraFootageSeekpointEvents sorts descending)
        const all = events.cameraFootageEvents;
        const cap = limit ?? CAMERA_EVENTS_DEFAULT_LIMIT;
        const shown = all.slice(0, cap);
        const summary = summarizeCameraFootageEvents({ uuid: cameraUuid }, all, timeZone);
        const notes = [
          window.note,
          all.length > shown.length
            ? `${all.length} seekpoints in the window; only the newest ${shown.length} are listed in cameraEvents (raise limit for more). cameraActivity counts cover all ${all.length}.`
            : undefined,
        ].filter((n): n is string => !!n);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          eventType: "camera",
          cameraEvents: shown,
          cameraActivity: [summary],
          cameraActivityWindow: {
            ...windowOut,
            camerasQueried: 1,
            camerasWithActivity: all.length > 0 ? 1 : 0,
            activityTotals: summary.activityCounts,
          },
          ...(notes.length ? { note: notes.join(" ") } : {}),
        });
      }
      // No camera named: scan the organization (or the location) and return
      // per-camera counts. Was "Which camera are you asking about?", which
      // turned "any activity on any camera?" into a clarification.
      const { cameras } = (await getCameraList(modifiers, extra.sessionId)) as {
        cameras: MinimalCamera[];
      };
      const scoped = locationUuid ? cameras.filter(c => c.locationUuid === locationUuid) : cameras;
      if (scoped.length === 0) {
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          eventType: "camera",
          cameraActivity: [],
          cameraActivityWindow: { ...windowOut, camerasQueried: 0, camerasWithActivity: 0, activityTotals: {} },
          note: locationUuid
            ? `No cameras are assigned to location ${locationUuid}; nothing was scanned.`
            : "This organization has no cameras assigned to a location; nothing was scanned.",
        });
      }
      const ordered = [...scoped].sort(connectedFirst);
      const queried = ordered.slice(0, CAMERA_SCAN_MAX_CAMERAS);
      const scan = await scanCameraActivity(queried, window, timeZone, modifiers, extra.sessionId);
      const withActivity = scan.summaries
        .filter(s => s.eventCount > 0)
        .sort((a, b) => b.eventCount - a.eventCount);
      const failed = scan.summaries.filter(s => s.error);
      const quiet = scan.summaries
        .filter(s => s.eventCount === 0 && !s.error)
        .map(s => s.cameraName ?? s.cameraUuid);
      const notQueried = scoped.length - queried.length + scan.skipped;
      const notes = [
        window.note,
        notQueried > 0
          ? `${notQueried} of ${scoped.length} cameras were not scanned (per-call cap ${CAMERA_SCAN_MAX_CAMERAS} / time budget); their activity is unknown, not zero.`
          : undefined,
        failed.length > 0
          ? `${failed.length} camera queries failed (see error on those entries); their activity is unknown, not zero.`
          : undefined,
        "Per-camera roll-up; pass a cameraUuid for that camera's individual seekpoints.",
      ].filter((n): n is string => !!n);
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        eventType: "camera",
        cameraActivity: [...withActivity, ...failed],
        camerasWithoutActivity: quiet,
        cameraActivityWindow: {
          ...windowOut,
          camerasQueried: scan.summaries.length,
          camerasWithActivity: withActivity.length,
          ...(failed.length ? { camerasWithErrors: failed.length } : {}),
          ...(notQueried > 0 ? { camerasNotQueried: notQueried } : {}),
          activityTotals: totalActivityCounts(withActivity),
        },
        note: notes.join(" "),
      });
    }
    case EventsToolRequestType.BUTTON_PRESS: {
      const bSensorUuid = args.buttonSensorUuid;
      if (!bSensorUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which button sensor are you asking about?",
        });
      }
      const buttonEvents = await getButtonPressEvents(
        bSensorUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return createToolStructuredContent<OUTPUT_SCHEMA>({ eventType: "button-press", buttonPressEvents: buttonEvents });
    }
    case EventsToolRequestType.OCCUPANCY: {
      const occSensorUuid = args.occupancySensorUuid;
      if (!occSensorUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which occupancy sensor are you asking about?",
        });
      }
      const occupancyEvts = await getOccupancyEvents(
        occSensorUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return createToolStructuredContent<OUTPUT_SCHEMA>({ eventType: "occupancy", occupancyEvents: occupancyEvts });
    }
    case EventsToolRequestType.PROXIMITY: {
      const tagUuids = args.proximityTagUuids;
      if (!tagUuids || tagUuids.length === 0) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which proximity tags are you asking about?",
        });
      }
      const proxEvents = await getProximityEvents(
        tagUuids,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return createToolStructuredContent<OUTPUT_SCHEMA>({ eventType: "proximity", proximityEvents: proxEvents });
    }
    case EventsToolRequestType.DOORBELL: {
      const dbCamUuid = args.doorbellCameraUuid;
      if (!dbCamUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which doorbell camera are you asking about?",
        });
      }
      const doorbellEvts = await getDoorbellEvents(
        dbCamUuid,
        startTime ? new Date(startTime).getTime() : undefined,
        endTime ? new Date(endTime).getTime() : undefined,
        timeZone,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      return createToolStructuredContent<OUTPUT_SCHEMA>({ eventType: "doorbell", doorbellEvents: doorbellEvts });
    }
  }

  // This should not happen, but return empty result if eventType is unknown
  const result = {};
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result),
      },
    ],
    structuredContent: result,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Events",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
