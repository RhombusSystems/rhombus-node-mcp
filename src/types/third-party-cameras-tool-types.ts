import { z } from "zod";
import { CONFIRMATION_ARGS } from "../utils/confirmation.js";

/** Cameras one assign call can carry; a site's spreadsheet is planned and confirmed in batches of this size. */
export const MAX_ASSIGN_CAMERAS = 50;

export const CameraToAssign = z.object({
  nvr: z
    .string()
    .describe("The NVR (Relay Core) to assign the camera to: its serial number, name or uuid."),
  name: z.string().min(1).describe("The name the camera gets in Rhombus."),
  ipAddress: z
    .string()
    .nullable()
    .describe("The camera's IP address, as in the user's list. Give this, macAddress or rtspUrl."),
  macAddress: z.string().nullable().describe("The camera's MAC address, when the list has one."),
  rtspUrl: z
    .string()
    .nullable()
    .describe(
      "Only when the user named a specific stream: the RTSP URL to assign. Otherwise null — the camera's validated stream is used."
    ),
});
export type CameraToAssign = z.infer<typeof CameraToAssign>;

export const TOOL_ARGS = {
  requestType: z
    .enum(["list-nvrs", "list-cameras", "assign"])
    .describe("The type of request to make."),
  nvr: z
    .string()
    .nullable()
    .describe(
      "Only for list-cameras: limit the result to one NVR (serial number, name or uuid) — the cameras it has discovered and the cameras assigned to it. Null for every NVR."
    ),
  cameras: z
    .array(CameraToAssign)
    .max(MAX_ASSIGN_CAMERAS)
    .nullable()
    .describe(
      `Only for assign: the cameras to assign and name, at most ${MAX_ASSIGN_CAMERAS} per call. Send the SAME list on every call of one batch (the plan, the confirming call and each continuation).`
    ),
  startAt: z
    .number()
    .int()
    .min(0)
    .nullable()
    .describe(
      "Only for assign, on a continuation: the nextStartAt the previous call returned. Null on the first call."
    ),
  ...CONFIRMATION_ARGS,
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const PLAN_STATUSES = [
  "ready",
  "already-assigned",
  "not-validated",
  "not-discovered",
  "ambiguous",
  "unknown-nvr",
  "nvr-full",
  "duplicate",
  "unknown-stream",
] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const OUTPUT_SCHEMA = z.object({
  error: z.string().optional().describe("Set when the request failed; the message says why."),
  needUserInput: z
    .boolean()
    .optional()
    .describe("True when the user must confirm the plan before anything is assigned."),
  commandForUser: z
    .string()
    .optional()
    .describe("What to ask the user, with the confirmation id to send back when they agree."),
  nvrs: z.array(z.any()).optional().describe("list-nvrs: the org's NVRs."),
  unassigned: z
    .array(z.any())
    .optional()
    .describe("list-cameras: discovered cameras with a validated stream, ready to assign."),
  notValidated: z
    .array(z.any())
    .optional()
    .describe(
      "list-cameras: discovered cameras whose stream has not passed validation (wrong credentials or path, or not reachable)."
    ),
  assigned: z
    .array(z.any())
    .optional()
    .describe("list-cameras: third-party cameras already assigned."),
  plan: z
    .array(z.any())
    .optional()
    .describe("assign: one row per camera in the list, with its status and what will happen."),
  results: z
    .array(z.any())
    .optional()
    .describe("assign (confirmed): what happened to each camera tried."),
  nextStartAt: z
    .number()
    .nullable()
    .optional()
    .describe("assign (confirmed): pass as startAt to continue; null when the batch is finished."),
  remaining: z.number().optional().describe("assign (confirmed): ready cameras not tried yet."),
  note: z.string().optional().describe("What to tell the user or do next."),
});
export type OutputSchema = z.infer<typeof OUTPUT_SCHEMA>;
