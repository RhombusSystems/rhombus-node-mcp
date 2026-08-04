import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/update-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

/**
 * The proxy-injected args (`includeFields`, `filterBy`, `groupBy`) and every
 * declared arg are `.nullable()`, so all keys have to be present — same as the
 * wire calls the model makes.
 */
function withNulledArgs(overrides: Record<string, unknown> = {}) {
  return {
    entityType: "camera",
    entityUuid: null,
    cameraVideoSettings: null,
    cameraAudioSettings: null,
    cameraDeviceSettings: null,
    step: null,
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ...overrides,
  };
}

/**
 * Driven end-to-end through the real SDK, because the regression lives in the
 * SDK's post-handler validation of `structuredContent` against the registered
 * outputSchema, not in our own code paths. A handler-level test cannot see it:
 * the handler returns a perfectly readable error message and only the SDK turns
 * a result without `structuredContent` into `MCP error -32602`, discarding it.
 */
async function callUpdateTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "update-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function textOf(result: Awaited<ReturnType<typeof callUpdateTool>>): string {
  return (result.content as { text: string }[]).map(item => item.text).join("\n");
}

const CAMERA_UUID = "4Toqs6naTbulCRen-RxAPA";

describe("update-tool — error paths survive output validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The prod failure (2026-08-03): the model sent img_sharpness=20 against the
  // 0..11 cap, the ZodError was returned without structuredContent, and the SDK
  // replaced it with -32602. The user got "a system error"; the model retried
  // byte-identical settings because it had nothing to correct.
  it("reports the out-of-range field and bound instead of MCP error -32602", async () => {
    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: `${CAMERA_UUID}.v0`,
        cameraVideoSettings: JSON.stringify({ img_sharpness: 20, wdr_strength: 64 }),
        step: "confirmation",
        includeFields: ["success", "message", "updatedSettings"],
      })
    );

    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).not.toContain("no structured content was provided");

    // Actionable: names the field, the bound, and the value received.
    expect(text).toContain("img_sharpness");
    expect(text).toContain("at most 11");
    expect(text).toContain("20");

    expect(result.isError).toBe(true);
    // The message has to survive the caller's `includeFields` projection, or the
    // model is back to an unexplained failure.
    expect((result.structuredContent as { message?: string }).message).toContain("img_sharpness");

    // Nothing was sent to the API — validation runs before any network call, so
    // the "settings are unchanged" claim in the answer stays true.
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("rejects a malformed settings JSON string with a readable message", async () => {
    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: CAMERA_UUID,
        cameraVideoSettings: "{img_brightness: 0",
        step: "confirmation",
      })
    );

    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("not valid JSON");
    expect(result.isError).toBe(true);
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("surfaces the API's own failure message when the update call fails", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      error: true,
      errorMsg: "device is offline",
    } as never);

    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: `${CAMERA_UUID}.v0`,
        cameraDeviceSettings: JSON.stringify({ camera_name: "Front Door" }),
        step: "confirmation",
      })
    );

    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("device is offline");
    expect(result.isError).toBe(true);
  });

  it("surfaces a camera-details lookup failure on the settings-form step", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      error: true,
      errorMsg: "camera not found",
    } as never);

    const result = await callUpdateTool(
      withNulledArgs({ entityUuid: CAMERA_UUID, step: "settings-configuration" })
    );

    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("camera not found");
    expect(result.isError).toBe(true);
  });

  // "Coming soon" is an answer, not a transport failure: it must carry
  // structuredContent to clear validation, but must NOT be flagged isError or
  // the model narrates it as a broken tool.
  it("returns the not-implemented message for other entity types without erroring", async () => {
    const result = await callUpdateTool(withNulledArgs({ entityType: "badge-reader" }));

    const text = textOf(result);
    expect(text).not.toContain("-32602");
    expect(text).toContain("not yet fully implemented");
    expect(result.isError).toBeFalsy();
  });

  it("returns the entity-type form when no entityType is resolvable", async () => {
    // `entityType` is required by the input schema, so the step-0 form is only
    // reachable via an unhandled enum member — assert the shape directly.
    const result = await callUpdateTool(withNulledArgs({ entityType: "climate-sensor" }));
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { message?: string }).message).toContain("Climate sensor");
  });

  it("still applies a valid update and reports success", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false } as never);

    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: `${CAMERA_UUID}.v0`,
        cameraVideoSettings: JSON.stringify({ img_sharpness: 8, wdr_strength: 64 }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as { success?: boolean; message?: string };
    expect(structured.success).toBe(true);
    expect(structured.message).toContain("updated successfully");
    expect(textOf(result)).toContain("Sharpness: 8");
  });

  it("normalizes ledMode/led_stealth_mode before validating, as before", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false } as never);

    const result = await callUpdateTool(
      withNulledArgs({
        entityUuid: CAMERA_UUID,
        cameraDeviceSettings: JSON.stringify({ ledMode: "OFF", led_stealth_mode: "true" }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBeFalsy();
    const sent = vi.mocked(network.postApi).mock.calls.find(
      ([arg]) => (arg as { route: string }).route === "/camera/updateFacetedConfig"
    );
    expect((sent?.[0] as { body: any }).body.configUpdate.deviceSettings).toEqual({
      led_mode: "always_off",
      led_stealth_mode: true,
    });
  });
});
