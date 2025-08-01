import { z } from "zod";

export const TOOL_ARGS = {
  interval: z
    .enum(["MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .describe("The time interval for the report aggregation"),
  uuid: z
    .nullable(z.string())
    .describe(
      "The uuid of the device, or location, or organization depending on what scope is.  If scope is DEVICE, this is the device uuid.  If scope is LOCATION, this is the location uuid.  If scope is ORG, this is the organization uuid. This UUID is *always* 22 characters long"
    ),
  scope: z
    .enum(["REGION", "LOCATION", "DEVICE", "ORG"])
    .describe("The scope level for the report data"),
  types: z
    .array(
      z.enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
        "AM_VERIFICATION",
        "DWELL",
      ])
    )
    .describe("The types of data to include in the summary count report"),
  startTimeMs: z
    .number()
    .describe("A timestamp in milliseconds representing the start time of the report period"),
  endTimeMs: z
    .number()
    .describe("A timestamp in milliseconds representing the end time of the report period"),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  error: z.optional(z.boolean()),
  errorMsg: z.optional(z.string()),
  timeSeriesDataPoints: z.optional(
    z.array(
      z.object({
        dateLocalMs: z.optional(z.number()),
        dateUtcMs: z
          .unknown()
          .transform(val => {
            // Handle all problematic values: string "nan", actual NaN, null, undefined, or literal nan type
            if (
              val === "nan" ||
              val === null ||
              val === undefined ||
              (typeof val === "number" && isNaN(val)) ||
              String(val) === "NaN"
            ) {
              return undefined;
            }
            // Try to convert string to number if it's a valid number string
            if (typeof val === "string") {
              const num = Number(val);
              return isNaN(num) ? undefined : num;
            }
            // Return number as-is if it's already a valid number
            if (typeof val === "number" && !isNaN(val)) {
              return val;
            }
            // Fallback to undefined for any other unexpected types
            return undefined;
          })
          .optional(),
        dateLocalString: z.optional(z.string()),
        dateUtcString: z.optional(z.string()),
        eventCountMap: z.optional(z.record(z.any())),
        maxEventCountMap: z.optional(z.record(z.any())),
      })
    )
  ),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
