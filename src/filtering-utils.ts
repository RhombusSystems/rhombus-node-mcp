import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { logger } from "./logger.js";

// ---------------------------------------------------------------------------
// Shared tool arg schemas
// ---------------------------------------------------------------------------

const INCLUDE_FIELDS_DESCRIPTION = `Dot-notation field paths to include in the response (e.g. "vehicleEvents.vehicleLicensePlate").
Pass null to return all fields. WARNING: some responses can exceed 400k characters — use includeFields
to request only the data you need. For high-volume tools this may be required to get a complete answer.
Core device-status fields (connected, connectionStatus, healthStatus, healthStatusDetails, batteryStatus)
are always retained where present, even if not listed here.`;

export const INCLUDE_FIELDS_ARG = z
	.array(z.string())
	.nullable()
	.describe(INCLUDE_FIELDS_DESCRIPTION);

export const FILTER_BY_ARG = z
	.array(
		z.object({
			field: z
				.string()
				.describe(
					"Dot-notation path within each array item to compare (e.g. 'vehicleLicensePlate', 'eventTimestamp')",
				),
			op: z
				.enum(["=", "!=", ">", ">=", "<", "<=", "contains"])
				.describe("Comparison operator"),
			value: z
				.union([z.string(), z.number(), z.boolean()])
				.describe("Value to compare against"),
		}),
	)
	.nullable()
	.describe(
		`Filter array items in the response by field values. All conditions are ANDed.
Example: [{field: "vehicleLicensePlate", op: "=", value: "ABC123"}, {field: "confidence", op: ">", value: 0.8}]
Use alongside includeFields to get only the specific records and fields you need.`,
	);

export type FilterCondition = {
	field: string;
	op: "=" | "!=" | ">" | ">=" | "<" | "<=" | "contains";
	value: string | number | boolean;
};

// nullish, not nullable: pre-existing callers (evals, specs, cached tool-call
// replays) omit the key entirely and must stay valid.
export const GROUP_BY_ARG = z
	.string()
	.nullish()
	.describe(
		`Group array items by a field and return EXACT per-group counts computed server-side, instead of the rows.
Use this for "how many per X" / "which X has the most Y" questions — never tally rows yourself.
Example: groupBy "locationUuid" on a camera list returns {camerasGrouped: {by: "locationUuid", total: 63, groups: {"<uuid>": 37, ...}}} (groups sorted by count, descending).
Applied after filterBy, so e.g. filterBy [{field: "connected", op: "=", value: false}] + groupBy "locationUuid" = offline devices per location.
Accepts the same dot-notation field paths as filterBy (optionally prefixed with the array key, e.g. "cameras.locationUuid").`,
	);

// Grouping by a high-cardinality field (e.g. a uuid) must not bloat the
// response: keep the top N groups and report how many were omitted.
const GROUP_BY_MAX_GROUPS = 50;

/**
 * Cross-cutting keys every tool emits (or may emit), always kept regardless of
 * what the caller projected. `note` carries tool-emitted diagnostics (e.g.
 * "this location has no doors, so the empty result is not an absence of
 * activity") — projecting it away would hide exactly the caveat the model needs.
 *
 * Tool-SPECIFIC fields do not belong here. Declare those at the tool's own
 * `registerTool` call with `protectFields` below, so the protection lives next
 * to the thing being protected instead of in a list nobody reads.
 */
const ALWAYS_PROTECTED_FIELDS = [
	"requestType",
	"note",
	"error",
	"filterByWarnings",
	"groupByWarnings",
];

/**
 * Carries a tool's protected field names on its registerTool config. A symbol
 * so it cannot collide with an SDK config key and never survives into JSON;
 * the proxy strips it before forwarding the config on regardless.
 */
const PROTECTED_FIELDS = Symbol.for("rhombus.protectedFields");

/**
 * Marks top-level output fields that must survive an `includeFields`
 * projection even when the caller didn't ask for them.
 *
 * Use it for anything the model needs in order to read the rest of the result
 * correctly — pre-computed rosters/aggregates it would otherwise have to derive
 * from a long list, scope/caveat markers, and the like:
 *
 * ```ts
 * server.registerTool(
 *   TOOL_NAME,
 *   protectFields({ title: "Faces", ... }, ["faceEventSummary"]),
 *   TOOL_HANDLER,
 * );
 * ```
 *
 * Names are matched at the TOP LEVEL of the result only, and a bare name keeps
 * the field's entire subtree.
 */
