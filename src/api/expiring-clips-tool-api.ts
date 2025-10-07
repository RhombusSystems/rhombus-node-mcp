import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";
import { ToolArgs } from "../types/expiring-clips-tool-types.js";
import schema from "../types/schema.js";

export async function getExpiringClips(
  args: ToolArgs,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi<schema["Event_GetClipsWithProgressWSResponse"]>({
    route: "/event/getExpiringClipsForOrg",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  }).then(response => {
    if (response.error) return response;
    else
      return {
        ...response,
        savedClips: (response.savedClips || []).map((clip: any) => ({
          ...clip,
          createdAtTimestamp: clip.createdAtMs ? new Date(clip.createdAtMs).toISOString() : null,
        })),
      };
  });
}