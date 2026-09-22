import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/events-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as eventsApi from "../../src/api/events-tool-api.js";
import * as entityApi from "../../src/api/get-entity-tool-api.js";
import {
  CAMERA_SCAN_MAX_CAMERAS,
  CAMERA_SCAN_PER_CAMERA_TIMEOUT_MS,
  CAMERA_WINDOW_DEFAULT_SEC,
  CAMERA_WINDOW_MAX_SEC,
  resolveCameraWindow,
  summarizeCameraFootageEvents,
} from "../../src/api/events-tool-api.js";

vi.mock("../../src/api/events-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof eventsApi>();
  return { ...actual, getCameraFootageSeekpointEvents: vi.fn() };
});
vi.mock("../../src/api/get-entity-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof entityApi>();
  return { ...actual, getCameraList: vi.fn() };
});

// 2026-09-22 00:00 PT → 09:30 PT: "this morning" on the ITG audit question.
const START = "2026-09-22T00:00:00.000-07:00";
const END = "2026-09-22T09:30:00.000-07:00";
const START_MS = new Date(START).getTime();
const MORNING_SEC = 9.5 * 3600;

function withNulledArgs(overrides: Record<string, unknown>) {
  return {
    eventType: "camera",
    startTime: START,
    endTime: END,
    accessControlledDoorUuids: null,
    deviceUuid: null,
    sensorUuid: null,
    limit: null,
    locationUuid: null,
    componentEventTypes: null,
    timeZone: "America/Los_Angeles",
    cameraUuid: null,
    duration: null,
    buttonSensorUuid: null,
    occupancySensorUuid: null,
    proximityTagUuids: null,
    doorbellCameraUuid: null,
    tempUnit: "F",
    includeFields: null,
    filterBy: null,
    ...overrides,
  };
}

// Through the real SDK so the new output keys are validated against
// outputSchema the way production validates them.
async function callEventsTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const result = await client.callTool({ name: "events-tool", arguments: args });
    const text = (result.content as { text: string }[])[0]?.text ?? "";
    return { result, payload: result.isError ? null : JSON.parse(text), text };
  } finally {
    await client.close();
    await server.close();
  }
}

const CAMERAS = [
  { uuid: "cam-lobby", name: "Lobby", locationUuid: "loc-hq", connectionStatus: "GREEN" },
  { uuid: "cam-dock", name: "Loading Dock", locationUuid: "loc-hq", connectionStatus: "GREEN" },
  { uuid: "cam-idf", name: "IDF Closet", locationUuid: "loc-hq", connectionStatus: "GREEN" },
  { uuid: "cam-remote", name: "Remote Yard", locationUuid: "loc-yard", connectionStatus: "RED" },
];

function seekpoints(cameraUuid: string, spec: Record<string, number>, baseMs = START_MS + 3600_000) {
  const cameraFootageEvents: { activity: string; timestamp: number }[] = [];
  let t = baseMs;
  for (const [activity, n] of Object.entries(spec)) {
    for (let i = 0; i < n; i++) cameraFootageEvents.push({ activity, timestamp: (t += 60_000) });
  }
  cameraFootageEvents.sort((a, b) => b.timestamp - a.timestamp);
  return { cameraUuid, cameraFootageEvents };
}

const FOOTAGE: Record<string, ReturnType<typeof seekpoints>> = {
  "cam-lobby": seekpoints("cam-lobby", { MOTION_HUMAN: 5, MOTION: 2 }),
  "cam-dock": seekpoints("cam-dock", { MOTION_CAR: 3 }),
  "cam-idf": seekpoints("cam-idf", {}),
  "cam-remote": seekpoints("cam-remote", { MOTION: 1 }),
};

