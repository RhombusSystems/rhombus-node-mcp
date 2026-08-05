import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import { createTool as createCameraTool } from "../../src/tools-console/camera-tool.js";
import { createTool as createCountTool } from "../../src/tools-console/count-tool.js";
import { createTool as createRebootTool } from "../../src/tools-console/reboot-cameras-tool.js";
import { createTool as createOrgTool } from "../../src/tools/get-org-information-tool.js";
import { createTool as createTimeTool } from "../../src/tools/time-tool.js";
import { createTool as createTimeConversionTool } from "../../src/tools/time-conversion-tool.js";
import * as cameraApi from "../../src/api/camera-tool-api.js";
import * as orgApi from "../../src/api/get-org-information-tool-api.js";
import * as rebootApi from "../../src/api/reboot-cameras-tool-api.js";

vi.mock("../../src/api/camera-tool-api.js");
vi.mock("../../src/api/get-org-information-tool-api.js");
vi.mock("../../src/api/reboot-cameras-tool-api.js");

/**
 * These six tools registered no outputSchema until 2026-08-05, so the filtering
 * proxy could not project their results (debt item 4 in
 * docs/crud_missing_gaps.md). Registering one ACTIVATES the SDK's output
 * validation: any non-isError result without structuredContent is replaced by
 * an opaque `MCP error -32602 ... no structured content was provided`,
 * destroying the tool's real message — the 2026-08-03 prod failure mode. So
 * every test here drives the REAL SDK + proxy, exactly like
 * update-tool.output-validation.test.ts: a handler-level test cannot see the
 * -32602 because the handler's own return value is fine.
 */
async function callTool(
  createTool: (server: McpServer) => void,
  name: string,
  args: Record<string, unknown>,
  // time-tool / count-tool / time-conversion-tool are blacklisted from the
  // filtering proxy in createServer.ts (their results are too small to be
  // worth projection args), so they register RAW in production — mirror that.
  // Output validation is the SDK's, not the proxy's, so it applies either way.
  opts: { proxied?: boolean } = { proxied: true }
) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(opts.proxied ? createFilteringProxy(server) : server);

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({
      name,
      arguments: opts.proxied
        ? { includeFields: null, filterBy: null, groupBy: null, ...args }
        : args,
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

const CAMERA_UUID = "4Toqs6naTbulCRen-RxAPA";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("count-tool (registered raw — proxy-blacklisted)", () => {
  it("returns a structured count", async () => {
    const result = await callTool(
      createCountTool,
      "count-tool",
      { uuids: ["a", "b", "c"] },
      { proxied: false }
    );

    expect(textOf(result)).not.toContain("-32602");
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { count?: number }).count).toBe(3);
  });
});

describe("time-tool (registered raw — proxy-blacklisted)", () => {
  it("returns the resolved time as structuredContent", async () => {
    const result = await callTool(
      createTimeTool,
      "time-tool",
      { time_description: "2026-08-05 at noon", timezone: "UTC" },
      { proxied: false }
    );

    expect(textOf(result)).not.toContain("-32602");
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as { timestamp?: number; timezone?: string };
    expect(typeof structured.timestamp).toBe("number");
    expect(structured.timezone).toBe("UTC");
  });

  it("surfaces an unparseable description as a readable error, not -32602", async () => {
    const result = await callTool(
      createTimeTool,
      "time-tool",
      { time_description: "zzzz definitely not a time", timezone: null },
      { proxied: false }
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("Could not parse");
  });
});

describe("time-conversion-tool (registered raw — proxy-blacklisted)", () => {
  it("keeps the legacy single-value {iso} shape with structuredContent", async () => {
    const result = await callTool(
      createTimeConversionTool,
      "time-conversion-tool",
      { time_to_convert: "1741190400000" },
      { proxied: false }
    );

    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { iso?: string }).iso).toBe("2025-03-05T16:00:00.000Z");
  });

  it("returns a structured batch for comma-separated input", async () => {
    const result = await callTool(
      createTimeConversionTool,
      "time-conversion-tool",
      { time_to_convert: "2025-03-05T09:00:00-08:00,1741190400000" },
      { proxied: false }
    );

    expect(result.isError).toBeFalsy();
    const { results } = result.structuredContent as {
      results?: { epoch?: number; iso?: string }[];
    };
    expect(results).toHaveLength(2);
    expect(results?.[0].epoch).toBe(1741194000000);
    expect(results?.[1].iso).toBe("2025-03-05T16:00:00.000Z");
  });

  it("reports an unconvertible single value without tripping output validation", async () => {
    const result = await callTool(
      createTimeConversionTool,
      "time-conversion-tool",
      { time_to_convert: "not a timestamp" },
      { proxied: false }
    );

    expect(textOf(result)).not.toContain("-32602");
    expect((result.structuredContent as { error?: string }).error).toContain("Unparseable");
  });
});

describe("get-org-information", () => {
  it("returns the org as structuredContent and projects org.* paths", async () => {
    vi.mocked(orgApi.getOrg).mockResolvedValue({
      org: { name: "Rhombus Client Console ITG", uuid: "Enax8CZiSS-wg567VDLxyw", sviEnabled: true },
      error: false,
    } as never);

    const result = await callTool(createOrgTool, "get-org-information", {
      includeFields: ["org.name"],
    });

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as { org?: Record<string, unknown> };
    expect(structured.org?.name).toBe("Rhombus Client Console ITG");
    // the projection actually narrowed the record
    expect(structured.org?.sviEnabled).toBeUndefined();
  });

  it("turns an api failure into isError with the api's message", async () => {
    vi.mocked(orgApi.getOrg).mockResolvedValue({
      error: true,
      errorMsg: "org lookup failed",
    } as never);

    const result = await callTool(createOrgTool, "get-org-information", {});

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("org lookup failed");
  });
});

