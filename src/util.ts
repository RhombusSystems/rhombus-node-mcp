import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

export function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const RequestModifiers = z
  .object({
    headers: z.optional(z.record(z.string(), z.string())),
    query: z.optional(z.record(z.string(), z.string())),
  })
  .optional();
export type RequestModifiers = z.infer<typeof RequestModifiers>;

export type ToolExtra = {
  _meta?: {
    requestModifiers?: RequestModifiers;
  };
  sessionId?: string;
};

export function extractFromToolExtra(_extra: unknown) {
  const extra = _extra as ToolExtra;
  return {
    requestModifiers: extra._meta?.requestModifiers,
    sessionId: extra.sessionId,
  };
}

// ---------------------------------------------------------------------------
// Shared tool arg schemas
// ---------------------------------------------------------------------------

export const INCLUDE_FIELDS_ARG = z
  .array(z.string())
  .nullable()
  .describe(
    `Dot-notation field paths to include in the response (e.g. "vehicleEvents.vehicleLicensePlate").
Pass null to return all fields. WARNING: some responses can exceed 400k characters — use includeFields
to request only the data you need. For high-volume tools this may be required to get a complete answer.`
  );

export const FILTER_BY_ARG = z
  .array(
    z.object({
      field: z
        .string()
        .describe(
          "Dot-notation path within each array item to compare (e.g. 'vehicleLicensePlate', 'eventTimestamp')"
        ),
      op: z
        .enum(["=", "!=", ">", ">=", "<", "<=", "contains"])
        .describe("Comparison operator"),
      value: z
        .union([z.string(), z.number(), z.boolean()])
        .describe("Value to compare against"),
    })
  )
  .nullable()
  .describe(
    `Filter array items in the response by field values. All conditions are ANDed.
Example: [{field: "vehicleLicensePlate", op: "=", value: "ABC123"}, {field: "confidence", op: ">", value: 0.8}]
Use alongside includeFields to get only the specific records and fields you need.`
  );

export type FilterCondition = {
  field: string;
  op: "=" | "!=" | ">" | ">=" | "<" | "<=" | "contains";
  value: string | number | boolean;
};

/** These keys will always be included in processed output schemas */
const INCLUDE_WHITELIST = ["requestType"];

// ---------------------------------------------------------------------------
// File utilities
// ---------------------------------------------------------------------------

/**
 * Get all file paths in a directory in a directory
 *
 * i.e.
 * foo:
 *  - folder1:
 *    - har
 *    - gar
 *  - bar
 *  - lar
 *
 * returns: ["folder1/har", "folder1/gar", "bar", "lar"]
 */
export function getFilePathsInDirectory(dirPath: string): string[] {
  const filePaths: string[] = [];

  const fileNames = fs.readdirSync(dirPath);
  for (const fileName of fileNames) {
    const pathToAdd = path.join(dirPath, fileName);
    const stats = fs.lstatSync(pathToAdd);
    if (stats.isDirectory()) {
      filePaths.push(...getFilePathsInDirectory(pathToAdd));
    } else if (stats.isFile()) {
      filePaths.push(pathToAdd);
    }
  }

  return filePaths;
}

// ---------------------------------------------------------------------------
// Tool content helpers
// ---------------------------------------------------------------------------

/**
 * Returns an object in the form expected by `server.tool`
 */
export function createToolTextContent(content: string): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
}

/**
 * Returns structured content expected by `server.tool`.
 * Optionally applies programmatic field projection (includeFields) and
 * row filtering (filterBy) before serialising.
 *
 * The generic type T allows for type safety. Set T to the output schema of the
 * tool and your content will be type-checked.
 *
 * filterBy is applied first (prune rows), then includeFields (prune columns),
 * which minimises output size optimally.
 */
export function createToolStructuredContent<
  T extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  content: T,
  opts?: { includeFields?: string[] | null; filterBy?: FilterCondition[] | null }
): CallToolResult {
  // biome-ignore lint/suspicious/noExplicitAny: intentional runtime manipulation
  let result: any = content;
  if (opts?.filterBy?.length) {
    result = applyFilterBy(result, opts.filterBy) ?? result;
  }
  if (opts?.includeFields?.length) {
    result = filterIncludedFields(result, opts.includeFields) ?? result;
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result),
      },
    ],
    structuredContent: result,
  };
}

// ---------------------------------------------------------------------------
// removeNullFields
// ---------------------------------------------------------------------------

/**
 * Recursively removes fields with null values from a JavaScript object.
 * If a nested object becomes empty after removing nulls, it will also be removed.
 *
 * @param {unknown} obj The object or array to clean.
 * @returns {object | unknown[] | undefined} The cleaned object/array, or undefined if the input was null/undefined or an empty object/array resulted.
 */
export function removeNullFields(obj: unknown): object | unknown[] | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const cleanedArray: unknown[] = [];
    for (const item of obj) {
      const cleanedItem = removeNullFields(item);
      if (cleanedItem !== undefined) {
        cleanedArray.push(cleanedItem);
      }
    }
    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  if (typeof obj !== "object") {
    return obj as any; // Cast to any for primitive types
  }

  const cleanedObject: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as { [key: string]: unknown })[key];

      if (value === null) {
        continue;
      }

      if (typeof value === "object") {
        const cleanedValue = removeNullFields(value);
        if (cleanedValue !== undefined) {
          cleanedObject[key] = cleanedValue;
        }
      } else {
        cleanedObject[key] = value;
      }
    }
  }

  return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined;
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

