import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, expect, it, vi } from "vitest";
import { createFilteringProxy } from "../src/filtering-utils.js";
import * as network from "../src/network/network.js";
import { createTool, EMPTY_SUMMARY_LOOKBACK_DAYS } from "../src/tools-console/report-tool.js";
import { TOOL_ARGS } from "../src/types/report-tool-types.js";

vi.mock("../src/network/network.js", async (original) => ({
  ...(await original<typeof network>()),
  postApi: vi.fn(),
}));

const RANGE_START = "2026-10-13T14:00:00.000Z";
const RANGE_END = "2026-10-16T18:00:00.000Z";
const DAY_MS = 24 * 60 * 60 * 1000;

const bandwidthPoint = (dateLocal: string, upload: number) => ({
  dateLocal,
  dateUtc: dateLocal,
  type: "BANDWIDTH",
  eventCountMap: { bandwidthUploadCount: upload, bandwidthDownloadCount: upload / 100 },
});

async function callSummary(overrides: Record<string, unknown> = {}) {
  const server = new McpServer({ name: "summary-hint", version: "1" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "summary-hint", version: "1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    // listTools installs the SDK client's JSON-schema output validator, just as in production.
    await client.listTools();
    const args = Object.fromEntries(Object.keys(TOOL_ARGS.shape).map((key) => [key, null]));
    const result = await client.callTool({
      name: "report-tool",
      arguments: {
        ...args,
        requestType: "get-summary-count-report",
        summaryCountRequest: {
          interval: "HOURLY",
          uuid: null,
          scope: "ORG",
          types: ["BANDWIDTH"],
          rangeStart: RANGE_START,
          rangeEnd: RANGE_END,
          timeZone: "America/Chicago",
          ...overrides,
        },
        includeFields: null,
        filterBy: null,
        groupBy: null,
      },
    });
    expect(result.isError).toBeFalsy();
    const text = result.content.find((item) => item.type === "text");
    const parsed = text?.type === "text" ? JSON.parse(text.text) : undefined;
    // The summary branch's text content is the report itself; structuredContent wraps it.
    const structured = (result.structuredContent as { summaryCountReport: unknown }).summaryCountReport;
    expect(parsed).toEqual(structured);
    return parsed as {
      timeSeriesDataPoints: unknown[];
      hint?: string;
      lastRecordedDateUtc?: string;
    };
  } finally {
    await client.close();
    await server.close();
  }
}

beforeEach(() => {
  vi.mocked(network.postApi).mockReset();
});

it("names the last recorded day when the window is empty but earlier data exists", async () => {
  // The prod shape on 2026-10-16: nothing in the asked window, data through Oct 12.
  vi.mocked(network.postApi)
    .mockResolvedValueOnce({ error: false, timeSeriesDataPoints: [] } as never)
    .mockResolvedValueOnce({
      error: false,
      timeSeriesDataPoints: [
        bandwidthPoint("2026-10-11T00:00:00", 935_454_036_824),
        bandwidthPoint("2026-10-12T00:00:00", 506_389_225_696),
        { dateLocal: "2026-10-13T00:00:00", dateUtc: "2026-10-13T00:00:00", type: "BANDWIDTH", eventCountMap: { bandwidthUploadCount: 0 } },
      ],
    } as never);

  const report = await callSummary();

  expect(report.timeSeriesDataPoints).toEqual([]);
  expect(report.lastRecordedDateUtc).toBe("2026-10-12T00:00:00");
  expect(report.hint).toContain("No BANDWIDTH data was recorded for this org");
  expect(report.hint).toContain("no bandwidth data recorded since 2026-10-12");
  expect(report.hint).toContain("not as zero activity");
  expect(report.hint).toContain("not a feature that is off");

  const calls = vi.mocked(network.postApi).mock.calls.map(([request]) => request);
  expect(calls).toHaveLength(2);
  expect(calls[0]!.route).toBe("/report/getCountReportV2");
  const probe = calls[1]!.body as Record<string, unknown>;
  expect(calls[1]!.route).toBe("/report/getCountReportV2");
  expect(probe.interval).toBe("DAILY");
  expect(probe.types).toEqual(["BANDWIDTH"]);
  expect(probe.scope).toBe("ORG");
  expect(probe.endTimeMs).toBe(new Date(RANGE_END).getTime());
  expect(probe.startTimeMs).toBe(new Date(RANGE_START).getTime() - EMPTY_SUMMARY_LOOKBACK_DAYS * DAY_MS);
});

it("says no data exists in the lookback either when the probe is empty too", async () => {
  vi.mocked(network.postApi)
    .mockResolvedValueOnce({ error: false, timeSeriesDataPoints: [] } as never)
    .mockResolvedValueOnce({ error: false, timeSeriesDataPoints: [] } as never);

  const report = await callSummary({ scope: "DEVICE", uuid: "Y__JteHxRqSal5MeRz-C6w", types: ["FACES"] });

  expect(report.lastRecordedDateUtc).toBeUndefined();
  expect(report.hint).toContain(`or in the ${EMPTY_SUMMARY_LOOKBACK_DAYS} days before it`);
  expect(report.hint).toContain("this device (Y__JteHxRqSal5MeRz-C6w)");
  expect(report.hint).not.toContain("Bandwidth is recorded");
  expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(2);
});

it("adds no hint and makes no probe when the window has data", async () => {
  vi.mocked(network.postApi).mockResolvedValueOnce({
    error: false,
    timeSeriesDataPoints: [bandwidthPoint("2026-10-13T14:00:00", 42_880_674_783)],
  } as never);

  const report = await callSummary();

  expect(report.timeSeriesDataPoints).toHaveLength(1);
  expect(report.hint).toBeUndefined();
  expect(report.lastRecordedDateUtc).toBeUndefined();
  expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(1);
});

it("still returns the empty result with a plain hint when the probe fails", async () => {
  vi.mocked(network.postApi)
    .mockResolvedValueOnce({ error: false, timeSeriesDataPoints: [] } as never)
    .mockRejectedValueOnce(new Error("boom"));

  const report = await callSummary();

  expect(report.timeSeriesDataPoints).toEqual([]);
  expect(report.hint).toContain("No BANDWIDTH data was recorded for this org");
  expect(report.lastRecordedDateUtc).toBeUndefined();
});
