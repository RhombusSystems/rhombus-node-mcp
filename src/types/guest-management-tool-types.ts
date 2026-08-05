import { z } from "zod";
import { INCLUDE_FIELDS_ARG, FILTER_BY_ARG } from "../util.js";

export enum GuestManagementRequestType {
  GET_ALL_GUESTS = "get-all-guests",
  GET_ACTIVITY_LOGS = "get-activity-logs",
  GET_ACTIVITIES_FOR_LOCATION = "get-activities-for-location",
  CREATE_GUEST = "create-guest",
  DELETE_GUEST = "delete-guest",
  GET_GUEST_PASSES = "get-guest-passes",
  EXPIRE_GUEST_PASS = "expire-guest-pass",
  SUSPEND_GUEST_PASS = "suspend-guest-pass",
  UNSUSPEND_GUEST_PASS = "unsuspend-guest-pass",
  DELETE_GUEST_PASS = "delete-guest-pass",
}

/** api2's `GuestTypeEnum`. Anything outside this list is rejected upstream. */
export const GUEST_TYPES = [
  "CONTRACTOR",
  "INTERVIEWER",
  "GENERAL_VISITOR",
  "UNPLANNED_VISITOR",
  "PARTNER",
  "MEETINGS",
] as const;

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(GuestManagementRequestType)
    .describe("The type of guest management request to make."),
  locationUuid: z
    .string()
    .nullable()
    .describe(
      "Location UUID. Required for 'get-activities-for-location' and 'create-guest'."
    ),
  guestFirstName: z
    .string()
    .nullable()
    .describe("The guest's first name. Required for 'create-guest'."),
  guestLastName: z
    .string()
    .nullable()
    .describe("The guest's last name. Required for 'create-guest'."),
  guestEmail: z
    .string()
    .nullable()
    .describe(
      "The guest's email address. Required for 'create-guest' and 'delete-guest'. A guest is identified by email, not a UUID, so this has to be exact — read it back to the user before creating, since an invitation may be sent to it."
    ),
  guestCompanyName: z
    .string()
    .nullable()
    .describe("The guest's company. Optional for 'create-guest'."),
  guestType: z
    .enum(GUEST_TYPES)
    .nullable()
    .describe(
      `The kind of visit. Optional for 'create-guest'; defaults to GENERAL_VISITOR. One of: ${GUEST_TYPES.join(", ")}.`
    ),
  hostUserUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of the Rhombus user hosting the guest. Optional for 'create-guest'. Resolve the host's name with user-tool — do not guess."
    ),
  accessStartTimeMs: z
    .number()
    .nullable()
    .describe("When the guest's access begins (ms since epoch). Optional for 'create-guest'."),
  accessEndTimeMs: z
    .number()
    .nullable()
    .describe(
      "When the guest's access ends (ms since epoch). Optional for 'create-guest', but a guest with no end time keeps access indefinitely — say so if it is left unset."
    ),
  guestPassUuid: z
    .string()
    .nullable()
    .describe(
      "UUID of a guest pass. Required for 'expire-guest-pass', 'suspend-guest-pass', 'unsuspend-guest-pass' and 'delete-guest-pass'. Get it from 'get-guest-passes' — do not guess one."
    ),
  confirmDelete: z
    .boolean()
    .nullable()
    .describe(
      "Required to be true for 'delete-guest' and 'delete-guest-pass'. Both are irreversible; for a pass, 'expire-guest-pass' ends access while keeping the record and history."
    ),
  startTimeMs: z
    .number()
    .nullable()
    .describe("Start time filter in milliseconds since epoch. Optional for activity queries."),
  endTimeMs: z
    .number()
    .nullable()
    .describe("End time filter in milliseconds since epoch. Optional for activity queries."),
  includeFields: INCLUDE_FIELDS_ARG,
  filterBy: FILTER_BY_ARG,
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const GuestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
  locationUuid: z.string().optional(),
  hostUserUuid: z.string().optional(),
  guestType: z.string().optional(),
  checkedInStatus: z.string().optional(),
  lastCheckedInMs: z.number().optional(),
  lastCheckedOutMs: z.number().optional(),
  phoneNumber: z.string().optional(),
});

const GuestActivitySchema = z.object({
  activity: z.string().optional(),
  email: z.string().optional(),
  guestType: z.string().optional(),
  locationUuid: z.string().optional(),
  hostUserUuid: z.string().optional(),
  timestampMs: z.number().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  guests: z.array(GuestSchema).optional().describe("List of guests in the organization"),
  activities: z
    .array(GuestActivitySchema)
    .optional()
    .describe("List of guest activity log entries"),
  guestPasses: z
    .array(
      z.object({
        uuid: z.string().optional(),
        locationUuid: z.string().optional(),
        lifecycle: z
          .string()
          .optional()
          .describe("ACTIVE, SUSPENDED, EXPIRED or ARCHIVED."),
        note: z.string().optional(),
        passStartTimeMs: z.number().optional(),
        principalType: z.string().optional(),
      })
    )
    .optional()
    .describe("Guest passes in the organization."),
  created: z
    .object({ success: z.boolean().optional(), email: z.string().optional() })
    .optional()
    .describe("Result of 'create-guest'."),
  deleted: z
    .object({
      success: z.boolean().optional(),
      email: z.string().optional(),
      uuid: z.string().optional(),
    })
    .optional()
    .describe("Result of 'delete-guest' or 'delete-guest-pass'."),
  guestPassChange: z
    .object({
      success: z.boolean().optional(),
      uuid: z.string().optional(),
      action: z.string().optional(),
    })
    .optional()
    .describe("Result of a guest pass state change."),
  lastEvaluatedKey: z
    .string()
    .optional()
    .describe("Pagination cursor — more guest passes exist when this is set."),
  note: z
    .string()
    .optional()
    .describe("A caveat about this result that the user needs to be told."),
  warningMsg: z
    .string()
    .optional()
    .describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