function filterByTrie(obj: any, trie: Trie): any {
  // Empty trie at this level means "include everything"
  if (Object.keys(trie).length === 0) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const mapped = obj.map((item) => filterByTrie(item, trie)).filter((item) => item !== undefined);
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
    return obj.filter((item) => conditions.every((c) => matchesCondition(item, c)));
  }

  // For object payloads, group conditions by the top-level key so we know
  // which array in the payload each condition targets.
  const conditionsByTopKey: Record<string, FilterCondition[]> = {};
  for (const cond of conditions) {
    const dotIdx = cond.field.indexOf(".");
    // If the field has no dot, it's a direct property of the array item —
    // use the condition as-is against all array values in the object.
    const topKey = dotIdx === -1 ? "*" : cond.field.substring(0, dotIdx);
    const subField = dotIdx === -1 ? cond.field : cond.field.substring(dotIdx + 1);
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
            keyConds.every((c) => matchesCondition(item, c))
          );
        }
      }
    } else if (topKey in result && Array.isArray(result[topKey])) {
      result[topKey] = result[topKey].filter((item: any) =>
        keyConds.every((c) => matchesCondition(item, c))
      );
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
export function zodToDotNotationPaths(schema: z.ZodTypeAny, prefix = ""): string[] {
  // Unwrap optional / nullable / default
  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  ) {
    return zodToDotNotationPaths(schema.unwrap(), prefix);
  }
  if (schema instanceof z.ZodDefault) {
    return zodToDotNotationPaths((schema as any)._def.innerType, prefix);
  }

  // Recurse into ZodObject shape
  if (schema instanceof z.ZodObject) {
    const paths: string[] = [];
    for (const [key, value] of Object.entries(schema.shape as Record<string, z.ZodTypeAny>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      paths.push(fullKey);
      paths.push(...zodToDotNotationPaths(value, fullKey));
    }
    return paths;
  }

  // Recurse into ZodArray element
  if (schema instanceof z.ZodArray) {
    return zodToDotNotationPaths(schema.element, prefix);
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
// formatTimestamp
// ---------------------------------------------------------------------------

/**
 * Formats a timestamp in milliseconds to a human-readable date string
 * Format: "February 24, 2025 at 3:23 PM"
 *
 * @param timestampMs - Timestamp in milliseconds
 * @param timeZone - Optional IANA timezone string (defaults to "America/Los_Angeles")
 * @returns Formatted date string
 */
export function formatTimestamp(timestampMs: number, timeZone?: string): string {
  return DateTime.fromMillis(timestampMs)
    .setZone(timeZone || "America/Los_Angeles")
    .toFormat("MMMM d, yyyy 'at' h:mm:ss a", {
      locale: "en-US",
    });
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
  filterBy?: FilterCondition[] | null
): CallToolResult {
  if (!includeFields?.length && !filterBy?.length) return result;

  // include white-listed fields
  includeFields = includeFields?.length
    ? [...INCLUDE_WHITELIST, ...includeFields]
    : includeFields;

  const filteredContent = result.content.map((item) => {
    if (item.type !== "text") return item;
    try {
      // biome-ignore lint/suspicious/noExplicitAny: runtime JSON manipulation
      let parsed: any = JSON.parse(item.text);
      if (filterBy?.length) parsed = applyFilterBy(parsed, filterBy) ?? parsed;
      if (includeFields?.length) parsed = filterIncludedFields(parsed, includeFields) ?? parsed;
      return { ...item, text: JSON.stringify(parsed) };
    } catch {
      return item;
    }
  });

  // biome-ignore lint/suspicious/noExplicitAny: runtime JSON manipulation
  let filteredStructured: any = result.structuredContent;
  if (filteredStructured) {
    if (filterBy?.length) filteredStructured = applyFilterBy(filteredStructured, filterBy) ?? filteredStructured;
    if (includeFields?.length) filteredStructured = filterIncludedFields(filteredStructured, includeFields) ?? filteredStructured;
  }

  return { ...result, content: filteredContent, structuredContent: filteredStructured };
}

/**
 * Returns a Proxy over an McpServer that intercepts every `registerTool` call to:
 * 1. Inject `includeFields` and `filterBy` into the tool's inputSchema
 * 2. Append a description suffix explaining the filtering params
 * 3. Wrap the handler to apply filtering to the tool result
 *
 * This means no individual tool needs to know about filtering — it is handled
 * transparently for all tools registered through this proxy.
 */
export function createFilteringProxy(server: McpServer): McpServer {
  return new Proxy(server, {
    get(target, prop, receiver) {
      if (prop !== "registerTool") {
        return Reflect.get(target, prop, receiver);
      }

      // biome-ignore lint/suspicious/noExplicitAny: proxy intercept
      return function (name: string, config: any, handler: any) {
        const augmentedConfig = {
          ...config,
          description: (config.description ?? "") + FILTERING_DESCRIPTION_SUFFIX,
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

        return (target as any).registerTool(name, augmentedConfig, wrappedHandler);
      };
    },
  });
}
