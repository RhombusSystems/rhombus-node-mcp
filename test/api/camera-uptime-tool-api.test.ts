import { describe, it, expect, vi, beforeEach } from "vitest";
import * as network from "../../src/network/network.js";
import * as orgCache from "../../src/network/org-reference-cache.js";
import { getCameraUptime, getFleetUptime } from "../../src/api/camera-uptime-tool-api.js";

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

  it("treats cameras missing from the batch response as fully down", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      uptimeByDevice: [
        { deviceUuid: "cam-1", uptimeWindows: [{ startSeconds: START_SEC, durationSeconds: 86_400 }] },
      ],
    } as never);

    const res = await getFleetUptime(START_SEC, END_SEC);

    expect(res.summary.totalCameras).toBe(2);
    expect(res.cameras[0]).toMatchObject({
      cameraUuid: "cam-2",
      uptimePercentage: 0,
      outageCount: 1,
      longestOutageSeconds: 86_400,
    });
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
