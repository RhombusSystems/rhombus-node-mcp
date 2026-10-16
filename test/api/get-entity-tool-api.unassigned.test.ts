import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../src/api/get-entity-tool-api.js";
import * as cache from "../../src/network/org-reference-cache.js";

// The API omits `locationUuid` for a device that is not assigned to a
// location. These lists must pass such devices through untouched.
vi.mock("../../src/network/org-reference-cache.js", async original => ({
  ...(await original<typeof cache>()),
  cachedPostApi: vi.fn(),
}));

const cachedPostApi = vi.mocked(cache.cachedPostApi);

describe("get-entity-tool-api: devices without a location", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCameraList keeps a camera that has no locationUuid", async () => {
    cachedPostApi.mockResolvedValueOnce({
      cameraStates: [
        { uuid: "cam-assigned", name: "Lobby", locationUuid: "loc-1", connectionStatus: "GREEN" },
        { uuid: "cam-unassigned", name: "New camera", connectionStatus: "GREEN" },
      ],
    });

    const { cameras } = await api.getCameraList();

    expect(cameras.map((c: { uuid: string }) => c.uuid)).toEqual([
      "cam-assigned",
      "cam-unassigned",
    ]);
  });

  it("getDoorbellCameras, getBadgeReaders and getKeypads keep unassigned devices too", async () => {
    cachedPostApi.mockResolvedValueOnce({
      minimalStates: [{ uuid: "db-1", locationUuid: "loc-1" }, { uuid: "db-2" }],
    });
    cachedPostApi.mockResolvedValueOnce({
      minimalStates: [{ uuid: "br-1", locationUuid: "loc-1" }, { uuid: "br-2" }],
    });
    cachedPostApi.mockResolvedValueOnce({
      keypads: [{ uuid: "kp-1", locationUuid: "loc-1" }, { uuid: "kp-2" }],
    });

    const { doorbellCameras } = await api.getDoorbellCameras();
    const { badgeReaders } = await api.getBadgeReaders();
    const { keypadStates } = await api.getKeypads();

    expect(doorbellCameras).toHaveLength(2);
    expect(badgeReaders).toHaveLength(2);
    expect(keypadStates).toHaveLength(2);
  });

  it("getEnvironmentalGateways keeps an unassigned gateway", async () => {
    cachedPostApi.mockResolvedValueOnce({
      minimalEnvironmentalGatewayStates: [
        { uuid: "gw-1", locationUuid: "loc-1", connectionStatus: "GREEN" },
        { uuid: "gw-2", connectionStatus: "RED" },
      ],
    });

    const { minimalEnvironmentalGatewayStates } =
      await api.getEnvironmentalGateways("America/New_York");

    expect(minimalEnvironmentalGatewayStates.map((g: { uuid: string }) => g.uuid)).toEqual([
      "gw-1",
      "gw-2",
    ]);
  });
});
