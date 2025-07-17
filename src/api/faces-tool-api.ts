import { postApi } from "../network.js";
import { GetFaceEventsArgs, GetRegisteredFacesArgs } from "../types/faces-tools-types.js";

export async function getFaceEvents(
  args: GetFaceEventsArgs,
  requestModifiers?: any,
  sessionId?: string
) {
  // Filter out empty/undefined fields from args
  const filteredArgs = { ...args };

  if (filteredArgs.searchFilter) {
    // Remove empty arrays
    if (
      filteredArgs.searchFilter.deviceUuids &&
      filteredArgs.searchFilter.deviceUuids.length === 0
    ) {
      delete filteredArgs.searchFilter.deviceUuids;
    }
    if (filteredArgs.searchFilter.faceNames && filteredArgs.searchFilter.faceNames.length === 0) {
      delete filteredArgs.searchFilter.faceNames;
    }
    if (filteredArgs.searchFilter.labels && filteredArgs.searchFilter.labels.length === 0) {
      delete filteredArgs.searchFilter.labels;
    }

    // Remove empty strings
    if (filteredArgs.searchFilter.faceNameContains === "") {
      delete filteredArgs.searchFilter.faceNameContains;
    }

    // Remove false booleans
    if (filteredArgs.searchFilter.hasEmbedding === false) {
      delete filteredArgs.searchFilter.hasEmbedding;
    }
    if (filteredArgs.searchFilter.hasName === false) {
      delete filteredArgs.searchFilter.hasName;
    }
  }

  const response = await postApi({
    route: "/faceRecognition/faceEvent/findFaceEventsByOrg",
    body: filteredArgs,
    modifiers: requestModifiers,
    sessionId,
  });

  // Filter the faceEvents to only include the specified fields
  if (response && response.faceEvents) {
    response.faceEvents = response.faceEvents.map((event: any) => ({
      deviceUuid: event.deviceUuid,
      eventTimestamp: event.eventTimestamp,
      faceName: event.faceName,
      locationUuid: event.locationUuid,
      personUuid: event.personUuid,
      selectedPersonMatch: event.selectedPersonMatch,
      thumbnailS3Key: event.thumbnailS3Key,
      topPersonMatches: event.topPersonMatches,
      uuid: event.uuid,
    }));
  }

  return response;
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
