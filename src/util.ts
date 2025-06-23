import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

export function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const STATIC_ARGS = {
  requestModifiers: z
    .optional(
      z.object({
        headers: z.nullable(z.record(z.string(), z.string())),
        query: z.nullable(z.record(z.string(), z.string())),
      })
    )
    .describe("Optional headers accepted by tools.  LLM should never ever use this. 😅"),
};
export type RequestModifiers = z.infer<(typeof STATIC_ARGS)["requestModifiers"]>;

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

export function createToolArgs<TArgs extends object>(args: TArgs): TArgs & typeof STATIC_ARGS {
  return {
    ...args,
    ...STATIC_ARGS,
  };
}

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