export function protectFields<T extends object>(config: T, fields: string[]): T {
	return { ...config, [PROTECTED_FIELDS]: fields };
}

// ---------------------------------------------------------------------------
// filterIncludedFields — trie-based dot-notation field projection
// ---------------------------------------------------------------------------

type Trie = { [key: string]: Trie };

function buildTrie(paths: string[]): Trie {
	const trie: Trie = {};
	for (const p of paths) {
		const parts = p.split(".");
		let node = trie;
		for (const part of parts) {
			if (!node[part]) node[part] = {};
			node = node[part];
		}
	}
	return trie;
}

// Device-status fields the model must never be able to project away: a status
// query where includeFields omits these returns data with no status in it, and
// the model then truthfully answers "status not included" (observed in prod,
// 2026-07-22). Grafted onto every internal trie node — fields a payload
// doesn't have are simply absent, so this is a no-op outside device lists.
const PROTECTED_STATUS_FIELDS = [
	"connected",
	"connectionStatus",
	"healthStatus",
	"healthStatusDetails",
	"batteryStatus",
];

function addProtectedStatusFields(trie: Trie): void {
	const children = Object.keys(trie);
	// An empty node means "include everything below" — already keeps them.
	if (children.length === 0) return;
	for (const key of children) addProtectedStatusFields(trie[key]);
	for (const field of PROTECTED_STATUS_FIELDS) {
		if (!(field in trie)) trie[field] = {};
	}
}

function filterByTrie(obj: any, trie: Trie): any {
	// Empty trie at this level means "include everything"
	if (Object.keys(trie).length === 0) {
		return obj;
	}

	if (Array.isArray(obj)) {
		const mapped = obj
			.map((item) => filterByTrie(item, trie))
			.filter((item) => item !== undefined);
		return mapped.length > 0 ? mapped : undefined;
	}

	if (typeof obj === "object" && obj !== null) {
		const result: any = {};
		for (const key of Object.keys(trie)) {
			if (key in obj) {
				const child = filterByTrie(obj[key], trie[key]);
				if (child !== undefined) result[key] = child;
			}
		}
		return Object.keys(result).length > 0 ? result : undefined;
	}

	// Primitive reached with a non-empty trie — return as-is (e.g. the trie
	// targeted a leaf that is a scalar)
	return obj;
}

/**
 * Filters an object to only include the specified dot-notation field paths.
 *
 * Examples:
 *   filterIncludedFields(data, ["vehicleEvents.vehicleLicensePlate", "error"])
 *   → keeps vehicleLicensePlate within each vehicleEvents item, and the top-level error field
 */
export function filterIncludedFields(obj: any, fieldsToInclude: string[]): any {
	if (!fieldsToInclude || fieldsToInclude.length === 0) {
		return obj;
	}
	const trie = buildTrie(fieldsToInclude);
	addProtectedStatusFields(trie);
	// When groupBy replaced an array with its summary, no trie path can match
	// anything — start from an empty object so the re-attach below still runs
	// (an empty final result falls back to `undefined`, the old behavior).
	const projected =
		filterByTrie(obj, trie) ??
		(obj && typeof obj === "object" && !Array.isArray(obj) ? {} : undefined);

	// A `<key>Count` sibling is authoritative metadata for its array (post-
	// filterBy it is the match count) — keep it whenever its array survives the
	// projection, even if the caller didn't list it explicitly. `<key>Grouped`
	// summaries (from groupBy) replace their array entirely, so no trie path
	// can match them — always re-attach, along with their Count sibling.
	if (
		projected &&
		typeof projected === "object" &&
		!Array.isArray(projected) &&
		typeof obj === "object" &&
		!Array.isArray(obj)
	) {
		for (const key of Object.keys(projected)) {
			if (
				Array.isArray(projected[key]) &&
				typeof obj[`${key}Count`] === "number" &&
				!(`${key}Count` in projected)
			) {
				projected[`${key}Count`] = obj[`${key}Count`];
			}
		}
		for (const key of Object.keys(obj)) {
			if (key.endsWith("Grouped") && !(key in projected)) {
				projected[key] = obj[key];
				const countKey = `${key.slice(0, -"Grouped".length)}Count`;
				if (typeof obj[countKey] === "number" && !(countKey in projected)) {
					projected[countKey] = obj[countKey];
				}
			}
		}
		if (Object.keys(projected).length === 0) return undefined;
	}

	return projected;
}

