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
  credentialStatusLabel,
  credentialTypeLabel,
  getAccessGrants,
  getCredentialsByUser,
  getLockdownPlan,
  mapWithConcurrency,
} from "./access-control-tool-api.js";
import { getLocations } from "./location-tool-api.js";

/**
 * Answers "can this person badge into these doors" the way the door controller
 * decides it. The authoritative rules live in the registrar
 * (`DeviceAccessControlController.getDoorAccessDetailsV2`, which builds each
 * controller's config) and the firmware (`ac_authorizer.c`,
 * `ac_config_utils.c`, `rhombus_dc_main_agent.c`); the Console re-derives the
 * grant join client-side (`AccessControlUsersState.ts`, `AccessStatus.tsx`).
 * No single API returns it: `findLocationAccessGrantsByUser` matches
 * directly-assigned users only.
 *
 *  - A grant covers the person if it names them, or one of their access
 *    control groups; it covers a door if it names the door, or one of the
 *    door's labels (labels match across locations, as in the registrar).
 *  - A grant with a schedule applies only while the schedule is active. A
 *    schedule that is missing or of an unsupported type makes the registrar
 *    drop the whole grant.
 *  - An active revocation beats every grant. The registrar drops revocations
 *    with no schedule, or with a repeating one.
 *  - During a real lockdown, a door the plan marks LOCKED_DOWN or UNLOCKED
 *    ignores every grant and revocation: only the plan's people get in.
 *  - A first-in rule that is REQUIRED denies everyone it does not list, until
 *    a listed person badges in.
 *  - Controllers only receive ACTIVE credentials inside their date window, and
 *    each reader type only reads some credential types.
 *  - The user account's status does not matter; deleting the user revokes its
 *    credentials.
 *
 * Speed: every read starts at once. The per-controller reader lookups start
 * the moment the (usually cached) door list arrives, and the only follow-up
 * calls — the plan of an ACTIVE lockdown, the live state of a first-in door —
 * happen only when one applies. On the common path the tool costs one round of
 * parallel calls.
 *
 * Every input is fetched independently: a failed read is reported in
 * `inputsUnavailable` and turns the answers that depend on it into "unknown" —
 * never into "no access".
 */

const GRANT_SCHEDULE_TYPES = new Set([
  "WEEKLY_REPEATING_MINUTES",
  "ABSOLUTE_SECONDS",
  "RELATIVE_DATETIME_INTERVALS",
]);
const REVOCATION_SCHEDULE_TYPES = new Set(["ABSOLUTE_SECONDS", "RELATIVE_DATETIME_INTERVALS"]);

/** Past this many door controllers in scope, the reader check is skipped rather than slowing the answer. */
const MAX_CONTROLLERS_FOR_READER_CHECK = 20;
const FETCH_CONCURRENCY = 8;

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

type TimedState = { state?: string; requestedAtMillis?: number };

export type DoorInfo = {
  uuid: string;
  name?: string;
  locationUuid?: string;
  ownerDeviceUuid?: string;
  /** undefined = the API did not say (reader check skipped); [] = no reader. */
  readerComponentUuids?: string[];
  /** APERIO doors read credentials at the lock itself. */
  subType?: string;
  /** null = not set on the door (the org default applies, which the API does not expose). */
  nfcSecureDowngradeEnabled?: boolean | null;
  waveToUnlockEnabled?: boolean;
  proximityUnlockEnabled?: boolean;
  privacyModeSupportEnabled?: boolean;
  firstInOverride?: TimedState;
};
export type LocationInfo = { uuid: string; name?: string; timezone?: string };

export type ReaderKind = "rhombus" | "osdp" | "wiegand" | "aperio" | "unknown";
export type ReaderInfo = {
  uuid: string;
  kind: ReaderKind;
  name?: string;
  disableCardReader?: boolean;
  disableKeypad?: boolean;
  disableWaveToUnlock?: boolean;
};
export type ReaderLookup = { readers: Map<string, ReaderInfo>; skippedReason?: string };

export type LockdownPlanInfo = {
  uuid: string;
  name?: string;
  defaultLockdownState?: string;
  doorLockdownStateMap: Record<string, string>;
  userUuids: string[];
  groupUuids: string[];
  testUserAccessOverride: boolean;
};
export type LockdownInfo = {
  /** Only locations that are LOCKED_DOWN right now. */
  active: { locationUuid: string; followingTestPlan: boolean; plans: LockdownPlanInfo[] }[];
};

export type FirstInRule = {
  uuid?: string;
  name?: string;
  doorUuids: string[];
  userUuids: string[];
  groupUuids: string[];
  cloudState?: TimedState;
};
export type FirstInInfo = {
  /** Rules with the badge (door auth) requirement enabled. */
  rules: FirstInRule[];
  /** Live door-controller state per door (REQUIRED / SATISFIED / DISABLED / NOT_CONFIGURED / UNKNOWN). */
  liveState: Loaded<Map<string, string>>;
};

