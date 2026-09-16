import { describe, it, expect, vi, beforeEach } from "vitest";
import * as network from "../../src/network/network.js";
import * as orgCache from "../../src/network/org-reference-cache.js";
import { getCameraUptime, getFleetUptime } from "../../src/api/camera-uptime-tool-api.js";
import { UptimeSource } from "../../src/types/camera-uptime-tool-types.js";

vi.mock("../../src/network/network.js");
vi.mock("../../src/network/org-reference-cache.js");

const START_SEC = 1_700_000_000;
const END_SEC = START_SEC + 86_400;

const CAMERA_LIST = {
  cameraStates: [
    { uuid: "cam-1", name: "Lobby", locationUuid: "loc-1" },
    { uuid: "cam-2", name: "Dock", locationUuid: "loc-1" },
    { uuid: "cam-unassigned", name: "Spare" }, // no location — excluded from fleet stats
  ],
};

describe("getCameraUptime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends MILLISECONDS to /camera/getUptimeWindows and computes stats in seconds", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }],
    } as never);

    const res = await getCameraUptime("cam-1", START_SEC, END_SEC);

    const call = vi.mocked(network.postApi).mock.calls[0][0];
    expect(call.route).toBe("/camera/getUptimeWindows");
    expect(call.body).toMatchObject({
      cameraUuid: "cam-1",
      startTime: START_SEC * 1000,
      endTime: END_SEC * 1000,
    });

    expect(res.uptimePercentage).toBe(100);
    expect(res.outageCount).toBe(0);
    // No uptimeSource on the wire (older webservice) => unchanged behaviour.
    expect(res.uptimeSource).toBe(UptimeSource.HARDWARE);
  });

  it("omits the stats entirely when the server reports UNAVAILABLE", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeWindows: [],
      uptimeSource: "UNAVAILABLE",
    } as never);

    const res = await getCameraUptime("cam-3rd-party", START_SEC, END_SEC);

    expect(res.uptimeSource).toBe(UptimeSource.UNAVAILABLE);
    expect(res.uptimePercentage).toBeUndefined();
    expect(res.totalUptimeSeconds).toBeUndefined();
    expect(res.outageCount).toBeUndefined();
    expect(res.longestOutageSeconds).toBeUndefined();
  });

  it("computes stats normally for presence-derived uptime", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 43_200 }],
      uptimeSource: "MEDIA_PRESENCE",
    } as never);

    const res = await getCameraUptime("cam-3rd-party", START_SEC, END_SEC);

    expect(res.uptimeSource).toBe(UptimeSource.MEDIA_PRESENCE);
    expect(res.uptimePercentage).toBe(50);
  });

  it("falls back to HARDWARE for an unrecognised uptimeSource", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }],
      uptimeSource: "SOME_FUTURE_SOURCE",
    } as never);

    const res = await getCameraUptime("cam-1", START_SEC, END_SEC);

    expect(res.uptimeSource).toBe(UptimeSource.HARDWARE);
    expect(res.uptimePercentage).toBe(100);
  });
});

