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
 * Serves a config that remembers what updateFacetedConfig wrote, so the tool's
 * read-back verification sees the change. `appliesInfrared: false` models a
 * camera without infrared controls: the API answers success and stores nothing.
 */
function mockCameraApi({ appliesInfrared = true }: { appliesInfrared?: boolean } = {}) {
  const facet: Record<string, unknown> = { img_brightness: 0 };
  const infrared: Record<string, unknown> = {};
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route, body } = call as { route: string; body: any };
    switch (route) {
      case "/camera/getMinimalCameraStateList":
        return { cameraStates: [{ uuid: CAMERA_UUID, name: "Driveway" }] } as never;
      case "/camera/getFacetedConfig":
        return {
          config: {
            videoFacetSettings: { v0: { ...facet } },
            deviceVideoSettings: { ...infrared },
          },
        } as never;
      case "/camera/updateFacetedConfig": {
        const facetUpdate = Object.values(body?.configUpdate?.videoFacetSettings ?? {})[0] as
          | Record<string, unknown>
          | undefined;
        Object.assign(facet, facetUpdate ?? {});
        if (appliesInfrared) Object.assign(infrared, body?.configUpdate?.deviceVideoSettings ?? {});
        return { error: false } as never;
      }
      case "/camera/getDetails":
      case "/camera/getDetailsV2":
      case "/org/getOrgV2":
        return {} as never;
      default:
        throw new Error(`unexpected route ${route}`);
    }
  });
}

describe("update-tool — infrared filter and IR LEDs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The API keeps infrared settings on the device (configUpdate.deviceVideoSettings);
  // under the per-facet block it ignores them and still answers success.
  it("sends infrared through deviceVideoSettings and the rest through the video facet", async () => {
    mockCameraApi();

    const result = await callUpdateTool(
      args({
        cameraVideoSettings: JSON.stringify({
          ir_filter_mode: "OFF",
          ir_leds_mode: "ON",
          img_brightness: 20,
        }),
      })
    );

    expect(result.isError).toBeFalsy();
    const writes = callsTo("/camera/updateFacetedConfig").map(call => call.body);
    expect(writes).toHaveLength(1);
    expect(writes[0].configUpdate.deviceVideoSettings).toEqual({
      ir_filter_mode: "OFF",
      ir_leds_mode: "ON",
    });
    expect(writes[0].configUpdate.videoFacetSettings).toEqual({ v0: { img_brightness: 20 } });
    const structured = result.structuredContent as { success?: boolean; message?: string };
    expect(structured.success).toBe(true);
    expect(structured.message).toContain("Infrared (verified by reading the camera config back)");
    expect(structured.message).toContain("IR LEDs ON");
  });

  // A third-party camera accepted the write and changed nothing; the tool used
  // to report that as "updated successfully".
  it("reports an error when the read-back shows the infrared settings unchanged", async () => {
    mockCameraApi({ appliesInfrared: false });

    const result = await callUpdateTool(
      args({ cameraVideoSettings: JSON.stringify({ ir_leds_mode: "OFF" }) })
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain("ir_leds_mode is still AUTO (requested OFF)");
    expect(text).toContain("may not have infrared controls");
  });

  it("refuses infrared settings on a doorbell camera without calling the API", async () => {
    mockCameraApi();

    const result = await callUpdateTool(
      args({
        entityType: "doorbell-camera",
        cameraVideoSettings: JSON.stringify({ ir_leds_mode: "OFF" }),
      })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("Doorbell cameras do not expose infrared settings");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("rejects an unknown IR mode, naming the field, and writes nothing", async () => {
    mockCameraApi();

    const result = await callUpdateTool(
      args({ cameraVideoSettings: JSON.stringify({ ir_filter_mode: "NIGHT" }) })
    );

    expect(callsTo("/camera/updateFacetedConfig")).toHaveLength(0);
    const text = `${textOf(result)} ${JSON.stringify(result.structuredContent)}`;
    expect(text).toContain("ir_filter_mode");
  });
});
