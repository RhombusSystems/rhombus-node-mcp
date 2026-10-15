import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/faces-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => ({
  ...(await importOriginal<typeof network>()),
  postApi: vi.fn(),
}));

const LOCATION = "xrNOliv7T4WVovIR7FvPjQ";
const PERSON = "lhhPp3i7TTG2SSeKWm9IOw";
const searchFilter = {
  faceNameContains: null,
  faceNames: ["John Anderson"],
  hasEmbedding: null,
  hasName: true,
  labels: [],
  locationUuids: [LOCATION],
  personUuids: [],
  timestampFilter: {
    rangeStart: "2026-09-17T00:00:00-07:00",
    rangeEnd: "2026-09-18T00:00:00-07:00",
  },
};

function args(overrides: Record<string, unknown>) {
  return {
    requestType: "get-face-events",
    timeZone: "America/Los_Angeles",
    faceEventUuid: null,
    personUuid: null,
    personName: null,
    personEmail: null,
    personLabel: null,
    faceId: null,
    confirmDelete: null,
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

// Use real MCP validation and projection; handler-only tests miss this incident.
async function callFaces(overrides: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await client.callTool({ name: "faces-tool", arguments: args(overrides) });
  } finally {
    await client.close();
    await server.close();
  }
}

describe("faces-tool input validation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(network.postApi).mockImplementation(async ({ route }) => {
      if (route === "/faceRecognition/person/findPeopleByOrg") {
        return { people: [{ name: "John Anderson", uuid: PERSON }] } as never;
      }
      if (route === "/faceRecognition/person/findPersonLabelsByOrg") {
        return { labelsByPerson: {} } as never;
      }
      if (route === "/faceRecognition/faceEvent/findFaceEventsByOrg") {
        return {
          faceEvents: [
            {
              faceName: "John Anderson",
              personUuid: PERSON,
              locationUuid: LOCATION,
              eventTimestamp: 1789662000000,
            },
          ],
          lastEvaluatedKey: "next-page",
        } as never;
      }
      throw new Error(`Unexpected route: ${route}`);
    });
  });

  it.each([null, undefined])("lists registered people without event filters (%s)", async filter => {
    const result = await callFaces({
      requestType: "get-registered-faces",
      faceEventFilter: filter,
      searchFilter: null,
      includeFields: ["getSavedFacesResponse.uuid", "getSavedFacesResponse.name"],
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toMatchObject({
      getSavedFacesResponse: [{ name: "John Anderson", uuid: PERSON }],
    });
    expect(network.postApi).not.toHaveBeenCalledWith(
      expect.objectContaining({ route: "/faceRecognition/faceEvent/findFaceEventsByOrg" })
    );
  });

  it.each(["nested", "top-level"])(
    "preserves all filters and pagination with a %s searchFilter",
    async placement => {
      const filter = structuredClone(searchFilter);
      const faceEventFilter = {
        pageRequest: { lastEvaluatedKey: "previous-page", maxPageSize: 200 },
        ...(placement === "nested" ? { searchFilter: filter } : {}),
      };
      const result = await callFaces({
        faceEventFilter,
        ...(placement === "top-level" ? { searchFilter: filter } : { searchFilter: null }),
        includeFields: ["faceEventSummary", "getFaceEventsResponse.faceName", "lastEvaluatedKey"],
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toMatchObject({
        faceEventSummary: {
          identifiedPeople: [{ name: "John Anderson", eventCount: 1 }],
          morePagesAvailable: true,
        },
        lastEvaluatedKey: "next-page",
      });
      expect(network.postApi).toHaveBeenCalledWith(
        expect.objectContaining({
          route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
          body: {
            pageRequest: { lastEvaluatedKey: "previous-page", maxPageSize: 200 },
            searchFilter: {
              faceNames: ["John Anderson"],
              hasName: true,
              locationUuids: [LOCATION],
              personUuids: [PERSON],
              timestampFilter: searchFilter.timestampFilter,
            },
          },
        })
      );
    }
  );

  it("accepts identical nested and top-level filters", async () => {
    const result = await callFaces({
      faceEventFilter: { searchFilter },
      searchFilter: structuredClone(searchFilter),
    });
    expect(result.isError).not.toBe(true);
  });

  it("rejects conflicting filters without searching or dropping constraints", async () => {
    const result = await callFaces({
      faceEventFilter: { searchFilter },
      searchFilter: { ...searchFilter, locationUuids: [] },
      includeFields: ["faceEventSummary"],
    });
    expect(result.isError).toBe(true);
    expect(result.structuredContent).toMatchObject({
      error: expect.stringContaining("Conflicting"),
    });
    expect(network.postApi).not.toHaveBeenCalled();
  });

  it.each([null, undefined, {}, { pageRequest: null }])(
    "rejects missing event search criteria (%j)",
    async filter => {
      const result = await callFaces({ faceEventFilter: filter, searchFilter: null });
      expect(result.isError).toBe(true);
      expect(result.structuredContent).toMatchObject({
        error: expect.stringContaining("No search was performed"),
      });
      expect(network.postApi).not.toHaveBeenCalled();
    }
  );

  it("preserves explicitly unfiltered legacy searches", async () => {
    const result = await callFaces({ faceEventFilter: { pageRequest: null, searchFilter: null } });
    expect(result.isError).not.toBe(true);
    expect(network.postApi).toHaveBeenCalledWith(
      expect.objectContaining({
        route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
        body: {},
      })
    );
  });

  it("still validates filters instead of accepting malformed dates", async () => {
    const result = await callFaces({
      faceEventFilter: { pageRequest: null },
      searchFilter: { ...searchFilter, timestampFilter: { rangeStart: "today", rangeEnd: null } },
    });
    expect(result.isError).toBe(true);
    expect(network.postApi).not.toHaveBeenCalled();
  });

  // Vector Tooling, 2026-10-15: "has jeremy merritt been seen today" → the lower-case
  // name found nothing because the server matched case-sensitively. The server fix
  // (face-recognition 3.0.87) is case-insensitive and takes an opt-in fuzzyNameMatch;
  // the chatbot sets that flag, and until this schema carried it the flag was stripped.
  it("passes fuzzyNameMatch through to the face-event search", async () => {
    const result = await callFaces({
      faceEventFilter: {
        pageRequest: null,
        searchFilter: {
          ...searchFilter,
          faceNames: null,
          faceNameContains: "jeremy meritt",
          fuzzyNameMatch: true,
        },
      },
    });
    expect(result.isError).not.toBe(true);
    expect(network.postApi).toHaveBeenCalledWith(
      expect.objectContaining({
        route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
        body: expect.objectContaining({
          searchFilter: expect.objectContaining({
            faceNameContains: "jeremy meritt",
            fuzzyNameMatch: true,
          }),
        }),
      })
    );
  });

  it("omits a null fuzzyNameMatch from the request", async () => {
    const result = await callFaces({
      faceEventFilter: {
        pageRequest: null,
        searchFilter: { ...searchFilter, fuzzyNameMatch: null },
      },
    });
    expect(result.isError).not.toBe(true);
    const call = vi
      .mocked(network.postApi)
      .mock.calls.map(([request]) => request)
      .find(request => request.route === "/faceRecognition/faceEvent/findFaceEventsByOrg");
    expect(call).toBeDefined();
    expect((call?.body as { searchFilter: Record<string, unknown> }).searchFilter).not.toHaveProperty(
      "fuzzyNameMatch"
    );
  });
});
