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
 * Serves a faceted config that remembers what updateFacetedConfig wrote, so the
 * tool's read-back verification sees the change it made.
 */
function mockCameraApi() {
  const stored: Record<string, unknown> = {
    img_brightness: 0,
    ir_filter_mode: "AUTO",
    ir_leds_mode: "AUTO",
  };
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route, body } = call as { route: string; body: any };
    switch (route) {
      case "/camera/getMinimalCameraStateList":
        return { cameraStates: [{ uuid: CAMERA_UUID, name: "Driveway" }] } as never;
      case "/camera/getFacetedConfig":
        return { config: { videoFacetSettings: { v0: { ...stored } } } } as never;
      case "/camera/updateFacetedConfig": {
        const update = Object.values(body?.configUpdate?.videoFacetSettings ?? {})[0] as
          Record<string, unknown> | undefined;
        Object.assign(stored, update ?? {});
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

  // A camera that is black or black-and-white at night is usually one whose IR
  // filter and illuminators are OFF; the tool could describe that but not fix it.
  it("writes ir_filter_mode and ir_leds_mode through the video facet", async () => {
    mockCameraApi();

    const result = await callUpdateTool(
      args({ cameraVideoSettings: JSON.stringify({ ir_filter_mode: "OFF", ir_leds_mode: "ON" }) })
    );

    expect(result.isError).toBeFalsy();
    const writes = callsTo("/camera/updateFacetedConfig").map(call => call.body);
    expect(writes).toHaveLength(1);
    const written = Object.values(writes[0].configUpdate.videoFacetSettings)[0] as Record<
      string,
      unknown
    >;
    expect(written).toMatchObject({ ir_filter_mode: "OFF", ir_leds_mode: "ON" });
    const structured = result.structuredContent as { success?: boolean; message?: string };
    expect(structured.success).toBe(true);
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
