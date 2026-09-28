import { describe, expect, it } from "vitest";

import {
	isScheduleActive,
	readerFit,
	resolveUserDoorAccess,
	type DoorInfo,
	type LockdownPlanInfo,
	type ReaderInfo,
	type ScheduleInfo,
	type UserDoorAccessInputs,
} from "../../src/api/user-door-access-api.js";

const USER = "usrAliceAbCdEfGhIjKlM";
const OTHER_USER = "usrOtherAbCdEfGhIjKlM";
const GROUP_STAFF = "grpStaffAbCdEfGhIjKlM";
const GROUP_OTHER = "grpOtherAbCdEfGhIjKlM";
const LOCATION = "locHqAbCdEfGhIjKlMnOp";
const OTHER_LOCATION = "locSatAbCdEfGhIjKlMnO";
const TZ = "America/Los_Angeles";

// Wednesday 2026-09-23 10:00 in Los Angeles (17:00Z).
const WEDNESDAY_10AM = Date.parse("2026-09-23T17:00:00Z");
// Minute of week, Monday 00:00 = 0.
const WED = 2 * 1440;

const doors = [
	{ uuid: "dorLobbyAbCdEfGhIjKlM", name: "Lobby Entry", locationUuid: LOCATION },
	{ uuid: "dorServerAbCdEfGhIjKl", name: "Server Room", locationUuid: LOCATION },
	{ uuid: "dorIdfAbCdEfGhIjKlMnO", name: "IDF Closet", locationUuid: LOCATION },
	{ uuid: "dorSupplyAbCdEfGhIjKl", name: "Supply Room", locationUuid: LOCATION },
	{ uuid: "dorSatAbCdEfGhIjKlMnO", name: "Satellite Door", locationUuid: OTHER_LOCATION },
];
const [LOBBY, SERVER, IDF, SWAG] = doors.map(d => d.uuid);

function ok<T>(value: T) {
	return { ok: true as const, value };
}

function inputs(overrides: Partial<UserDoorAccessInputs> = {}): UserDoorAccessInputs {
	return {
		userUuid: USER,
		locationUuid: LOCATION,
		nowMs: WEDNESDAY_10AM,
		doors,
		locations: ok([
			{ uuid: LOCATION, name: "Main Office", timezone: TZ },
			{ uuid: OTHER_LOCATION, name: "Satellite", timezone: TZ },
		]),
		grants: [],
		groupUuids: ok([GROUP_STAFF]),
		groupNames: ok(new Map([[GROUP_STAFF, "All Staff"], [GROUP_OTHER, "Cleaners"]])),
		revocations: ok([]),
		doorLabels: ok(new Map<string, string[]>()),
		schedules: ok(new Map<string, ScheduleInfo>()),
		credentials: ok([
			{ uuid: "crd1", credentialType: "RHOMBUS_SECURE_CSN", status: "ACTIVE", effectiveStatus: "ACTIVE" },
		]),
		...overrides,
	};
}

function accessByDoor(result: ReturnType<typeof resolveUserDoorAccess>) {
	return Object.fromEntries(
		(result.userDoorAccess.doors ?? []).map(d => [d.doorName, d.access]),
	);
}