describe("resolveCameraWindow", () => {
  const now = new Date("2026-09-22T10:00:00.000-07:00").getTime();

  it("startTime + endTime → exactly that range (the 1-hour default no longer swallows 'this morning')", () => {
    expect(resolveCameraWindow({ startTime: START, endTime: END, nowMs: now })).toEqual({
      startMs: START_MS,
      durationSec: MORNING_SEC,
    });
  });

  it("endTime null means now", () => {
    expect(resolveCameraWindow({ startTime: START, endTime: null, nowMs: now })).toEqual({
      startMs: START_MS,
      durationSec: 10 * 3600,
    });
  });

  it("duration wins over endTime, counted from startTime", () => {
    expect(resolveCameraWindow({ startTime: START, endTime: END, duration: 600, nowMs: now })).toEqual({
      startMs: START_MS,
      durationSec: 600,
    });
  });

  it("no startTime: the default window ending at endTime, else at now", () => {
    expect(resolveCameraWindow({ endTime: END, nowMs: now })).toEqual({
      startMs: new Date(END).getTime() - CAMERA_WINDOW_DEFAULT_SEC * 1000,
      durationSec: CAMERA_WINDOW_DEFAULT_SEC,
    });
    expect(resolveCameraWindow({ nowMs: now })).toEqual({
      startMs: now - CAMERA_WINDOW_DEFAULT_SEC * 1000,
      durationSec: CAMERA_WINDOW_DEFAULT_SEC,
    });
  });

  it("an end before the start falls back to the default window from startTime", () => {
    const w = resolveCameraWindow({ startTime: END, endTime: START, nowMs: now });
    expect(w).toEqual({ startMs: new Date(END).getTime(), durationSec: CAMERA_WINDOW_DEFAULT_SEC });
  });

  it("caps a range longer than 24 h from startTime and says so", () => {
    const w = resolveCameraWindow({
      startTime: "2026-09-20T00:00:00.000-07:00",
      endTime: END,
      nowMs: now,
    });
    expect(w.startMs).toBe(new Date("2026-09-20T00:00:00.000-07:00").getTime());
    expect(w.durationSec).toBe(CAMERA_WINDOW_MAX_SEC);
    expect(w.note).toContain("24 h");
    expect(w.note).toContain("report-tool");
  });
});

describe("summarizeCameraFootageEvents", () => {
  it("counts per activity and brackets the window in the requested timezone", () => {
    const s = summarizeCameraFootageEvents(
      { uuid: "cam-lobby", name: "Lobby", locationUuid: "loc-hq" },
      FOOTAGE["cam-lobby"].cameraFootageEvents,
      "America/Los_Angeles"
    );
    expect(s).toMatchObject({
      cameraUuid: "cam-lobby",
      cameraName: "Lobby",
      locationUuid: "loc-hq",
      eventCount: 7,
      activityCounts: { MOTION_HUMAN: 5, MOTION: 2 },
    });
    expect(s.firstEventTime).toMatch(/^September 22, 2026 at 1:0\d:00 AM$/);
    expect(s.lastEventTime).toMatch(/^September 22, 2026 at 1:07:00 AM$/);
  });

  it("no events: zero, no times", () => {
    const s = summarizeCameraFootageEvents({ uuid: "cam-idf" }, []);
    expect(s).toEqual({ cameraUuid: "cam-idf", eventCount: 0, activityCounts: {} });
  });
});

