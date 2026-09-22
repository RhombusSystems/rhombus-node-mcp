// Identical arg/output shapes to the OnGuard lost-badge tool (same generalized backend), so reuse the
// OnGuard Zod schemas verbatim. Re-exported to keep the elements-* module naming convention parallel.
export {
  TOOL_ARGS,
  type ToolArgs,
  LostBadgeIncidentSchema,
  OUTPUT_SCHEMA,
} from "./lost-badge-tool-types.js";
