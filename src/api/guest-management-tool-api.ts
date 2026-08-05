import { apiWarning, postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
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

// ---------------------------------------------------------------------------
// Guest write paths
// ---------------------------------------------------------------------------

export async function createGuest(
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    locationUuid: string;
    hostUserUuid?: string;
    companyName?: string;
    guestType?: string;
    accessStartTimeMs?: number;
    accessEndTimeMs?: number;
  },
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["BaseApiResponse"]>({
    route: "/guestmanagement/createGuest",
    body: { guest } as schema["Guestmanagement_CreateGuestWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, email: guest.email, warningMsg: apiWarning(res) };
}

/** Guests are addressed by EMAIL, not a uuid — there is no delete-by-uuid. */
export async function deleteGuest(
  email: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["BaseApiResponse"]>({
    route: "/guestmanagement/deleteGuest",
    body: { email } satisfies schema["Guestmanagement_GuestByEmailWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, email, warningMsg: apiWarning(res) };
}

export async function getGuestPasses(
  range: { startAfterMs?: number; startBeforeMs?: number },
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Accesscontrol_guestpass_FindGuestPassesWSResponse"]>({
    route: "/accesscontrol/guestpass/findGuestPasses",
    body: {
      startAfterMs: range.startAfterMs,
      startBeforeMs: range.startBeforeMs,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return {
    guestPasses:
      res.guestPasses?.flatMap(pass =>
        pass
          ? [
              {
                uuid: pass.uuid ?? undefined,
                locationUuid: pass.locationUuid ?? undefined,
                lifecycle: pass.lifecycle ?? undefined,
                note: pass.note ?? undefined,
                passStartTimeMs: pass.passStartTimeMs ?? undefined,
                principalType: pass.principalType ?? undefined,
              },
            ]
          : []
      ) ?? [],
    lastEvaluatedKey: res.lastEvaluatedKey ?? undefined,
  };
}

/**
 * Guest pass state changes.
 *
 * They are not interchangeable: suspend is reversible via unsuspend, expire ends
 * the pass but keeps its record and history, and delete removes the record
 * outright.
 */
export async function changeGuestPassState(
  guestPassUuid: string,
  action: "expire" | "suspend" | "unsuspend" | "delete",
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const routes = {
    expire: "/accesscontrol/guestpass/expireGuestPass",
    suspend: "/accesscontrol/guestpass/suspendGuestPass",
    unsuspend: "/accesscontrol/guestpass/unsuspendGuestPass",
    delete: "/accesscontrol/guestpass/deleteGuestPass",
  } as const;

  const res = await postApi<{ error?: boolean; errorMsg?: string | null }>({
    route: routes[action],
    body: { guestPassUuid },
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return { success: true, uuid: guestPassUuid, action, warningMsg: apiWarning(res) };
}
