import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

export async function getAllGuestsByOrg(
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Guestmanagement_GetAllGuestsWSResponse"]>({
    route: "/guestmanagement/getAllGuestsByOrg",
    body: {} satisfies schema["Guestmanagement_BaseGuestManagementWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get guests");
  }

  return (
    res.allGuests?.map(guest => ({
      firstName: guest.firstName ?? undefined,
      lastName: guest.lastName ?? undefined,
      email: guest.email ?? undefined,
      companyName: guest.companyName ?? undefined,
      locationUuid: guest.locationUuid ?? undefined,
      hostUserUuid: guest.hostUserUuid ?? undefined,
      guestType: (guest.guestType as string) ?? undefined,
      checkedInStatus: (guest.checkedInEnum as string) ?? undefined,
      lastCheckedInMs: guest.lastCheckedInMs ?? undefined,
      lastCheckedOutMs: guest.lastCheckedOutMs ?? undefined,
      phoneNumber: guest.phoneNumber ?? undefined,
    })) ?? []
  );
}

export async function getGuestActivityLogs(
  startTimeMs?: number,
  endTimeMs?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: schema["Guestmanagement_GetGuestActivityLogsWSRequest"] = {};
  if (startTimeMs) body.createdAfterMs = startTimeMs;
  if (endTimeMs) body.createdBeforeMs = endTimeMs;

  const res = await postApi<schema["Guestmanagement_GetGuestActivityLogsWSResponse"]>({
    route: "/guestmanagement/getGuestActivityLogs",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get guest activity logs");
  }

  return (
    res.guestActivities?.map(a => ({
      activity: (a.activity as string) ?? undefined,
      email: a.email ?? undefined,
      guestType: (a.guestType as string) ?? undefined,
      locationUuid: a.locationUuid ?? undefined,
      hostUserUuid: a.hostUserUuid ?? undefined,
      timestampMs: a.timestampMs ?? undefined,
    })) ?? []
  );
}

export async function getActivitiesForLocation(
  locationUuid: string,
  startTimeMs?: number,
  endTimeMs?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: schema["Guestmanagement_GetActivityLogsForLocationWSRequest"] = {
    locationUuid,
  };
  if (startTimeMs) body.createdAfterMs = startTimeMs;
  if (endTimeMs) body.createdBeforeMs = endTimeMs;

  const res = await postApi<schema["Guestmanagement_GetGuestActivityLogsWSResponse"]>({
    route: "/guestmanagement/getActivitiesForLocation",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get activities for location");
  }

  return (
    res.guestActivities?.map(a => ({
      activity: (a.activity as string) ?? undefined,
      email: a.email ?? undefined,
      guestType: (a.guestType as string) ?? undefined,
      locationUuid: a.locationUuid ?? undefined,
      hostUserUuid: a.hostUserUuid ?? undefined,
      timestampMs: a.timestampMs ?? undefined,
    })) ?? []
  );
}
