import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/update-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import {
  buildPrivacyRegionUpdate,
  describePrivacyRegions,
  supportsPrivacyPolygons,
  isSelfIntersecting,
  toServerPolygon,
  toServerWindow,
  validatePrivacyShapes,
} from "../../src/api/privacy-region-geometry.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const CAMERA_UUID = "yDKyA2YSR-Sv9pzKQe0iRQ";
const UPPER_LEFT = { leftPercent: 0, topPercent: 0, widthPercent: 25, heightPercent: 50 };
const UPPER_LEFT_DESCRIPTION = {
  shape: "rectangle",
  points: [
    { xPercent: 0, yPercent: 0 },
    { xPercent: 25, yPercent: 0 },
    { xPercent: 25, yPercent: 50 },
    { xPercent: 0, yPercent: 50 },
  ],
  ...UPPER_LEFT,
};
// A slanted quadrilateral — the case a bounding rectangle cannot express.
const SLANTED = {
  points: [
    { xPercent: 10, yPercent: 5 },
    { xPercent: 40, yPercent: 15 },
    { xPercent: 35, yPercent: 60 },
    { xPercent: 5, yPercent: 50 },
  ],
};

async function callUpdateTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await client.callTool({ name: "update-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function args(overrides: Record<string, unknown>) {
  return {
    entityType: "camera",
    entityUuid: CAMERA_UUID,
    cameraVideoSettings: null,
    cameraAudioSettings: null,
    cameraDeviceSettings: null,
    privacyRegions: null,
    step: "confirmation",
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

function textOf(result: Awaited<ReturnType<typeof callUpdateTool>>): string {
  return (result.content as { text: string }[]).map(item => item.text).join("\n");
}

function sentUpdates() {
  return vi
    .mocked(network.postApi)
    .mock.calls.map(([call]) => call as { route: string; body: any })
    .filter(call => call.route === "/camera/updateFacetedConfig");
}

/**
 * Serves getFacetedConfig from a mutable facet. `applyWrites: false` models the
 * prod failure: api2 answers updateFacetedConfig with success but the stored
 * config does not change.
 */
function mockCameraApi({
  facet,
  firmwareVersion = "2026_0904_2335_69e40c",
  hwVariation = "CAMERA_R400",
  applyWrites = true,
}: {
  facet: Record<string, unknown>;
  firmwareVersion?: string;
  hwVariation?: string;
  applyWrites?: boolean;
}) {
  const stored = { ...facet };
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route, body } = call as { route: string; body: any };
    switch (route) {
      case "/camera/getMinimalCameraStateList":
        return {
          cameraStates: [
            { uuid: CAMERA_UUID, name: "3rd Floor IDF Closet", firmwareVersion, hwVariation },
          ],
        } as never;
      case "/camera/getFacetedConfig":
        return { config: { videoFacetSettings: { v0: { ...stored } } } } as never;
      case "/camera/getDetails":
      case "/org/getOrgV2":
        return {} as never;
      case "/camera/updateFacetedConfig":
        if (applyWrites) Object.assign(stored, body.configUpdate.videoFacetSettings?.v0 ?? {});
        return { error: false } as never;
      default:
        throw new Error(`unexpected route ${route}`);
    }
  });
}

