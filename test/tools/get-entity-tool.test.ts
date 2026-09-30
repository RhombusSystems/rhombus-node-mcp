import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTool } from "../../src/tools/get-entity-tool.js";
import * as entityApi from "../../src/api/get-entity-tool-api.js";
import * as locationApi from "../../src/api/location-tool-api.js";
import type { ToolArgs } from "../../src/types/get-entity-tool-types.js";
import { captureToolHandler } from "../utils.js";

vi.mock("../../src/api/get-entity-tool-api.js");
vi.mock("../../src/api/location-tool-api.js");

const EMPTY_EXTRA = {};

const BASE_ARGS: ToolArgs = {
  entityTypes: ["camera"],
  detail: "core",
  timeZone: "America/Los_Angeles",
  tempUnit: null,
} as ToolArgs;

// The raw states carry a 4-color connectionStatus and NO `connected` boolean —
// the handler must derive it (RED = disconnected) so filterBy on `connected`
// works and the description's promise is true (the live "0 cameras are
// offline" incident was a filter on this then-nonexistent field).
const RAW_CAMERAS = [
  { uuid: "cam-green", name: "Lobby", connectionStatus: "GREEN", locationUuid: "loc-1" },
  { uuid: "cam-red", name: "Dock", connectionStatus: "RED", locationUuid: "loc-1" },
  { uuid: "cam-yellow", name: "Yard", connectionStatus: "YELLOW", locationUuid: "loc-2" },
];

describe("get-entity-tool handler — connected derivation", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(entityApi.getCameraList).mockResolvedValue({ cameras: RAW_CAMERAS });
    handler = captureToolHandler<ToolArgs>(createTool);
  });

  async function invoke(args: Partial<ToolArgs> = {}) {
    const result = await handler({ ...BASE_ARGS, ...args }, EMPTY_EXTRA);
    const text = (result.content ?? []).find((c: any) => c.type === "text");
    return JSON.parse((text as any).text);
  }

  it("derives connected=true for GREEN and non-RED statuses, false for RED", async () => {
    const parsed = await invoke();
    const byUuid = Object.fromEntries(parsed.cameras.map((c: any) => [c.uuid, c]));
    expect(byUuid["cam-green"].connected).toBe(true);
    expect(byUuid["cam-yellow"].connected).toBe(true);
    expect(byUuid["cam-red"].connected).toBe(false);
  });

  it("keeps the derived field at detail=full too", async () => {
    const parsed = await invoke({ detail: "full" } as Partial<ToolArgs>);
    const red = parsed.cameras.find((c: any) => c.uuid === "cam-red");
    expect(red.connected).toBe(false);
  });

  it("does not overwrite an existing connected field", async () => {
    vi.mocked(entityApi.getCameraList).mockResolvedValue({
      cameras: [{ uuid: "c1", name: "X", connectionStatus: "RED", connected: true }],
    });
    const parsed = await invoke();
    expect(parsed.cameras[0].connected).toBe(true);
  });

  it("counts reflect the returned array", async () => {
    const parsed = await invoke();
    expect(parsed.camerasCount).toBe(3);
  });

  it("returns structuredContent alongside text (outputSchema contract)", async () => {
    const result = await handler(BASE_ARGS, EMPTY_EXTRA);
    expect(result.structuredContent).toBeDefined();
    expect((result.structuredContent as any).camerasCount).toBe(3);
  });
});

describe("get-entity-tool handler — locationName", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(entityApi.getCameraList).mockResolvedValue({ cameras: RAW_CAMERAS });
    handler = captureToolHandler<ToolArgs>(createTool);
  });

  async function invoke() {
    const result = await handler(BASE_ARGS, EMPTY_EXTRA);
    const text = (result.content ?? []).find((c: any) => c.type === "text");
    return JSON.parse((text as any).text);
  }

  // The locationName filter the tool advertises needs the field on each entity: without it
  // the filter was ignored and a report took another location's doors for the one it named.
  it("names each entity's location so a locationName filter can narrow", async () => {
    vi.mocked(locationApi.getLocations).mockResolvedValue({
      locations: [
        { uuid: "loc-1", name: "Ice Blocks - Headquarters" },
        { uuid: "loc-2", name: "1919 19th Street" },
      ],
    } as never);
    const parsed = await invoke();
    const byUuid = Object.fromEntries(parsed.cameras.map((c: any) => [c.uuid, c]));
    expect(byUuid["cam-green"].locationName).toBe("Ice Blocks - Headquarters");
    expect(byUuid["cam-yellow"].locationName).toBe("1919 19th Street");
  });

  it("still returns the entities when the location lookup fails", async () => {
    vi.mocked(locationApi.getLocations).mockRejectedValue(new Error("boom"));
    const parsed = await invoke();
    expect(parsed.camerasCount).toBe(3);
    expect(parsed.cameras[0].locationName).toBeUndefined();
  });
});