// ---------------------------------------------------------------------------
// applyFilterBy — predicate filtering of array items
// ---------------------------------------------------------------------------

function getNestedValue(obj: any, fieldPath: string): any {
	if (!fieldPath) return obj;
	const parts = fieldPath.split(".");
	let current = obj;
	for (const part of parts) {
		if (current === null || current === undefined) return undefined;
		current = current[part];
	}
	return current;
}

function matchesCondition(item: any, condition: FilterCondition): boolean {
	const actual = getNestedValue(item, condition.field);
	const { op, value } = condition;

	if (actual === undefined || actual === null) return false;

	switch (op) {
		case "=":
			// biome-ignore lint/suspicious/noDoubleEquals: intentional loose equality for mixed string/number comparisons
			return actual == value;
		case "!=":
			// biome-ignore lint/suspicious/noDoubleEquals: intentional loose equality for mixed string/number comparisons
			return actual != value;
		case ">":
			return Number(actual) > Number(value);
		case ">=":
			return Number(actual) >= Number(value);
		case "<":
			return Number(actual) < Number(value);
		case "<=":
			return Number(actual) <= Number(value);
		case "contains":
			return String(actual).toLowerCase().includes(String(value).toLowerCase());
		default:
			return false;
	}
}

/**
 * Filters array items in the output object based on field-level predicates.
 * Conditions are grouped by their top-level key; arrays at that key are
 * filtered so only items matching ALL conditions (AND) are kept.
 *
 * Example:
 *   applyFilterBy({ vehicleEvents: [...] }, [
 *     { field: "vehicleLicensePlate", op: "=", value: "ABC123" }
 *   ])
 *   → vehicleEvents array is filtered to items whose vehicleLicensePlate === "ABC123"
 *
 * Note: conditions whose `field` contains a dot are resolved by navigating the
 * full path within each array item (e.g. "location.name" looks up item.location.name).
 */
export function applyFilterBy(obj: any, conditions: FilterCondition[]): any {
	if (!conditions?.length || typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.filter((item) =>
			conditions.every((c) => matchesCondition(item, c)),
		);
	}

	// For object payloads, group conditions by the top-level key so we know
	// which array in the payload each condition targets.
	const conditionsByTopKey: Record<string, FilterCondition[]> = {};
	for (const cond of conditions) {
		const dotIdx = cond.field.indexOf(".");
		// If the field has no dot, it's a direct property of the array item —
		// use the condition as-is against all array values in the object.
		const topKey = dotIdx === -1 ? "*" : cond.field.substring(0, dotIdx);
		const subField =
			dotIdx === -1 ? cond.field : cond.field.substring(dotIdx + 1);
		if (!conditionsByTopKey[topKey]) conditionsByTopKey[topKey] = [];
		conditionsByTopKey[topKey].push({ ...cond, field: subField });
	}

	const result: any = { ...obj };
	const warnings: string[] = [];

	// A condition whose field is absent from EVERY item of the target array
	// would silently drop all rows (undefined never matches) — the model then
	// reads {items: [], count: N} as "0 matches" when really it filtered on a
	// phantom field. Skip such conditions and warn loudly instead.
	const partitionConds = (items: any[], conds: FilterCondition[], arrayKey: string) => {
		if (items.length === 0) return conds;
		const applicable: FilterCondition[] = [];
		for (const c of conds) {
			if (items.some((item) => getNestedValue(item, c.field) !== undefined)) {
				applicable.push(c);
			} else {
				const available = [...new Set(items.slice(0, 50).flatMap((item) =>
					item && typeof item === "object" ? Object.keys(item) : [],
				))].sort();
				warnings.push(
					`filterBy condition on field "${c.field}" was IGNORED — no item in "${arrayKey}" has that field (it would have matched nothing). Available fields: ${available.join(", ")}`,
				);
			}
		}
		return applicable;
	};

	for (const [topKey, keyConds] of Object.entries(conditionsByTopKey)) {
		if (topKey === "*") {
			// Apply conditions to every top-level array in the object
			for (const k of Object.keys(result)) {
				if (Array.isArray(result[k])) {
					const conds = partitionConds(result[k], keyConds, k);
					result[k] = result[k].filter((item: any) =>
						conds.every((c) => matchesCondition(item, c)),
					);
				}
			}
		} else if (topKey in result && Array.isArray(result[topKey])) {
			const conds = partitionConds(result[topKey], keyConds, topKey);
			result[topKey] = result[topKey].filter((item: any) =>
				conds.every((c) => matchesCondition(item, c)),
			);
		}
	}

	// Sync sibling counts to the (now-filtered) array lengths so counts always
	// reflect what the model is looking at — pre-filter total when no filterBy
	// was applied (handler computed it), post-filter total when one was.
	// Covers both the bare `{count, items[]}` convention and the
	// `{<key>Count, <key>[]}` convention (e.g. camerasCount next to cameras).
	if (typeof result.count === "number") {
		const arrayKeys = Object.keys(result).filter((k) => Array.isArray(result[k]));
		if (arrayKeys.length === 1) {
			result.count = result[arrayKeys[0]].length;
		}
	}
	for (const k of Object.keys(result)) {
		if (Array.isArray(result[k]) && typeof result[`${k}Count`] === "number") {
			result[`${k}Count`] = result[k].length;
		}
	}

	if (warnings.length > 0) {
		result.filterByWarnings = warnings;
	}

	return result;
}

