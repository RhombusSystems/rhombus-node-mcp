import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

export async function getOrg(requestModifiers?: RequestModifiers, sessionId?: string) {
  return await postApi<any>({
    route: "/org/getOrgV2",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}
