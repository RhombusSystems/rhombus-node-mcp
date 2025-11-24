import { z } from "zod";
import { schemas } from "./zod-schemas.js";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum RequestType {
  GET_SUMMARY_COUNT_REPORT = "get-summary-count-report",
  GET_OCCUPANCY_COUNT_REPORT = "get-occupancy-count-report",
  GET_OCCUPANCY_ENABLED_CAMERAS = "get-occupancy-enabled-cameras",
  GET_LINE_CROSSING_ENABLED_CAMERAS = "get-line-crossing-enabled-cameras",
  GET_THRESHOLD_CROSSING_COUNT_REPORT = "get-threshold-crossing-count-report",
  FIND_PROMPT_CONFIGURATIONS = "find-prompt-configurations",
  GET_CUSTOM_LLM_REPORT = "get-custom-llm-report",
}

export const TOOL_ARGS = z.object({
  requestType: z.enum([
    RequestType.GET_SUMMARY_COUNT_REPORT,
    RequestType.GET_OCCUPANCY_COUNT_REPORT,
    RequestType.GET_OCCUPANCY_ENABLED_CAMERAS,
    RequestType.GET_LINE_CROSSING_ENABLED_CAMERAS,
    RequestType.GET_THRESHOLD_CROSSING_COUNT_REPORT,
    RequestType.FIND_PROMPT_CONFIGURATIONS,
    RequestType.GET_CUSTOM_LLM_REPORT,
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
  lineCrossingEnabledCamerasRequest: z.object({
    locationUuid: z
      .string()
      .describe("The uuid of the location to get line crossing enabled cameras for"),
  }),
  thresholdCrossingCountRequest: z.object({
    deviceUuid: z.string().describe("The uuid of the device to get threshold crossing count for"),
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
    bucketSize: z
      .enum(["QUARTER_HOUR", "HOUR", "DAY", "WEEK"])
      .describe("The time bucket size for aggregating crossing counts"),
    crossingObject: z
      .enum(["HUMAN", "VEHICLE", "UNKNOWN"])
      .describe("The type of object crossing to report on"),
    dedupe: z.boolean().describe("Whether to deduplicate crossing events"),
  }),
  findPromptConfigurationsRequest: z
    .object({})
    .describe("Request to find all custom event prompt configurations"),
  customLLMReportRequest: z.object({
    promptUuid: z.string().describe("The uuid of the prompt configuration to get counts for"),
    promptType: z
      .enum(["COUNT", "PERCENT", "BOOLEAN"])
      .describe("The type of prompt configuration - determines which API endpoint to use"),
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
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .describe("The time interval for the report aggregation"),
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
  lineCrossingEnabledCamerasReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        camerasToConfigs: z.optional(z.record(z.unknown())),
      })
    )
    .nullable()
    .describe("Cameras at a location that have line crossing enabled with their configurations"),
  thresholdCrossingCountReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        crossingCounts: z.optional(
          z.array(
            z.object({
              timestampMs: z.optional(z.number()),
              ingressCount: z.optional(z.number()),
              egressCount: z.optional(z.number()),
            })
          )
        ),
        metrics: z
          .optional(
            z.object({
              averageEntriesPerHour: z
                .number()
                .describe("Average number of entries (ingress) per hour"),
              averageExitsPerHour: z.number().describe("Average number of exits (egress) per hour"),
              mostEntriesInHour: z
                .object({
                  count: z.number().describe("Maximum number of entries in a single hour"),
                  timestamp: z.string().describe("ISO timestamp of the hour with most entries"),
                  hourLabel: z
                    .string()
                    .describe("Human-readable hour label (e.g., '2:00 PM - 3:00 PM')"),
                })
                .describe("Hour with the most entries"),
              mostExitsInHour: z
                .object({
                  count: z.number().describe("Maximum number of exits in a single hour"),
                  timestamp: z.string().describe("ISO timestamp of the hour with most exits"),
                  hourLabel: z
                    .string()
                    .describe("Human-readable hour label (e.g., '2:00 PM - 3:00 PM')"),
                })
                .describe("Hour with the most exits"),
              busiestHour: z
                .object({
                  totalCount: z.number().describe("Total entries + exits in the busiest hour"),
                  timestamp: z.string().describe("ISO timestamp of the busiest hour"),
                  hourLabel: z
                    .string()
                    .describe("Human-readable hour label (e.g., '2:00 PM - 3:00 PM')"),
                  entries: z.number().describe("Number of entries in the busiest hour"),
                  exits: z.number().describe("Number of exits in the busiest hour"),
                })
                .describe("Hour with the most total activity (entries + exits)"),
            })
          )
          .describe("Calculated metrics from the crossing count data"),
      })
    )
    .nullable()
    .describe(
      "Threshold crossing count report showing ingress and egress counts over time with calculated metrics"
    ),
  promptConfigurationsReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        promptConfigurations: z.optional(
          z.array(
            z.object({
              active: z.optional(z.boolean()),
              cameraConfigurations: z.optional(z.array(z.unknown())),
              checkCondition: z.optional(z.unknown()),
              description: z.optional(z.string()),
              name: z.optional(z.string()),
              orgUuid: z.optional(z.string()),
              prompt: z.optional(z.string()),
              promptType: z.optional(z.enum(["COUNT", "PERCENT", "BOOLEAN"])),
              scheduleUuid: z.optional(z.string()),
              shortName: z.optional(z.string()),
              uuid: z.optional(z.string()),
            })
          )
        ),
      })
    )
    .nullable()
    .describe("List of custom event prompt configurations"),
  customLLMReport: z
    .optional(
      z.object({
        error: z.optional(z.boolean()),
        errorMsg: z.optional(z.string()),
        timeSeriesDataPoints: z.optional(
          z.array(
            z.object({
              dateLocal: z.optional(z.string()),
              dateUtc: z.optional(z.string()),
              eventCountMap: z.optional(z.record(z.union([z.number(), z.boolean(), z.string()]))),
            })
          )
        ),
      })
    )
    .nullable()
    .describe(
      "Custom LLM report showing event data over time - supports COUNT, PERCENT, and BOOLEAN prompt types"
    ),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
