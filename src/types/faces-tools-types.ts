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
  deviceUuids: z
    .array(z.string())
    .optional()
    .describe(
      "Optional filter by a set of device UUIDs. Only face events from these devices will be returned. Applicable when requestType is 'get-face-events'."
    ),
  faceNameContains: z
    .string()
    .optional()
    .describe(
      "Optional filter for face events where the detected face's name contains this substring. The search is performed only if the value is at least 3 characters long after trimming spaces. This takes precedence over 'faceNames' if both are specified. Applicable when requestType is 'get-face-events'."
    ),
  faceNames: z
    .array(z.string())
    .optional()
    .describe(
      "Optional filter by a set of specific person names. Only face events associated with these names will be returned. Applicable when requestType is 'get-face-events'."
    ),
  hasEmbedding: z
    .boolean()
    .optional()
    .describe(
      "Optional filter by the presence (true) or absence (false) of a face embedding associated with the event. Applicable when requestType is 'get-face-events'."
    ),
  hasName: z
    .boolean()
    .optional()
    .describe(
      "Optional filter by the presence (true) or absence (false) of a person name associated with the face event. Applicable when requestType is 'get-face-events'."
    ),
  labels: z
    .array(z.string())
    .optional()
    .describe(
      "Optional filter by a set of labels associated with the face event. Applicable when requestType is 'get-face-events'."
    ),
  locationUuids: z
    .array(z.string())
    .optional()
    .describe(
      "Optional filter by a set of location UUIDs. Only face events from these locations will be returned. Applicable when requestType is 'get-face-events'."
    ),
  personUuids: z
    .array(z.string())
    .optional()
    .describe(
      "Optional filter by a set of person UUIDs. Only face events associated with these specific people will be returned. Applicable when requestType is 'get-face-events'."
    ),
  rangeEnd: z
    .string()
    .optional()
    .describe(
      "The end of the time range (inclusive) for filtering face events. Expected format is a string containing a timestamp in milliseconds since epoch. Applicable when requestType is 'get-face-events'. If not specified, the filter defaults to the last 7 days."
    ),
  rangeStart: z
    .string()
    .optional()
    .describe(
      "The start of the time range (inclusive) for filtering face events. Expected format is a string containing a timestamp in milliseconds since epoch. Applicable when requestType is 'get-face-events'. If not specified, the filter defaults to the last 7 days."
    ),
});
export type GetFaceEventsArgs = z.infer<typeof GetFaceEventsArgs>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RequestType),
  deviceUuids: z.array(z.string()).optional(),
  faceNameContains: z.string().optional(),
  faceNames: z.array(z.string()).optional(),
  hasEmbedding: z.boolean().optional(),
  hasName: z.boolean().optional(),
  labels: z.array(z.string()).optional(),
  locationUuids: z.array(z.string()).optional(),
  personUuids: z.array(z.string()).optional(),
  rangeEnd: z.string().optional(),
  rangeStart: z.string().optional(),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
