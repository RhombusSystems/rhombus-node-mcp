import { postApi } from "../network.js";
import type { ApiPayload, OutputSchema } from "../types/clips-tool-types.js";
import type { components } from "../types/schema-components.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function getSavedClips(
	args: ApiPayload,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Event_GetClipsWithProgressWSResponse"]>({
		route: "/event/getClipsWithProgress",
		body: args,
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) return { error: res.errorMsg ?? undefined };

	return {
		savedClips:
			res.savedClips?.map((clip) => ({
				...clip,
				createdAtTimestamp: clip.createdAtMs
					? new Date(clip.createdAtMs).toISOString()
					: null,
			})) ?? [],
	};
}

export async function getExpiringClips(
	args: ApiPayload,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Event_GetClipsWithProgressWSResponse"]>({
		route: "/event/getExpiringClipsForOrg",
		body: args,
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) return { error: res.errorMsg ?? undefined };

	return {
		expiringClips:
			res.savedClips?.map((clip) => ({
				...clip,
				createdAtTimestamp: clip.createdAtMs
					? new Date(clip.createdAtMs).toISOString()
					: null,
			})) ?? [],
	};
}

export async function getSharedLiveStreams(
	_args: ApiPayload,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Camera_FindAllSharedLiveVideoStreamsWSResponse"]>({
		route: "/camera/findAllSharedLiveVideoStreams",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) return { error: res.errorMsg ?? undefined };

	return {
		sharedLiveVideoStreams: res.sharedLiveVideoStreams ?? [],
	};
}

export async function getTimelapseClips(
	_args: ApiPayload,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Video_GetTimelapseClipsWSResponse"]>({
		route: "/video/getTimelapseClips",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) return { error: res.errorMsg ?? undefined };

	return {
		timelapseClips: res.timelapseClips ?? [],
	};
}

export async function getClipGroups(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<any>({
		route: "/event/getClipGroupsForOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) throw new Error(JSON.stringify(res));

	return {
		clipGroups: (res.clipGroups || []).map((group: any) => ({
			uuid: group.uuid ?? undefined,
			name: group.name ?? undefined,
			clipCount: group.clipCount ?? undefined,
		})),
	};
}

export async function getSharedClipGroups(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Event_GetSharedClipGroupsV2WSResponse"]>({
		route: "/event/getSharedClipGroupsV2",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) throw new Error(JSON.stringify(res));

	return {
		sharedClipGroups: (res.sharedClipGroups || []).map((group: any) => ({
			uuid: group.uuid ?? undefined,
			name: group.title ?? undefined,
		})),
	};
}

export async function createClip(
	cameraUuid: string,
	startTimeMs: number,
	endTimeMs: number,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const durationSec = Math.round((endTimeMs - startTimeMs) / 1000);
	const body: schema["Video_SpliceV3WSRequest"] = {
		deviceUuids: [cameraUuid],
		startTimeMillis: startTimeMs,
		durationSec,
		saveToConsole: true,
	};

	const res = await postApi<schema["Video_SpliceV3WSResponse"]>({
		route: "/video/spliceV3",
		body,
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) throw new Error(JSON.stringify(res));

	return { spliceResult: { success: true, clipUuid: (res as any).clipUuid ?? undefined } };
}

export async function deleteClip(
	clipUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
): Promise<OutputSchema> {
	const res = await postApi<schema["Event_DeleteSavedClipWSResponse"]>({
		route: "/event/deleteSavedClip",
		body: { savedClipUuid: clipUuid } satisfies schema["Event_DeleteSavedClipWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	if (res.error) throw new Error(JSON.stringify(res));

	return { deleteResult: { success: true } };
}