export type UserAccount = { found: boolean; status?: string; deleted?: boolean };

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
  /** Absent = not checked (tests); a failed read is `{ok: false}`. */
  readers?: Loaded<ReaderLookup>;
  lockdown?: Loaded<LockdownInfo>;
  firstIn?: Loaded<FirstInInfo>;
  account?: Loaded<UserAccount>;
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
// Credential type vs reader
// ---------------------------------------------------------------------------

type Fit = "yes" | "maybe" | "no";
const FIT_RANK: Record<Fit, number> = { no: 0, maybe: 1, yes: 2 };
const best = (fits: Fit[]): Fit => fits.reduce<Fit>((a, b) => (FIT_RANK[b] > FIT_RANK[a] ? b : a), "no");

const WIEGAND_FAMILY = new Set([
  "WIEGAND_H10301",
  "WIEGAND_H10302",
  "WIEGAND_H10304",
  "WIEGAND_D10202",
  "WIEGAND_64BIT_RAW",
  "HID_CORP1000_STD_35",
  "HID_CORP1000_STD_48",
]);
/** The firmware has no parser for these ("Unimplemented token type"), so they open no Rhombus-controlled door. */
const UNREADABLE_TYPES = new Set(["CUSTOM", "APPLE_WALLET_DESFIRE"]);

/**
 * Whether one reader can read one credential type, per `authenticate_cred` in
 * the door-controller firmware. "maybe" = depends on something the API does
 * not tell us (a keypad being fitted, the reader's output format, the org's
 * secure-downgrade default).
 */
export function readerFit(credentialType: string | undefined, reader: ReaderInfo, door: DoorInfo): Fit {
  if (!credentialType || reader.kind === "unknown") return "maybe";
  if (UNREADABLE_TYPES.has(credentialType)) return "no";
  const card = !reader.disableCardReader;
  const keypad = !reader.disableKeypad;
  const downgrade: Fit =
    door.nfcSecureDowngradeEnabled === true ? "yes" : door.nfcSecureDowngradeEnabled === false ? "no" : "maybe";
  const wiegandFormat = WIEGAND_FAMILY.has(credentialType);

  switch (reader.kind) {
    case "rhombus":
      if (credentialType === "STANDARD_CSN" || credentialType === "RHOMBUS_SECURE_CSN") return card ? "yes" : "no";
      if (credentialType === "RHOMBUS_SECURE_MOBILE") {
        const ble =
          !reader.disableWaveToUnlock && (door.waveToUnlockEnabled !== false || door.proximityUnlockEnabled === true);
        return ble || card ? "yes" : "no";
      }
      // QR scanning is on Rhombus readers that have a scanner (DR40).
      if (credentialType === "QR_CODE_STATIC") return "maybe";
      return "no"; // Wiegand formats and PINs are not read by Rhombus readers.
    case "osdp":
    case "wiegand":
    case "aperio": {
      if (credentialType === "PIN_CODE") return keypad ? "maybe" : "no";
      if (!card) return "no";
      if (credentialType === "STANDARD_CSN") return reader.kind === "wiegand" ? "maybe" : "yes";
      if (wiegandFormat) return reader.kind === "aperio" ? "maybe" : "yes";
      if (credentialType === "RHOMBUS_SECURE_CSN") return downgrade;
      // A phone opens doors only through the Rhombus handshake (BLE, or NFC
      // with the handshake), which third-party readers cannot do; secure
      // downgrade matches a fixed card number, and a phone presents none.
      if (credentialType === "RHOMBUS_SECURE_MOBILE") return "no";
      return "no"; // QR codes need a Rhombus reader.
    }
  }
}

const READER_LABEL: Record<ReaderKind, string> = {
  rhombus: "Rhombus reader",
  osdp: "third-party OSDP reader",
  wiegand: "Wiegand reader",
  aperio: "Aperio lock",
  unknown: "reader of unknown type",
};

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

/** The later of the rule's state and the door's override wins; no state at all means REQUIRED. */
function cloudFirstInState(rule: FirstInRule, door: DoorInfo): string {
  const candidates = [rule.cloudState, door.firstInOverride].filter((s): s is TimedState => !!s?.state);
  if (candidates.length === 0) return "REQUIRED";
  return candidates.reduce((a, b) => ((b.requestedAtMillis ?? 0) > (a.requestedAtMillis ?? 0) ? b : a)).state!;
}

type DoorResult = NonNullable<UserDoorAccess["doors"]>[number];

export const ACCESS_VALUES = [
  "yes",
  "scheduled-not-now",
  "revoked",
  "lockdown",
  "first-in-required",
  "credential-not-accepted",
  "no-usable-credential",
  "no",
  "unknown",
] as const;

