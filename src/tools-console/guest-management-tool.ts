import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAllGuestsByOrg,
  getGuestActivityLogs,
  getActivitiesForLocation,
  createGuest,
  deleteGuest,
  getGuestPasses,
  changeGuestPassState,
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
- ${GuestManagementRequestType.CREATE_GUEST}: Register a guest. Requires guestFirstName, guestLastName, guestEmail and locationUuid.
- ${GuestManagementRequestType.DELETE_GUEST}: Remove a guest record. Requires guestEmail and confirmDelete.
- ${GuestManagementRequestType.GET_GUEST_PASSES}: List guest passes (the door-access credentials issued to guests), optionally filtered by time range.
- ${GuestManagementRequestType.EXPIRE_GUEST_PASS}: End a guest pass's access while keeping its record. Requires guestPassUuid.
- ${GuestManagementRequestType.SUSPEND_GUEST_PASS} / ${GuestManagementRequestType.UNSUSPEND_GUEST_PASS}: Temporarily disable / re-enable a guest pass. Requires guestPassUuid.
- ${GuestManagementRequestType.DELETE_GUEST_PASS}: Destroy a guest pass record and its history. Requires guestPassUuid and confirmDelete.

A guest is identified by EMAIL, not a UUID, so creating a guest whose email already exists overwrites that record rather than adding a second one. Guest passes control physical door access — confirm the guest by name before changing one.
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
      case GuestManagementRequestType.CREATE_GUEST: {
        if (
          !args.guestFirstName?.trim() ||
          !args.guestLastName?.trim() ||
          !args.guestEmail?.trim() ||
          !args.locationUuid
        ) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error:
              "guestFirstName, guestLastName, guestEmail and locationUuid are all required for create-guest.",
          });
        }
        const email = args.guestEmail.trim();
        // A guest is keyed on email, so creating one that already exists would
        // overwrite the existing visit rather than adding a second guest.
        const guests = await getAllGuestsByOrg(requestModifiers, sessionId);
        const existing = guests.find(
          guest => guest.email?.trim().toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            guests: [existing],
            note: `Nothing was created — ${email} is already registered as a guest (${[existing.firstName, existing.lastName].filter(Boolean).join(" ") || "no name"}). Guests are identified by email, so creating again would overwrite that record. Confirm with the user whether they meant to replace it.`,
          });
        }
        const created = await createGuest(
          {
            firstName: args.guestFirstName.trim(),
            lastName: args.guestLastName.trim(),
            email,
            locationUuid: args.locationUuid,
            hostUserUuid: args.hostUserUuid ?? undefined,
            companyName: args.guestCompanyName?.trim() || undefined,
            guestType: args.guestType ?? "GENERAL_VISITOR",
            accessStartTimeMs: args.accessStartTimeMs ?? undefined,
            accessEndTimeMs: args.accessEndTimeMs ?? undefined,
          },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          created,
          warningMsg: created.warningMsg,
          note: args.accessEndTimeMs
            ? `Registered ${args.guestFirstName.trim()} ${args.guestLastName.trim()} (${email}) as a guest.`
            : `Registered ${args.guestFirstName.trim()} ${args.guestLastName.trim()} (${email}) as a guest with NO access end time, so their access does not expire on its own. Offer to set accessEndTimeMs.`,
        });
      }
      case GuestManagementRequestType.DELETE_GUEST: {
        if (!args.guestEmail?.trim()) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error:
              "guestEmail is required for delete-guest — guests are identified by email, not a UUID.",
          });
        }
        const email = args.guestEmail.trim();
        const guests = await getAllGuestsByOrg(requestModifiers, sessionId);
        const existing = guests.find(
          guest => guest.email?.trim().toLowerCase() === email.toLowerCase()
        );
        if (!existing) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `No guest in this organization has the email ${email}, so there is nothing to delete. Use get-all-guests to see the registered guests.`,
          });
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            guests: [existing],
            note:
              `NOT DELETED — nothing was changed. Deleting the guest ${[existing.firstName, existing.lastName].filter(Boolean).join(" ") || email} ` +
              `removes their record and their site access, and cannot be undone. Confirm with the user, then call again with confirmDelete: true.`,
          });
        }
        const deleted = await deleteGuest(email, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted,
          warningMsg: deleted.warningMsg,
          note: `Deleted the guest record for ${email}. Their past check-in activity remains in the activity log.`,
        });
      }
      case GuestManagementRequestType.GET_GUEST_PASSES: {
        const { guestPasses, lastEvaluatedKey } = await getGuestPasses(
          {
            startAfterMs: args.startTimeMs ?? undefined,
            startBeforeMs: args.endTimeMs ?? undefined,
          },
          requestModifiers,
          sessionId
        );
        const active = guestPasses.filter(pass => pass.lifecycle === "ACTIVE").length;
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          guestPasses,
          lastEvaluatedKey,
          note:
            guestPasses.length === 0
              ? "No guest passes match this time range. That is not the same as the organization having none — widen startTimeMs / endTimeMs to check."
              : `${active} of ${guestPasses.length} pass(es) in this range are ACTIVE; the rest are suspended, expired or archived.`,
        });
      }
      case GuestManagementRequestType.EXPIRE_GUEST_PASS:
      case GuestManagementRequestType.SUSPEND_GUEST_PASS:
      case GuestManagementRequestType.UNSUSPEND_GUEST_PASS:
      case GuestManagementRequestType.DELETE_GUEST_PASS: {
        const action =
          args.requestType === GuestManagementRequestType.EXPIRE_GUEST_PASS
            ? "expire"
            : args.requestType === GuestManagementRequestType.SUSPEND_GUEST_PASS
              ? "suspend"
              : args.requestType === GuestManagementRequestType.UNSUSPEND_GUEST_PASS
                ? "unsuspend"
                : "delete";
        if (!args.guestPassUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: `guestPassUuid is required for ${args.requestType}. Use get-guest-passes to find it.`,
          });
        }
        if (action === "delete" && !args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            note:
              `NOT DELETED — nothing was changed. Deleting guest pass ${args.guestPassUuid} destroys the record and its history. ` +
              `To end the access while keeping the record, use expire-guest-pass instead. To delete anyway, confirm with the user and ` +
              `call again with confirmDelete: true.`,
          });
        }
        const guestPassChange = await changeGuestPassState(
          args.guestPassUuid,
          action,
          requestModifiers,
          sessionId
        );
        const notes = {
          expire:
            "Expired the guest pass. It no longer opens any door; the record and its history are kept.",
          suspend:
            "Suspended the guest pass. It will not open any door until unsuspend-guest-pass is used.",
          unsuspend: "Un-suspended the guest pass. It opens doors again.",
          delete: "Deleted the guest pass record permanently, along with its history.",
        } as const;
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          guestPassChange,
          warningMsg: guestPassChange.warningMsg,
          note: notes[action],
        });
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
      title: "Guest Management",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
