import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum RequestType {
	GET_SUMMARY_COUNT_REPORT = "get-summary-count-report",
	GET_OCCUPANCY_COUNT_REPORT = "get-occupancy-count-report",
	GET_OCCUPANCY_ENABLED_CAMERAS = "get-occupancy-enabled-cameras",
	GET_LINE_CROSSING_ENABLED_CAMERAS = "get-line-crossing-enabled-cameras",
	GET_THRESHOLD_CROSSING_COUNT_REPORT = "get-threshold-crossing-count-report",
	FIND_PROMPT_CONFIGURATIONS = "find-prompt-configurations",
	GET_CUSTOM_LLM_REPORT = "get-custom-llm-report",
	GET_AUDIT_FEED = "get-audit-feed",
	GET_DIAGNOSTIC_FEED = "get-diagnostic-feed",
	GET_THRESHOLD_CROSSING_EVENTS = "get-threshold-crossing-events",
	GET_CUSTOM_EVENTS_REPORT = "get-custom-events-report",
	GET_PEOPLE_COUNT_EVENTS = "get-people-count-events",
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
		RequestType.GET_AUDIT_FEED,
		RequestType.GET_DIAGNOSTIC_FEED,
		RequestType.GET_THRESHOLD_CROSSING_EVENTS,
		RequestType.GET_CUSTOM_EVENTS_REPORT,
		RequestType.GET_PEOPLE_COUNT_EVENTS,
	]),
	occupancyCountRequest: z
		.object({
			deviceUuid: z
				.string()
				.describe("The uuid of the device to get occupancy count for"),
			rangeStart: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The start of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			rangeEnd: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The end of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			interval: z
				.enum(["MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
				.describe("The time interval for the report aggregation"),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-occupancy-count-report', null for other request types.",
		),
	summaryCountRequest: z
		.object({
			interval: z
				.enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
				.describe("The time interval for the report aggregation"),
			uuid: z
				.nullable(z.string())
				.describe(
					"The uuid of the device, or location, or organization depending on what scope is.  If scope is DEVICE, this is the device uuid.  If scope is LOCATION, this is the location uuid.  If scope is ORG, this is the organization uuid. This UUID is *always* 22 characters long",
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
						"BANDWIDTH",
						"LICENSEPLATES",
						"ALERTS",
						"AM_VERIFICATION",
						"DWELL",
					]),
				)
				.describe("The types of data to include in the summary count report"),
			rangeStart: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The start of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			rangeEnd: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The end of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			timeZone: z
				.string()
				.describe(`The timezone of the requested locations or devices. This is necessary for the tool to produce
      accurate UTC dates for the returned data.`),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-summary-count-report', null for other request types.",
		),
	occupancyEnabledCamerasRequest: z
		.object({})
		.nullable()
		.describe(
			"Required for requestType === 'get-occupancy-enabled-cameras', null for other request types.",
		),
	lineCrossingEnabledCamerasRequest: z
		.object({
			locationUuid: z
				.string()
				.describe(
					"The uuid of the location to get line crossing enabled cameras for",
				),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-line-crossing-enabled-cameras', null for other request types.",
		),
	thresholdCrossingCountRequest: z
		.object({
			deviceUuid: z
				.string()
				.describe("The uuid of the device to get threshold crossing count for"),
			rangeStart: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The start of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			rangeEnd: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					"The end of the time range (inclusive) for the report period." +
						ISOTimestampFormatDescription,
				),
			bucketSize: z
				.enum(["QUARTER_HOUR", "HOUR", "DAY", "WEEK"])
				.describe("The time bucket size for aggregating crossing counts"),
			crossingObject: z
				.enum(["HUMAN", "VEHICLE", "UNKNOWN"])
				.describe("The type of object crossing to report on"),
			dedupe: z.boolean().describe("Whether to deduplicate crossing events"),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-threshold-crossing-count-report', null for other request types.",
		),
	findPromptConfigurationsRequest: z
		.object({})
		.nullable()
		.describe(
			"Required for requestType === 'find-prompt-configurations', null for other request types.",
		),
	customLLMReportRequest: z
		.object({
			promptUuid: z
				.string()
				.describe("The uuid of the prompt configuration to get counts for"),
			promptType: z
				.enum(["COUNT", "PERCENT", "BOOLEAN"])
				.describe(
					"The type of prompt configuration - determines which API endpoint to use",
				),
			rangeStart: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					`The start of the time range (inclusive) for the report period. ${ISOTimestampFormatDescription}`,
				),
			rangeEnd: z
				.string()
				.datetime({
					message: "Invalid datetime string. Expected ISO 8601 format.",
					offset: true,
				})
				.describe(
					`The end of the time range (inclusive) for the report period. ${ISOTimestampFormatDescription}`,
				),
			interval: z
				.enum([
					"MINUTELY",
					"QUARTERHOURLY",
					"HOURLY",
					"DAILY",
					"WEEKLY",
					"MONTHLY",
				])
				.describe("The time interval for the report aggregation"),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-custom-llm-report', null for other request types.",
		),
	auditFeedRequest: z
		.object({
			startTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`Start of time range. ${ISOTimestampFormatDescription}`),
			endTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`End of time range. ${ISOTimestampFormatDescription}`),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-audit-feed', null for other request types.",
		),
	diagnosticFeedRequest: z
		.object({
			startTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`Start of time range. ${ISOTimestampFormatDescription}`),
			endTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`End of time range. ${ISOTimestampFormatDescription}`),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-diagnostic-feed', null for other request types.",
		),
	thresholdCrossingEventsRequest: z
		.object({
			deviceUuid: z.string().describe("The uuid of the device"),
			startTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`Start of time range. ${ISOTimestampFormatDescription}`),
			endTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`End of time range. ${ISOTimestampFormatDescription}`),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-threshold-crossing-events', null for other request types.",
		),
	customEventsReportRequest: z
		.object({
			promptUuid: z.string().describe("The uuid of the prompt configuration"),
			startTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`Start of time range. ${ISOTimestampFormatDescription}`),
			endTime: z
				.string()
				.datetime({ message: "Invalid datetime string.", offset: true })
				.describe(`End of time range. ${ISOTimestampFormatDescription}`),
			interval: z
				.enum([
					"MINUTELY",
					"QUARTERHOURLY",
					"HOURLY",
					"DAILY",
					"WEEKLY",
					"MONTHLY",
				])
				.describe("The time interval for aggregation"),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-custom-events-report', null for other request types.",
		),
	peopleCountEventsRequest: z
		.object({
			deviceUuids: z
				.array(z.string())
				.describe("Array of device UUIDs to get people count for"),
		})
		.nullable()
		.describe(
			"Required for requestType === 'get-people-count-events', null for other request types.",
		),
});

