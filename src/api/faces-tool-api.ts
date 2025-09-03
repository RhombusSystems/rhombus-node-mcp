import { postApi } from "../network.js";
import { GetFaceEventsArgs, GetRegisteredFacesArgs } from "../types/faces-tools-types.js";
import { logger } from "./../logger.js";
import { formatTimestamp } from "../util.js";
import { removeNulls } from "../utils/remove-nulls.js";
import schema from "../types/schema.js";
// https://stackoverflow.com/questions/72165227/how-to-make-nullable-properties-optional-in-typescript
// nice :)
type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

type OptionalNullable<T> = T extends object
  ? {
      [K in keyof PickNullable<T>]?: OptionalNullable<Exclude<T[K], null>>;
    } & {
      [K in keyof PickNotNullable<T>]: OptionalNullable<T[K]>;
    }
  : T;

export async function getFaceEvents(
  args: GetFaceEventsArgs,
  timeZone: string,
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
    let filteredArgs = { ...currentArgs } as OptionalNullable<typeof currentArgs>;

    if (filteredArgs.pageRequest) {
      if (filteredArgs.pageRequest.lastEvaluatedKey === "") {
        delete filteredArgs.pageRequest.lastEvaluatedKey;
      }
    }

    if (filteredArgs.searchFilter) {
      // Remove empty arrays
      // if (
      //   filteredArgs.searchFilter.deviceUuids &&
      //   filteredArgs.searchFilter.deviceUuids.length === 0
      // ) {
      //   // @ts-expect-error - we can break typing
      //   delete filteredArgs.searchFilter.deviceUuids;
      // }
      if (filteredArgs.searchFilter.faceNames && filteredArgs.searchFilter.faceNames.length === 0) {
        // @ts-expect-error - we can break typing
        delete filteredArgs.searchFilter.faceNames;
      }
      if (filteredArgs.searchFilter.labels && filteredArgs.searchFilter.labels.length === 0) {
        // @ts-expect-error - we can break typing
        delete filteredArgs.searchFilter.labels;
      }

      // Remove empty strings
      // if (filteredArgs.searchFilter.faceNameContains === "") {
      //   delete filteredArgs.searchFilter.faceNameContains;
      // }

      // Remove false booleans
      if (filteredArgs.searchFilter.hasEmbedding === false) {
        delete filteredArgs.searchFilter.hasEmbedding;
      }
      if (filteredArgs.searchFilter.hasName === false) {
        delete filteredArgs.searchFilter.hasName;
      }

      // if there is no timestampFilter, we can remove it
      // rangeEnd and rangeStart are ISO 8601 strings
      if (filteredArgs.searchFilter.timestampFilter) {
        if (filteredArgs.searchFilter.timestampFilter.rangeEnd === null) {
          delete filteredArgs.searchFilter.timestampFilter.rangeEnd;
        }
        if (filteredArgs.searchFilter.timestampFilter.rangeStart === null) {
          delete filteredArgs.searchFilter.timestampFilter.rangeStart;
        }
      }
    }

    // one last sweep of null values
    console.log("filteredArgs", filteredArgs);
    filteredArgs = removeNulls(filteredArgs);

    const response = await postApi<
      schema["Facerecognition_faceevent_FindFaceEventsByOrgWSResponse"]
    >({
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
        eventTimestampMs: event.eventTimestamp,
        eventTimestamp: formatTimestamp(event.eventTimestamp, timeZone),
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

  return allFaceEvents;
}

export async function getRegisteredFaces(
  _args: GetRegisteredFacesArgs,
  requestModifiers?: any,
  sessionId?: string
) {
  return await postApi<schema["Facerecognition_person_FindPeopleByOrgWSResponse"]>({
    route: "/faceRecognition/person/findPeopleByOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
}
