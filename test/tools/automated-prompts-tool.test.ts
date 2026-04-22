import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTool } from "../../src/tools/automated-prompts-tool.js";
import * as automatedPromptsApi from "../../src/api/automated-prompts-tool-api.js";
import {
  AutomatedPromptsRequestType,
  type ToolArgs,
} from "../../src/types/automated-prompts-tool-types.js";
import { ChatVisibilityEnum, FrequencyUnitEnum } from "../../src/types/schema.js";
import { captureToolHandler, findTextContent } from "../utils.js";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("../../src/api/automated-prompts-tool-api.js");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPTY_EXTRA = {};

const PROMPT_UUID = "promptUuid12345678901a";
const CHAT_UUID = "chatUuid1234567890123x";
const PERMISSION_GROUP_UUID = "permGroupUuid12345678a";
const USER_UUID_A = "userUuidAaaaaaaaaaaaaa";
const USER_UUID_B = "userUuidBbbbbbbbbbbbbb";

/** Build a ToolArgs with all optional fields nulled out, then merge overrides. */
function makeArgs(overrides: Partial<ToolArgs>): ToolArgs {
  return {
    requestType: AutomatedPromptsRequestType.LIST,
    promptUuid: null,
    chatUuid: null,
    visibility: null,
    prompt: null,
    responseTemplate: null,
    frequencyValue: null,
    frequencyUnit: null,
    invokeAt: null,
    permissionGroupUuid: null,
    notifyUserUuids: null,
    lastEvaluatedKey: null,
    maxPageSize: null,
    ...overrides,
  };
}

