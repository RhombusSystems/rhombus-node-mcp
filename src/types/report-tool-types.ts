import { z } from "zod";
import { schemas } from "./zod-schemas.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum RequestType {
  GET_SUMMARY_COUNT_REPORT = "get-summary-count-report",
  GET_OCCUPANCY_COUNT_REPORT = "get-occupancy-count-report",
  GET_OCCUPANCY_ENABLED_CAMERAS = "get-occupancy-enabled-cameras",
}

export const TOOL_ARGS = z.object({
  requestType: z.enum([
    RequestType.GET_SUMMARY_COUNT_REPORT,
    RequestType.GET_OCCUPANCY_COUNT_REPORT,
    RequestType.GET_OCCUPANCY_ENABLED_CAMERAS,
  ]),
  occupancyCountRequest: z.object({
    deviceUuid: z.string().describe("The uuid of the device to get occupancy count for"),
    rangeStart: z
      .string()
      .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
      .describe(
        "The start of the time range (inclusive) for the report period." +
          ISOTimestampFormatDescription
      ),
    rangeEnd: z
      .string()
      .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
      .describe(
        "The end of the time range (inclusive) for the report period." +
          ISOTimestampFormatDescription
      ),
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
    rangeStart: z
      .string()
      .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
      .describe(
        "The start of the time range (inclusive) for the report period." +
          ISOTimestampFormatDescription
      ),
    rangeEnd: z
      .string()
      .datetime({ message: "Invalid datetime string. Expected ISO 8601 format.", offset: true })
      .describe(
        "The end of the time range (inclusive) for the report period." +
          ISOTimestampFormatDescription
      ),
    timeZone: z.string()
      .describe(`The timezone of the requested locations or devices. This is necessary for the tool to produce
      accurate UTC dates for the returned data.`),
  }),
  occupancyEnabledCamerasRequest: z
    .object({})
    .describe("Request to get list of occupancy enabled cameras"),
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
  occupancyEnabledCamerasReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        cameras: z.optional(
          z.array(
            z.object({
              uuid: z.optional(z.string()),
              deviceUuid: z.optional(z.string()),
              name: z.optional(z.string()),
              serialNumber: z.optional(z.string()),
              locationUuid: z.optional(z.string()),
              facetNameMap: z.optional(z.record(z.string().nullable())),
              deleted: z.optional(z.boolean()),
              pending: z.optional(z.boolean()),
              mummified: z.optional(z.boolean()),
            })
          )
        ),
      })
    )
    .nullable()
    .describe("List of cameras that have occupancy reporting enabled"),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
