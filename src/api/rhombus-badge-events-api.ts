import { getAccessControlledDoors } from "./get-entity-tool-api.js";
import { listUsers } from "./user-tool-api.js";
import { postApi, throwIfApiError } from "../network/network.js";
import type { schema } from "../types/schema.js";
import { matchesEntityName } from "../utils/entity-name-match.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

/**
 * Native Rhombus access control badge events for a named person.
 *
 * The vendor integrations (OnGuard / Elements / NetBox) search by cardholder name server-side and
 * return the camera that saw the tap. Native Rhombus doors do neither: a CredentialReceivedEvent is
 * keyed by the Rhombus user and names only the door. So this resolves the name to org users, pulls
 * each user's credential events (the same query the Console's user "Recent Entries" card runs), and
 * maps each door to its associated cameras.
 */

export interface SearchRhombusBadgeEventsArgs {
  personQuery: string;
  afterMs?: number;
  beforeMs?: number;
  locationUuids?: string[];
  limit?: number;
}

export interface RhombusBadgeEvent {
  timestampMs: number;
  datetime: string;
  cardholderName?: string;
  userUuid: string;
  doorUuid?: string;
  doorName?: string;
  locationUuid?: string;
  /** Cameras associated with the door, primary first. Empty when the door has none. */
  cameraUuids: string[];
  /** True when the door let the person in (authorizationResult ALLOWED). */
  granted: boolean;
  authorizationResult?: string;
  authenticationResult?: string;
}

// A name like "Chris" can match many users; each match costs one events query.
const MAX_MATCHED_USERS = 10;

function fullName(user: { firstName?: string; lastName?: string }): string {
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}

export async function searchRhombusBadgeEvents(
  args: SearchRhombusBadgeEventsArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ events: RhombusBadgeEvent[]; matchedUsers: string[] }> {
  const users = await listUsers(requestModifiers, sessionId);
  const matched = users
    .filter(
      (u) =>
        u.uuid &&
        (matchesEntityName(fullName(u), args.personQuery) ||
          (u.email != null && matchesEntityName(u.email, args.personQuery)))
    )
    .slice(0, MAX_MATCHED_USERS);
  if (matched.length === 0) return { events: [], matchedUsers: [] };

  const { accessControlledDoors } = await getAccessControlledDoors(requestModifiers, sessionId);
  const doors = new Map((accessControlledDoors ?? []).map((d) => [d.uuid, d]));
  const locationFilter = args.locationUuids?.length ? new Set(args.locationUuids) : undefined;

  const perUser = await Promise.all(
    matched.map(async (user) => {
      const res = await postApi<schema["Component_FindComponentEventsByUserWSResponse"]>({
        route: "/component/findComponentEventsByUser",
        body: {
          userUuid: user.uuid,
          createdAfterMs: args.afterMs,
          createdBeforeMs: args.beforeMs,
          limit: args.limit ?? 200,
          typeFilter: ["CredentialReceivedEvent"],
        } as schema["Component_FindComponentEventsByUserWSRequest"],
        modifiers: requestModifiers,
        sessionId,
      });
      throwIfApiError(res);

      const name = fullName(user) || user.email;
      return (res.componentEvents ?? []).flatMap((raw): RhombusBadgeEvent[] => {
        const e = raw as schema["CredentialReceivedEventType"];
        if (e?.timestampMs == null) return [];
        const doorUuid = e.componentCompositeUuid ?? undefined;
        const door = doorUuid ? doors.get(doorUuid) : undefined;
        const locationUuid = e.locationUuid ?? door?.locationUuid ?? undefined;
        if (locationFilter && (!locationUuid || !locationFilter.has(locationUuid))) return [];
        return [
          {
            timestampMs: e.timestampMs,
            datetime: formatTimestamp(e.timestampMs, timeZone),
            cardholderName: name,
            userUuid: user.uuid as string,
            doorUuid,
            doorName: door?.name ?? undefined,
            locationUuid,
            cameraUuids: (door?.associatedCameras ?? []).filter((c): c is string => !!c),
            granted: e.authorizationResult === "ALLOWED",
            authorizationResult: e.authorizationResult ?? undefined,
            authenticationResult: e.authenticationResult ?? undefined,
          },
        ];
      });
    })
  );

  return {
    events: perUser.flat().sort((a, b) => a.timestampMs - b.timestampMs),
    matchedUsers: matched.map((u) => fullName(u) || (u.email as string)),
  };
}
