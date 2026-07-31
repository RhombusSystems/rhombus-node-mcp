import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  findPromptConfigurations,
  getAuditFeed,
  getCustomEventsReport,
  getCustomLLMReport,
  getDiagnosticFeed,
  getLineCrossingEnabledCameras,
  getOccupancyCountReport,
  getOccupancyEnabledCameras,
  getPeopleCountEvents,
  getSummaryCountReport,
  getThresholdCrossingCountReport,
  getThresholdCrossingEvents,
  getUniqueFaceCount,
} from "../api/report-tool-api.js";
import { logger } from "../logger.js";
import {
  OUTPUT_SCHEMA,
  RequestType,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/report-tool-types.js";
import { extractFromToolExtra } from "../util.js";

const TOOL_NAME = "report-tool";

// Tool descriptions are billed on EVERY LLM call even while the tool is
// deferred behind hosted tool_search, so this string carries only what the
// model needs to CHOOSE this tool. Per-requestType behaviour, call ordering,
// and the people/occupancy strategy live on the requestType parameter
// description (unbilled until the tool is loaded, still in front of the model
// when it builds the call). See PERF_MASTER_PLAN P2 #4a.
const TOOL_DESCRIPTION = `
**Scope:** **aggregated counts and time-series summaries** over specified intervals and scopes (device, location, region, org). Use **events-tool** when you need raw, event-level data (individual events with timestamps). Use this tool for high-level reports, analytics, and trends—especially over periods of a day or more.

Covers: people counting and occupancy reports (enriched with unique-face counts), line-crossing / threshold ingress-egress counts, custom LLM event reports and their prompt configurations (e.g. "black dog sightings", "delivery truck arrivals", "parking availability %"), the org audit log of user and admin actions, device diagnostic feeds, and the most recent people-count readings for a device.

Pick one with "requestType". Each type's arguments, response enrichment, and required call ordering (some types must be called first to discover which cameras support a feature) are documented on the requestType parameter.

**Interval guidance:** A shorter interval (HOURLY instead of DAILY) gives a better representation of data over time. Balance interval and range so you don't request too much data. For ranges spanning a week or so, HOURLY is appropriate.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestType } = args;

	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	if (requestType === RequestType.GET_SUMMARY_COUNT_REPORT) {
		const { summaryCountRequest } = args;

		if (!summaryCountRequest) {
			throw new Error("summaryCountRequest is required");
		}

		const { interval, scope, types, rangeStart, rangeEnd, uuid, timeZone } =
			summaryCountRequest;
		const startTimeMs = new Date(rangeStart).getTime();
		const endTimeMs = new Date(rangeEnd).getTime();
		const report = await getSummaryCountReport(
			interval,
			scope,
			types,
			uuid ?? undefined,
			endTimeMs,
			startTimeMs,
			requestModifiers,
			sessionId,
			timeZone,
		);

		const enrichedReport: typeof report & {
			faceCountEnrichment?: {
				uniqueFaceCount: number;
				totalFaceEvents: number;
			};
			hint?: string;
			occupancyEnabledCameras?: {
				uuid?: string;
				name?: string;
				locationUuid?: string;
			}[];
		} = { ...report };

		const isPeopleQuery =
			types.includes("PEOPLE") && scope === "DEVICE" && uuid;
		if (isPeopleQuery) {
			try {
				const faceCount = await getUniqueFaceCount(
					uuid,
					startTimeMs,
					endTimeMs,
					requestModifiers,
					sessionId,
				);
				enrichedReport.faceCountEnrichment = faceCount;
			} catch (err) {
				logger.error(
					"Failed to fetch face count enrichment for summary report",
					err,
				);
			}

			const allZero =
				!report?.timeSeriesDataPoints?.length ||
				report.timeSeriesDataPoints.every(
					(dp) =>
						!dp.eventCountMap ||
						Object.values(dp.eventCountMap).every(
							(v) => v === 0 || v === null || v === undefined,
						),
				);

			if (allZero) {
				try {
					const camerasReport = await getOccupancyEnabledCameras(
						requestModifiers,
						sessionId,
					);
					enrichedReport.occupancyEnabledCameras = camerasReport?.cameras?.map(
						(c) => ({
							uuid: c.uuid,
							name: c.name,
							locationUuid: c.locationUuid,
						}),
					);
					enrichedReport.hint =
						"People detection returned zero results for this camera. This usually means people counting is not enabled on this device. " +
						"The occupancyEnabledCameras field lists cameras that support occupancy counting. " +
						"Face recognition data is available in faceCountEnrichment above.";
				} catch (err) {
					logger.error(
						"Failed to fetch occupancy-enabled cameras for hint",
						err,
					);
				}
			}
		}

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(enrichedReport),
				},
			],
			structuredContent: {
				summaryCountReport: enrichedReport,
			},
		};
	}
	if (requestType === RequestType.GET_OCCUPANCY_COUNT_REPORT) {
		const { occupancyCountRequest } = args;
		if (!occupancyCountRequest) {
			throw new Error("occupancyCountRequest is required");
		}
		const { deviceUuid, rangeStart, rangeEnd, interval } =
			occupancyCountRequest;
		const startTimeMs = new Date(rangeStart).getTime();
		const endTimeMs = new Date(rangeEnd).getTime();
		const report = await getOccupancyCountReport(
			deviceUuid,
			startTimeMs,
			endTimeMs,
			interval,
			requestModifiers,
			sessionId,
		);

		const enrichedReport: typeof report & {
			faceCountEnrichment?: {
				uniqueFaceCount: number;
				totalFaceEvents: number;
			};
			hint?: string;
			occupancyEnabledCameras?: {
				uuid?: string;
				name?: string;
				locationUuid?: string;
			}[];
		} = { ...report };

		try {
			const faceCount = await getUniqueFaceCount(
				deviceUuid,
				startTimeMs,
				endTimeMs,
				requestModifiers,
				sessionId,
			);
			enrichedReport.faceCountEnrichment = faceCount;
		} catch (err) {
			logger.error(
				"Failed to fetch face count enrichment for occupancy report",
				err,
			);
		}

		const allZero =
			!report?.timeSeriesDataPoints?.length ||
			report.timeSeriesDataPoints.every(
				(dp) =>
					!dp.eventCountMap ||
					Object.values(dp.eventCountMap).every(
						(v) => v === 0 || v === null || v === undefined,
					),
			);

		if (allZero) {
			try {
				const camerasReport = await getOccupancyEnabledCameras(
					requestModifiers,
					sessionId,
				);
				const enabledUuids = new Set(
					camerasReport?.cameras?.map((c) => c.uuid).filter(Boolean) ?? [],
				);
				if (!enabledUuids.has(deviceUuid)) {
					enrichedReport.occupancyEnabledCameras = camerasReport?.cameras?.map(
						(c) => ({
							uuid: c.uuid,
							name: c.name,
							locationUuid: c.locationUuid,
						}),
					);
					enrichedReport.hint =
						"This camera does not have occupancy counting enabled (no occupancy polygon defined). " +
						"The occupancyEnabledCameras field lists cameras that do support occupancy counting. " +
						"Face recognition data is available in faceCountEnrichment above.";
				} else {
					enrichedReport.hint =
						"This camera has occupancy counting enabled but returned zero counts for the requested time range. " +
						"Face recognition data is available in faceCountEnrichment above.";
				}
			} catch (err) {
				logger.error("Failed to fetch occupancy-enabled cameras for hint", err);
			}
		}

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(enrichedReport),
				},
			],
			structuredContent: {
				occupancyCountReport: enrichedReport,
			},
		};
	}

	if (requestType === RequestType.GET_OCCUPANCY_ENABLED_CAMERAS) {
		const report = await getOccupancyEnabledCameras(
			requestModifiers,
			sessionId,
		);

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(report),
				},
			],
			structuredContent: {
				occupancyEnabledCamerasReport: report,
			},
		};
	}

	if (requestType === RequestType.GET_LINE_CROSSING_ENABLED_CAMERAS) {
		const { lineCrossingEnabledCamerasRequest } = args;
		if (!lineCrossingEnabledCamerasRequest) {
			throw new Error("lineCrossingEnabledCamerasRequest is required");
		}
		const { locationUuid } = lineCrossingEnabledCamerasRequest;
		const report = await getLineCrossingEnabledCameras(
			locationUuid,
			requestModifiers,
			sessionId,
		);

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(report),
				},
			],
			structuredContent: {
				lineCrossingEnabledCamerasReport: report,
			},
		};
	}

	if (requestType === RequestType.GET_THRESHOLD_CROSSING_COUNT_REPORT) {
		const { thresholdCrossingCountRequest } = args;
		if (!thresholdCrossingCountRequest) {
			throw new Error("thresholdCrossingCountRequest is required");
		}
		const {
			deviceUuid,
			rangeStart,
			rangeEnd,
			bucketSize,
			crossingObject,
			dedupe,
		} = thresholdCrossingCountRequest;
		const report = await getThresholdCrossingCountReport(
			deviceUuid,
			new Date(rangeStart).getTime(),
			new Date(rangeEnd).getTime(),
			bucketSize,
			crossingObject,
			dedupe,
			requestModifiers,
			sessionId,
		);

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(report),
				},
			],
			structuredContent: {
				thresholdCrossingCountReport: report,
			},
		};
	}

	if (requestType === RequestType.FIND_PROMPT_CONFIGURATIONS) {
		const report = await findPromptConfigurations(requestModifiers, sessionId);

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(report),
				},
			],
			structuredContent: {
				promptConfigurationsReport: report,
			},
		};
	}

	if (requestType === RequestType.GET_CUSTOM_LLM_REPORT) {
		const { customLLMReportRequest } = args;
		if (!customLLMReportRequest) {
			throw new Error("customLLMReportRequest is required");
		}
		const { promptUuid, promptType, rangeStart, rangeEnd, interval } =
			customLLMReportRequest;
		const report = await getCustomLLMReport(
			promptUuid,
			promptType,
			new Date(rangeStart).getTime(),
			new Date(rangeEnd).getTime(),
			interval,
			requestModifiers,
			sessionId,
		);

		// Log the report data to help debug
		logger.log(
			"📊 Custom LLM Report Tool Response:",
			JSON.stringify({
				promptType,
				hasError: report?.error,
				dataPointsCount: report?.timeSeriesDataPoints?.length,
				firstDataPoint: report?.timeSeriesDataPoints?.[0],
			}),
		);

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(report),
				},
			],
			structuredContent: {
				customLLMReport: report,
			},
		};
	}

	if (requestType === RequestType.GET_AUDIT_FEED) {
		const { auditFeedRequest } = args;
		if (!auditFeedRequest) {
			throw new Error("auditFeedRequest is required");
		}
		const report = await getAuditFeed(
			new Date(auditFeedRequest.startTime).getTime(),
			new Date(auditFeedRequest.endTime).getTime(),
			requestModifiers,
			sessionId,
		);
		return {
			content: [{ type: "text" as const, text: JSON.stringify(report) }],
			structuredContent: { auditFeedReport: report },
		};
	}

	if (requestType === RequestType.GET_DIAGNOSTIC_FEED) {
		const { diagnosticFeedRequest } = args;
		if (!diagnosticFeedRequest) {
			throw new Error("diagnosticFeedRequest is required");
		}
		const report = await getDiagnosticFeed(
			new Date(diagnosticFeedRequest.startTime).getTime(),
			new Date(diagnosticFeedRequest.endTime).getTime(),
			requestModifiers,
			sessionId,
		);
		return {
			content: [{ type: "text" as const, text: JSON.stringify(report) }],
			structuredContent: { diagnosticFeedReport: report },
		};
	}

	if (requestType === RequestType.GET_THRESHOLD_CROSSING_EVENTS) {
		const { thresholdCrossingEventsRequest } = args;
		if (!thresholdCrossingEventsRequest) {
			throw new Error("thresholdCrossingEventsRequest is required");
		}
		const report = await getThresholdCrossingEvents(
			thresholdCrossingEventsRequest.deviceUuid,
			new Date(thresholdCrossingEventsRequest.startTime).getTime(),
			new Date(thresholdCrossingEventsRequest.endTime).getTime(),
			requestModifiers,
			sessionId,
		);
		return {
			content: [{ type: "text" as const, text: JSON.stringify(report) }],
			structuredContent: { thresholdCrossingEventsReport: report },
		};
	}

	if (requestType === RequestType.GET_CUSTOM_EVENTS_REPORT) {
		const { customEventsReportRequest } = args;
		if (!customEventsReportRequest) {
			throw new Error("customEventsReportRequest is required");
		}
		const report = await getCustomEventsReport(
			customEventsReportRequest.promptUuid,
			new Date(customEventsReportRequest.startTime).getTime(),
			new Date(customEventsReportRequest.endTime).getTime(),
			customEventsReportRequest.interval,
			requestModifiers,
			sessionId,
		);
		return {
			content: [{ type: "text" as const, text: JSON.stringify(report) }],
			structuredContent: { customEventsReport: report },
		};
	}

	if (requestType === RequestType.GET_PEOPLE_COUNT_EVENTS) {
		const { peopleCountEventsRequest } = args;
		if (!peopleCountEventsRequest) {
			throw new Error("peopleCountEventsRequest is required");
		}
		const report = await getPeopleCountEvents(
			peopleCountEventsRequest.deviceUuids,
			requestModifiers,
			sessionId,
		);
		return {
			content: [{ type: "text" as const, text: JSON.stringify(report) }],
			structuredContent: { peopleCountEventsReport: report },
		};
	}

	return {
		content: [
			{
				type: "text" as const,
				text: "",
			},
		],
		structuredContent: {
			error: true,
			errorMsg: "Error while fetching report information",
		},
	};
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Reports",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS.shape,
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: true },
		},
		TOOL_HANDLER,
	);
}
