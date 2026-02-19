import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  listUsers,
  findUserByEmail,
  getPermissionsForCurrentUser,
  getPermissionGroups,
} from "../api/user-tool-api.js";
import {
  UserToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/user-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "user-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus user operations including listing users, finding users by email, and viewing permissions.

It has the following modes of operation, determined by the "requestType" parameter:
- ${UserToolRequestType.LIST_USERS}: List all users in the organization with their details and roles.
- ${UserToolRequestType.FIND_BY_EMAIL}: Find a specific user by their email address. Requires the email parameter.
- ${UserToolRequestType.GET_PERMISSIONS}: Get the permissions for the current API user/token.
- ${UserToolRequestType.GET_PERMISSION_GROUPS}: List all permission groups defined in the organization.

User UUIDs returned here can be used with the access-control-tool to look up credentials.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case UserToolRequestType.LIST_USERS: {
        const users = await listUsers(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ users });
      }
      case UserToolRequestType.FIND_BY_EMAIL: {
        if (!args.email) {
          return createToolTextContent(
            JSON.stringify({ error: "email is required for find-by-email." })
          );
        }
        const user = await findUserByEmail(args.email, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ user });
      }
      case UserToolRequestType.GET_PERMISSIONS: {
        const permissions = await getPermissionsForCurrentUser(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ permissions });
      }
      case UserToolRequestType.GET_PERMISSION_GROUPS: {
        const permissionGroups = await getPermissionGroups(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ permissionGroups });
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
