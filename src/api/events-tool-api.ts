import z from "zod";
import { FIVE_SECONDS_MS, THREE_HOURS_MS } from "../constants.js";
import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";
import { tempFunc, TempUnit } from "../utils/temp.js";

// Type definitions
export const HumanEvent = z.object({
  timestamp: z.number(),
  id: z.number(),
});
export type HumanEvent = z.infer<typeof HumanEvent>;

type MappedEnvironmentalEvent = {
  timestampString?: string;
  temp?: number | null;
  probeTemp?: number | null;
  humidity?: number | null;
  pm25?: number | null;
  co2?: number | null;
  vapeDetected?: boolean | null;
};

type MappedClimateEvent = {
  timestampString?: string;
  timestampMs?: number | null;
  temp?: number | null;
  probeTempC?: number | null;
  humidity?: number | null;
  pm25?: number | null;
  co2?: number | null;
  tvoc?: number | null;
  iaq?: number | null;
  ethanol?: number | null;
  heatIndexDegF?: number | null;
  heatIndexRangeWarning?: string | null;
  vapeSmokeDetected?: boolean | null;
  vapeSmokePercent?: number | null;
  thcDetected?: boolean | null;
  thcPercent?: number | null;
  tampered?: boolean | null;
  batteryPercentage?: number | null;
  locationUuid?: string | null;
  orgUuid?: string | null;
};

type MappedAccessControlEvent = {
  authenticationResult?: string | null;
  authorizationResult?: string | null;
  doorUuid?: string | null;
  locationUuid?: string | null;
  user?: string | null;
  credSource?: string | null;
  timestampMs?: number | null;
  datetime?: string;
};

const ACCESS_CONTROL_EVENT_BATCH_SIZE = 1000;
const ACCESS_CONTROL_EVENT_TYPE_FILTER =
  ["CredentialReceivedEvent"] as NonNullable<
    schema["Component_FindComponentEventsByAccessControlledDoorWSRequest"]["typeFilter"]
  >;

function mapAccessControlEvent(
  credEvent: schema["CredentialReceivedEventType"],
  timeZone: string
): MappedAccessControlEvent {
  return {
    authenticationResult: credEvent?.authenticationResult,
    authorizationResult: credEvent?.authorizationResult,
    doorUuid: credEvent?.componentCompositeUuid,
    locationUuid: credEvent?.locationUuid,
    user: (credEvent?.originator as { username?: string } | undefined)?.username,
    credSource: credEvent?.credSource,
    timestampMs: credEvent?.timestampMs,
    datetime: credEvent?.timestampMs ? formatTimestamp(credEvent.timestampMs, timeZone) : undefined,
  };
}

