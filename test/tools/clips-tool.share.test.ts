import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/clips-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const CLIP_UUID = "aB3dE5fG7hI9jK1lM3nO5p";
const SHARE_URL = "https://share.example.test/clips/abc123";

async function callClipsTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await client.callTool({ name: "clips-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function args(overrides: Record<string, unknown>) {
  return {
    requestType: "shareClip",
    deviceUuidFilters: null,
    locationUuidFilters: null,
    searchFilter: null,
    timestampISOAfter: null,
    timestampISOBefore: null,
    clipUuid: CLIP_UUID,
    clipTitle: null,
    clipDescription: null,
    shareExpirationHours: null,
    sharePassword: null,
    spliceRequest: null,
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

function callsTo(route: string) {
  return vi
    .mocked(network.postApi)
    .mock.calls.map(([call]) => call as { route: string; body: any })
    .filter(call => call.route === route);
}

function mockClipApi() {
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route, body } = call as { route: string; body: any };
    switch (route) {
      case "/event/getSavedClipDetails":
        return (
          body.clipUuid === CLIP_UUID
            ? { savedClip: { uuid: CLIP_UUID, title: "Bronco Leaving the House" } }
            : { savedClip: undefined }
        ) as never;
      case "/event/createSharedClipGroupV3":
        return { error: false, shareUrl: SHARE_URL, uuid: "group-1" } as never;
      default:
        throw new Error(`unexpected route ${route}`);
    }
  });
}

describe("clips-tool — shareClip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an open share link titled after the clip and returns the URL", async () => {
    mockClipApi();

    const result = await callClipsTool(args({}));

    expect(result.isError).toBeFalsy();
    const writes = callsTo("/event/createSharedClipGroupV3").map(call => call.body);
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      title: "Bronco Leaving the House",
      uuids: [{ eventUuid: CLIP_UUID }],
    });
    expect(writes[0].plaintextPassword).toBeUndefined();
    expect(writes[0].expirationTimeSecs).toBeUndefined();
    const structured = result.structuredContent as {
      shareResult?: { shareUrl?: string; passwordProtected?: boolean };
      note?: string;
    };
    expect(structured.shareResult?.shareUrl).toBe(SHARE_URL);
    expect(structured.shareResult?.passwordProtected).toBe(false);
    expect(structured.note).toContain("without a Rhombus login");
  });

  it("passes a password and turns an expiry in hours into an absolute time", async () => {
    mockClipApi();
    const before = Math.floor(Date.now() / 1000);

    const result = await callClipsTool(
      args({ sharePassword: "letmein", shareExpirationHours: 48, clipTitle: "Front door, Friday" })
    );

    const [write] = callsTo("/event/createSharedClipGroupV3").map(call => call.body);
    expect(write.plaintextPassword).toBe("letmein");
    expect(write.title).toBe("Front door, Friday");
    expect(write.expirationTimeSecs).toBeGreaterThanOrEqual(before + 48 * 3600);
    expect(write.expirationTimeSecs).toBeLessThanOrEqual(before + 48 * 3600 + 5);
    const structured = result.structuredContent as {
      shareResult?: { passwordProtected?: boolean; expiresAtMs?: number };
    };
    expect(structured.shareResult?.passwordProtected).toBe(true);
    expect(structured.shareResult?.expiresAtMs).toBe(write.expirationTimeSecs * 1000);
  });

  it("refuses to share a uuid that is not a saved clip and creates nothing", async () => {
    mockClipApi();

    const result = await callClipsTool(args({ clipUuid: "zZ9yX8wV7uT6sR5qP4oN3m" }));

    expect(callsTo("/event/createSharedClipGroupV3")).toHaveLength(0);
    expect(JSON.stringify(result.structuredContent)).toContain("No saved clip has the uuid");
  });
});
