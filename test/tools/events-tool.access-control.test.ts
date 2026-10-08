import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/events-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as eventsApi from "../../src/api/events-tool-api.js";
import * as entityApi from "../../src/api/get-entity-tool-api.js";
import {
  MAX_ACCESS_CONTROL_DOORS_PER_QUERY,
  resolveAccessControlledDoorUuids,
  summarizeAccessControlPeople,
} from "../../src/api/events-tool-api.js";

vi.mock("../../src/api/events-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof eventsApi>();
  return { ...actual, getAccessControlEvents: vi.fn() };
});
vi.mock("../../src/api/get-entity-tool-api.js", async importOriginal => {
  const actual = await importOriginal<typeof entityApi>();
  return { ...actual, getAccessControlledDoors: vi.fn() };
});

const START = "2026-09-29T00:00:00.000-07:00";
const END = "2026-09-29T23:59:59.999-07:00";

function withNulledArgs(overrides: Record<string, unknown>) {
  return {
    eventType: "access-control",
    startTime: START,
    endTime: END,
    accessControlledDoorUuids: null,
    deviceUuid: null,
    sensorUuid: null,
    limit: null,
    locationUuid: null,
    componentEventTypes: null,
    timeZone: "America/Los_Angeles",
    cameraUuid: null,
    duration: null,
    buttonSensorUuid: null,
    occupancySensorUuid: null,
    proximityTagUuids: null,
    doorbellCameraUuid: null,
    tempUnit: "F",
    includeFields: null,
    filterBy: null,
    ...overrides,
  };
}

async function callEventsTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const result = await client.callTool({ name: "events-tool", arguments: args });
    if (result.isError)
      console.log("events-tool error:", JSON.stringify(result.content).slice(0, 1500));
    return result;
  } finally {
    await client.close();
    await server.close();
  }
}

function payloadOf(result: Awaited<ReturnType<typeof callEventsTool>>) {
  return JSON.parse((result.content as { text: string }[])[0].text);
}

const DOORS = [
  { uuid: "door-lobby-0000000000", name: "Lobby Entry", locationUuid: "loc-hq-00000000000000" },
  {
    uuid: "door-side-00000000000",
    name: "4th - Side Entry",
    locationUuid: "loc-hq-00000000000000",
  },
  { uuid: "door-server-000000000", name: "Server Room", locationUuid: "loc-hq-00000000000000" },
  { uuid: "door-annex-0000000000", name: "Annex Door", locationUuid: "loc-annex-00000000000" },
];

const T0 = Date.parse("2026-09-29T07:50:39-07:00");
const event = (
  user: string | null,
  doorIdx: number,
  minutesAfterT0: number,
  authorizationResult = "ALLOWED",
  authenticationResult = "ACCEPTED"
) => ({
  // The API omits the originator on unknown credentials; the schema has no null.
  ...(user === null
    ? {}
    : { user, userUuid: `uuid-${user.replace(/\W/g, "").padEnd(17, "0").slice(0, 17)}` }),
  doorUuid: DOORS[doorIdx].uuid,
  doorName: DOORS[doorIdx].name,
  locationUuid: DOORS[doorIdx].locationUuid,
  timestampMs: T0 + minutesAfterT0 * 60_000,
  datetime: `September 29, 2026 at +${minutesAfterT0}m`,
  authorizationResult,
  authenticationResult,
  credSource: "NFC",
});

