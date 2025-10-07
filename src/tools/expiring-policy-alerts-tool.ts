import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { ApiPayloadSchema, TOOL_ARGS, ToolArgs } from "../types/expiring-policy-alerts-tool-types.js";
import { getExpiringPolicyAlerts } from "../api/expiring-policy-alerts-tool-api.js";

const TOOL_NAME = "expiring-policy-alerts-tool";

const TOOL_DESCRIPTION = `
Retrieves policy alerts from the Rhombus system that are expiring before a specified timestamp. This tool helps identify policy alerts that will be automatically deleted from the system soon.

Policy alerts are notifications generated when certain conditions or events occur within the Rhombus security system, such as unauthorized access attempts, motion detection in restricted areas, or other security-related incidents.

This tool allows you to:
* Specify a timestamp before which policy alerts should expire using expiresBeforeISO (required).
* Control pagination using lastEvaluatedKey and maxPageSize parameters.

The tool returns a JSON object with the last evaluated key and the policy alerts that are expiring soon.
`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const payload = ApiPayloadSchema.parse(args);

  const result = await getExpiringPolicyAlerts(
    payload,
    extra._meta?.requestModifiers as RequestModifiers,
    extra.sessionId
  );

  return {
    content: [{ type: "text" as const, text: JSON.stringify(result) }],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
