import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as locationsApi from "../../src/api/location-tool-api.js";
import { applyFilterBy, createFilteringProxy } from "../../src/filtering-utils.js";
import { createTool } from "../../src/tools-console/location-tool.js";

vi.mock("../../src/api/location-tool-api.js");

const HQ = { uuid: "hq", name: "Ice Blocks - Headquarters", timezone: "America/Los_Angeles" };
const OTHER = { uuid: "other", name: "1919 19th Street", timezone: "America/Los_Angeles" };

async function callLocations(overrides: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await client.callTool({
      name: "location-tool",
      arguments: {
        action: "get",
        locationUuid: null,
        locationName: null,
        locationAddress: null,
        postalCode: null,
        countryCode: null,
        timezoneId: null,
        label: null,
        confirmDelete: null,
        includeFields: ["locations.uuid", "locations.name", "locations.timezone"],
        filterBy: null,
        ...overrides,
      },
    });
  } finally {
    await client.close();
    await server.close();
  }
}

describe("location name search", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(locationsApi.getLocations).mockResolvedValue({
      locations: [HQ, OTHER],
      warningMsg: undefined,
    });
  });

  it.each(["iceblocks", "ICEBLOCKS", "ice-blocks", "ice_blocks", "Ice Blocks"])(
    "resolves %s through the original production filterBy path",
    async query => {
      const result = await callLocations({
        filterBy: [{ field: "name", op: "contains", value: query }],
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toMatchObject({ locations: [HQ] });
    }
  );

  it("also supports a locationName query directly", async () => {
    const result = await callLocations({ locationName: "iceblocks" });
    expect(result.structuredContent).toMatchObject({ locations: [HQ] });
  });

  it("handles qualified names and preserves other filter constraints", async () => {
    const result = await callLocations({
      filterBy: [
        { field: "locations.name", op: "contains", value: "iceblocks" },
        { field: "locations.timezone", op: "=", value: "UTC" },
      ],
    });
    expect(result.structuredContent).toMatchObject({ locations: [] });
  });

  it("keeps all matching candidates rather than picking an ambiguous location", async () => {
    const warehouse = { ...HQ, uuid: "warehouse", name: "Ice Blocks - Warehouse" };
    vi.mocked(locationsApi.getLocations).mockResolvedValue({
      locations: [HQ, warehouse, OTHER],
      warningMsg: undefined,
    });
    const result = await callLocations({ locationName: "iceblocks" });
    expect(result.structuredContent).toMatchObject({
      locations: [HQ, warehouse],
      note: expect.stringContaining("Multiple locations"),
    });
    const filtered = await callLocations({
      filterBy: [{ field: "name", op: "contains", value: "iceblocks" }],
    });
    expect(filtered.structuredContent).toMatchObject({ locations: [HQ, warehouse] });
  });

  it("keeps all locations when no name is supplied", async () => {
    const result = await callLocations({});
    expect(result.structuredContent).toMatchObject({ locations: [HQ, OTHER] });
  });

  it("does not misreport an unmatched name as an organization with no locations", async () => {
    const result = await callLocations({ locationName: "a different office", includeFields: null });
    expect(result.structuredContent).toMatchObject({
      locations: [],
      note: expect.stringContaining("No locations matched"),
    });
  });

  it("leaves exact name comparisons and identifier/plate substring comparisons unchanged", () => {
    const data = {
      items: [
        {
          name: "Ice Blocks - Headquarters",
          uuid: "ice-blocks",
          vehicleLicensePlate: "ICE-BLOCKS",
        },
      ],
    };
    for (const field of ["uuid", "vehicleLicensePlate"]) {
      expect(applyFilterBy(data, [{ field, op: "contains", value: "iceblocks" }]).items).toEqual(
        []
      );
    }
    expect(applyFilterBy(data, [{ field: "name", op: "=", value: "iceblocks" }]).items).toEqual([]);
    expect(applyFilterBy(data, [{ field: "name", op: "=", value: HQ.name }]).items).toHaveLength(1);
  });

  it("does not broaden punctuation-only or tiny queries after normalization", () => {
    const data = { items: [{ name: "Ice Blocks" }, { name: "A B" }] };
    for (const value of ["___", "ab"]) {
      expect(applyFilterBy(data, [{ field: "name", op: "contains", value }]).items).toEqual([]);
    }
  });
});
