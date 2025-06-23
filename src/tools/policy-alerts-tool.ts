import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { postApi } from "../network.js";
import { createToolArgs } from "../util.js";

const PolicyAlertsArgs = z.object({
  afterTimestampMs: z
    .number()
    .optional()
    .describe(
      "The start of the time range (in milliseconds since epoch) for which to retrieve alerts. Only alerts that occurred AFTER this timestamp will be returned."
    ),
  beforeTimestampMs: z
    .number()
    .optional()
    .describe(
      "The end of the time range (in milliseconds since epoch) for which to retrieve alerts. Only alerts that occurred BEFORE this timestamp will be returned."
    ),
  deviceFilter: z
    .array(z.string())
    .optional()
    .describe(
      "A list of UUIDs representing the specific devices to filter alerts by. Only alerts emitted by these devices will be returned."
    ),
  locationFilter: z
    .array(z.string())
    .optional()
    .describe(
      "A list of UUIDs representing the specific locations to filter alerts by. Only alerts associated with these locations will be returned."
    ),
  maxResults: z
    .number()
    .optional()
    .describe(
      "The maximum number of policy alerts to return. The system may default to a reasonable number (e.g., 20) if not specified, but there is a hard cap (e.g., 100) on the maximum results the API will return."
    ),

  // these may be pagination args, we'll leave them out for now
  // lastTimestampMs: z.number().optional(),
  // lastUuid: z.number().optional(),
});
type PolicyAlertsArgs = z.infer<typeof PolicyAlertsArgs>;

async function getPolicyAlerts(args: PolicyAlertsArgs, requestModifiers?: any) {
  return await postApi("/event/getPolicyAlertsV2", args, requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "policy-alerts-tool",
    `
Retrieves Rhombus policy alerts. Policy alerts in the Rhombus system are generated based on user-defined alert
policies configured in the Rhombus Console. These policies trigger alerts when specific events occur, such as:
* AI & Computer Vision Events: Based on intelligent video analytics for motion, people, vehicles, facial recognition,
  license plate recognition, or unusual behavior.
* Device Status Changes: Like camera disconnections or sensor low battery.
* Physical or Visual Tamper: Detection of physical movement of a device or obstruction of a camera's field of view.
* Access Control Events: Such as unauthorized access attempts in restricted areas.

Please note, this is not an exhaustive list, and there may be other types of triggers or events that generate
policy alerts within the Rhombus system.

This tool allows you to filter existing alerts by a specific time range (before or after a timestamp in milliseconds),
by a list of device UUIDs, or by a list of location UUIDs.
You can also specify the maximum number of results to return.
The output is provided in JSON format.`,
    createToolArgs({
      ...PolicyAlertsArgs.shape,
    }),
    async ({ requestModifiers, ...args }) => {
      let ret;
      ret = await getPolicyAlerts(args, requestModifiers);

      return {
        content: [{ type: "text", text: JSON.stringify(ret) }],
      };
    }
  );
}
