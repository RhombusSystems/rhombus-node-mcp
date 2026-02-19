import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  unlockDoor,
  getAccessControlGroups,
  getCredentialsByUser,
  getLockdownPlans,
  activateLockdown,
  deactivateLockdown,
  getDoorScheduleExceptions,
  getAccessGrants,
} from "../api/access-control-tool-api.js";
import {
  AccessControlRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/access-control-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "access-control-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus access control operations including door unlocking, access groups, credentials, lockdown plans, door schedules, and access grants.

It has the following modes of operation, determined by the "requestType" parameter:
- ${AccessControlRequestType.UNLOCK_DOOR}: Remotely unlock an access controlled door. Requires doorUuid.
- ${AccessControlRequestType.GET_GROUPS}: List all access control groups in the organization.
- ${AccessControlRequestType.GET_CREDENTIALS_BY_USER}: List all access control credentials for a specific user. Requires userUuid.
- ${AccessControlRequestType.GET_LOCKDOWN_PLANS}: List all lockdown plans in the organization.
- ${AccessControlRequestType.ACTIVATE_LOCKDOWN}: Activate a lockdown plan at a location. Requires locationUuid and lockdownPlanUuid.
- ${AccessControlRequestType.DEACTIVATE_LOCKDOWN}: Deactivate a lockdown plan at a location. Requires locationUuid and lockdownPlanUuid.
- ${AccessControlRequestType.GET_DOOR_SCHEDULES}: Get door schedule exceptions for a location. Requires locationUuid.
- ${AccessControlRequestType.GET_ACCESS_GRANTS}: List all location access grants in the organization.

Use the get-entity-tool with entityType ACCESS_CONTROL_DOOR to get door UUIDs.
Use the user-tool to look up user UUIDs.
Use the location-tool to get location UUIDs.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case AccessControlRequestType.UNLOCK_DOOR: {
        if (!args.doorUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "doorUuid is required for unlock-door." })
          );
        }
        const unlockResult = await unlockDoor(args.doorUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ unlockResult });
      }
      case AccessControlRequestType.GET_GROUPS: {
        const accessControlGroups = await getAccessControlGroups(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ accessControlGroups });
      }
      case AccessControlRequestType.GET_CREDENTIALS_BY_USER: {
        if (!args.userUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "userUuid is required for get-credentials-by-user." })
          );
        }
        const credentials = await getCredentialsByUser(args.userUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ credentials });
      }
      case AccessControlRequestType.GET_LOCKDOWN_PLANS: {
        const lockdownPlans = await getLockdownPlans(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ lockdownPlans });
      }
      case AccessControlRequestType.ACTIVATE_LOCKDOWN: {
        if (!args.locationUuid || !args.lockdownPlanUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "locationUuid and lockdownPlanUuid are required for activate-lockdown." })
          );
        }
        const lockdownResult = await activateLockdown(
          args.locationUuid, args.lockdownPlanUuid, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ lockdownResult });
      }
      case AccessControlRequestType.DEACTIVATE_LOCKDOWN: {
        if (!args.locationUuid || !args.lockdownPlanUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "locationUuid and lockdownPlanUuid are required for deactivate-lockdown." })
          );
        }
        const lockdownResult = await deactivateLockdown(
          args.locationUuid, args.lockdownPlanUuid, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ lockdownResult });
      }
      case AccessControlRequestType.GET_DOOR_SCHEDULES: {
        if (!args.locationUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "locationUuid is required for get-door-schedules." })
          );
        }
        const doorScheduleExceptions = await getDoorScheduleExceptions(
          args.locationUuid, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ doorScheduleExceptions });
      }
      case AccessControlRequestType.GET_ACCESS_GRANTS: {
        const accessGrants = await getAccessGrants(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ accessGrants });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent({ error: "Invalid request type" });
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
