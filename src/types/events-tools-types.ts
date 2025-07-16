import { z } from "zod";

export const TOOL_ARGS = {
  eventType: z.enum(["faces", "people", "human", "access-control"]),
  cameraUuids: z
    .optional(z.array(z.string()))
    .describe("The list of camera uuids to be used to search for events."),
  startTime: z
    .optional(z.number())
    .describe("A timestamp in milliseconds in the past to begin the event search from"),
  createdAfterMs: z
    .optional(z.number())
    .describe(
      "A timestamp in milliseconds representing the start or earliest time of access controll events."
    ),
  createdBeforeMs: z
    .optional(z.number())
    .describe(
      "A timestamp in milliseconds representing the end or latest time of access controll events."
    ),
  duration: z
    .optional(z.number())
    .describe("A time stamp in milliseconds for the duration of the search window"),
  accessControlledDoorUuid: z.optional(z.string()),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;
