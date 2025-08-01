import { z } from "zod";

export enum RequestType {
  GET_FACE_EVENTS = "get-face-events",
  GET_REGISTERED_FACES = "get-registered-faces",
}

export const GetRegisteredFacesArgsSchema = z.object({
  requestType: z.literal(RequestType.GET_REGISTERED_FACES),
});
export type GetRegisteredFacesArgs = z.infer<typeof GetRegisteredFacesArgsSchema>;

export const GetFaceEventsArgs = z.object({
  pageRequest: z
    .object({
      lastEvaluatedKey: z
        .string()
        .nullable()
        .describe("The last evaluated key from a previous pagination request"),
      maxPageSize: z
        .number()
        .nullable()
        .describe("Maximum number of results to return per page. Default to around 100."),
    })
    .nullable()
    .describe("Pagination parameters for the request"),
  searchFilter: z
    .object({
      // TODO: this is causing the AI to call the tool incorrectly and always pass in deviceUUIDs. We'll leave
      // the filtering of this to the AI for now.
      // deviceUuids: z
      //   .array(z.string())
      //   .describe(
      //     "Optional filter by a set of device UUIDs. Only face events from these devices will be returned. An empty array will be the same as omitting the filter. The strings are always 22 characters long."
      //   ),
      faceNameContains: z
        .string()
        .nullable()
        .describe(
          "Optional filter for face events where the detected face's name contains this substring. The search is performed only if the value is at least 3 characters long after trimming spaces. This takes precedence over 'faceNames' if both are specified. This is case-sensitive."
        ),
      faceNames: z.array(z.string()).describe(
        `Optional filter by a set of specific person names. Only face events associated with these names will be returned. An empty array will be the same as omitting the filter.
          This is case-sensitive.`
      ),
      hasEmbedding: z
        .boolean()
        .nullable()
        .describe(
          "Optional filter by the presence (true) or absence (false) of a face embedding associated with the event."
        ),
      hasName: z
        .boolean()
        .nullable()
        .describe(
          "Optional filter by the presence (true) or absence (false) of a person name associated with the face event."
        ),
      labels: z
        .array(z.string())
        .describe(
          "Optional filter by a set of labels associated with the face event. An empty array will be the same as omitting the filter."
        ),
      locationUuids: z
        .array(z.string())
        .describe(
          "Optional filter by a set of location UUIDs. Only face events from these locations will be returned. An empty array will be the same as omitting the filter. These are always 22 characters long."
        ),
      personUuids: z
        .array(z.string())
        .describe(
          "Optional filter by a set of person UUIDs. Only face events associated with these specific people will be returned. An empty array will be the same as omitting the filter. These are always 22 characters long."
        ),
      timestampFilter: z
        .object({
          rangeEnd: z
            .number()
            .nullable()
            .describe(
              "The end of the time range (inclusive) for filtering face events. Expected format is a timestamp in milliseconds. If not specified, the filter defaults to the last 7 days."
            ),
          rangeStart: z
            .number()
            .nullable()
            .describe(
              "The start of the time range (inclusive) for filtering face events. Expected format is a timestamp in milliseconds. If not specified, the filter defaults to the last 7 days."
            ),
        })
        .nullable()
        .describe("Time range filter for face events"),
    })
    .nullable()
    .describe("Search criteria for filtering face events"),
});
export type GetFaceEventsArgs = z.infer<typeof GetFaceEventsArgs>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RequestType),
  faceEventFilter: GetFaceEventsArgs,
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  requestType: z.nativeEnum(RequestType),
  getFaceEventsResponse: z
    .optional(
      z.array(
        z.object({
          deviceUuid: z.optional(z.string()),
          eventTimestampMs: z.number(),
          eventTimestamp: z.optional(z.string()),
          faceName: z.optional(z.string()),
          locationUuid: z.optional(z.string()),
          personUuid: z.optional(z.string()),
          selectedPersonMatch: z.optional(
            z.object({
              confidence: z.number(),
              faceId: z.optional(z.string()),
              name: z.optional(z.string()),
              uuid: z.optional(z.string()),
            })
          ),
          thumbnailS3Key: z.optional(z.string()),
          topPersonMatches: z.optional(
            z.array(
              z.object({
                confidence: z.number(),
                faceId: z.optional(z.string()),
                name: z.optional(z.string()),
                uuid: z.optional(z.string()),
              })
            )
          ),
          uuid: z.optional(z.string()),
        })
      )
    )
    .describe("A list of all people seen over the given time period."),
  getSavedFacesResponse: z
    .optional(
      z.array(
        z.object({
          createdOn: z.optional(z.number()),
          name: z.optional(z.string()),
          orgUuid: z.optional(z.string()),
          updatedOn: z.optional(z.number()),
          uuid: z.optional(z.string()),
        })
      )
    )
    .describe(
      "A list of all people (registered faces) currently known to the Rhombus system for your organization."
    ),
  error: z.optional(z.string()),
});
