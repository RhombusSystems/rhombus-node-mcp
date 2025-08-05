import { z } from 'zod';

export const ISOTimestampFormatDescription = 'Time format is in ISO 8601 format. Both UTC ("2025-08-04T20:54:27.123Z") and time zone offsets ("2025-08-04T13:54:27.123-07:00") are accepted to ensure an unambiguous point in time.';

export const createEpochSchema = () => {
  return z.coerce.date({
      errorMap: (issue, ctx) => {
          if (issue.code === 'invalid_date') {
              return { message: 'Invalid datetime string. Expected ISO 8601 format.' };
          }
          return { message: ctx.defaultError };
      },
  }).transform(date => date.getTime());
};