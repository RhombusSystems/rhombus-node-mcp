import { z } from "zod";
import { ISOTimestampFormatDescription } from "../utils/timestampInput.js";
import { schemas } from "./zod-schemas.js";

export const TOOL_ARGS = {
  eventType: z.enum(["access-control", "environmental-gateway"]),
  startTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format." })
    .describe(
      "A timestamp representing when to start the search for access control events." +
        ISOTimestampFormatDescription
    ),
  endTime: z
    .string()
    .datetime({ message: "Invalid datetime string. Expected ISO 8601 format." })
    .describe(
      "A timestamp representing when to end the search for access control events." +
        ISOTimestampFormatDescription
    ),
  accessControlledDoorUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the access controlled door. Required when eventType is 'access-control'."
    ),
  deviceUuid: z
    .string()
    .nullable()
    .describe(
      "The UUID of the environmental gateway device. Required when eventType is 'environmental-gateway'  Can be obtained from the get-entity-tool for ENVIRONMENTAL_GATEWAY."
    ),
};

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const ExtendedE50ClimateEventType = schemas.E50ClimateEventType.extend({
  timestampString: z.string().optional().describe("Human-readable formatted timestamp"),
});

export const OUTPUT_SCHEMA = z.object({
  eventType: z.enum(["access-control", "environmental-gateway"]).optional(),
  accessControlEvents: z.optional(
    z
      .object({
        componentEvents: z
          .array(
            z.object({
              authenticationResult: z.string().optional(),
              authorizationResult: z.string().optional(),
              doorUuid: z.string().optional(),
              locationUuid: z.string().optional(),
              credentials: z
                .array(
                  z.object({
                    credSource: z.string().optional(),
                    credentialId: z.string().optional(),
                    firstInEligible: z.boolean().optional(),
                    originator: z.string().optional(),
                  })
                )
                .optional(),
              originator: z.string().optional(),
              credentialUuid: z.string().optional(),
              credSource: z.string().optional(),
              datetime: z.string().optional(),
            })
          )
          .optional(),
      })
      .nullable()
      .describe("Access control events data including badge ins, credentials, arrivals, etc.")
  ),
  environmentalGatewayEvents: z.optional(
    z
      .object({
        events: z.array(ExtendedE50ClimateEventType).optional(),
        lastEvaluatedKey: z.string().optional(),
      })
      .nullable()
      .describe("Environmental gateway events data including sensor readings and derived values")
  ),
  needUserInput: z.boolean().optional(),
  commandForUser: z.string().optional(),
});
