import { z } from "zod";
import { SCHEDULE_CONFIGS_EXAMPLE } from "./create-camera-policy-tool-types.js";

export enum CameraPolicyToolRequestType {
	LIST = "list",
	GET = "get",
	UPDATE = "update",
	DELETE = "delete",
	ASSIGN_CAMERAS = "assign-cameras",
	UNASSIGN_CAMERAS = "unassign-cameras",
}

export const TOOL_ARGS = {
	requestType: z
		.nativeEnum(CameraPolicyToolRequestType)
		.describe("The type of camera policy operation to perform."),
	policyUuid: z
		.string()
		.nullable()
		.describe(
			"The UUID of the camera policy. Required for every requestType except 'list'.",
		),
	name: z
		.string()
		.nullable()
		.describe(
			"A new name for the policy. Only used by 'update'; omit to leave the name unchanged.",
		),
	description: z
		.string()
		.nullable()
		.describe(
			"A new description for the policy. Only used by 'update'; omit to leave it unchanged.",
		),
	scheduleConfigs: z
		.string()
		.nullable()
		.describe(
			`Only used by 'update'. JSON string array of {"scheduleUuid","activities"} objects — e.g. ` +
				`${SCHEDULE_CONFIGS_EXAMPLE}. Resolve schedule names to UUIDs with schedule-tool first; ` +
				`never invent a scheduleUuid. Passing this REPLACES all of the policy's existing ` +
				`schedule triggers, so include every window the policy should keep, not just the new ` +
				`one. Omit to leave the triggers unchanged.`,
		),
	cameraUuids: z
		.string()
		.nullable()
		.describe(
			"Comma-separated camera UUIDs. Required for 'assign-cameras' and 'unassign-cameras'. " +
				"Resolve camera names to UUIDs with get-entity-tool first.",
		),
	confirmDeleteInUse: z
		.boolean()
		.nullable()
		.describe(
			"Only for 'delete'. Deleting a policy that cameras are still assigned to leaves those " +
				"cameras with no policy, so 'delete' refuses by default and lists them. Set true to " +
				"delete anyway, after telling the user which cameras are affected.",
		),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const SCHEDULED_TRIGGER_OUTPUT = z.object({
	scheduleUuid: z.string().optional(),
	scheduleName: z.string().optional(),
	scheduleWindows: z
		.array(z.string())
		.optional()
		.describe('When the schedule is active, e.g. ["Monday 09:00 – Monday 17:00"].'),
	activities: z
		.array(z.string())
		.optional()
		.describe("The activities that trigger an alert during this schedule."),
});

const POLICY_OUTPUT = z.object({
	uuid: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	defaultActivities: z
		.array(z.string())
		.optional()
		.describe("Activities that trigger at all times, outside any schedule."),
	scheduledTriggers: z.array(SCHEDULED_TRIGGER_OUTPUT).optional(),
	assignedCameraCount: z
		.number()
		.optional()
		.describe(
			"How many cameras this policy is assigned to. Pre-computed so the count never has to be derived by scanning assignedCameras.",
		),
	assignedCameras: z
		.array(z.object({ uuid: z.string().optional(), name: z.string().optional() }))
		.optional()
		.describe("The cameras this policy is assigned to."),
});
export type CameraPolicyOutput = z.infer<typeof POLICY_OUTPUT>;

/** The subset the API layer maps; camera assignment is joined on afterwards. */
export type CameraPolicy = Omit<CameraPolicyOutput, "assignedCameraCount" | "assignedCameras">;

export type ScheduledTriggerInput = {
	scheduleUuid: string;
	triggerSet: { activity: string }[];
};

export const OUTPUT_SCHEMA = z.object({
	policies: z.array(POLICY_OUTPUT).optional().describe("All camera policies in the organization."),
	policy: POLICY_OUTPUT.optional().describe("A single camera policy."),
	updated: z
		.object({ success: z.boolean().optional(), policyUuid: z.string().optional() })
		.optional(),
	deleted: z
		.object({ success: z.boolean().optional(), policyUuid: z.string().optional() })
		.optional(),
	assigned: z
		.object({
			success: z.boolean().optional(),
			policyUuid: z.string().optional(),
			cameraCount: z.number().optional(),
		})
		.optional(),
	note: z
		.string()
		.optional()
		.describe("A caveat about this result that the user needs to be told."),
	warningMsg: z
		.string()
		.optional()
		.describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
	error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