describe("isScheduleActive", () => {
	const weekly = (intervals: { start: number; stop: number }[]): ScheduleInfo => ({
		uuid: "sch",
		strategy: "WEEKLY_REPEATING_MINUTES",
		weekly: intervals,
	});

	it("reads weekly minutes in the location's time zone, Monday = 0", () => {
		// 09:00–17:00 Wednesday local: active at 10:00 local even though it is 17:00Z.
		expect(isScheduleActive(weekly([{ start: WED + 540, stop: WED + 1020 }]), WEDNESDAY_10AM, TZ)).toBe(true);
		expect(isScheduleActive(weekly([{ start: WED + 660, stop: WED + 1020 }]), WEDNESDAY_10AM, TZ)).toBe(false);
	});

	it("treats a weekly interval as half-open and lets it wrap past the end of the week", () => {
		expect(isScheduleActive(weekly([{ start: WED + 600, stop: WED + 660 }]), WEDNESDAY_10AM, TZ)).toBe(true);
		expect(isScheduleActive(weekly([{ start: WED + 540, stop: WED + 600 }]), WEDNESDAY_10AM, TZ)).toBe(false);
		// Sunday 22:00 → Wednesday 12:00 wraps through Monday 00:00.
		expect(isScheduleActive(weekly([{ start: 6 * 1440 + 1320, stop: WED + 720 }]), WEDNESDAY_10AM, TZ)).toBe(true);
	});

	it("cannot judge a wall-clock schedule without a time zone", () => {
		expect(isScheduleActive(weekly([{ start: 0, stop: 10080 }]), WEDNESDAY_10AM, undefined)).toBeUndefined();
	});

	it("reads absolute intervals as epoch seconds", () => {
		const nowSec = WEDNESDAY_10AM / 1000;
		const absolute = (beginSec: number, endSec: number): ScheduleInfo => ({
			uuid: "sch",
			strategy: "ABSOLUTE_SECONDS",
			absolute: [{ beginSec, endSec }],
		});
		expect(isScheduleActive(absolute(nowSec - 60, nowSec + 60), WEDNESDAY_10AM, undefined)).toBe(true);
		expect(isScheduleActive(absolute(nowSec - 60, nowSec), WEDNESDAY_10AM, undefined)).toBe(false);
	});

	it("reads local date-time intervals in the location's time zone", () => {
		const local = (start: string, end: string): ScheduleInfo => ({
			uuid: "sch",
			strategy: "RELATIVE_DATETIME_INTERVALS",
			localIntervals: [{ start, end }],
		});
		expect(isScheduleActive(local("2026-09-23T09:00:00", "2026-09-23T11:00:00"), WEDNESDAY_10AM, TZ)).toBe(true);
		// 17:00 would be "now" in UTC — it must not match.
		expect(isScheduleActive(local("2026-09-23T16:30:00", "2026-09-23T17:30:00"), WEDNESDAY_10AM, TZ)).toBe(false);
	});
});