/** Parse the structured JSON payload out of a tool result. */
function parsePayload(result: { content: Array<{ type: string; text: string }> }) {
  const text = findTextContent(result)!.text;
  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("automated-prompts-tool handler", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = captureToolHandler<ToolArgs>(createTool);
  });

  // -------------------------------------------------------------------------
  // requestType: list
  // -------------------------------------------------------------------------

  describe("list", () => {
    it("returns settingsList and lastEvaluatedKey, forwards pagination args", async () => {
      vi.mocked(automatedPromptsApi.listAutomatedPrompts).mockResolvedValue({
        settingsList: [
          { uuid: PROMPT_UUID, prompt: "daily face report", invokeAt: "2026-04-22T10:57:00.000-07:00" },
        ],
        lastEvaluatedKey: "next-page-token",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.LIST,
          lastEvaluatedKey: "prev-cursor",
          maxPageSize: 25,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.settingsList).toHaveLength(1);
      expect(payload.settingsList[0].uuid).toBe(PROMPT_UUID);
      expect(payload.lastEvaluatedKey).toBe("next-page-token");

      expect(automatedPromptsApi.listAutomatedPrompts).toHaveBeenCalledWith(
        { lastEvaluatedKey: "prev-cursor", maxPageSize: 25 },
        undefined,
        undefined
      );
    });

    it("passes undefined pagination when args are null", async () => {
      vi.mocked(automatedPromptsApi.listAutomatedPrompts).mockResolvedValue({
        settingsList: [],
      });

      await handler(makeArgs({ requestType: AutomatedPromptsRequestType.LIST }), EMPTY_EXTRA);

      expect(automatedPromptsApi.listAutomatedPrompts).toHaveBeenCalledWith(
        { lastEvaluatedKey: undefined, maxPageSize: undefined },
        undefined,
        undefined
      );
    });
  });

  // -------------------------------------------------------------------------
  // requestType: get
  // -------------------------------------------------------------------------

  describe("get", () => {
    it("returns the settings for the given prompt", async () => {
      vi.mocked(automatedPromptsApi.getAutomatedPrompt).mockResolvedValue({
        uuid: PROMPT_UUID,
        prompt: "daily face report",
        invokeAt: "2026-04-22T10:57:00.000-07:00",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.GET,
          promptUuid: PROMPT_UUID,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.settings.uuid).toBe(PROMPT_UUID);
      expect(automatedPromptsApi.getAutomatedPrompt).toHaveBeenCalledWith(
        PROMPT_UUID,
        undefined,
        undefined
      );
    });

    it("errors and skips the API when promptUuid is missing", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.GET }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/promptUuid/);
      expect(automatedPromptsApi.getAutomatedPrompt).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: create
  // -------------------------------------------------------------------------

  describe("create", () => {
    const baseCreateArgs = (overrides: Partial<ToolArgs> = {}): ToolArgs =>
      makeArgs({
        requestType: AutomatedPromptsRequestType.CREATE,
        prompt: "Make me a face detection report",
        invokeAt: "2026-04-22T10:57:00.000-07:00",
        frequencyValue: 1,
        frequencyUnit: FrequencyUnitEnum.DAYS,
        permissionGroupUuid: PERMISSION_GROUP_UUID,
        ...overrides,
      });

    it("converts invokeAt ISO to ms and forwards required fields", async () => {
      vi.mocked(automatedPromptsApi.createAutomatedPrompt).mockResolvedValue({
        uuid: PROMPT_UUID,
      });

      const iso = "2026-04-22T10:57:00.000-07:00";
      await handler(baseCreateArgs({ invokeAt: iso }), EMPTY_EXTRA);

      expect(automatedPromptsApi.createAutomatedPrompt).toHaveBeenCalledTimes(1);
      const [input] = vi.mocked(automatedPromptsApi.createAutomatedPrompt).mock.calls[0];
      expect(input).toMatchObject({
        prompt: "Make me a face detection report",
        invokeAtMs: new Date(iso).getTime(),
        frequencyValue: 1,
        frequencyUnit: FrequencyUnitEnum.DAYS,
        permissionGroupUuid: PERMISSION_GROUP_UUID,
      });
    });

    it("forwards optional responseTemplate and notifyUserUuids when provided", async () => {
      vi.mocked(automatedPromptsApi.createAutomatedPrompt).mockResolvedValue({
        uuid: PROMPT_UUID,
      });

      await handler(
        baseCreateArgs({
          responseTemplate: "Use bullet points",
          notifyUserUuids: [USER_UUID_A, USER_UUID_B],
        }),
        EMPTY_EXTRA
      );

      const [input] = vi.mocked(automatedPromptsApi.createAutomatedPrompt).mock.calls[0];
      expect(input.responseTemplate).toBe("Use bullet points");
      expect(input.notifyUserUuids).toEqual([USER_UUID_A, USER_UUID_B]);
    });

    it("returns an error listing every missing required field", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.CREATE }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/prompt/);
      expect(payload.error).toMatch(/invokeAt/);
      expect(payload.error).toMatch(/frequencyValue/);
      expect(payload.error).toMatch(/frequencyUnit/);
      expect(payload.error).toMatch(/permissionGroupUuid/);
      expect(automatedPromptsApi.createAutomatedPrompt).not.toHaveBeenCalled();
    });

    it("returns an error if invokeAt is missing", async () => {
      const result = await handler(baseCreateArgs({ invokeAt: null }), EMPTY_EXTRA);
      const payload = parsePayload(result);
      expect(payload.error).toMatch(/invokeAt/);
      expect(automatedPromptsApi.createAutomatedPrompt).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: update
  // -------------------------------------------------------------------------

  describe("update", () => {
    it("requires promptUuid", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.UPDATE }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/promptUuid/);
      expect(automatedPromptsApi.updateAutomatedPrompt).not.toHaveBeenCalled();
    });

    it("rejects partial frequency (only value, no unit)", async () => {
      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.UPDATE,
          promptUuid: PROMPT_UUID,
          frequencyValue: 2,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/frequencyValue and frequencyUnit must be provided together/);
      expect(automatedPromptsApi.updateAutomatedPrompt).not.toHaveBeenCalled();
    });

    it("forwards only the fields that were set, converting invokeAt", async () => {
      vi.mocked(automatedPromptsApi.updateAutomatedPrompt).mockResolvedValue({
        uuid: PROMPT_UUID,
      });

      const iso = "2026-05-01T08:00:00.000Z";
      await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.UPDATE,
          promptUuid: PROMPT_UUID,
          prompt: "new prompt text",
          invokeAt: iso,
        }),
        EMPTY_EXTRA
      );

      const [input] = vi.mocked(automatedPromptsApi.updateAutomatedPrompt).mock.calls[0];
      expect(input).toMatchObject({
        promptUuid: PROMPT_UUID,
        prompt: "new prompt text",
        invokeAtMs: new Date(iso).getTime(),
      });
      expect(input.frequencyValue).toBeUndefined();
      expect(input.frequencyUnit).toBeUndefined();
    });

    it("forwards an empty notifyUserUuids array (clears notifyees)", async () => {
      vi.mocked(automatedPromptsApi.updateAutomatedPrompt).mockResolvedValue({
        uuid: PROMPT_UUID,
      });

      await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.UPDATE,
          promptUuid: PROMPT_UUID,
          notifyUserUuids: [],
        }),
        EMPTY_EXTRA
      );

      const [input] = vi.mocked(automatedPromptsApi.updateAutomatedPrompt).mock.calls[0];
      expect(input.notifyUserUuids).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // requestType: delete
  // -------------------------------------------------------------------------

  describe("delete", () => {
    it("returns the success payload", async () => {
      vi.mocked(automatedPromptsApi.deleteAutomatedPrompt).mockResolvedValue({
        ok: true,
        action: "deleted",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.DELETE,
          promptUuid: PROMPT_UUID,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.success).toEqual({ ok: true, action: "deleted" });
      expect(automatedPromptsApi.deleteAutomatedPrompt).toHaveBeenCalledWith(
        PROMPT_UUID,
        undefined,
        undefined
      );
    });

    it("requires promptUuid", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.DELETE }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/promptUuid/);
      expect(automatedPromptsApi.deleteAutomatedPrompt).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: get-history
  // -------------------------------------------------------------------------

  describe("get-history", () => {
    it("returns chatHistory and lastEvaluatedKey, forwards pagination", async () => {
      vi.mocked(automatedPromptsApi.getAutomatedPromptChatHistory).mockResolvedValue({
        chatHistory: [
          {
            uuid: CHAT_UUID,
            query: "Make me a face detection report",
            response: "Here are the results...",
            queriedAt: "2026-04-21T11:01:00.000-07:00",
            respondedAt: "2026-04-21T11:01:30.000-07:00",
          },
        ],
        lastEvaluatedKey: "next-history-token",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.GET_HISTORY,
          promptUuid: PROMPT_UUID,
          lastEvaluatedKey: "prev-history",
          maxPageSize: 50,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.chatHistory).toHaveLength(1);
      expect(payload.chatHistory[0].uuid).toBe(CHAT_UUID);
      expect(payload.lastEvaluatedKey).toBe("next-history-token");

      expect(automatedPromptsApi.getAutomatedPromptChatHistory).toHaveBeenCalledWith(
        PROMPT_UUID,
        { lastEvaluatedKey: "prev-history", maxPageSize: 50 },
        undefined,
        undefined
      );
    });

    it("requires promptUuid", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.GET_HISTORY }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/promptUuid/);
      expect(automatedPromptsApi.getAutomatedPromptChatHistory).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: share-response
  // -------------------------------------------------------------------------

  describe("share-response", () => {
    it("forwards chatUuid + visibility and returns success", async () => {
      vi.mocked(automatedPromptsApi.shareAutomatedPromptResponse).mockResolvedValue({
        ok: true,
        action: "visibility set to ORG_WIDE",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.SHARE_RESPONSE,
          chatUuid: CHAT_UUID,
          visibility: ChatVisibilityEnum.ORG_WIDE,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.success.ok).toBe(true);
      expect(payload.success.action).toMatch(/ORG_WIDE/);

      expect(automatedPromptsApi.shareAutomatedPromptResponse).toHaveBeenCalledWith(
        CHAT_UUID,
        ChatVisibilityEnum.ORG_WIDE,
        undefined,
        undefined
      );
    });

    it("requires both chatUuid and visibility", async () => {
      const missingVis = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.SHARE_RESPONSE,
          chatUuid: CHAT_UUID,
        }),
        EMPTY_EXTRA
      );
      expect(parsePayload(missingVis).error).toMatch(/visibility/);

      const missingChat = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.SHARE_RESPONSE,
          visibility: ChatVisibilityEnum.PUBLIC,
        }),
        EMPTY_EXTRA
      );
      expect(parsePayload(missingChat).error).toMatch(/chatUuid/);

      expect(automatedPromptsApi.shareAutomatedPromptResponse).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: verify-scheduled
  // -------------------------------------------------------------------------

  describe("verify-scheduled", () => {
    it("returns the verifyResult", async () => {
      vi.mocked(automatedPromptsApi.verifyJobScheduled).mockResolvedValue({
        scheduleExpression: "cron(0 18 * * ? *)",
        scheduleTimezone: "America/Los_Angeles",
      });

      const result = await handler(
        makeArgs({
          requestType: AutomatedPromptsRequestType.VERIFY_SCHEDULED,
          promptUuid: PROMPT_UUID,
        }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.verifyResult).toEqual({
        scheduleExpression: "cron(0 18 * * ? *)",
        scheduleTimezone: "America/Los_Angeles",
      });
      expect(automatedPromptsApi.verifyJobScheduled).toHaveBeenCalledWith(
        PROMPT_UUID,
        undefined,
        undefined
      );
    });

    it("requires promptUuid", async () => {
      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.VERIFY_SCHEDULED }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toMatch(/promptUuid/);
      expect(automatedPromptsApi.verifyJobScheduled).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------

  describe("error handling", () => {
    it("returns error message text when the API throws", async () => {
      vi.mocked(automatedPromptsApi.listAutomatedPrompts).mockRejectedValue(
        new Error("backend exploded")
      );

      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.LIST }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toBe("backend exploded");
    });

    it("returns 'Unknown error' for non-Error throws", async () => {
      vi.mocked(automatedPromptsApi.listAutomatedPrompts).mockRejectedValue("nope");

      const result = await handler(
        makeArgs({ requestType: AutomatedPromptsRequestType.LIST }),
        EMPTY_EXTRA
      );

      const payload = parsePayload(result);
      expect(payload.error).toBe("Unknown error");
    });
  });
});
