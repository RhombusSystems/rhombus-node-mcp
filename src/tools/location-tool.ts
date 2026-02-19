import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestModifiers } from "../util.js";
import { getLocations, createLocation, updateLocation, getLocationLabels } from "../api/location-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/location-tool-types.js";

const TOOL_NAME = "location-tool";
const TOOL_DESCRIPTION = `This tool performs operations on locations.
- 'get': Retrieves all locations.  When generating reports with location details, use location names not uuids.
- 'create': Creates a new location with a name and optional address.
- 'update': Updates an existing location (requires locationUuid).
- 'get-labels': Retrieves all location labels for the organization.`;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { action } = args;
  let ret;
  switch (action) {
    case "get":
      ret = await getLocations(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      break;
    case "create": {
      if (!args.locationName) {
        ret = { error: true, status: "locationName is required for 'create'" };
        break;
      }
      ret = await createLocation(args.locationName, args.locationAddress ?? undefined, extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      break;
    }
    case "update": {
      if (!args.locationUuid) {
        ret = { error: true, status: "locationUuid is required for 'update'" };
        break;
      }
      ret = await updateLocation(args.locationUuid, args.locationUpdate?.name, args.locationAddress ?? undefined, extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      break;
    }
    case "get-labels":
      ret = await getLocationLabels(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);
      break;
    default:
      ret = { error: true, status: `unsupported location tool call: ${action}` };
      break;
  }

  return {
    content: [{ type: "text" as const, text: JSON.stringify(ret) }],
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