export function resolveUserDoorAccess(input: UserDoorAccessInputs): {
  userDoorAccess: UserDoorAccess;
  note: string;
} {
  const { userUuid, nowMs } = input;
  const inputsUnavailable: { input: string; error: string }[] = [];
  const unavailable = (name: string, loaded: Loaded<unknown> | undefined) => {
    if (loaded && !loaded.ok) inputsUnavailable.push({ input: name, error: loaded.error });
  };
  unavailable("access control group membership", input.groupUuids);
  unavailable("access control group names", input.groupNames);
  unavailable("access revocations", input.revocations);
  unavailable("door labels", input.doorLabels);
  unavailable("schedules", input.schedules);
  unavailable("credentials", input.credentials);
  unavailable("locations", input.locations);
  unavailable("door readers", input.readers);
  unavailable("lockdowns", input.lockdown);
  unavailable("first-in rules", input.firstIn);
  unavailable("user account", input.account);
  if (input.firstIn?.ok && !input.firstIn.value.liveState.ok) {
    inputsUnavailable.push({ input: "live first-in state (using the cloud setting)", error: input.firstIn.value.liveState.error });
  }

  const userGroups = new Set(input.groupUuids.ok ? input.groupUuids.value : []);
  const groupNames = input.groupNames.ok ? input.groupNames.value : new Map<string, string>();
  const labelsByDoor = input.doorLabels.ok ? input.doorLabels.value : new Map<string, string[]>();
  const locations = new Map((input.locations.ok ? input.locations.value : []).map(l => [l.uuid, l]));
  const credentials = input.credentials.ok ? input.credentials.value : undefined;
  const usable = credentials?.filter(c => c.effectiveStatus === "ACTIVE");
  const readers = input.readers?.ok ? input.readers.value : undefined;
  const lockdowns = input.lockdown?.ok ? input.lockdown.value.active : [];
  const firstIn = input.firstIn?.ok ? input.firstIn.value : undefined;
  const liveFirstIn = firstIn?.liveState.ok ? firstIn.liveState.value : undefined;

  // Guest-pass grants carry passes, not people.
  const userGrants = input.grants.filter(g => g.mode !== "GUEST_PASS_INDIVIDUAL");
  const personHasLabelGrant = userGrants.some(
    g => (g.doorLabels?.length ?? 0) > 0 && matchPrincipal(g, userUuid, userGroups, groupNames)
  );

  const doors = input.doors
    .filter(door => !input.locationUuid || door.locationUuid === input.locationUuid)
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  /** Grants, revocations and schedules only — lockdown, first-in and credentials are applied after. */
  const grantLevel = (door: DoorInfo, base: DoorResult): DoorResult => {
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

    const withConditions: DoorResult = {
      ...base,
      grants: grants.length ? grants : undefined,
      revocations: revocations.length ? revocations : undefined,
    };

    const effectiveRevocations = revocations.filter(r => !r.problem);
    const effectiveGrants = grants.filter(g => !g.problem);

    const blocking = effectiveRevocations.find(r => r.activeNow === true);
    if (blocking) {
      return { ...withConditions, access: "revoked", reason: `Blocked now by the revocation "${blocking.name ?? blocking.uuid}".` };
    }
    const caveats: string[] = [];
    if (effectiveRevocations.some(r => r.activeNow === undefined)) {
      caveats.push("A revocation's schedule could not be evaluated, so it may be blocking access.");
    }
    if (!input.revocations.ok) caveats.push("Revocations could not be checked.");

    if (effectiveGrants.some(g => g.activeNow === true)) {
      return { ...withConditions, access: "yes", reason: caveats.length ? caveats.join(" ") : undefined };
    }
    if (effectiveGrants.some(g => g.activeNow === undefined)) {
      return {
        ...withConditions,
        access: "unknown",
        reason: ["Has a grant, but whether its schedule is active now could not be evaluated.", ...caveats].join(" "),
      };
    }
    if (effectiveGrants.length) {
      return {
        ...withConditions,
        access: "scheduled-not-now",
        reason: `Has access only while ${effectiveGrants.map(g => `"${g.schedule}"`).join(" / ")} is active, and it is not active now.`,
      };
    }
    if (!input.groupUuids.ok) {
      return { ...withConditions, access: "unknown", reason: "No direct grant, and group membership could not be read." };
    }
    if (!input.doorLabels.ok && personHasLabelGrant) {
      return { ...withConditions, access: "unknown", reason: "Door labels could not be read, and one of this person's grants uses labels." };
    }
    if (grants.length) {
      return {
        ...withConditions,
        access: "no",
        reason: `Every grant covering this door is ignored by door controllers: ${grants.map(g => `"${g.name ?? g.uuid}" — ${g.problem}`).join(" ")}`,
      };
    }
    return {
      ...withConditions,
      access: "no",
      reason: "No access grant covers this door for this person — not directly, not through an access control group, and not through a door label.",
    };
  };

  /**
   * An active lockdown's effect on this door, per `ac_config_utils.c`:
   *  - "takeover": a LOCKED_DOWN or UNLOCKED door drops every grant and
   *    revocation and admits only the plan's people, 24/7;
   *  - "normal-no-first-in": an ACCESS_CONTROLLED door keeps normal access,
   *    but first-in is suspended at the location;
   *  - "normal": a lockdown TEST that leaves user access alone.
   */
  type LockdownStatus =
    | { kind: "none" }
    | { kind: "normal" | "normal-no-first-in"; note: string }
    | { kind: "takeover"; planName?: string; directive: string; allowed: boolean };
  const lockdownStatus = (door: DoorInfo): LockdownStatus => {
    const active = lockdowns.find(l => l.locationUuid === door.locationUuid);
    if (!active || active.plans.length === 0) return { kind: "none" };
    const plan = active.plans.find(p => door.uuid in p.doorLockdownStateMap) ?? active.plans[0];
    if (active.followingTestPlan && !plan.testUserAccessOverride) {
      return { kind: "normal", note: `A lockdown test ("${plan.name ?? "lockdown"}") is running here, but it does not change who can badge in.` };
    }
    const directive = plan.doorLockdownStateMap[door.uuid] ?? plan.defaultLockdownState ?? "ACCESS_CONTROLLED";
    if (directive !== "LOCKED_DOWN" && directive !== "UNLOCKED") {
      return {
        kind: "normal-no-first-in",
        note: `Lockdown "${plan.name ?? "lockdown"}" is active at this location, but it leaves this door under normal access control.`,
      };
    }
    return { kind: "takeover", planName: plan.name, directive, allowed: !!matchPrincipal(plan, userUuid, userGroups, groupNames) };
  };

  const results: DoorResult[] = doors.map(door => {
    const base: DoorResult = {
      doorUuid: door.uuid,
      doorName: door.name,
      locationName: door.locationUuid ? locations.get(door.locationUuid)?.name : undefined,
    };

    // 1. Lockdown replaces the grant logic for the doors it takes over, and
    //    suspends first-in everywhere at the location.
    const lockdownState = lockdownStatus(door);
    const lockdown = lockdownState.kind === "takeover" ? lockdownState : undefined;
    let result: DoorResult;
    if (lockdown) {
      const plan = `"${lockdown.planName ?? "lockdown"}"`;
      if (lockdown.directive === "UNLOCKED") {
        return { ...base, access: "yes", lockdown: `Lockdown ${plan} holds this door unlocked.` };
      }
      if (!lockdown.allowed) {
        return {
          ...base,
          access: "lockdown",
          lockdown: `Lockdown ${plan} is active: only the people and groups on the plan can open this door, whatever their normal grants say.`,
        };
      }
      result = { ...base, access: "yes", lockdown: `Lockdown ${plan} is active, and this person is on the plan, so they can still open it.` };
    } else {
      result = grantLevel(door, base);
      if (lockdownState.kind === "normal" || lockdownState.kind === "normal-no-first-in") {
        result = { ...result, lockdown: lockdownState.note };
      }
    }

    // 2. First-in: an otherwise-allowed person is denied while the rule is
    //    REQUIRED, unless the rule lists them (their badge then satisfies it).
    if (result.access === "yes" && (lockdownState.kind === "none" || lockdownState.kind === "normal") && firstIn) {
      const rule = firstIn.rules.find(r => r.doorUuids.includes(door.uuid));
      if (rule) {
        const ruleName = `"${rule.name ?? "first-in"}"`;
        if (matchPrincipal(rule, userUuid, userGroups, groupNames)) {
          result = { ...result, firstIn: `This person is on the first-in rule ${ruleName}, so their badge opens the door and satisfies the rule for everyone else.` };
        } else {
          const live = liveFirstIn?.get(door.uuid);
          const state = live && live !== "UNKNOWN" ? live : cloudFirstInState(rule, door);
          const source = live && live !== "UNKNOWN" ? "per the door controller" : "per the cloud setting";
          if (state === "REQUIRED") {
            result = {
              ...result,
              access: "first-in-required",
              firstIn: `First-in rule ${ruleName} is REQUIRED now (${source}): this person is denied until someone on the rule badges in.`,
            };
          } else if (state === "SATISFIED") {
            result = { ...result, firstIn: `First-in rule ${ruleName} is already satisfied (${source}); it resets on its schedule.` };
          }
        }
      }
    }

    // 3. Credentials: the door only opens for an ACTIVE credential that one of its readers can read.
    if (result.access === "yes" || result.access === "scheduled-not-now" || result.access === "first-in-required") {
      if (usable && usable.length === 0) {
        if (result.access === "yes" && !(lockdown?.directive === "UNLOCKED")) {
          result = { ...result, access: "no-usable-credential", reason: "Access is set up, but the person has no ACTIVE credential to present." };
        }
      } else if (usable && readers && !readers.skippedReason && door.readerComponentUuids) {
        const doorReaders: ReaderInfo[] = door.readerComponentUuids.map(
          uuid => readers.readers.get(uuid) ?? { uuid, kind: "unknown" as const }
        );
        if (doorReaders.length === 0 && door.subType === "APERIO") {
          doorReaders.push({ uuid: `${door.uuid}:aperio`, kind: "aperio" });
        }
        if (doorReaders.length === 0) {
          result = {
            ...result,
            ...(result.access === "yes" ? { access: "credential-not-accepted" } : {}),
            credentialFit: "The door has no reader configured, so no credential can be presented (remote unlock may still work).",
          };
        } else {
          const perCred = usable.map(c => ({
            type: c.credentialType,
            fit: best(doorReaders.map(r => readerFit(c.credentialType, r, door))),
          }));
          const fit = best(perCred.map(p => p.fit));
          const readerKinds = [...new Set(doorReaders.map(r => READER_LABEL[r.kind]))].join(", ");
          const labels = (types: (string | undefined)[]) => [...new Set(types.map(credentialTypeLabel))].join(", ");
          if (fit === "no") {
            const mobileOnly = perCred.every(p => p.type === "RHOMBUS_SECURE_MOBILE");
            result = {
              ...result,
              ...(result.access === "yes" ? { access: "credential-not-accepted" } : {}),
              credentialFit:
                `None of the person's active credentials (${labels(perCred.map(p => p.type))}) can be read by this door's ${readerKinds}.` +
                (mobileOnly ? " Phones only work on Rhombus readers; this door needs a card or PIN credential." : ""),
            };
          } else if (fit === "maybe") {
            result = {
              ...result,
              credentialFit: `Whether this door's ${readerKinds} reads the person's credentials (${labels(perCred.map(p => p.type))}) depends on reader hardware or settings the API does not show.`,
            };
          } else {
            result = { ...result, credentialFit: `Accepts: ${labels(perCred.filter(p => p.fit === "yes").map(p => p.type))}.` };
          }
        }
      }
    }
    return result;
  });

  const count = (access: string) => results.filter(r => r.access === access).length;
  const location = input.locationUuid ? locations.get(input.locationUuid) : undefined;
  const account = input.account?.ok ? input.account.value : undefined;

  const notChecked: string[] = [];
  if (!input.readers) notChecked.push("whether each door's readers accept the person's credential types");
  else if (readers?.skippedReason) notChecked.push(readers.skippedReason);
  if (!input.lockdown) notChecked.push("active lockdowns");
  if (!input.firstIn) notChecked.push("first-in rules");
  if (doors.some(d => d.privacyModeSupportEnabled)) {
    notChecked.push("privacy mode on the doors that support it (it blocks every non-admin badge while on)");
  }

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
      lockdown: count("lockdown"),
      firstInRequired: count("first-in-required"),
      credentialNotAccepted: count("credential-not-accepted"),
      noUsableCredential: count("no-usable-credential"),
      noAccess: count("no"),
      unknown: count("unknown"),
      usableCredentials: usable?.length,
    },
    account: account ? { found: account.found, status: account.status, deleted: account.deleted } : undefined,
    groups: input.groupUuids.ok
      ? input.groupUuids.value.map(uuid => ({ uuid, name: groupNames.get(uuid) }))
      : undefined,
    credentials: credentials?.map(c => ({
      uuid: c.uuid,
      credentialType: c.credentialType,
      label: credentialTypeLabel(c.credentialType),
      effectiveStatus: c.effectiveStatus,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      lastUsedAt: c.lastUsedAt,
    })),
    doors: results,
    inputsUnavailable: inputsUnavailable.length ? inputsUnavailable : undefined,
    notChecked: notChecked.length ? notChecked : undefined,
  };

  return {
    userDoorAccess,
    note: buildNote(results, location?.name, !!input.locationUuid, credentials, usable?.length, account, input.lockdown?.ok === true && lockdowns.length === 0, inputsUnavailable, notChecked),
  };
}