async function getAccessControlEventsForDoor(
  doorUuid: string,
  startTime: number | undefined,
  endTime: number | undefined,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<MappedAccessControlEvent[]> {
  const allEvents: MappedAccessControlEvent[] = [];
  let createdBeforeMs = endTime;

  while (true) {
    const body: schema["Component_FindComponentEventsByAccessControlledDoorWSRequest"] = {
      accessControlledDoorUuid: doorUuid,
      ...(startTime !== undefined ? { createdAfterMs: startTime } : {}),
      ...(createdBeforeMs !== undefined ? { createdBeforeMs } : {}),
      limit: ACCESS_CONTROL_EVENT_BATCH_SIZE,
      typeFilter: ACCESS_CONTROL_EVENT_TYPE_FILTER,
    };

    const response = await postApi<schema["Component_FindComponentEventsByAccessControlledDoorWSResponse"]>(
      {
        route: "/component/findComponentEventsByAccessControlledDoor",
        body,
        modifiers: requestModifiers,
        sessionId,
      }
    );

    const componentEvents = response.componentEvents || [];
    if (componentEvents.length === 0) {
      break;
    }

    const mappedEvents = componentEvents
      .map((credEvent: schema["CredentialReceivedEventType"]) =>
        mapAccessControlEvent(credEvent, timeZone)
      )
      .filter(Boolean);
    allEvents.push(...mappedEvents);

    if (componentEvents.length < ACCESS_CONTROL_EVENT_BATCH_SIZE) {
      break;
    }

    const oldestTimestamp = componentEvents.reduce<number | null>((oldest, event) => {
      const ts = event?.timestampMs;
      if (typeof ts !== "number") {
        return oldest;
      }
      if (oldest === null || ts < oldest) {
        return ts;
      }
      return oldest;
    }, null);

    if (oldestTimestamp === null) {
      break;
    }

    // createdBeforeMs is exclusive. Moving the window to the oldest seen timestamp
    // prevents duplicate pages and keeps fetching older events until the range is exhausted.
    if (createdBeforeMs !== undefined && oldestTimestamp >= createdBeforeMs) {
      break;
    }
    if (startTime !== undefined && oldestTimestamp <= startTime) {
      break;
    }
    createdBeforeMs = oldestTimestamp;
  }

  return allEvents;
}

export async function getFaceEvents(
  _locationUuid: string | null | undefined,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const nowMs = Date.now();
  const rangeStartMs = nowMs - THREE_HOURS_MS;
  const rangeEndMs = nowMs - FIVE_SECONDS_MS;
  const body = {
    pageRequest: {
      lastEvaluatedKey: undefined,
      maxPageSize: 75,
    },
    searchFilter: {
      deviceUuids: [],
      faceNames: [],
      labels: [],
      locationUuids: [],
      personUuids: [],
      timestampFilter: {
        rangeStart: rangeStartMs,
        rangeEnd: rangeEndMs,
      },
    },
  };
  const response = await postApi<schema["Facerecognition_faceevent_FindFaceEventsByOrgWSResponse"]>(
    {
      route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
      body,
      modifiers: requestModifiers,
      sessionId,
    }
  ).then(response => {
    return {
      faceEvents: (response.faceEvents || []).map(event => ({
        ...event,
        eventTimestamp: event.eventTimestamp
          ? formatTimestamp(event.eventTimestamp, timeZone)
          : undefined,
      })),
    };
  });
  return response;
}

export async function getAccessControlEvents(
  doorUuids: string[],
  startTime: number | undefined,
  endTime: number | undefined,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const responses = await Promise.all(
    doorUuids.map(doorUuid =>
      getAccessControlEventsForDoor(
        doorUuid,
        startTime,
        endTime,
        timeZone,
        requestModifiers,
        sessionId
      )
    )
  );

  // Flatten all componentEvents into a single array
  const accessControlEvents = responses.flatMap(events => events);
  accessControlEvents.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
  console.error(`componentEvents: ${JSON.stringify(accessControlEvents)}`);
  return accessControlEvents;
}

export async function getHumanMotionEvents(
  cameraUuid: string,
  duration: number,
  startTime: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    cameraUuid,
    duration,
    startTime: Math.round(startTime / 1000),
  };
  const response = await postApi<schema["Camera_GetFootageSeekpointsV2WSResponse"]>({
    route: "/camera/getFootageSeekpointsV2",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    const seekPoints = response.footageSeekPoints || [];

    const uniqueHumanEvents = seekPoints
      .reduceRight((acc: HumanEvent[], point) => {
        if (
          point.a === "MOTION_HUMAN" &&
          typeof point.ts === "number" &&
          typeof point.id === "number" &&
          !acc.some(existing => existing.id === point.id)
        ) {
          acc.unshift({ timestamp: point.ts, id: point.id });
        }
        return acc;
      }, [])
      .map(event => ({
        timestamp: event.timestamp,
        id: event.id,
      }));

    return { cameraUuid, uniqueHumanEvents };
  });

  return response;
}

const EVENT_COUNT_MAX_PER_RESPONSE = 2000;

