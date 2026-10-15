import { z } from "zod";

export enum AudioToolRequestType {
  LIST_CLIPS = "list-clips",
  CREATE_TTS_CLIP = "create-tts-clip",
  DELETE_CLIP = "delete-clip",
  PLAY = "play",
  STOP = "stop",
}

/**
 * The video relay refuses to loop an opus stream larger than this and plays it once instead
 * (rhombus-cloud-video InternalDeviceDirectController.MAX_BYTES_FOR_LOOPING). Clips are encoded
 * at 96 kbps VBR, so speech costs ~11 KB/s while silence is nearly free.
 */
export const MAX_LOOPABLE_CLIP_BYTES = 250 * 1024;
export const SPEECH_BYTES_PER_SEC = 11_000;
export const SILENCE_BYTES_PER_SEC = 800;

export const MIN_REPEAT_EVERY_SEC = 5;
export const MAX_REPEAT_EVERY_SEC = 300;
/** Polly caps a single <break> at 10 s; longer pauses are chained. */
export const MAX_BREAK_MS = 10_000;
/** If the measured clip is further than this from the requested cadence, synthesize once more. */
export const CADENCE_TOLERANCE_SEC = 1;
/**
 * A <break> comes out of this pipeline 4/3 as long as its nominal time (measured 2026-10-15 on
 * api2 ITG with voice Matthew: 20 s of breaks → 26.7 s, 30 s → 40.0 s of silence, speech
 * unaffected). The first pass pads with this in mind; the measured clip then corrects any drift.
 */
