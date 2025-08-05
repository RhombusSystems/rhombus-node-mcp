import { postApi } from "../network.js";
import { ApiPayload } from "../types/clips-tool-types.js";

export async function getSavedClips(args: ApiPayload, requestModifiers?: any, sessionId?: string) {
  return await postApi({
    route: "/event/getClipsWithProgress",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    if (response.error) return response;
    else
      return (
        response.savedClips?.map((clip: any) => ({
          ...clip,
          createdAtTimestamp: clip.createdAtMs ? new Date(clip.createdAtMs).toISOString() : null,
        })) ?? []
      );
  });
}