export async function getEventsForEnvironmentalGateway(
  deviceUuid: string,
  startTime: number | undefined,
  endTime: number | undefined,
  timeZone: string,
  tempUnit: TempUnit | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  let allEvents: MappedEnvironmentalEvent[] = [];
  let hasMore = true;
  let lastEvaluatedKey: string | undefined = undefined;

  while (hasMore) {
    const body: schema["Climate_GetEventsForEnvironmentalGatewayWSRequest"] = {
      deviceUuid,
      ...(startTime ? { createdAfterMs: startTime } : {}),
      ...(endTime ? { createdBeforeMs: endTime } : {}),
      maxPageSize: EVENT_COUNT_MAX_PER_RESPONSE,
      ...(lastEvaluatedKey ? { lastEvaluatedKey } : {}),
    };

    const response = await postApi<schema["Climate_GetEventsForEnvironmentalGatewayWSResponse"]>({
      route: "/climate/getEventsForEnvironmentalGateway",
      body,
      modifiers: requestModifiers,
      sessionId,
    }).then(response => {
      const tempFunc =
        tempUnit === TempUnit.FAHRENHEIT
          ? (temp: number) => (temp * 9) / 5 + 32
          : (temp: number) => temp;

      return {
        events: (response.events || []).map(event => ({
          timestampString: event.timestampMs
            ? formatTimestamp(event.timestampMs, timeZone)
            : undefined,
          temp: tempFunc(event.co2Sense?.tempC ?? 0),
          probeTemp: tempFunc(event.tempProbe?.tempC ?? 0),
          humidity: event.co2Sense?.relHumid,
          pm25: event.pmSense?.pm2p5,
          co2: event.co2Sense?.co2Ppm,
          vapeDetected: event.derivedValues?.vapeDetected,
        })),
        lastEvaluatedKey: response.lastEvaluatedKey,
      };
    });

    // Accumulate the events
    if (response.events) {
      allEvents.push(...response.events);
    }

    // Check if we should continue pagination
    if (
      response.events &&
      response.events.length === EVENT_COUNT_MAX_PER_RESPONSE &&
      response.lastEvaluatedKey &&
      response.lastEvaluatedKey !== null
    ) {
      // Update the lastEvaluatedKey for the next iteration
      lastEvaluatedKey = response.lastEvaluatedKey;
    } else {
      hasMore = false;
    }
  }

  return {
    events: allEvents,
    lastEvaluatedKey: undefined, // Don't return lastEvaluatedKey since we've fetched all pages
  };
}

