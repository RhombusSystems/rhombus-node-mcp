import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TIMING, buildAssignPlan } from "../../src/api/third-party-cameras-tool-api.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/third-party-cameras-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

// Two sites whose NVRs see cameras on the same address plan.
const SITE_A = {
  uuid: "nvrSiteAAAAAAAAAAAAAAA",
  name: "Site A Relay",
  serialNumber: "N100-TEST0001",
  locationUuid: "locSiteAAAAAAAAAAAAAAA",
  numThirdPartyCamerasSupported: 16,
  numThirdPartyCamerasAssigned: 0,
};
const SITE_B = {
  uuid: "nvrSiteBAAAAAAAAAAAAAA",
  name: "Site B Relay",
  serialNumber: "N500-TEST0002",
  locationUuid: "locSiteBAAAAAAAAAAAAAA",
  numThirdPartyCamerasSupported: 1,
  numThirdPartyCamerasAssigned: 0,
};
const NVRS = [SITE_A, SITE_B];

const discovery = (ip: string, mac: string, urls = [`rtsp://admin:hunter2@${ip}:554/stream1`]) => ({
  ipAddress: ip,
  macAddress: mac,
  manufacturer: "Hikvision",
  model: "DS-2CD2143",
  unassignedRtspEndpoints: urls.map(rtspUrl => ({
    rtspUrl,
    username: "admin",
    password: "hunter2",
  })),
});
const seen = (mac: string, ip: string, nvrUuid: string, extra: Record<string, unknown> = {}) => ({
  uuid: null,
  defaultInterfaceMac: mac,
  lanAddresses: [ip],
  lastVisibleMs: { [nvrUuid]: 1792185000000 },
  ...extra,
});

const row = (
  nvr: string,
  name: string,
  ipAddress: string | null,
  macAddress: string | null = null
) => ({
  nvr,
  name,
  ipAddress,
  macAddress,
  rtspUrl: null,
});

describe("buildAssignPlan", () => {
  it("resolves the NVR by serial and the camera by IP, and keeps credentials out of the plan", () => {
    const { plan, ready } = buildAssignPlan(
      [row("n100-test0001", "Front Door", "192.0.2.105")],
      NVRS,
      [discovery("192.0.2.105", "aa:bb:cc:00:00:01")],
      [seen("aa:bb:cc:00:00:01", "192.0.2.105", SITE_A.uuid)]
    );
    expect(plan).toEqual([
      {
        row: 0,
        name: "Front Door",
        nvr: "Site A Relay (N100-TEST0001)",
        ipAddress: "192.0.2.105",
        macAddress: "aa:bb:cc:00:00:01",
        stream: "rtsp://192.0.2.105:554/stream1",
        status: "ready",
      },
    ]);
    expect(ready[0]).toMatchObject({
      nvrUuid: SITE_A.uuid,
      locationUuid: SITE_A.locationUuid,
      rtspUrl: "rtsp://admin:hunter2@192.0.2.105:554/stream1",
    });
  });

  it("picks the camera the target NVR has seen when two sites reuse an IP", () => {
    const discoveries = [
      discovery("192.0.2.105", "aa:bb:cc:00:00:01"),
      discovery("192.0.2.105", "aa:bb:cc:00:00:02"),
    ];
    const states = [
      seen("aa:bb:cc:00:00:01", "192.0.2.105", SITE_A.uuid),
      seen("aa:bb:cc:00:00:02", "192.0.2.105", SITE_B.uuid),
    ];
    const { ready } = buildAssignPlan(
      [row("N500-TEST0002", "Lobby", "192.0.2.105")],
      NVRS,
      discoveries,
      states
    );
    expect(ready.map(r => r.macAddress)).toEqual(["aa:bb:cc:00:00:02"]);

    const unseen = buildAssignPlan(
      [row("N500-TEST0002", "Lobby", "192.0.2.105")],
      NVRS,
      discoveries,
      []
    );
    expect(unseen.plan[0].status).toBe("ambiguous");
    expect(unseen.ready).toEqual([]);
  });

  it("explains every row it will not assign", () => {
    const { plan, ready } = buildAssignPlan(
      [
        row("N100-TEST0001", "Front Hall", "192.0.2.110"),
        row("N100-TEST0001", "Already There", "192.0.2.111"),
        row("N100-TEST0001", "Bad Password", "192.0.2.112"),
        row("N100-TEST0001", "Unplugged", "192.0.2.113"),
        row("N100-XXXX", "Wrong NVR", "192.0.2.110"),
        row("N100-TEST0001", "Front Hall again", null, "AA-BB-CC-00-00-10"),
        row("N500-TEST0002", "Office 1", "198.51.100.108"),
        row("N500-TEST0002", "Office 2", "198.51.100.109"),
      ],
      NVRS,
      [
        discovery("192.0.2.110", "aa:bb:cc:00:00:10"),
        discovery("198.51.100.108", "aa:bb:cc:00:00:20"),
        discovery("198.51.100.109", "aa:bb:cc:00:00:21"),
      ],
      [
        {
          uuid: "camAlreadyThereAAAAAAA",
          name: "Already There",
          assignedNVRUuid: SITE_A.uuid,
          defaultInterfaceMac: "aa:bb:cc:00:00:11",
          lanAddresses: ["192.0.2.111"],
        },
        seen("aa:bb:cc:00:00:12", "192.0.2.112", SITE_A.uuid, {
          lastRtspUrlStatus: "UNAUTHORIZED",
        }),
      ]
    );
    expect(plan.map(p => [p.name, p.status])).toEqual([
      ["Front Hall", "ready"],
      ["Already There", "already-assigned"],
      ["Bad Password", "not-validated"],
      ["Unplugged", "not-discovered"],
      ["Wrong NVR", "unknown-nvr"],
      ["Front Hall again", "duplicate"],
      ["Office 1", "ready"],
      ["Office 2", "nvr-full"],
    ]);
    expect(plan[2].detail).toContain("UNAUTHORIZED");
    expect(ready.map(r => r.name)).toEqual(["Front Hall", "Office 1"]);
  });
});

