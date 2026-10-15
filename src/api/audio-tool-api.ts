import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export type AudioClipMetadata = NonNullable<
  NonNullable<schema["Audioplayback_GetAudioUploadMetadataForOrgWSResponse"]["audioUploadMetadata"]>[number]
>;

export async function listAudioClipMetadata(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ clips: AudioClipMetadata[]; warningMsg?: string }> {
  const res = await postApi<schema["Audioplayback_GetAudioUploadMetadataForOrgWSResponse"]>({
    route: "/audioplayback/getAudioUploadMetadataForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return {
    clips: res.audioUploadMetadata?.flatMap(clip => (clip ? [clip] : [])) ?? [],
    warningMsg: res.warningMsg ?? undefined,
  };
}

export type TextToSpeechInput = {
  audioPlaintext?: string;
  audioSSML?: string;
  displayName: string;
  description?: string;
  voiceId?: string;
};

/**
 * Synthesizes the text with Amazon Polly and stores the clip. The API reports a bad SSML document
 * or a synthesis failure as flags on a non-error response, so those are turned into errors here.
 */
export async function createTextToSpeechClip(
  input: TextToSpeechInput,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ uuid: string; warningMsg?: string }> {
  const res = await postApi<schema["Audioplayback_UploadAudioTextWSResponse"]>({
    route: "/audioplayback/uploadAudioText",
    body: input satisfies schema["Audioplayback_UploadAudioTextWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);
  if (res.invalidSSML) {
    throw new Error("The text-to-speech service rejected the SSML document.");
  }
  if (res.synthesisFailure) {
    throw new Error("The text-to-speech service could not synthesize the text.");
  }
  if (res.encodingFailure) {
    throw new Error("The synthesized audio could not be encoded for the audio gateway.");
  }
  if (!res.uuid) {
    throw new Error("The text-to-speech service returned no clip uuid.");
  }
  return { uuid: res.uuid, warningMsg: res.warningMsg ?? undefined };
}

export async function deleteAudioClip(
  audioUploadUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Audioplayback_DeleteAudioUploadMetadataWSResponse"]>({
    route: "/audioplayback/deleteAudioUploadMetadata",
    body: { audioUploadUuid } satisfies schema["Audioplayback_DeleteAudioUploadMetadataWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { uuid: audioUploadUuid, success: true, warningMsg: res.warningMsg ?? undefined };
}

export async function playAudioClip(
  input: {
    audioUploadUuid: string;
    audioGatewayUuids: string[];
    playCount?: number;
    loopDurationSec?: number;
  },
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Audioplayback_PlayAudioUploadWSResponse"]>({
    route: "/audioplayback/playAudioUpload",
    body: input satisfies schema["Audioplayback_PlayAudioUploadWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: res.success ?? true, warningMsg: res.warningMsg ?? undefined };
}

export async function cancelLoopingAudio(
  audioDevices: string[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Audioplayback_CancelLoopingAudioPlaybackWSResponse"]>({
    route: "/audioplayback/cancelLoopingAudioPlayback",
    body: { audioDevices } satisfies schema["Audioplayback_CancelLoopingAudioPlaybackWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  const perDevice: Record<string, boolean> = {};
  for (const [uuid, ok] of Object.entries(res.successMap ?? {})) {
    perDevice[uuid] = ok === true;
  }
  return { perDevice, warningMsg: res.warningMsg ?? undefined };
}

/** Rules whose Play Audio action references the clip — deleting the clip would silence them. */
export async function findRulesUsingClip(
  clipUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ ruleUuid?: string; ruleName?: string }[]> {
  const res = await postApi<schema["Rules_GetRulesForOrgWSResponse"]>({
    route: "/rules/getRulesForOrg",
    body: {} satisfies schema["Rules_GetRulesForOrgWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (res.rules ?? []).flatMap(rule => {
    const uses = rule?.action?.audioPlaybackActions?.some(
      action => action?.audioClipUuid === clipUuid
    );
    return uses ? [{ ruleUuid: rule?.uuid ?? undefined, ruleName: rule?.name ?? undefined }] : [];
  });
}
