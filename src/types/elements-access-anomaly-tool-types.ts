// Identical arg/output shapes to the OnGuard access-anomaly tool (same generalized backend), so reuse
// the OnGuard Zod schemas verbatim. Re-exported to keep the elements-* module naming convention parallel.
export {
  ANOMALY_RULES,
  TOOL_ARGS,
  type ToolArgs,
  AnomalyFindingSchema,
  OUTPUT_SCHEMA,
} from "./access-anomaly-tool-types.js";
