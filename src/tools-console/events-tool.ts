import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessControlEvents,
  getBrivoAccessControlEvents,
  getEventsForEnvironmentalGateway,
  getClimateEventsForSensor,
  getComponentEventsByLocation,
  getCameraFootageSeekpointEvents,
  getButtonPressEvents,
  getOccupancyEvents,
  getProximityEvents,
  getDoorbellEvents,
} from "../api/events-tool-api.js";
import {
  EventsToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/events-tools-types.js";
import { createToolStructuredContent, type RequestModifiers } from "../util.js";
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
        return createToolStructuredContent({ eventType: "component-events", componentEvents: events });
      }
    }
    case EventsToolRequestType.CAMERA: {
      if (!cameraUuid) {
        return createToolStructuredContent({
          needUserInput: true,
          commandForUser: "Which camera are you asking about?",
        });
      } else {
        const events = await getCameraFootageSeekpointEvents(
          cameraUuid,
          duration ?? 3600,
          startTime ? new Date(startTime).getTime() : Date.now() - 3600000,
          extra._meta?.requestModifiers as RequestModifiers,
          extra.sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>(
          { eventType: "camera", cameraEvents: events.cameraFootageEvents }
        );
      }
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
