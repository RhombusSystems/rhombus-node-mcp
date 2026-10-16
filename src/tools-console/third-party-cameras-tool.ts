import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  assignSequentially,
  buildAssignPlan,
  getNvrs,
  getThirdPartyCameraStates,
  getUnassignedDiscoveries,
  normalizeMac,
  nvrLabel,
  redactRtspUrl,
  resolveNvr,
} from "../api/third-party-cameras-tool-api.js";
import {
  MAX_ASSIGN_CAMERAS,
  OUTPUT_SCHEMA,
  type OutputSchema,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/third-party-cameras-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";
import { issueConfirmationId, verifyConfirmationId } from "../utils/confirmation.js";

const TOOL_NAME = "third-party-cameras-tool";
const TOOL_DESCRIPTION = `
Third-party (ONVIF / RTSP) cameras on Rhombus NVRs (Relay Core N100 / N500): list the NVRs, see which cameras they have discovered, and assign + name discovered cameras — for example from a spreadsheet the user attached (one row per camera: name, IP address, site or NVR).

requestType:
- 'list-nvrs': every NVR with its serial number, name, location and third-party camera slots (used / supported).
- 'list-cameras': discovered cameras ready to assign (IP, MAC, validated stream, which NVRs have seen them), discovered cameras whose stream has not passed validation, and cameras already assigned. Pass nvr to limit it to one NVR.
- 'assign': assigns and names cameras, one at a time. Each row needs nvr (serial number, name or uuid), name, and ipAddress or macAddress. THIS TOOL CHANGES DEVICES and runs its own confirmation step, so the user confirms exactly ONCE per batch: call it FIRST with confirmationId null — it changes nothing and returns the plan (one row per camera: ready, already-assigned, not-validated, not-discovered, ambiguous, …) and a confirmation id. Show the user the plan — how many will be assigned to which NVR, and every row that will not be, with the reason — and ask one plain yes/no question. When they agree, call again with the same cameras and exactly that id. Each call assigns for about 30 seconds; while nextStartAt is not null, call again straight away with the same cameras, the same confirmationId and startAt = nextStartAt, without asking again. The id lasts 15 minutes; after that, plan the remaining rows again.
At most ${MAX_ASSIGN_CAMERAS} cameras per batch: split a longer list by NVR or site. Never run two assign calls at the same time — a burst of camera checks crashes the NVR.
`;

const NOT_VALIDATED_HELP =
  "A discovered camera whose stream has not passed validation needs its username/password or RTSP path fixed in the Console before it can be assigned.";

const TOOL_HANDLER = async (args: ToolArgs, extra: unknown) => {
  const { requestType, nvr: nvrRef, cameras, startAt, confirmationId } = args;
  const session = extractFromToolExtra(extra);

  try {
    switch (requestType) {
      case "list-nvrs": {
        const nvrs = await getNvrs(session);
        return createToolStructuredContent<OutputSchema>({
          nvrs: nvrs.map(nvr => ({
            uuid: nvr.uuid,
            name: nvr.name,
            serialNumber: nvr.serialNumber,
            model: nvr.hwVariation,
            locationUuid: nvr.locationUuid,
            connectionStatus: nvr.connectionStatus,
            thirdPartyCamerasAssigned: nvr.numThirdPartyCamerasAssigned,
            thirdPartyCamerasSupported: nvr.numThirdPartyCamerasSupported,
          })),
        });
      }

      case "list-cameras": {
        const [nvrs, discoveries, states] = await Promise.all([
          getNvrs(session),
          getUnassignedDiscoveries(session),
          getThirdPartyCameraStates(session),
        ]);
        const only = nvrRef ? resolveNvr(nvrs, nvrRef) : undefined;
        if (nvrRef && !only?.uuid) {
          return createToolTextContent(
            `No single NVR in this org has the serial number, name or uuid "${nvrRef}". Use list-nvrs to see them.`
          );
        }
        const labelByUuid = new Map(nvrs.map(n => [n.uuid ?? "", nvrLabel(n)]));
        const stateByMac = new Map(states.map(s => [normalizeMac(s.defaultInterfaceMac), s]));
        const seenBy = (lastVisibleMs: Record<string, number | null> | null | undefined) =>
          Object.keys(lastVisibleMs ?? {})
            .map(uuid => labelByUuid.get(uuid))
            .filter((label): label is string => !!label);
        const seenByOnly = (lastVisibleMs: Record<string, number | null> | null | undefined) =>
          !only?.uuid || lastVisibleMs?.[only.uuid] != null;

        const discoveredMacs = new Set(discoveries.map(d => normalizeMac(d.macAddress)));
        const unassigned = discoveries
          .map(d => ({ d, state: stateByMac.get(normalizeMac(d.macAddress)) }))
          .filter(({ state }) => seenByOnly(state?.lastVisibleMs))
          .map(({ d, state }) => ({
            ipAddress: d.ipAddress,
            macAddress: d.macAddress,
            manufacturer: d.manufacturer,
            model: d.model,
            importedName: state?.name ?? undefined,
            streams: (d.unassignedRtspEndpoints ?? []).map(e => redactRtspUrl(e.rtspUrl)),
            seenBy: seenBy(state?.lastVisibleMs),
          }));
        const notValidated = states
          .filter(s => !s.uuid && !discoveredMacs.has(normalizeMac(s.defaultInterfaceMac)))
          .filter(s => seenByOnly(s.lastVisibleMs))
          .map(s => ({
            ipAddress: s.lanAddresses?.[0],
            macAddress: s.defaultInterfaceMac,
            manufacturer: s.manufacturer,
            model: s.model,
            importedName: s.name ?? undefined,
            lastStreamStatus: s.lastRtspUrlStatus,
            seenBy: seenBy(s.lastVisibleMs),
          }));
        const assigned = states
          .filter(s => s.uuid && (!only?.uuid || s.assignedNVRUuid === only.uuid))
          .map(s => ({
            uuid: s.uuid,
            name: s.name,
            ipAddress: s.lanAddresses?.[0],
            macAddress: s.defaultInterfaceMac,
            nvr: s.assignedNVRUuid ? labelByUuid.get(s.assignedNVRUuid) : undefined,
            connectionStatus: s.connectionStatus,
          }));
        return createToolStructuredContent<OutputSchema>({
          unassigned,
          notValidated,
          assigned,
          ...(notValidated.length > 0 ? { note: NOT_VALIDATED_HELP } : {}),
        });
      }

      case "assign": {
        if (!cameras?.length) {
          return createToolTextContent(
            "RETRYABLE — nothing was changed. 'assign' needs cameras: one row per camera with nvr, name and ipAddress or macAddress."
          );
        }
        const [nvrs, discoveries, states] = await Promise.all([
          getNvrs(session),
          getUnassignedDiscoveries(session),
          getThirdPartyCameraStates(session),
        ]);
        const { plan, ready } = buildAssignPlan(cameras, nvrs, discoveries, states);
        const notReady = plan.filter(p => p.status !== "ready");

        if (ready.length === 0) {
          return createToolStructuredContent<OutputSchema>({
            plan,
            note: "Nothing to assign: no row is ready. Tell the user why for each row.",
          });
        }

        // The id is bound to this tool and this exact camera list; startAt is not part of it, so
        // one confirmation covers every continuation of the batch.
        const action = { tool: TOOL_NAME, args: { cameras } };
        if (!verifyConfirmationId(confirmationId, action)) {
          const id = issueConfirmationId(action);
          return createToolStructuredContent<OutputSchema>({
            needUserInput: true,
            plan,
            commandForUser: `Show the user the plan: ${ready.length} camera(s) ready to assign, by NVR, and each of the ${notReady.length} other row(s) with its reason. Ask one plain yes/no question. When they agree, call this tool again with the same cameras and confirmationId: ${id} (valid for 15 minutes, for this list only).`,
          });
        }

        const from = startAt ?? 0;
        const { results, nextStartAt, remaining } = await assignSequentially(ready, from, session);
        return createToolStructuredContent<OutputSchema>({
          results,
          nextStartAt,
          remaining,
          // The rows that will never be tried are reported once, with the first page of results.
          ...(from === 0 && notReady.length > 0 ? { plan: notReady } : {}),
          note:
            nextStartAt === null
              ? "This batch is finished. Report what was assigned, what failed and why, and any rows that were not ready."
              : `Continue now: call assign again with the same cameras, the same confirmationId and startAt ${nextStartAt} (${remaining} camera(s) left). Do not ask the user again.`,
        });
      }
    }
  } catch (error: unknown) {
    return createToolStructuredContent<OutputSchema>({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return createToolTextContent(
    "Invalid requestType. Valid values are: list-nvrs, list-cameras, assign."
  );
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Third-Party Cameras on NVRs",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    TOOL_HANDLER
  );
}
