import { DateTime } from "luxon";
import { postApi, throwIfApiError } from "../network/network.js";
import { cachedPostApi } from "../network/org-reference-cache.js";
import type { schema } from "../types/schema.js";
import type {
  AccessCondition,
  AccessControlCredential,
  AccessGrant,
  UserDoorAccess,
} from "../types/access-control-tool-types.js";
import type { RequestModifiers } from "../util.js";
import {
  getAccessControlGroupUuidsForUser,
  getAccessControlGroups,
  getAccessGrants,
  getCredentialsByUser,
} from "./access-control-tool-api.js";
import { getLocations } from "./location-tool-api.js";

/**
 * Answers "can this person badge into these doors" the way the door controller
 * decides it. The authoritative rules live in the registrar
 * (`DeviceAccessControlController.getDoorAccessDetailsV2`, which builds each
 * controller's config) and the firmware (`ac_authorizer.c`); the Console
 * re-derives the same join client-side (`AccessControlUsersState.ts`,
 * `AccessStatus.tsx`). No single API returns it: `findLocationAccessGrantsByUser`
 * matches directly-assigned users only.
 *
 *  - A grant covers the person if it names them, or one of their access
 *    control groups; it covers a door if it names the door, or one of the
 *    door's labels (labels match across locations, as in the registrar).
 *  - A grant with a schedule applies only while the schedule is active. A
 *    schedule that is missing or of an unsupported type makes the registrar
 *    drop the whole grant.
 *  - An active revocation beats every grant. The registrar drops revocations
 *    with no schedule, or with a repeating one.
 *  - Controllers only receive ACTIVE credentials inside their date window.
 *
 * Every input is fetched independently: a failed read is reported in
 * `inputsUnavailable` and turns the answers that depend on it into "unknown" —
 * never into "no access". Reading a failed membership lookup as "no groups" is
 * exactly how MIND used to tell admins that correctly-configured people had no
 * access.
 */

const GRANT_SCHEDULE_TYPES = new Set([
  "WEEKLY_REPEATING_MINUTES",
  "ABSOLUTE_SECONDS",
  "RELATIVE_DATETIME_INTERVALS",
]);
const REVOCATION_SCHEDULE_TYPES = new Set(["ABSOLUTE_SECONDS", "RELATIVE_DATETIME_INTERVALS"]);

const NOT_CHECKED = [
  "whether each door's reader accepts the person's credential type",
  "active lockdowns",
  "first-in rules",
  "privacy mode",
  "whether the person's user account is active",
];

export type ScheduleInfo = {
  uuid: string;
  name?: string;
  strategy?: string;
  weekly?: { start: number; stop: number }[];
  absolute?: { beginSec: number; endSec: number }[];
  localIntervals?: { start: string; end: string }[];
};

export type AccessRevocation = {
  uuid?: string;
  name?: string;
  locationUuid?: string;
  userUuids: string[];
  groupUuids: string[];
  doorUuids: string[];
  doorLabels: string[];
  scheduleUuid?: string;
};

export type DoorInfo = { uuid: string; name?: string; locationUuid?: string };
export type LocationInfo = { uuid: string; name?: string; timezone?: string };

type Loaded<T> = { ok: true; value: T } | { ok: false; error: string };

export type UserDoorAccessInputs = {
  userUuid: string;
  locationUuid?: string | null;
  nowMs: number;
  doors: DoorInfo[];
  locations: Loaded<LocationInfo[]>;
  grants: AccessGrant[];
  groupUuids: Loaded<string[]>;
  groupNames: Loaded<Map<string, string>>;
  revocations: Loaded<AccessRevocation[]>;
  doorLabels: Loaded<Map<string, string[]>>;
  schedules: Loaded<Map<string, ScheduleInfo>>;
  credentials: Loaded<AccessControlCredential[]>;
};

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

