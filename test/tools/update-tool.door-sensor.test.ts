import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/update-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const SENSOR_UUID = "sensorUu1dS9y2hZpVvGkA";

function withNulledArgs(overrides: Record<string, unknown> = {}) {
  return {
    entityType: "door-sensor",
    entityUuid: SENSOR_UUID,
    cameraVideoSettings: null,
    cameraAudioSettings: null,
    cameraDeviceSettings: null,
    doorSensorSettings: null,
    step: null,
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

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

function textOf(result: Awaited<ReturnType<typeof callUpdateTool>>): string {
  return (result.content as { text: string }[]).map(item => item.text).join("\n");
}

/**
 * Serves /deviceconfig like the API: updateFacetedConfig changes what the next
 * getFacetedConfig returns, unless `ignoreWrites` simulates a silent no-op.
 */
function mockSensor(
  initial: { ajar_threshold_enabled?: boolean; ajar_threshold_sec?: number },
  opts: { ignoreWrites?: boolean } = {}
) {
  let stored = { ...initial };
  vi.mocked(network.postApi).mockImplementation((async ({
    route,
    body,
  }: {
    route: string;
    body: { configUpdate?: { doorSensorSettings?: typeof initial } };
  }) => {
    switch (route) {
      case "/door/getMinimalDoorStateList":
        return { doorStates: [{ sensorUuid: SENSOR_UUID, name: "Back Door Left" }] };
      case "/deviceconfig/getFacetedConfig":
        return { config: { doorSensorSettings: stored } };
      case "/deviceconfig/updateFacetedConfig":
        if (!opts.ignoreWrites) stored = { ...stored, ...body.configUpdate?.doorSensorSettings };
        return {};
      default:
        throw new Error(`unexpected route ${route}`);
    }
  }) as never);
}

function updateBodies() {
  return vi
    .mocked(network.postApi)
    .mock.calls.filter(call => call[0].route === "/deviceconfig/updateFacetedConfig")
    .map(call => call[0].body);
}

describe("update-tool door-sensor ajar threshold", () => {
  beforeEach(() => {
    vi.mocked(network.postApi).mockReset();
  });

  it("reads the current delay when no settings are passed", async () => {
    mockSensor({ ajar_threshold_enabled: false, ajar_threshold_sec: 15 });

    const result = await callUpdateTool(withNulledArgs());

    expect(result.isError).toBeFalsy();
    // A disabled threshold means the sensor falls back to 30 seconds.
    expect(textOf(result)).toContain("after 30 seconds");
    expect(updateBodies()).toHaveLength(0);
  });

  it("sends the Console's request, enables the threshold, and verifies by reading back", async () => {
    mockSensor({ ajar_threshold_enabled: false });

    const result = await callUpdateTool(
      withNulledArgs({ doorSensorSettings: '{"ajar_threshold_sec": 15}' })
    );

    expect(result.isError).toBeFalsy();
    expect(updateBodies()).toEqual([
      {
        configUpdate: {
          deviceUuid: SENSOR_UUID,
          doorSensorSettings: { ajar_threshold_enabled: true, ajar_threshold_sec: 15 },
        },
      },
    ]);
    expect(textOf(result)).toContain("now reports DOOR_AJAR after 15 seconds open (was 30)");
  });

  it("reports a write the read-back does not show", async () => {
    mockSensor({ ajar_threshold_enabled: false }, { ignoreWrites: true });

    const result = await callUpdateTool(
      withNulledArgs({
        doorSensorSettings: '{"ajar_threshold_enabled": true, "ajar_threshold_sec": 15}',
      })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("reading it back does not show it");
  });

  it.each([
    ['{"ajar_threshold_sec": 0}', "ajar_threshold_sec must be at least 1"],
    ['{"ajar_threshold_sec": 7.5}', "ajar_threshold_sec"],
    ['{"ajar_seconds": 15}', "unsupported field(s) ajar_seconds"],
    ["{}", "pass ajar_threshold_enabled and/or ajar_threshold_sec"],
  ])("rejects %s without writing", async (settings, message) => {
    mockSensor({ ajar_threshold_enabled: true, ajar_threshold_sec: 30 });

    const result = await callUpdateTool(withNulledArgs({ doorSensorSettings: settings }));

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain(message);
    expect(updateBodies()).toHaveLength(0);
  });

  it("refuses a uuid that is not one of the org's door sensors", async () => {
    mockSensor({});

    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: "notASensorS9y2hZpVvGkA",
        doorSensorSettings: '{"ajar_threshold_sec": 15}',
      })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("do not guess a uuid");
    expect(updateBodies()).toHaveLength(0);
  });
});
