import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

/** A person re-identification embedding (one human detection on one camera at one moment). */
export interface ReidEmbedding {
  deviceUuid?: string;
  locationUuid?: string;
  timestamp?: number;
  embedding?: number[];
  embeddingId?: string;
  stableTrackId?: number;
  thumbnailUri?: string;
}

function mapEmbedding(e: schema["GenericObjectEmbedding"]): ReidEmbedding {
  return {
    deviceUuid: e.deviceUuid ?? undefined,
    locationUuid: e.locationUuid ?? undefined,
    timestamp: e.timestamp ?? undefined,
    embedding: (e.embedding ?? []).filter((n): n is number => n != null),
    embeddingId: e.embeddingId ?? undefined,
    stableTrackId: e.stableTrackId ?? undefined,
    thumbnailUri: e.thumbnailUri ?? undefined,
  };
}

/**
 * Lists the person re-identification embeddings recorded on the given camera(s) in a time window —
 * i.e. the people the camera's human-detection AI saw. Used to grab the embedding of the person standing
 * at a door at a known moment (e.g. a badge tap), so it can be tracked across other cameras.
 */
export async function listReidentificationEmbeddings(
  args: {
    deviceUuids?: string[];
    locationUuid?: string;
    startTimestampMs?: number;
    endTimestampMs?: number;
    limit?: number;
  },
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<ReidEmbedding[]> {
  const body: schema["Search_ListReidentificationEmbeddingsWSRequest"] = {
    deviceUuids: args.deviceUuids,
    locationUuid: args.locationUuid,
    startTimestampMs: args.startTimestampMs,
    endTimestampMs: args.endTimestampMs,
    limit: args.limit ?? 100,
  };
  const res = await postApi<schema["Search_ListReidentificationEmbeddingsWSResponse"]>({
    route: "/search/listReidentificationEmbeddings",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(res.errorMsg ?? "listReidentificationEmbeddings failed");
  return (res.embeddings ?? []).map(mapEmbedding);
}

/** One re-id match: an embedding sighting plus its distance to the search embedding (lower = closer). */
export interface ReidMatch extends ReidEmbedding {
  distance?: number;
}

/**
 * Searches person re-identification matches for a given appearance embedding across cameras and time —
 * "find this same person elsewhere". Returns sightings ordered by similarity (distance asc; lower is a
 * closer match).
 */
export async function searchReidentificationMatchesByEmbedding(
  args: {
    searchEmbedding: number[];
    deviceUuids?: string[];
    locationUuid?: string;
    startTimestampMs?: number;
    endTimestampMs?: number;
    limit?: number;
  },
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<ReidMatch[]> {
  const body: schema["Search_SearchReidentificationMatchesByEmbeddingWSRequest"] = {
    searchEmbedding: args.searchEmbedding,
    deviceUuids: args.deviceUuids,
    locationUuid: args.locationUuid,
    startTimestampMs: args.startTimestampMs,
    endTimestampMs: args.endTimestampMs,
    limit: args.limit ?? 100,
  };
  const res = await postApi<schema["Search_SearchReidentificationMatchesByEmbeddingWSResponse"]>({
    route: "/search/searchReidentificationMatchesByEmbedding",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(res.errorMsg ?? "searchReidentificationMatchesByEmbedding failed");
  return (res.matches ?? []).map((m) => ({
    ...mapEmbedding(m.embedding ?? {}),
    distance: m.distance ?? undefined,
  }));
}
