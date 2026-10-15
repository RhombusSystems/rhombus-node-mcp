import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/audio-tool.js";
import {
  buildBreaks,
  buildPaddedSsml,
  clipText,
  correctedSilenceMs,
  estimateSpeechSeconds,
  isLoopable,
  nominalSilenceMs,
} from "../../src/types/audio-tool-types.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const CLIP_A = "c1ipAaaaS9y2hZpVvGkAAA";
const CLIP_B = "c1ipBbbbS9y2hZpVvGkAAA";
const GW_1 = "gatewayOneS9y2hZpVvGkA";
const GW_2 = "gatewayTwoS9y2hZpVvGkA";
const RULE_UUID = "ru1eUu1dS9y2hZpVvGkAAA";

const TEXT = "Attention: the Lobby door is open.";

function withNulledArgs(overrides: Record<string, unknown> = {}) {
  return {
    includeFields: null,
    filterBy: null,
    groupBy: null,
    clipUuid: null,
    text: null,
    displayName: null,
    description: null,
    voiceId: null,
    repeatEverySec: null,
    audioGatewayUuids: null,
    playCount: null,
    loopDurationSec: null,
    confirmDeleteInUse: null,
    ...overrides,
  };
}

async function callTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "audio-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function resultText(result: Awaited<ReturnType<typeof callTool>>): string {
  return (result.content as { text: string }[])[0].text;
}

function callsTo(route: string) {
  return vi.mocked(network.postApi).mock.calls.filter(call => call[0].route === route);
}

type Routes = Record<string, unknown | ((body: any) => unknown)>;

function mockRoutes(table: Routes) {
  vi.mocked(network.postApi).mockImplementation((async ({ route, body }: { route: string; body: any }) => {
    if (!(route in table)) throw new Error(`unexpected route ${route}`);
    const entry = table[route];
    return typeof entry === "function" ? entry(body) : entry;
  }) as never);
}

describe("cadence padding helpers", () => {
  it("estimates speech from the word count", () => {
    expect(estimateSpeechSeconds(TEXT)).toBeCloseTo(0.6 + 6 * 0.42, 5);
  });

  it("chains breaks of at most 10 s and keeps the remainder in ms", () => {
    expect(buildBreaks(26_880)).toBe('<break time="10s"/><break time="10s"/><break time="6880ms"/>');
    expect(buildBreaks(20_000)).toBe('<break time="10s"/><break time="10s"/>');
    expect(buildBreaks(0)).toBe("");
  });

  it("wraps the escaped text in the drc effect before the silence", () => {
    expect(buildPaddedSsml("Door <A> & B", 500)).toBe(
      '<speak><amazon:effect name="drc">Door &lt;A&gt; &amp; B</amazon:effect><break time="500ms"/></speak>'
    );
  });

  it("reads a clip's words from plain text or from its SSML", () => {
    expect(clipText({ audioPlaintext: "Hello", audioSSML: null })).toBe("Hello");
    expect(clipText({ audioPlaintext: null, audioSSML: buildPaddedSsml(TEXT, 20_160) })).toBe(TEXT);
  });

  it("asks Polly for 3/4 of the wanted silence, since a break renders 4/3 as long", () => {
    expect(nominalSilenceMs(20)).toBe(15_000);
    expect(nominalSilenceMs(26.88)).toBe(20_160);
    expect(nominalSilenceMs(-1)).toBe(0);
  });

  it("corrects a second pass by how much silence each nominal second really produced", () => {
    // 20 s nominal came out as 26.67 s of silence (factor 4/3) → 3 s short needs 2.25 s nominal.
    expect(correctedSilenceMs(20_000, 3, 29.667 + 0.0, 32.667)).toBe(22_250);
    // No padding in the first pass: fall back to the known factor.
    expect(correctedSilenceMs(0, 3, 3, 7)).toBe(3_000);
    // Overshoot shrinks the padding.
    expect(correctedSilenceMs(20_000, 3, 33, 30)).toBeLessThan(20_000);
  });

  it("treats long speech as not loopable, but padded silence as fine", () => {
    expect(isLoopable(30_000, 3)).toBe(true);
    expect(isLoopable(30_000)).toBe(false);
    expect(isLoopable(20_000)).toBe(true);
    expect(isLoopable(undefined)).toBeUndefined();
  });
});

