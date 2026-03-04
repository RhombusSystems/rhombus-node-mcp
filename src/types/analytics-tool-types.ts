import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export enum AnalyticsRequestType {
  SPACE_UTILIZATION = "space-utilization",
  TRAFFIC_FLOW = "traffic-flow",
  PEAK_VS_AVERAGE = "peak-vs-average",
  SCENE_INTELLIGENCE = "scene-intelligence",
  LOCATION_SUMMARY = "location-summary",
}

export const TOOL_ARGS = {
  requestType: z
    .nativeEnum(AnalyticsRequestType)
    .describe("The type of analytics report to generate."),

  spaceUtilizationRequest: z
    .object({
      locationUuid: z.string().describe("The location UUID to analyze."),
      startTimeMs: z.number().describe("Start time in milliseconds since epoch."),
      endTimeMs: z.number().describe("End time in milliseconds since epoch."),
      interval: z
        .enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
        .describe("Time interval for the report."),
    })
    .nullable()
    .describe(
      "Request for space utilization report. Compares per-camera people counts against running averages. Required for 'space-utilization'."
    ),

  trafficFlowRequest: z
    .object({
      locationUuid: z.string().describe("The location UUID to analyze."),
      startTimeMs: z.number().describe("Start time in milliseconds since epoch."),
      endTimeMs: z.number().describe("End time in milliseconds since epoch."),
      bucketSize: z
        .enum(["QUARTER_HOUR", "HOUR", "DAY", "WEEK"])
        .describe("Time bucket size for aggregation."),
      crossingObject: z
        .enum(["HUMAN", "VEHICLE", "UNKNOWN"])
        .describe("Type of object to track."),
    })
    .nullable()
    .describe(
      "Request for multi-camera traffic flow report. Compares ingress/egress across all line-crossing cameras at a location. Required for 'traffic-flow'."
    ),

  peakVsAverageRequest: z
    .object({
      uuid: z
        .string()
        .nullable()
        .describe("Device or location UUID depending on scope."),
      scope: z
        .enum(["DEVICE", "LOCATION", "ORG"])
        .describe("Level of granularity."),
      startTimeMs: z.number().describe("Start time in milliseconds since epoch."),
      endTimeMs: z.number().describe("End time in milliseconds since epoch."),
      timeZone: z
        .string()
        .nullable()
        .describe("Timezone string for bucketing (e.g. 'America/New_York')."),
    })
    .nullable()
    .describe(
      "Request for peak-vs-average analysis. Shows hourly actual counts vs historical running averages. Required for 'peak-vs-average'."
    ),

  sceneIntelligenceRequest: z
    .object({
      deviceFacetUuid: z
        .string()
        .describe("Camera device UUID (with optional facet suffix) to query."),
      prompt: z
        .string()
        .describe(
          "The question to ask the camera (e.g. 'How many treadmills are in use?')."
        ),
      promptType: z
        .enum(["COUNT", "PERCENT", "BOOLEAN"])
        .describe(
          "Type of answer expected: COUNT for numbers, PERCENT for percentages, BOOLEAN for yes/no."
        ),
      timestampMs: z
        .number()
        .nullable()
        .describe(
          "Optional timestamp to query a historical moment. Omit for real-time."
        ),
    })
    .nullable()
    .describe(
      "Request for real-time scene intelligence. Asks a camera an arbitrary question using AI. Required for 'scene-intelligence'."
    ),

  locationSummaryRequest: z
    .object({
      locationUuid: z.string().describe("The location UUID to summarize."),
      startTimeMs: z.number().describe("Start time in milliseconds since epoch."),
      endTimeMs: z.number().describe("End time in milliseconds since epoch."),
    })
    .nullable()
    .describe(
      "Request for a comprehensive location analytics summary covering people counts, traffic flow, occupancy, and comparison to averages. Required for 'location-summary'."
    ),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const PerCameraUtilization = z.object({
  cameraUuid: z.string().optional(),
  cameraName: z.string().optional(),
  totalCount: z.number().optional(),
  averageCount: z.number().optional(),
  deltaPercent: z.number().optional().describe("Percentage above/below average. Positive = busier than normal."),
});

const TrafficFlowEntry = z.object({
  cameraUuid: z.string().optional(),
  cameraName: z.string().optional(),
  totalIngress: z.number().optional(),
  totalEgress: z.number().optional(),
  totalTraffic: z.number().optional(),
  peakHour: z.string().optional().describe("Human-readable peak hour label."),
  peakHourTraffic: z.number().optional(),
});

const HourlyComparison = z.object({
  hour: z.string().optional().describe("Hour label (e.g. '9 AM', '2 PM')."),
  actualCount: z.number().optional(),
  averageCount: z.number().optional(),
  deltaPercent: z.number().optional(),
});

const SceneResult = z.object({
  value: z.string().optional().describe("The AI answer to the question."),
  prompt: z.string().optional(),
  timestampMs: z.number().optional(),
  checkCondition: z.boolean().optional(),
});

export const OUTPUT_SCHEMA = z.object({
  spaceUtilization: z
    .object({
      locationUuid: z.string().optional(),
      cameras: z.array(PerCameraUtilization).optional(),
      summary: z
        .object({
          totalPeopleCount: z.number().optional(),
          averagePeopleCount: z.number().optional(),
          overallDeltaPercent: z.number().optional(),
          busiestCamera: z.string().optional(),
          quietestCamera: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .describe("Space utilization report with per-camera counts vs running averages."),

  trafficFlow: z
    .object({
      locationUuid: z.string().optional(),
      cameras: z.array(TrafficFlowEntry).optional(),
      summary: z
        .object({
          totalIngress: z.number().optional(),
          totalEgress: z.number().optional(),
          totalTraffic: z.number().optional(),
          busiestEntrance: z.string().optional(),
          busiestEntranceTraffic: z.number().optional(),
        })
        .optional(),
    })
    .optional()
    .describe("Multi-camera traffic flow comparison with ingress/egress ranking."),

  peakVsAverage: z
    .object({
      hourlyComparison: z.array(HourlyComparison).optional(),
      summary: z
        .object({
          peakHour: z.string().optional(),
          peakHourCount: z.number().optional(),
          quietestHour: z.string().optional(),
          quietestHourCount: z.number().optional(),
          overallAverageDelta: z.number().optional().describe("Overall delta vs average across all hours."),
        })
        .optional(),
    })
    .optional()
    .describe("Hour-by-hour actual vs. average analysis with peak/quiet hour identification."),

  sceneIntelligence: SceneResult.optional().describe(
    "Real-time AI answer from a camera about what it currently sees."
  ),

  locationSummary: z
    .object({
      locationUuid: z.string().optional(),
      peopleCounts: z
        .object({
          totalPeople: z.number().optional(),
          averagePerHour: z.number().optional(),
          peakHour: z.string().optional(),
          peakCount: z.number().optional(),
        })
        .optional(),
      trafficFlow: z
        .object({
          totalIngress: z.number().optional(),
          totalEgress: z.number().optional(),
          busiestEntrance: z.string().optional(),
        })
        .optional(),
      comparison: z
        .object({
          overallDeltaPercent: z.number().optional(),
          trend: z.string().optional().describe("'busier' or 'quieter' compared to average."),
        })
        .optional(),
    })
    .optional()
    .describe("Comprehensive multi-metric location analytics summary."),

  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
