import { z } from "zod";

export function createUuidSchema() {
  return z
    .string()
    .length(22)
    // .regex(/[A-Za-z0-9\\-_]{22}/)
    .describe(
      `This describes the UUID of some entity (device, location, etc.) and is unique and must come from data.
      This can not be fabricated. It is always 22 characters long. Truncate any facet ids, such as .v0.
      It contains only alphanumeric characters, digits, hyphens, and underscores.`);
}

export const UUID = createUuidSchema();
export type UUID = z.infer<typeof UUID>;

export const VideoWallSettings = z.object({
  rowCount: z.number(),
  columnCount: z.number(),
  intervalSeconds: z.number().nullable(),
  rotateStrategy: z.enum(["none", "motion", "interval"]),
});
export const CreateVideoWallOptions = z
  .object({
    displayName: z.string().nullable().describe("What to call the video wall"),
    orgUuid: z.string().describe("The uuid of the organization"),
    deviceList: z
      .array(z.string())
      .min(1)
      .describe(
        "The list of camera uuids (unique identifiers) to exist in the video wall.  You must provide this manually by prompting the user at least once."
      ),
    othersCanEdit: z
      .boolean()
      .nullable()
      .describe("Whether or not other users can edit the wall, defaults to false"),
    settings: VideoWallSettings,
  })
  .nullable();
export type CreateVideoWallOptionsT = z.infer<typeof CreateVideoWallOptions>;