describe("privacy-region geometry mirrors the Console", () => {
  it("converts an unrotated rectangle to permyriad", () => {
    expect(toServerWindow(UPPER_LEFT, { rotation: 0 })).toEqual({ x: 0, y: 0, w: 2500, h: 5000 });
  });

  // The Console's reader rotates stored coords BY `rotation`; the writer must
  // rotate by -rotation so the region lands where the user sees it.
  it("undoes the camera rotation (270°) so the region lands where the user sees it", () => {
    const polygon = toServerPolygon(UPPER_LEFT, { rotation: 270 });
    const round = (v: number) => Math.round(v * 1000) / 1000;
    expect(polygon.coordinates?.map(p => ({ x: round(p.x), y: round(p.y) }))).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 0.25 },
      { x: 0.5, y: 0.25 },
      { x: 0.5, y: 0 },
    ]);
    // ...and reading it back the Console's way yields the rectangle we wrote.
    const config = { rotation: 270, privacy_window_polygons: [polygon] };
    expect(describePrivacyRegions(config, true)).toEqual([UPPER_LEFT_DESCRIPTION]);
  });

  it("applies the PTZ crop in reverse", () => {
    const ptz = { size_percent: 0.5, offset_x_percent: 0.25, offset_y_percent: 0.25 };
    expect(toServerWindow(UPPER_LEFT, { rotation: 0, ptz_config: ptz })).toEqual({
      x: 2500,
      y: 2500,
      w: 1250,
      h: 2500,
    });
  });

  it("picks polygons or legacy windows by firmware, nulling the other field like the Console", () => {
    expect(supportsPrivacyPolygons("2025_0626_0000_abcdef")).toBe(true);
    expect(supportsPrivacyPolygons("2025_0101_0000_abcdef")).toBe(false);
    expect(supportsPrivacyPolygons(undefined)).toBe(false);

    const legacy = buildPrivacyRegionUpdate("add", [UPPER_LEFT], {}, false);
    expect(legacy).toEqual({ privacy_window_polygons: null, privacy_windows: [{ x: 0, y: 0, w: 2500, h: 5000 }] });

    const modern = buildPrivacyRegionUpdate("add", [UPPER_LEFT], {}, true);
    expect(modern.privacy_windows).toBeNull();
    expect(modern.privacy_window_polygons).toHaveLength(1);
  });

  it("add keeps existing regions (legacy windows folded into polygons), replace and clear drop them", () => {
    const config = {
      privacy_windows: [{ x: 5000, y: 5000, w: 1000, h: 1000 }],
      privacy_window_polygons: [{ coordinates: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.1, y: 0.1 }] }],
    };
    expect(buildPrivacyRegionUpdate("add", [UPPER_LEFT], config, true).privacy_window_polygons).toHaveLength(3);
    expect(buildPrivacyRegionUpdate("replace", [UPPER_LEFT], config, true).privacy_window_polygons).toHaveLength(1);
    expect(buildPrivacyRegionUpdate("clear", [], config, true).privacy_window_polygons).toEqual([]);
    expect(buildPrivacyRegionUpdate("add", [UPPER_LEFT], config, false).privacy_windows).toHaveLength(2);
  });
});

