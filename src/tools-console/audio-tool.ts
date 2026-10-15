import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type AudioClipMetadata,
  cancelLoopingAudio,
  createTextToSpeechClip,
  deleteAudioClip,
  findRulesUsingClip,
  listAudioClipMetadata,
  playAudioClip,
} from "../api/audio-tool-api.js";
import {
  AudioToolRequestType,
  CADENCE_TOLERANCE_SEC,
  DEFAULT_VOICE_ID,
  MAX_REPEAT_EVERY_SEC,
  MIN_REPEAT_EVERY_SEC,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
  BREAK_RENDER_FACTOR,
  buildPaddedSsml,
  clipText,
  correctedSilenceMs,
  estimateSpeechSeconds,
  isLoopable,
  nominalSilenceMs,
} from "../types/audio-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
  type RequestModifiers,
} from "../util.js";

const TOOL_NAME = "audio-tool";

const TOOL_DESCRIPTION = `
Audio clips and playback on Rhombus audio devices (A100 audio gateways, badge readers and doorbells with speakers).

Modes, set by "requestType":
- ${AudioToolRequestType.LIST_CLIPS}: the organization's saved clips (uploads and text-to-speech) with uuid, spoken text and length.
- ${AudioToolRequestType.CREATE_TTS_CLIP}: make a spoken clip from text (Amazon Polly). Requires text and displayName. Optional repeatEverySec pads the clip with silence so that a LOOPED playback repeats the message on that cadence — e.g. repeatEverySec 30 makes "the Lobby door is open" play once every 30 seconds while the loop runs. Returns the clip uuid for a rule's audioPlaybackActions or for 'play'.
- ${AudioToolRequestType.DELETE_CLIP}: delete a clip. Refuses when a rule still references it unless confirmDeleteInUse is true.
- ${AudioToolRequestType.PLAY}: play a clip now on audio gateways. playCount 0 loops until 'stop'; loopDurationSec caps a loop. This is heard on site immediately — confirm with the user first.
- ${AudioToolRequestType.STOP}: stop looping playback on the given audio devices (every loop on them, whatever started it).

Facts that shape a plan:
- A clip's words are fixed when it is made; there is no live text-to-speech. A message that names a door, room or person needs one clip per name.
- Only short clips loop: the gateway refuses to loop more than about 25 seconds of SPEECH (silence padding is nearly free). Keep spoken text to one short sentence.
- Rule-triggered playback of the same clip on the same gateway is rate-limited to once per clip length + 1 s; a loop started by a rule is stopped by a rule with cancelLoopingAudioPlaybackAction (see rules-tool).
- For "announce which door is open on the speakers at that door's location, repeating until it closes", call get-workflows (door-ajar-announcements) first.
`;

type Clip = NonNullable<OUTPUT_SCHEMA["clips"]>[number];

function mapClip(clip: AudioClipMetadata, speechSec?: number): Clip {
  const durationMs = clip.durationMs ?? undefined;
  return {
    uuid: clip.uuid ?? undefined,
    displayName: clip.displayName ?? undefined,
    description: clip.description ?? undefined,
    text: clipText(clip),
    voiceId: clip.voiceId ?? undefined,
    durationMs,
    durationSec: durationMs == null ? undefined : Math.round(durationMs / 100) / 10,
    textToSpeech: !!(clip.audioPlaintext || clip.audioSSML),
    loopable: isLoopable(durationMs, speechSec),
  };
}

async function findStoredClip(
  uuid: string,
  requestModifiers: RequestModifiers | undefined,
  sessionId: string | undefined
) {
  const { clips } = await listAudioClipMetadata(requestModifiers, sessionId);
  return clips.find(clip => clip.uuid === uuid);
}

