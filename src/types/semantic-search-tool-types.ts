import { z } from "zod";

export const TOOL_ARGS = {
  query: z
    .string()
    .describe(
      "Natural-language query to search the Rhombus knowledge base (documentation, support articles, product information)."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
