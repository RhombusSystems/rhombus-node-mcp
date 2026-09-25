import { describe, it, expect, vi, beforeEach } from "vitest";

import * as onguard from "../../src/api/onguard-tool-api.js";
import * as elements from "../../src/api/elements-tool-api.js";
import * as netbox from "../../src/api/netbox-tool-api.js";
import * as entity from "../../src/api/get-entity-tool-api.js";
import * as reid from "../../src/api/reid-tool-api.js";
import * as rhombus from "../../src/api/rhombus-badge-events-api.js";
import { getPersonTrack } from "../../src/api/person-tracking-tool-api.js";

vi.mock("../../src/api/onguard-tool-api.js");
vi.mock("../../src/api/elements-tool-api.js");
vi.mock("../../src/api/netbox-tool-api.js");
vi.mock("../../src/api/get-entity-tool-api.js");
vi.mock("../../src/api/reid-tool-api.js");
vi.mock("../../src/api/rhombus-badge-events-api.js");

const TZ = "America/Los_Angeles";

beforeEach(() => {
  vi.clearAllMocks();
  // default: no badge events anywhere unless a test overrides
  vi.mocked(onguard.searchOnGuardEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(elements.searchElementsEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(netbox.searchNetboxEvents).mockResolvedValue({ events: [] } as never);
  vi.mocked(rhombus.searchRhombusBadgeEvents).mockResolvedValue({ events: [], matchedUsers: [] });
  vi.mocked(entity.getCameraList).mockResolvedValue({ cameras: [] } as never);
  vi.mocked(entity.getDoorbellCameras).mockResolvedValue({ doorbellCameras: [] } as never);
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
      cameras: [
        { uuid: "camDoor", locationUuid: "loc1", name: "Warehouse Door" },
        { uuid: "camHall", locationUuid: "loc1", name: "Hallway" },
        { uuid: "camExit", locationUuid: "loc1", name: "Exit" },
      ],
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

    // the route: badge tap, then each camera visit in order, named; last-known = last visit
    expect(res.route?.stops.map((s) => [s.kind, s.cameraName, s.timestampMs])).toEqual([
      ["badge", "Warehouse Door", 1000],
      ["camera", "Warehouse Door", 1005],
      ["camera", "Hallway", 3000],
      ["camera", "Exit", 6000],
    ]);
    expect(res.route?.stops[0]).toMatchObject({ doorName: "Warehouse Entry", integration: "Elements" });
    expect(res.route?.stops[1].clipHint).toEqual({ deviceUuid: "camDoor", startTimeMs: 1005 - 10000, endTimeMs: 1005 + 10000 });
    expect(res.route?.truncated).toBe(false);
    expect(res.lastKnownLocation?.cameraUuid).toBe("camExit");
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
    expect(res.route).toBeUndefined();
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

  // Regression: "Where did Forrest Battles go after he badged in?" — native Rhombus badge-ins were
  // never searched, so the tool said "no badge-in event in OnGuard, Elements, or NetBox".
  it("anchors on a native Rhombus door badge-in, using the door's associated camera and location", async () => {
    vi.mocked(rhombus.searchRhombusBadgeEvents).mockResolvedValue({
      matchedUsers: ["Forrest Battles"],
      events: [
        {
          timestampMs: 1000, datetime: "denied-time", cardholderName: "Forrest Battles", userUuid: "u1",
          doorUuid: "door1", doorName: "Front Door", locationUuid: "locHQ", cameraUuids: ["camFront"], granted: false,
        },
        {
          timestampMs: 2000, datetime: "badge-time", cardholderName: "Forrest Battles", userUuid: "u1",
          doorUuid: "door1", doorName: "Front Door", locationUuid: "locHQ", cameraUuids: ["camFront", "camLobby"], granted: true,
        },
      ],
    });
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([
      { deviceUuid: "camLobby", timestamp: 2003, embedding: [0.3], embeddingId: "e" },
    ] as never);
    vi.mocked(reid.searchReidentificationMatchesByEmbedding).mockResolvedValue([
      { deviceUuid: "camLobby", timestamp: 2003, distance: 0 },
      { deviceUuid: "camOffice", timestamp: 4000, distance: 0.1 },
    ] as never);

    const res = await getPersonTrack({ personQuery: "Forrest Battles", afterMs: 0, beforeMs: 10000 }, TZ);

    expect(rhombus.searchRhombusBadgeEvents).toHaveBeenCalledWith(
      expect.objectContaining({ personQuery: "Forrest Battles", afterMs: 0, beforeMs: 10000 }),
      TZ, undefined, undefined
    );
    // the granted tap anchors, not the earlier denied one
    expect(res.anchor).toMatchObject({ integration: "Rhombus", deviceUuid: "camFront", area: "Front Door", doorUuid: "door1", timestampMs: 2000 });
    expect(res.resolvedPerson).toEqual({ name: "Forrest Battles" });
    // every camera on the door is searched for the seed; the door's location is used directly
    expect(vi.mocked(reid.listReidentificationEmbeddings).mock.calls[0][0]).toMatchObject({
      deviceUuids: ["camFront", "camLobby"], locationUuid: "locHQ",
    });
    expect(res.route?.stops.map((s) => s.cameraUuid)).toEqual(["camFront", "camLobby", "camOffice"]);
    expect(res.badgeEvents).toHaveLength(2);
    expect(res.sourcesChecked).toEqual(["Rhombus", "OnGuard", "Elements", "NetBox"]);
  });

  it("reports native badge events (not 'no badge events') when the door has no associated camera", async () => {
    vi.mocked(rhombus.searchRhombusBadgeEvents).mockResolvedValue({
      matchedUsers: ["Forrest Battles"],
      events: [
        {
          timestampMs: 2000, datetime: "badge-time", cardholderName: "Forrest Battles", userUuid: "u1",
          doorUuid: "door1", doorName: "Side Door", cameraUuids: [], granted: true,
        },
      ],
    });

    const res = await getPersonTrack({ personQuery: "Forrest Battles" }, TZ);

    expect(res.count).toBe(0);
    expect(res.note).toMatch(/Found 1 badge event/);
    expect(res.note).toMatch(/do NOT say the person has no badge events/);
    expect(res.badgeEvents?.[0]).toMatchObject({ integration: "Rhombus", area: "Side Door", granted: true });
    expect(reid.listReidentificationEmbeddings).not.toHaveBeenCalled();
  });

  it("names a failed badge source as unknown instead of reporting zero taps", async () => {
    vi.mocked(rhombus.searchRhombusBadgeEvents).mockRejectedValue(new Error("HTTP 500"));

    const res = await getPersonTrack({ personQuery: "Forrest Battles" }, TZ);

    expect(res.sourcesChecked).toEqual(["OnGuard", "Elements", "NetBox"]);
    expect(res.sourceErrors).toEqual([{ source: "Rhombus", error: "HTTP 500" }]);
    expect(res.note).toMatch(/could NOT be checked \(unknown, not zero\): Rhombus \(HTTP 500\)/);
  });

  // Regression: prod 1.1.83 found Forrest's native badge-in, then every call failed with
  // "searchReidentificationMatchesByEmbedding failed" — the video-search service requires a
  // locationUuid and the tool only forwarded args.locationUuids (null from the model).
  it("scopes the re-id search to the badge door's location when no locationUuids were given", async () => {
    vi.mocked(rhombus.searchRhombusBadgeEvents).mockResolvedValue({
      matchedUsers: ["Forrest Battles"],
      events: [
        {
          timestampMs: 2000, datetime: "t", cardholderName: "Forrest Battles", userUuid: "u1",
          doorUuid: "door1", doorName: "Lobby Entry", locationUuid: "locHQ", cameraUuids: ["camLobby"], granted: true,
        },
      ],
    });
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([
      { deviceUuid: "camLobby", timestamp: 2001, embedding: [0.3], embeddingId: "e" },
    ] as never);

    await getPersonTrack({ personQuery: "Forrest Battles", afterMs: 0, beforeMs: 10000, locationUuids: undefined }, TZ);

    expect(vi.mocked(reid.searchReidentificationMatchesByEmbedding).mock.calls[0][0].locationUuid).toBe("locHQ");
  });

  it("keeps the anchor and badge events when the re-id search fails", async () => {
    vi.mocked(rhombus.searchRhombusBadgeEvents).mockResolvedValue({
      matchedUsers: ["Forrest Battles"],
      events: [
        {
          timestampMs: 2000, datetime: "10:21 AM", cardholderName: "Forrest Battles", userUuid: "u1",
          doorUuid: "door1", doorName: "Lobby Entry", locationUuid: "locHQ", cameraUuids: ["camLobby"], granted: true,
        },
      ],
    });
    vi.mocked(reid.listReidentificationEmbeddings).mockResolvedValue([
      { deviceUuid: "camLobby", timestamp: 2001, embedding: [0.3], embeddingId: "e" },
    ] as never);
    vi.mocked(reid.searchReidentificationMatchesByEmbedding).mockRejectedValue(
      new Error("searchReidentificationMatchesByEmbedding failed: HTTP 400")
    );

    const res = await getPersonTrack({ personQuery: "Forrest Battles" }, TZ);

    expect(res).not.toHaveProperty("error");
    expect(res.anchor).toMatchObject({ integration: "Rhombus", area: "Lobby Entry" });
    expect(res.badgeEvents).toHaveLength(1);
    expect(res.note).toMatch(/re-id search across cameras failed \(searchReidentificationMatchesByEmbedding failed: HTTP 400\)/);
    expect(res.note).toMatch(/do NOT say the person has no badge events/);
  });
});
