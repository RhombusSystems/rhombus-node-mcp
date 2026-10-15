import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  listRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
  getRuleRecords,
  listAudioClips,
} from "../api/rules-tool-api.js";
import { getDoorSensorAjarSettings } from "../api/update-tool-api.js";
import type { schema } from "../types/schema.js";
import {
  RULE_FIELDS,
  RulesToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/rules-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
  type RequestModifiers,
} from "../util.js";

const TOOL_NAME = "rules-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus automation rules for triggering actions based on events.

It has the following modes of operation, determined by the "requestType" parameter:
- ${RulesToolRequestType.LIST}: List all automation rules in the organization (names and uuids only).
- ${RulesToolRequestType.GET}: Get one rule in full — its triggers, action, conjunction and filters. Requires ruleUuid. Always call this before 'update'.
- ${RulesToolRequestType.CREATE}: Create a new automation rule. Requires ruleName and ruleConfig.
- ${RulesToolRequestType.UPDATE}: Update an existing rule. Requires ruleUuid and ruleConfig holding only the top-level fields to change; fields you leave out are kept.
- ${RulesToolRequestType.DELETE}: Delete a rule. Requires ruleUuid.
- ${RulesToolRequestType.GET_RECORDS}: Get the event trigger history for a specific rule. Requires ruleUuid.
- ${RulesToolRequestType.LIST_AUDIO_CLIPS}: List the organization's saved audio clips (uploads and text-to-speech) with their uuids and spoken text.

ruleConfig uses the same shape 'get' returns. Example — when either door sensor reports the door ajar, play a saved clip on an audio gateway:
{"triggers":[{"type":"DEVICE_ACTIVITY_EVENT","activityEvent":{"activityEvent":"DOOR_AJAR"},"deviceUuids":["<door sensor uuid>","<door sensor uuid>"]}],
 "conjunction":"OR",
 "action":{"audioPlaybackActions":[{"audioClipUuid":"<uuid from list-audio-clips>","audioGateways":["<audio gateway uuid>"]}]}}
A Play Audio action references a saved clip by uuid, never by its text: resolve the clip with ${RulesToolRequestType.LIST_AUDIO_CLIPS}.

DOOR OPEN DURATION: a DOOR_AJAR trigger fires when the door sensor's own ajar threshold elapses. The trigger's doorAjarThresholdSec field is ignored. 'get' reports each sensor's delay in doorSensorAjarSeconds; to change it ("when the door stays open 15 seconds"), use update-tool with entityType door-sensor — it applies to every rule and alert on that sensor.

LOOPING AND STOPPING AUDIO: an audioPlaybackActions entry also takes "loopDurationSec" (keep repeating the clip for that many seconds) and "playCount" (0 = repeat until stopped; with both set, the first limit reached ends the loop). A loop is stopped by a second rule whose action is {"cancelLoopingAudioPlaybackAction":{"audioDevices":["<audio gateway uuid>"]}} — e.g. DOOR_CLOSED on the same sensor. It stops EVERY loop on those devices. Only short clips loop (about 25 s of speech at most; silence padding is free): audio-tool create-tts-clip with repeatEverySec makes a clip that a loop repeats on a fixed cadence.
A clip's words are fixed when it is made (no live text-to-speech) and the action plays on a fixed list of gateways, so "announce WHICH door is open on the speakers at THAT door's location, repeating until it closes" needs one clip and one rule pair per door — call get-workflows (door-ajar-announcements) for that request instead of composing rules by hand.

Before changing anything, compare the request with what 'get' returns; if the rule already does what the user asked, say so instead of updating it.

