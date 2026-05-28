import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAllGuestsByOrg,
  getGuestActivityLogs,
  getActivitiesForLocation,
} from "../api/guest-management-tool-api.js";
import {
  GuestManagementRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/guest-management-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "guest-management-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus guest/visitor operations. It can list all guests, retrieve activity logs, and filter activities by location.

It has the following modes of operation, determined by the "requestType" parameter:
- ${GuestManagementRequestType.GET_ALL_GUESTS}: List all guests across the organization with their check-in status, host, company, and contact info.
- ${GuestManagementRequestType.GET_ACTIVITY_LOGS}: Get org-wide guest activity logs (sign-ins, sign-outs). Supports optional time range filtering via startTimeMs/endTimeMs.
- ${GuestManagementRequestType.GET_ACTIVITIES_FOR_LOCATION}: Get guest activity logs for a specific location. Requires locationUuid. Supports optional time range filtering.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case GuestManagementRequestType.GET_ALL_GUESTS: {
        const guests = await getAllGuestsByOrg(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ guests });
      }
      case GuestManagementRequestType.GET_ACTIVITY_LOGS: {
        const activities = await getGuestActivityLogs(
          args.startTimeMs ?? undefined,
          args.endTimeMs ?? undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ activities });
      }
      case GuestManagementRequestType.GET_ACTIVITIES_FOR_LOCATION: {
        if (!args.locationUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "locationUuid is required for get-activities-for-location.",
          });
        }
        const activities = await getActivitiesForLocation(
          args.locationUuid,
          args.startTimeMs ?? undefined,
          args.endTimeMs ?? undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ activities });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
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
