import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared tool arg schemas
// ---------------------------------------------------------------------------

export const INCLUDE_FIELDS_ARG = z
	.array(z.string())
	.nullable()
	.describe(
		`Dot-notation field paths to include in the response (e.g. "vehicleEvents.vehicleLicensePlate").
Pass null to return all fields. WARNING: some responses can exceed 400k characters — use includeFields
to request only the data you need. For high-volume tools this may be required to get a complete answer.`,
	);

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

/** These keys will always be included in processed output schemas */
const INCLUDE_WHITELIST = ["requestType"];

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
	return filterByTrie(obj, trie);
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
	for (const [topKey, keyConds] of Object.entries(conditionsByTopKey)) {
		if (topKey === "*") {
			// Apply conditions to every top-level array in the object
			for (const k of Object.keys(result)) {
				if (Array.isArray(result[k])) {
					result[k] = result[k].filter((item: any) =>
						keyConds.every((c) => matchesCondition(item, c)),
					);
				}
			}
		} else if (topKey in result && Array.isArray(result[topKey])) {
			result[topKey] = result[topKey].filter((item: any) =>
				keyConds.every((c) => matchesCondition(item, c)),
			);
		}
	}

	// If the result has a sibling `count: number` and exactly one top-level
	// array, sync count to the (now-filtered) array length. This makes `count`
	// reflect what the model is looking at — pre-filter total when no filterBy
	// was applied (handler computed it), post-filter total when one was. Any
	// tool returning {count, items[]} gets this for free.
	if (typeof result.count === "number") {
		const arrayKeys = Object.keys(result).filter((k) => Array.isArray(result[k]));
		if (arrayKeys.length === 1) {
			result.count = result[arrayKeys[0]].length;
		}
	}

	return result;
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
// createFilteringProxy — MCP server proxy that adds includeFields + filterBy
// ---------------------------------------------------------------------------

const FILTERING_DESCRIPTION_SUFFIX = `

**Output filtering (all tools):**
- \`includeFields\` (string[]): Dot-notation paths to keep in the response (e.g. \`"vehicleEvents.vehicleLicensePlate"\`). Omit to return all fields.
- \`filterBy\` (array): Predicates to filter array items. Each entry: \`{field, op, value}\` where op is one of \`= != > >= < <= contains\`. All conditions are ANDed. Example: \`[{field:"vehicleLicensePlate", op:"=", value:"ABC123"}]\`
WARNING: some tool responses exceed 400k characters — use these params to request only the data you need.`;

function applyFilteringToResult(
	result: CallToolResult,
	includeFields?: string[] | null,
	filterBy?: FilterCondition[] | null,
): CallToolResult {
	if (!includeFields?.length && !filterBy?.length) return result;

	// Always include whitelisted fields
	const effectiveIncludeFields = includeFields?.length
		? [...INCLUDE_WHITELIST, ...includeFields]
		: includeFields;

	const filteredContent = result.content.map((item) => {
		if (item.type !== "text") return item;
		try {
			// biome-ignore lint/suspicious/noExplicitAny: runtime JSON manipulation
			let parsed: any = JSON.parse(item.text);
			if (filterBy?.length) parsed = applyFilterBy(parsed, filterBy) ?? parsed;
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

				const augmentedConfig = {
					...config,
					description:
						(config.description ?? "") + FILTERING_DESCRIPTION_SUFFIX,
					inputSchema: {
						...config.inputSchema,
						includeFields: INCLUDE_FIELDS_ARG,
						filterBy: FILTER_BY_ARG,
					},
				};

				// biome-ignore lint/suspicious/noExplicitAny: proxy intercept
				const wrappedHandler = async (args: any, extra: unknown) => {
					const { includeFields, filterBy, ...restArgs } = args;
					const result = await handler(restArgs, extra);
					return applyFilteringToResult(result, includeFields, filterBy);
				};

				return (target as any).registerTool(
					name,
					augmentedConfig,
					wrappedHandler,
				);
			};
		},
	});
}

