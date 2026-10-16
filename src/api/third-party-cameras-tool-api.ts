import { apiFailureMessage, postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";
import type { CameraToAssign, PlanStatus } from "../types/third-party-cameras-tool-types.js";
import type { RequestModifiers } from "../util.js";

type Nvr = schema["MinimalNVRStateType"];
type Discovery = schema["Relay_DiscoveryWithUnassignedRtspEndpoints"];
type CameraState = schema["Relay_MinimalThirdPartyCameraStateType"];

/**
 * Pacing for assign. Assignments go strictly one at a time with a pause between them: a burst of
 * concurrent camera checks can crash the agent on an N100 that runs them, and then every check in
 * flight reports "Not Reachable". One assignment can take over 60 s (the NVR's RTSP check), and
 * an MCP tool call times out at 60 s, so a call starts new cameras only for `startBudgetMs` and
 * stops waiting at `callBudgetMs`; the caller continues with `nextStartAt`. Mutable for tests.
 */
export const TIMING = { pauseMs: 2_000, startBudgetMs: 30_000, callBudgetMs: 45_000 };

/** Consecutive failures on one NVR before a call stops sending it more cameras. */
const MAX_CONSECUTIVE_NVR_FAILURES = 3;

type Session = { requestModifiers?: RequestModifiers; sessionId?: string };

export async function getNvrs({ requestModifiers, sessionId }: Session) {
  const res = await postApi<schema["Relay_GetMinimalNVRStateListWSResponse"]>({
    route: "/relay/getMinimalNVRStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  const failure = apiFailureMessage(res);
  if (failure) throw new Error(failure);
  return res.nvrstates ?? [];
}

/** Discovered cameras with at least one validated (GOOD) stream that is not assigned yet. */
export async function getUnassignedDiscoveries({ requestModifiers, sessionId }: Session) {
  const res = await postApi<
    schema["Relay_FindDiscoveriesWithUnassignedRtspEndpointsWSResponse"] & { errorMsg?: string }
  >({
    route: "/relay/findDiscoveriesWithUnassignedRtspEndpoints",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  const failure = apiFailureMessage(res);
  if (failure) throw new Error(failure);
  return res.discoveries ?? [];
}

/** Every third-party camera: assigned ones (uuid set) and unassigned discoveries (uuid null). */
export async function getThirdPartyCameraStates({ requestModifiers, sessionId }: Session) {
  const res = await postApi<schema["Relay_GetMinimalThirdPartyCameraStateListWSResponse"]>({
    route: "/relay/getMinimalThirdPartyCameraStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  const failure = apiFailureMessage(res);
  if (failure) throw new Error(failure);
  return res.thirdPartyCameraStateList ?? [];
}

async function assignCamera(
  request: schema["Relay_AssignThirdPartyCameraToNVRWSRequest"],
  { requestModifiers, sessionId }: Session
) {
  return postApi<schema["Relay_AssignThirdPartyCameraToNVRWSResponse"]>({
    route: "/relay/assignThirdPartyCameraToNVR",
    body: request,
    modifiers: requestModifiers,
    sessionId,
  });
}

// ---------------------------------------------------------------------------
// Matching the user's rows to NVRs and discoveries (pure)
// ---------------------------------------------------------------------------

export function normalizeMac(mac: string | null | undefined): string {
  return (mac ?? "").toLowerCase().replace(/[^0-9a-f]/g, "");
}

/** The RTSP URL without credentials, as it is shown to the model; never echo a camera password. */
export function redactRtspUrl(url: string | null | undefined): string {
  return (url ?? "").replace(/\/\/[^/@]*@/, "//");
}

function rtspHost(url: string | null | undefined): string {
  return /^rtsps?:\/\/(?:[^/@]*@)?([^/:?#]+)/i.exec(url ?? "")?.[1] ?? "";
}

export function nvrLabel(nvr: Nvr): string {
  return nvr.serialNumber && nvr.name && nvr.name !== nvr.serialNumber
    ? `${nvr.name} (${nvr.serialNumber})`
    : (nvr.name ?? nvr.serialNumber ?? nvr.uuid ?? "unknown NVR");
}

/** An NVR by uuid, serial number or name (case-insensitive); a name shared by two NVRs matches neither. */
export function resolveNvr(nvrs: Nvr[], ref: string): Nvr | undefined {
  const key = ref.trim().toLowerCase();
  const exact = nvrs.find(
    nvr => nvr.uuid?.toLowerCase() === key || nvr.serialNumber?.toLowerCase() === key
  );
  if (exact) return exact;
  const byName = nvrs.filter(nvr => nvr.name?.trim().toLowerCase() === key);
  return byName.length === 1 ? byName[0] : undefined;
}

function sameIp(ip: string, discovery: Discovery): boolean {
  return (
    discovery.ipAddress === ip ||
    (discovery.unassignedRtspEndpoints ?? []).some(endpoint => rtspHost(endpoint.rtspUrl) === ip)
  );
}

function matchesState(row: CameraToAssign, state: CameraState): boolean {
  if (row.macAddress)
    return normalizeMac(row.macAddress) === normalizeMac(state.defaultInterfaceMac);
  if (row.ipAddress) return (state.lanAddresses ?? []).includes(row.ipAddress.trim());
  return !!state.rtspUrl && redactRtspUrl(state.rtspUrl) === redactRtspUrl(row.rtspUrl);
}

/** Of several cameras matching one row, the ones on (or seen by) the target NVR, if any. */
function preferTargetNvr(states: CameraState[], nvrUuid: string): CameraState[] {
  const onTarget = states.filter(
    s => s.assignedNVRUuid === nvrUuid || s.lastVisibleMs?.[nvrUuid] != null
  );
  return onTarget.length > 0 ? onTarget : states;
}

export type PlanRow = {
  row: number;
  name: string;
  nvr: string;
  ipAddress: string | null;
  macAddress: string | null;
  stream: string | null;
  status: PlanStatus;
  detail?: string;
};

/** What the assign call needs for a ready row; kept out of the plan the model sees (full RTSP URL). */
export type ReadyAssignment = {
  row: number;
  name: string;
  nvrUuid: string;
  nvrLabel: string;
  locationUuid: string | null;
  macAddress: string;
  rtspUrl: string;
};

export function buildAssignPlan(
  cameras: CameraToAssign[],
  nvrs: Nvr[],
  discoveries: Discovery[],
  states: CameraState[]
): { plan: PlanRow[]; ready: ReadyAssignment[] } {
  const plan: PlanRow[] = [];
  const ready: ReadyAssignment[] = [];
  const nvrByUuid = new Map(nvrs.filter(n => n.uuid).map(n => [n.uuid as string, n]));
  const stateByMac = new Map(states.map(s => [normalizeMac(s.defaultInterfaceMac), s]));
  const freeSlots = new Map<string, number>();
  const claimedMacs = new Map<string, number>();

  cameras.forEach((camera, row) => {
    const base = {
      row,
      name: camera.name,
      nvr: camera.nvr,
      ipAddress: camera.ipAddress,
      macAddress: camera.macAddress,
      stream: null,
    };
    const add = (status: PlanStatus, detail?: string, extra: Partial<PlanRow> = {}) =>
      plan.push({ ...base, ...extra, status, ...(detail ? { detail } : {}) });

    if (!camera.ipAddress?.trim() && !camera.macAddress?.trim() && !camera.rtspUrl?.trim()) {
      add(
        "not-discovered",
        "The row has no IP address, MAC address or RTSP URL to find the camera by."
      );
      return;
    }
    const nvr = resolveNvr(nvrs, camera.nvr);
    if (!nvr?.uuid) {
      add(
        "unknown-nvr",
        `No single NVR in this org has the serial number, name or uuid "${camera.nvr}".`
      );
      return;
    }
    const target = { nvr: nvrLabel(nvr) };

    // Candidates: discoveries with a validated, unassigned stream that match the row.
    let candidates = discoveries.filter(d => {
      if (camera.macAddress) return normalizeMac(d.macAddress) === normalizeMac(camera.macAddress);
      if (camera.ipAddress) return sameIp(camera.ipAddress.trim(), d);
      return (d.unassignedRtspEndpoints ?? []).some(
        e => redactRtspUrl(e.rtspUrl) === redactRtspUrl(camera.rtspUrl)
      );
    });
    // Sites often reuse one address plan, so one IP can be a different camera at each site:
    // prefer the discovery the target NVR has actually seen.
    if (candidates.length > 1) {
      const seen = candidates.filter(
        d => stateByMac.get(normalizeMac(d.macAddress))?.lastVisibleMs?.[nvr.uuid as string] != null
      );
      if (seen.length > 0) candidates = seen;
    }
    if (candidates.length > 1) {
      add(
        "ambiguous",
        `${candidates.length} discovered cameras match (MACs ${candidates.map(d => d.macAddress).join(", ")}), and ${target.nvr} has not seen exactly one of them. Give this row's MAC address.`,
        target
      );
      return;
    }

    const discovery = candidates[0];
    if (!discovery) {
      const [assigned] = preferTargetNvr(
        states.filter(s => s.uuid && matchesState(camera, s)),
        nvr.uuid
      );
      if (assigned) {
        const on = assigned.assignedNVRUuid ? nvrByUuid.get(assigned.assignedNVRUuid) : undefined;
        const elsewhere =
          assigned.assignedNVRUuid && assigned.assignedNVRUuid !== nvr.uuid
            ? " That is a different NVR: if this row is another camera with the same IP at another site, give its MAC address."
            : "";
        add(
          "already-assigned",
          `Already a Rhombus camera named "${assigned.name ?? ""}"${on ? ` on ${nvrLabel(on)}` : ""}.${elsewhere}`,
          target
        );
        return;
      }
      const [pending] = preferTargetNvr(
        states.filter(s => !s.uuid && matchesState(camera, s)),
        nvr.uuid
      );
      if (pending) {
        add(
          "not-validated",
          `Discovered, but no stream has passed validation (last status ${pending.lastRtspUrlStatus ?? "unknown"}): the camera's username/password or RTSP path is wrong, or the NVR cannot reach it.`,
          target
        );
        return;
      }
      add(
        "not-discovered",
        "No NVR has discovered a camera at this address: check it is powered and on the NVR's network (same subnet for ONVIF discovery), or add it by RTSP URL in the Console.",
        target
      );
      return;
    }

    const mac = discovery.macAddress ?? "";
    const firstRow = claimedMacs.get(normalizeMac(mac));
    if (firstRow !== undefined) {
      add("duplicate", `Same camera as row ${firstRow}.`, target);
      return;
    }

    const endpoints = discovery.unassignedRtspEndpoints ?? [];
    const endpoint = camera.rtspUrl
      ? endpoints.find(e => redactRtspUrl(e.rtspUrl) === redactRtspUrl(camera.rtspUrl))
      : endpoints[0];
    if (!endpoint?.rtspUrl) {
      add(
        "unknown-stream",
        `That RTSP URL is not one of this camera's validated streams: ${endpoints.map(e => redactRtspUrl(e.rtspUrl)).join(", ")}.`,
        target
      );
      return;
    }
    const stream = {
      ...target,
      ipAddress: camera.ipAddress ?? discovery.ipAddress ?? null,
      macAddress: mac,
      stream: redactRtspUrl(endpoint.rtspUrl),
    };

    if (!freeSlots.has(nvr.uuid)) {
      const supported = nvr.numThirdPartyCamerasSupported;
      freeSlots.set(
        nvr.uuid,
        supported == null
          ? Number.POSITIVE_INFINITY
          : supported - (nvr.numThirdPartyCamerasAssigned ?? 0)
      );
    }
    const free = freeSlots.get(nvr.uuid) as number;
    if (free <= 0) {
      add(
        "nvr-full",
        `${target.nvr} has no free third-party camera slots (${nvr.numThirdPartyCamerasAssigned ?? 0} of ${nvr.numThirdPartyCamerasSupported} used, counting this batch).`,
        stream
      );
      return;
    }
    freeSlots.set(nvr.uuid, free - 1);
    claimedMacs.set(normalizeMac(mac), row);

    add(
      "ready",
      endpoints.length > 1 ? `Uses the first of ${endpoints.length} validated streams.` : undefined,
      stream
    );
    ready.push({
      row,
      name: camera.name,
      nvrUuid: nvr.uuid,
      nvrLabel: target.nvr,
      locationUuid: nvr.locationUuid ?? null,
      macAddress: mac,
      rtspUrl: endpoint.rtspUrl,
    });
  });

  return { plan, ready };
}

// ---------------------------------------------------------------------------
// Assigning, one camera at a time
// ---------------------------------------------------------------------------

export type AssignResult = {
  row: number;
  name: string;
  nvr: string;
  status: "assigned" | "failed" | "skipped" | "pending";
  deviceUuid?: string;
  detail?: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function assignSequentially(
  ready: ReadyAssignment[],
  startAt: number,
  session: Session
): Promise<{ results: AssignResult[]; nextStartAt: number | null; remaining: number }> {
  const started = Date.now();
  const queue = ready.filter(r => r.row >= startAt);
  const results: AssignResult[] = [];
  const failuresInARow = new Map<string, number>();
  let nextStartAt: number | null = null;

  for (const [i, item] of queue.entries()) {
    const result = { row: item.row, name: item.name, nvr: item.nvrLabel };
    if (Date.now() - started > TIMING.startBudgetMs) {
      nextStartAt = item.row;
      break;
    }
    if ((failuresInARow.get(item.nvrUuid) ?? 0) >= MAX_CONSECUTIVE_NVR_FAILURES) {
      results.push({
        ...result,
        status: "skipped",
        detail: `Not sent: the last ${MAX_CONSECUTIVE_NVR_FAILURES} cameras on this NVR failed. Check the NVR is online, then run the batch again.`,
      });
      continue;
    }
    if (i > 0) await sleep(TIMING.pauseMs);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<"timeout">(resolve => {
      timer = setTimeout(
        () => resolve("timeout"),
        Math.max(0, TIMING.callBudgetMs - (Date.now() - started))
      );
    });
    const res = await Promise.race([
      assignCamera(
        {
          name: item.name,
          nvruuid: item.nvrUuid,
          locationUuid: item.locationUuid,
          discoveredCameraMacAddress: item.macAddress,
          rtspUrl: item.rtspUrl,
        },
        session
      ),
      deadline,
    ]);
    clearTimeout(timer);

    if (res === "timeout") {
      results.push({
        ...result,
        status: "pending",
        detail:
          "The NVR is still checking this camera's stream. It may finish on its own; list-cameras shows it once it is assigned.",
      });
      nextStartAt = queue[i + 1]?.row ?? null;
      break;
    }
    const failure = apiFailureMessage(res);
    if (failure) {
      failuresInARow.set(item.nvrUuid, (failuresInARow.get(item.nvrUuid) ?? 0) + 1);
      results.push({ ...result, status: "failed", detail: failure });
    } else {
      failuresInARow.set(item.nvrUuid, 0);
      results.push({ ...result, status: "assigned", deviceUuid: res.deviceUuid ?? undefined });
    }
  }

  const remaining = nextStartAt === null ? 0 : queue.filter(r => r.row >= nextStartAt).length;
  return { results, nextStartAt, remaining };
}