// ---------------------------------------------------------------------------
// The tool, through a real MCP client (output-schema validation included)
// ---------------------------------------------------------------------------

async function callTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const result = await client.callTool({
      name: "third-party-cameras-tool",
      arguments: {
        nvr: null,
        cameras: null,
        startAt: null,
        confirmationId: null,
        includeFields: null,
        filterBy: null,
        groupBy: null,
        ...args,
      },
    });
    return result as { structuredContent?: Record<string, any>; content: { text: string }[] };
  } finally {
    await client.close();
  }
}

/** A fake api2: three Site A cameras discovered; assigning one moves it to the assigned list. */
function fakeApi(assignMs = 0) {
  const discoveries = ["105", "106", "107"].map((n, i) =>
    discovery(`192.0.2.${n}`, `aa:bb:cc:00:01:0${i}`)
  );
  const states: Record<string, unknown>[] = discoveries.map(d =>
    seen(d.macAddress, d.ipAddress, SITE_A.uuid)
  );
  let inFlight = 0;
  let maxInFlight = 0;
  const assignedNames: string[] = [];
  vi.mocked(network.postApi).mockImplementation(async ({ route, body }) => {
    switch (route) {
      case "/relay/getMinimalNVRStateList":
        return { nvrstates: NVRS };
      case "/relay/findDiscoveriesWithUnassignedRtspEndpoints":
        return { discoveries: [...discoveries] };
      case "/relay/getMinimalThirdPartyCameraStateList":
        return { thirdPartyCameraStateList: [...states] };
      case "/relay/assignThirdPartyCameraToNVR": {
        const request = body as { name: string; discoveredCameraMacAddress: string };
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise(r => setTimeout(r, assignMs));
        inFlight--;
        const index = discoveries.findIndex(
          d => d.macAddress === request.discoveredCameraMacAddress
        );
        const [assigned] = discoveries.splice(index, 1);
        const state = states.find(s => s.defaultInterfaceMac === assigned.macAddress) as Record<
          string,
          unknown
        >;
        Object.assign(state, {
          uuid: `cam${assignedNames.length}`,
          name: request.name,
          assignedNVRUuid: SITE_A.uuid,
        });
        assignedNames.push(request.name);
        return { deviceUuid: `cam${assignedNames.length - 1}` };
      }
      default:
        throw new Error(`unexpected route ${route}`);
    }
  });
  return { assignedNames, maxInFlight: () => maxInFlight };
}

