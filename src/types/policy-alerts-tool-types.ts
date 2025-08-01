import { z } from "zod";
import { schemas } from "./zod-schemas.js";

export const TOOL_ARGS = {
  afterTimestampMs: z
    .number()
    .nullable()
    .describe(
      "The start of the time range (in milliseconds since epoch) for which to retrieve alerts. Only alerts that occurred AFTER this timestamp will be returned."
    ),
  beforeTimestampMs: z
    .number()
    .nullable()
    .describe(
      "The end of the time range (in milliseconds since epoch) for which to retrieve alerts. Only alerts that occurred BEFORE this timestamp will be returned."
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
      "The maximum number of policy alerts to return. The system may default to a reasonable number (e.g., 20) if not specified, but there is a hard cap (e.g., 100) on the maximum results the API will return."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ExtendedPolicyAlertType = schemas.BasePolicyAlertType.extend({
  createdOnString: z
    .string()
    .optional()
    .describe("Human-readable formatted timestamp (e.g., 'January 24, 2025 at 5:32 PM')"),
});

export const OUTPUT_SCHEMA = schemas.Event_GetPolicyAlertsWSResponse.extend({
  policyAlerts: z.array(ExtendedPolicyAlertType).nullable(),
});
