import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const STATIC_ARGS = {
  requestModifiers: z
    .nullable(
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
    const pathToAdd = path.join(dirPath, fileName)
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
