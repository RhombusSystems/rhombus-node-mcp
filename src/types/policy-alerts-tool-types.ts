import { z } from "zod";
import { schemas } from "./zod-schemas.js";
import { createEpochSchema, ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  queryType: z
    .enum(["existing", "expiringSoon", "details", "dismiss", "unhealthy-devices", "alert-groups"])
    .describe(
      'The type of policy alerts to retrieve. Use "existing" to get current policy alerts, and "expiringSoon" to get policy alerts that are nearing their expiration date.'
    ),
  afterTimestampISO: z
    .string()
    .datetime({ message: "Invalid ISO 8601 date format.", offset: true })
    .nullable()
    .describe(
      "The start of the time range for which to retrieve alerts. Only alerts that occurred AFTER this timestamp will be returned." +
        ISOTimestampFormatDescription
    ),
  beforeTimestampISO: z
    .string()
    .datetime({ message: "Invalid ISO 8601 date format.", offset: true })
    .nullable()
    .describe(
      "The end of the time range for which to retrieve alerts. Only alerts that occurred BEFORE this timestamp will be returned." +
        ISOTimestampFormatDescription
    ),
  deviceFilter: z
    .array(z.string())
    .nullable()
    .describe(
      "A list of UUIDs representing the specific devices to filter alerts by. Only alerts emitted by these devices will be returned. Please truncate any facets, such as .v0"
    ),
  locationFilter: z
    .array(z.string())
    .nullable()
    .describe(
      "A list of UUIDs representing the specific locations to filter alerts by. Only alerts associated with these locations will be returned. Please truncate any facets, such as .v0"
    ),
  maxResults: z
    .number()
    .nullable()
    .describe(
      "The maximum number of policy alerts to return. A good default is 100, but you may increase or decrease this number as needed. A reasonable hard maximum is 1000 alerts."
    ),
  lastEvaluatedKey: z
    .string()
    .nullable()
    .describe(
      "Opaque pagination cursor from a previous response. When the response includes lastEvaluatedKey, pass it here on the next call to retrieve the next page. Used by queryType 'expiringSoon'."
    ),
  lastTimestampISO: z
    .string()
    .datetime({ message: "Invalid ISO 8601 date format.", offset: true })
    .nullable()
    .describe(
      "Pagination cursor (ISO 8601 timestamp). When the response includes lastTimestampISO, pass it here with lastUuid on the next call for the next page. Used by queryTypes 'existing' and 'alert-groups'." +
        ISOTimestampFormatDescription
    ),
  lastUuid: z
    .string()
    .nullable()
    .describe(
      "Pagination cursor (UUID of last item). Pass together with lastTimestampISO from the previous response to fetch the next page. Used by queryTypes 'existing' and 'alert-groups'."
    ),
  timeZone: z
    .string()
    .describe(
      "The timezone from the location of the camera of the policy alert, for formatting timestamps. This is necessary for the tool to produce accurate formatted timestamps."
    ),
  alertUuid: z
    .string()
    .nullable()
    .describe("The UUID of a specific policy alert. Required for 'details' and 'dismiss'."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const ApiPayloadSchema = TOOL_ARGS_SCHEMA.transform(args => {
  const {
    queryType,
    afterTimestampISO,
    beforeTimestampISO,
    timeZone,
    lastTimestampISO,
    ...rest
  } = args;
  const afterTimestampMs = createEpochSchema().parse(afterTimestampISO);
  const beforeTimestampMs = createEpochSchema().parse(beforeTimestampISO);
  const lastTimestampMs =
    lastTimestampISO != null ? createEpochSchema().parse(lastTimestampISO) : null;

  return {
    ...rest,
    afterTimestampMs,
    beforeTimestampMs,
    lastTimestampMs,
    timeZone,
  };
});
export type ApiPayload = z.infer<typeof ApiPayloadSchema>;

// Extend both possible alert types with the createdOnString field
// Use passthrough to allow any additional fields that might be in the response
const ExtendedPolicyAlertV2Type = schemas.PolicyAlertV2Type.extend({
  createdOnString: z
    .string()
    .optional()
    .describe("Human-readable formatted timestamp (e.g., 'January 24, 2025 at 5:32 PM')"),
}).passthrough();

const ExtendedAccessControlledDoorPolicyAlertType =
  schemas.AccessControlledDoorPolicyAlertType.extend({
    createdOnString: z
      .string()
      .optional()
      .describe("Human-readable formatted timestamp (e.g., 'January 24, 2025 at 5:32 PM')"),
  }).passthrough();

// Create a union type that accepts either type of policy alert
const ExtendedPolicyAlertType = z.union([
  ExtendedPolicyAlertV2Type,
  ExtendedAccessControlledDoorPolicyAlertType,
]);

// Create a new schema that matches what we actually return
export const OUTPUT_SCHEMA = z
  .object({
    error: z.boolean().optional(),
    errorMsg: z.string().optional(),
    policyAlerts: z.array(ExtendedPolicyAlertType).optional().default([]),
    lastEvaluatedKey: z
      .string()
      .nullable()
      .optional()
      .describe(
        "If present, more results are available. Pass this value as lastEvaluatedKey on the next call to get the next page (queryType 'expiringSoon')."
      ),
    lastTimestampISO: z
      .string()
      .nullable()
      .optional()
      .describe(
        "If present with lastUuid, more results are available. Pass both as lastTimestampISO and lastUuid on the next call for the next page ('existing' or 'alert-groups'). ISO 8601 format."
      ),
    lastUuid: z
      .string()
      .nullable()
      .optional()
      .describe(
        "If present with lastTimestampISO, more results are available. Pass both on the next call for the next page ('existing' or 'alert-groups')."
      ),
  })
  .passthrough();
