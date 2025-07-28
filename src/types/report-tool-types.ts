import { z } from "zod";

export const TOOL_ARGS = {
  interval: z
    .enum(["MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .describe("The time interval for the report aggregation"),
  uuid: z
    .nullable(z.string())
    .describe(
      "The uuid of the device, or location, or organization depending on what scope is.  If scope is DEVICE, this is the device uuid.  If scope is LOCATION, this is the location uuid.  If scope is ORG, this is the organization uuid."
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
