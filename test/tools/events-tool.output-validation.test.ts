import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/events-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as eventsApi from "../../src/api/events-tool-api.js";

vi.mock("../../src/api/events-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof eventsApi>();
  return { ...actual, getBrivoAccessControlEvents: vi.fn() };
});

/**
 * events-tool's args are `.nullable()`, not `.optional()`, so every key has to be
 * present — same as the wire calls the model makes.
 */
function withNulledArgs(overrides: Record<string, unknown>) {
  return {
    eventType: null,
    // eventType/startTime/endTime/timeZone are the only non-nullable args.
    startTime: "2026-07-24T09:27:24.000-07:00",
    endTime: "2026-07-31T16:27:15.517Z",
    accessControlledDoorUuids: null,
    deviceUuid: null,
    sensorUuid: null,
    limit: null,
    locationUuid: null,
    componentEventTypes: null,
    timeZone: "America/Los_Angeles",
    cameraUuid: null,
    duration: null,
    buttonSensorUuid: null,
    occupancySensorUuid: null,
    proximityTagUuids: null,
    doorbellCameraUuid: null,
    tempUnit: "F",
    includeFields: null,
    filterBy: null,
    ...overrides,
  };
}

// Driven end-to-end through the real SDK, because the bug lived in the SDK's
// post-handler validation of structuredContent, not in our own code paths: the
// proxy projected `brivoDoorId` away and the SDK then rejected the result
// against the unrelaxed outputSchema with "MCP error -32602". A handler-level
// test cannot see this.
async function callEventsTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "events-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

const BRIVO_RESULT = {
  integrationEnabled: true,
  brivoDoorsConfigured: 2,
  brivoDoors: [
    { brivoDoorId: "11001", doorName: "Front Lobby", locationUuid: "loc-1" },
    { brivoDoorId: "11002", doorName: "Rear Dock", locationUuid: "loc-2" },
  ],
  events: [],
};

describe("events-tool — brivo-access-control output validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(eventsApi.getBrivoAccessControlEvents).mockResolvedValue(BRIVO_RESULT as never);
  });

  it("succeeds when includeFields omits the required brivoDoorId", async () => {
    const result = await callEventsTool(
      withNulledArgs({
        eventType: "brivo-access-control",
        // Verbatim from the prod transcript that produced
        // "Brivo data could not be read because of a system formatting error".
        includeFields: [
          "brivoAccessControlEvents.integrationEnabled",
          "brivoAccessControlEvents.brivoDoorsConfigured",
          "brivoAccessControlEvents.brivoDoors.doorName",
          "brivoAccessControlEvents.brivoDoors.locationUuid",
          "brivoAccessControlEvents.events.datetime",
          "brivoAccessControlEvents.events.user",
        ],
      })
    );

    expect(result.isError).toBeFalsy();
    const payload = JSON.parse((result.content as { text: string }[])[0].text);
    expect(payload.brivoAccessControlEvents.brivoDoors).toEqual([
      { doorName: "Front Lobby", locationUuid: "loc-1" },
      { doorName: "Rear Dock", locationUuid: "loc-2" },
    ]);
  });

  it("succeeds with no projection at all", async () => {
    const result = await callEventsTool(withNulledArgs({ eventType: "brivo-access-control" }));

    expect(result.isError).toBeFalsy();
    const payload = JSON.parse((result.content as { text: string }[])[0].text);
    expect(payload.brivoAccessControlEvents.brivoDoors[0].brivoDoorId).toBe("11001");
  });
});