Errors are labelled: "RETRYABLE" means nothing was written and you should call again with corrected arguments.
`;

const RULE_FIELD_SET = new Set<string>(RULE_FIELDS);

type ParsedRuleConfig = { ok: true; value: schema["RuleType"] } | { ok: false; message: string };

/**
 * Parse a ruleConfig string into RuleType fields. Rejects keys the API does not have, so a guessed
 * shape fails here with the valid field list instead of reaching the API as an empty rule.
 */
function parseRuleConfig(ruleConfig: string): ParsedRuleConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ruleConfig);
  } catch {
    return { ok: false, message: "ruleConfig is not valid JSON." };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, message: "ruleConfig must be a JSON object of rule fields." };
  }
  // Accept the API's request envelope too, since it holds exactly one rule.
  const envelope = parsed as Record<string, unknown>;
  const fields = (
    Object.keys(envelope).length === 1 &&
    typeof (envelope.rule ?? envelope.ruleUpdate) === "object" &&
    (envelope.rule ?? envelope.ruleUpdate) !== null
      ? (envelope.rule ?? envelope.ruleUpdate)
      : envelope
  ) as Record<string, unknown>;

  const unknownKeys = Object.keys(fields).filter(key => !RULE_FIELD_SET.has(key));
  if (unknownKeys.length > 0) {
    return {
      ok: false,
      message: `ruleConfig has fields a rule does not have: ${unknownKeys.join(", ")}. Valid top-level fields are ${RULE_FIELDS.join(", ")}. Call 'get' on an existing rule to see the shape, and see the example in this tool's description.`,
    };
  }
  if (fields.triggers !== undefined && !Array.isArray(fields.triggers)) {
    return { ok: false, message: "ruleConfig.triggers must be an array of trigger objects." };
  }
  if (
    fields.action !== undefined &&
    (typeof fields.action !== "object" || fields.action === null || Array.isArray(fields.action))
  ) {
    return {
      ok: false,
      message: 'ruleConfig.action must be an object, e.g. {"audioPlaybackActions":[...]}.',
    };
  }
  if (fields.action !== undefined) {
    const problem = audioActionProblem(fields.action as Record<string, unknown>);
    if (problem) return { ok: false, message: problem };
  }
  return { ok: true, value: fields as schema["RuleType"] };
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(item => typeof item === "string" && item);
}

/**
 * The API accepts an audio action with no clip or no gateway and stores a rule that never makes a
 * sound; catch the shapes a model gets wrong before anything is written.
 */
function audioActionProblem(action: Record<string, unknown>): string | undefined {
  const plays = action.audioPlaybackActions;
  if (plays !== undefined) {
    if (!Array.isArray(plays)) return "ruleConfig.action.audioPlaybackActions must be an array.";
    for (const [index, play] of (plays as Record<string, unknown>[]).entries()) {
      const at = `audioPlaybackActions[${index}]`;
      if (typeof play !== "object" || play === null) return `${at} must be an object.`;
      if (typeof play.audioClipUuid !== "string" || !play.audioClipUuid) {
        return `${at}.audioClipUuid is required — a saved clip's uuid from audio-tool list-clips or create-tts-clip, never the clip's text.`;
      }
      if (!isNonEmptyStringArray(play.audioGateways)) {
        return `${at}.audioGateways must list at least one audio gateway uuid (the field is audioGateways, not audioGatewayUuids).`;
      }
      for (const field of ["loopDurationSec", "playCount"] as const) {
        const value = play[field];
        if (value !== undefined && value !== null && (!Number.isInteger(value) || (value as number) < 0)) {
          return `${at}.${field} must be a non-negative integer.`;
        }
      }
    }
  }
  const cancel = action.cancelLoopingAudioPlaybackAction;
  if (cancel !== undefined && cancel !== null) {
    if (typeof cancel !== "object" || Array.isArray(cancel)) {
      return 'ruleConfig.action.cancelLoopingAudioPlaybackAction must be an object: {"audioDevices":[...]}.';
    }
    if (!isNonEmptyStringArray((cancel as Record<string, unknown>).audioDevices)) {
      return "cancelLoopingAudioPlaybackAction.audioDevices must list at least one audio device uuid.";
    }
  }
  return undefined;
}

/** The ajar threshold of every door sensor a DOOR_AJAR trigger names, since that sets the delay. */
async function getDoorAjarSensorSettings(
  rule: schema["RuleType"],
  requestModifiers: RequestModifiers | undefined,
  sessionId: string | undefined
) {
  const sensorUuids = new Set<string>();
  for (const trigger of (rule.triggers ?? []) as Record<string, unknown>[]) {
    const activityEvent = trigger.activityEvent as { activityEvent?: string } | undefined;
    if (activityEvent?.activityEvent !== "DOOR_AJAR") continue;
    for (const uuid of (trigger.deviceUuids as (string | null)[] | undefined) ?? []) {
      if (uuid) sensorUuids.add(uuid);
    }
  }
  const results = await Promise.all(
    [...sensorUuids].map(uuid => getDoorSensorAjarSettings(uuid, requestModifiers, sessionId))
  );
  return results.flatMap(result => (result.success && result.settings ? [result.settings] : []));
}

const RUUID_PATTERN = /^[A-Za-z0-9_-]{22}$/;

/** A rule uuid the model retyped wrongly (too long, mixed from two uuids) fails here, not as an opaque HTTP 400. */
function badUuid(ruleUuid: string) {
  if (RUUID_PATTERN.test(ruleUuid)) return undefined;
  return createToolTextContent(
    `RETRYABLE — nothing was changed. "${ruleUuid}" is not a rule uuid (a uuid is exactly 22 letters, digits, "-" or "_"). Copy the uuid from 'list' or 'get' exactly.`
  );
}

