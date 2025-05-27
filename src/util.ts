import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const STATIC_ARGS = {
  requestModifiers: z
    .optional(
      z.object({
        headers: z.optional(z.record(z.string(), z.string())),
        query: z.optional(z.record(z.string(), z.string())),
      })
    )
    .describe("Optional headers accepted by tools.  LLM should never ever use this. 😅"),
};
export type RequestModifiers = z.infer<(typeof STATIC_ARGS)["requestModifiers"]>;

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