// ---------------------------------------------------------------------------
// applyGroupBy — server-side per-group counts
// ---------------------------------------------------------------------------

/**
 * Replaces each targeted array with a `<key>Grouped` summary of EXACT counts
 * per distinct value of `groupByField` — so "how many per location" is
 * computed in code, never tallied by the model (LLM tallies over long lists
 * are reliably off by small amounts).
 *
 * `groupByField` uses the same addressing as filterBy conditions: a bare
 * field applies to every top-level array, `arrayKey.field` targets one array.
 * A field no item has leaves the rows intact and warns via `groupByWarnings`.
 */
export function applyGroupBy(obj: any, groupByField: string): any {
	if (!groupByField || typeof obj !== "object" || obj === null) {
		return obj;
	}

	const dotIdx = groupByField.indexOf(".");
	const topKey = dotIdx === -1 ? "*" : groupByField.substring(0, dotIdx);
	const field = dotIdx === -1 ? groupByField : groupByField.substring(dotIdx + 1);

	const result: any = Array.isArray(obj) ? { items: obj } : { ...obj };
	const warnings: string[] = [];

	const groupArray = (items: any[], arrayKey: string): boolean => {
		if (items.length === 0) return false;
		if (!items.some((item) => getNestedValue(item, field) !== undefined)) {
			const available = [...new Set(items.slice(0, 50).flatMap((item) =>
				item && typeof item === "object" ? Object.keys(item) : [],
			))].sort();
			warnings.push(
				`groupBy field "${field}" was IGNORED — no item in "${arrayKey}" has that field; rows returned ungrouped. Available fields: ${available.join(", ")}`,
			);
			return false;
		}

		const tally = new Map<string, number>();
		for (const item of items) {
			const value = getNestedValue(item, field);
			const key =
				value === undefined || value === null
					? "(none)"
					: typeof value === "object"
						? "(non-scalar)"
						: String(value);
			tally.set(key, (tally.get(key) ?? 0) + 1);
		}

		const sorted = [...tally.entries()].sort((a, b) => b[1] - a[1]);
		const kept = sorted.slice(0, GROUP_BY_MAX_GROUPS);
		const grouped: any = {
			by: field,
			total: items.length,
			groups: Object.fromEntries(kept),
		};
		if (sorted.length > kept.length) {
			grouped.omittedGroups = sorted.length - kept.length;
			grouped.note = `${sorted.length} distinct values; showing the top ${kept.length} by count.`;
		}

		result[`${arrayKey}Grouped`] = grouped;
		delete result[arrayKey];
		if (typeof result[`${arrayKey}Count`] === "number") {
			result[`${arrayKey}Count`] = items.length;
		}
		return true;
	};

	let groupedAny = false;
	if (topKey === "*") {
		for (const k of Object.keys(result)) {
			if (Array.isArray(result[k])) {
				groupedAny = groupArray(result[k], k) || groupedAny;
			}
		}
	} else if (topKey in result && Array.isArray(result[topKey])) {
		groupedAny = groupArray(result[topKey], topKey);
	} else {
		warnings.push(
			`groupBy "${groupByField}" was IGNORED — the response has no array at "${topKey}".`,
		);
	}

	if (warnings.length > 0) {
		result.groupByWarnings = [...(result.groupByWarnings ?? []), ...warnings];
	}

	return Array.isArray(obj) && !groupedAny && warnings.length === 0
		? obj
		: result;
}

