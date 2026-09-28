import { describe, expect, it } from "vitest";

import {
	isScheduleActive,
	resolveUserDoorAccess,
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
		expect(result.note).toContain("cover all 4 door(s) at Main Office");
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
		expect(result.note).toContain("None of the person's 2 credential(s) is usable (SUSPENDED, EXPIRED)");
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
