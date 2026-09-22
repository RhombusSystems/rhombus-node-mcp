import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/schedule-tool.js";
import { parseWeeklyIntervals } from "../../src/types/schedule-tool-types.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

const SCHEDULE_UUID = "Wq1nR0kBS9y_2hZpVvGkAA";
const POLICY_UUID = "pol1cyUu1dS9y2hZpVvGkAA";

const MINUTES_PER_DAY = 24 * 60;

/** The proxy injects `includeFields` / `filterBy` / `groupBy` as nullable args. */
function withNulledArgs(overrides: Record<string, unknown> = {}) {
	return {
		includeFields: null,
		filterBy: null,
		groupBy: null,
		scheduleUuid: null,
		name: null,
		intervals: null,
		confirmDeleteInUse: null,
		...overrides,
	};
}

async function callTool(args: Record<string, unknown>) {
	const server = new McpServer({ name: "test", version: "0.0.0" });
	createTool(createFilteringProxy(server));

	const client = new Client({ name: "test-client", version: "0.0.0" });
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
	await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

	try {
		return await client.callTool({ name: "schedule-tool", arguments: args });
	} finally {
		await client.close();
		await server.close();
	}
}

function resultText(result: Awaited<ReturnType<typeof callTool>>): string {
	return (result.content as { text: string }[])[0].text;
}

const BUSINESS_HOURS = {
	uuid: SCHEDULE_UUID,
	name: "Business Hours",
	strategy: "WEEKLY_REPEATING_MINUTES",
	mutable: true,
	oneTimeUse: false,
	intervalList: [{ minuteOfWeekStart: 540, minuteOfWeekStop: 1020 }],
};

describe("parseWeeklyIntervals", () => {
	it("expands a day list into one minute-of-week window per day", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["MONDAY","TUESDAY"],"startTime":"09:00","endTime":"17:00"}]',
		);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		// Minute 0 is Monday 00:00, so Monday 09:00 is 540 and Tuesday 09:00 is 1980.
		expect(parsed.value).toEqual([
			{ minuteOfWeekStart: 540, minuteOfWeekStop: 1020 },
			{ minuteOfWeekStart: 540 + MINUTES_PER_DAY, minuteOfWeekStop: 1020 + MINUTES_PER_DAY },
		]);
	});

	it("carries a window whose end precedes its start into the next day", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["FRIDAY"],"startTime":"22:00","endTime":"06:00"}]',
		);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		// Friday is day 4: 22:00 Friday -> 06:00 Saturday.
		expect(parsed.value).toEqual([
			{ minuteOfWeekStart: 4 * MINUTES_PER_DAY + 22 * 60, minuteOfWeekStop: 5 * MINUTES_PER_DAY + 6 * 60 },
		]);
	});

	it("wraps a Sunday-night window round to Monday 00:00 rather than past the end of the week", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["SUNDAY"],"startTime":"23:00","endTime":"24:00"}]',
		);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(parsed.value).toEqual([
			{ minuteOfWeekStart: 6 * MINUTES_PER_DAY + 23 * 60, minuteOfWeekStop: 0 },
		]);
	});

	it("expands the WEEKDAYS group and dedupes an overlapping explicit day", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["WEEKDAYS","MONDAY"],"startTime":"09:00","endTime":"17:00"}]',
		);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(parsed.value).toHaveLength(5);
	});

	it("accepts raw minute-of-week pairs unchanged", () => {
		const parsed = parseWeeklyIntervals('[{"minuteOfWeekStart":540,"minuteOfWeekStop":1020}]');
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(parsed.value).toEqual([{ minuteOfWeekStart: 540, minuteOfWeekStop: 1020 }]);
	});

	it.each([
		["12-hour times", '[{"days":["MON"],"startTime":"9am","endTime":"5:30 PM"}]', 540, 17 * 60 + 30],
		["bare HHMM", '[{"days":["MON"],"startTime":"0900","endTime":"1700"}]', 540, 1020],
	])("accepts %s", (_label, input, start, stop) => {
		const parsed = parseWeeklyIntervals(input);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(parsed.value).toEqual([{ minuteOfWeekStart: start, minuteOfWeekStop: stop }]);
	});

	it("unwraps a double-encoded array instead of failing on it", () => {
		const parsed = parseWeeklyIntervals(
			JSON.stringify('[{"days":["MONDAY"],"startTime":"09:00","endTime":"17:00"}]'),
		);
		expect(parsed.ok).toBe(true);
	});

	it("names the field, the bad value and the allowed values for an unknown day", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["MONDIE"],"startTime":"09:00","endTime":"17:00"}]',
		);
		expect(parsed.ok).toBe(false);
		if (parsed.ok) return;
		expect(parsed.message).toContain("intervals[0].days");
		expect(parsed.message).toContain("MONDIE");
		expect(parsed.message).toContain("MONDAY");
	});

	it("rejects a zero-length window", () => {
		const parsed = parseWeeklyIntervals(
			'[{"days":["MONDAY"],"startTime":"09:00","endTime":"09:00"}]',
		);
		expect(parsed.ok).toBe(false);
		if (parsed.ok) return;
		expect(parsed.message).toContain("never active");
	});

	it("rejects an empty array rather than creating a schedule that is never active", () => {
		const parsed = parseWeeklyIntervals("[]");
		expect(parsed.ok).toBe(false);
		if (parsed.ok) return;
		expect(parsed.message).toContain("never active");
	});
});

