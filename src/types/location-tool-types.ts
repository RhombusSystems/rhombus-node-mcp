import { z } from "zod";

export const TOOL_ARGS = {
  action: z.enum(["get", "update", "create", "get-labels"]),
  locationUpdate: z
    .object({
      uuid: z.string(),
      name: z.string(),
    })
    .nullable(),
  locationName: z.string().nullable().describe("Name for the new location. Required for 'create'."),
  locationAddress: z.string().nullable().describe("Address for the location. Optional for 'create' and 'update'."),
  locationUuid: z.string().nullable().describe("UUID of the location. Required for 'update'."),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  createdLocation: z.object({ uuid: z.string().optional(), success: z.boolean().optional() }).optional(),
  updatedLocation: z.object({ success: z.boolean().optional() }).optional(),
  locationLabels: z.array(z.object({ uuid: z.string().optional(), name: z.string().optional() })).optional(),
  error: z.string().optional(),
});
