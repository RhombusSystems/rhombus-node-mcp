import { z } from 'zod';

export const ISOTimestampFormatDescription = 'Time format is in ISO 8601 format. Both UTC ("2025-08-04T20:54:27.123Z") and time zone offsets ("2025-08-04T13:54:27.123-07:00") are accepted to ensure an unambiguous point in time.';

export const createEpochSchema = () => {
  return z.coerce
    .date({
      error: "Invalid datetime string. Expected ISO 8601 format.",
    })
    .transform((date) => date.getTime());
};