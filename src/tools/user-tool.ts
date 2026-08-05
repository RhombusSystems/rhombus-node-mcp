import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  listUsers,
  findUserByEmail,
  getPermissionsForCurrentUser,
  getPermissionGroups,
  createUser,
  updateUser,
  deleteUser,
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
- ${UserToolRequestType.GET_PERMISSION_GROUPS}: List all permission groups defined in the organization. Each row can be very large — see below.
- ${UserToolRequestType.CREATE_USER}: Add a user to the organization. Requires userName, email and permissionGroupUuid. Sends them an invitation email unless suppressWelcomeEmail is true.
- ${UserToolRequestType.UPDATE_USER}: Change a user's name and/or role. Requires userUuid plus userName and/or permissionGroupUuid.
- ${UserToolRequestType.DELETE_USER}: Remove a user. Requires userUuid and confirmDelete.

Creating a user emails a real person and a role change alters what they can see across the organization, so confirm the name, email address and role NAME with the user before writing. Never guess a userUuid or permissionGroupUuid.

User UUIDs returned here can be used with the access-control-tool to look up credentials.

IMPORTANT for '${UserToolRequestType.GET_PERMISSION_GROUPS}':
Each permission group row includes five access maps whose size scales with the org's locations, devices, and other permission groups. The total payload for 'userPermissionGroupAccessMap' across all rows grows O(N^2) in the number of permission groups. Before calling, decide which fields you actually need and pass them via 'includeFields':
- Safe/small fields (O(1) per row): 'permissionGroups.uuid', 'permissionGroups.name', 'permissionGroups.description', 'permissionGroups.mutable', 'permissionGroups.superAdmin', 'permissionGroups.installer', 'permissionGroups.defaultPermissionForNewLocations', 'permissionGroups.defaultAccessControlPermissionForNewLocations'.
- Bounded fields (O(K) per row): 'permissionGroups.functionalityList', 'permissionGroups.accessibleLocations', 'permissionGroups.assignablePermissionGroups'.
- Heavy fields (O(locations) / O(devices) / O(groups) per row): 'permissionGroups.locationAccessMap', 'permissionGroups.accessControlLocationAccessMap', 'permissionGroups.deviceAccessMap', 'permissionGroups.userPermissionGroupAccessMap', 'permissionGroups.locationGranularAccessMap'. Only request these when you specifically need them for a user.
Typical usage when just picking a role uuid: 'includeFields: ["permissionGroups.uuid", "permissionGroups.name", "permissionGroups.description"]'.
`;

/** Users carry firstName/lastName, not a single name field. */
function displayName(user: { firstName?: string; lastName?: string }): string | undefined {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || undefined;
}

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
      case UserToolRequestType.CREATE_USER: {
        if (!args.userName?.trim() || !args.email?.trim() || !args.permissionGroupUuid) {
          return createToolTextContent(
            "userName, email and permissionGroupUuid are all required for create-user. Get role UUIDs from get-permission-groups."
          );
        }
        // A wrong role here silently over- or under-privileges a real person, so
        // verify the role exists rather than trusting the uuid.
        const permissionGroups = await getPermissionGroups(requestModifiers, sessionId);
        const role = permissionGroups.find(group => group.uuid === args.permissionGroupUuid);
        if (!role) {
          return createToolTextContent(
            `No permission group in this organization has the uuid "${args.permissionGroupUuid}". Use get-permission-groups to see the roles that exist — do not guess a role uuid, because it decides what the new user can see and do.`
          );
        }
        const existing = await findUserByEmail(args.email.trim(), requestModifiers, sessionId);
        if (existing?.uuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            user: existing,
            note: `Nothing was created — ${args.email.trim()} is already a user in this organization (${displayName(existing) ?? "no name"}). Use update-user to change their name or role.`,
          });
        }
        const created = await createUser(
          {
            name: args.userName.trim(),
            email: args.email.trim(),
            permissionGroupUuid: args.permissionGroupUuid,
            suppressWelcomeEmail: args.suppressWelcomeEmail ?? false,
          },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          created,
          warningMsg: created.warningMsg,
          note: `Created the user "${args.userName.trim()}" (${args.email.trim()}) with the role "${role.name ?? args.permissionGroupUuid}". ${args.suppressWelcomeEmail ? "No invitation email was sent, so they cannot sign in until invited." : "An invitation email has been sent to that address."}`,
        });
      }
      case UserToolRequestType.UPDATE_USER: {
        if (!args.userUuid) {
          return createToolTextContent("userUuid is required for update-user.");
        }
        if (!args.userName?.trim() && !args.permissionGroupUuid) {
          return createToolTextContent(
            "update-user needs at least one of userName or permissionGroupUuid — both were empty, so there is nothing to change."
          );
        }
        const users = await listUsers(requestModifiers, sessionId);
        const existing = users.find(user => user.uuid === args.userUuid);
        if (!existing) {
          return createToolTextContent(
            `No user in this organization has the uuid "${args.userUuid}". Use list-users or find-by-email to find them — do not guess a uuid.`
          );
        }
        let roleName: string | undefined;
        if (args.permissionGroupUuid) {
          const permissionGroups = await getPermissionGroups(requestModifiers, sessionId);
          const role = permissionGroups.find(group => group.uuid === args.permissionGroupUuid);
          if (!role) {
            return createToolTextContent(
              `No permission group in this organization has the uuid "${args.permissionGroupUuid}". Use get-permission-groups to see the roles that exist.`
            );
          }
          roleName = role.name ?? args.permissionGroupUuid;
        }
        const updated = await updateUser(
          args.userUuid,
          {
            name: args.userName?.trim() || undefined,
            permissionGroupUuid: args.permissionGroupUuid ?? undefined,
          },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated,
          warningMsg: updated.warningMsg,
          note: roleName
            ? `Updated ${displayName(existing) ?? args.userUuid}. Their role is now "${roleName}", which changes what they can see and do across the organization.`
            : `Renamed ${displayName(existing) ?? args.userUuid} to "${args.userName?.trim()}". Their role and access are unchanged.`,
        });
      }
      case UserToolRequestType.DELETE_USER: {
        if (!args.userUuid) {
          return createToolTextContent("userUuid is required for delete-user.");
        }
        const users = await listUsers(requestModifiers, sessionId);
        const existing = users.find(user => user.uuid === args.userUuid);
        if (!existing) {
          return createToolTextContent(
            `No user in this organization has the uuid "${args.userUuid}". Use list-users or find-by-email to find them.`
          );
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            user: existing,
            note:
              `NOT DELETED — nothing was changed. Deleting ${displayName(existing) ?? args.userUuid} (${existing.email ?? "no email"}) removes their ` +
              `console access and their access control credentials, and cannot be undone. If the intent is only to stop their door access, ` +
              `access-control-tool's suspend-credential is reversible. To delete the user, confirm with the user and call again with ` +
              `confirmDelete: true.`,
          });
        }
        const deleted = await deleteUser(args.userUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted,
          warningMsg: deleted.warningMsg,
          note: `Deleted the user ${displayName(existing) ?? args.userUuid} (${existing.email ?? "no email"}). They can no longer sign in, and their access control credentials no longer work.`,
        });
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
      title: "Users",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
