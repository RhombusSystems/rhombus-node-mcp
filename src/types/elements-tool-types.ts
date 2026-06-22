// The Honeywell Elements event search exposes the exact same filters and result shape as OnGuard
// (the backend uses one generalized DTO), so reuse the OnGuard Zod schemas verbatim rather than
// duplicating them. Re-exported here to keep the elements-* module naming convention parallel.
export {
  TOOL_ARGS,
  type ToolArgs,
  OnGuardEventSchema as ElementsEventSchema,
  OUTPUT_SCHEMA,
} from "./onguard-tool-types.js";