describe("privacy-region geometry — arbitrary polygons", () => {
  it("round-trips a slanted polygon through a 90° rotation vertex by vertex", () => {
    const config = { rotation: 90, privacy_window_polygons: [toServerPolygon(SLANTED, { rotation: 90 })] };
    const [described] = describePrivacyRegions(config, true);
    expect(described.shape).toBe("polygon");
    expect(described.points).toEqual(SLANTED.points);
  });

  it("accepts triangles and many-sided shapes on polygon firmware", () => {
    const triangle = {
      points: [
        { xPercent: 50, yPercent: 0 },
        { xPercent: 100, yPercent: 100 },
        { xPercent: 0, yPercent: 100 },
      ],
    };
    const hexagon = {
      points: [0, 60, 120, 180, 240, 300].map(deg => ({
        xPercent: 50 + 20 * Math.cos((deg * Math.PI) / 180),
        yPercent: 50 + 20 * Math.sin((deg * Math.PI) / 180),
      })),
    };
    expect(validatePrivacyShapes([triangle, hexagon, SLANTED, UPPER_LEFT], { polygons: true })).toBeNull();
  });

  it("rejects a bow-tie (self-intersecting) outline, like the Console editor", () => {
    const bowTie = {
      points: [
        { xPercent: 0, yPercent: 0 },
        { xPercent: 50, yPercent: 50 },
        { xPercent: 50, yPercent: 0 },
        { xPercent: 0, yPercent: 50 },
      ],
    };
    expect(isSelfIntersecting(bowTie.points.map(p => ({ x: p.xPercent, y: p.yPercent })))).toBe(true);
    expect(validatePrivacyShapes([bowTie], { polygons: true })).toContain("self-intersecting");
  });

  it("rejects collinear points (zero area)", () => {
    const line = {
      points: [
        { xPercent: 0, yPercent: 0 },
        { xPercent: 50, yPercent: 50 },
        { xPercent: 100, yPercent: 100 },
      ],
    };
    expect(validatePrivacyShapes([line], { polygons: true })).toContain("no area");
  });

  it("allows only axis-aligned rectangles on window-only firmware", () => {
    expect(validatePrivacyShapes([SLANTED], { polygons: false })).toContain("only supports rectangular");
    const rectAsPoints = {
      points: [
        { xPercent: 0, yPercent: 0 },
        { xPercent: 25, yPercent: 0 },
        { xPercent: 25, yPercent: 50 },
        { xPercent: 0, yPercent: 50 },
      ],
    };
    expect(validatePrivacyShapes([rectAsPoints, UPPER_LEFT], { polygons: false })).toBeNull();
    expect(buildPrivacyRegionUpdate("add", [rectAsPoints], {}, false).privacy_windows).toEqual([
      { x: 0, y: 0, w: 2500, h: 5000 },
    ]);
  });

  it("caps coverage at 40% per region on R1/R2, and only there", () => {
    const big = { leftPercent: 0, topPercent: 0, widthPercent: 80, heightPercent: 60 };
    expect(validatePrivacyShapes([big], { polygons: true, hwVariation: "CAMERA_R2" })).toContain("less than 40%");
    expect(validatePrivacyShapes([big], { polygons: true, hwVariation: "CAMERA_R400" })).toBeNull();
  });
});

