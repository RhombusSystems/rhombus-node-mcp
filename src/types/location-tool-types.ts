import { z } from "zod";

export const TOOL_ARGS = {
  action: z
    .enum(["get", "update", "create", "get-labels"])
    .describe(
      "'get' = list all locations; 'create' = create a location (requires locationName); 'update' = update a location's name/address (requires locationUuid); 'get-labels' = list all location labels for the org."
    ),
  locationUpdate: z
    .object({
      uuid: z.string().describe("Ignored — pass the location's UUID via the top-level locationUuid arg instead."),
      name: z.string().describe("The new name for the location."),
    })
    .nullable()
    .describe("For 'update' only: the new values to apply. Only 'name' is used; the location is identified by the top-level locationUuid arg."),
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