/**
 * Whether a schedule is active at `nowMs`, or undefined when that cannot be
 * told (no usable time zone for a wall-clock schedule, unsupported type).
 * Mirrors the Console's `isActive`, except that absolute intervals are epoch
 * SECONDS ([b, e) on `AbsoluteSecondsIntervalType`) and local date-times are
 * read in the door's location time zone, as the registrar does.
 */
export function isScheduleActive(
  schedule: ScheduleInfo,
  nowMs: number,
  timeZone: string | undefined
): boolean | undefined {
  switch (schedule.strategy) {
    case "ABSOLUTE_SECONDS": {
      const nowSec = nowMs / 1000;
      return (schedule.absolute ?? []).some(({ beginSec, endSec }) => nowSec >= beginSec && nowSec < endSec);
    }
    case "WEEKLY_REPEATING_MINUTES": {
      const local = zonedNow(nowMs, timeZone);
      if (!local) return undefined;
      // Minute of week with Monday 00:00 = 0 (luxon weekday: 1 = Monday).
      const minuteOfWeek = (local.weekday - 1) * 1440 + local.hour * 60 + local.minute;
      return (schedule.weekly ?? []).some(({ start, stop }) =>
        // Half-open [start, stop); stop < start wraps past the end of the week.
        stop < start
          ? !(minuteOfWeek < start && minuteOfWeek >= stop)
          : minuteOfWeek >= start && minuteOfWeek < stop
      );
    }
    case "RELATIVE_DATETIME_INTERVALS": {
      if (!zonedNow(nowMs, timeZone)) return undefined;
      return (schedule.localIntervals ?? []).some(({ start, end }) => {
        const startMs = DateTime.fromISO(start, { zone: timeZone }).toMillis();
        const endMs = DateTime.fromISO(end, { zone: timeZone }).toMillis();
        return Number.isFinite(startMs) && Number.isFinite(endMs) && nowMs >= startMs && nowMs < endMs;
      });
    }
    default:
      return undefined;
  }
}

function zonedNow(nowMs: number, timeZone: string | undefined): DateTime | undefined {
  if (!timeZone) return undefined;
  const local = DateTime.fromMillis(nowMs, { zone: timeZone });
  return local.isValid ? local : undefined;
}

// ---------------------------------------------------------------------------
// Resolution (pure)
// ---------------------------------------------------------------------------

type Principal = { via: "user" | "group"; groupName?: string };

function matchPrincipal(
  cond: { userUuids?: string[]; groupUuids?: string[] },
  userUuid: string,
  userGroups: Set<string>,
  groupNames: Map<string, string>
): Principal | undefined {
  if (cond.userUuids?.includes(userUuid)) return { via: "user" };
  const groupUuid = cond.groupUuids?.find(uuid => userGroups.has(uuid));
  if (groupUuid) return { via: "group", groupName: groupNames.get(groupUuid) ?? groupUuid };
  return undefined;
}

/** `null` = does not cover the door; otherwise the label it matched through, if any. */
function matchDoor(
  cond: { doorUuids?: string[]; doorLabels?: string[] },
  doorUuid: string,
  labelsOfDoor: string[]
): { viaLabel?: string } | null {
  if (cond.doorUuids?.includes(doorUuid)) return {};
  const label = cond.doorLabels?.find(l => labelsOfDoor.includes(l));
  return label ? { viaLabel: label } : null;
}

