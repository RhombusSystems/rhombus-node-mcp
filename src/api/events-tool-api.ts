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
  doorUuid: string,
  startTime: number | undefined,
  endTime: number | undefined,
  requestModifiers?: any,
  sessionId?: string
) {
  const body = {
    accessControlledDoorUuid: doorUuid,
    ...(startTime ? { createdAfterMs: startTime } : {}),
    ...(endTime ? { createdBeforeMs: endTime } : {}),
    typeFilter: ["CredentialReceivedEvent"],
  };

  const response = await postApi<any>({
    route: "/component/findComponentEventsByAccessControlledDoor",
    body,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => ({
    componentEvents: (response.componentEvents || []).map((event: any) => ({
      authenticationResult: event.authenticationResult,
      authorizationResult: event.authorizationResult,
      doorUuid: event.componentCompositeUuid,
      locationUuid: event.locationUuid,
      credentials: event.credentials,
      originator: event.originator,
      credentialUuid: event.credentialUuid,
      credSource: event.credSource,
      datetime: new Date(event.timestampMs).toISOString(),
    })),
  }));
  return response;
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
          timestampString: event.timestampMs ? formatTimestamp(event.timestampMs) : undefined,
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
