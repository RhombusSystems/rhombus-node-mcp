import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";
import {
  AutomatedPromptSummary,
  ChatFollowUpActionEnum,
  ChatHistoryEntry,
  ChatVisibilityEnum,
  FrequencyUnitEnum,
} from "../types/automated-prompts-tool-types.js";
import { formatIsoWithOffset, type RequestModifiers } from "../util.js";

function extractNotifyUserUuids(
  followUpActions: schema["AutomatedPrompt"]["followUpActions"]
): string[] | undefined {
  if (!followUpActions) return undefined;
  const notifyAction = followUpActions.find(
    (action: any) => action?.type === ChatFollowUpActionEnum.NOTIFY_USERS
  );
  if (!notifyAction) return undefined;
  const userUuids = (notifyAction as any).userUuids as (string | null)[] | null | undefined;
  return userUuids?.filter((u): u is string => u !== null) ?? [];
}

function toSummary(
  prompt: schema["AutomatedPrompt"] | undefined | null,
  timeZone?: string
): AutomatedPromptSummary | undefined {
  if (!prompt) return undefined;
  return {
    uuid: prompt.uuid ?? undefined,
    prompt: prompt.prompt ?? undefined,
    responseTemplate: prompt.responseTemplate ?? undefined,
    frequency: prompt.frequency
      ? {
          frequency: prompt.frequency.frequency ?? undefined,
          unit: prompt.frequency.unit ?? undefined,
        }
      : undefined,
    invokeAt: formatIsoWithOffset(prompt.invokeAtMs, timeZone),
    permissionGroupUuid: prompt.permissionGroupUuid ?? undefined,
    notifyUserUuids: extractNotifyUserUuids(prompt.followUpActions),
    scheduleUuid: prompt.scheduleUuid ?? undefined,
    orgUuid: prompt.orgUuid ?? undefined,
  };
}

function toHistoryEntry(
  record: schema["ChatRecord"] | null | undefined,
  timeZone?: string
): ChatHistoryEntry | undefined {
  if (!record) return undefined;
  return {
    uuid: record.uuid ?? undefined,
    automatedPromptUuid: record.automatedPromptUuid ?? undefined,
    query: record.query ?? undefined,
    response: record.response ?? undefined,
    queriedAt: formatIsoWithOffset(record.queriedAtMs, timeZone),
    respondedAt: formatIsoWithOffset(record.respondedAtMs, timeZone),
    responseType: record.responseType ?? undefined,
  };
}

export type CreateAutomatedPromptInput = {
  prompt: string;
  invokeAtMs: number;
  frequencyValue: number;
  frequencyUnit: FrequencyUnitEnum;
  permissionGroupUuid: string;
  responseTemplate?: string | null;
  notifyUserUuids?: string[] | null;
};

export type UpdateAutomatedPromptInput = {
  promptUuid: string;
  prompt?: string | null;
  invokeAtMs?: number | null;
  frequencyValue?: number | null;
  frequencyUnit?: FrequencyUnitEnum | null;
  permissionGroupUuid?: string | null;
  responseTemplate?: string | null;
  notifyUserUuids?: string[] | null;
};

function buildSettingsBody(
  input: CreateAutomatedPromptInput | UpdateAutomatedPromptInput,
  includeUuid: boolean
): schema["AutomatedPrompt"] {
  const settings: schema["AutomatedPrompt"] = {};

  if (includeUuid && "promptUuid" in input && input.promptUuid) {
    settings.uuid = input.promptUuid;
  }
  if (input.prompt !== undefined && input.prompt !== null) {
    settings.prompt = input.prompt;
  }
  if (input.responseTemplate !== undefined && input.responseTemplate !== null) {
    settings.responseTemplate = input.responseTemplate;
  }
  if (input.invokeAtMs !== undefined && input.invokeAtMs !== null) {
    settings.invokeAtMs = input.invokeAtMs;
  }
  if (
    input.frequencyValue !== undefined &&
    input.frequencyValue !== null &&
    input.frequencyUnit !== undefined &&
    input.frequencyUnit !== null
  ) {
    settings.frequency = {
      frequency: input.frequencyValue,
      unit: input.frequencyUnit,
    };
  }
  if (input.permissionGroupUuid !== undefined && input.permissionGroupUuid !== null) {
    settings.permissionGroupUuid = input.permissionGroupUuid;
  }
  if (input.notifyUserUuids !== undefined && input.notifyUserUuids !== null) {
    settings.followUpActions = input.notifyUserUuids.length
      ? [
          {
            type: ChatFollowUpActionEnum.NOTIFY_USERS,
            userUuids: input.notifyUserUuids,
          } as schema["FollowUpAction"],
        ]
      : [];
  }
  return settings;
}