function describeSchedule(
  kind: "grant" | "revocation",
  scheduleUuid: string | undefined,
  schedules: Loaded<Map<string, ScheduleInfo>>,
  nowMs: number,
  timeZone: string | undefined
): Pick<AccessCondition, "schedule" | "activeNow" | "problem"> {
  if (!scheduleUuid) {
    return kind === "grant"
      ? { schedule: "always", activeNow: true }
      : {
          schedule: "none",
          problem: "It has no schedule, so door controllers do not apply it.",
        };
  }
  if (!schedules.ok) return { schedule: "unknown (schedules could not be read)" };
  const schedule = schedules.value.get(scheduleUuid);
  if (!schedule) {
    return {
      schedule: "missing",
      problem: `Its schedule no longer exists, so door controllers ignore this ${kind}.`,
    };
  }
  const supported = kind === "grant" ? GRANT_SCHEDULE_TYPES : REVOCATION_SCHEDULE_TYPES;
  if (!schedule.strategy || !supported.has(schedule.strategy)) {
    return {
      schedule: schedule.name ?? scheduleUuid,
      problem: `Its schedule type (${schedule.strategy ?? "unknown"}) is not supported for access ${kind}s, so door controllers ignore it.`,
    };
  }
  return {
    schedule: schedule.name ?? scheduleUuid,
    activeNow: isScheduleActive(schedule, nowMs, timeZone),
  };
}

type DoorResult = NonNullable<UserDoorAccess["doors"]>[number];