describe("events-tool — access-control without a door", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(entityApi.getAccessControlledDoors).mockResolvedValue({
      accessControlledDoors: DOORS,
    } as never);
    vi.mocked(eventsApi.getAccessControlEvents).mockResolvedValue([
      event("Forrest Battles", 0, 0),
      event("Kyle Krueger", 2, 683),
      event("Kyle Krueger", 0, 5),
      event(null, 0, 430, "NA", "REJECTED"),
      event("Forrest Battles", 1, 300),
    ] as never);
  });

  it("searches every door in the organization instead of asking which door", async () => {
    const result = await callEventsTool(withNulledArgs({}));
    expect(result.isError).toBeFalsy();
    const payload = payloadOf(result);

    expect(payload.needUserInput).toBeUndefined();
    expect(vi.mocked(eventsApi.getAccessControlEvents)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(eventsApi.getAccessControlEvents).mock.calls[0][0]).toEqual(
      DOORS.map(d => d.uuid)
    );
    expect(payload.scope).toContain("Searched all 4 access-controlled doors in the organization");
    expect(payload.scope).toContain("Lobby Entry");
    expect(payload.accessControlEvents).toHaveLength(5);
  });

  it("limits the door search to locationUuid when given", async () => {
    const result = await callEventsTool(withNulledArgs({ locationUuid: "loc-annex-00000000000" }));
    expect(result.isError).toBeFalsy();
    expect(vi.mocked(eventsApi.getAccessControlEvents).mock.calls[0][0]).toEqual([
      "door-annex-0000000000",
    ]);
    expect(payloadOf(result).scope).toContain("at location loc-annex-00000000000");
  });

  it("still honours an explicit door list", async () => {
    const result = await callEventsTool(
      withNulledArgs({ accessControlledDoorUuids: ["door-server-000000000"] })
    );
    expect(vi.mocked(eventsApi.getAccessControlEvents).mock.calls[0][0]).toEqual([
      "door-server-000000000",
    ]);
    expect(vi.mocked(entityApi.getAccessControlledDoors)).toHaveBeenCalledTimes(0);
    expect(payloadOf(result).scope).toBeUndefined();
  });

  it("puts a complete per-person list ahead of the event list", async () => {
    const payload = payloadOf(await callEventsTool(withNulledArgs({})));

    expect(Object.keys(payload).indexOf("people")).toBeLessThan(
      Object.keys(payload).indexOf("accessControlEvents")
    );
    expect(payload.summary).toEqual({
      events: 5,
      allowed: 4,
      denied: 1,
      named: 4,
      unnamed: 1,
      people: 2,
      doors: 3,
    });
    expect(payload.people.map((p: { user: string }) => p.user)).toEqual([
      "Forrest Battles",
      "Kyle Krueger",
    ]);
    const kyle = payload.people[1];
    expect(kyle).toMatchObject({
      events: 2,
      allowed: 2,
      doors: ["Server Room", "Lobby Entry"],
      userUuid: "uuid-KyleKrueger000000",
    });
    expect(kyle.firstTimestampMs).toBe(T0 + 5 * 60_000);
    expect(kyle.lastTimestampMs).toBe(T0 + 683 * 60_000);
  });

  it("explains an organization with no doors instead of returning nothing", async () => {
    vi.mocked(entityApi.getAccessControlledDoors).mockResolvedValue({
      accessControlledDoors: [],
    } as never);
    const payload = payloadOf(await callEventsTool(withNulledArgs({})));
    expect(vi.mocked(eventsApi.getAccessControlEvents)).toHaveBeenCalledTimes(0);
    expect(payload.needUserInput).toBeUndefined();
    expect(payload.accessControlEvents).toEqual([]);
    expect(payload.people).toEqual([]);
    expect(payload.note).toContain("no access-controlled doors");
  });

  it("points at the locations that do have doors when the given one has none", async () => {
    const payload = payloadOf(
      await callEventsTool(withNulledArgs({ locationUuid: "loc-empty-00000000000" }))
    );
    expect(vi.mocked(eventsApi.getAccessControlEvents)).toHaveBeenCalledTimes(0);
    expect(payload.note).toContain("loc-empty-00000000000 has no access-controlled doors");
    expect(payload.note).toContain("loc-hq-00000000000000 (3)");
  });

  it("caps the number of doors searched per query and says so", async () => {
    const many = Array.from({ length: MAX_ACCESS_CONTROL_DOORS_PER_QUERY + 5 }, (_, i) => ({
      uuid: `door-${String(i).padStart(17, "0")}`,
      name: `Door ${i}`,
      locationUuid: "loc-hq-00000000000000",
    }));
    const resolved = await resolveAccessControlledDoorUuids(null);
    expect(resolved.doorUuids).toEqual(DOORS.map(d => d.uuid));

    vi.mocked(entityApi.getAccessControlledDoors).mockResolvedValue({
      accessControlledDoors: many,
    } as never);
    const capped = await resolveAccessControlledDoorUuids(null);
    expect(capped.doorUuids).toHaveLength(MAX_ACCESS_CONTROL_DOORS_PER_QUERY);
    expect(capped.note).toContain("5 more doors were not searched");
  });
});

describe("summarizeAccessControlPeople", () => {
  it("orders people by first event and counts allowed vs total", () => {
    const { people, summary } = summarizeAccessControlPeople([
      event("Zed", 0, 100),
      event("Amy", 0, 10, "DENIED", "ACCEPTED"),
      event("Amy", 1, 20),
      event("  ", 0, 30),
    ]);
    expect(people.map(p => p.user)).toEqual(["Amy", "Zed"]);
    expect(people[0]).toMatchObject({
      events: 2,
      allowed: 1,
      doors: ["Lobby Entry", "4th - Side Entry"],
    });
    expect(summary).toEqual({
      events: 4,
      allowed: 3,
      denied: 1,
      named: 3,
      unnamed: 1,
      people: 2,
      doors: 2,
    });
  });

  it("counts a door without a name but never lists its uuid", () => {
    const { people } = summarizeAccessControlPeople([
      { ...event("Zed", 0, 1), doorName: undefined },
    ]);
    expect(people[0]).toMatchObject({ user: "Zed", events: 1, doors: [] });
  });

  it("handles an empty list", () => {
    expect(summarizeAccessControlPeople([])).toEqual({
      people: [],
      summary: { events: 0, allowed: 0, denied: 0, named: 0, unnamed: 0, people: 0, doors: 0 },
    });
  });
});