describe("schedule-tool", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
	});

	it("renders each window for reading alongside the raw minute integers", async () => {
		vi.mocked(network.postApi).mockResolvedValue({
			schedules: [BUSINESS_HOURS],
		} as never);

		const result = await callTool(withNulledArgs({ requestType: "list" }));
		const structured = result.structuredContent as {
			schedules: { intervals: { window: string; minuteOfWeekStart: number }[] }[];
		};
		expect(structured.schedules[0].intervals[0].window).toBe("Monday 09:00 – Monday 17:00");
		// The raw value has to survive too — the rendered string is only checkable
		// against it.
		expect(structured.schedules[0].intervals[0].minuteOfWeekStart).toBe(540);
	});

	it("says an empty schedule list means none are configured, not that the read failed", async () => {
		vi.mocked(network.postApi).mockResolvedValue({ schedules: [] } as never);

		const result = await callTool(withNulledArgs({ requestType: "list" }));
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("no schedules configured");
	});

	it("refuses to delete a schedule that policies still use, and deletes nothing", async () => {
		vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
			if (route === "/policy/findSchedules") return { schedules: [BUSINESS_HOURS] };
			if (route === "/policy/getPoliciesUsingSchedule") {
				return { cameraPolicyList: [{ uuid: POLICY_UUID, name: "After Hours Alerts" }] };
			}
			throw new Error(`unexpected route ${route}`);
		}) as never);

		const result = await callTool(
			withNulledArgs({ requestType: "delete", scheduleUuid: SCHEDULE_UUID }),
		);

		const structured = result.structuredContent as { note?: string; deleted?: unknown };
		expect(structured.note).toContain("NOT DELETED");
		expect(structured.note).toContain("After Hours Alerts");
		expect(structured.deleted).toBeUndefined();
		// The critical assertion: the delete endpoint was never reached.
		const routes = vi.mocked(network.postApi).mock.calls.map(call => call[0].route);
		expect(routes).not.toContain("/policy/deleteSchedule");
	});

	it("deletes an in-use schedule once confirmDeleteInUse is set, and says what was affected", async () => {
		vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
			if (route === "/policy/findSchedules") return { schedules: [BUSINESS_HOURS] };
			if (route === "/policy/getPoliciesUsingSchedule") {
				return { cameraPolicyList: [{ uuid: POLICY_UUID, name: "After Hours Alerts" }] };
			}
			if (route === "/policy/deleteSchedule") return {};
			throw new Error(`unexpected route ${route}`);
		}) as never);

		const result = await callTool(
			withNulledArgs({
				requestType: "delete",
				scheduleUuid: SCHEDULE_UUID,
				confirmDeleteInUse: true,
			}),
		);

		const structured = result.structuredContent as {
			deleted?: { success?: boolean };
			note?: string;
		};
		expect(structured.deleted?.success).toBe(true);
		expect(structured.note).toContain("After Hours Alerts");
	});

	it("preserves existing windows when update only changes the name", async () => {
		vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
			if (route === "/policy/findSchedules") return { schedules: [BUSINESS_HOURS] };
			if (route === "/policy/updateSchedule") return {};
			throw new Error(`unexpected route ${route}`);
		}) as never);

		await callTool(
			withNulledArgs({
				requestType: "update",
				scheduleUuid: SCHEDULE_UUID,
				name: "Core Hours",
			}),
		);

		const updateCall = vi
			.mocked(network.postApi)
			.mock.calls.find(call => call[0].route === "/policy/updateSchedule");
		const body = updateCall?.[0].body as { schedule: { name: string; intervalList: unknown[] } };
		expect(body.schedule.name).toBe("Core Hours");
		// api2's updateSchedule replaces the whole schedule, so dropping intervalList
		// here would silently blank the windows.
		expect(body.schedule.intervalList).toEqual([
			{ minuteOfWeekStart: 540, minuteOfWeekStop: 1020 },
		]);
	});

	it("refuses to edit a system-managed schedule", async () => {
		vi.mocked(network.postApi).mockResolvedValue({
			schedules: [{ ...BUSINESS_HOURS, mutable: false }],
		} as never);

		const result = await callTool(
			withNulledArgs({ requestType: "update", scheduleUuid: SCHEDULE_UUID, name: "Nope" }),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("system-managed");
	});

	it("tells the model to list rather than guess when the uuid does not exist", async () => {
		vi.mocked(network.postApi).mockResolvedValue({ schedules: [BUSINESS_HOURS] } as never);

		const result = await callTool(
			withNulledArgs({ requestType: "get", scheduleUuid: "madeUpUuid1234567890AB" }),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("do not guess");
	});

	it("labels a bad-intervals create as retryable so the model corrects instead of stopping", async () => {
		const result = await callTool(
			withNulledArgs({
				requestType: "create",
				name: "Bad",
				intervals: '[{"days":["MONDIE"],"startTime":"09:00","endTime":"17:00"}]',
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("RETRYABLE");
		expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
	});

	it("surfaces an api2 in-band errorMsg rather than a generic failure", async () => {
		vi.mocked(network.postApi).mockResolvedValue({
			error: true,
			errorMsg: "A schedule named Business Hours already exists.",
		} as never);

		const result = await callTool(
			withNulledArgs({
				requestType: "create",
				name: "Business Hours",
				intervals: '[{"days":["MONDAY"],"startTime":"09:00","endTime":"17:00"}]',
			}),
		);
		const structured = result.structuredContent as { error?: string };
		expect(structured.error).toBe("A schedule named Business Hours already exists.");
	});
});
