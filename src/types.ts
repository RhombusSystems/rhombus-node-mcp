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