function notFound(ruleUuid: string) {
  return createToolTextContent(
    `No rule in this organization has the uuid "${ruleUuid}". Use requestType 'list' to see the rules that exist — do not guess a uuid.`
  );
}

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case RulesToolRequestType.LIST: {
        const rules = await listRules(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ rules });
      }
      case RulesToolRequestType.GET: {
        if (!args.ruleUuid) {
          return createToolTextContent(JSON.stringify({ error: "ruleUuid is required for get." }));
        }
        const uuidProblem = badUuid(args.ruleUuid);
        if (uuidProblem) return uuidProblem;
        const rule = await getRule(args.ruleUuid, requestModifiers, sessionId);
        if (!rule) return notFound(args.ruleUuid);
        const doorSensorAjarSeconds = await getDoorAjarSensorSettings(
          rule,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          rule: {
            ...(rule as OUTPUT_SCHEMA["rule"]),
            ...(doorSensorAjarSeconds.length > 0 ? { doorSensorAjarSeconds } : {}),
          },
        });
      }
      case RulesToolRequestType.CREATE: {
        if (!args.ruleConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleConfig is required for create." })
          );
        }
        const parsed = parseRuleConfig(args.ruleConfig);
        if (!parsed.ok) {
          return createToolTextContent(`RETRYABLE — nothing was changed. ${parsed.message}`);
        }
        const config = parsed.value;
        if (args.ruleName) config.name = args.ruleName;
        if (!config.triggers?.length || !config.action) {
          return createToolTextContent(
            "RETRYABLE — nothing was changed. A new rule needs at least one trigger in ruleConfig.triggers and an action in ruleConfig.action."
          );
        }
        const rule = await createRule(config, requestModifiers, sessionId);
        // The first firing of a DOOR_AJAR rule waits for the sensor's own ajar delay; report it
        // with the new rule so the model can tell the user when the first announcement happens.
        const doorSensorAjarSeconds = await getDoorAjarSensorSettings(
          config,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          rule: {
            ...rule,
            name: config.name ?? undefined,
            ...(doorSensorAjarSeconds.length > 0 ? { doorSensorAjarSeconds } : {}),
          },
        });
      }
      case RulesToolRequestType.UPDATE: {
        if (!args.ruleUuid || !args.ruleConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid and ruleConfig are required for update." })
          );
        }
        // Validate before reading anything, so a malformed input costs no calls.
        const uuidProblem = badUuid(args.ruleUuid);
        if (uuidProblem) return uuidProblem;
        const parsed = parseRuleConfig(args.ruleConfig);
        if (!parsed.ok) {
          return createToolTextContent(`RETRYABLE — nothing was changed. ${parsed.message}`);
        }
        const changes: schema["RuleType"] = { ...parsed.value };
        if (args.ruleName) changes.name = args.ruleName;
        delete changes.uuid;
        delete changes.orgUuid;
        const changedFields = Object.keys(changes);
        if (changedFields.length === 0) {
          return createToolTextContent(
            "RETRYABLE — nothing was changed. ruleConfig has no fields to change."
          );
        }

        // The API replaces the stored rule with the one sent, so sending only the changed
        // fields would blank the others. Read first and merge.
        const existing = await getRule(args.ruleUuid, requestModifiers, sessionId);
        if (!existing) return notFound(args.ruleUuid);

        const merged: schema["RuleType"] = { ...existing, ...changes, uuid: args.ruleUuid };
        await updateRule(merged, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          rule: {
            uuid: args.ruleUuid,
            name: merged.name ?? undefined,
            success: true,
            changedFields,
          },
        });
      }
      case RulesToolRequestType.DELETE: {
        if (!args.ruleUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid is required for delete." })
          );
        }
        const uuidProblem = badUuid(args.ruleUuid);
        if (uuidProblem) return uuidProblem;
        const rule = await deleteRule(args.ruleUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ rule });
      }
      case RulesToolRequestType.GET_RECORDS: {
        if (!args.ruleUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid is required for get-records." })
          );
        }
        const uuidProblem = badUuid(args.ruleUuid);
        if (uuidProblem) return uuidProblem;
        const ruleRecords = await getRuleRecords(args.ruleUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ ruleRecords });
      }
      case RulesToolRequestType.LIST_AUDIO_CLIPS: {
        const audioClips = await listAudioClips(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ audioClips });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Automation Rules",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