describe("resolveUserDoorAccess", () => {
	it("gives access through an access control group — the case MIND used to report as 'no access'", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{
						uuid: "gntStaff",
						name: "Staff Doors",
						locationUuid: LOCATION,
						userUuids: [OTHER_USER],
						groupUuids: [GROUP_STAFF],
						doorUuids: [LOBBY, SERVER, IDF, SWAG],
					},
				],
			}),
		);

		expect(accessByDoor(result)).toEqual({
			"Lobby Entry": "yes",
			"Server Room": "yes",
			"IDF Closet": "yes",
			"Supply Room": "yes",
		});
		const lobby = result.userDoorAccess.doors?.[0];
		expect(lobby?.grants?.[0]).toMatchObject({ via: "group", groupName: "All Staff", schedule: "always" });
		expect(result.note).toContain("can badge into all 4 door(s) at Main Office right now");
		// The other location's door is out of scope.
		expect(result.userDoorAccess.summary?.doors).toBe(4);
	});

	it("names the doors nothing gives access to", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{ uuid: "g", name: "Lobby Only", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [LOBBY] },
					{ uuid: "g2", name: "Cleaners", locationUuid: LOCATION, userUuids: [], groupUuids: [GROUP_OTHER], doorUuids: [SERVER] },
				],
			}),
		);

		expect(accessByDoor(result)).toMatchObject({ "Lobby Entry": "yes", "Server Room": "no", "IDF Closet": "no" });
		expect(result.note).toContain("No access: IDF Closet, Server Room, Supply Room.");
	});

	it("covers doors through a door label, including a label grant made at another location", () => {
		const result = resolveUserDoorAccess(
			inputs({
				doorLabels: ok(new Map([[IDF, ["Network"]]])),
				grants: [
					{
						uuid: "g",
						name: "Network Closets",
						locationUuid: OTHER_LOCATION,
						userUuids: [USER],
						groupUuids: [],
						doorUuids: [],
						doorLabels: ["Network"],
					},
				],
			}),
		);

		const idf = result.userDoorAccess.doors?.find(d => d.doorName === "IDF Closet");
		expect(idf?.access).toBe("yes");
		expect(idf?.grants?.[0].viaLabel).toBe("Network");
	});

	it("reports a scheduled grant outside its window as scheduled-not-now, not as no access", () => {
		const result = resolveUserDoorAccess(
			inputs({
				schedules: ok(
					new Map([
						["schNights", { uuid: "schNights", name: "Nights", strategy: "WEEKLY_REPEATING_MINUTES", weekly: [{ start: WED + 1200, stop: WED + 1440 }] }],
					]),
				),
				grants: [
					{ uuid: "g", name: "Night Shift", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [LOBBY], scheduleUuid: "schNights" },
				],
			}),
		);

		const lobby = result.userDoorAccess.doors?.find(d => d.doorName === "Lobby Entry");
		expect(lobby?.access).toBe("scheduled-not-now");
		expect(lobby?.reason).toContain('"Nights"');
	});

	it("drops a grant whose schedule is missing, as the registrar does", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{ uuid: "g", name: "Old Grant", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [LOBBY], scheduleUuid: "schGone" },
				],
			}),
		);

		const lobby = result.userDoorAccess.doors?.find(d => d.doorName === "Lobby Entry");
		expect(lobby?.access).toBe("no");
		expect(lobby?.reason).toContain("schedule no longer exists");
	});

	it("lets an active revocation beat a grant, through the person's group", () => {
		const nowSec = WEDNESDAY_10AM / 1000;
		const result = resolveUserDoorAccess(
			inputs({
				schedules: ok(
					new Map([
						["schAudit", { uuid: "schAudit", name: "Audit week", strategy: "ABSOLUTE_SECONDS", absolute: [{ beginSec: nowSec - 3600, endSec: nowSec + 3600 }] }],
					]),
				),
				grants: [
					{ uuid: "g", name: "Staff", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [SERVER] },
				],
				revocations: ok([
					{ uuid: "r", name: "Server lockout", locationUuid: LOCATION, userUuids: [], groupUuids: [GROUP_STAFF], doorUuids: [SERVER], doorLabels: [], scheduleUuid: "schAudit" },
				]),
			}),
		);

		const server = result.userDoorAccess.doors?.find(d => d.doorName === "Server Room");
		expect(server?.access).toBe("revoked");
		expect(server?.reason).toContain("Server lockout");
	});

	it("ignores a revocation with no schedule, which door controllers never receive", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{ uuid: "g", name: "Staff", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [SERVER] },
				],
				revocations: ok([
					{ uuid: "r", name: "Scheduleless", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [SERVER], doorLabels: [] },
				]),
			}),
		);

		const server = result.userDoorAccess.doors?.find(d => d.doorName === "Server Room");
		expect(server?.access).toBe("yes");
		expect(server?.revocations?.[0].problem).toContain("no schedule");
	});

	it("says 'unknown', never 'no', when group membership could not be read", () => {
		const result = resolveUserDoorAccess(
			inputs({
				groupUuids: { ok: false, error: "Sorry, I don't have permission to help with this request." },
				grants: [
					{ uuid: "g", name: "Staff", locationUuid: LOCATION, userUuids: [], groupUuids: [GROUP_STAFF], doorUuids: [LOBBY] },
				],
			}),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("unknown");
		expect(result.userDoorAccess.summary?.noAccess).toBe(0);
		expect(result.userDoorAccess.inputsUnavailable?.[0].input).toBe("access control group membership");
		expect(result.note).toContain("do not report the affected doors as having no access");
	});

	it("warns that no badge works when the person has no active credential", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{ uuid: "g", name: "Staff", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [LOBBY] },
				],
				credentials: ok([
					{ uuid: "c1", status: "SUSPENDED", effectiveStatus: "SUSPENDED" },
					{ uuid: "c2", status: "ACTIVE", effectiveStatus: "EXPIRED" },
				]),
			}),
		);

		expect(result.userDoorAccess.summary?.usableCredentials).toBe(0);
		expect(result.note).toContain("None of the person's 2 credential(s) is usable (suspended, expired)");
	});

	it("skips guest-pass grants, which carry passes rather than people", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [
					{ uuid: "g", name: "Guest", locationUuid: LOCATION, userUuids: [USER], groupUuids: [], doorUuids: [LOBBY], mode: "GUEST_PASS_INDIVIDUAL" },
				],
			}),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("no");
	});
});