describe("audio-tool", () => {
  beforeEach(() => {
    vi.mocked(network.postApi).mockReset();
  });

  describe("create-tts-clip", () => {
    it("pads the SSML from the speech estimate and reports the measured cadence", async () => {
      mockRoutes({
        "/audioplayback/uploadAudioText": { uuid: CLIP_A },
        "/audioplayback/getAudioUploadMetadataForOrg": {
          audioUploadMetadata: [
            { uuid: CLIP_A, displayName: "Lobby", audioSSML: buildPaddedSsml(TEXT, 20_160), durationMs: 30_200 },
          ],
        },
      });

      const result = await callTool(
        withNulledArgs({
          requestType: "create-tts-clip",
          text: TEXT,
          displayName: "Lobby",
          repeatEverySec: 30,
        })
      );

      expect(result.isError).toBeFalsy();
      const uploads = callsTo("/audioplayback/uploadAudioText");
      expect(uploads).toHaveLength(1);
      const body = uploads[0][0].body as { audioSSML: string; audioPlaintext?: string; displayName: string };
      expect(body.audioPlaintext).toBeUndefined();
      expect(body.displayName).toBe("Lobby");
      expect(body.audioSSML).toBe(buildPaddedSsml(TEXT, 20_160));
      expect(callsTo("/audioplayback/deleteAudioUploadMetadata")).toHaveLength(0);
      expect(result.structuredContent).toMatchObject({
        clip: {
          uuid: CLIP_A,
          text: TEXT,
          durationSec: 30.2,
          repeatEverySec: 30,
          resynthesized: false,
          loopable: true,
        },
      });
    });

    it("synthesizes once more, with the padding corrected by the miss, when the clip misses the cadence", async () => {
      const metadata: Record<string, unknown>[] = [];
      let uploadCount = 0;
      mockRoutes({
        "/audioplayback/uploadAudioText": (body: { audioSSML: string }) => {
          // The first clip comes back 3 s short (Polly spoke faster than estimated).
          const uuid = uploadCount++ === 0 ? CLIP_A : CLIP_B;
          metadata.push({ uuid, audioSSML: body.audioSSML, durationMs: uuid === CLIP_A ? 27_000 : 30_100 });
          return { uuid };
        },
        "/audioplayback/getAudioUploadMetadataForOrg": () => ({ audioUploadMetadata: metadata }),
        "/audioplayback/deleteAudioUploadMetadata": (body: { audioUploadUuid: string }) => {
          const index = metadata.findIndex(clip => clip.uuid === body.audioUploadUuid);
          metadata.splice(index, 1);
          return {};
        },
      });

      const result = await callTool(
        withNulledArgs({
          requestType: "create-tts-clip",
          text: TEXT,
          displayName: "Lobby",
          repeatEverySec: 30,
        })
      );

      const uploads = callsTo("/audioplayback/uploadAudioText");
      expect(uploads).toHaveLength(2);
      const firstSilenceMs = 20_160;
      expect((uploads[0][0].body as { audioSSML: string }).audioSSML).toBe(buildPaddedSsml(TEXT, firstSilenceMs));
      const secondSilenceMs = correctedSilenceMs(firstSilenceMs, estimateSpeechSeconds(TEXT), 27, 30);
      expect(secondSilenceMs).toBeGreaterThan(firstSilenceMs);
      expect((uploads[1][0].body as { audioSSML: string }).audioSSML).toBe(buildPaddedSsml(TEXT, secondSilenceMs));
      const deletes = callsTo("/audioplayback/deleteAudioUploadMetadata");
      expect(deletes).toHaveLength(1);
      expect((deletes[0][0].body as { audioUploadUuid: string }).audioUploadUuid).toBe(CLIP_A);
      expect(result.structuredContent).toMatchObject({
        clip: { uuid: CLIP_B, durationSec: 30.1, repeatEverySec: 30, resynthesized: true },
      });
    });

    it("refuses text that cannot fit the cadence before calling the API", async () => {
      mockRoutes({});
      const result = await callTool(
        withNulledArgs({
          requestType: "create-tts-clip",
          text: Array(40).fill("word").join(" "),
          displayName: "Too long",
          repeatEverySec: 10,
        })
      );
      expect(result.isError).toBe(true);
      expect(resultText(result)).toContain("RETRYABLE");
      expect(resultText(result)).toContain("does not fit a 10 s cadence");
      expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
    });

    it("sends plain text, which the API wraps itself, when no cadence is asked for", async () => {
      mockRoutes({
        "/audioplayback/uploadAudioText": { uuid: CLIP_A },
        "/audioplayback/getAudioUploadMetadataForOrg": {
          audioUploadMetadata: [{ uuid: CLIP_A, displayName: "Lobby", audioPlaintext: TEXT, durationMs: 2_900 }],
        },
      });
      const result = await callTool(
        withNulledArgs({ requestType: "create-tts-clip", text: TEXT, displayName: "Lobby", voiceId: "Joanna" })
      );
      const body = callsTo("/audioplayback/uploadAudioText")[0][0].body as Record<string, unknown>;
      expect(body).toEqual({ audioPlaintext: TEXT, displayName: "Lobby", voiceId: "Joanna" });
      expect(result.structuredContent).toMatchObject({ clip: { uuid: CLIP_A, durationSec: 2.9, loopable: true } });
    });

    it("surfaces a rejected SSML document as an error", async () => {
      mockRoutes({ "/audioplayback/uploadAudioText": { invalidSSML: true, synthesisFailure: true } });
      const result = await callTool(
        withNulledArgs({ requestType: "create-tts-clip", text: TEXT, displayName: "Lobby", repeatEverySec: 30 })
      );
      expect(result.structuredContent).toMatchObject({ error: expect.stringContaining("SSML") });
    });
  });

  describe("play and stop", () => {
    it("plays a clip on the given gateways with the loop settings", async () => {
      mockRoutes({
        "/audioplayback/getAudioUploadMetadataForOrg": {
          audioUploadMetadata: [{ uuid: CLIP_A, durationMs: 30_000, audioSSML: buildPaddedSsml(TEXT, 20_160) }],
        },
        "/audioplayback/playAudioUpload": { success: true },
      });
      const result = await callTool(
        withNulledArgs({
          requestType: "play",
          clipUuid: CLIP_A,
          audioGatewayUuids: [GW_1, GW_2],
          playCount: 0,
          loopDurationSec: 3600,
        })
      );
      const body = callsTo("/audioplayback/playAudioUpload")[0][0].body;
      expect(body).toEqual({
        audioUploadUuid: CLIP_A,
        audioGatewayUuids: [GW_1, GW_2],
        playCount: 0,
        loopDurationSec: 3600,
      });
      expect(result.structuredContent).toMatchObject({ played: { success: true, clipUuid: CLIP_A } });
    });

    it("refuses to play without a device", async () => {
      mockRoutes({});
      const result = await callTool(withNulledArgs({ requestType: "play", clipUuid: CLIP_A, audioGatewayUuids: [] }));
      expect(result.isError).toBe(true);
      expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
    });

    it("stops loops and names the devices that did not acknowledge", async () => {
      mockRoutes({
        "/audioplayback/cancelLoopingAudioPlayback": { successMap: { [GW_1]: true, [GW_2]: false } },
      });
      const result = await callTool(withNulledArgs({ requestType: "stop", audioGatewayUuids: [GW_1, GW_2] }));
      const body = callsTo("/audioplayback/cancelLoopingAudioPlayback")[0][0].body;
      expect(body).toEqual({ audioDevices: [GW_1, GW_2] });
      expect(result.structuredContent).toMatchObject({
        stopped: { perDevice: { [GW_1]: true, [GW_2]: false } },
        note: expect.stringContaining(GW_2),
      });
    });
  });

  describe("delete-clip", () => {
    const rulesUsingClip = {
      rules: [
        { uuid: RULE_UUID, name: "Lobby door open", action: { audioPlaybackActions: [{ audioClipUuid: CLIP_A }] } },
        { uuid: "otherRu1eS9y2hZpVvGkAA", name: "Other", action: { audioPlaybackActions: [{ audioClipUuid: CLIP_B }] } },
      ],
    };

    it("refuses to delete a clip a rule still plays, and names the rule", async () => {
      mockRoutes({ "/rules/getRulesForOrg": rulesUsingClip, "/audioplayback/deleteAudioUploadMetadata": {} });
      const result = await callTool(withNulledArgs({ requestType: "delete-clip", clipUuid: CLIP_A }));
      expect(callsTo("/audioplayback/deleteAudioUploadMetadata")).toHaveLength(0);
      expect(result.structuredContent).toMatchObject({
        usedBy: [{ ruleUuid: RULE_UUID, ruleName: "Lobby door open" }],
        note: expect.stringContaining("NOT DELETED"),
      });
    });

    it("deletes once the caller confirms", async () => {
      mockRoutes({ "/rules/getRulesForOrg": rulesUsingClip, "/audioplayback/deleteAudioUploadMetadata": {} });
      const result = await callTool(
        withNulledArgs({ requestType: "delete-clip", clipUuid: CLIP_A, confirmDeleteInUse: true })
      );
      expect(callsTo("/audioplayback/deleteAudioUploadMetadata")).toHaveLength(1);
      expect(result.structuredContent).toMatchObject({ deleted: { uuid: CLIP_A, success: true } });
    });
  });

  it("lists clips with their spoken words and length", async () => {
    mockRoutes({
      "/audioplayback/getAudioUploadMetadataForOrg": {
        audioUploadMetadata: [
          { uuid: CLIP_A, displayName: "Lobby", audioSSML: buildPaddedSsml(TEXT, 20_160), durationMs: 30_000 },
          { uuid: CLIP_B, displayName: "Chime", durationMs: 1_500 },
        ],
      },
    });
    const result = await callTool(withNulledArgs({ requestType: "list-clips" }));
    expect(result.structuredContent).toMatchObject({
      clips: [
        { uuid: CLIP_A, text: TEXT, durationSec: 30, textToSpeech: true },
        { uuid: CLIP_B, displayName: "Chime", durationSec: 1.5, textToSpeech: false, loopable: true },
      ],
    });
  });
});
