import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools/time-tool.js";
import * as locationApi from "../../src/api/location-tool-api.js";
import { DEFAULT_TIME_ZONE, resolveOrgTimeZone } from "../../src/utils/org-timezone.js";

vi.mock("../../src/api/location-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof locationApi>();
  return { ...actual, getLocations: vi.fn() };
});

async function callTimeTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(server);
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const result = await client.callTool({ name: "time-tool", arguments: args });
    return { result, payload: JSON.parse((result.content as { text: string }[])[0].text) };
  } finally {
    await client.close();
    await server.close();
  }
}

describe("resolveOrgTimeZone", () => {
  beforeEach(() => vi.clearAllMocks());

  it("picks the zone most locations share, ignoring locations without one", async () => {
    vi.mocked(locationApi.getLocations).mockResolvedValue({
      locations: [
        { uuid: "a", timezone: "Europe/London" },
        { uuid: "b", timezone: "Europe/London" },
        { uuid: "c", timezone: "America/Chicago" },
        { uuid: "d" },
      ],
    } as never);
    expect(await resolveOrgTimeZone()).toBe("Europe/London");
  });

  it("falls back to the default when the org has no location timezones or the lookup fails", async () => {
    vi.mocked(locationApi.getLocations).mockResolvedValue({ locations: [{ uuid: "a" }] } as never);
    expect(await resolveOrgTimeZone()).toBe(DEFAULT_TIME_ZONE);
    vi.mocked(locationApi.getLocations).mockRejectedValue(new Error("boom"));
    expect(await resolveOrgTimeZone()).toBe(DEFAULT_TIME_ZONE);
  });
});

describe("time-tool — null timezone means the organization's, not the server's", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resolves 'today' in the org's zone when timezone is null", async () => {
    vi.mocked(locationApi.getLocations).mockResolvedValue({
      locations: [{ uuid: "a", timezone: "Europe/London" }, { uuid: "b", timezone: "Europe/London" }],
    } as never);
    const { result, payload } = await callTimeTool({ time_description: "today", timezone: null });
    expect(result.isError).toBeFalsy();
    expect(payload.timezone).toBe("Europe/London");
  });

  it("an explicit timezone wins and locations are not consulted", async () => {
    const { payload } = await callTimeTool({ time_description: "today", timezone: "Asia/Tokyo" });
    expect(payload.timezone).toBe("Asia/Tokyo");
    expect(vi.mocked(locationApi.getLocations)).not.toHaveBeenCalled();
  });
});