export async function getClimateEventsForSensor(
  sensorUuid: string,
  startTime: number | undefined,
  endTime: number | undefined,
  limit: number | null | undefined,
  timeZone: string,
  tempUnit: TempUnit | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  let allClimateEvents: MappedClimateEvent[] = [];
  let hasMore = true;
  let remainingLimit = limit || 1000; // Default to 1000 if no limit specified

  while (hasMore && allClimateEvents.length < remainingLimit) {
    const currentBatchSize = Math.min(100, remainingLimit - allClimateEvents.length); // Max 100 per request

    const body: schema["Climate_GetClimateEventsForSensorWSRequest"] = {
      sensorUuid,
      ...(startTime ? { createdAfterMs: startTime } : {}),
      ...(endTime ? { createdBeforeMs: endTime } : {}),
      limit: currentBatchSize,
    };

    const response = await postApi<schema["Climate_GetClimateEventsForSensorWSResponse"]>({
      route: "/climate/getClimateEventsForSensor",
      body,
      modifiers: requestModifiers,
      sessionId,
    });

    if (response?.climateEvents) {
      // Map the climate events to include formatted timestamp and relevant fields
      const mappedEvents = response.climateEvents.map(event => ({
        timestampString: event.timestampMs
          ? formatTimestamp(event.timestampMs, timeZone)
          : undefined,
        timestampMs: event.timestampMs,
        temp: event.temp,
        probeTemp: tempFunc(event.probeTempC ?? 0, tempUnit),
        // probeTempC: event.probeTempC,
        // probeTempF: event.probeTempC ? (event.probeTempC * 9) / 5 + 32 : undefined,
        humidity: event.humidity,
        pm25: event.pm25,
        co2: event.co2,
        tvoc: event.tvoc,
        iaq: event.iaq,
        ethanol: event.ethanol,
        heatIndexDegF: event.heatIndexDegF,
        heatIndexRangeWarning: event.heatIndexRangeWarning,
        vapeSmokeDetected: event.vapeSmokeDetected,
        vapeSmokePercent: event.vapeSmokePercent,
        thcDetected: event.thcDetected,
        thcPercent: event.thcPercent,
        tampered: event.tampered,
        batteryPercentage: event.batteryPercentage,
        locationUuid: event.locationUuid,
        orgUuid: event.orgUuid,
      }));

      allClimateEvents.push(...mappedEvents);

      // Check if we got a full batch and haven't reached the limit
      if (
        response.climateEvents.length === currentBatchSize &&
        allClimateEvents.length < remainingLimit
      ) {
        // Prepare for the next batch by updating the endTime to the oldest event's timestamp
        if (mappedEvents.length > 0) {
          const oldestEventTimestamp = mappedEvents[mappedEvents.length - 1].timestampMs;
          if (oldestEventTimestamp) {
            endTime = oldestEventTimestamp - 1; // Subtract 1ms to avoid duplicates
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  // Trim to the requested limit if we got more than needed
  if (limit && allClimateEvents.length > limit) {
    allClimateEvents = allClimateEvents.slice(0, limit);
  }

  return allClimateEvents;
}

export async function getComponentEventsByLocation(
  locationUuid: string,
  eventTypes: string[], // Still accept string[] for flexibility
  startTime: number | undefined,
  endTime: number | undefined,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const MAX_LIMIT = 1000; // API limit for component events
  const body: schema["Component_FindComponentEventsByLocationWSRequest"] = {
    locationUuid,
    typeFilter: eventTypes.length > 0 ? (eventTypes as any) : undefined, // API accepts string array
    ...(startTime ? { createdAfterMs: startTime } : {}),
    ...(endTime ? { createdBeforeMs: endTime } : {}),
    limit: MAX_LIMIT,
  };

  const response = await postApi<schema["Component_FindComponentEventsByLocationWSResponse"]>({
    route: "/component/findComponentEventsByLocation",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  const events = (response.componentEvents || []).map(event => {
    // Map different event types to a common structure
    const baseEvent = {
      eventType: event.type,
      componentUuid: event.componentUuid,
      locationUuid: event.locationUuid,
      orgUuid: event.orgUuid,
      correlationId: event.correlationId,
      ownerDeviceUuid: event.ownerDeviceUuid,
      datetime: event.timestampMs ? formatTimestamp(event.timestampMs, timeZone) : undefined,
      timestampMs: event.timestampMs,
      uuid: event.uuid,
    };

    // Add event-specific fields based on type
    if (event.type === "CredentialReceivedEvent") {
      const credEvent = event as any;
      return {
        ...baseEvent,
        authenticationResult: credEvent?.authenticationResult,
        authorizationResult: credEvent?.authorizationResult,
        user: credEvent?.originator?.username,
        credSource: credEvent?.credSource,
        doorUuid: credEvent?.componentCompositeUuid,
      };
    } else if (event.type === "DoorbellEvent") {
      return {
        ...baseEvent,
        doorbellCameraUuid: event.componentUuid,
      };
    } else if (event.type === "DoorStateChangeEvent") {
      const doorEvent = event as any;
      return {
        ...baseEvent,
        previousState: doorEvent?.previousState,
        newState: doorEvent?.newState,
        reason: doorEvent?.reason,
      };
    } else if (event.type === "ButtonEvent" || event.type === "PanicButtonEvent") {
      const buttonEvent = event as any;
      return {
        ...baseEvent,
        buttonState: buttonEvent?.buttonState,
      };
    }

    // For other event types, return the base event
    return baseEvent;
  });

  // Sort events by timestamp (newest first)
  events.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));

  console.error(`componentEvents: ${JSON.stringify(events)}`);
  return events;
}
