import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	deleteCameraPolicy,
	getCameraPolicies,
	getCamerasByPolicy,
	setPolicyOnCameras,
	updateCameraPolicy,
} from "../api/camera-policy-tool-api.js";
import {
	CameraPolicyToolRequestType,
	OUTPUT_SCHEMA,
	TOOL_ARGS,
	type CameraPolicyOutput,
	type ScheduledTriggerInput,
	type ToolArgs,
} from "../types/camera-policy-tool-types.js";
import {
	parseCameraUuids,
	parseScheduleConfigs,
} from "../types/create-camera-policy-tool-types.js";
import {
	createToolStructuredContent,
	createToolTextContent,
	extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "camera-policy-tool";

const TOOL_DESCRIPTION = `
This tool reads and manages EXISTING camera alert policies — the rules that decide which camera activities raise an alert, and when.

To CREATE a new camera policy, use create-camera-policy-tool instead. This tool covers everything after creation.

It has the following modes of operation, determined by the "requestType" parameter:
- ${CameraPolicyToolRequestType.LIST}: List every camera policy with its schedules, trigger activities, and the cameras assigned to it.
- ${CameraPolicyToolRequestType.GET}: Get one policy in full. Requires policyUuid.
- ${CameraPolicyToolRequestType.UPDATE}: Rename a policy, change its description, and/or replace its schedule triggers. Requires policyUuid plus at least one of name, description, scheduleConfigs.
- ${CameraPolicyToolRequestType.DELETE}: Delete a policy. Requires policyUuid. Refuses (without deleting) while cameras are still assigned to it, and lists them — see confirmDeleteInUse.
- ${CameraPolicyToolRequestType.ASSIGN_CAMERAS}: Assign the policy to cameras. Requires policyUuid and cameraUuids.
- ${CameraPolicyToolRequestType.UNASSIGN_CAMERAS}: Remove the policy from cameras, leaving them with no policy. Requires policyUuid and cameraUuids.

A camera has at most ONE policy, so assigning a policy to a camera replaces whatever policy it had before. Say so when a camera already has one.
`;

/**
 * Join the camera assignments onto a policy. The camera holds the policyUuid, so
 * the count is pre-computed here rather than left for the model to derive by
 * scanning rows — under-enumeration of long tool results is a known failure.
 */
function withAssignments(
	policy: CameraPolicyOutput,
	byPolicy: Map<string, { uuid?: string; name?: string }[]>,
): CameraPolicyOutput {
	const cameras = (policy.uuid && byPolicy.get(policy.uuid)) || [];
	return { ...policy, assignedCameraCount: cameras.length, assignedCameras: cameras };
}

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
	const { requestModifiers, sessionId } = extractFromToolExtra(extra);

	try {
		switch (args.requestType) {
			case CameraPolicyToolRequestType.LIST: {
				const [{ policies, warningMsg }, byPolicy] = await Promise.all([
					getCameraPolicies(requestModifiers, sessionId),
					getCamerasByPolicy(requestModifiers, sessionId),
				]);
				const enriched = policies.map(policy => withAssignments(policy, byPolicy));
				const unassigned = enriched.filter(policy => policy.assignedCameraCount === 0);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					policies: enriched,
					warningMsg,
					note:
						enriched.length === 0
							? "This organization has no camera policies. Use create-camera-policy-tool to add one."
							: unassigned.length > 0
								? `${unassigned.length} of ${enriched.length} ${unassigned.length === 1 ? "policy is" : "policies are"} assigned to no cameras and therefore never fire: ${unassigned.map(policy => policy.name ?? policy.uuid).join(", ")}.`
								: undefined,
				});
			}

			case CameraPolicyToolRequestType.GET: {
				if (!args.policyUuid) {
					return createToolTextContent("policyUuid is required for 'get'.");
				}
				const [{ policies }, byPolicy] = await Promise.all([
					getCameraPolicies(requestModifiers, sessionId),
					getCamerasByPolicy(requestModifiers, sessionId),
				]);
				const policy = policies.find(entry => entry.uuid === args.policyUuid);
				if (!policy) {
					return createToolTextContent(
						`No camera policy in this organization has the uuid "${args.policyUuid}". Use requestType 'list' to see the policies that exist — do not guess a uuid.`,
					);
				}
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					policy: withAssignments(policy, byPolicy),
				});
			}

			case CameraPolicyToolRequestType.UPDATE: {
				if (!args.policyUuid) {
					return createToolTextContent("policyUuid is required for 'update'.");
				}
				if (!args.name?.trim() && !args.description?.trim() && !args.scheduleConfigs) {
					return createToolTextContent(
						"'update' needs at least one of name, description or scheduleConfigs — all were empty, so there is nothing to change.",
					);
				}

				// Validate before reading anything, so a malformed input costs no calls.
				let scheduledTriggers: ScheduledTriggerInput[] | undefined;
				if (args.scheduleConfigs) {
					const parsed = parseScheduleConfigs(args.scheduleConfigs);
					if (!parsed.ok) {
						return createToolTextContent(
							`RETRYABLE — nothing was changed. ${parsed.message}`,
						);
					}
					scheduledTriggers = parsed.value.map(config => ({
						scheduleUuid: config.scheduleUuid,
						triggerSet: config.activities.map(activity => ({ activity })),
					}));
				}

				// api2's updateCameraPolicy REPLACES the policy object, so sending only
				// the changed field would blank the others. Read first and merge.
				const { policies } = await getCameraPolicies(requestModifiers, sessionId);
				const existing = policies.find(entry => entry.uuid === args.policyUuid);
				if (!existing) {
					return createToolTextContent(
						`No camera policy in this organization has the uuid "${args.policyUuid}". Use requestType 'list' to see the policies that exist.`,
					);
				}

				const replacedTriggers = scheduledTriggers !== undefined;
				const mergedTriggers: ScheduledTriggerInput[] =
					scheduledTriggers ??
					existing.scheduledTriggers?.flatMap(trigger =>
						trigger.scheduleUuid
							? [
									{
										scheduleUuid: trigger.scheduleUuid,
										triggerSet: (trigger.activities ?? []).map(activity => ({
											activity,
										})),
									},
								]
							: [],
					) ??
					[];

				const { updated, warningMsg } = await updateCameraPolicy(
					{
						uuid: args.policyUuid,
						name: args.name?.trim() || existing.name,
						description: args.description?.trim() || existing.description,
						scheduledTriggers: mergedTriggers,
					},
					requestModifiers,
					sessionId,
				);

				const notes: string[] = [];
				if (replacedTriggers) {
					notes.push(
						`Replaced all schedule triggers — the policy now has ${mergedTriggers.length} ${mergedTriggers.length === 1 ? "trigger" : "triggers"}.`,
					);
				}
				if (
					existing.scheduledTriggers?.length &&
					!replacedTriggers &&
					existing.scheduledTriggers.some(trigger => !trigger.scheduleUuid)
				) {
					// A trigger with no resolvable scheduleUuid cannot be re-sent, so the
					// caller has to know it was dropped rather than preserved.
					notes.push(
						"One or more existing schedule triggers had no resolvable schedule and could not be preserved by this update — re-check the policy's schedules.",
					);
				}
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					updated,
					warningMsg,
					note: notes.length > 0 ? notes.join(" ") : undefined,
				});
			}

			case CameraPolicyToolRequestType.DELETE: {
				if (!args.policyUuid) {
					return createToolTextContent("policyUuid is required for 'delete'.");
				}
				const [{ policies }, byPolicy] = await Promise.all([
					getCameraPolicies(requestModifiers, sessionId),
					getCamerasByPolicy(requestModifiers, sessionId),
				]);
				const existing = policies.find(entry => entry.uuid === args.policyUuid);
				if (!existing) {
					return createToolTextContent(
						`No camera policy in this organization has the uuid "${args.policyUuid}". Use requestType 'list' to see the policies that exist.`,
					);
				}

				const assigned = byPolicy.get(args.policyUuid) ?? [];
				if (assigned.length > 0 && !args.confirmDeleteInUse) {
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						policy: withAssignments(existing, byPolicy),
						note:
							`NOT DELETED — nothing was changed. "${existing.name ?? args.policyUuid}" is still assigned to ` +
							`${assigned.length} ${assigned.length === 1 ? "camera" : "cameras"}: ` +
							`${assigned.map(camera => camera.name ?? camera.uuid).join(", ")}. Deleting it leaves ` +
							`${assigned.length === 1 ? "that camera" : "those cameras"} with no alert policy at all. Tell the user which ` +
							`cameras are affected and ask them to confirm, then call this tool again with confirmDeleteInUse: true.`,
					});
				}

				const { deleted, warningMsg } = await deleteCameraPolicy(
					args.policyUuid,
					requestModifiers,
					sessionId,
				);
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					deleted,
					warningMsg,
					note:
						assigned.length > 0
							? `Deleted "${existing.name ?? args.policyUuid}". ${assigned.length} ${assigned.length === 1 ? "camera" : "cameras"} (${assigned.map(camera => camera.name ?? camera.uuid).join(", ")}) now ${assigned.length === 1 ? "has" : "have"} no alert policy.`
							: `Deleted "${existing.name ?? args.policyUuid}". No cameras were assigned to it.`,
				});
			}

			case CameraPolicyToolRequestType.ASSIGN_CAMERAS:
			case CameraPolicyToolRequestType.UNASSIGN_CAMERAS: {
				const unassigning =
					args.requestType === CameraPolicyToolRequestType.UNASSIGN_CAMERAS;
				if (!args.policyUuid) {
					return createToolTextContent(
						`policyUuid is required for '${args.requestType}'.`,
					);
				}
				if (!args.cameraUuids) {
					return createToolTextContent(
						`cameraUuids is required for '${args.requestType}'.`,
					);
				}
				const parsed = parseCameraUuids(args.cameraUuids);
				if (!parsed.ok) {
					return createToolTextContent(
						`RETRYABLE — nothing was changed. ${parsed.message}`,
					);
				}

				const byPolicy = await getCamerasByPolicy(requestModifiers, sessionId);
				if (unassigning) {
					// Only clear cameras that actually carry THIS policy: writing an empty
					// policyUuid to a camera on some other policy would silently strip
					// that unrelated policy instead.
					const onThisPolicy = new Set(
						(byPolicy.get(args.policyUuid) ?? []).map(camera => camera.uuid),
					);
					const notOnPolicy = parsed.value.filter(uuid => !onThisPolicy.has(uuid));
					const toClear = parsed.value.filter(uuid => onThisPolicy.has(uuid));
					if (toClear.length === 0) {
						return createToolStructuredContent<OUTPUT_SCHEMA>({
							note: `Nothing was changed — none of the ${parsed.value.length} listed ${parsed.value.length === 1 ? "camera is" : "cameras are"} assigned to this policy. Check the assignment with requestType 'get' first.`,
						});
					}
					const { cameraCount, warningMsg } = await setPolicyOnCameras(
						toClear,
						// null, not "" — see setPolicyOnCameras: api2 rejects an
						// empty string for this RUUID-formatted field.
						null,
						requestModifiers,
						sessionId,
					);
					return createToolStructuredContent<OUTPUT_SCHEMA>({
						assigned: { success: true, policyUuid: args.policyUuid, cameraCount },
						warningMsg,
						note:
							notOnPolicy.length > 0
								? `Removed the policy from ${cameraCount} ${cameraCount === 1 ? "camera" : "cameras"}, which now ${cameraCount === 1 ? "has" : "have"} no alert policy. SCOPE REDUCED: ${notOnPolicy.length} of the listed cameras were skipped because they were not on this policy (${notOnPolicy.join(", ")}) — their own policies were left alone.`
								: `Removed the policy from ${cameraCount} ${cameraCount === 1 ? "camera" : "cameras"}, which now ${cameraCount === 1 ? "has" : "have"} no alert policy.`,
					});
				}

				// Assigning replaces whatever policy a camera already had; name the
				// displaced policies so the answer can say what changed.
				const displaced = new Map<string, string[]>();
				for (const [policyUuid, cameras] of byPolicy) {
					if (policyUuid === args.policyUuid) continue;
					for (const camera of cameras) {
						if (camera.uuid && parsed.value.includes(camera.uuid)) {
							const bucket = displaced.get(policyUuid) ?? [];
							bucket.push(camera.name ?? camera.uuid);
							displaced.set(policyUuid, bucket);
						}
					}
				}

				const { policies } = await getCameraPolicies(requestModifiers, sessionId);
				const existing = policies.find(entry => entry.uuid === args.policyUuid);
				if (!existing) {
					return createToolTextContent(
						`No camera policy in this organization has the uuid "${args.policyUuid}". Use requestType 'list' to see the policies that exist — assigning a non-existent policy would leave the cameras with no policy at all.`,
					);
				}

				const { cameraCount, warningMsg } = await setPolicyOnCameras(
					parsed.value,
					args.policyUuid,
					requestModifiers,
					sessionId,
				);
				const displacedNote = [...displaced.entries()]
					.map(([policyUuid, cameras]) => {
						const name =
							policies.find(entry => entry.uuid === policyUuid)?.name ?? policyUuid;
						return `${cameras.join(", ")} (was on "${name}")`;
					})
					.join("; ");
				return createToolStructuredContent<OUTPUT_SCHEMA>({
					assigned: { success: true, policyUuid: args.policyUuid, cameraCount },
					warningMsg,
					note: displacedNote
						? `Assigned "${existing.name ?? args.policyUuid}" to ${cameraCount} ${cameraCount === 1 ? "camera" : "cameras"}. This REPLACED the policy already on: ${displacedNote}.`
						: `Assigned "${existing.name ?? args.policyUuid}" to ${cameraCount} ${cameraCount === 1 ? "camera" : "cameras"}.`,
				});
			}
		}
	} catch (error: unknown) {
		return createToolStructuredContent<OUTPUT_SCHEMA>({
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}

	return createToolStructuredContent<OUTPUT_SCHEMA>({
		error: `Invalid requestType. Valid values are: ${Object.values(CameraPolicyToolRequestType).join(", ")}.`,
	});
};

export function createTool(server: McpServer) {
	server.registerTool(
		TOOL_NAME,
		{
			title: "Camera Policies",
			description: TOOL_DESCRIPTION,
			inputSchema: TOOL_ARGS,
			outputSchema: OUTPUT_SCHEMA.shape,
			annotations: { readOnlyHint: false, destructiveHint: true },
		},
		TOOL_HANDLER,
	);
}
