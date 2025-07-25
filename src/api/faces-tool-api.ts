import { postApi } from "../network.js";
import { GetFaceEventsArgs, GetRegisteredFacesArgs } from "../types/faces-tools-types.js";

// https://stackoverflow.com/questions/72165227/how-to-make-nullable-properties-optional-in-typescript
// nice :)
type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P]
}

type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P]
}

type OptionalNullable<T> = T extends object ? {
  [K in keyof PickNullable<T>]?: OptionalNullable<Exclude<T[K], null>>
} & {
  [K in keyof PickNotNullable<T>]: OptionalNullable<T[K]>
} : T;

export async function getFaceEvents(
  args: GetFaceEventsArgs,
  requestModifiers?: any,
  sessionId?: string
) {
  let allFaceEvents: any[] = [];
  let currentArgs = { ...args };
  let hasMore = true;
  let lastResponse: any = null;

  while (hasMore) {
    // Filter out empty/undefined fields from currentArgs
    // OptionalNullable so that we can remove some fields before returning them to the MCP client
    const filteredArgs = { ...currentArgs } as OptionalNullable<typeof currentArgs>;

    if (filteredArgs.pageRequest) {
      if (filteredArgs.pageRequest.lastEvaluatedKey === "") {
        delete filteredArgs.pageRequest.lastEvaluatedKey;
      }
    }

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

    lastResponse = response;

    // Filter the faceEvents to only include the specified fields
    if (response && response.faceEvents) {
      const filteredEvents = response.faceEvents.map((event: any) => ({
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

      allFaceEvents.push(...filteredEvents);

      // Check if we should continue pagination
      if (response.faceEvents.length === 100 && response.lastEvaluatedKey) {
        // Update the pageRequest for the next iteration
        currentArgs = {
          ...currentArgs,
          pageRequest: {
            maxPageSize: currentArgs.pageRequest?.maxPageSize || 100,
            lastEvaluatedKey: response.lastEvaluatedKey,
          },
        };
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  // Return the response with all combined face events
  return {
    ...lastResponse,
    faceEvents: allFaceEvents,
  };
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
