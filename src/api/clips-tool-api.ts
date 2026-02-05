import { postApi } from "../network.js";
import type { ApiPayload, OutputSchema } from "../types/clips-tool-types.js";
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
