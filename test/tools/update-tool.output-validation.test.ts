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

  // ENTITY_TYPE used to advertise five types with no handler, each answering
  // "not yet implemented. Coming soon!". The enum now lists only what works, so
  // those values are rejected up front.
  //
  // This IS a -32602, but the input-validation kind, which is the opposite
  // problem to the one this file is about: it enumerates the values that ARE
  // accepted, so the model can correct itself. The failure mode being guarded
  // against elsewhere here is an OUTPUT-validation -32602, which replaces a real
  // message with an opaque protocol crash.
  it.each([["badge-reader"], ["climate-sensor"], ["audio-gateway"]])(
    "rejects the unimplemented entity type %s by naming the ones that work",
    async unimplementedType => {
      const result = await callUpdateTool(withNulledArgs({ entityType: unimplementedType }));

      const text = textOf(result);
      expect(text).toContain("camera");
      expect(text).toContain("doorbell-camera");
      expect(text).not.toContain("Coming soon");
    }
  );

  it("accepts doorbell-camera, which now has a handler", async () => {
    const result = await callUpdateTool(withNulledArgs({ entityType: "doorbell-camera" }));

    const text = textOf(result);
    // Reaches the handler rather than being rejected by the input schema.
    expect(text).not.toContain("Invalid option");
    expect(text).toContain("cameraVideoSettings");
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

const DOORBELL_UUID = "LEAIcNIVT3yAGjkD4mtbRw";

/**
 * Doorbell writes are verified against /doorbellcamera/getConfig, because the
 * update response only echoes the caller's own input — before this read was
 * wired up, a silent no-op was indistinguishable from a real write (gap 5 in
 * docs/crud_missing_gaps.md). The mock flips the config it serves once
 * updateConfig has been called, so the before/after reads see different states
 * exactly like the live API.
 */
function mockDoorbellApi({
  before,
  after,
}: {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}) {
  let updated = false;
  vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
    const { route } = call as { route: string };
    if (route === "/doorbellcamera/getMinimalStateList") {
      return { minimalStates: [{ uuid: DOORBELL_UUID, name: "Front Door" }] } as never;
    }
    if (route === "/doorbellcamera/updateConfig") {
      updated = true;
      return { error: false } as never;
    }
    if (route === "/doorbellcamera/getConfig") {
      return { error: false, config: updated ? after : before } as never;
    }
    throw new Error(`unexpected route ${route}`);
  });
}

