import { describe, it, expect } from "vitest";

import { buildPersonRoute, MAX_ROUTE_STOPS } from "../../src/api/person-route.js";

const TZ = "America/Los_Angeles";
const badge = { timestampMs: 10_000, cameraUuid: "camDoor.v0", doorUuid: "door1", area: "Lobby Entry", integration: "Rhombus" };
const names = new Map([
  ["camDoor", { name: "Lobby Intercom", deviceType: "doorbell-camera" as const }],
  ["camA", { name: "Hall A", deviceType: "camera" as const }],
  ["camB", { name: "Hall B", deviceType: "camera" as const }],
]);

describe("buildPersonRoute", () => {
  it("starts at the badge tap and merges consecutive sightings on one camera into one visit", () => {
    const route = buildPersonRoute({
      badge,
      cameras: names,
      timeZone: TZ,
      sightings: [
        { deviceUuid: "camA", timestampMs: 20_000, distance: 0.3, thumbnailUri: "a1" },
        { deviceUuid: "camA.v0", timestampMs: 25_000, distance: 0.1, thumbnailUri: "a2" },
        { deviceUuid: "camB", timestampMs: 40_000, distance: 0.2 },
        { deviceUuid: "camA", timestampMs: 60_000, distance: 0.2 },
      ],
    });

    expect(route.stops.map((s) => [s.kind, s.cameraUuid, s.cameraName, s.deviceType])).toEqual([
      ["badge", "camDoor", "Lobby Intercom", "doorbell-camera"],
      ["camera", "camA", "Hall A", "camera"],
      ["camera", "camB", "Hall B", "camera"],
      ["camera", "camA", "Hall A", "camera"],
    ]);
    expect(route.stops[0]).toMatchObject({ doorName: "Lobby Entry", doorUuid: "door1", timestampMs: 10_000 });
    // visit 1 spans both camA sightings; its thumbnail is the closest match
    expect(route.stops[1]).toMatchObject({ timestampMs: 20_000, endTimestampMs: 25_000, sightingCount: 2, thumbnailUri: "a2" });
    expect(route.stops[1].clipHint).toEqual({ deviceUuid: "camA", startTimeMs: 5_000, endTimeMs: 40_000 });
    // a single sighting has no end
    expect(route.stops[2].endTimestampMs).toBeUndefined();
    expect(route).toMatchObject({ totalStops: 4, truncated: false });
  });

  it("drops sightings before the badge tap (outside the lead window)", () => {
    const route = buildPersonRoute({
      badge,
      cameras: names,
      timeZone: TZ,
      badgeLeadMs: 2_000,
      sightings: [
        { deviceUuid: "camB", timestampMs: 1_000 }, // earlier in the day
        { deviceUuid: "camDoor", timestampMs: 9_000 }, // at the door, just before the tap
        { deviceUuid: "camA", timestampMs: 30_000 },
      ],
    });
    expect(route.stops.map((s) => s.cameraUuid)).toEqual(["camDoor", "camDoor", "camA"]);
  });

  it(`caps the route at ${MAX_ROUTE_STOPS} stops, keeping the badge tap, the first and the last visit`, () => {
    const sightings = Array.from({ length: 50 }, (_, i) => ({
      deviceUuid: i % 2 ? "camA" : "camB",
      timestampMs: 20_000 + i * 1_000,
    }));
    const route = buildPersonRoute({ badge, cameras: names, timeZone: TZ, sightings });

    expect(route.stops).toHaveLength(MAX_ROUTE_STOPS);
    expect(route).toMatchObject({ totalStops: 51, truncated: true });
    expect(route.stops[0].kind).toBe("badge");
    expect(route.stops[1].timestampMs).toBe(20_000);
    expect(route.stops[MAX_ROUTE_STOPS - 1].timestampMs).toBe(69_000);
    const times = route.stops.map((s) => s.timestampMs);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });

  it("defaults an unlisted camera to a plain camera with no name", () => {
    const route = buildPersonRoute({
      badge,
      cameras: names,
      timeZone: TZ,
      sightings: [{ deviceUuid: "camUnknown", timestampMs: 20_000 }],
    });
    expect(route.stops[1]).toMatchObject({ cameraUuid: "camUnknown", cameraName: undefined, deviceType: "camera" });
  });

  it("returns just the badge stop when nothing was re-identified after it", () => {
    const route = buildPersonRoute({ badge, cameras: names, timeZone: TZ, sightings: [] });
    expect(route).toMatchObject({ totalStops: 1, truncated: false });
    expect(route.stops).toHaveLength(1);
  });
});
