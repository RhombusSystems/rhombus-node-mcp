import { FIVE_SECONDS_MS, THREE_HOURS_MS } from "../constants.js";
import { getLogger } from "../logger.js";
import { postApi } from "../network.js";
import { formatTimestamp } from "../util.js";
import schema from "../types/schema.js";

export async function getFaceEvents(
  _locationUuid: string | null | undefined,
  requestModifiers?: any,
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
  const response = await postApi<any>({
    route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    return {
      faceEvents: (response.faceEvents || []).map((event: any) => ({
        ...event,
        eventTimestamp: new Date(event.eventTimestamp).toString(),
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
  requestModifiers?: any,
  sessionId?: string
) {
  const bodies = doorUuids.map(doorUuid => ({
    accessControlledDoorUuid: doorUuid,
    ...(startTime ? { createdAfterMs: startTime } : {}),
    ...(endTime ? { createdBeforeMs: endTime } : {}),
    typeFilter: ["CredentialReceivedEvent"],
  }));

  const responses = await Promise.all(
    bodies.map(body =>
      postApi<schema["Component_FindComponentEventsByAccessControlledDoorWSResponse"]>({
        route: "/component/findComponentEventsByAccessControlledDoor",
        body,
        modifiers: requestModifiers,
        sessionId,
      }).then(response => {
        return (response.componentEvents || [])
          .map((credEvent: schema["CredentialReceivedEventType"]) => {
            return {
              authenticationResult: credEvent?.authenticationResult,
              authorizationResult: credEvent?.authorizationResult,
              doorUuid: credEvent?.componentCompositeUuid,
              locationUuid: credEvent?.locationUuid,
              user: (credEvent?.originator as any)?.username,
              credSource: credEvent?.credSource,
              datetime: credEvent?.timestampMs
                ? formatTimestamp(credEvent.timestampMs, timeZone)
                : undefined,
            };
          })
          .filter(Boolean);
      })
    )
  );

  // Flatten all componentEvents into a single array
  const accessControlEvents = responses.flatMap(events => events);
  console.error(`componentEvents: ${JSON.stringify(accessControlEvents)}`);
  return accessControlEvents;
}

export async function getHumanMotionEvents(
  cameraUuid: string,
  duration: number,
  startTime: number,
  requestModifiers?: any,
  sessionId?: string
) {
  const body = {
    cameraUuid,
    duration,
    startTime,
  };
  const response = await postApi<any>({
    route: "/camera/getFootageSeekpointsV2",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    const seekPoints = response.footageSeekPoints || [];

    const uniqueHumanEvents = seekPoints.reduceRight((acc: any[], point: any) => {
      if (point.a === "MOTION_HUMAN" && !acc.some((existing: any) => existing.id === point.id)) {
        acc.unshift({ timestamp: point.ts, id: point.id });
      }
      return acc;
    }, []);

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
  requestModifiers?: any,
  sessionId?: string
) {
  let allEvents: any[] = [];
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
      return {
        events: (response.events || []).map(event => ({
          timestampString: event.timestampMs
            ? formatTimestamp(event.timestampMs, timeZone)
            : undefined,
          temp: event.co2Sense?.tempC,
          probeTemp: event.tempProbe?.tempC,
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
  requestModifiers?: any,
  sessionId?: string
) {
  let allClimateEvents: any[] = [];
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

    if (response && response.climateEvents) {
      // Map the climate events to include formatted timestamp and relevant fields
      const mappedEvents = response.climateEvents.map(event => ({
        timestampString: event.timestampMs
          ? formatTimestamp(event.timestampMs, timeZone)
          : undefined,
        timestampMs: event.timestampMs,
        temp: event.temp,
        probeTempC: event.probeTempC,
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