// ---------------------------------------------------------------------------
// zodToDotNotationPaths — derive available field paths from an OUTPUT_SCHEMA
// ---------------------------------------------------------------------------

/**
 * Recursively walks a Zod schema and returns all valid dot-notation field paths.
 * Useful for auto-documenting available includeFields/filterBy paths in tool descriptions.
 *
 * Example: zodToDotNotationPaths(OUTPUT_SCHEMA)
 *   → ["vehicleEvents", "vehicleEvents.uuid", "vehicleEvents.vehicleLicensePlate", "error", ...]
 */
export function zodToDotNotationPaths(
	schema: z.ZodTypeAny,
	prefix = "",
): string[] {
	// Unwrap optional / nullable / default
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
		return zodToDotNotationPaths(schema.unwrap() as z.ZodTypeAny, prefix);
	}
	if (schema instanceof z.ZodDefault) {
		return zodToDotNotationPaths((schema as any)._def.innerType, prefix);
	}

	// Recurse into ZodObject shape
	if (schema instanceof z.ZodObject) {
		const paths: string[] = [];
		for (const [key, value] of Object.entries(
			schema.shape as Record<string, z.ZodTypeAny>,
		)) {
			const fullKey = prefix ? `${prefix}.${key}` : key;
			paths.push(fullKey);
			paths.push(...zodToDotNotationPaths(value, fullKey));
		}
		return paths;
	}

	// Recurse into ZodArray element
	if (schema instanceof z.ZodArray) {
		return zodToDotNotationPaths(schema.element as z.ZodTypeAny, prefix);
	}

	// ZodUnion — collect from all branches (deduplicated by caller if needed)
	if (schema instanceof z.ZodUnion) {
		const paths: string[] = [];
		for (const option of (schema as any)._def.options as z.ZodTypeAny[]) {
			paths.push(...zodToDotNotationPaths(option, prefix));
		}
		return paths;
	}

	// Scalar — no further nesting
	return [];
}

// ---------------------------------------------------------------------------
// deepOptionalizeSchema — relax an outputSchema for post-projection validation
// ---------------------------------------------------------------------------

/** Carry a rebuilt schema's description over from the schema it replaces. */
function withDescription(
	next: z.ZodTypeAny,
	prev: z.ZodTypeAny,
): z.ZodTypeAny {
	return prev.description ? next.describe(prev.description) : next;
}

/**
 * Returns a copy of `schema` with every object field made optional, recursively.
 *
 * The MCP SDK validates a tool's `structuredContent` against its registered
 * `outputSchema` AFTER the handler returns — which is after this proxy has
 * already projected the payload down to the caller's `includeFields`. Any field
 * the schema marks required but the projection dropped then fails validation,
 * and a working tool call comes back to the model as
 * `MCP error -32602: Output validation error`. (Hit in prod by
 * events-tool/brivo-access-control: includeFields asked for
 * `brivoDoors.doorName` + `.locationUuid` but not the required
 * `brivoDoors.brivoDoorId`, so the model reported Brivo data as unreadable.)
 *
 * Projection inherently invalidates required-ness, so the schema we register
 * has to be all-optional. Nothing model-facing changes: `outputSchema` is never
 * forwarded to the LLM, and the includeFields path catalog is derived from the
 * ORIGINAL schema before this runs. Descriptions are preserved.
 */