describe("events-tool camera — org-wide scan when no cameraUuid is given", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(entityApi.getCameraList).mockResolvedValue({ cameras: CAMERAS } as never);
    vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mockImplementation(
      async (cameraUuid: string) => FOOTAGE[cameraUuid] ?? seekpoints(cameraUuid, {})
    );
  });

  it("scans every camera for the requested window and returns per-camera counts, busiest first", async () => {
    const { result, payload } = await callEventsTool(withNulledArgs({}));
    expect(result.isError).toBeFalsy();

    // one seekpoint query per camera, each for the full morning
    const calls = vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mock.calls;
    expect(calls).toHaveLength(4);
    for (const [, durationSec, startMs] of calls) {
      expect(durationSec).toBe(MORNING_SEC);
      expect(startMs).toBe(START_MS);
    }

    expect(payload.eventType).toBe("camera");
    expect(payload.cameraEvents).toBeUndefined();
    expect(payload.cameraActivity.map((c: any) => c.cameraUuid)).toEqual([
      "cam-lobby",
      "cam-dock",
      "cam-remote",
    ]);
    expect(payload.cameraActivity[0]).toMatchObject({
      cameraName: "Lobby",
      eventCount: 7,
      activityCounts: { MOTION_HUMAN: 5, MOTION: 2 },
    });
    expect(payload.camerasWithoutActivity).toEqual(["IDF Closet"]);
    expect(payload.cameraActivityWindow).toMatchObject({
      camerasQueried: 4,
      camerasWithActivity: 3,
      activityTotals: { MOTION_HUMAN: 5, MOTION: 3, MOTION_CAR: 3 },
    });
    expect(payload.cameraActivityWindow.startTime).toBe("September 22, 2026 at 12:00:00 AM");
    expect(payload.cameraActivityWindow.endTime).toBe("September 22, 2026 at 9:30:00 AM");
    expect(payload.cameraActivityWindow.camerasNotQueried).toBeUndefined();
    expect(payload.needUserInput).toBeUndefined();
    expect(payload.note).toContain("pass a cameraUuid");
  });

  it("locationUuid narrows the scan to that location's cameras", async () => {
    const { payload } = await callEventsTool(withNulledArgs({ locationUuid: "loc-yard" }));
    expect(vi.mocked(eventsApi.getCameraFootageSeekpointEvents)).toHaveBeenCalledTimes(1);
    expect(payload.cameraActivity.map((c: any) => c.cameraUuid)).toEqual(["cam-remote"]);
    expect(payload.cameraActivityWindow.camerasQueried).toBe(1);
  });

  it("a camera whose query fails is reported as unknown, not as quiet", async () => {
    vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mockImplementation(async (cameraUuid: string) => {
      if (cameraUuid === "cam-dock") throw new Error("403 forbidden");
      return FOOTAGE[cameraUuid];
    });
    const { result, payload } = await callEventsTool(withNulledArgs({}));
    expect(result.isError).toBeFalsy();
    const dock = payload.cameraActivity.find((c: any) => c.cameraUuid === "cam-dock");
    expect(dock).toMatchObject({ eventCount: 0, error: "403 forbidden" });
    expect(payload.camerasWithoutActivity).toEqual(["IDF Closet"]);
    expect(payload.cameraActivityWindow.camerasWithErrors).toBe(1);
    expect(payload.cameraActivityWindow.camerasWithActivity).toBe(2);
    expect(payload.note).toContain("1 camera queries failed");
  });

  it("no cameras at the location: an empty scan with a note, not a clarification request", async () => {
    const { payload } = await callEventsTool(withNulledArgs({ locationUuid: "loc-nowhere" }));
    expect(payload.cameraActivity).toEqual([]);
    expect(payload.cameraActivityWindow.camerasQueried).toBe(0);
    expect(payload.note).toContain("loc-nowhere");
    expect(vi.mocked(eventsApi.getCameraFootageSeekpointEvents)).not.toHaveBeenCalled();
  });

  it("caps the scan at CAMERA_SCAN_MAX_CAMERAS, connected cameras first, and counts the rest as not queried", async () => {
    const many = Array.from({ length: CAMERA_SCAN_MAX_CAMERAS + 25 }, (_, i) => ({
      uuid: `cam-${i}`,
      name: `Camera ${String(i).padStart(3, "0")}`,
      locationUuid: "loc-hq",
      connectionStatus: i < 25 ? "RED" : "GREEN",
    }));
    vi.mocked(entityApi.getCameraList).mockResolvedValue({ cameras: many } as never);
    vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mockImplementation(async (cameraUuid: string) =>
      seekpoints(cameraUuid, { MOTION_HUMAN: 1 })
    );
    const { payload } = await callEventsTool(withNulledArgs({}));
    const queried = vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mock.calls.map(c => c[0]);
    expect(queried).toHaveLength(CAMERA_SCAN_MAX_CAMERAS);
    // the 25 disconnected cameras are the ones left out
    expect(queried.some(u => Number(u.slice(4)) < 25)).toBe(false);
    expect(payload.cameraActivityWindow.camerasNotQueried).toBe(25);
    expect(payload.note).toContain("25 of 225 cameras were not scanned");
  });
});

