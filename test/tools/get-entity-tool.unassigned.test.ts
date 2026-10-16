import { beforeEach, describe, expect, it, vi } from "vitest";
import * as entityApi from "../../src/api/get-entity-tool-api.js";
import * as locationApi from "../../src/api/location-tool-api.js";
import { createTool, NO_LOCATION_LABEL } from "../../src/tools/get-entity-tool.js";
import type { ToolArgs } from "../../src/types/get-entity-tool-types.js";
import { captureToolHandler, findTextContent } from "../utils.js";

vi.mock("../../src/api/get-entity-tool-api.js");
vi.mock("../../src/api/location-tool-api.js");

const EMPTY_EXTRA = {};

describe("get-entity-tool: devices without a location", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = captureToolHandler<ToolArgs>(createTool);
    vi.mocked(entityApi.getCameraList).mockResolvedValue({
      cameras: [
        { uuid: "cam-assigned", name: "Lobby", locationUuid: "loc-1", connectionStatus: "GREEN" },
        { uuid: "cam-unassigned", name: "New camera", connectionStatus: "GREEN" },
      ],
    });
    vi.mocked(locationApi.getLocations).mockResolvedValue({
      locations: [{ uuid: "loc-1", name: "Headquarters" }],
    } as any);
  });

  it("lists an unassigned camera with a 'No Location' label", async () => {
    const result = await handler(
      { entityTypes: ["camera"], detail: "core", timeZone: "America/New_York" } as ToolArgs,
      EMPTY_EXTRA
    );
    const payload = JSON.parse(findTextContent(result)!.text);
    const byUuid = Object.fromEntries(payload.cameras.map((c: any) => [c.uuid, c]));

    expect(Object.keys(byUuid).sort()).toEqual(["cam-assigned", "cam-unassigned"]);
    expect(byUuid["cam-assigned"].locationName).toBe("Headquarters");
    expect(byUuid["cam-unassigned"].locationName).toBe(NO_LOCATION_LABEL);
    expect(byUuid["cam-unassigned"].locationUuid).toBeUndefined();
    expect(byUuid["cam-unassigned"].connected).toBe(true);
  });

  it("counts the unassigned camera when filtering on connectivity", async () => {
    const result = await handler(
      {
        entityTypes: ["camera"],
        detail: "core",
        timeZone: "America/New_York",
        filterBy: [{ field: "connected", op: "=", value: true }],
      } as unknown as ToolArgs,
      EMPTY_EXTRA
    );
    const payload = JSON.parse(findTextContent(result)!.text);

    expect(payload.cameras.map((c: any) => c.uuid).sort()).toEqual([
      "cam-assigned",
      "cam-unassigned",
    ]);
  });
});