describe("update-tool — privacy regions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The 2026-09-25 prod report: the model put privacy_windows in
  // cameraVideoSettings, zod stripped the unknown key, and the tool sent
  // `videoFacetSettings: { v0: {} }` — api2 said success and wrote an audit
  // entry, and no region appeared.
  it("rejects privacy fields inside cameraVideoSettings instead of sending an empty update", async () => {
    const result = await callUpdateTool(
      args({
        cameraVideoSettings: JSON.stringify({
          privacy_windows: [{ x: 0, y: 0, width: 25, height: 50 }],
        }),
      })
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain("privacy_windows");
    expect(text).toContain("privacyRegions");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("rejects any unknown settings key rather than silently dropping it", async () => {
    const result = await callUpdateTool(
      args({ cameraVideoSettings: JSON.stringify({ img_sharpness: 6, night_vision: true }) })
    );
    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("night_vision");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("refuses an update with no settings in it", async () => {
    const result = await callUpdateTool(args({ cameraVideoSettings: "{}" }));
    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("nothing was changed");
    expect(sentUpdates()).toHaveLength(0);
  });

  it("writes a rotated polygon on polygon firmware and verifies it by reading the config back", async () => {
    mockCameraApi({ facet: { rotation: 270, privacy_windows: [] } });

    const result = await callUpdateTool(
      args({ privacyRegions: JSON.stringify({ mode: "add", regions: [UPPER_LEFT] }) })
    );

    expect(result.isError).toBeFalsy();
    const [update] = sentUpdates();
    const v0 = update.body.configUpdate.videoFacetSettings.v0;
    expect(v0.privacy_windows).toBeNull();
    expect(v0.privacy_window_polygons).toHaveLength(1);
    expect(v0.privacy_window_polygons[0].coordinates[0]).toEqual({ x: 1, y: 0 });

    const text = textOf(result);
    expect(text).toContain("verified");
    expect(text).toContain("rectangle: left 0%, top 0%, width 25%, height 50%");
    expect((result.structuredContent as any).privacyRegions).toEqual([UPPER_LEFT_DESCRIPTION]);
  });

  it("writes permyriad windows on older firmware", async () => {
    mockCameraApi({ facet: { rotation: 0 }, firmwareVersion: "2024_0101_0000_abcdef" });

    const result = await callUpdateTool(
      args({ privacyRegions: JSON.stringify({ mode: "add", regions: [UPPER_LEFT] }) })
    );

    expect(result.isError).toBeFalsy();
    const v0 = sentUpdates()[0].body.configUpdate.videoFacetSettings.v0;
    expect(v0).toEqual({ privacy_window_polygons: null, privacy_windows: [{ x: 0, y: 0, w: 2500, h: 5000 }] });
  });

  it("writes an arbitrary polygon vertex by vertex and reports it back", async () => {
    mockCameraApi({ facet: { rotation: 0, privacy_windows: [] } });

    const result = await callUpdateTool(
      args({ privacyRegions: JSON.stringify({ mode: "add", regions: [SLANTED] }) })
    );

    expect(result.isError).toBeFalsy();
    const v0 = sentUpdates()[0].body.configUpdate.videoFacetSettings.v0;
    expect(v0.privacy_windows).toBeNull();
    expect(v0.privacy_window_polygons).toEqual([
      {
        coordinates: [
          { x: 0.1, y: 0.05 },
          { x: 0.4, y: 0.15 },
          { x: 0.35, y: 0.6 },
          { x: 0.05, y: 0.5 },
        ],
      },
    ]);
    const text = textOf(result);
    expect(text).toContain("polygon, 4 points");
    expect(text).toContain("(40%, 15%)");
    expect((result.structuredContent as any).privacyRegions[0].points).toEqual(SLANTED.points);
  });

  it("refuses a polygon on window-only firmware without calling updateFacetedConfig", async () => {
    mockCameraApi({ facet: { rotation: 0 }, firmwareVersion: "2024_0101_0000_abcdef" });

    const result = await callUpdateTool(
      args({ privacyRegions: JSON.stringify({ mode: "add", regions: [SLANTED] }) })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("only supports rectangular");
    expect(sentUpdates()).toHaveLength(0);
  });

  it("enforces the R1/R2 coverage cap using the camera's hardware variation", async () => {
    mockCameraApi({ facet: { rotation: 0 }, hwVariation: "CAMERA_R1" });

    const result = await callUpdateTool(
      args({
        privacyRegions: JSON.stringify({
          mode: "add",
          regions: [{ leftPercent: 0, topPercent: 0, widthPercent: 100, heightPercent: 50 }],
        }),
      })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("less than 40%");
    expect(sentUpdates()).toHaveLength(0);
  });

  it("rejects a polygon with fewer than 3 points before any API call", async () => {
    const result = await callUpdateTool(
      args({
        privacyRegions: JSON.stringify({
          mode: "add",
          regions: [{ points: [{ xPercent: 0, yPercent: 0 }, { xPercent: 10, yPercent: 10 }] }],
        }),
      })
    );
    expect(result.isError).toBe(true);
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("reports failure when the API accepts the write but the region is not stored", async () => {
    mockCameraApi({ facet: { rotation: 0, privacy_windows: [] }, applyWrites: false });

    const result = await callUpdateTool(
      args({ privacyRegions: JSON.stringify({ mode: "add", regions: [UPPER_LEFT] }) })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("did not take effect");
  });

  it("validates the rectangle before calling the API", async () => {
    const result = await callUpdateTool(
      args({
        privacyRegions: JSON.stringify({
          mode: "add",
          regions: [{ leftPercent: 80, topPercent: 0, widthPercent: 40, heightPercent: 10 }],
        }),
      })
    );
    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("fit inside the image");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("refuses privacy regions on doorbell cameras", async () => {
    const result = await callUpdateTool(
      args({
        entityType: "doorbell-camera",
        privacyRegions: JSON.stringify({ mode: "add", regions: [UPPER_LEFT] }),
      })
    );
    expect(result.isError).toBe(true);
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });
});
