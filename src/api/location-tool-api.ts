import { postApi, throwIfApiError } from "../network/network.js";
import { cachedPostApi, clearOrgReferenceCache } from "../network/org-reference-cache.js";
import type { schema } from "../types/schema.js";
import type { Location } from "../types/location-tool-types.js";
import { RequestModifiers } from "../util.js";

function mapLocation(raw: NonNullable<schema["LocationType"]>): Location {
	const addressParts = [raw.address1, raw.address2, raw.postalCode, raw.countryCode]
		.map(part => part?.trim())
		.filter((part): part is string => !!part);
	return {
		uuid: raw.uuid ?? undefined,
		name: raw.name ?? undefined,
		address1: raw.address1 ?? undefined,
		address2: raw.address2 ?? undefined,
		postalCode: raw.postalCode ?? undefined,
		countryCode: raw.countryCode ?? undefined,
		// Pre-joined so callers never have to reassemble it (and so the model
		// doesn't invent a format).
		address: addressParts.length > 0 ? addressParts.join(", ") : undefined,
		timezone: raw.tz ?? undefined,
		labels: raw.labels?.filter((label): label is string => !!label) ?? [],
		latitude: raw.latitude ?? undefined,
		longitude: raw.longitude ?? undefined,
		policyUuid: raw.policyUuid ?? undefined,
	};
}

export async function getLocations(requestModifiers?: RequestModifiers, sessionId?: string) {
	const res = await cachedPostApi<schema["Location_GetLocationsV2WSResponse"]>({
		route: "/location/getLocationsV2",
		body: {} as schema["Location_GetLocationsV2WSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	return {
		locations: res.locations?.flatMap(raw => (raw ? [mapLocation(raw)] : [])) ?? [],
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function findLocation(
	locationUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const { locations } = await getLocations(requestModifiers, sessionId);
	return locations.find(location => location.uuid === locationUuid);
}

export async function createLocation(
	name: string,
	address?: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_CreateLocationWSResponse"]>({
		route: "/location/createLocation",
		body: { name, address: address || undefined },
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	// The org-wide location list is cached for up to 60s; without this, a read
	// straight after the write still reports the old list.
	clearOrgReferenceCache();

	return {
		uuid: (res as { locationUuid?: string }).locationUuid ?? res.uuid ?? undefined,
		success: true,
		warningMsg: res.warningMsg ?? undefined,
	};
}

/**
 * `selectiveUpdateLocation` leaves out-of-body fields alone, unlike
 * `updateLocation` which replaces the record — so a rename can't blank the
 * address, and setting a timezone can't blank the labels.
 */
export async function updateLocation(
	update: {
		locationUuid: string;
		name?: string;
		address1?: string;
		address2?: string;
		postalCode?: string;
		countryCode?: string;
		timezoneId?: string;
		labels?: string[];
	},
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_SelectiveUpdateLocationWSResponse"]>({
		route: "/location/selectiveUpdateLocation",
		body: update as schema["Location_SelectiveUpdateLocationWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);
	clearOrgReferenceCache();

	return {
		updated: { success: true, locationUuid: update.locationUuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function deleteLocation(
	locationUuid: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_DeleteLocationWSResponse"]>({
		route: "/location/deleteLocation",
		body: { uuid: locationUuid } satisfies schema["Location_DeleteLocationWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);
	clearOrgReferenceCache();

	return {
		deleted: { success: true, locationUuid },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function getLocationLabels(
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await cachedPostApi<schema["Location_GetLocationLabelsForOrgWSResponse"]>({
		route: "/location/getLocationLabelsForOrg",
		body: {},
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);

	// api2 returns location labels as bare strings on some orgs and objects on
	// others; normalise both to {name}.
	const raw = (res as { locationLabels?: unknown[] }).locationLabels ?? [];
	const labels: { uuid?: string; name?: string }[] = [];
	for (const label of raw) {
		if (typeof label === "string") {
			if (label.trim()) labels.push({ name: label.trim() });
		} else if (label && typeof label === "object") {
			const record = label as { uuid?: string; name?: string };
			labels.push({ uuid: record.uuid ?? undefined, name: record.name ?? undefined });
		}
	}
	return labels;
}

export async function addLocationLabel(
	locationUuid: string,
	label: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_AddLocationLabelWSResponse"]>({
		route: "/location/addLocationLabel",
		body: {
			locationIdentifier: locationUuid,
			label,
		} satisfies schema["Location_AddLocationLabelWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);
	clearOrgReferenceCache();

	return {
		labelChanged: { success: true, locationUuid, label },
		warningMsg: res.warningMsg ?? undefined,
	};
}

export async function removeLocationLabel(
	locationUuid: string,
	label: string,
	requestModifiers?: RequestModifiers,
	sessionId?: string,
) {
	const res = await postApi<schema["Location_RemoveLocationLabelWSResponse"]>({
		route: "/location/removeLocationLabel",
		body: {
			locationIdentifier: locationUuid,
			label,
		} satisfies schema["Location_RemoveLocationLabelWSRequest"],
		modifiers: requestModifiers,
		sessionId,
	});

	throwIfApiError(res);
	clearOrgReferenceCache();

	return {
		labelChanged: { success: true, locationUuid, label },
		warningMsg: res.warningMsg ?? undefined,
	};
}