describe("getFleetUptime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(orgCache.cachedPostApi).mockResolvedValue(CAMERA_LIST as never);
  });

  it("uses /camera/getUptimeWindowsForOrg when available (single call, no fan-out)", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeByDevice: [
        { deviceUuid: "cam-1", uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }] },
        { deviceUuid: "cam-2", uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 43_200 }] },
      ],
    } as never);

    const res = await getFleetUptime(START_SEC, END_SEC);

    expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(1);
    const call = vi.mocked(network.postApi).mock.calls[0][0];
    expect(call.route).toBe("/camera/getUptimeWindowsForOrg");
    expect(call.body).toMatchObject({
      startTimeMs: START_SEC * 1000,
      endTimeMs: END_SEC * 1000,
    });

    expect(res.summary.totalCameras).toBe(2);
    // sorted worst-first: cam-2 at 50%, cam-1 at 100%
    expect(res.cameras[0]).toMatchObject({ cameraUuid: "cam-2", uptimePercentage: 50 });
    expect(res.cameras[1]).toMatchObject({ cameraUuid: "cam-1", uptimePercentage: 100 });
    expect(res.summary.worstCamera).toBe("Dock");
    expect(res.summary.worstUptimePercentage).toBe(50);
  });

  /*
   * Deliberate behaviour change: a camera the batch route said nothing about
   * never reached the uptime store, so its uptime is unknown. Reporting it as
   * 0% (the old behaviour) is what made MIND list 3rd party cameras as "down"
   * and then drill into one, which used to 500.
   */
  it("treats cameras missing from the batch response as unknown, not down", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeByDevice: [
        { deviceUuid: "cam-1", uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }] },
      ],
    } as never);

    const res = await getFleetUptime(START_SEC, END_SEC);

    expect(res.summary.totalCameras).toBe(2);

    const camTwo = res.cameras.find(c => c.cameraUuid === "cam-2");
    expect(camTwo).toMatchObject({ uptimeSource: UptimeSource.UNAVAILABLE });
    expect(camTwo?.uptimePercentage).toBeUndefined();
    expect(camTwo?.outageCount).toBeUndefined();
    expect(camTwo?.longestOutageSeconds).toBeUndefined();

    // Unknown cameras sort last so they never read as the worst performers.
    expect(res.cameras[0].cameraUuid).toBe("cam-1");
    expect(res.summary.camerasWithKnownUptime).toBe(1);
    expect(res.summary.camerasWithUnknownUptime).toBe(1);
    expect(res.summary.worstCamera).toBe("Lobby");
    expect(res.summary.averageUptimePercentage).toBe(100);
  });

  it("honours an explicit UNAVAILABLE uptimeSource from the batch route", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeByDevice: [
        {
          deviceUuid: "cam-1",
          uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }],
          uptimeSource: "HARDWARE",
        },
        { deviceUuid: "cam-2", uptimeWindows: [], uptimeSource: "UNAVAILABLE" },
      ],
    } as never);

    const res = await getFleetUptime(START_SEC, END_SEC);

    const camTwo = res.cameras.find(c => c.cameraUuid === "cam-2");
    expect(camTwo).toMatchObject({ uptimeSource: UptimeSource.UNAVAILABLE });
    expect(camTwo?.uptimePercentage).toBeUndefined();
    expect(res.summary.camerasWithUnknownUptime).toBe(1);
  });

  it("keeps an empty HARDWARE result meaning fully down", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeByDevice: [
        { deviceUuid: "cam-1", uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }] },
        { deviceUuid: "cam-2", uptimeWindows: [], uptimeSource: "HARDWARE" },
      ],
    } as never);

    const res = await getFleetUptime(START_SEC, END_SEC);

    expect(res.cameras[0]).toMatchObject({
      cameraUuid: "cam-2",
      uptimeSource: UptimeSource.HARDWARE,
      uptimePercentage: 0,
      outageCount: 1,
      longestOutageSeconds: 86_400,
    });
    expect(res.summary.camerasWithUnknownUptime).toBe(0);
  });

  it("reports a failed per-camera lookup as unknown rather than 0%", async () => {
    vi.mocked(network.postApi).mockImplementation(async ({ route }: { route: string }) => {
      if (route === "/camera/getUptimeWindowsForOrg") {
        return { error: true, status: "Request Error: 404" } as never;
      }
      throw new Error("HTTP 500");
    });

    const res = await getFleetUptime(START_SEC, END_SEC);

    expect(res.summary.totalCameras).toBe(2);
    expect(res.summary.camerasWithUnknownUptime).toBe(2);
    expect(res.cameras.every(c => c.uptimeSource === UptimeSource.UNAVAILABLE)).toBe(true);
    expect(res.cameras.every(c => c.uptimePercentage === undefined)).toBe(true);
    expect(res.summary.worstCamera).toBeUndefined();
  });

  it("falls back to the per-camera fan-out (in ms) when the batch route is unavailable", async () => {
    vi.mocked(network.postApi).mockImplementation(async ({ route }: { route: string }) => {
      if (route === "/camera/getUptimeWindowsForOrg") {
        return { error: true, status: "Request Error: 404" } as never;
      }
      return { uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }] } as never;
    });

    const res = await getFleetUptime(START_SEC, END_SEC);

    const routes = vi.mocked(network.postApi).mock.calls.map(c => c[0].route);
    expect(routes[0]).toBe("/camera/getUptimeWindowsForOrg");
    expect(routes.filter(r => r === "/camera/getUptimeWindows")).toHaveLength(2);

    const perCameraCall = vi.mocked(network.postApi).mock.calls[1][0];
    expect(perCameraCall.body).toMatchObject({
      startTime: START_SEC * 1000,
      endTime: END_SEC * 1000,
    });

    expect(res.summary.totalCameras).toBe(2);
    expect(res.cameras.every(c => c.uptimePercentage === 100)).toBe(true);
  });
});
