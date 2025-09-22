import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { getPolicyAlerts } from "../api/policy-alerts-tool-api.js";
import {
  ApiPayloadSchema,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/policy-alerts-tool-types.js";

const TOOL_NAME = "policy-alerts-tool";
const TOOL_DESCRIPTION = `
Retrieves Rhombus policy alerts. Policy alerts in the Rhombus system are generated based on user-defined alert
policies configured in the Rhombus Console. These policies trigger alerts when specific events occur, such as:
* AI & Computer Vision Events: Based on intelligent video analytics for motion, people, vehicles, facial recognition,
  license plate recognition, or unusual behavior.
* Device Status Changes: Like camera disconnections or sensor low battery.
* Physical or Visual Tamper: Detection of physical movement of a device or obstruction of a camera's field of view.
* Access Control Events: Such as unauthorized access attempts in restricted areas.

Please note, this is not an exhaustive list, and there may be other types of triggers or events that generate
policy alerts within the Rhombus system.

This tool allows you to filter existing alerts by a specific time range (before or after a timestamp in ISO 8601 format),
by a list of device UUIDs, or by a list of location UUIDs.
You can also specify the maximum number of results to return.
The output is provided in JSON format.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const payload = ApiPayloadSchema.parse(args);

  const ret = await getPolicyAlerts(
    payload,
    extra._meta?.requestModifiers as RequestModifiers,
    extra.sessionId
  );

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
    structuredContent: ret,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
