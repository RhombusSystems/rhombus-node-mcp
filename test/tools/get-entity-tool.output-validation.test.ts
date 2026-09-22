import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools/get-entity-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as orgCache from "../../src/network/org-reference-cache.js";

vi.mock("../../src/network/org-reference-cache.js", async importOriginal => {
  const actual = await importOriginal<typeof orgCache>();
  return { ...actual, cachedPostApi: vi.fn() };
});

/**
 * The proxy-injected args (`includeFields`, `filterBy`, `groupBy`) are
 * `.nullable()`, so every key has to be present — same as the wire calls the
 * model makes.
 */
function withNulledArgs(overrides: Record<string, unknown>) {
  return {
    entityTypes: ["environmental-sensor"],
    detail: "core",
    timeZone: "America/Los_Angeles",
    tempUnit: "F",
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

// Driven end-to-end through the real SDK, because the failure lives in the
// SDK's post-handler validation of `structuredContent` against the registered
// outputSchema, not in our own code paths. A handler-level test cannot see it:
// the handler happily returns a number for a field the schema calls a string,
// and only the SDK turns that into `MCP error -32602: Output validation error`.
async function callGetEntityTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "get-entity-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

// Shape of /climate/getMinimalClimateStateList — the temperature arrives as
// `temperatureCelcius` (a number) and the api layer renames/converts it.
const CLIMATE_RESPONSE = {
  climateStates: [
    {
      uuid: "sensor-1",
      name: "Server Room",
      locationUuid: "loc-1",
      connectionStatus: "GREEN",
      temperatureCelcius: 22.5,
      humidity: 41,
      createdAtMillis: 1_754_000_000_000,
    },
    {
      uuid: "sensor-2",
      name: "Cold Storage",
      locationUuid: "loc-1",
      connectionStatus: "RED",
      temperatureCelcius: -3,
      humidity: 63,
      createdAtMillis: 1_754_000_000_000,
    },
  ],
};

describe("get-entity-tool — environmental sensor output validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(orgCache.cachedPostApi).mockResolvedValue(CLIMATE_RESPONSE as never);
  });

  it("does not fail output validation on the numeric temperature", async () => {
    const result = await callGetEntityTool(withNulledArgs({}));

    expect(result.isError).toBeFalsy();
    const payload = JSON.parse((result.content as { text: string }[])[0].text);
    // 22.5 C -> 72.5 F
    expect(payload.climateStates[0].temperature).toBe(72.5);
    expect(payload.climateStates[0].humidity).toBe(41);
    expect(payload.climateStatesCount).toBe(2);
  });

  it("stays valid in Celsius, at detail=full, and under a projection", async () => {
    const celsius = await callGetEntityTool(withNulledArgs({ tempUnit: "C" }));
    expect(celsius.isError).toBeFalsy();
    expect(
      JSON.parse((celsius.content as { text: string }[])[0].text).climateStates[0].temperature
    ).toBe(22.5);

    const full = await callGetEntityTool(withNulledArgs({ detail: "full" }));
    expect(full.isError).toBeFalsy();

    const projected = await callGetEntityTool(
      withNulledArgs({ includeFields: ["climateStates.name", "climateStates.temperature"] })
    );
    expect(projected.isError).toBeFalsy();
    // connected/connectionStatus ride along via PROTECTED_STATUS_FIELDS.
    expect(JSON.parse((projected.content as { text: string }[])[0].text).climateStates).toEqual([
      { name: "Server Room", temperature: 72.5, connected: true, connectionStatus: "GREEN" },
      { name: "Cold Storage", temperature: 26.6, connected: false, connectionStatus: "RED" },
    ]);
  });
});