export function deepOptionalizeSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
	// Wrappers: unwrap, recurse, re-wrap so nested objects are relaxed too.
	if (schema instanceof z.ZodOptional) {
		return deepOptionalizeSchema(schema.unwrap() as z.ZodTypeAny).optional();
	}
	if (schema instanceof z.ZodNullable) {
		return deepOptionalizeSchema(schema.unwrap() as z.ZodTypeAny).nullable();
	}
	// The default is dropped: this schema is only ever used for validation, and
	// a defaulted field is already satisfied by `undefined`.
	if (schema instanceof z.ZodDefault) {
		return deepOptionalizeSchema((schema as any)._def.innerType).optional();
	}

	if (schema instanceof z.ZodObject) {
		const relaxed: Record<string, z.ZodTypeAny> = {};
		for (const [key, value] of Object.entries(
			schema.shape as Record<string, z.ZodTypeAny>,
		)) {
			relaxed[key] = optionalize(deepOptionalizeSchema(value));
		}
		return withDescription(z.object(relaxed), schema);
	}

	if (schema instanceof z.ZodArray) {
		return withDescription(
			z.array(deepOptionalizeSchema(schema.element as z.ZodTypeAny)),
			schema,
		);
	}

	if (schema instanceof z.ZodRecord) {
		const def = (schema as any)._def;
		return withDescription(
			z.record(def.keyType, deepOptionalizeSchema(def.valueType)),
			schema,
		);
	}

	// Covers discriminated unions too. Rebuilding one as a plain union is
	// deliberate — an optional discriminator is not a legal discriminated union.
	if (
		schema instanceof z.ZodUnion ||
		schema instanceof z.ZodDiscriminatedUnion
	) {
		const options = (schema as any)._def.options as z.ZodTypeAny[];
		if (Array.isArray(options) && options.length >= 2) {
			return withDescription(
				z.union(options.map(deepOptionalizeSchema) as any),
				schema,
			);
		}
		return schema;
	}

	// Scalars and anything we don't model (effects, pipes, lazy) pass through.
	return schema;
}

/** `.optional()` builds a fresh wrapper, which does not inherit the description. */
function optionalize(schema: z.ZodTypeAny): z.ZodTypeAny {
	return schema instanceof z.ZodOptional
		? schema
		: withDescription(schema.optional(), schema);
}

/**
 * Applies {@link deepOptionalizeSchema} to either form `registerTool` accepts —
 * a `ZodObject` or a raw `{ key: ZodType }` shape — returning the same form.
 * A schema we cannot rewrite is left untouched; strict validation is a better
 * failure mode than a broken registration.
 */
function relaxOutputSchemaForProjection(outputSchema: unknown): unknown {
	try {
		if (outputSchema instanceof z.ZodType) {
			return deepOptionalizeSchema(outputSchema as z.ZodTypeAny);
		}
		if (outputSchema && typeof outputSchema === "object") {
			const relaxed: Record<string, z.ZodTypeAny> = {};
			for (const [key, value] of Object.entries(
				outputSchema as Record<string, z.ZodTypeAny>,
			)) {
				relaxed[key] = optionalize(deepOptionalizeSchema(value));
			}
			return relaxed;
		}
	} catch {
		// fall through
	}
	return outputSchema;
}

// ---------------------------------------------------------------------------
// createFilteringProxy — MCP server proxy that adds includeFields + filterBy
// ---------------------------------------------------------------------------

// Tool DESCRIPTIONS are always in the model's billed context (even for
// deferred tools behind hosted tool_search — only parameter schemas are
// deferred). Keep this suffix to one short line and put the usage docs +
// per-tool field-path catalog in the includeFields/filterBy PARAMETER
// descriptions instead, which cost nothing until the tool is loaded.
// (PERF_MASTER_PLAN P2 #4a — the old suffix + path list was 46% of the
// entire 131KB description surface.)
const FILTERING_DESCRIPTION_SUFFIX = `

Supports \`includeFields\` (field projection) and \`filterBy\` (row predicates) params to shrink large responses — see their parameter descriptions for usage and this tool's available field paths.`;

function applyFilteringToResult(
	result: CallToolResult,
	includeFields?: string[] | null,
	filterBy?: FilterCondition[] | null,
	groupBy?: string | null,
	protectedFields: string[] = [],
): CallToolResult {
	if (!includeFields?.length && !filterBy?.length && !groupBy) return result;

	// Re-add the cross-cutting keys plus whatever this tool declared, so a
	// projection can only ever narrow the rows the caller asked about.
	const effectiveIncludeFields = includeFields?.length
		? [...ALWAYS_PROTECTED_FIELDS, ...protectedFields, ...includeFields]
		: includeFields;

	const filteredContent = result.content.map((item) => {
		if (item.type !== "text") return item;
		try {
			// biome-ignore lint/suspicious/noExplicitAny: runtime JSON manipulation
			let parsed: any = JSON.parse(item.text);
			if (filterBy?.length) parsed = applyFilterBy(parsed, filterBy) ?? parsed;
			if (groupBy) parsed = applyGroupBy(parsed, groupBy) ?? parsed;
			if (effectiveIncludeFields?.length)
				parsed = filterIncludedFields(parsed, effectiveIncludeFields) ?? parsed;
			return { ...item, text: JSON.stringify(parsed) };
		} catch {
			return item;
		}
	});

	// biome-ignore lint/suspicious/noExplicitAny: runtime JSON manipulation
	let filteredStructured: any = result.structuredContent;
	if (filteredStructured) {
		if (filterBy?.length)
			filteredStructured =
				applyFilterBy(filteredStructured, filterBy) ?? filteredStructured;
		if (groupBy)
			filteredStructured =
				applyGroupBy(filteredStructured, groupBy) ?? filteredStructured;
		if (effectiveIncludeFields?.length)
			filteredStructured =
				filterIncludedFields(filteredStructured, effectiveIncludeFields) ??
				filteredStructured;
	}

	return {
		...result,
		content: filteredContent,
		structuredContent: filteredStructured,
	};
}

