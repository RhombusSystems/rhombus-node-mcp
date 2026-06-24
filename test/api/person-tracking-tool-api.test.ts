import { describe, it, expect, vi, beforeEach } from "vitest";

import * as facesApi from "../../src/api/faces-tool-api.js";
import { getPersonTrack } from "../../src/api/person-tracking-tool-api.js";

vi.mock("../../src/api/faces-tool-api.js");

const TZ = "America/Los_Angeles";

describe("getPersonTrack", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tracks by personUuid: chronological order, collapsed path, gaps, hints, lastKnownSighting", async () => {
    vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
      faceEvents: [
        // intentionally out of order; two consecutive on camA should collapse in path
        { deviceUuid: "camB", eventTimestampMs: 6000, eventTimestamp: "t3", faceName: "Eve Adams", locationUuid: "loc1", personUuid: "p1", thumbnailS3Key: "k3", uuid: "e3" },
        { deviceUuid: "camA", eventTimestampMs: 1000, eventTimestamp: "t1", faceName: "Eve Adams", locationUuid: "loc1", personUuid: "p1", thumbnailS3Key: "k1", uuid: "e1" },
        { deviceUuid: "camA", eventTimestampMs: 3000, eventTimestamp: "t2", faceName: "Eve Adams", locationUuid: "loc1", personUuid: "p1", thumbnailS3Key: "k2", uuid: "e2" },
      ],
      lastEvaluatedKey: undefined,
    } as never);

    const res = await getPersonTrack({ personUuid: "p1", clipPaddingSeconds: 10 }, TZ);

    expect(res.count).toBe(3);
    expect(res.sightings.map((s) => s.timestampMs)).toEqual([1000, 3000, 6000]);
    expect(res.path).toEqual(["camA", "camB"]);
    expect(res.sightings[0].gapToNextSeconds).toBe(2); // (3000-1000)/1000
    expect(res.sightings[1].gapToNextSeconds).toBe(3); // (6000-3000)/1000
    expect(res.sightings[2].gapToNextSeconds).toBeUndefined();
    expect(res.sightings[0].clipHint).toEqual({ deviceUuid: "camA", startTimeMs: 1000 - 10000, endTimeMs: 1000 + 10000 });
    expect(res.sightings[0].stillHint).toEqual({ deviceUuid: "camA", timestampMs: 1000 });
    expect(res.lastKnownSighting?.deviceUuid).toBe("camB");
    expect(res.resolvedPerson).toEqual({ name: "Eve Adams", personUuid: "p1" });
  });

  it("flags ambiguity when a name matches more than one registered person and does not track", async () => {
    vi.mocked(facesApi.getRegisteredFaces).mockResolvedValue({
      people: [
        { name: "Eve Adams", uuid: "p1" },
        { name: "Eve Brown", uuid: "p2" },
      ],
    } as never);

    const res = await getPersonTrack({ personQuery: "Eve" }, TZ);

    expect(res.ambiguousPeople?.map((p) => p.personUuid).sort()).toEqual(["p1", "p2"]);
    expect(res.count).toBe(0);
    expect(res.sightings).toEqual([]);
    expect(facesApi.getFaceEvents).not.toHaveBeenCalled();
  });

  it("resolves a unique name match then tracks that person", async () => {
    vi.mocked(facesApi.getRegisteredFaces).mockResolvedValue({
      people: [
        { name: "Eve Adams", uuid: "p1" },
        { name: "Bob Lee", uuid: "p2" },
      ],
    } as never);
    vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
      faceEvents: [{ deviceUuid: "camA", eventTimestampMs: 1000, eventTimestamp: "t1", faceName: "Eve Adams", personUuid: "p1" }],
      lastEvaluatedKey: undefined,
    } as never);

    const res = await getPersonTrack({ personQuery: "eve adams" }, TZ);

    expect(res.resolvedPerson).toEqual({ name: "Eve Adams", personUuid: "p1" });
    expect(res.count).toBe(1);
    expect(vi.mocked(facesApi.getFaceEvents).mock.calls[0][0].searchFilter?.personUuids).toEqual(["p1"]);
  });

  it("tracks by appearance from a faceEventUuid seed, carrying similarity and honoring the time window", async () => {
    vi.mocked(facesApi.searchSimilarFaces).mockResolvedValue([
      { uuid: "s1", deviceUuid: "camA", personUuid: undefined, similarity: 0.92, eventTimestampMs: 1000, eventTimestamp: "t1" },
      { uuid: "s2", deviceUuid: "camB", personUuid: undefined, similarity: 0.81, eventTimestampMs: 5000, eventTimestamp: "t2" },
      { uuid: "s3", deviceUuid: "camC", personUuid: undefined, similarity: 0.77, eventTimestampMs: 9000, eventTimestamp: "t3" },
    ] as never);

    // window excludes the 9000 sighting
    const res = await getPersonTrack({ faceEventUuid: "seed", afterMs: 500, beforeMs: 6000 }, TZ);

    expect(res.count).toBe(2);
    expect(res.sightings.map((s) => s.deviceUuid)).toEqual(["camA", "camB"]);
    expect(res.sightings[0].similarity).toBe(0.92);
    expect(facesApi.searchSimilarFaces).toHaveBeenCalledWith("seed", TZ, undefined, undefined);
  });

  it("returns empty (no error) when a name matches nobody", async () => {
    vi.mocked(facesApi.getRegisteredFaces).mockResolvedValue({ people: [{ name: "Bob Lee", uuid: "p2" }] } as never);
    const res = await getPersonTrack({ personQuery: "Zzz Nobody" }, TZ);
    expect(res.count).toBe(0);
    expect(res.ambiguousPeople).toBeUndefined();
    expect(res.resolvedPerson).toBeUndefined();
  });
});
