import { z } from "zod";

export const TOOL_ARGS = {
  query: z.string().describe("The search query - what information are you looking for?"),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
