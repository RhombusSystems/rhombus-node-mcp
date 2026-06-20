// Identical arg/output shapes to the OnGuard badge-timeline tool (same generalized backend), so reuse
// the OnGuard Zod schemas verbatim. Re-exported to keep the elements-* module naming convention parallel.
export {
  TOOL_ARGS,
  type ToolArgs,
  BadgeTimelineStopSchema,
  OUTPUT_SCHEMA,
} from "./badge-timeline-tool-types.js";
