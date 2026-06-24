import { describe, it, expect, vi, beforeEach } from "vitest";

import * as onguard from "../../src/api/onguard-tool-api.js";
import * as elements from "../../src/api/elements-tool-api.js";
import * as netbox from "../../src/api/netbox-tool-api.js";
import * as entity from "../../src/api/get-entity-tool-api.js";
import * as reid from "../../src/api/reid-tool-api.js";
import { getPersonTrack } from "../../src/api/person-tracking-tool-api.js";

vi.mock("../../src/api/onguard-tool-api.js");
vi.mock("../../src/api/elements-tool-api.js");
vi.mock("../../src/api/netbox-tool-api.js");
vi.mock("../../src/api/get-entity-tool-api.js");
vi.mock("../../src/api/reid-tool-api.js");

const TZ = "America/Los_Angeles";

beforeEach(() => {
  vi.clearAllMocks();
  // default: no badge events anywhere unless a test overrides
  vi.mocked(onguard.searchOnGuardEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(elements.searchElementsEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(netbox.searchNetboxEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(entity.getCameraList).mockResolvedValue({ cameras: [] } as never);
  vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([] as never);
  vi.mocked(reid.searchReidentificationMatchesByEmbedding).mockResolvedValue([] as never);
});

describe("getPersonTrack (re-id grounded by access control)", () => {
  it("badge tap -> door embedding (closest in time) -> re-id track across cameras", async () => {
    vi.mocked(elements.searchElementsEvents).mockResolvedValue({
      events: [
        {
          deviceUuid: "camDoor",
          timestampMs: 1000,
          datetime: "badge-time",
          cardholderName: "Brandon Salzberg",
          areaEntering: "Warehouse Entry",
        },
      ],
    } as never);
    vi.mocked(entity.getCameraList).mockResolvedValue({
      cameras: [{ uuid: "camDoor", locationUuid: "loc1" }],
    } as never);
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([
      { deviceUuid: "camDoor", timestamp: 5000, embedding: [0.9, 0.9], embeddingId: "far" },
      { deviceUuid: "camDoor", timestamp: 1005, embedding: [0.1, 0.2], embeddingId: "near", stableTrackId: 7 },
    ] as never);
    vi.mocked(reid.searchReidentificationMatchesByEmbedding).mockResolvedValue([
      { deviceUuid: "camHall", timestamp: 3000, distance: 0.1, thumbnailUri: "u2" },
      { deviceUuid: "camDoor", timestamp: 1005, distance: 0.0, thumbnailUri: "u1" },
      { deviceUuid: "camExit", timestamp: 6000, distance: 0.2, thumbnailUri: "u3" },
    ] as never);

    const res = await getPersonTrack(
      { personQuery: "Brandon", afterMs: 0, beforeMs: 10000, clipPaddingSeconds: 10 },
      TZ
    );

    // identity + anchor from the badge tap
    expect(res.resolvedPerson).toEqual({ name: "Brandon Salzberg" });
    expect(res.anchor).toMatchObject({ deviceUuid: "camDoor", integration: "Elements", area: "Warehouse Entry" });

    // seeded the re-id search with the embedding CLOSEST in time to the badge tap (near, not far)
    const seedArg = vi.mocked(reid.searchReidentificationMatchesByEmbedding).mock.calls[0][0];
    expect(seedArg.searchEmbedding).toEqual([0.1, 0.2]);

    // chronological track, collapsed path, last-known
    expect(res.sightings.map((s) => s.timestampMs)).toEqual([1005, 3000, 6000]);
    expect(res.path).toEqual(["camDoor", "camHall", "camExit"]);
    expect(res.lastKnownSighting?.deviceUuid).toBe("camExit");
    expect(res.sightings[0].clipHint).toEqual({ deviceUuid: "camDoor", startTimeMs: 1005 - 10000, endTimeMs: 1005 + 10000 });
    expect(res.sightings[0].distance).toBe(0.0);
    expect(res.count).toBe(3);
  });

  it("checks all three badge integrations and uses the earliest tap as the anchor", async () => {
    vi.mocked(onguard.searchOnGuardEvents).mockResolvedValue({
      events: [{ deviceUuid: "camA", timestampMs: 9000, datetime: "late", cardholderName: "X" }],
    } as never);
    vi.mocked(netbox.searchNetboxEvents).mockResolvedValue({
      events: [{ deviceUuid: "camB", timestampMs: 2000, datetime: "early", cardholderName: "X" }],
    } as never);
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([
      { deviceUuid: "camB", timestamp: 2000, embedding: [0.5], embeddingId: "e" },
    ] as never);

    const res = await getPersonTrack({ personQuery: "X" }, TZ);

    expect(onguard.searchOnGuardEvents).toHaveBeenCalled();
    expect(elements.searchElementsEvents).toHaveBeenCalled();
    expect(netbox.searchNetboxEvents).toHaveBeenCalled();
    expect(res.anchor).toMatchObject({ deviceUuid: "camB", integration: "NetBox" }); // earliest (2000 < 9000)
  });

  it("returns a note (not an error) when the person has no badge taps in the window", async () => {
    const res = await getPersonTrack({ personQuery: "Nobody", afterMs: 0, beforeMs: 100 }, TZ);
    expect(res.count).toBe(0);
    expect(res.sightings).toEqual([]);
    expect(res.note).toMatch(/No access-control/i);
    expect(reid.searchReidentificationMatchesByEmbedding).not.toHaveBeenCalled();
  });

  it("returns the anchor + a note when no re-id embedding exists on the door camera", async () => {
    vi.mocked(onguard.searchOnGuardEvents).mockResolvedValue({
      events: [{ deviceUuid: "camDoor", timestampMs: 1000, datetime: "t", cardholderName: "Brandon Salzberg" }],
    } as never);
    vi.mocked(entity.getCameraList).mockResolvedValue({ cameras: [{ uuid: "camDoor", locationUuid: "loc1" }] } as never);
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([] as never);

    const res = await getPersonTrack({ personQuery: "Brandon" }, TZ);

    expect(res.anchor).toMatchObject({ deviceUuid: "camDoor", integration: "OnGuard" });
    expect(res.count).toBe(0);
    expect(res.note).toMatch(/no person re-identification embedding/i);
    expect(reid.searchReidentificationMatchesByEmbedding).not.toHaveBeenCalled();
  });
});
