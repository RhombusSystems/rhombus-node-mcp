import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/update-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const CAMERA_UUID = "Qm3xV7cLTfWk2dHs9pRaZg";

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

function callsTo(route: string) {
  return vi
    .mocked(network.postApi)
    .mock.calls.map(([call]) => call as { route: string; body: any })
    .filter(call => call.route === route);
}

/**
 * Serves the camera list from a mutable name. `applyRename: false` models the
 * failure this guards against: the API answers the rename with success but the
 * stored name does not change.
 */
function mockCameraApi({
  name = "Loading Dock",
  applyRename = true,
  listFails = false,
}: {
  name?: string;
  applyRename?: boolean;
  listFails?: boolean;
}) {
  let stored = name;
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route, body } = call as { route: string; body: any };
    switch (route) {
      case "/camera/getMinimalCameraStateList":
        if (listFails) return { error: true, errorMsg: "service unavailable" } as never;
        return { cameraStates: [{ uuid: CAMERA_UUID, name: stored }] } as never;
      case "/camera/updateDetailsV2":
        if (applyRename) stored = body.name;
        return { error: false } as never;
      case "/camera/updateFacetedConfig":
        return { error: false } as never;
      case "/camera/getFacetedConfig":
        return { config: { videoFacetSettings: { v0: {} } } } as never;
      case "/camera/getDetails":
      case "/org/getOrgV2":
        return {} as never;
      default:
        throw new Error(`unexpected route ${route}`);
    }
  });
}

describe("update-tool — camera rename", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renames through updateDetailsV2 and reports the name read back", async () => {
    mockCameraApi({});

    const result = await callUpdateTool(
      args({ cameraDeviceSettings: JSON.stringify({ camera_name: "Loading Dock 2" }) })
    );

    expect(result.isError).toBeFalsy();
    expect(callsTo("/camera/updateDetailsV2").map(call => call.body)).toEqual([
      { uuid: CAMERA_UUID, name: "Loading Dock 2", nameUpdated: true },
    ]);
    // The faceted config has no name field — nothing goes there for a rename.
    expect(callsTo("/camera/updateFacetedConfig")).toHaveLength(0);
    const structured = result.structuredContent as { success?: boolean; message?: string };
    expect(structured.success).toBe(true);
    expect(structured.message).toContain("verified");
    expect(structured.message).toContain("Loading Dock 2");
  });

  // The write the API accepts and does not apply used to be reported as
  // "updated successfully".
  it("reports an error when the read-back still shows the old name", async () => {
    mockCameraApi({ applyRename: false });

    const result = await callUpdateTool(
      args({ cameraDeviceSettings: JSON.stringify({ camera_name: "Loading Dock 2" }) })
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain('still named "Loading Dock"');
    expect(text).toContain("Do not retry");
    expect(text).not.toContain("updated successfully");
  });

  it("does not claim the rename when the read-back fails", async () => {
    mockCameraApi({ listFails: true });

    const result = await callUpdateTool(
      args({ cameraDeviceSettings: JSON.stringify({ camera_name: "Loading Dock 2" }) })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("could not be confirmed");
  });

  it("applies video settings and the rename together", async () => {
    mockCameraApi({});

    const result = await callUpdateTool(
      args({
        entityUuid: `${CAMERA_UUID}.v0`,
        cameraVideoSettings: JSON.stringify({ img_sharpness: 8 }),
        cameraDeviceSettings: JSON.stringify({ camera_name: "Loading Dock 2" }),
      })
    );

    expect(result.isError).toBeFalsy();
    const [update] = callsTo("/camera/updateFacetedConfig");
    expect(update.body.configUpdate.videoFacetSettings).toEqual({ v0: { img_sharpness: 8 } });
    expect(update.body.configUpdate.deviceSettings).toBeUndefined();
    const text = textOf(result);
    expect(text).toContain("Sharpness: 8");
    expect(text).toContain("Loading Dock 2");
  });

  it("says which settings were applied when the rename itself fails", async () => {
    mockCameraApi({ applyRename: false });

    const result = await callUpdateTool(
      args({
        entityUuid: `${CAMERA_UUID}.v0`,
        cameraVideoSettings: JSON.stringify({ img_sharpness: 8 }),
        cameraDeviceSettings: JSON.stringify({ camera_name: "Loading Dock 2" }),
      })
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain("did not take effect");
    expect(text).toContain("WERE applied");
    expect(text).toContain("Sharpness: 8");
  });

  it("rejects an empty name without calling the API", async () => {
    const result = await callUpdateTool(
      args({ cameraDeviceSettings: JSON.stringify({ camera_name: "   " }) })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("cannot be empty");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  // Neither field exists in the camera's device config; the API used to drop
  // them and the tool reported success.
  it.each([
    [{ camera_timezone: "America/New_York" }, "camera_timezone"],
    [{ led_intensity: 40 }, "led_intensity"],
  ])("rejects %o before any write", async (settings, field) => {
    const result = await callUpdateTool(args({ cameraDeviceSettings: JSON.stringify(settings) }));

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain(field);
    expect(text).toContain("No settings were changed");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it.each([
    ["always_on", false],
    ["auto", false],
    ["always_off", true],
  ])("sends led_mode %s as led_stealth_mode %s", async (ledMode, stealth) => {
    mockCameraApi({});

    const result = await callUpdateTool(
      args({ cameraDeviceSettings: JSON.stringify({ led_mode: ledMode }) })
    );

    expect(result.isError).toBeFalsy();
    const [update] = callsTo("/camera/updateFacetedConfig");
    expect(update.body.configUpdate.deviceSettings).toEqual({ led_stealth_mode: stealth });
  });
});