const STAFF_GRANT = {
	uuid: "gntStaff",
	name: "Staff Doors",
	locationUuid: LOCATION,
	userUuids: [],
	groupUuids: [GROUP_STAFF],
	doorUuids: [LOBBY, SERVER, IDF, SWAG],
};
const FAR_FUTURE = 4_102_444_800_000; // 2100 — later than every cloud state below

function plan(overrides: Partial<LockdownPlanInfo> = {}): LockdownPlanInfo {
	return {
		uuid: "plnA",
		name: "Full Lockdown",
		defaultLockdownState: "LOCKED_DOWN",
		doorLockdownStateMap: {},
		userUuids: [],
		groupUuids: [],
		testUserAccessOverride: false,
		...overrides,
	};
}

function door(overrides: Partial<DoorInfo> = {}): DoorInfo {
	return { uuid: "dor", name: "Door", locationUuid: LOCATION, readerComponentUuids: ["rdr"], ...overrides };
}
function reader(kind: ReaderInfo["kind"], overrides: Partial<ReaderInfo> = {}): ReaderInfo {
	return { uuid: "rdr", kind, ...overrides };
}

describe("readerFit", () => {
	it("reads a mobile credential on a Rhombus reader, and not on a Wiegand reader", () => {
		expect(readerFit("RHOMBUS_SECURE_MOBILE", reader("rhombus"), door())).toBe("yes");
		expect(readerFit("RHOMBUS_SECURE_MOBILE", reader("wiegand"), door({ nfcSecureDowngradeEnabled: false }))).toBe("no");
		// Secure downgrade does not help a phone: it presents no fixed card number.
		expect(readerFit("RHOMBUS_SECURE_MOBILE", reader("osdp"), door({ nfcSecureDowngradeEnabled: null }))).toBe("no");
	});

	it("still reads a mobile credential by NFC tap when wave-to-unlock is off at the reader", () => {
		expect(readerFit("RHOMBUS_SECURE_MOBILE", reader("rhombus", { disableWaveToUnlock: true }), door())).toBe("yes");
		expect(
			readerFit("RHOMBUS_SECURE_MOBILE", reader("rhombus", { disableWaveToUnlock: true, disableCardReader: true }), door()),
		).toBe("no");
	});

	it("reads Wiegand formats on third-party readers only", () => {
		expect(readerFit("WIEGAND_H10301", reader("wiegand"), door())).toBe("yes");
		expect(readerFit("HID_CORP1000_STD_35", reader("osdp"), door())).toBe("yes");
		expect(readerFit("WIEGAND_H10301", reader("rhombus"), door())).toBe("no");
	});

	it("reads a Rhombus Secure card on a third-party reader only with secure downgrade", () => {
		expect(readerFit("RHOMBUS_SECURE_CSN", reader("osdp"), door({ nfcSecureDowngradeEnabled: true }))).toBe("yes");
		expect(readerFit("RHOMBUS_SECURE_CSN", reader("osdp"), door({ nfcSecureDowngradeEnabled: false }))).toBe("no");
		// null = the org default applies, which the API does not expose.
		expect(readerFit("RHOMBUS_SECURE_CSN", reader("osdp"), door({ nfcSecureDowngradeEnabled: null }))).toBe("maybe");
	});

	it("respects the reader's card and keypad switches", () => {
		expect(readerFit("STANDARD_CSN", reader("rhombus", { disableCardReader: true }), door())).toBe("no");
		expect(readerFit("PIN_CODE", reader("osdp", { disableKeypad: true }), door())).toBe("no");
		expect(readerFit("PIN_CODE", reader("rhombus"), door())).toBe("no");
	});

	it("never reads the types the firmware has no parser for", () => {
		expect(readerFit("CUSTOM", reader("osdp"), door())).toBe("no");
	});
});

