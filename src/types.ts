import { z } from "zod";
export const CreateVideoWallOptions = z.nullable(
  z.object({
    displayName: z.nullable(z.string()).describe("What to call the video wall"),
    orgUuid: z.string().describe("The uuid of the organization"),
    deviceList: z
      .array(z.string())
      .min(1)
      .describe(
        "The list of camera uuids (unique identifiers) to exist in the video wall.  You must provide this manually by prompting the user at least once."
      ),
    othersCanEdit: z
      .nullable(z.boolean())
      .describe("Whether or not other users can edit the wall, defaults to false"),
    settings: z.object({
      rowCount: z.number(),
      columnCount: z.number(),
      intervalSeconds: z.nullable(z.number()),
      rotateStrategy: z.enum(["none", "motion", "interval"]),
    }),
  })
);
export type CreateVideoWallOptionsT = z.infer<typeof CreateVideoWallOptions>;
