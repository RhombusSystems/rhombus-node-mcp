import { describe, it, expect, vi, beforeEach } from "vitest";

import * as network from "../../src/network/network.js";
import * as users from "../../src/api/user-tool-api.js";
import * as entity from "../../src/api/get-entity-tool-api.js";
import { searchRhombusBadgeEvents } from "../../src/api/rhombus-badge-events-api.js";

vi.mock("../../src/network/network.js", async (orig) => ({
  ...(await orig<typeof import("../../src/network/network.js")>()),
  postApi: vi.fn(),
}));
vi.mock("../../src/api/user-tool-api.js");
vi.mock("../../src/api/get-entity-tool-api.js");

const TZ = "America/Los_Angeles";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(users.listUsers).mockResolvedValue([
    { uuid: "u1", firstName: "Forrest", lastName: "Battles", email: "forrest@example.com" },
    { uuid: "u2", firstName: "Eve", lastName: "Jones", email: "eve@example.com" },
  ]);
  vi.mocked(entity.getAccessControlledDoors).mockResolvedValue({
    accessControlledDoors: [
      { uuid: "door1", name: "Front Door", locationUuid: "locHQ", associatedCameras: ["camFront"] },
      { uuid: "door2", name: "Lab Door", locationUuid: "locLab", associatedCameras: [] },
    ],
  } as never);
});

describe("searchRhombusBadgeEvents", () => {
  it("resolves the name to a Rhombus user and maps credential events to doors and cameras", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      componentEvents: [
        { timestampMs: 3000, componentCompositeUuid: "door2", authorizationResult: "ALLOWED" },
        { timestampMs: 1000, componentCompositeUuid: "door1", locationUuid: "locHQ", authorizationResult: "ALLOWED" },
        { timestampMs: 2000, componentCompositeUuid: "door1", authorizationResult: "DENIED" },
      ],
    } as never);

    const res = await searchRhombusBadgeEvents({ personQuery: "forrest battles", afterMs: 0, beforeMs: 9000 }, TZ);

    expect(res.matchedUsers).toEqual(["Forrest Battles"]);
    expect(network.postApi).toHaveBeenCalledTimes(1);
    expect(vi.mocked(network.postApi).mock.calls[0][0]).toMatchObject({
      route: "/component/findComponentEventsByUser",
      body: { userUuid: "u1", createdAfterMs: 0, createdBeforeMs: 9000, typeFilter: ["CredentialReceivedEvent"] },
    });
    expect(res.events.map((e) => [e.timestampMs, e.doorName, e.cameraUuids, e.granted])).toEqual([
      [1000, "Front Door", ["camFront"], true],
      [2000, "Front Door", ["camFront"], false],
      [3000, "Lab Door", [], true],
    ]);
    expect(res.events[0].cardholderName).toBe("Forrest Battles");
    expect(res.events[2].locationUuid).toBe("locLab"); // falls back to the door's location
  });

  it("applies the location filter", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      componentEvents: [
        { timestampMs: 1000, componentCompositeUuid: "door1" },
        { timestampMs: 3000, componentCompositeUuid: "door2" },
      ],
    } as never);

    const res = await searchRhombusBadgeEvents({ personQuery: "Forrest", locationUuids: ["locLab"] }, TZ);

    expect(res.events.map((e) => e.doorUuid)).toEqual(["door2"]);
  });

  it("makes no event queries when no user matches", async () => {
    const res = await searchRhombusBadgeEvents({ personQuery: "Nobody Here" }, TZ);

    expect(res).toEqual({ events: [], matchedUsers: [] });
    expect(network.postApi).not.toHaveBeenCalled();
  });

  it("throws on an API error so the caller reports the source as unknown", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: true, errorMsg: "boom" } as never);

    await expect(searchRhombusBadgeEvents({ personQuery: "Forrest" }, TZ)).rejects.toThrow("boom");
  });
});