describe("resolveUserDoorAccess — lockdown, first-in, credentials, account", () => {
	it("blocks a normally-allowed person during a lockdown they are not on", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				lockdown: ok({ active: [{ locationUuid: LOCATION, followingTestPlan: false, plans: [plan({ doorLockdownStateMap: { [LOBBY]: "ACCESS_CONTROLLED" } })] }] }),
			}),
		);

		expect(accessByDoor(result)).toMatchObject({ "Server Room": "lockdown", "Lobby Entry": "yes" });
		expect(result.userDoorAccess.doors?.find(d => d.doorName === "Server Room")?.lockdown).toContain("Full Lockdown");
		expect(result.note).toContain("Blocked by an active lockdown: IDF Closet, Server Room, Supply Room.");
	});

	it("lets a person on the lockdown plan in, even without a grant", () => {
		const result = resolveUserDoorAccess(
			inputs({
				lockdown: ok({ active: [{ locationUuid: LOCATION, followingTestPlan: false, plans: [plan({ groupUuids: [GROUP_STAFF] })] }] }),
			}),
		);

		expect(accessByDoor(result)["Server Room"]).toBe("yes");
	});

	it("ignores a lockdown test that leaves user access alone", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				lockdown: ok({ active: [{ locationUuid: LOCATION, followingTestPlan: true, plans: [plan()] }] }),
			}),
		);

		expect(accessByDoor(result)["Server Room"]).toBe("yes");
		expect(result.userDoorAccess.doors?.find(d => d.doorName === "Server Room")?.lockdown).toContain("test");
	});

	it("denies a person the first-in rule does not list while it is REQUIRED", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				firstIn: ok({
					rules: [{ name: "Managers first", doorUuids: [LOBBY], userUuids: [OTHER_USER], groupUuids: [], cloudState: { state: "REQUIRED", requestedAtMillis: 1 } }],
					liveState: ok(new Map()),
				}),
			}),
		);

		const lobby = result.userDoorAccess.doors?.find(d => d.doorName === "Lobby Entry");
		expect(lobby?.access).toBe("first-in-required");
		expect(lobby?.firstIn).toContain("Managers first");
	});

	it("trusts the door controller's live first-in state over the cloud setting", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				firstIn: ok({
					rules: [{ name: "Managers first", doorUuids: [LOBBY], userUuids: [OTHER_USER], groupUuids: [], cloudState: { state: "REQUIRED", requestedAtMillis: FAR_FUTURE } }],
					liveState: ok(new Map([[LOBBY, "SATISFIED"]])),
				}),
			}),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("yes");
	});

	it("lets a person on the first-in rule in — their badge satisfies it", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				firstIn: ok({
					rules: [{ name: "Managers first", doorUuids: [LOBBY], userUuids: [], groupUuids: [GROUP_STAFF], cloudState: { state: "REQUIRED" } }],
					liveState: ok(new Map()),
				}),
			}),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("yes");
	});

	it("flags doors whose readers cannot read any of the person's active credentials", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				doors: doors.map(d =>
					d.uuid === SERVER ? { ...d, readerComponentUuids: ["rdrWiegand"], nfcSecureDowngradeEnabled: false } : { ...d, readerComponentUuids: ["rdrRhombus"] },
				),
				readers: ok({
					readers: new Map([
						["rdrWiegand", { uuid: "rdrWiegand", kind: "wiegand" as const }],
						["rdrRhombus", { uuid: "rdrRhombus", kind: "rhombus" as const }],
					]),
				}),
				credentials: ok([{ uuid: "c1", credentialType: "RHOMBUS_SECURE_MOBILE", status: "ACTIVE", effectiveStatus: "ACTIVE" }]),
			}),
		);

		const server = result.userDoorAccess.doors?.find(d => d.doorName === "Server Room");
		expect(server?.access).toBe("credential-not-accepted");
		expect(server?.credentialFit).toContain("Wiegand reader");
		expect(server?.credentialFit).toContain("needs a card or PIN");
		expect(server?.credentialFit).toContain("Rhombus mobile credential");
		expect(accessByDoor(result)["Lobby Entry"]).toBe("yes");
	});

	it("skips the reader check for a door whose reader list the API did not return", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				doors: doors.map(d => ({ ...d, readerComponentUuids: undefined })),
				readers: ok({ readers: new Map() }),
			}),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("yes");
	});

	it("marks access as unusable when the person has no active credential", () => {
		const result = resolveUserDoorAccess(
			inputs({ grants: [STAFF_GRANT], credentials: ok([{ uuid: "c1", status: "SUSPENDED", effectiveStatus: "SUSPENDED" }]) }),
		);

		expect(accessByDoor(result)["Lobby Entry"]).toBe("no-usable-credential");
	});

	it("reports the account and states that its status does not gate badges", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				account: ok({ found: true, status: "PENDING", deleted: false }),
				lockdown: ok({ active: [] }),
				firstIn: ok({ rules: [], liveState: ok(new Map()) }),
				readers: ok({ readers: new Map() }),
				credentials: ok([{ uuid: "c1", credentialType: "RHOMBUS_SECURE_MOBILE", status: "ACTIVE", effectiveStatus: "ACTIVE" }]),
			}),
		);

		expect(result.note).toContain("PENDING");
		expect(result.note).toContain("Rhombus Key app");
		expect(result.note).toContain("No lockdown is active.");
		expect(result.note).not.toContain("Not checked");
	});
});