function buildNote(
  results: DoorResult[],
  locationName: string | undefined,
  scopedToLocation: boolean,
  credentials: AccessControlCredential[] | undefined,
  usableCredentials: number | undefined,
  account: UserAccount | undefined,
  noLockdown: boolean,
  inputsUnavailable: { input: string }[],
  notChecked: string[]
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
      ? `The person can badge into all ${results.length} door(s) ${where} right now.`
      : `The person can badge into ${yes} of ${results.length} door(s) ${where} right now.`
  );
  const lines: [string, string][] = [
    ["no", "No access"],
    ["scheduled-not-now", "Access only during a schedule that is not active now"],
    ["revoked", "Blocked by a revocation"],
    ["lockdown", "Blocked by an active lockdown"],
    ["first-in-required", "Blocked until the first-in rule is satisfied"],
    ["credential-not-accepted", "Their credentials cannot be read at"],
    ["no-usable-credential", "Access set up, but no active credential"],
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
        : `None of the person's ${credentials.length} credential(s) is usable (${credentials.map(c => credentialStatusLabel(c.effectiveStatus)).join(", ")}), so no badge will open any door until one is active.`
    );
  } else {
    const types = [...new Set(credentials.filter(c => c.effectiveStatus === "ACTIVE").map(c => credentialTypeLabel(c.credentialType)))];
    parts.push(`${usableCredentials} of ${credentials.length} credential(s) are active (${types.join(", ")}).`);
  }
  if (account && !account.found) {
    parts.push("No user account was found for this person — deleting a user revokes their credentials.");
  } else if (account?.deleted) {
    parts.push("This user account is deleted — its credentials are revoked.");
  } else if (account?.status === "PENDING" && credentials?.some(c => c.credentialType === "RHOMBUS_SECURE_MOBILE" && c.effectiveStatus === "ACTIVE")) {
    parts.push("The account is PENDING (invite not accepted). Account status does not affect badge access, but a mobile credential only works once the person signs in to the Rhombus Key app.");
  } else if (account) {
    parts.push("Account status does not affect badge access.");
  }
  if (noLockdown) parts.push("No lockdown is active.");
  if (inputsUnavailable.length) {
    parts.push(
      `Could not read: ${inputsUnavailable.map(i => i.input).join(", ")} — say so, and do not report the affected doors as having no access.`
    );
  }
  if (notChecked.length) parts.push(`Not checked: ${notChecked.join("; ")}.`);
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

