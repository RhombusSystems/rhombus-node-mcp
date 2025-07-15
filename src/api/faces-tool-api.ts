import { postApi } from "../network.js";
import { GetFaceEventsArgs, GetRegisteredFacesArgs } from "../types/faces-tools-types.js";

export async function getFaceEvents(
  args: GetFaceEventsArgs,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi({
    route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  });
}

export async function getRegisteredFaces(
  _args: GetRegisteredFacesArgs,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi({
    route: "/faceRecognition/person/findPeopleByOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}
