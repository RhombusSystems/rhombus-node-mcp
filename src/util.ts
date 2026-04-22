import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { filterIncludedFields, applyFilterBy, type FilterCondition } from "./filtering-utils.js";

export { INCLUDE_FIELDS_ARG, FILTER_BY_ARG, FilterCondition, filterIncludedFields, applyFilterBy, zodToDotNotationPaths, createFilteringProxy } from "./filtering-utils.js";

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

/**
 * Formats a timestamp in milliseconds to an ISO 8601 string with timezone offset.
 * Format: "2025-04-21T10:57:00.000-07:00"
 *
 * Use this when returning timestamps in tool output schemas so the offset is preserved
 * (rather than the bare "Z" produced by Date.prototype.toISOString()).
 *
 * @param timestampMs - Timestamp in milliseconds
 * @param timeZone - Optional IANA timezone string (defaults to "America/Los_Angeles")
 * @returns ISO 8601 string with offset, or undefined if input is null/undefined
 */
export function formatIsoWithOffset(
  timestampMs: number | null | undefined,
  timeZone?: string
): string | undefined {
  if (timestampMs === null || timestampMs === undefined) return undefined;
  return (
    DateTime.fromMillis(timestampMs)
      .setZone(timeZone || "America/Los_Angeles")
      .toISO() ?? undefined
  );
}
