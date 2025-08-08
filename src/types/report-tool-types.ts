import { z } from "zod";
import { schemas } from "./zod-schemas.js";

export enum RequestType {
  GET_SUMMARY_COUNT_REPORT = "get-summary-count-report",
  GET_OCCUPANCY_COUNT_REPORT = "get-occupancy-count-report",
}

export const TOOL_ARGS = z.object({
  requestType: z.enum([
    RequestType.GET_SUMMARY_COUNT_REPORT,
    RequestType.GET_OCCUPANCY_COUNT_REPORT,
  ]),
  occupancyCountRequest: z.object({
    deviceUuid: z.string().describe("The uuid of the device to get occupancy count for"),
    startTimeMs: z
      .number()
      .describe("A timestamp in milliseconds representing the start time of the report period"),
    endTimeMs: z
      .number()
      .describe("A timestamp in milliseconds representing the end time of the report period"),
    interval: z
      .enum(["MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .describe("The time interval for the report aggregation"),
  }),
  summaryCountRequest: z.object({
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
    timeZone: z.string()
      .describe(`The timezone of the requested locations or devices. This is necessary for the tool to produce
      accurate UTC dates for the returned data.`),
  }),
});

const TOOL_ARGS_SCHEMA = TOOL_ARGS;
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const SanitizedTimeSeriesDataPoint = z.object({
  dateUtcString: z
    .optional(z.string())
    .describe("The UTC date of the data point in ISO 8601 format"),
  eventCountMap: z.optional(z.record(z.any())),
});
export type SanitizedTimeSeriesDataPoint = z.infer<typeof SanitizedTimeSeriesDataPoint>;

export const OUTPUT_SCHEMA = z.object({
  error: z.optional(z.boolean()),
  errorMsg: z.optional(z.string()),
  summaryCountReport: z.optional(
    z
      .object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        timeSeriesDataPoints: z.optional(z.array(SanitizedTimeSeriesDataPoint)),
      })
      .nullable()
      .describe(
        "Report data for various high level organization metrics like people counts, bandwidth counts, face counts, etc."
      )
  ),
  occupancyCountReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        timeSeriesDataPoints: z.optional(
          z.array(
            z.object({
              approximateTimestampMsMap: z.optional(z.record(z.unknown())),
              dateLocal: z.optional(z.string()),
              dateUtc: z.optional(z.string()),
              dateLocalString: z.optional(z.string()),
              dateUtcString: z.optional(z.string()),
              eventCountMap: z.optional(z.record(z.unknown())),
              timestampMs: z.optional(z.number()),
            })
          )
        ),
      })
    )
    .nullable(),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