export const BREAK_RENDER_FACTOR = 4 / 3;
export const DEFAULT_VOICE_ID = "Matthew";

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(AudioToolRequestType)
    .describe("The audio operation to perform."),
  clipUuid: z
    .string()
    .nullable()
    .describe("The audio clip's uuid. Required for 'delete-clip' and 'play'."),
  text: z
    .string()
    .nullable()
    .describe(
      "'create-tts-clip': the words to speak, as plain text (no SSML). One short sentence, e.g. \"Attention: the Lobby door is open.\""
    ),
  displayName: z
    .string()
    .nullable()
    .describe("'create-tts-clip': the clip's name in the Console. Required."),
  description: z.string().nullable().describe("'create-tts-clip': optional note stored with the clip."),
  voiceId: z
    .string()
    .nullable()
    .describe(
      `'create-tts-clip': Amazon Polly voice id — e.g. ${DEFAULT_VOICE_ID} (default, US English male), Joanna (US English female), Amy (British), Lupe (US Spanish). An unknown id falls back to ${DEFAULT_VOICE_ID}.`
    ),
  repeatEverySec: z
    .number()
    .int()
    .nullable()
    .describe(
      `'create-tts-clip': pad the end of the clip with silence so that, when a rule or 'play' LOOPS it, the message is heard once every this many seconds (${MIN_REPEAT_EVERY_SEC}–${MAX_REPEAT_EVERY_SEC}). The tool measures the synthesized clip and corrects the padding once. Omit for a clip with no padding.`
    ),
  audioGatewayUuids: z
    .array(z.string())
    .nullable()
    .describe("'play' / 'stop': the audio gateways (or other audio devices) to play on or to silence."),
  playCount: z
    .number()
    .int()
    .nullable()
    .describe("'play': how many times to play the clip. 0 = loop until 'stop'. Default 1."),
  loopDurationSec: z
    .number()
    .int()
    .nullable()
    .describe(
      "'play': keep looping the clip for this many seconds. With playCount, whichever limit is reached first ends the loop."
    ),
  confirmDeleteInUse: z
    .boolean()
    .nullable()
    .describe(
      "'delete-clip': a clip that rules still reference is not deleted by default; the response lists those rules. Set true to delete anyway after telling the user which rules lose their clip."
    ),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const CLIP_OUTPUT = z.object({
  uuid: z.string().optional(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  text: z.string().optional().describe("The spoken words of a text-to-speech clip."),
  voiceId: z.string().optional(),
  durationMs: z.number().optional(),
  durationSec: z.number().optional().describe("Clip length in seconds (one play of the clip)."),
  textToSpeech: z.boolean().optional().describe("True when the clip was synthesized from text."),
  loopable: z
    .boolean()
    .optional()
    .describe(
      "False when the clip is too long for the audio gateway to loop; a looping playback of it plays once."
    ),
});

export const OUTPUT_SCHEMA = z.object({
  clips: z.array(CLIP_OUTPUT).optional().describe("The organization's saved audio clips."),
  clip: CLIP_OUTPUT.extend({
    repeatEverySec: z
      .number()
      .optional()
      .describe("The cadence that was requested; durationSec is the cadence a loop actually gives."),
    resynthesized: z
      .boolean()
      .optional()
      .describe("True when the first synthesis missed the cadence and the clip was made again."),
  })
    .optional()
    .describe("The clip 'create-tts-clip' made."),
  deleted: z.object({ uuid: z.string().optional(), success: z.boolean().optional() }).optional(),
  usedBy: z
    .array(z.object({ ruleUuid: z.string().optional(), ruleName: z.string().optional() }))
    .optional()
    .describe("Rules whose Play Audio action references the clip."),
  played: z
    .object({
      success: z.boolean().optional(),
      clipUuid: z.string().optional(),
      audioGatewayUuids: z.array(z.string()).optional(),
      playCount: z.number().optional(),
      loopDurationSec: z.number().optional(),
    })
    .optional(),
  stopped: z
    .object({
      perDevice: z
        .record(z.string(), z.boolean())
        .optional()
        .describe("Whether each audio device acknowledged the stop."),
    })
    .optional(),
  note: z.string().optional().describe("A caveat about this result that the user needs to be told."),
  warningMsg: z.string().optional().describe("A warning from the Rhombus API — the call succeeded, with a caveat."),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;

// ---------------------------------------------------------------------------
// Text-to-speech cadence padding
// ---------------------------------------------------------------------------

/**
 * Rough length of the spoken text at Polly's default rate (~145 words/min), plus lead-in.
 * Only a starting point: the clip is measured after synthesis and corrected.
 */
export function estimateSpeechSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return 0.6 + words * 0.42;
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Chained <break> tags adding up to silenceMs, none longer than Polly's 10 s cap. */
export function buildBreaks(silenceMs: number): string {
  let remaining = Math.max(0, Math.round(silenceMs));
  const breaks: string[] = [];
  while (remaining > 0) {
    const chunk = Math.min(remaining, MAX_BREAK_MS);
    breaks.push(chunk % 1000 === 0 ? `<break time="${chunk / 1000}s"/>` : `<break time="${chunk}ms"/>`);
    remaining -= chunk;
  }
  return breaks.join("");
}

/**
 * The speech wrapped the same way the API wraps plain text (the drc effect keeps it loud on a
 * gateway), followed by the silence that sets the loop cadence.
 */
export function buildPaddedSsml(text: string, silenceMs: number): string {
  return `<speak><amazon:effect name="drc">${escapeXml(text.trim())}</amazon:effect>${buildBreaks(silenceMs)}</speak>`;
}

/** Spoken words of a clip: the plain text, or the SSML with its tags removed. */
export function clipText(clip: { audioPlaintext?: string | null; audioSSML?: string | null }): string | undefined {
  if (clip.audioPlaintext) return clip.audioPlaintext;
  if (clip.audioSSML) {
    const stripped = clip.audioSSML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return stripped || undefined;
  }
  return undefined;
}

/** Nominal break time that renders as the wanted silence. */
export function nominalSilenceMs(wantedSilenceSec: number): number {
  return Math.max(0, Math.round((wantedSilenceSec * 1000) / BREAK_RENDER_FACTOR));
}

/**
 * Second-pass padding once the first clip has been measured: scale the miss by how much silence
 * each nominal second actually produced (falls back to the measured factor when the first pass
 * had no padding to learn from).
 */
export function correctedSilenceMs(
  silenceMs: number,
  speechEstimateSec: number,
  measuredSec: number,
  targetSec: number
): number {
  const renderedSilenceSec = Math.max(0, measuredSec - speechEstimateSec);
  const perNominalSec = silenceMs > 0 ? renderedSilenceSec / (silenceMs / 1000) : BREAK_RENDER_FACTOR;
  const factor = perNominalSec > 0.2 ? perNominalSec : BREAK_RENDER_FACTOR;
  return Math.round(silenceMs + ((targetSec - measuredSec) * 1000) / factor);
}

export function estimateOpusBytes(speechSec: number, silenceSec: number): number {
  return speechSec * SPEECH_BYTES_PER_SEC + silenceSec * SILENCE_BYTES_PER_SEC;
}

/**
 * Whether the gateway will loop the clip. Without the text we have to assume the whole clip is
 * speech, which is the conservative reading.
 */
export function isLoopable(durationMs: number | undefined, speechSec?: number): boolean | undefined {
  if (durationMs == null) return undefined;
  const totalSec = durationMs / 1000;
  const speech = speechSec == null ? totalSec : Math.min(speechSec, totalSec);
  return estimateOpusBytes(speech, totalSec - speech) <= MAX_LOOPABLE_CLIP_BYTES;
}
