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
        .optional()
        .describe("The last evaluated key from a previous pagination request"),
      maxPageSize: z
        .number()
        .optional()
        .describe("Maximum number of results to return per page")
        .default(100),
    })
    .optional()
    .describe("Pagination parameters for the request"),
  searchFilter: z
    .object({
      deviceUuids: z
        .array(z.string())
        .optional()
        .describe(
          "Optional filter by a set of device UUIDs. Only face events from these devices will be returned."
        ),
      faceNameContains: z
        .string()
        .optional()
        .describe(
          "Optional filter for face events where the detected face's name contains this substring. The search is performed only if the value is at least 3 characters long after trimming spaces. This takes precedence over 'faceNames' if both are specified."
        ),
      faceNames: z
        .array(z.string())
        .optional()
        .describe(
          "Optional filter by a set of specific person names. Only face events associated with these names will be returned."
        ),
      hasEmbedding: z
        .boolean()
        .optional()
        .describe(
          "Optional filter by the presence (true) or absence (false) of a face embedding associated with the event."
        ),
      hasName: z
        .boolean()
        .optional()
        .describe(
          "Optional filter by the presence (true) or absence (false) of a person name associated with the face event."
        ),
      labels: z
        .array(z.string())
        .optional()
        .describe("Optional filter by a set of labels associated with the face event."),
      locationUuids: z
        .array(z.string())
        .optional()
        .describe(
          "Optional filter by a set of location UUIDs. Only face events from these locations will be returned."
        ),
      personUuids: z
        .array(z.string())
        .optional()
        .describe(
          "Optional filter by a set of person UUIDs. Only face events associated with these specific people will be returned."
        ),
      timestampFilter: z
        .object({
          rangeEnd: z
            .string()
            .optional()
            .describe(
              "The end of the time range (inclusive) for filtering face events. Expected format is ISO 8601 timestamp. If not specified, the filter defaults to the last 7 days."
            ),
          rangeStart: z
            .string()
            .optional()
            .describe(
              "The start of the time range (inclusive) for filtering face events. Expected format is ISO 8601 timestamp. If not specified, the filter defaults to the last 7 days."
            ),
        })
        .optional()
        .describe("Time range filter for face events"),
    })
    .optional()
    .describe("Search criteria for filtering face events"),
});
export type GetFaceEventsArgs = z.infer<typeof GetFaceEventsArgs>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RequestType),
  faceEventFilter: GetFaceEventsArgs,
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