/**
 * Every access controlled door. Same route + body as get-entity-tool, so it shares
 * that cache entry. Not via getAccessControlledDoors(): it drops the API error, and
 * a failed door list must not read as "there are no doors".
 */
async function getDoorInfos(requestModifiers?: RequestModifiers, sessionId?: string): Promise<DoorInfo[]> {
  const res = await cachedPostApi<schema["Component_FindAccessControlledDoorsWSResponse"]>({
    route: "/component/findAccessControlledDoors",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return (res.accessControlledDoors ?? []).flatMap(d => (d?.uuid ? [toDoorInfo(d)] : []));
}

export type DoorLabelWithDoors = {
  label: string;
  doorCount: number;
  doors: { doorUuid: string; doorName?: string; locationUuid?: string }[];
};

/**
 * label → the doors carrying it, with each door's name and location. The labels
 * endpoint is keyed the other way (door → labels, see getDoorLabels) because the
 * access check asks it per door; a caller choosing a label asks what it covers.
 *
 * A labelled door missing from the door list has been deleted, so it is left
 * out, and a label left with no doors is dropped. With a location, only that
 * location's doors count, so a label with no door there is left out too: labels
 * are org-wide, and "which labels apply here" is the usual question.
 */
export async function listDoorLabels(
  locationUuid: string | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<DoorLabelWithDoors[]> {
  const [doors, labelsByDoor] = await Promise.all([
    getDoorInfos(requestModifiers, sessionId),
    getDoorLabels(requestModifiers, sessionId),
  ]);
  const doorsByUuid = new Map(doors.map(door => [door.uuid, door]));

  const doorsByLabel = new Map<string, DoorLabelWithDoors["doors"]>();
  for (const [doorUuid, labels] of labelsByDoor) {
    const door = doorsByUuid.get(doorUuid);
    if (!door) continue;
    if (locationUuid && door.locationUuid !== locationUuid) continue;
    const entry = {
      doorUuid,
      ...(door.name ? { doorName: door.name } : {}),
      ...(door.locationUuid ? { locationUuid: door.locationUuid } : {}),
    };
    for (const label of labels) doorsByLabel.set(label, [...(doorsByLabel.get(label) ?? []), entry]);
  }

  return Array.from(doorsByLabel, ([label, labelDoors]) => ({
    label,
    doorCount: labelDoors.length,
    doors: labelDoors,
  })).sort((a, b) => a.label.localeCompare(b.label));
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

const READER_KIND_BY_TYPE: Record<string, ReaderKind> = {
  RhombusOsdpDoorReader: "rhombus",
  OsdpDoorReader: "osdp",
  WiegandDoorReader: "wiegand",
  AperioDoorReader: "aperio",
};
const READER_KIND_BY_READER_TYPE: Record<string, ReaderKind> = {
  rhombus_osdp: "rhombus",
  osdp: "osdp",
  wiegand: "wiegand",
  aperio_wireless: "aperio",
};

/**
 * The readers of the given door controllers, keyed by component uuid. There is
 * no org-wide reader list, so this is one (cached) call per controller.
 */
export async function getDoorReaders(
  ownerDeviceUuids: string[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<ReaderLookup> {
  if (ownerDeviceUuids.length > MAX_CONTROLLERS_FOR_READER_CHECK) {
    return {
      readers: new Map(),
      skippedReason: `whether the doors' readers accept the person's credential types (${ownerDeviceUuids.length} door controllers are in scope — ask about one location to include it)`,
    };
  }
  const readers = new Map<string, ReaderInfo>();
  const responses = await mapWithConcurrency(ownerDeviceUuids, FETCH_CONCURRENCY, ownerDeviceUuid =>
    cachedPostApi<schema["Component_FindComponentsByOwnerDeviceWSResponse"]>({
      route: "/component/findComponentsByOwnerDevice",
      body: { ownerDeviceUuid } satisfies schema["Component_FindComponentsByOwnerDeviceWSRequest"],
      modifiers: requestModifiers,
      sessionId,
    })
  );
  for (const res of responses) {
    throwIfApiError(res);
    for (const raw of res.components ?? []) {
      const component = raw as Record<string, unknown> | null;
      if (!component || typeof component.uuid !== "string") continue;
      const kind =
        READER_KIND_BY_TYPE[String(component.type)] ?? READER_KIND_BY_READER_TYPE[String(component.readerType)];
      if (!kind) continue; // relays, door position sensors, REX inputs...
      readers.set(component.uuid, {
        uuid: component.uuid,
        kind,
        name: typeof component.name === "string" ? component.name : undefined,
        disableCardReader: component.disableCardReader === true,
        disableKeypad: component.disableKeypad === true,
        disableWaveToUnlock: component.disableWaveToUnlock === true,
      });
    }
  }
  return { readers };
}

/**
 * Locations that are LOCKED_DOWN right now, with their active plans. The
 * filtered state list is usually empty, so the plan lookups — the only
 * follow-up calls — run only during an actual lockdown.
 */
export async function getActiveLockdowns(
  locationUuid: string | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<LockdownInfo> {
  const res = await postApi<schema["Accesscontrol_lockdownplan_FindLocationLockdownStatesWSResponse"]>({
    route: "/accesscontrol/lockdownPlan/findLocationLockdownStates",
    body: { stateFilter: ["LOCKED_DOWN"] } as schema["Accesscontrol_lockdownplan_FindLocationLockdownStatesWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);

  const lockedDown = (res.states ?? []).filter(
    (s): s is NonNullable<typeof s> =>
      !!s?.locationUuid &&
      s.state === "LOCKED_DOWN" &&
      (s.activeLockdownPlans?.length ?? 0) > 0 &&
      (!locationUuid || s.locationUuid === locationUuid)
  );
  if (lockedDown.length === 0) return { active: [] };

  const planUuids = [
    ...new Set(lockedDown.flatMap(s => nonNull(s.activeLockdownPlans?.map(p => p?.lockdownPlanUuid ?? null)))),
  ];
  const plans = new Map<string, LockdownPlanInfo>();
  await Promise.all(
    planUuids.map(async uuid => {
      const plan = await getLockdownPlan(uuid, requestModifiers, sessionId);
      if (!plan) return;
      const doorMap: Record<string, string> = {};
      for (const [doorUuid, state] of Object.entries(plan.doorLockdownStateMap ?? {})) {
        if (state) doorMap[doorUuid] = state;
      }
      plans.set(uuid, {
        uuid,
        name: plan.name ?? undefined,
        defaultLockdownState: plan.defaultLockdownState ?? undefined,
        doorLockdownStateMap: doorMap,
        userUuids: nonNull(plan.physicalAccess?.userUuids),
        groupUuids: nonNull(plan.physicalAccess?.groupUuids),
        testUserAccessOverride: (plan.testPlan as { userAccessOverrideEnabled?: boolean } | undefined)?.userAccessOverrideEnabled === true,
      });
    })
  );

  return {
    active: lockedDown.map(s => ({
      locationUuid: s.locationUuid!,
      followingTestPlan: s.followingTestPlan === true,
      plans: nonNull(s.activeLockdownPlans?.map(p => p?.lockdownPlanUuid ?? null)).flatMap(uuid => {
        const plan = plans.get(uuid);
        return plan ? [plan] : [];
      }),
    })),
  };
}

/**
 * First-in rules that gate badges, plus — only when one covers a door in
 * scope — the live door-controller state for those doors' locations (a badge
 * satisfies the rule locally before the cloud hears about it).
 */
export async function getFirstInRules(
  doorsInScope: DoorInfo[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<FirstInInfo> {
  const settings: NonNullable<schema["LocationFirstInSettings"]>[] = [];
  let lastEvaluatedKey: string | undefined;
  for (let page = 0; page < 5; page++) {
    const res = await postApi<schema["Accesscontrol_firstin_FindLocationFirstInSettingsByOrgWSResponse"]>({
      route: "/accesscontrol/firstIn/findLocationFirstInSettingsByOrg",
      body: lastEvaluatedKey ? { lastEvaluatedKey } : {},
      modifiers: requestModifiers,
      sessionId,
    });
    throwIfApiError(res);
    settings.push(...(res.settingsList ?? []).filter((s): s is NonNullable<typeof s> => !!s));
    lastEvaluatedKey = res.lastEvaluatedKey ?? undefined;
    if (!lastEvaluatedKey) break;
  }

  const inScope = new Set(doorsInScope.map(d => d.uuid));
  const rules: FirstInRule[] = settings
    .filter(s => s.doorAuthRequirementEnabled === true)
    .map(s => ({
      uuid: s.settingsUuid ?? undefined,
      name: s.name ?? undefined,
      doorUuids: nonNull(s.doorUuids),
      userUuids: nonNull(s.userUuids),
      groupUuids: nonNull(s.groupUuids),
      cloudState: s.doorAuthFirstInState?.state
        ? { state: s.doorAuthFirstInState.state, requestedAtMillis: s.doorAuthFirstInState.requestedAtMillis ?? undefined }
        : undefined,
    }))
    .filter(r => r.doorUuids.some(uuid => inScope.has(uuid)));

  if (rules.length === 0) return { rules, liveState: { ok: true, value: new Map() } };

  const ruleDoors = new Set(rules.flatMap(r => r.doorUuids));
  const locationUuids = [
    ...new Set(doorsInScope.filter(d => ruleDoors.has(d.uuid) && d.locationUuid).map(d => d.locationUuid!)),
  ];
  const liveState = await load(async () => {
    const states = new Map<string, string>();
    const responses = await Promise.all(
      locationUuids.map(locationUuid =>
        postApi<schema["Component_FindAccessControlledDoorShadowsByLocationWSResponse"]>({
          route: "/component/findAccessControlledDoorShadowsByLocation",
          body: { locationUuid },
          modifiers: requestModifiers,
          sessionId,
        })
      )
    );
    for (const res of responses) {
      throwIfApiError(res);
      for (const shadow of res.shadows ?? []) {
        if (shadow?.componentCompositeUuid && shadow.authFirstIn?.state) {
          states.set(shadow.componentCompositeUuid, shadow.authFirstIn.state);
        }
      }
    }
    return states;
  });
  return { rules, liveState };
}

async function getUserAccount(
  userUuid: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<UserAccount> {
  const res = await postApi<schema["User_FindUserWSResponse"]>({
    route: "/user/findUser",
    body: { userUuid } satisfies schema["User_FindUserWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  if (!res.user) return { found: false };
  return { found: true, status: res.user.status ?? undefined, deleted: res.user.deleted === true };
}

function toDoorInfo(d: NonNullable<schema["AccessControlledDoorType"]>): DoorInfo {
  const override = d.doorAuthFirstInStateOverride;
  return {
    uuid: d.uuid!,
    name: d.name ?? undefined,
    locationUuid: d.locationUuid ?? undefined,
    ownerDeviceUuid: d.ownerDeviceUuid ?? undefined,
    readerComponentUuids: d.readerComponents ? nonNull(d.readerComponents.map(r => r?.componentUuid ?? null)) : undefined,
    subType: d.subType ?? undefined,
    nfcSecureDowngradeEnabled: d.nfcSecureDowngradeEnabled ?? null,
    waveToUnlockEnabled: d.waveToUnlockSettings?.enabled ?? undefined,
    proximityUnlockEnabled: d.proximityUnlockSettings?.enabled ?? undefined,
    privacyModeSupportEnabled: d.privacyModeSupportEnabled === true,
    firstInOverride: override?.state
      ? { state: override.state, requestedAtMillis: override.requestedAtMillis ?? undefined }
      : undefined,
  };
}

export async function getUserDoorAccess(
  userUuid: string,
  locationUuid: string | null | undefined,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const doorsPromise = getDoorInfos(requestModifiers, sessionId);
  const doorsInScope = doorsPromise.then(doors =>
    doors.filter(d => !locationUuid || d.locationUuid === locationUuid)
  );

  const [doors, grants, groupUuids, groupNames, revocations, doorLabels, schedules, credentials, locations, readers, lockdown, firstIn, account] =
    await Promise.all([
      doorsPromise,
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
      // These three start as soon as the door list arrives, alongside the reads above.
      load(async () => {
        const controllers = [...new Set(nonNull((await doorsInScope).map(d => d.ownerDeviceUuid ?? null)))];
        return getDoorReaders(controllers, requestModifiers, sessionId);
      }),
      load(() => getActiveLockdowns(locationUuid, requestModifiers, sessionId)),
      load(async () => getFirstInRules(await doorsInScope, requestModifiers, sessionId)),
      load(() => getUserAccount(userUuid, requestModifiers, sessionId)),
    ]);

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
    readers,
    lockdown,
    firstIn,
    account,
  });
}