export async function listAutomatedPrompts(
  pageRequest: { lastEvaluatedKey?: string | null; maxPageSize?: number | null },
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  timeZone?: string
): Promise<{ settingsList: AutomatedPromptSummary[]; lastEvaluatedKey?: string }> {
  const res = await postApi<schema["Chatbot_GetAutomatedPromptsForOrgWSResponse"]>({
    route: "/chatbot/automation/getAutomatedPromptsForOrg",
    body: pageRequest satisfies schema["PaginateRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));

  const settingsList = (res.settingsList ?? [])
    .map((p) => toSummary(p, timeZone))
    .filter((s): s is AutomatedPromptSummary => s !== undefined);

  return {
    settingsList,
    lastEvaluatedKey: res.lastEvaluatedKey ?? undefined,
  };
}

export async function getAutomatedPrompt(
  promptUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  timeZone?: string
): Promise<AutomatedPromptSummary | undefined> {
  const res = await postApi<schema["Chatbot_BaseAutomatedPromptWSResponse"]>({
    route: "/chatbot/automation/getAutomatedPrompt",
    body: { promptUuid } satisfies schema["Chatbot_GetAutomatedPromptWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return toSummary(res.settings, timeZone);
}

export async function createAutomatedPrompt(
  input: CreateAutomatedPromptInput,
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  timeZone?: string
): Promise<AutomatedPromptSummary | undefined> {
  const settings = buildSettingsBody(input, /*includeUuid*/ false);
  const res = await postApi<schema["Chatbot_BaseAutomatedPromptWSResponse"]>({
    route: "/chatbot/automation/createAutomatedPrompt",
    body: { settings } satisfies schema["Chatbot_CreateAutomatedPromptWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return toSummary(res.settings, timeZone);
}

export async function updateAutomatedPrompt(
  input: UpdateAutomatedPromptInput,
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  timeZone?: string
): Promise<AutomatedPromptSummary | undefined> {
  const selectiveUpdate = buildSettingsBody(input, /*includeUuid*/ true);
  const res = await postApi<schema["Chatbot_BaseAutomatedPromptWSResponse"]>({
    route: "/chatbot/automation/updateAutomatedPrompt",
    body: { selectiveUpdate } satisfies schema["Chatbot_UpdateAutomatedPromptWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return toSummary(res.settings, timeZone);
}

export async function deleteAutomatedPrompt(
  promptUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ ok: boolean; action: string }> {
  const res = await postApi<schema["BaseApiResponse"]>({
    route: "/chatbot/automation/deleteAutomatedPrompt",
    body: { promptUuid } satisfies schema["Chatbot_DeleteAutomatedPromptWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return { ok: true, action: "deleted" };
}

export async function getAutomatedPromptChatHistory(
  promptUuid: string,
  pageRequest: { lastEvaluatedKey?: string | null; maxPageSize?: number | null },
  requestModifiers?: RequestModifiers,
  sessionId?: string,
  timeZone?: string
): Promise<{ chatHistory: ChatHistoryEntry[]; lastEvaluatedKey?: string }> {
  const res = await postApi<schema["Chatbot_GetChatHistoryWSResponse"]>({
    route: "/chatbot/automation/getAutomatedPromptChatHistory",
    body: {
      promptUuid,
      lastEvaluatedKey: pageRequest.lastEvaluatedKey ?? undefined,
      maxPageSize: pageRequest.maxPageSize ?? undefined,
    } satisfies schema["Chatbot_GetAutomatedPromptChatHistoryWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));

  const chatHistory = (res.chatHistory ?? [])
    .map((r) => toHistoryEntry(r, timeZone))
    .filter((e): e is ChatHistoryEntry => e !== undefined);

  return {
    chatHistory,
    lastEvaluatedKey: res.lastEvaluatedKey ?? undefined,
  };
}

export async function shareAutomatedPromptResponse(
  chatUuid: string,
  visibility: ChatVisibilityEnum,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ ok: boolean; action: string }> {
  const res = await postApi<schema["Chatbot_BaseChatWSResponse"]>({
    route: "/chatbot/automation/shareAutomatedPromptResponse",
    body: {
      chatUuid,
      privacy: { visibility } as schema["ChatPrivacy"],
    } satisfies schema["Chatbot_ShareAutomatedPromptResponseWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return { ok: true, action: `visibility set to ${visibility}` };
}

export async function verifyJobScheduled(
  promptUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ scheduleExpression?: string; scheduleTimezone?: string }> {
  const res = await postApi<schema["Chatbot_VerifyJobScheduledWSResponse"]>({
    route: "/chatbot/automation/verifyJobScheduled",
    body: { promptUuid } satisfies schema["Chatbot_VerifyJobScheduledWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return {
    scheduleExpression: res.scheduleExpression ?? undefined,
    scheduleTimezone: res.scheduleTimezone ?? undefined,
  };
}
