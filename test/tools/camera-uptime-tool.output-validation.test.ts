import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import { createTool as createCameraUptimeTool } from "../../src/tools-console/camera-uptime-tool.js";
import * as uptimeApi from "../../src/api/camera-uptime-tool-api.js";
import { UptimeSource } from "../../src/types/camera-uptime-tool-types.js";

vi.mock("../../src/api/camera-uptime-tool-api.js");

/**
 * Driven end-to-end through the real SDK + filtering proxy.
 *
 * Verified scope, having actually tested the test: the SDK's -32602 fires when
 * a result carries NO structuredContent at all, NOT when structuredContent
 * mismatches the registered outputSchema. I confirmed this by deleting
 * uptimeSource from the schema and by making uptimePercentage required - both
 * still pass. So this file does NOT guard the schema shape.
 *
 * What it does guard:
 *  - the error path still returns structuredContent (the real -32602 mode,
 *    see output-schema-registration.test.ts for the 2026-08-03 prod failure)
 *  - results whose stats are deliberately OMITTED (UNAVAILABLE) survive the
 *    filtering proxy's projection intact, rather than being filled in or
 *    dropped on the way out
 */
async function callTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createCameraUptimeTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({
      name: "camera-uptime-tool",
      arguments: { includeFields: null, filterBy: null, groupBy: null, ...args },
    });
  } finally {
    await client.close();
    await server.close();
  }
}

function textOf(result: Awaited<ReturnType<typeof callTool>>): string {
  return (result.content as { type: string; text?: string }[])
    .filter(item => item.type === "text")
    .map(item => item.text)
    .join("\n");
}

const START_SEC = 1_700_000_000;
const END_SEC = START_SEC + 86_400;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("camera-uptime-tool output validation", () => {
  it("validates a HARDWARE single-camera result", async () => {
    vi.mocked(uptimeApi.getCameraUptime).mockResolvedValue({
      cameraUuid: "cam-1",
      uptimeSource: UptimeSource.HARDWARE,
      totalPeriodSeconds: 86_400,
      totalUptimeSeconds: 86_400,
      uptimePercentage: 100,
      outageCount: 0,
      longestOutageSeconds: 0,
    } as never);

    const result = await callTool({
      requestType: "get-camera-uptime",
      cameraUuid: "cam-1",
      startTimeSec: START_SEC,
      endTimeSec: END_SEC,
    });

    expect(textOf(result)).not.toContain("-32602");
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      cameraUptime?: { uptimeSource?: string; uptimePercentage?: number };
    };
    expect(structured.cameraUptime?.uptimeSource).toBe("HARDWARE");
    expect(structured.cameraUptime?.uptimePercentage).toBe(100);
  });

  /*
   * The regression that motivated the whole change: a 3rd party camera has no
   * uptime signal, so the numbers are absent. The schema has to accept that
   * without the SDK swallowing the result.
   */
  it("validates an UNAVAILABLE result whose stats are omitted", async () => {
    vi.mocked(uptimeApi.getCameraUptime).mockResolvedValue({
      cameraUuid: "cam-3rd-party",
      uptimeSource: UptimeSource.UNAVAILABLE,
      totalPeriodSeconds: 86_400,
    } as never);

    const result = await callTool({
      requestType: "get-camera-uptime",
      cameraUuid: "cam-3rd-party",
      startTimeSec: START_SEC,
      endTimeSec: END_SEC,
    });

    expect(textOf(result)).not.toContain("-32602");
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      cameraUptime?: { uptimeSource?: string; uptimePercentage?: number };
    };
    expect(structured.cameraUptime?.uptimeSource).toBe("UNAVAILABLE");
    expect(structured.cameraUptime?.uptimePercentage).toBeUndefined();
  });

  it("validates a MEDIA_PRESENCE result", async () => {
    vi.mocked(uptimeApi.getCameraUptime).mockResolvedValue({
      cameraUuid: "cam-3rd-party",
      uptimeSource: UptimeSource.MEDIA_PRESENCE,
      totalPeriodSeconds: 86_400,
      totalUptimeSeconds: 43_200,
      uptimePercentage: 50,
      outageCount: 1,
      longestOutageSeconds: 43_200,
    } as never);

    const result = await callTool({
      requestType: "get-camera-uptime",
      cameraUuid: "cam-3rd-party",
      startTimeSec: START_SEC,
      endTimeSec: END_SEC,
    });

    expect(textOf(result)).not.toContain("-32602");
    const structured = result.structuredContent as {
      cameraUptime?: { uptimeSource?: string };
    };
    expect(structured.cameraUptime?.uptimeSource).toBe("MEDIA_PRESENCE");
  });

  it("validates a mixed fleet result and its summary counts", async () => {
    vi.mocked(uptimeApi.getFleetUptime).mockResolvedValue({
      cameras: [
        {
          cameraUuid: "cam-1",
          cameraName: "Lobby",
          uptimeSource: UptimeSource.HARDWARE,
          totalPeriodSeconds: 86_400,
          totalUptimeSeconds: 43_200,
          uptimePercentage: 50,
          outageCount: 1,
          longestOutageSeconds: 43_200,
        },
        {
          cameraUuid: "cam-2",
          cameraName: "Dock",
          uptimeSource: UptimeSource.UNAVAILABLE,
          totalPeriodSeconds: 86_400,
        },
      ],
      summary: {
        totalCameras: 2,
        camerasWithKnownUptime: 1,
        camerasWithUnknownUptime: 1,
        averageUptimePercentage: 50,
        worstCamera: "Lobby",
        worstUptimePercentage: 50,
      },
    } as never);

    const result = await callTool({
      requestType: "get-fleet-uptime",
      cameraUuid: null,
      startTimeSec: START_SEC,
      endTimeSec: END_SEC,
    });

    expect(textOf(result)).not.toContain("-32602");
    expect(result.isError).toBeFalsy();

    const structured = result.structuredContent as {
      fleetUptime?: { cameraUuid?: string; uptimeSource?: string; uptimePercentage?: number }[];
      fleetSummary?: { camerasWithUnknownUptime?: number; worstCamera?: string };
    };

    expect(structured.fleetUptime).toHaveLength(2);
    expect(structured.fleetUptime?.[1].uptimeSource).toBe("UNAVAILABLE");
    expect(structured.fleetUptime?.[1].uptimePercentage).toBeUndefined();
    expect(structured.fleetSummary?.camerasWithUnknownUptime).toBe(1);
    expect(structured.fleetSummary?.worstCamera).toBe("Lobby");
  });

  it("surfaces an api failure as a readable error, not -32602", async () => {
    vi.mocked(uptimeApi.getCameraUptime).mockRejectedValue(
      new Error("Failed to get camera uptime windows")
    );

    const result = await callTool({
      requestType: "get-camera-uptime",
      cameraUuid: "cam-1",
      startTimeSec: START_SEC,
      endTimeSec: END_SEC,
    });

    expect(textOf(result)).not.toContain("-32602");
    expect((result.structuredContent as { error?: string }).error).toContain(
      "Failed to get camera uptime windows"
    );
  });
});