const SHEET = [
  row("N100-TEST0001", "Front Door", "192.0.2.105"),
  row("N100-TEST0001", "Back Door", "192.0.2.106"),
  row("N100-TEST0001", "Loading Dock", "192.0.2.107"),
];

describe("third-party-cameras-tool assign", () => {
  const saved = { ...TIMING };
  beforeEach(() => {
    vi.mocked(network.postApi).mockReset();
    Object.assign(TIMING, { pauseMs: 0, startBudgetMs: 30_000, callBudgetMs: 45_000 });
  });
  afterEach(() => Object.assign(TIMING, saved));

  it("plans and asks before assigning anything", async () => {
    const api = fakeApi();
    const result = await callTool({ requestType: "assign", cameras: SHEET });
    const out = result.structuredContent ?? {};
    expect(out.needUserInput).toBe(true);
    expect(out.plan.map((p: { status: string }) => p.status)).toEqual(["ready", "ready", "ready"]);
    expect(out.commandForUser).toMatch(/confirmationId: c1[0-9a-f]{52}/);
    expect(api.assignedNames).toEqual([]);
    expect(JSON.stringify(result)).not.toContain("hunter2");
  });

  it("assigns one camera at a time once confirmed, and continues from nextStartAt", async () => {
    const api = fakeApi(20);
    const ask = await callTool({ requestType: "assign", cameras: SHEET });
    const id = /confirmationId: (c1[0-9a-f]+)/.exec(ask.structuredContent?.commandForUser)?.[1];

    // A budget that only lets the first camera start in this call.
    TIMING.startBudgetMs = 5;
    const first = await callTool({ requestType: "assign", cameras: SHEET, confirmationId: id });
    expect(first.structuredContent?.results).toEqual([
      {
        row: 0,
        name: "Front Door",
        nvr: "Site A Relay (N100-TEST0001)",
        status: "assigned",
        deviceUuid: "cam0",
      },
    ]);
    expect(first.structuredContent?.nextStartAt).toBe(1);
    expect(first.structuredContent?.remaining).toBe(2);

    TIMING.startBudgetMs = 30_000;
    const rest = await callTool({
      requestType: "assign",
      cameras: SHEET,
      confirmationId: id,
      startAt: 1,
    });
    expect(
      rest.structuredContent?.results.map((r: { name: string; status: string }) => [
        r.name,
        r.status,
      ])
    ).toEqual([
      ["Back Door", "assigned"],
      ["Loading Dock", "assigned"],
    ]);
    expect(rest.structuredContent?.nextStartAt).toBeNull();
    expect(api.assignedNames).toEqual(["Front Door", "Back Door", "Loading Dock"]);
    expect(api.maxInFlight()).toBe(1);
  });

  it("does not accept a confirmation issued for a different list", async () => {
    const api = fakeApi();
    const ask = await callTool({ requestType: "assign", cameras: SHEET.slice(0, 1) });
    const id = /confirmationId: (c1[0-9a-f]+)/.exec(ask.structuredContent?.commandForUser)?.[1];
    const result = await callTool({ requestType: "assign", cameras: SHEET, confirmationId: id });
    expect(result.structuredContent?.needUserInput).toBe(true);
    expect(api.assignedNames).toEqual([]);
  });
});

describe("third-party-cameras-tool list-cameras", () => {
  beforeEach(() => {
    vi.mocked(network.postApi).mockReset();
  });

  it("lists what one NVR has discovered, with streams redacted", async () => {
    fakeApi();
    const result = await callTool({ requestType: "list-cameras", nvr: "Site A Relay" });
    const out = result.structuredContent ?? {};
    expect(out.unassigned).toHaveLength(3);
    expect(out.unassigned[0]).toMatchObject({
      ipAddress: "192.0.2.105",
      streams: ["rtsp://192.0.2.105:554/stream1"],
      seenBy: ["Site A Relay (N100-TEST0001)"],
    });
    expect(JSON.stringify(result)).not.toContain("hunter2");

    const other = await callTool({ requestType: "list-cameras", nvr: "N500-TEST0002" });
    expect(other.structuredContent?.unassigned).toEqual([]);
  });
});
