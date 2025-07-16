import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

export async function getLocations(requestModifiers?: RequestModifiers, sessionId?: string) {
  return await postApi({
    route: "/location/getLocationsV2",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}