export function resolveUserDoorAccess(input: UserDoorAccessInputs): {
  userDoorAccess: UserDoorAccess;
  note: string;
} {
  const { userUuid, nowMs } = input;
  const inputsUnavailable: { input: string; error: string }[] = [];
  const unavailable = (name: string, loaded: Loaded<unknown>) => {
    if (!loaded.ok) inputsUnavailable.push({ input: name, error: loaded.error });
  };
  unavailable("access control group membership", input.groupUuids);
  unavailable("access control group names", input.groupNames);
  unavailable("access revocations", input.revocations);
  unavailable("door labels", input.doorLabels);
  unavailable("schedules", input.schedules);
  unavailable("credentials", input.credentials);
  unavailable("locations", input.locations);

  const userGroups = new Set(input.groupUuids.ok ? input.groupUuids.value : []);
  const groupNames = input.groupNames.ok ? input.groupNames.value : new Map<string, string>();
  const labelsByDoor = input.doorLabels.ok ? input.doorLabels.value : new Map<string, string[]>();
  const locations = new Map((input.locations.ok ? input.locations.value : []).map(l => [l.uuid, l]));

  // Guest-pass grants carry passes, not people.
  const userGrants = input.grants.filter(g => g.mode !== "GUEST_PASS_INDIVIDUAL");
  const personHasLabelGrant = userGrants.some(
    g => (g.doorLabels?.length ?? 0) > 0 && matchPrincipal(g, userUuid, userGroups, groupNames)
  );

  const doors = input.doors
    .filter(door => !input.locationUuid || door.locationUuid === input.locationUuid)
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  const results: DoorResult[] = doors.map(door => {
    const timeZone = door.locationUuid ? locations.get(door.locationUuid)?.timezone : undefined;
    const labelsOfDoor = labelsByDoor.get(door.uuid) ?? [];

    const grants: AccessCondition[] = [];
    for (const grant of userGrants) {
      const principal = matchPrincipal(grant, userUuid, userGroups, groupNames);
      if (!principal) continue;
      const doorMatch = matchDoor(grant, door.uuid, labelsOfDoor);
      if (!doorMatch) continue;
      grants.push({
        name: grant.name,
        uuid: grant.uuid,
        ...principal,
        ...doorMatch,
        ...describeSchedule("grant", grant.scheduleUuid, input.schedules, nowMs, timeZone),
      });
    }

    const revocations: AccessCondition[] = [];
    for (const revocation of input.revocations.ok ? input.revocations.value : []) {
      const principal = matchPrincipal(revocation, userUuid, userGroups, groupNames);
      if (!principal) continue;
      const doorMatch = matchDoor(revocation, door.uuid, labelsOfDoor);
      if (!doorMatch) continue;
      revocations.push({
        name: revocation.name,
        uuid: revocation.uuid,
        ...principal,
        ...doorMatch,
        ...describeSchedule("revocation", revocation.scheduleUuid, input.schedules, nowMs, timeZone),
      });
    }

    const base: DoorResult = {
      doorUuid: door.uuid,
      doorName: door.name,
      locationName: door.locationUuid ? locations.get(door.locationUuid)?.name : undefined,
      grants: grants.length ? grants : undefined,
      revocations: revocations.length ? revocations : undefined,
    };

    const effectiveRevocations = revocations.filter(r => !r.problem);
    const effectiveGrants = grants.filter(g => !g.problem);

    const blocking = effectiveRevocations.find(r => r.activeNow === true);
    if (blocking) {
      return { ...base, access: "revoked", reason: `Blocked now by the revocation "${blocking.name ?? blocking.uuid}".` };
    }
    const caveats: string[] = [];
    if (effectiveRevocations.some(r => r.activeNow === undefined)) {
      caveats.push("A revocation's schedule could not be evaluated, so it may be blocking access.");
    }
    if (!input.revocations.ok) caveats.push("Revocations could not be checked.");

    if (effectiveGrants.some(g => g.activeNow === true)) {
      return { ...base, access: "yes", reason: caveats.length ? caveats.join(" ") : undefined };
    }
    if (effectiveGrants.some(g => g.activeNow === undefined)) {
      return {
        ...base,
        access: "unknown",
        reason: ["Has a grant, but whether its schedule is active now could not be evaluated.", ...caveats].join(" "),
      };
    }
    if (effectiveGrants.length) {
      return {
        ...base,
        access: "scheduled-not-now",
        reason: `Has access only while ${effectiveGrants.map(g => `"${g.schedule}"`).join(" / ")} is active, and it is not active now.`,
      };
    }
    if (!input.groupUuids.ok) {
      return { ...base, access: "unknown", reason: "No direct grant, and group membership could not be read." };
    }
    if (!input.doorLabels.ok && personHasLabelGrant) {
      return { ...base, access: "unknown", reason: "Door labels could not be read, and one of this person's grants uses labels." };
    }
    if (grants.length) {
      return {
        ...base,
        access: "no",
        reason: `Every grant covering this door is ignored by door controllers: ${grants.map(g => `"${g.name ?? g.uuid}" — ${g.problem}`).join(" ")}`,
      };
    }
    return {
      ...base,
      access: "no",
      reason: "No access grant covers this door for this person — not directly, not through an access control group, and not through a door label.",
    };
  });

  const count = (access: string) => results.filter(r => r.access === access).length;
  const credentials = input.credentials.ok ? input.credentials.value : undefined;
  const usableCredentials = credentials?.filter(c => c.effectiveStatus === "ACTIVE").length;
  const location = input.locationUuid ? locations.get(input.locationUuid) : undefined;

  const userDoorAccess: UserDoorAccess = {
    userUuid,
    location: input.locationUuid
      ? { uuid: input.locationUuid, name: location?.name, timezone: location?.timezone }
      : undefined,
    evaluatedAt: new Date(nowMs).toISOString(),
    summary: {
      doors: results.length,
      accessNow: count("yes"),
      scheduledNotNow: count("scheduled-not-now"),
      revoked: count("revoked"),
      noAccess: count("no"),
      unknown: count("unknown"),
      usableCredentials,
    },
    groups: input.groupUuids.ok
      ? input.groupUuids.value.map(uuid => ({ uuid, name: groupNames.get(uuid) }))
      : undefined,
    credentials: credentials?.map(c => ({
      uuid: c.uuid,
      credentialType: c.credentialType,
      effectiveStatus: c.effectiveStatus,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      lastUsedAt: c.lastUsedAt,
    })),
    doors: results,
    inputsUnavailable: inputsUnavailable.length ? inputsUnavailable : undefined,
    notChecked: NOT_CHECKED,
  };

  return { userDoorAccess, note: buildNote(results, location?.name, !!input.locationUuid, credentials, usableCredentials, inputsUnavailable) };
}

