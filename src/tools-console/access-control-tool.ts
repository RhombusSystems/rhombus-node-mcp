import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  unlockDoor,
  getAccessControlGroups,
  createAccessControlGroup,
  updateAccessControlGroup,
  deleteAccessControlGroup,
  changeAccessControlGroupMembers,
  getCredentialsByUser,
  assignCredential,
  changeCredentialState,
  updateCredentialNote,
  getLockdownPlans,
  renameLockdownPlan,
  deleteLockdownPlan,
  activateLockdown,
  deactivateLockdown,
  getDoorScheduleExceptions,
  getAccessGrants,
  writeAccessGrant,
  deleteAccessGrant,
  getRemoteUnlockUsers,
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
- ${AccessControlRequestType.GET_DOOR_SCHEDULES}: Get door schedule EXCEPTIONS for a location (despite the name, this does not list schedules). Requires locationUuid. For anything more than a location-scoped list use door-schedule-exception-tool; for the schedules themselves use schedule-tool.
- ${AccessControlRequestType.GET_ACCESS_GRANTS}: List location access grants (physical badge/card access). Optionally accepts locationUuid to filter by location. Each grant includes userUuids (directly assigned users), groupUuids (assigned access control groups), and doorUuids (the doors this grant provides access to).
- ${AccessControlRequestType.GET_REMOTE_UNLOCK_USERS}: Get all users who have permission to remotely unlock doors at a location. Requires locationUuid. Returns a list of doors with remote unlock enabled and the users who can unlock each door, based on their permission group roles. This is the correct tool for questions about remote unlock permissions.

Write operations — every one of these changes who can physically open a door:
- ${AccessControlRequestType.CREATE_GROUP}: Create an access control group. Requires groupName; optionally groupDescription and userUuids.
- ${AccessControlRequestType.UPDATE_GROUP}: Rename or re-describe a group. Requires groupUuid plus groupName and/or groupDescription.
- ${AccessControlRequestType.DELETE_GROUP}: Delete a group. Requires groupUuid and confirmDelete.
- ${AccessControlRequestType.ADD_USERS_TO_GROUP} / ${AccessControlRequestType.REMOVE_USERS_FROM_GROUP}: Change group membership. Requires groupUuid and userUuids.
- ${AccessControlRequestType.ASSIGN_CREDENTIAL}: Attach an existing unassigned badge/fob to a user. Requires credentialHexValue and userUuid.
- ${AccessControlRequestType.SUSPEND_CREDENTIAL} / ${AccessControlRequestType.UNSUSPEND_CREDENTIAL}: Temporarily disable / re-enable a credential. Requires credentialUuid. Reversible — prefer this for a lost badge that may turn up.
- ${AccessControlRequestType.REVOKE_CREDENTIAL}: Detach a credential from its user, keeping the credential record. Requires credentialUuid.
- ${AccessControlRequestType.DELETE_CREDENTIAL}: Destroy the credential record entirely. Requires credentialUuid and confirmDelete. Not reversible — suspend or revoke instead unless the user asked for permanent deletion.
- ${AccessControlRequestType.UPDATE_CREDENTIAL_NOTE}: Set a credential's note. Requires credentialUuid and credentialNote.
- ${AccessControlRequestType.CREATE_ACCESS_GRANT}: Grant access to doors. Requires accessGrantName, locationUuid and doorUuids; optionally userUuids, groupUuids, scheduleUuid.
- ${AccessControlRequestType.UPDATE_ACCESS_GRANT}: Change a grant. Requires accessGrantUuid. doorUuids / userUuids / groupUuids REPLACE the existing lists when passed.
- ${AccessControlRequestType.DELETE_ACCESS_GRANT}: Delete a grant, removing that access. Requires accessGrantUuid and confirmDelete.
- ${AccessControlRequestType.RENAME_LOCKDOWN_PLAN}: Rename a lockdown plan. Requires lockdownPlanUuid and groupName. The plan's door states and activation steps cannot be authored through this tool — that is deliberate, since a wrong door state during a lockdown is a life-safety issue. Direct the user to the Rhombus Console for those.
- ${AccessControlRequestType.DELETE_LOCKDOWN_PLAN}: Delete a lockdown plan. Requires lockdownPlanUuid and confirmDelete.

Before any write, name the specific people and doors affected and get the user's confirmation. Never guess a user, door, group or credential UUID: a plausible-but-wrong UUID here silently grants or removes physical access, and nothing in the response will reveal it.

