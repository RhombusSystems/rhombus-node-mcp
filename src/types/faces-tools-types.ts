import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { createUuidSchema } from "../types.js";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum RequestType {
  GET_FACE_EVENTS = "get-face-events",
  GET_REGISTERED_FACES = "get-registered-faces",
  GET_PERSON_LABELS = "get-person-labels",
  SEARCH_SIMILAR_FACES = "search-similar-faces",
  GET_FACE_MATCHMAKERS = "get-face-matchmakers",
  GET_FACE_EVENTS_BY_PERSON = "get-face-events-by-person",
  CREATE_PERSON = "create-person",
  UPDATE_PERSON = "update-person",
  DELETE_PERSON = "delete-person",
  ADD_PERSON_LABEL = "add-person-label",
  REMOVE_PERSON_LABEL = "remove-person-label",
  DELETE_FACE_MATCHMAKER = "delete-face-matchmaker",
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
        .describe(
          "Maximum number of results to return per page. Default to around 200. Caution against setting this to a lower number, it may make you miss information."
        ),
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
        .array(createUuidSchema())
        .describe(
          "Optional filter by a set of location UUIDs. Only face events from these locations will be returned. An empty array will be the same as omitting the filter."
        ),
      personUuids: z
        .array(createUuidSchema())
        .describe(
          "Optional filter by a set of person UUIDs. Only face events associated with these specific people will be returned. An empty array will be the same as omitting the filter."
        ),
      timestampFilter: z
        .object({
          rangeEnd: z
            .string()
            .datetime({
              message: "Invalid datetime string. Expected ISO 8601 format.",
              offset: true,
            })
            .nullable()
            .describe(
              "The end of the time range (inclusive) for filtering face events. If not specified, the filter defaults to the last 7 days." +
                ISOTimestampFormatDescription
            ),
          rangeStart: z
            .string()
            .datetime({
              message: "Invalid datetime string. Expected ISO 8601 format.",
              offset: true,
            })
            .nullable()
            .describe(
              "The start of the time range (inclusive) for filtering face events. If not specified, the filter defaults to the last 7 days." +
                ISOTimestampFormatDescription
            ),
        })
        .nullable()
        .describe("Time range filter for face events"),
    })
    .nullable()
    .describe(
      "Search criteria for filtering face events. Only applies to tool calls with requestType 'get-face-events'."
    ),
});
export type GetFaceEventsArgs = z.infer<typeof GetFaceEventsArgs>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(RequestType).describe(
    `Which face-recognition request to run.

"get-face-events" — face sightings; use it for reporting on who was seen by the camera system.
- **Automatic name resolution:** faceNames accepts partial or first-name-only names (e.g. "Brandon", "Omar"); the tool looks up the registered-faces directory and resolves them to exact names and person UUIDs before searching. The response's "resolvedNames" field shows what each queried name matched (null = no match).
- Filter with faceNames, hasEmbedding, hasName, labels, locationUuids, personUuids, and a time range via searchFilter.timestampFilter.rangeStart / rangeEnd, which are ISO 8601 strings WITH a UTC offset (e.g. "2026-08-03T00:00:00-07:00") — not epoch milliseconds.
- **For "who was seen" questions, set searchFilter.hasName to true.** Unnamed detections cannot answer a who-question and they consume the page budget: an unfiltered page is typically ~85% nameless, so the named people you need get pushed onto later pages.
- **Read the faceEventSummary field in the response.** It lists every distinct identified person on the page with their event count and first/last sighting, already deduplicated. Enumerate people from it rather than by scanning getFaceEventsResponse by hand, and page until morePagesAvailable is false before saying who was or wasn't seen.
- For all face events at a location, pass only the location UUID in searchFilter and NO device UUIDs (searchFilter.deviceUuids), so the API returns every face detected there. If that location has no face events the tool falls back to an org-wide search and says so in the "note" field — read it before attributing results to the requested location.
- When the user asks about a specific person at a location (e.g. "Jane Doe at Main Office"), call get-registered-faces first, find the best match, then call get-face-events with that precise name — this request expects names exactly as stored.

"get-registered-faces" — every person (registered face) known to the org, each with a "labels" array showing the label groups they belong to. Returns ALL people regardless of any timestamp filter.

"get-person-labels" — a mapping of person UUIDs to their assigned labels across the org. Use it to discover what label groups exist; for a group question ("was anyone from Engineering seen today?") get the labels first, then query face events filtered by those personUuids or labels.`,
  ),
  faceEventFilter: GetFaceEventsArgs,
  // Only pageRequest and searchFilter live inside faceEventFilter. Everything
  // below is a top-level sibling — nesting them under faceEventFilter is the
  // most common way this tool gets called wrong and costs a rejected round trip.
  timeZone: z
    .string()
    .describe(
      "The timezone for formatting timestamps which should come from the location of the camera for the face event. This is necessary for the tool to produce accurate formatted timestamps."
    ),
  faceEventUuid: z.string().nullable().describe("UUID of a face event to search similar faces from. Required for 'search-similar-faces'."),
  personUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of a person. Required for 'get-face-events-by-person', 'update-person', 'delete-person', 'add-person-label' and 'remove-person-label'. Get it from 'get-registered-faces' — do not guess one, because acting on the wrong person's biometric record is not visible in the response."
    ),
  personName: z
    .string()
    .nullable()
    .describe(
      "A person's name. Required for 'create-person'; for 'update-person' it is the new name (omit to leave it unchanged)."
    ),
  personEmail: z
    .string()
    .nullable()
    .describe(
      "A person's email address. Optional for 'update-person'; omit to leave it unchanged."
    ),
  personLabel: z
    .string()
    .nullable()
    .describe("A single person label. Required for 'add-person-label' and 'remove-person-label'."),
  faceId: z
    .string()
    .nullable()
    .describe(
      "The id of ONE enrolled face image (a 'face matchmaker'). Required for 'delete-face-matchmaker'. Get it from 'get-face-matchmakers'. A person can have several enrolled faces; deleting one leaves the person and their other faces in place."
    ),
  confirmDelete: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'delete-person' and 'delete-face-matchmaker'. Both destroy enrolled biometric data and cannot be undone — re-enrolling needs new photos. They refuse without explicit confirmation from the user."
    ),
  includeFields: INCLUDE_FIELDS_ARG,
  filterBy: FILTER_BY_ARG,
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
          eventTimestampMs: z.number().describe("The timestamp of the face event in milliseconds."),
          eventTimestamp: z
            .optional(z.string())
            .describe("The timestamp of the face event in human readable format."),
          faceName: z
            .optional(z.string())
            .describe(
              "If the face matches somebody that has been registered in our system, this is the name of the person that was detected."
            ),
          locationUuid: z
            .optional(z.string())
            .describe("The UUID of the location where the face event occurred."),
          personUuid: z.optional(z.string()).describe("The UUID of the person that was detected."),
          // selectedPersonMatch: z.optional(
          //   z.object({
          //     confidence: z.number(),
          //     faceId: z.optional(z.string()),
          //     name: z.optional(z.string()),
          //     uuid: z.optional(z.string()),
          //   })
          // ),
          thumbnailS3Key: z
            .optional(z.string())
            .describe("The S3 key of the thumbnail of the face event."),
          // topPersonMatches: z.optional(
          //   z.array(
          //     z.object({
          //       confidence: z.number(),
          //       faceId: z.optional(z.string()),
          //       name: z.optional(z.string()),
          //       uuid: z.optional(z.string()),
          //     })
          //   )
          // ).describe("The top person matches found for this face event, in order of confidence."),
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
          labels: z.optional(z.array(z.string())).describe(
            "Labels assigned to this person, useful for grouping (e.g., 'Engineering', 'Visitors')."
          ),
        })
      )
    )
    .describe(
      "A list of all people (registered faces) currently known to the Rhombus system for your organization."
    ),
  getPersonLabelsResponse: z
    .optional(
      z.record(
        z.string(),
        z.array(z.string())
      )
    )
    .describe(
      "A map of person UUIDs to their assigned label arrays. Use this to discover what label groups exist and which people belong to them."
    ),
  resolvedNames: z
    .optional(
      z.record(z.string(), z.string().nullable())
    )
    .describe(
      "When faceNames are provided in a get-face-events request, this shows how each queried name was automatically resolved to a registered face. " +
      "Key is the queried name (e.g., 'Brandon'), value is the matched registered name (e.g., 'Brandon Salzberg') or null if no match was found. " +
      "Use these resolved names when reporting results to the user."
    ),
  similarFaceEvents: z.array(z.object({
    uuid: z.string().optional(),
    personUuid: z.string().optional(),
    similarity: z.number().optional(),
    eventTimestamp: z.string().optional(),
  })).optional().describe("Similar face event results"),
  faceMatchmakers: z.array(z.object({
    uuid: z.string().optional(),
    personUuid: z.string().optional(),
    name: z.string().optional(),
  })).optional().describe("Face matchmaker records"),
  personFaceEvents: z.array(z.object({
    uuid: z.string().optional(),
    personUuid: z.string().optional(),
    eventTimestamp: z.string().optional(),
    deviceUuid: z.string().optional(),
  })).optional().describe("Face events for a specific person"),
  faceEventSummary: z
    .optional(
      z.object({
        totalEventsThisPage: z.number().describe("How many face events this page contains."),
        namedEvents: z.number().describe("How many of them resolved to a registered person."),
        unnamedEvents: z
          .number()
          .describe("How many were unrecognized faces. These cannot answer a 'who' question."),
        identifiedPeople: z
          .array(
            z.object({
              name: z.string(),
              eventCount: z.number(),
              firstSeen: z.string().describe("Human-readable timestamp of their earliest sighting on this page."),
              lastSeen: z.string().describe("Human-readable timestamp of their latest sighting on this page."),
            })
          )
          .describe(
            "Every DISTINCT identified person on this page, most-seen first. This is the complete roster for this page — report all of these names, not a sample."
          ),
        morePagesAvailable: z
          .boolean()
          .describe(
            "True when lastEvaluatedKey is set. More people may appear on later pages; do not state who was or wasn't seen until this is false."
          ),
      })
    )
    .describe(
      "Pre-computed roster of distinct people on this page of face events. Enumerate people from here instead of deduplicating getFaceEventsResponse by hand."
    ),
  lastEvaluatedKey: z.string().optional().describe("For paginated requests, this is the returned last evaluated key that can be passed back in on the next request to get the next page of results"),
  created: z
    .object({ success: z.boolean().optional(), uuid: z.string().optional() })
    .optional()
    .describe("Result of 'create-person'."),
  updated: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      label: z.string().optional(),
    })
    .optional()
    .describe("Result of 'update-person' or a person-label change."),
  deleted: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      faceId: z.string().optional(),
    })
    .optional()
    .describe("Result of 'delete-person' or 'delete-face-matchmaker'."),
  warningMsg: z
    .string()
    .optional()
    .describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
  note: z
    .string()
    .optional()
    .describe(
      "Diagnostic note about why a result set may be empty, incomplete, or scoped differently than requested. Read it before attributing results to the filters you asked for."
    ),
  error: z.optional(z.string()),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
