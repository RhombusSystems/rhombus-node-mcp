import { z } from "zod";
import { formatMinuteOfWeek } from "../util.js";

export enum ScheduleToolRequestType {
	LIST = "list",
	GET = "get",
	CREATE = "create",
	UPDATE = "update",
	DELETE = "delete",
	GET_POLICIES_USING = "get-policies-using",
}

/**
 * The only strategy this tool writes. api2's `ScheduleStrategyEnum` also has
 * ABSOLUTE_SECONDS / REALTIME_RELATIVE_SECONDS / RELATIVE_DATETIME_INTERVALS,
 * but those are stored through a different endpoint family
 * (`/schedule/create*`) with a different interval shape, so accepting them here
 * would produce a schedule the write path cannot actually populate.
 */
export const WEEKLY_REPEATING_STRATEGY = "WEEKLY_REPEATING_MINUTES";

export const INTERVALS_EXAMPLE =
	'[{"days":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],"startTime":"09:00","endTime":"17:00"}]';

export const TOOL_ARGS = {
	requestType: z
		.nativeEnum(ScheduleToolRequestType)
		.describe("The type of schedule operation to perform."),
	scheduleUuid: z
		.string()
		.nullable()
		.describe(
			"The UUID of the schedule. Required for 'get', 'update', 'delete', and 'get-policies-using'.",
		),
	name: z
		.string()
		.nullable()
		.describe(
			"The schedule's display name, e.g. \"Business Hours\". Required for 'create'; optional for 'update' (omit to leave the name unchanged).",
		),
	intervals: z
		.string()
		.nullable()
		.describe(
			`JSON string describing the weekly windows the schedule is ACTIVE. Required for 'create'; ` +
				`optional for 'update' (omit to leave the windows unchanged — passing it REPLACES all ` +
				`existing windows). Preferred shape is a JSON array of objects with "days" (a list of ` +
				`MONDAY…SUNDAY), "startTime" and "endTime" as 24-hour "HH:MM" — e.g. ${INTERVALS_EXAMPLE}. ` +
				`A window that ends before it starts is treated as crossing midnight into the next day. ` +
				`Raw {"minuteOfWeekStart":N,"minuteOfWeekStop":N} pairs (minutes since Monday 00:00) are ` +
				`also accepted.`,
		),
	confirmDeleteInUse: z
		.boolean()
		.nullable()
		.describe(
			"Only for 'delete'. Deleting a schedule that policies still reference changes those " +
				"policies' behaviour, so 'delete' refuses by default and lists the policies using it. " +
				"Set true to delete anyway, after telling the user which policies are affected.",
		),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const INTERVAL_OUTPUT = z.object({
	minuteOfWeekStart: z.number().optional().describe("Minutes since Monday 00:00 when the window opens."),
	minuteOfWeekStop: z.number().optional().describe("Minutes since Monday 00:00 when the window closes."),
	window: z
		.string()
		.optional()
		.describe(
			'The same window rendered for reading, e.g. "Monday 09:00 – Monday 17:00". Derived from the two integers above.',
		),
});

const SCHEDULE_OUTPUT = z.object({
	uuid: z.string().optional(),
	name: z.string().optional(),
	strategy: z.string().optional(),
	mutable: z
		.boolean()
		.optional()
		.describe("False for system-managed schedules, which cannot be updated or deleted."),
	oneTimeUse: z.boolean().optional(),
	intervals: z.array(INTERVAL_OUTPUT).optional().describe("The windows in which the schedule is active."),
});

export const OUTPUT_SCHEMA = z.object({
	schedules: z.array(SCHEDULE_OUTPUT).optional().describe("All schedules in the organization."),
	schedule: SCHEDULE_OUTPUT.optional().describe("A single schedule."),
	created: z
		.object({ success: z.boolean().optional(), scheduleUuid: z.string().optional() })
		.optional(),
	updated: z
		.object({ success: z.boolean().optional(), scheduleUuid: z.string().optional() })
		.optional(),
	deleted: z
		.object({ success: z.boolean().optional(), scheduleUuid: z.string().optional() })
		.optional(),
	usedBy: z
		.array(
			z.object({
				uuid: z.string().optional(),
				name: z.string().optional(),
				policyType: z.string().optional(),
			}),
		)
		.optional()
		.describe("Policies that reference this schedule."),
	note: z
		.string()
		.optional()
		.describe("A caveat about this result that the user needs to be told."),
	warningMsg: z
		.string()
		.optional()
		.describe("A warning from the Rhombus API — the call succeeded, but with a caveat."),
	error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
export type WeeklySchedule = z.infer<typeof SCHEDULE_OUTPUT>;

// ---------------------------------------------------------------------------
// intervals parsing
//
// `intervals` is a free-form STRING param, so nothing machine-enforces its
// shape: tools are adapted for OpenAI with `strict: false`, and even under
// `strict: true` a string param's *contents* are never constrained. Every check
// lives here, and every message names the field, the expected shape, and what
// was actually received.
// ---------------------------------------------------------------------------

export type WeeklyInterval = { minuteOfWeekStart: number; minuteOfWeekStop: number };
export type WeeklyScheduleInput = {
	name?: string;
	strategy: typeof WEEKLY_REPEATING_STRATEGY;
	intervalList?: WeeklyInterval[];
	uuid?: string;
};

type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

const DAY_INDEX: Record<string, number> = {
	MONDAY: 0,
	TUESDAY: 1,
	WEDNESDAY: 2,
	THURSDAY: 3,
	FRIDAY: 4,
	SATURDAY: 5,
	SUNDAY: 6,
};

const DAY_ALIASES: Record<string, string> = {
	MON: "MONDAY",
	TUE: "TUESDAY",
	TUES: "TUESDAY",
	WED: "WEDNESDAY",
	WEDS: "WEDNESDAY",
	THU: "THURSDAY",
	THUR: "THURSDAY",
	THURS: "THURSDAY",
	FRI: "FRIDAY",
	SAT: "SATURDAY",
	SUN: "SUNDAY",
};

const WEEKDAY_GROUPS: Record<string, string[]> = {
	WEEKDAYS: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
	WEEKENDS: ["SATURDAY", "SUNDAY"],
	WEEKEND: ["SATURDAY", "SUNDAY"],
	EVERYDAY: Object.keys(DAY_INDEX),
	DAILY: Object.keys(DAY_INDEX),
	ALL: Object.keys(DAY_INDEX),
};

const SHAPE_HINT =
	`Expected a JSON array string, each entry either {"days":[...],"startTime":"HH:MM","endTime":"HH:MM"} ` +
	`or {"minuteOfWeekStart":N,"minuteOfWeekStop":N} — e.g. ${INTERVALS_EXAMPLE}. "days" must be a real ` +
	`JSON array, NOT a string containing one.`;

function quote(value: unknown): string {
	const serialized = typeof value === "string" ? value : JSON.stringify(value);
	const text = serialized ?? String(value);
	return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

function normalizeDay(raw: string): string {
	const key = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
	return DAY_ALIASES[key] ?? key;
}

/** Accept "09:00", "9:00", "0900", "9am", "5:30 PM", and bare "17". */
function parseTimeOfDay(raw: unknown): number | null {
	if (typeof raw === "number" && Number.isFinite(raw)) {
		// A bare number is read as an hour when it plausibly is one, else as
		// minutes-past-midnight. 930 is not an hour; 9 is.
		const value = Math.trunc(raw);
		if (value >= 0 && value <= 23) return value * 60;
		if (value >= 0 && value < MINUTES_PER_DAY) return value;
		return null;
	}
	if (typeof raw !== "string") return null;

	const text = raw.trim().toUpperCase();
	if (!text) return null;

	const meridiem = text.endsWith("AM") ? "AM" : text.endsWith("PM") ? "PM" : null;
	const body = (meridiem ? text.slice(0, -2) : text).trim().replace(/\./g, "");

	let hours: number;
	let minutes: number;

	if (body.includes(":")) {
		const [hourPart, minutePart = "0"] = body.split(":");
		hours = Number(hourPart);
		minutes = Number(minutePart);
	} else if (/^\d{3,4}$/.test(body)) {
		hours = Number(body.slice(0, body.length - 2));
		minutes = Number(body.slice(-2));
	} else if (/^\d{1,2}$/.test(body)) {
		hours = Number(body);
		minutes = 0;
	} else {
		return null;
	}

	if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
	if (minutes < 0 || minutes > 59) return null;

	if (meridiem) {
		if (hours < 1 || hours > 12) return null;
		if (meridiem === "AM") hours = hours === 12 ? 0 : hours;
		else hours = hours === 12 ? 12 : hours + 12;
	}

	// 24:00 is a legitimate spelling of "end of day".
	if (hours === 24 && minutes === 0) return MINUTES_PER_DAY;
	if (hours < 0 || hours > 23) return null;

	return hours * 60 + minutes;
}

function coerceDays(raw: unknown): string[] | null {
	if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (!trimmed) return null;
		// The model sometimes JSON-encodes the array into the string.
		if (trimmed.startsWith("[")) {
			try {
				return coerceDays(JSON.parse(trimmed));
			} catch {
				return null;
			}
		}
		return trimmed
			.split(",")
			.map(part => part.trim())
			.filter(Boolean);
	}
	if (Array.isArray(raw)) {
		const out: string[] = [];
		for (const item of raw) {
			if (typeof item !== "string" || !item.trim()) return null;
			out.push(item.trim());
		}
		return out;
	}
	return null;
}

/** Expand "WEEKDAYS" and friends, then map to day indices. */
function resolveDays(raw: unknown): { ok: true; value: number[] } | { ok: false; invalid: string[] } {
	const tokens = coerceDays(raw);
	if (tokens === null) return { ok: false, invalid: [] };

	const expanded: string[] = [];
	for (const token of tokens) {
		const normalized = normalizeDay(token);
		const group = WEEKDAY_GROUPS[normalized];
		if (group) expanded.push(...group);
		else expanded.push(normalized);
	}

	const invalid = expanded.filter(day => !(day in DAY_INDEX));
	if (invalid.length > 0) return { ok: false, invalid: [...new Set(invalid)] };

	// Dedupe so "WEEKDAYS,MONDAY" doesn't write Monday twice.
	return { ok: true, value: [...new Set(expanded.map(day => DAY_INDEX[day]))].sort((a, b) => a - b) };
}

/**
 * Parse the `intervals` JSON string into api2's minute-of-week pairs. Runs
 * BEFORE any mutation, so every failure here is safely retryable.
 */
export function parseWeeklyIntervals(raw: string): ParseResult<WeeklyInterval[]> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		return {
			ok: false,
			message:
				`intervals is not valid JSON (${error instanceof Error ? error.message : "parse error"}). ` +
				SHAPE_HINT,
		};
	}

	// Unwrap double (or triple) encoding rather than failing on it.
	let unwrapAttempts = 0;
	while (typeof parsed === "string" && unwrapAttempts < 3) {
		try {
			parsed = JSON.parse(parsed);
		} catch {
			return {
				ok: false,
				message: `intervals decoded to a plain string ("${quote(parsed)}") rather than an array. ${SHAPE_HINT}`,
			};
		}
		unwrapAttempts++;
	}

	if (parsed === null || typeof parsed !== "object") {
		return {
			ok: false,
			message: `intervals must be a JSON array; received ${parsed === null ? "null" : `a ${typeof parsed}`} (${quote(raw)}). ${SHAPE_HINT}`,
		};
	}

	// A single interval object instead of a one-element array is unambiguous.
	const entries = Array.isArray(parsed) ? parsed : [parsed];
	if (entries.length === 0) {
		return {
			ok: false,
			message: `intervals is empty — a schedule with no windows is never active. ${SHAPE_HINT}`,
		};
	}

	const windows: WeeklyInterval[] = [];
	const issues: string[] = [];

	entries.forEach((entry, index) => {
		const label = `intervals[${index}]`;
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
			issues.push(`${label} is not an object (received ${quote(entry)})`);
			return;
		}
		const fields = entry as Record<string, unknown>;

		// Raw minute-of-week pairs pass straight through.
		if (fields.minuteOfWeekStart !== undefined || fields.minuteOfWeekStop !== undefined) {
			const start = fields.minuteOfWeekStart;
			const stop = fields.minuteOfWeekStop;
			if (typeof start !== "number" || typeof stop !== "number") {
				issues.push(
					`${label} has minuteOfWeekStart/minuteOfWeekStop but they are not both numbers (received ${quote(start)} and ${quote(stop)})`,
				);
				return;
			}
			if (start < 0 || start >= MINUTES_PER_WEEK || stop < 0 || stop > MINUTES_PER_WEEK) {
				issues.push(
					`${label} minute-of-week values must be between 0 and ${MINUTES_PER_WEEK} (received ${start} and ${stop})`,
				);
				return;
			}
			windows.push({ minuteOfWeekStart: Math.trunc(start), minuteOfWeekStop: Math.trunc(stop) });
			return;
		}

		const days = resolveDays(fields.days ?? fields.day ?? fields.daysOfWeek);
		if (!days.ok) {
			issues.push(
				days.invalid.length > 0
					? `${label}.days contains ${days.invalid.map(d => `"${d}"`).join(", ")} — use MONDAY…SUNDAY (or "WEEKDAYS"/"WEEKENDS")`
					: `${label}.days must be an array of day names, e.g. ["MONDAY","TUESDAY"] (received ${quote(fields.days ?? fields.day ?? fields.daysOfWeek)})`,
			);
			return;
		}
		if (days.value.length === 0) {
			issues.push(`${label}.days is empty — include at least one day`);
			return;
		}

		const startRaw = fields.startTime ?? fields.start ?? fields.from;
		const endRaw = fields.endTime ?? fields.end ?? fields.stop ?? fields.to;
		const startMinute = parseTimeOfDay(startRaw);
		const endMinute = parseTimeOfDay(endRaw);
		if (startMinute === null) {
			issues.push(
				`${label}.startTime must be a 24-hour "HH:MM" time (received ${quote(startRaw)})`,
			);
			return;
		}
		if (endMinute === null) {
			issues.push(`${label}.endTime must be a 24-hour "HH:MM" time (received ${quote(endRaw)})`);
			return;
		}
		if (startMinute === endMinute) {
			issues.push(
				`${label} starts and ends at the same time (${quote(startRaw)}) — a zero-length window is never active`,
			);
			return;
		}

		for (const day of days.value) {
			const start = day * MINUTES_PER_DAY + startMinute;
			// An end before the start means the window crosses midnight; carry it
			// into the following day rather than rejecting it.
			const stop =
				endMinute > startMinute
					? day * MINUTES_PER_DAY + endMinute
					: (day + 1) * MINUTES_PER_DAY + endMinute;
			windows.push({
				minuteOfWeekStart: start,
				// A Sunday-night window wraps past the end of the week, which api2
				// stores as minute 0 (Monday 00:00) of the same week.
				minuteOfWeekStop: stop % MINUTES_PER_WEEK,
			});
		}
	});

	if (issues.length > 0) {
		return { ok: false, message: `Invalid intervals: ${issues.join("; ")}.` };
	}
	return { ok: true, value: windows };
}

/** Render parsed windows back for the confirmation message. */
export function describeIntervals(intervals: WeeklyInterval[]): string {
	return intervals
		.map(
			interval =>
				`${formatMinuteOfWeek(interval.minuteOfWeekStart)} – ${formatMinuteOfWeek(interval.minuteOfWeekStop)}`,
		)
		.join(", ");
}