/**
 * Returns a Proxy over an McpServer that intercepts every `registerTool` call to:
 * 1. Inject `includeFields` and `filterBy` into the tool's inputSchema
 * 2. Append a description suffix explaining the filtering params
 * 3. Wrap the handler to apply filtering to the tool result
 * 4. Backstop results that would otherwise fail SDK output validation
 *
 * Tools whose names appear in `blacklist` are registered without modification.
 *
 * This means no individual tool needs to know about filtering — it is handled
 * transparently for all tools registered through this proxy.
 */
export function createFilteringProxy(
	server: McpServer,
	blacklist: Set<string> = new Set(),
): McpServer {
	return new Proxy(server, {
		get(target, prop, receiver) {
			if (prop !== "registerTool") {
				return Reflect.get(target, prop, receiver);
			}

			// biome-ignore lint/suspicious/noExplicitAny: proxy intercept
			return (name: string, config: any, handler: any) => {
				if (blacklist.has(name)) {
					return (target as any).registerTool(name, config, handler);
				}

				// Declared via protectFields() at the tool's own registration.
				const protectedFields: string[] = config?.[PROTECTED_FIELDS] ?? [];

				// Field-path catalog goes on the includeFields PARAM description
				// (deferred/unbilled until the tool is loaded), not the tool
				// description.
				let includeFieldsArg = INCLUDE_FIELDS_ARG;
				if (config.outputSchema) {
					try {
						let schema: z.ZodTypeAny;
						if (config.outputSchema instanceof z.ZodType) {
							schema = config.outputSchema;
						} else if (typeof config.outputSchema === "object") {
							schema = z.object(config.outputSchema);
						} else {
							schema = config.outputSchema;
						}
						const paths = zodToDotNotationPaths(schema);
						if (paths.length > 0) {
							const filteredPaths = [...new Set(paths.filter(
								(p) => p !== "requestType" && p !== "error" && p.trim() !== ""
							))].sort();
							if (filteredPaths.length > 0) {
								includeFieldsArg = z
									.array(z.string())
									.nullable()
									.describe(
										`${INCLUDE_FIELDS_DESCRIPTION}\n\nAvailable output field paths for this tool's includeFields / filterBy:\n` +
											filteredPaths.map((p) => `- "${p}"`).join("\n"),
									);
							}
						}
					} catch (error) {
						// Fall back to the base includeFields description on parsing failure
					}
				}

				const augmentedConfig = {
					...config,
					// Must come after the spread: the registered schema has to
					// tolerate the projection this proxy applies to the result.
					...(config.outputSchema
						? {
								outputSchema: relaxOutputSchemaForProjection(
									config.outputSchema,
								),
							}
						: {}),
					description:
						(config.description ?? "") + FILTERING_DESCRIPTION_SUFFIX,
					inputSchema: {
						...config.inputSchema,
						includeFields: includeFieldsArg,
						filterBy: FILTER_BY_ARG,
						groupBy: GROUP_BY_ARG,
					},
				};

				// biome-ignore lint/suspicious/noExplicitAny: proxy intercept
				const wrappedHandler = async (args: any, extra: unknown) => {
					const { includeFields, filterBy, groupBy, ...restArgs } = args;
					const result = await handler(restArgs, extra);
					return applyFilteringToResult(
						result,
						includeFields,
						filterBy,
						groupBy,
						protectedFields,
					);
				};

				// The marker is proxy-internal metadata; don't hand it to the SDK.
				delete augmentedConfig[PROTECTED_FIELDS];

				return (target as any).registerTool(
					name,
					augmentedConfig,
					wrappedHandler,
				);
			};
		},
	});
}