describe("events-tool camera — scan pool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("a slow camera does not hold up the others: it is written off as unknown after the per-camera timeout", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const many = Array.from({ length: 12 }, (_, i) => ({
        uuid: `cam-${i}`,
        name: `Camera ${i}`,
        locationUuid: "loc-hq",
        connectionStatus: "GREEN",
      }));
      vi.mocked(entityApi.getCameraList).mockResolvedValue({ cameras: many } as never);
      vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mockImplementation((cameraUuid: string) =>
        cameraUuid === "cam-0"
          ? new Promise(() => {}) // never resolves — a 127k-seekpoint stress camera
          : Promise.resolve(seekpoints(cameraUuid, { MOTION_HUMAN: 1 }))
      );
      const pending = callEventsTool(withNulledArgs({}));
      await vi.advanceTimersByTimeAsync(CAMERA_SCAN_PER_CAMERA_TIMEOUT_MS + 100);
      const { result, payload } = await pending;
      expect(result.isError).toBeFalsy();
      expect(payload.cameraActivityWindow.camerasQueried).toBe(12);
      expect(payload.cameraActivityWindow.camerasWithActivity).toBe(11);
      expect(payload.cameraActivityWindow.camerasWithErrors).toBe(1);
      const slow = payload.cameraActivity.find((c: any) => c.cameraUuid === "cam-0");
      expect(slow.error).toMatch(/timed out after 15 s/);
      expect(payload.camerasWithoutActivity).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("getCameraFootageSeekpointEvents — failures are errors, not empty results", () => {
  it("throws when postApi reports an HTTP or transport failure", async () => {
    const { getCameraFootageSeekpointEvents: real } = await vi.importActual<typeof eventsApi>(
      "../../src/api/events-tool-api.js"
    );
    const network = await import("../../src/network/network.js");
    const spy = vi
      .spyOn(network, "postApi")
      .mockResolvedValue({ error: true, status: "HTTP 500 (server error)" } as never);
    try {
      await expect(real("cam-x", 3600, START_MS)).rejects.toThrow(/cam-x: HTTP 500/);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("events-tool camera — one camera", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mockImplementation(
      async (cameraUuid: string) => FOOTAGE[cameraUuid] ?? seekpoints(cameraUuid, {})
    );
  });

  it("honours endTime (was: one hour from startTime regardless) and adds the camera's counts", async () => {
    const { result, payload } = await callEventsTool(withNulledArgs({ cameraUuid: "cam-lobby" }));
    expect(result.isError).toBeFalsy();
    expect(vi.mocked(eventsApi.getCameraFootageSeekpointEvents)).toHaveBeenCalledWith(
      "cam-lobby",
      MORNING_SEC,
      START_MS,
      undefined,
      undefined
    );
    expect(vi.mocked(entityApi.getCameraList)).not.toHaveBeenCalled();
    expect(payload.cameraEvents).toHaveLength(7);
    expect(payload.cameraActivity).toEqual([
      expect.objectContaining({ cameraUuid: "cam-lobby", eventCount: 7, activityCounts: { MOTION_HUMAN: 5, MOTION: 2 } }),
    ]);
    expect(payload.cameraActivityWindow).toMatchObject({
      camerasQueried: 1,
      camerasWithActivity: 1,
      activityTotals: { MOTION_HUMAN: 5, MOTION: 2 },
    });
    expect(payload.note).toBeUndefined();
  });

  it("caps the individual rows at limit (newest first) while the counts cover everything", async () => {
    const { payload } = await callEventsTool(withNulledArgs({ cameraUuid: "cam-lobby", limit: 2 }));
    expect(payload.cameraEvents).toHaveLength(2);
    const all = FOOTAGE["cam-lobby"].cameraFootageEvents;
    expect(payload.cameraEvents.map((e: any) => e.timestamp)).toEqual([all[0].timestamp, all[1].timestamp]);
    expect(payload.cameraActivity[0].eventCount).toBe(7);
    expect(payload.note).toContain("7 seekpoints in the window; only the newest 2 are listed");
  });

  it("a duration argument still works and keeps the legacy default when nothing else is given", async () => {
    await callEventsTool(withNulledArgs({ cameraUuid: "cam-lobby", endTime: null, duration: 600 }));
    expect(vi.mocked(eventsApi.getCameraFootageSeekpointEvents).mock.calls[0][1]).toBe(600);
  });
});
