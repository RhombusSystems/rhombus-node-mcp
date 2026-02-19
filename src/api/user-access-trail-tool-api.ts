import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

interface AccessEvent {
  eventUuid?: string;
  eventType?: string;
  timestampMs?: number;
  locationUuid?: string;
  componentUuid?: string;
  ownerDeviceUuid?: string;
  authorizationResult?: string;
  authenticationResult?: string;
}

export async function resolveUserUuid(
  email: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ uuid: string; name?: string }> {
  const res = await postApi<schema["User_FindUserWSResponse"]>({
    route: "/user/findUserByEmail",
    body: { email } satisfies schema["User_FindUserByEmailWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if ((res as any).error) {
    throw new Error((res as any).errorMsg ?? "Failed to find user by email");
  }

  const user = res.user;
  if (!user?.uuid) {
    throw new Error(`No user found with email: ${email}`);
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined;
  return { uuid: user.uuid, name };
}

export async function getAccessEventsByUser(
  userUuid: string,
  startTimeMs?: number,
  endTimeMs?: number,
  limit?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<AccessEvent[]> {
  const body: schema["Component_FindComponentEventsByUserWSRequest"] = {
    userUuid,
    limit: limit ?? 100,
  };
  if (startTimeMs) body.createdAfterMs = startTimeMs;
  if (endTimeMs) body.createdBeforeMs = endTimeMs;

  const res = await postApi<schema["Component_FindComponentEventsByUserWSResponse"]>({
    route: "/component/findComponentEventsByUser",
    body,
    modifiers: requestModifiers,
    sessionId,
  });

  const events = (res as any).componentEvents ?? [];

  return events.map((evt: any) => ({
    eventUuid: evt.uuid ?? undefined,
    eventType: evt.type ?? undefined,
    timestampMs: evt.timestampMs ?? evt.createdAtMs ?? undefined,
    locationUuid: evt.locationUuid ?? undefined,
    componentUuid: evt.componentUuid ?? undefined,
    ownerDeviceUuid: evt.ownerDeviceUuid ?? undefined,
    authorizationResult: evt.authorizationResult ?? undefined,
    authenticationResult: evt.authenticationResult ?? undefined,
  }));
}
