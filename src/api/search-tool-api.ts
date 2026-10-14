import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";
import { isOrgFeatureFlagEnabled, PLUMERAI_MODEL_SELECTION_ENABLED } from "./org-feature-flags.js";

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

  throwIfApiError(res);

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

  throwIfApiError(res);

  return (
    (res as any).objects?.map((result: any) => ({
      deviceUuid: result.deviceUuid ?? undefined,
      timestampMs: result.timestampMs ?? undefined,
      objectType: result.objectType ?? undefined,
      color: result.color ?? undefined,
    })) ?? []
  );
}

// The Console's AI Search request, mirrored (common/state/investigations/ai): CHARON
// classifies results as matches and streams per location, so it gets the higher ceiling and
// `onlyMatches`; CLIP returns everything above the similarity threshold, so a flat sea of
// weak hits unless the cap stays low. AUTO lets the server infer humans or vehicles from the text.
const SIMILARITY_THRESHOLD = 0.5;
const MAX_NUM_RESULTS_CLIP = 100;
const MAX_NUM_RESULTS_CHARON = 500;

export async function searchObjectsByText(
  textQuery: string,
  startTimeMs?: number,
  endTimeMs?: number,
  deviceUuids?: string[] | null,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  // Same gate as the Console: orgs on the Plumerai cutover search with CHARON, everyone else with CLIP.
  const charon = await isOrgFeatureFlagEnabled(PLUMERAI_MODEL_SELECTION_ENABLED, requestModifiers, sessionId);
  const body = {
    searchText: textQuery,
    model: charon ? "CHARON" : "CLIP_512",
    objectTypeFilter: ["AUTO"],
    queryStartTimeMs: startTimeMs,
    queryEndTimeMs: endTimeMs,
    queryDeviceUuids: deviceUuids ?? [],
    maxNumResults: charon ? MAX_NUM_RESULTS_CHARON : MAX_NUM_RESULTS_CLIP,
    similarityThreshold: SIMILARITY_THRESHOLD,
    ...(charon && { onlyMatches: true }),
  } as any;

  const res = await postApi<any>({
    route: "/search/searchSimilarObjectEmbeddingsByText",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.similarEmbeddings?.map((match: any) => ({
      deviceUuid: match.embedding?.deviceUuid ?? undefined,
      timestampMs: match.embedding?.timestamp ?? undefined,
      score: match.distance ?? undefined,
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

  throwIfApiError(res);

  return (
    (res as any).timeUtcSecsList?.map((ts: number) => ({
      timestampSecs: ts,
    })) ?? []
  );
}