describe("update-tool — doorbell writes are verified via getConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the settable subset of the current config when no settings are passed", async () => {
    mockDoorbellApi({
      before: {
        img_sharpness: 6,
        img_contrast: 64,
        audio_record: true,
        // internal fields must NOT leak into currentSettings — the full config
        // has ~150 of them and none are settable through this tool
        obj_ai_threshold: 0.5,
        orgUuid: "someOrgUuid",
      },
      after: {},
    });

    const result = await callUpdateTool(
      withNulledArgs({ entityType: "doorbell-camera", entityUuid: DOORBELL_UUID })
    );

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      needUserInput?: boolean;
      currentSettings?: { video?: Record<string, unknown>; audio?: Record<string, unknown> };
    };
    expect(structured.needUserInput).toBe(true);
    expect(structured.currentSettings?.video).toEqual({ img_sharpness: 6, img_contrast: 64 });
    expect(structured.currentSettings?.audio).toEqual({ audio_record: true });
    expect(JSON.stringify(structured.currentSettings)).not.toContain("obj_ai_threshold");
  });

  it("reports a verified write, with the previous values, when the read-back matches", async () => {
    mockDoorbellApi({
      before: { img_contrast: 64 },
      after: { img_contrast: 32 },
    });

    const result = await callUpdateTool(
      withNulledArgs({
        entityType: "doorbell-camera",
        entityUuid: DOORBELL_UUID,
        cameraVideoSettings: JSON.stringify({ img_contrast: 32 }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      success?: boolean;
      message?: string;
      previousSettings?: Record<string, unknown>;
      settingsNotApplied?: unknown;
    };
    expect(structured.success).toBe(true);
    expect(structured.message).toContain("verified");
    expect(structured.previousSettings).toEqual({ img_contrast: 64 });
    expect(structured.settingsNotApplied).toBeUndefined();
  });

  // The exact failure mode that motivated wiring up getConfig: api2 accepts the
  // update, returns error:false, and changes nothing. Without the read-back the
  // tool reported this as a success.
  it("reports an error when the read-back shows the write was a silent no-op", async () => {
    mockDoorbellApi({
      before: { img_contrast: 64 },
      after: { img_contrast: 64 },
    });

    const result = await callUpdateTool(
      withNulledArgs({
        entityType: "doorbell-camera",
        entityUuid: DOORBELL_UUID,
        cameraVideoSettings: JSON.stringify({ img_contrast: 32 }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBe(true);
    const text = textOf(result);
    expect(text).toContain("unchanged");
    expect(text).toContain("64"); // the actual value
    expect(text).toContain("32"); // the requested value
    expect(text).toContain("Do not retry");
  });

  it("flags settings the doorbell config does not report instead of failing them", async () => {
    // camera_name is settable through updateConfig but never appears in the
    // getConfig response, so it lands in settingsNotVerified — not in
    // settingsNotApplied, which would be a false alarm.
    mockDoorbellApi({
      before: { img_contrast: 64 },
      after: { img_contrast: 32 },
    });

    const result = await callUpdateTool(
      withNulledArgs({
        entityType: "doorbell-camera",
        entityUuid: DOORBELL_UUID,
        cameraVideoSettings: JSON.stringify({ img_contrast: 32 }),
        cameraDeviceSettings: JSON.stringify({ camera_name: "Renamed Doorbell" }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      success?: boolean;
      message?: string;
      settingsNotVerified?: string[];
      settingsNotApplied?: unknown;
    };
    expect(structured.success).toBe(true);
    expect(structured.settingsNotVerified).toEqual(["camera_name"]);
    expect(structured.settingsNotApplied).toBeUndefined();
    expect(structured.message).toContain("could not be verified");
  });

  it("still applies the write when the config read-back itself fails", async () => {
    vi.mocked(network.postApi).mockImplementation(async (call: unknown) => {
      const { route } = call as { route: string };
      if (route === "/doorbellcamera/getMinimalStateList") {
        return { minimalStates: [{ uuid: DOORBELL_UUID, name: "Front Door" }] } as never;
      }
      if (route === "/doorbellcamera/updateConfig") {
        return { error: false } as never;
      }
      if (route === "/doorbellcamera/getConfig") {
        return { error: true, errorMsg: "config service unavailable" } as never;
      }
      throw new Error(`unexpected route ${route}`);
    });

    const result = await callUpdateTool(
      withNulledArgs({
        entityType: "doorbell-camera",
        entityUuid: DOORBELL_UUID,
        cameraVideoSettings: JSON.stringify({ img_contrast: 32 }),
        step: "confirmation",
      })
    );

    // A broken read path must not block the write the user asked for — but the
    // result has to say the new value is unverified rather than claiming it.
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as { success?: boolean; message?: string };
    expect(structured.success).toBe(true);
    expect(structured.message).toContain("could not be verified");
    const updateCall = vi
      .mocked(network.postApi)
      .mock.calls.find(([arg]) => (arg as { route: string }).route === "/doorbellcamera/updateConfig");
    expect(updateCall).toBeDefined();
  });

  it("normalizes ledMode into the flat doorbell configUpdate too", async () => {
    mockDoorbellApi({
      before: { led_stealth_mode: false },
      after: { led_stealth_mode: true },
    });

    const result = await callUpdateTool(
      withNulledArgs({
        entityType: "doorbell-camera",
        entityUuid: DOORBELL_UUID,
        cameraDeviceSettings: JSON.stringify({ ledMode: "OFF", led_stealth_mode: "true" }),
        step: "confirmation",
      })
    );

    expect(result.isError).toBeFalsy();
    const sent = vi.mocked(network.postApi).mock.calls.find(
      ([arg]) => (arg as { route: string }).route === "/doorbellcamera/updateConfig"
    );
    expect((sent?.[0] as { body: any }).body.configUpdate).toEqual({
      deviceUuid: DOORBELL_UUID,
      led_mode: "always_off",
      led_stealth_mode: true,
    });
  });
});
