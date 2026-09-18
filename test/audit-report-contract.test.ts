import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { expect, it, vi } from "vitest";
import { createFilteringProxy } from "../src/filtering-utils.js";
import * as network from "../src/network/network.js";
import { createTool } from "../src/tools-console/report-tool.js";
import { TOOL_ARGS } from "../src/types/report-tool-types.js";

vi.mock("../src/network/network.js", async (original) => ({
  ...(await original<typeof network>()),
  postApi: vi.fn(),
}));
const populated = [
  { timestamp: "2026-09-18T20:00:00Z", action: "WEB_LOGIN", principalName: "Test User" },
];

async function callAudit(overrides: Record<string, unknown> = {}) {
  const server = new McpServer({ name: "audit-contract", version: "1" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "audit-contract", version: "1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    // listTools installs the SDK client's JSON-schema output validator, just as in production.
    await client.listTools();
    const args = Object.fromEntries(Object.keys(TOOL_ARGS.shape).map((key) => [key, null]));
    return await client.callTool({
      name: "report-tool",
      arguments: {
        ...args,
        requestType: "get-audit-feed",
        auditFeedRequest: { startTime: "2026-09-11T07:00:00Z", endTime: "2026-09-18T20:33:00Z" },
        includeFields: null,
        filterBy: null,
        groupBy: null,
        ...overrides,
      },
    });
  } finally {
    await client.close();
    await server.close();
  }
}

it("sends the exact typed date contract and returns raw audit rows", async () => {
  vi.mocked(network.postApi).mockResolvedValue({ auditEvents: populated } as never);
  const result = await callAudit();
  expect(result.structuredContent).toHaveProperty("auditFeedReport.auditEvents", populated);
  expect(vi.mocked(network.postApi).mock.calls.at(-1)?.[0]).toMatchObject({
    route: "/report/getAuditFeed",
    body: { timestampMsAfter: 1789110000000, timestampMsBefore: 1789763580000 },
  });
  expect(vi.mocked(network.postApi).mock.calls.at(-1)?.[0].body).not.toHaveProperty("startTimeMs");
});

it("groups nested audit rows and retains counts through field projection", async () => {
  vi.mocked(network.postApi).mockResolvedValue({
    auditEvents: [...populated, ...populated],
  } as never);
  const result = await callAudit({
    groupBy: "auditFeedReport.auditEvents.action",
    includeFields: ["auditFeedReport.auditEvents.action"],
  });
  expect(result.structuredContent).toEqual({
    auditFeedReport: { auditEventsGrouped: { by: "action", total: 2, groups: { WEB_LOGIN: 2 } } },
  });
});

it("returns an explicit zero for a successfully retrieved empty period", async () => {
  vi.mocked(network.postApi).mockResolvedValue({ auditEvents: [] } as never);
  const result = await callAudit({ groupBy: "auditFeedReport.auditEvents.action" });
  expect(result.structuredContent).toEqual({
    auditFeedReport: { auditEventsGrouped: { by: "action", total: 0, groups: {} } },
  });
});

it("preserves rows and warnings when a grouping field is unsupported", async () => {
  vi.mocked(network.postApi).mockResolvedValue({ auditEvents: populated } as never);
  const result = await callAudit({ groupBy: "auditFeedReport.auditEvents.missing" });
  expect(result.structuredContent).toHaveProperty("auditFeedReport.auditEvents", populated);
  expect(result.structuredContent).toHaveProperty("auditFeedReport.groupByWarnings");
});

it("preserves root-level grouping warnings instead of failing client validation", async () => {
  vi.mocked(network.postApi).mockResolvedValue({ auditEvents: populated } as never);
  const result = await callAudit({ groupBy: "unknown.action" });
  expect(result.structuredContent).toHaveProperty("groupByWarnings");
  expect(result.structuredContent).toHaveProperty("auditFeedReport.auditEvents", populated);
});

it("keeps upstream retrieval errors distinct from a successful empty response", async () => {
  vi.mocked(network.postApi).mockResolvedValue({ error: true, errorMsg: "unavailable" } as never);
  const result = await callAudit({
    groupBy: "auditFeedReport.auditEvents.action",
    includeFields: ["auditFeedReport.auditEvents.action"],
  });
  expect(result.structuredContent).toHaveProperty("auditFeedReport.error", true);
  expect(result.structuredContent).toHaveProperty("auditFeedReport.errorMsg", "unavailable");
});
