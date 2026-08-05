import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { CameraPolicy, ScheduledTriggerInput } from "../types/camera-policy-tool-types.js";
import { describeWeeklyInterval, type RequestModifiers } from "../util.js";

function mapPolicy(raw: NonNullable<schema["CameraPolicyV2Type"]>): CameraPolicy {
	return {
		uuid: raw.uuid ?? undefined,
		name: raw.name ?? undefined,
		description: raw.description ?? undefined,
		defaultActivities:
			raw.defaultTriggers?.flatMap(trigger =>
				trigger?.activity ? [trigger.activity] : [],
			) ?? [],
		scheduledTriggers:
			raw.scheduledTriggers?.flatMap(trigger => {
				if (!trigger) return [];
				return [
					{
						scheduleUuid: trigger.schedule?.uuid ?? undefined,
						scheduleName: trigger.schedule?.name ?? undefined,
						scheduleWindows:
							trigger.schedule?.intervalList?.flatMap(interval => {
								const window = describeWeeklyInterval(
									interval?.minuteOfWeekStart,
									interval?.minuteOfWeekStop,
								);
								return window ? [window] : [];
							}) ?? [],
						activities:
							trigger.triggerSet?.flatMap(entry =>
								entry?.activity ? [entry.activity] : [],
							) ?? [],
					},
				];
			}) ?? [],
	};
}

export async function getCameraPolicies(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_GetCameraPoliciesWSResponse"]>({
		route: "/policy/getCameraPolicies",
		body: {} satisfies schema["Policy_GetCameraPoliciesWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		policies: res.policies?.flatMap(raw => (raw ? [mapPolicy(raw)] : [])) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

/**
 * api2's `updateCameraPolicy` REPLACES the whole policy object, so any field the
 * caller leaves out is blanked. Callers must read the current policy and merge
 * before calling this — see the tool's update branch.
 */
export async function updateCameraPolicy(
	policy: {
		uuid: string;
		name?: string;
		description?: string;
		scheduledTriggers: ScheduledTriggerInput[];
	},
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_UpdateCameraPolicyWSResponse"]>({
		route: "/policy/updateCameraPolicy",
		body: { policy } as schema["Policy_UpdateCameraPolicyWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		updated: { success: true, policyUuid: policy.uuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function deleteCameraPolicy(
	policyUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Policy_DeleteCameraPolicyWSResponse"]>({
		route: "/policy/deleteCameraPolicy",
		body: { policyUuid } satisfies schema["Policy_DeleteCameraPolicyWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		deleted: { success: true, policyUuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

/**
 * The camera holds its `policyUuid`, not the policy a camera list — so "which
 * cameras does this policy cover" is only answerable by listing cameras and
 * grouping. Callers use this both to enrich reads and to warn before a delete.
 */
export async function getCamerasByPolicy(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Camera_GetMinimalCameraStateListWSResponse"]>({
		route: "/camera/getMinimalCameraStateList",
		body: {} as schema["Camera_GetMinimalCameraStateListWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	const byPolicy = new Map<string, { uuid?: string; name?: string }[]>();
	for (const camera of res.cameraStates ?? []) {
		if (!camera?.policyUuid) continue;
		const bucket = byPolicy.get(camera.policyUuid) ?? [];
		bucket.push({ uuid: camera.uuid ?? undefined, name: camera.name ?? undefined });
		byPolicy.set(camera.policyUuid, bucket);
	}
	return byPolicy;
}

/**
 * Assign or clear the policy on a set of cameras. Passing a null `policyUuid`
 * with `policyUuidUpdated: true` is how api2 spells "unassign", so the caller
 * must be explicit about which one it means.
 *
 * It must be `null` and not `""`: `policyUuid` is declared
 * `format: RUUID, nullable: true`, so an empty string fails deserialization and
 * api2 rejects the whole bulk body with
 * `HTTP 400 {"msg":"JSON doesn't match expected object structure"}`.
 * Verified against api2.itg on 2026-08-05 — a mocked test cannot catch this.
 */
export async function setPolicyOnCameras(
	cameraUuids: string[],
	policyUuid: string | null,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Camera_UpdateCameraV2WSResponse"]>({
		route: "/camera/updateDetailsBulkV2",
		body: {
			cameraBulkDetails: cameraUuids.map(uuid => ({
				uuid,
				policyUuid,
				policyUuidUpdated: true,
			})),
		} as schema["Camera_UpdateCamerasBulkV2WSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		cameraCount: cameraUuids.length,
		warningMsg: res.warningMsg ?? undefined,
	};
}