Use the get-entity-tool with entityType ACCESS_CONTROL_DOOR to get door UUIDs.
Use the user-tool to look up user UUIDs and resolve them to names/emails.
Use the location-tool to get location UUIDs.
Use the schedule-tool to get schedule UUIDs.
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
        const accessGrants = await getAccessGrants(args.locationUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ accessGrants });
      }
      case AccessControlRequestType.GET_REMOTE_UNLOCK_USERS: {
        if (!args.locationUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "locationUuid is required for get-remote-unlock-users." })
          );
        }
        const remoteUnlockUsers = await getRemoteUnlockUsers(
          args.locationUuid, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ remoteUnlockUsers });
      }

      // ---------------------------------------------------------------------
      // Access control groups
      // ---------------------------------------------------------------------
      case AccessControlRequestType.CREATE_GROUP: {
        if (!args.groupName?.trim()) {
          return createToolTextContent("groupName is required for create-group.");
        }
        const created = await createAccessControlGroup(
          args.groupName.trim(),
          args.groupDescription ?? undefined,
          args.userUuids ?? [],
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          created,
          note: `Created the access control group "${args.groupName.trim()}" with ${created.memberCount} member(s). A group grants no access on its own — attach it to an access grant with create-access-grant or update-access-grant.`,
        });
      }
      case AccessControlRequestType.UPDATE_GROUP: {
        if (!args.groupUuid) {
          return createToolTextContent("groupUuid is required for update-group.");
        }
        if (!args.groupName?.trim() && !args.groupDescription?.trim()) {
          return createToolTextContent(
            "update-group needs at least one of groupName or groupDescription — both were empty, so there is nothing to change."
          );
        }
        const groups = await getAccessControlGroups(requestModifiers, sessionId);
        const existing = groups.find(group => group.uuid === args.groupUuid);
        if (!existing) {
          return createToolTextContent(
            `No access control group in this organization has the uuid "${args.groupUuid}". Use get-groups to see the groups that exist — do not guess a uuid.`
          );
        }
        const updated = await updateAccessControlGroup(
          args.groupUuid,
          {
            name: args.groupName?.trim() || existing.name,
            description: args.groupDescription?.trim() || existing.description,
          },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated,
          note: `Updated the access control group "${args.groupName?.trim() || existing.name || args.groupUuid}". Its membership and the access it confers are unchanged.`,
        });
      }
      case AccessControlRequestType.DELETE_GROUP: {
        if (!args.groupUuid) {
          return createToolTextContent("groupUuid is required for delete-group.");
        }
        const groups = await getAccessControlGroups(requestModifiers, sessionId);
        const existing = groups.find(group => group.uuid === args.groupUuid);
        if (!existing) {
          return createToolTextContent(
            `No access control group in this organization has the uuid "${args.groupUuid}". Use get-groups to see the groups that exist.`
          );
        }
        if (!args.confirmDelete) {
          const memberCount = existing.userUuids?.length ?? 0;
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            accessControlGroups: [existing],
            note:
              `NOT DELETED — nothing was changed. Deleting the group "${existing.name ?? args.groupUuid}" removes it from every access ` +
              `grant that uses it, so its ${memberCount} member(s) lose whatever door access the group provided. Tell the user which ` +
              `people are affected, then call this tool again with confirmDelete: true.`,
          });
        }
        const deleted = await deleteAccessControlGroup(
          args.groupUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted,
          note: `Deleted the access control group "${existing.name ?? args.groupUuid}". Its members lose any door access that came from this group.`,
        });
      }
      case AccessControlRequestType.ADD_USERS_TO_GROUP:
      case AccessControlRequestType.REMOVE_USERS_FROM_GROUP: {
        const removing =
          args.requestType === AccessControlRequestType.REMOVE_USERS_FROM_GROUP;
        if (!args.groupUuid) {
          return createToolTextContent(`groupUuid is required for ${args.requestType}.`);
        }
        if (!args.userUuids?.length) {
          return createToolTextContent(
            `userUuids is required for ${args.requestType} and must contain at least one user UUID. Resolve names to UUIDs with user-tool first.`
          );
        }
        const groups = await getAccessControlGroups(requestModifiers, sessionId);
        const existing = groups.find(group => group.uuid === args.groupUuid);
        if (!existing) {
          return createToolTextContent(
            `No access control group in this organization has the uuid "${args.groupUuid}". Use get-groups to see the groups that exist.`
          );
        }
        const updated = await changeAccessControlGroupMembers(
          args.groupUuid,
          args.userUuids,
          removing ? "remove" : "add",
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated,
          note: `${removing ? "Removed" : "Added"} ${updated.userCount} user(s) ${removing ? "from" : "to"} "${existing.name ?? args.groupUuid}". They ${removing ? "lose" : "gain"} every door this group's access grants cover. Confirm the specific people with the user by name.`,
        });
      }

      // ---------------------------------------------------------------------
      // Credentials
      // ---------------------------------------------------------------------
      case AccessControlRequestType.ASSIGN_CREDENTIAL: {
        if (!args.credentialHexValue?.trim() || !args.userUuid) {
          return createToolTextContent(
            "credentialHexValue and userUuid are both required for assign-credential."
          );
        }
        const result = await assignCredential(
          args.credentialHexValue.trim(),
          args.userUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          credentialChange: {
            success: result.success,
            userUuid: result.userUuid,
            action: "assign",
          },
          warningMsg: result.warningMsg,
          note: `Assigned credential ${args.credentialHexValue.trim()} to the user. The credential opens whatever doors that user's access grants cover — confirm the user's name and their access with get-access-grants if it matters.`,
        });
      }
      case AccessControlRequestType.REVOKE_CREDENTIAL:
      case AccessControlRequestType.SUSPEND_CREDENTIAL:
      case AccessControlRequestType.UNSUSPEND_CREDENTIAL:
      case AccessControlRequestType.DELETE_CREDENTIAL: {
        const action =
          args.requestType === AccessControlRequestType.REVOKE_CREDENTIAL
            ? "revoke"
            : args.requestType === AccessControlRequestType.SUSPEND_CREDENTIAL
              ? "suspend"
              : args.requestType === AccessControlRequestType.UNSUSPEND_CREDENTIAL
                ? "unsuspend"
                : "delete";
        if (!args.credentialUuid) {
          return createToolTextContent(`credentialUuid is required for ${args.requestType}.`);
        }
        if (action === "delete" && !args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            note:
              `NOT DELETED — nothing was changed. Deleting credential ${args.credentialUuid} destroys the record and cannot be undone. ` +
              `If the badge is only lost or temporarily out of use, 'suspend-credential' is reversible and usually what is wanted. ` +
              `To delete anyway, confirm with the user and call again with confirmDelete: true.`,
          });
        }
        const result = await changeCredentialState(
          args.credentialUuid,
          action,
          requestModifiers,
          sessionId
        );
        const notes: Record<typeof action, string> = {
          revoke:
            "Revoked the credential: it is detached from its user and will no longer open any door. The credential record still exists and can be reassigned with assign-credential.",
          suspend:
            "Suspended the credential: it will not open any door until 'unsuspend-credential' is used. It is still assigned to its user.",
          unsuspend:
            "Un-suspended the credential: it opens doors again, per its user's access grants.",
          delete:
            "Deleted the credential record permanently. It cannot be reassigned; a replacement badge has to be added and assigned.",
        };
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          credentialChange: { success: result.success, uuid: result.uuid, action },
          warningMsg: result.warningMsg,
          note: notes[action],
        });
      }
      case AccessControlRequestType.UPDATE_CREDENTIAL_NOTE: {
        if (!args.credentialUuid || args.credentialNote === null) {
          return createToolTextContent(
            "credentialUuid and credentialNote are both required for update-credential-note."
          );
        }
        const result = await updateCredentialNote(
          args.credentialUuid,
          args.credentialNote,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          credentialChange: { success: result.success, uuid: result.uuid, action: "update-note" },
          warningMsg: result.warningMsg,
          note: "Updated the credential's note. This is a label only — it does not change what the credential can open.",
        });
      }

      // ---------------------------------------------------------------------
      // Location access grants
      // ---------------------------------------------------------------------
      case AccessControlRequestType.CREATE_ACCESS_GRANT: {
        if (!args.accessGrantName?.trim()) {
          return createToolTextContent("accessGrantName is required for create-access-grant.");
        }
        if (!args.locationUuid) {
          return createToolTextContent("locationUuid is required for create-access-grant.");
        }
        if (!args.doorUuids?.length) {
          return createToolTextContent(
            "doorUuids is required for create-access-grant and must contain at least one door UUID — a grant with no doors gives nobody access. Get UUIDs from get-entity-tool with entityType ACCESS_CONTROL_DOOR."
          );
        }
        if (!args.userUuids?.length && !args.groupUuids?.length) {
          return createToolTextContent(
            "create-access-grant needs at least one of userUuids or groupUuids — a grant with no users and no groups gives nobody access."
          );
        }
        const result = await writeAccessGrant(
          {
            name: args.accessGrantName.trim(),
            locationUuid: args.locationUuid,
            accessControlledDoorUuids: args.doorUuids,
            userUuids: args.userUuids ?? [],
            groupUuids: args.groupUuids ?? [],
            scheduleUuid: args.scheduleUuid ?? undefined,
          },
          "create",
          requestModifiers,
          sessionId
        );
        const unlicensed = [
          ...result.expiredACDLicensesDoorUuids,
          ...result.unassignedACDLicensesDoorUuids,
        ];
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          created: { success: result.success, uuid: result.uuid },
          doorsWithoutLicense: unlicensed.length > 0 ? unlicensed : undefined,
          warningMsg: result.warningMsg,
          note:
            unlicensed.length > 0
              ? `Created the access grant "${args.accessGrantName.trim()}" over ${args.doorUuids.length} door(s), BUT ${unlicensed.length} of them has an expired or unassigned access-control license and will grant nobody access until that is fixed: ${unlicensed.join(", ")}. Tell the user this — the grant looks correct otherwise.`
              : `Created the access grant "${args.accessGrantName.trim()}" over ${args.doorUuids.length} door(s) for ${args.userUuids?.length ?? 0} user(s) and ${args.groupUuids?.length ?? 0} group(s)${args.scheduleUuid ? ", limited to the given schedule" : ", with no schedule limit — it applies at all times"}.`,
        });
      }
      case AccessControlRequestType.UPDATE_ACCESS_GRANT: {
        if (!args.accessGrantUuid) {
          return createToolTextContent("accessGrantUuid is required for update-access-grant.");
        }
        const hasChange =
          !!args.accessGrantName?.trim() ||
          !!args.doorUuids ||
          !!args.userUuids ||
          !!args.groupUuids ||
          !!args.scheduleUuid;
        if (!hasChange) {
          return createToolTextContent(
            "update-access-grant needs at least one of accessGrantName, doorUuids, userUuids, groupUuids or scheduleUuid — all were empty, so there is nothing to change."
          );
        }

        // createAccessGrant/updateAccessGrant both take the WHOLE grant, so a
        // partial body would blank the lists the caller did not mention.
        const grants = await getAccessGrants(null, requestModifiers, sessionId);
        const existing = grants.find(grant => grant.uuid === args.accessGrantUuid);
        if (!existing) {
          return createToolTextContent(
            `No access grant in this organization has the uuid "${args.accessGrantUuid}". Use get-access-grants to see the grants that exist — do not guess a uuid.`
          );
        }

        const nextDoors = args.doorUuids ?? existing.doorUuids ?? [];
        const nextUsers = args.userUuids ?? existing.userUuids ?? [];
        const nextGroups = args.groupUuids ?? existing.groupUuids ?? [];
        if (nextDoors.length === 0) {
          return createToolTextContent(
            "RETRYABLE — nothing was changed. The update would leave the grant with no doors, which gives nobody access. Pass the full set of doors the grant should cover, or use delete-access-grant."
          );
        }
        if (nextUsers.length === 0 && nextGroups.length === 0) {
          return createToolTextContent(
            "RETRYABLE — nothing was changed. The update would leave the grant with no users and no groups, which gives nobody access. Pass the full set to keep, or use delete-access-grant."
          );
        }

        const result = await writeAccessGrant(
          {
            uuid: args.accessGrantUuid,
            name: args.accessGrantName?.trim() || existing.name,
            locationUuid: args.locationUuid ?? existing.locationUuid,
            accessControlledDoorUuids: nextDoors,
            userUuids: nextUsers,
            groupUuids: nextGroups,
            scheduleUuid: args.scheduleUuid ?? existing.scheduleUuid ?? undefined,
          },
          "update",
          requestModifiers,
          sessionId
        );

        const removedDoors = (existing.doorUuids ?? []).filter(
          uuid => !nextDoors.includes(uuid)
        );
        const removedUsers = (existing.userUuids ?? []).filter(
          uuid => !nextUsers.includes(uuid)
        );
        const unlicensed = [
          ...result.expiredACDLicensesDoorUuids,
          ...result.unassignedACDLicensesDoorUuids,
        ];
        const notes: string[] = [
          `Updated the access grant "${args.accessGrantName?.trim() || existing.name || args.accessGrantUuid}".`,
        ];
        if (removedDoors.length > 0) {
          notes.push(
            `ACCESS REMOVED: ${removedDoors.length} door(s) were dropped from the grant (${removedDoors.join(", ")}) — nobody on this grant can open them any more.`
          );
        }
        if (removedUsers.length > 0) {
          notes.push(
            `ACCESS REMOVED: ${removedUsers.length} user(s) were dropped from the grant (${removedUsers.join(", ")}) — they lose the access it provided.`
          );
        }
        if (unlicensed.length > 0) {
          notes.push(
            `${unlicensed.length} door(s) on this grant have an expired or unassigned access-control license and grant nobody access until that is fixed: ${unlicensed.join(", ")}.`
          );
        }
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated: { success: result.success, uuid: result.uuid },
          doorsWithoutLicense: unlicensed.length > 0 ? unlicensed : undefined,
          warningMsg: result.warningMsg,
          note: notes.join(" "),
        });
      }
      case AccessControlRequestType.DELETE_ACCESS_GRANT: {
        if (!args.accessGrantUuid) {
          return createToolTextContent("accessGrantUuid is required for delete-access-grant.");
        }
        const grants = await getAccessGrants(null, requestModifiers, sessionId);
        const existing = grants.find(grant => grant.uuid === args.accessGrantUuid);
        if (!existing) {
          return createToolTextContent(
            `No access grant in this organization has the uuid "${args.accessGrantUuid}". Use get-access-grants to see the grants that exist.`
          );
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            accessGrants: [existing],
            note:
              `NOT DELETED — nothing was changed. Deleting the access grant "${existing.name ?? args.accessGrantUuid}" removes door access ` +
              `for ${existing.userUuids?.length ?? 0} directly-assigned user(s) and ${existing.groupUuids?.length ?? 0} group(s) across ` +
              `${existing.doorUuids?.length ?? 0} door(s). Resolve those users and doors to names with user-tool and get-entity-tool, tell the ` +
              `user exactly who loses access to what, then call this tool again with confirmDelete: true.`,
          });
        }
        const result = await deleteAccessGrant(
          args.accessGrantUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted: { success: result.success, uuid: result.uuid },
          warningMsg: result.warningMsg,
          note: `Deleted the access grant "${existing.name ?? args.accessGrantUuid}". ${existing.userUuids?.length ?? 0} user(s) and ${existing.groupUuids?.length ?? 0} group(s) no longer have access to its ${existing.doorUuids?.length ?? 0} door(s).`,
        });
      }

      // ---------------------------------------------------------------------
      // Lockdown plans
      // ---------------------------------------------------------------------
      case AccessControlRequestType.RENAME_LOCKDOWN_PLAN: {
        if (!args.lockdownPlanUuid) {
          return createToolTextContent(
            "lockdownPlanUuid is required for rename-lockdown-plan."
          );
        }
        if (!args.groupName?.trim()) {
          return createToolTextContent(
            "groupName is required for rename-lockdown-plan — it carries the plan's new name."
          );
        }
        const result = await renameLockdownPlan(
          args.lockdownPlanUuid,
          args.groupName.trim(),
          requestModifiers,
          sessionId
        );
        if (result.missing) {
          return createToolTextContent(
            `No lockdown plan has the uuid "${args.lockdownPlanUuid}". Use get-lockdown-plans to see the plans that exist.`
          );
        }
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated: { success: result.success, uuid: result.uuid },
          note: `Renamed the lockdown plan${result.previousName ? ` "${result.previousName}"` : ""} to "${args.groupName.trim()}". Only the name changed — its door states and activation steps are untouched.`,
        });
      }
      case AccessControlRequestType.DELETE_LOCKDOWN_PLAN: {
        if (!args.lockdownPlanUuid) {
          return createToolTextContent(
            "lockdownPlanUuid is required for delete-lockdown-plan."
          );
        }
        const plans = await getLockdownPlans(requestModifiers, sessionId);
        const existing = plans.find(plan => plan.uuid === args.lockdownPlanUuid);
        if (!existing) {
          return createToolTextContent(
            `No lockdown plan has the uuid "${args.lockdownPlanUuid}". Use get-lockdown-plans to see the plans that exist.`
          );
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            lockdownPlans: [existing],
            note:
              `NOT DELETED — nothing was changed. "${existing.name ?? args.lockdownPlanUuid}" is an emergency lockdown plan: deleting it ` +
              `removes the ability to lock down this location, and it cannot be recreated through this tool. This is a life-safety ` +
              `configuration — get explicit confirmation from the user, then call again with confirmDelete: true.`,
          });
        }
        const deleted = await deleteLockdownPlan(
          args.lockdownPlanUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted,
          note: `Deleted the lockdown plan "${existing.name ?? args.lockdownPlanUuid}". This location can no longer be put into that lockdown. Recreating it requires the Rhombus Console.`,
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
      title: "Access Control",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