function buildNote(
  results: DoorResult[],
  locationName: string | undefined,
  scopedToLocation: boolean,
  credentials: AccessControlCredential[] | undefined,
  usableCredentials: number | undefined,
  inputsUnavailable: { input: string }[]
): string {
  const where = scopedToLocation ? `at ${locationName ?? "this location"}` : "across all locations";
  if (results.length === 0) {
    return `There are no access-controlled doors ${where}.`;
  }
  const names = (access: string) =>
    results
      .filter(r => r.access === access)
      .map(r => r.doorName ?? r.doorUuid)
      .join(", ");
  const parts: string[] = [];
  const yes = results.filter(r => r.access === "yes").length;
  parts.push(
    yes === results.length
      ? `The person's access grants cover all ${results.length} door(s) ${where}, and they apply right now.`
      : `The person's access grants give access right now to ${yes} of ${results.length} door(s) ${where}.`
  );
  const lines: [string, string][] = [
    ["no", "No access"],
    ["scheduled-not-now", "Access only during a schedule that is not active now"],
    ["revoked", "Blocked by a revocation"],
    ["unknown", "Could not be verified"],
  ];
  for (const [access, label] of lines) {
    const list = names(access);
    if (list) parts.push(`${label}: ${list}.`);
  }
  if (credentials === undefined) {
    parts.push("The person's credentials could not be read, so whether their badge works is unknown.");
  } else if (usableCredentials === 0) {
    parts.push(
      credentials.length === 0
        ? "The person has NO credential, so no badge will open any of these doors until one is assigned."
        : `None of the person's ${credentials.length} credential(s) is usable (${credentials.map(c => c.effectiveStatus).join(", ")}), so no badge will open any door until one is active.`
    );
  } else {
    parts.push(`${usableCredentials} of ${credentials.length} credential(s) are active.`);
  }
  if (inputsUnavailable.length) {
    parts.push(
      `Could not read: ${inputsUnavailable.map(i => i.input).join(", ")} — say so, and do not report the affected doors as having no access.`
    );
  }
  parts.push(`Not checked: ${NOT_CHECKED.join("; ")}.`);
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

function nonNull(values?: (string | null)[] | null): string[] {
  return values?.filter((v): v is string => !!v) ?? [];
}

async function load<T>(fetch: () => Promise<T>): Promise<Loaded<T>> {
  try {
    return { ok: true, value: await fetch() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getAccessRevocations(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<AccessRevocation[]> {
  const res = await postApi<schema["Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSResponse"]>({
    route: "/accesscontrol/findLocationAccessRevocationsByOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return (
    res.accessRevocations?.flatMap(r =>
      r
        ? [
            {
              uuid: r.uuid ?? undefined,
              name: r.name ?? undefined,
              locationUuid: r.locationUuid ?? undefined,
              userUuids: nonNull(r.userUuids),
              groupUuids: nonNull(r.groupUuids),
              doorUuids: nonNull(r.accessControlledDoorUuids),
              doorLabels: nonNull(r.doorLabelIds),
              scheduleUuid: r.scheduleUuid ?? undefined,
            },
          ]
        : []
    ) ?? []
  );
}

/** doorUuid → labels. Grant `doorLabelIds` are these label strings. */
export async function getDoorLabels(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<Map<string, string[]>> {
  const res = await cachedPostApi<schema["Component_GetAccessControlledDoorLabelsForOrgWSResponse"]>({
    route: "/component/getAccessControlledDoorLabelsForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return new Map(
    Object.entries(res.accessControlledDoorLabels ?? {}).map(([doorUuid, labels]) => [doorUuid, nonNull(labels)])
  );
}

/**
 * All schedule types. schedule-tool's `/policy/findSchedules` returns weekly
 * schedules only, but access grants and revocations also use absolute and
 * local date-time schedules.
 */
export async function getAccessSchedules(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<Map<string, ScheduleInfo>> {
  const res = await postApi<schema["Schedule_GetSchedulesWSResponse"]>({
    route: "/schedule/getSchedules",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);

  const schedules = new Map<string, ScheduleInfo>();
  const add = (raw: { uuid?: string | null; name?: string | null; strategy?: string | null } | null | undefined, extra: Partial<ScheduleInfo>) => {
    if (raw?.uuid) schedules.set(raw.uuid, { uuid: raw.uuid, name: raw.name ?? undefined, strategy: raw.strategy ?? undefined, ...extra });
  };
  for (const s of res.weeklySchedules ?? []) {
    add(s, {
      weekly: (s?.intervalList ?? []).flatMap(i =>
        i && typeof i.minuteOfWeekStart === "number" && typeof i.minuteOfWeekStop === "number"
          ? [{ start: i.minuteOfWeekStart, stop: i.minuteOfWeekStop }]
          : []
      ),
    });
  }
  for (const s of res.absoluteSchedules ?? []) {
    add(s, {
      absolute: (s?.intervalList ?? []).flatMap(i =>
        i && typeof i.b === "number" && typeof i.e === "number" ? [{ beginSec: i.b, endSec: i.e }] : []
      ),
    });
  }
  for (const s of res.relativeDatetimeSchedules ?? []) {
    add(s, {
      localIntervals: (s?.intervals ?? []).flatMap(i =>
        i?.localStartDateTime && i.localEndDateTime ? [{ start: i.localStartDateTime, end: i.localEndDateTime }] : []
      ),
    });
  }
  for (const s of res.relativeSchedules ?? []) add(s, {});
  return schedules;
}

export async function getUserDoorAccess(
  userUuid: string,
  locationUuid: string | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const [doorsRes, grants, groupUuids, groupNames, revocations, doorLabels, schedules, credentials, locations] =
    await Promise.all([
      // Same route + body as get-entity-tool, so it shares that cache entry.
      // Not via getAccessControlledDoors(): it drops the API error, and a
      // failed door list must not read as "there are no doors".
      cachedPostApi<schema["Component_FindAccessControlledDoorsWSResponse"]>({
        route: "/component/findAccessControlledDoors",
        body: {},
        modifiers: requestModifiers,
        sessionId,
      }),
      // Org-wide, not by location: a label grant made at another location still
      // reaches this location's doors that carry the label.
      getAccessGrants(null, requestModifiers, sessionId),
      load(() => getAccessControlGroupUuidsForUser(userUuid, requestModifiers, sessionId)),
      load(async () => {
        const groups = await getAccessControlGroups(requestModifiers, sessionId);
        return new Map(groups.flatMap(g => (g.uuid ? [[g.uuid, g.name ?? g.uuid] as const] : [])));
      }),
      load(() => getAccessRevocations(requestModifiers, sessionId)),
      load(() => getDoorLabels(requestModifiers, sessionId)),
      load(() => getAccessSchedules(requestModifiers, sessionId)),
      load(() => getCredentialsByUser(userUuid, requestModifiers, sessionId)),
      load(async () =>
        (await getLocations(requestModifiers, sessionId)).locations.flatMap(l =>
          l.uuid ? [{ uuid: l.uuid, name: l.name, timezone: l.timezone }] : []
        )
      ),
    ]);

  throwIfApiError(doorsRes);

  const doors: DoorInfo[] = (doorsRes.accessControlledDoors ?? []).flatMap(d =>
    d?.uuid ? [{ uuid: d.uuid, name: d.name ?? undefined, locationUuid: d.locationUuid ?? undefined }] : []
  );

  return resolveUserDoorAccess({
    userUuid,
    locationUuid,
    nowMs: Date.now(),
    doors,
    locations,
    grants,
    groupUuids,
    groupNames,
    revocations,
    doorLabels,
    schedules,
    credentials,
  });
}
