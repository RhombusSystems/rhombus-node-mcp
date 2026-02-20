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

const TOOL_DESCRIPTION = `
**Scope:** This tool returns **aggregated counts and time-series summaries** over specified intervals and scopes. Use **events-tool** when you need raw, event-level data (individual events with timestamps). Use this tool for high-level reports, analytics, and trends—especially over periods of a day or more.

---

**People / occupancy counting strategy**

When asked to count people on a camera or at a location, follow this strategy:
1. **Always call GET_OCCUPANCY_ENABLED_CAMERAS first** to discover which cameras have occupancy counting enabled.
2. If the target camera IS in the list, call **GET_OCCUPANCY_COUNT_REPORT** for that device. The response will automatically include a \`faceCountEnrichment\` field with the number of unique individuals identified by face recognition in the same time range. Present both data sources: occupancy estimate and unique face count.
3. If the target camera is NOT in the list, **tell the user** that camera does not have occupancy counting enabled, and list the cameras that do. You can still call GET_SUMMARY_COUNT_REPORT with PEOPLE type — its response will also include \`faceCountEnrichment\` with unique face data as a fallback. If the PEOPLE count returns zero, the response will also include the list of occupancy-enabled cameras and a hint.
4. When both occupancy data and face recognition data are available, **synthesize both** in your answer (e.g., "Occupancy estimates ~15 people. Face recognition identified 9 unique individuals during this period.").

**PEOPLE type (in GET_SUMMARY_COUNT_REPORT):** Not a unique person count; it counts people-detection events. Requires people detection to be enabled on the camera. Use for high-level activity trends, not for deduplicated head counts.

---

**Summary and occupancy**
- **GET_SUMMARY_COUNT_REPORT:** Aggregated counts (people, faces, motion, vehicles, etc.) over time at device, location, or org scope. Interval: minutely, hourly, daily, weekly, monthly, yearly. When called with PEOPLE type at DEVICE scope, the response is automatically enriched with face recognition data.
- **GET_OCCUPANCY_ENABLED_CAMERAS:** List of cameras with occupancy reporting enabled. **Always call this first** before any people/occupancy counting request to verify camera support.
- **GET_OCCUPANCY_COUNT_REPORT:** Occupancy count time series for a specific device over a time range. Response is automatically enriched with face recognition data. If the device does not support occupancy, the response will include a hint and the list of cameras that do.

---

**Line crossing**
- **GET_LINE_CROSSING_ENABLED_CAMERAS:** Cameras at a location with line crossing enabled, plus their configs. Call first to see which cameras support threshold crossing reports.
- **GET_THRESHOLD_CROSSING_COUNT_REPORT:** Ingress/egress counts for line crossings over time. Supports human and vehicle detection; bucket size: quarter hour, hour, day, week. Response includes computed metrics: average entries/exits per hour, hour with most entries/exits, busiest hour (with breakdown).

---

**Custom LLM events**
- **FIND_PROMPT_CONFIGURATIONS:** All custom event prompt configurations (e.g. "black dog sightings", "delivery truck arrivals", "parking availability %"). Each has prompt text, UUID, and promptType (COUNT, PERCENT, BOOLEAN). Call first to discover available custom events.
- **GET_CUSTOM_LLM_REPORT:** **This is the PRIMARY way to get custom event reports.** Aggregated time-series for one custom event by prompt UUID. Automatically selects the correct API based on promptType: COUNT (numeric counts), PERCENT (percentages), BOOLEAN (true/false). Intervals: minutely, quarter-hourly, hourly, daily, weekly, monthly. **Always use this for custom event reports, trends, and analytics.** Use FIND_PROMPT_CONFIGURATIONS first to get the promptUuid and promptType.
- **GET_CUSTOM_EVENTS_REPORT:** Raw individual event values only (not aggregated). Use only when you need per-event granularity, not for reports or trends.

---

**Audit and diagnostics**
- **GET_AUDIT_FEED:** Audit log of all user/admin actions in the org over a time range. Returns who did what and when (principalName, targetName, action, displayText).
- **GET_DIAGNOSTIC_FEED:** Device diagnostic events over a time range.
- **GET_THRESHOLD_CROSSING_EVENTS:** Individual line-crossing events (not aggregated counts).
- **GET_PEOPLE_COUNT_EVENTS:** Most recent people count readings for specified devices.
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
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS.shape,
			outputSchema: OUTPUT_SCHEMA.shape,
		},
		TOOL_HANDLER,
	);
}
