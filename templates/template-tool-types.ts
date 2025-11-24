import { z } from "zod";
import { createUuidSchema } from "../types.js";

// TODO: rename this and add your request types
export enum MyToolRequestType {
  NOT_IMPLEMENTED = "not-implemented",
}

// TODO: change this type
export const MyType = z.object({
  // TODO: change this description
  uuid: createUuidSchema().describe("The UUID of the my type."),
});
export type MyType = z.infer<typeof MyType>;

export const TOOL_ARGS = {
  requestType: z.nativeEnum(MyToolRequestType).describe("The type of request to make."),
};
const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

export const OUTPUT_SCHEMA = z.object({
  // TODO: rename this and add your return type
  myData: MyType.optional().describe(
    `My type, as requested by the request type${MyToolRequestType.NOT_IMPLEMENTED}`
  ),
  error: z.string().optional().describe("An error message if the request failed."),
});
export type OUTPUT_SCHEMA = z.infer<typeof OUTPUT_SCHEMA>;
