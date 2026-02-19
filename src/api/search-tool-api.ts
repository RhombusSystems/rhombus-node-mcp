import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function searchLicensePlates(
  query: string,
  startTimeMs?: number,
  endTimeMs?: number,
  deviceUuids?: string[] | null,
  locationUuids?: string[] | null,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    licensePlate: query,
    startTime: startTimeMs,
    endTime: endTimeMs,
    deviceUuids: deviceUuids ?? undefined,
    locationUuids: locationUuids ?? undefined,
  } as any;

  const res = await postApi<schema["Search_SearchLicensePlatesWSResponse"]>({
    route: "/search/searchLicensePlates",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.vehicleEvents?.map((event: any) => ({
      licensePlate: event.vehicleLicensePlate ?? undefined,
      deviceUuid: event.deviceUuid ?? undefined,
      timestampMs: event.eventTimestamp ?? undefined,
      confidence: event.confidence ?? undefined,
    })) ?? []
  );
}

export async function searchObjectsByColor(
  color: string,
  cameraUuid: string,
  startTimeMs?: number,
  endTimeMs?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    colorFilter: [color],
    deviceFilter: [cameraUuid],
    startTimeMs: startTimeMs,
    endTimeMs: endTimeMs,
  } as any;

  const res = await postApi<schema["Search_SearchObjectsByColorWSResponse"]>({
    route: "/search/searchObjectsByColor",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    (res as any).objects?.map((result: any) => ({
      deviceUuid: result.deviceUuid ?? undefined,
      timestampMs: result.timestampMs ?? undefined,
      objectType: result.objectType ?? undefined,
      color: result.color ?? undefined,
    })) ?? []
  );
}

export async function searchObjectsByText(
  textQuery: string,
  startTimeMs?: number,
  endTimeMs?: number,
  deviceUuids?: string[] | null,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    text: textQuery,
    model: "CLIP",
    startTimestampMs: startTimeMs,
    endTimestampMs: endTimeMs,
    deviceUuids: deviceUuids ?? undefined,
  } as any;

  const res = await postApi<any>({
    route: "/search/searchSimilarObjectEmbeddingsByText",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    res.results?.map((result: any) => ({
      deviceUuid: result.deviceUuid ?? undefined,
      timestampMs: result.timestampMs ?? undefined,
      score: result.score ?? undefined,
    })) ?? []
  );
}

export async function searchMotionGrid(
  cameraUuid: string,
  startTimeMs: number,
  endTimeMs: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body = {
    deviceUuid: cameraUuid,
    startTimeUtcSecs: Math.floor(startTimeMs / 1000),
    endTimeUtcSecs: Math.floor(endTimeMs / 1000),
    searchCells: [],
  } as any;

  const res = await postApi<schema["Event_SearchMotionGridWSResponse"]>({
    route: "/event/searchMotionGrid",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }

  return (
    (res as any).timeUtcSecsList?.map((ts: number) => ({
      timestampSecs: ts,
    })) ?? []
  );
}