describe("user-facing text", () => {
	it("never carries a raw enum name — the Console's markdown italicises underscores", () => {
		const result = resolveUserDoorAccess(
			inputs({
				grants: [STAFF_GRANT],
				doors: doors.map(d => (d.uuid === SERVER ? { ...d, readerComponentUuids: ["rdrWiegand"] } : { ...d, readerComponentUuids: ["rdrRhombus"] })),
				readers: ok({
					readers: new Map([
						["rdrWiegand", { uuid: "rdrWiegand", kind: "wiegand" as const }],
						["rdrRhombus", { uuid: "rdrRhombus", kind: "rhombus" as const }],
					]),
				}),
				credentials: ok([
					{ uuid: "c1", credentialType: "RHOMBUS_SECURE_MOBILE", status: "ACTIVE", effectiveStatus: "ACTIVE" },
					{ uuid: "c2", credentialType: "HID_CORP1000_STD_35", status: "ACTIVE", effectiveStatus: "NOT_YET_VALID" },
				]),
				account: ok({ found: true, status: "PENDING" }),
			}),
		);

		const texts = [
			result.note,
			...(result.userDoorAccess.doors ?? []).flatMap(d => [d.reason, d.credentialFit, d.lockdown, d.firstIn]),
		].filter((t): t is string => !!t);
		for (const text of texts) expect(text).not.toMatch(/[A-Z0-9]+_[A-Z0-9_]+/);
		expect(result.userDoorAccess.credentials?.[0].label).toBe("Rhombus mobile credential");
	});
});