describe("reboot-cameras", () => {
  it("still runs the confirmation handshake, then returns structured counts", async () => {
    vi.mocked(rebootApi.rebootCameras).mockResolvedValue({
      status: "SUCCESS",
      successCount: 2,
      errorCount: 0,
    } as never);

    // First call: no confirmationId — the tool answers with a confirmation
    // prompt (isError via createToolTextContent, so it must NOT be -32602).
    const ask = await callTool(createRebootTool, "reboot-cameras", {
      cameraUuids: [CAMERA_UUID],
      confirmationId: null,
    });
    const askText = textOf(ask);
    expect(askText).not.toContain("-32602");
    const confirmationId = askText.match(/confirmation id: (\w+)/)?.[1];
    expect(confirmationId).toBeTruthy();

    // Second call with the id: the reboot itself.
    const result = await callTool(createRebootTool, "reboot-cameras", {
      cameraUuids: [CAMERA_UUID],
      confirmationId,
    });

    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toEqual({
      status: "SUCCESS",
      successCount: 2,
      errorCount: 0,
    });
  });

  it("reports a reboot failure as isError, not -32602", async () => {
    vi.mocked(rebootApi.rebootCameras).mockResolvedValue({
      error: true,
      status: "Error rebooting cameras: device unreachable",
    } as never);

    const ask = await callTool(createRebootTool, "reboot-cameras", {
      cameraUuids: [CAMERA_UUID],
      confirmationId: null,
    });
    const confirmationId = textOf(ask).match(/confirmation id: (\w+)/)?.[1];

    const result = await callTool(createRebootTool, "reboot-cameras", {
      cameraUuids: [CAMERA_UUID],
      confirmationId,
    });

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("device unreachable");
  });
});

describe("camera-tool", () => {
  const nulledCameraArgs = {
    timestampISO: null,
    detail: null,
    cropX: null,
    cropY: null,
    cropWidth: null,
    cropHeight: null,
    downscaleFactor: null,
  };

  it("keeps the image content block AND satisfies output validation", async () => {
    vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
      success: true,
      status: "successfully fetched image",
      imageType: "base64",
      imageData: "aGVsbG8=",
      crop: null,
    } as never);

    const result = await callTool(createCameraTool, "camera-tool", {
      ...nulledCameraArgs,
      cameraUuid: CAMERA_UUID,
      requestType: "image",
    });

    expect(result.isError).toBeFalsy();
    const content = result.content as { type: string }[];
    // the non-text image block must survive the filtering proxy untouched
    expect(content[0].type).toBe("image");
    const structured = result.structuredContent as { status?: string; cameraUuid?: string };
    expect(structured.status).toBe("image-attached");
    expect(structured.cameraUuid).toBe(CAMERA_UUID);
  });

  it("returns the snapshot failure detail as isError, not -32602", async () => {
    vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
      success: false,
      status: "failed to fetch image",
      message: "Camera snapshot unavailable: no recorded video at the requested time.",
    } as never);

    const result = await callTool(createCameraTool, "camera-tool", {
      ...nulledCameraArgs,
      cameraUuid: CAMERA_UUID,
      requestType: "image",
    });

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("no recorded video");
  });

  it("returns settings as structuredContent and projects a single field", async () => {
    vi.mocked(cameraApi.getCameraSettings).mockResolvedValue({
      success: true,
      config: { videoFacetSettings: { v0: { img_sharpness: 6 } } },
      daysInCloud: 30,
      daysOnCamera: 12,
      cloudArchiveDays: 30,
      status: "fetched camera settings",
    } as never);

    const result = await callTool(createCameraTool, "camera-tool", {
      ...nulledCameraArgs,
      cameraUuid: CAMERA_UUID,
      requestType: "get-settings",
      includeFields: ["daysInCloud"],
    });

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as Record<string, unknown>;
    expect(structured.daysInCloud).toBe(30);
    // the projection narrowed out the bulky config
    expect(structured.config).toBeUndefined();
  });

  it("returns media uris as structuredContent", async () => {
    vi.mocked(cameraApi.getCameraMediaUris).mockResolvedValue({
      wanLiveM3u8Uri: "https://media.example/live.m3u8",
      error: false,
    } as never);

    const result = await callTool(createCameraTool, "camera-tool", {
      ...nulledCameraArgs,
      cameraUuid: CAMERA_UUID,
      requestType: "get-media-uris",
    });

    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { wanLiveM3u8Uri?: string }).wanLiveM3u8Uri).toBe(
      "https://media.example/live.m3u8"
    );
  });

  it("surfaces an api rejection from get-ai-thresholds as isError with the real message", async () => {
    vi.mocked(cameraApi.getCameraAIThresholds).mockRejectedValue(
      new Error("camera not found")
    );

    const result = await callTool(createCameraTool, "camera-tool", {
      ...nulledCameraArgs,
      cameraUuid: CAMERA_UUID,
      requestType: "get-ai-thresholds",
    });

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("camera not found");
  });
});
