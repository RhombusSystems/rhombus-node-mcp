import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";

export const TOOL_ARGS = {
  eventType: z.enum(["access-control"]),
  startTime: z
    .string()
    .datetime( { message: "Invalid datetime string. Expected ISO 8601 format." } )
    .describe(
      "A timestamp representing when to start the search for access control events."
      + ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime( { message: "Invalid datetime string. Expected ISO 8601 format." } )
    .describe(
      "A timestamp representing when to end the search for access control events."
      + ISOTimestampFormatDescription
    ),
  accessControlledDoorUuid: z.string().nullable(),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