const TOOL_ARGS_SCHEMA = TOOL_ARGS;
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const SanitizedTimeSeriesDataPoint = z.object({
	dateUtcString: z
		.optional(z.string())
		.describe("The UTC date of the data point in ISO 8601 format"),
	eventCountMap: z.optional(z.record(z.any())),
});
export type SanitizedTimeSeriesDataPoint = z.infer<
	typeof SanitizedTimeSeriesDataPoint
>;

const FaceCountEnrichment = z.object({
  uniqueFaceCount: z.number().describe("Number of unique people identified by face recognition in the same time range"),
  totalFaceEvents: z.number().describe("Total face detection events in the same time range"),
});

const OccupancyEnabledCamera = z.object({
  uuid: z.optional(z.string()),
  name: z.optional(z.string()),
  locationUuid: z.optional(z.string()),
});

export const OUTPUT_SCHEMA = z.object({
	error: z.optional(z.boolean()),
	errorMsg: z.optional(z.string()),
	summaryCountReport: z.optional(
		z
			.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				timeSeriesDataPoints: z.optional(z.array(SanitizedTimeSeriesDataPoint)),
				faceCountEnrichment: z
					.optional(FaceCountEnrichment)
					.describe(
						"Unique face count data for the same device and time range, auto-included when PEOPLE type is queried at DEVICE scope",
					),
				hint: z
					.optional(z.string())
					.describe("Guidance when primary data source returned empty results"),
				occupancyEnabledCameras: z
					.optional(z.array(OccupancyEnabledCamera))
					.describe(
						"Cameras that support occupancy counting, included when the queried device returned zero people counts",
					),
			})
			.nullable()
			.describe(
				"Report data for various high level organization metrics like people counts, bandwidth counts, face counts, etc.",
			),
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
						}),
					),
				),
				faceCountEnrichment: z
					.optional(FaceCountEnrichment)
					.describe(
						"Unique face count data for the same device and time range, always included for occupancy reports",
					),
				hint: z
					.optional(z.string())
					.describe(
						"Guidance when the queried device does not support occupancy counting",
					),
				occupancyEnabledCameras: z
					.optional(z.array(OccupancyEnabledCamera))
					.describe(
						"Cameras that support occupancy counting, included when the queried device does not",
					),
			}),
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
						}),
					),
				),
			}),
		)
		.nullable()
		.describe("List of cameras that have occupancy reporting enabled"),
	lineCrossingEnabledCamerasReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				camerasToConfigs: z.optional(z.record(z.unknown())),
			}),
		)
		.nullable()
		.describe(
			"Cameras at a location that have line crossing enabled with their configurations",
		),
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
						}),
					),
				),
				metrics: z
					.optional(
						z.object({
							averageEntriesPerHour: z
								.number()
								.describe("Average number of entries (ingress) per hour"),
							averageExitsPerHour: z
								.number()
								.describe("Average number of exits (egress) per hour"),
							mostEntriesInHour: z
								.object({
									count: z
										.number()
										.describe("Maximum number of entries in a single hour"),
									timestamp: z
										.string()
										.describe("ISO timestamp of the hour with most entries"),
									hourLabel: z
										.string()
										.describe(
											"Human-readable hour label (e.g., '2:00 PM - 3:00 PM')",
										),
								})
								.describe("Hour with the most entries"),
							mostExitsInHour: z
								.object({
									count: z
										.number()
										.describe("Maximum number of exits in a single hour"),
									timestamp: z
										.string()
										.describe("ISO timestamp of the hour with most exits"),
									hourLabel: z
										.string()
										.describe(
											"Human-readable hour label (e.g., '2:00 PM - 3:00 PM')",
										),
								})
								.describe("Hour with the most exits"),
							busiestHour: z
								.object({
									totalCount: z
										.number()
										.describe("Total entries + exits in the busiest hour"),
									timestamp: z
										.string()
										.describe("ISO timestamp of the busiest hour"),
									hourLabel: z
										.string()
										.describe(
											"Human-readable hour label (e.g., '2:00 PM - 3:00 PM')",
										),
									entries: z
										.number()
										.describe("Number of entries in the busiest hour"),
									exits: z
										.number()
										.describe("Number of exits in the busiest hour"),
								})
								.describe(
									"Hour with the most total activity (entries + exits)",
								),
						}),
					)
					.describe("Calculated metrics from the crossing count data"),
			}),
		)
		.nullable()
		.describe(
			"Threshold crossing count report showing ingress and egress counts over time with calculated metrics",
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
						}),
					),
				),
			}),
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
							eventCountMap: z.optional(
								z.record(z.union([z.number(), z.boolean(), z.string()])),
							),
						}),
					),
				),
			}),
		)
		.nullable()
		.describe(
			"Custom LLM report showing event data over time - supports COUNT, PERCENT, and BOOLEAN prompt types",
		),
	auditFeedReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				auditEvents: z.optional(
					z.array(
						z.object({
							timestamp: z.optional(z.string()),
							timestampMs: z.optional(z.number()),
							action: z.optional(z.string()),
							displayText: z.optional(z.string()),
							principalName: z.optional(z.string()),
							principalUuid: z.optional(z.string()),
							principalType: z.optional(z.string()),
							targetName: z.optional(z.string()),
							targetUuid: z.optional(z.string()),
							targetType: z.optional(z.string()),
							description: z.optional(z.string()),
						}),
					),
				),
			}),
		)
		.describe("Audit feed showing user actions"),
	diagnosticFeedReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				diagnosticEvents: z.optional(
					z.array(
						z.object({
							timestampMs: z.optional(z.number()),
							deviceUuid: z.optional(z.string()),
							eventType: z.optional(z.string()),
							description: z.optional(z.string()),
						}),
					),
				),
			}),
		)
		.describe("Diagnostic feed showing device events"),
	thresholdCrossingEventsReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				events: z.optional(
					z.array(
						z.object({
							timestampMs: z.optional(z.number()),
							direction: z.optional(z.string()),
							objectType: z.optional(z.string()),
						}),
					),
				),
			}),
		)
		.describe("Individual threshold crossing events"),
	customEventsReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				timeSeriesDataPoints: z.optional(
					z.array(
						z.object({
							dateLocal: z.optional(z.string()),
							dateUtc: z.optional(z.string()),
							eventCountMap: z.optional(z.record(z.any())),
						}),
					),
				),
			}),
		)
		.describe("Custom events report time series"),
	peopleCountEventsReport: z
		.optional(
			z.object({
				error: z.optional(z.boolean()),
				errorMsg: z.optional(z.string()),
				events: z.optional(
					z.array(
						z.object({
							deviceUuid: z.optional(z.string()),
							timestampMs: z.optional(z.number()),
							count: z.optional(z.number()),
						}),
					),
				),
			}),
		)
		.describe("Most recent people count events"),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