function retryable(message: string) {
  return createToolTextContent(`RETRYABLE — nothing was changed. ${message}`);
}

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case AudioToolRequestType.LIST_CLIPS: {
        const { clips, warningMsg } = await listAudioClipMetadata(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          clips: clips.map(clip => mapClip(clip)),
          warningMsg,
          note:
            clips.length === 0
              ? "This organization has no saved audio clips. Make one with requestType 'create-tts-clip'."
              : undefined,
        });
      }

      case AudioToolRequestType.CREATE_TTS_CLIP: {
        const text = args.text?.trim();
        const displayName = args.displayName?.trim();
        if (!text) return retryable("text is required for 'create-tts-clip'.");
        if (!displayName) return retryable("displayName is required for 'create-tts-clip'.");
        if (/<[a-z/!?]/i.test(text)) {
          return retryable("text must be plain words, not SSML or HTML — the tool adds the markup.");
        }
        const voiceId = args.voiceId?.trim() || undefined;
        const description = args.description?.trim() || undefined;
        const repeatEverySec = args.repeatEverySec ?? undefined;

        if (repeatEverySec == null) {
          const { uuid, warningMsg } = await createTextToSpeechClip(
            { audioPlaintext: text, displayName, description, voiceId },
            requestModifiers,
            sessionId
          );
          const stored = await findStoredClip(uuid, requestModifiers, sessionId);
          const speechSec = stored?.durationMs == null ? undefined : stored.durationMs / 1000;
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            clip: stored
              ? mapClip(stored, speechSec)
              : { uuid, displayName, text, voiceId: voiceId ?? DEFAULT_VOICE_ID, textToSpeech: true },
            warningMsg,
          });
        }

        if (repeatEverySec < MIN_REPEAT_EVERY_SEC || repeatEverySec > MAX_REPEAT_EVERY_SEC) {
          return retryable(
            `repeatEverySec must be between ${MIN_REPEAT_EVERY_SEC} and ${MAX_REPEAT_EVERY_SEC} seconds (received ${repeatEverySec}).`
          );
        }
        const speechEstimateSec = estimateSpeechSeconds(text);
        if (speechEstimateSec > repeatEverySec - CADENCE_TOLERANCE_SEC) {
          return retryable(
            `The text takes about ${speechEstimateSec.toFixed(1)} s to say, which does not fit a ${repeatEverySec} s cadence. Shorten the text or raise repeatEverySec.`
          );
        }

        // First pass pads from the estimate; the clip is then measured and, if the measured
        // period misses the cadence, made once more with the padding corrected by the miss.
        let silenceMs = nominalSilenceMs(repeatEverySec - speechEstimateSec);
        let attempt = await createTextToSpeechClip(
          { audioSSML: buildPaddedSsml(text, silenceMs), displayName, description, voiceId },
          requestModifiers,
          sessionId
        );
        let stored = await findStoredClip(attempt.uuid, requestModifiers, sessionId);
        let resynthesized = false;
        let note: string | undefined;

        const measuredSec = stored?.durationMs == null ? undefined : stored.durationMs / 1000;
        if (measuredSec != null && Math.abs(measuredSec - repeatEverySec) > CADENCE_TOLERANCE_SEC) {
          const nextSilenceMs = correctedSilenceMs(
            silenceMs,
            speechEstimateSec,
            measuredSec,
            repeatEverySec
          );
          if (nextSilenceMs < 0) {
            note = `The spoken text alone lasts ${measuredSec.toFixed(1)} s, longer than the ${repeatEverySec} s cadence, so a loop repeats every ${measuredSec.toFixed(1)} s. Shorten the text for a ${repeatEverySec} s cadence.`;
          } else {
            await deleteAudioClip(attempt.uuid, requestModifiers, sessionId);
            silenceMs = nextSilenceMs;
            attempt = await createTextToSpeechClip(
              { audioSSML: buildPaddedSsml(text, silenceMs), displayName, description, voiceId },
              requestModifiers,
              sessionId
            );
            stored = await findStoredClip(attempt.uuid, requestModifiers, sessionId);
            resynthesized = true;
            const secondSec = stored?.durationMs == null ? undefined : stored.durationMs / 1000;
            if (secondSec != null && Math.abs(secondSec - repeatEverySec) > CADENCE_TOLERANCE_SEC) {
              note = `The clip came out ${secondSec.toFixed(1)} s long, so a loop repeats every ${secondSec.toFixed(1)} s rather than every ${repeatEverySec} s.`;
            }
          }
        }

        const finalSec = stored?.durationMs == null ? undefined : stored.durationMs / 1000;
        const renderedSilenceSec = (silenceMs / 1000) * BREAK_RENDER_FACTOR;
        const speechSec =
          finalSec == null ? speechEstimateSec : Math.max(0, finalSec - renderedSilenceSec);
        const clip: NonNullable<OUTPUT_SCHEMA["clip"]> = {
          ...(stored
            ? mapClip(stored, speechSec)
            : {
                uuid: attempt.uuid,
                displayName,
                text,
                voiceId: voiceId ?? DEFAULT_VOICE_ID,
                textToSpeech: true,
              }),
          repeatEverySec,
          resynthesized,
        };
        if (clip.loopable === false) {
          note = `${note ? `${note} ` : ""}This clip is too long for the audio gateway to loop; a looping playback of it plays once. Shorten the text.`;
        }
        return createToolStructuredContent<OUTPUT_SCHEMA>({ clip, note, warningMsg: attempt.warningMsg });
      }

      case AudioToolRequestType.DELETE_CLIP: {
        if (!args.clipUuid) return retryable("clipUuid is required for 'delete-clip'.");
        const usedBy = await findRulesUsingClip(args.clipUuid, requestModifiers, sessionId);
        if (usedBy.length > 0 && !args.confirmDeleteInUse) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            usedBy,
            note:
              `NOT DELETED — nothing was changed. ${usedBy.length} ${usedBy.length === 1 ? "rule still references" : "rules still reference"} this clip: ` +
              `${usedBy.map(rule => rule.ruleName ?? rule.ruleUuid).join(", ")}. Deleting it leaves those rules with nothing to play. ` +
              "Tell the user which rules are affected and ask them to confirm, then call again with confirmDeleteInUse: true (or delete the rules first).",
          });
        }
        const deleted = await deleteAudioClip(args.clipUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted: { uuid: deleted.uuid, success: deleted.success },
          usedBy: usedBy.length > 0 ? usedBy : undefined,
          warningMsg: deleted.warningMsg,
        });
      }

      case AudioToolRequestType.PLAY: {
        if (!args.clipUuid) return retryable("clipUuid is required for 'play'.");
        const audioGatewayUuids = (args.audioGatewayUuids ?? []).filter(Boolean);
        if (audioGatewayUuids.length === 0) {
          return retryable("audioGatewayUuids must name at least one audio device for 'play'.");
        }
        const playCount = args.playCount ?? undefined;
        const loopDurationSec = args.loopDurationSec ?? undefined;
        if (playCount != null && playCount < 0) return retryable("playCount cannot be negative.");
        if (loopDurationSec != null && loopDurationSec < 0) {
          return retryable("loopDurationSec cannot be negative.");
        }
        const loops = playCount === 0 || (playCount ?? 1) > 1 || (loopDurationSec ?? 0) > 0;
        let note: string | undefined;
        if (loops) {
          const stored = await findStoredClip(args.clipUuid, requestModifiers, sessionId);
          if (stored && isLoopable(stored.durationMs ?? undefined) === false) {
            note =
              "This clip is too long for the audio gateway to loop, so it will play once. Use a shorter clip to loop.";
          }
        }
        const { success, warningMsg } = await playAudioClip(
          { audioUploadUuid: args.clipUuid, audioGatewayUuids, playCount, loopDurationSec },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          played: { success, clipUuid: args.clipUuid, audioGatewayUuids, playCount, loopDurationSec },
          note,
          warningMsg,
        });
      }

      case AudioToolRequestType.STOP: {
        const audioGatewayUuids = (args.audioGatewayUuids ?? []).filter(Boolean);
        if (audioGatewayUuids.length === 0) {
          return retryable("audioGatewayUuids must name at least one audio device for 'stop'.");
        }
        const { perDevice, warningMsg } = await cancelLoopingAudio(
          audioGatewayUuids,
          requestModifiers,
          sessionId
        );
        const failed = audioGatewayUuids.filter(uuid => perDevice[uuid] !== true);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          stopped: { perDevice },
          note:
            failed.length > 0
              ? `${failed.length} of ${audioGatewayUuids.length} devices did not acknowledge the stop (offline, or nothing was looping): ${failed.join(", ")}.`
              : undefined,
          warningMsg,
        });
      }
    }
  } catch (error: unknown) {
    return createToolStructuredContent<OUTPUT_SCHEMA>({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({
    error: `Invalid requestType. Valid values are: ${Object.values(AudioToolRequestType).join(", ")}.`,
  });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Audio Clips & Playback",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
