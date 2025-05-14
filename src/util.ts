import { z } from "zod";

const STATIC_ARGS = {
  requestModifiers: z
    .optional(
      z.object({
        headers: z.optional(z.any()),
        query: z.optional(z.any()),
      })
    )
    .describe("Optional headers accepted by tools.  LLM should never ever use this. 😅"),
};

export function createToolArgs<TArgs extends object>(args: TArgs): TArgs & typeof STATIC_ARGS {
  return {
    ...args,
    ...STATIC_ARGS,
  };
}

/**
 * Returns an object in the form expected by `server.tool`
 */
export function createToolTextContent(content: string) {
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
}