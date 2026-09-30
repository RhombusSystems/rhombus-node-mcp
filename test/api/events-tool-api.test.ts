import { describe, it, expect, vi, beforeEach } from "vitest";

import * as entity from "../../src/api/get-entity-tool-api.js";
import * as network from "../../src/network/network.js";
import {
  COMPONENT_EVENTS_LIMIT,
  describeCappedComponentEventResult,
  describeEmptyComponentEventResult,
  getComponentEventsByLocation,
} from "../../src/api/events-tool-api.js";

vi.mock("../../src/api/get-entity-tool-api.js");
vi.mock("../../src/network/network.js");

// The prod failure: the model scoped component-events to a real location that
// happens to have no access-controlled doors, got {componentEvents: []}, and
// reported "no door activity in the last week" while 42 doors sat elsewhere.
const DOORLESS_LOCATION = "AZ2P1Nz1TgK3LmMVZMKIsg";
const DOOR_LOCATION_A = "R-Q_9SxuQRmYFk6m5-0leQ";
const DOOR_LOCATION_B = "_j2BpM40RmK9Il8KTkPlRw";

const DOOR_EVENT_TYPES = ["DoorStateChangeEvent", "CredentialReceivedEvent"];

function mockDoors(locationUuids: string[]) {
  vi.mocked(entity.getAccessControlledDoors).mockResolvedValue({
    accessControlledDoors: locationUuids.map((locationUuid, i) => ({
      uuid: `door-${i}`,
      name: `Door ${i}`,
      locationUuid,
    })),
  } as never);
}

describe("describeEmptyComponentEventResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("names the locations that have doors when the queried one has none", async () => {
    mockDoors([DOOR_LOCATION_A, DOOR_LOCATION_A, DOOR_LOCATION_B]);

    const note = await describeEmptyComponentEventResult(DOORLESS_LOCATION, DOOR_EVENT_TYPES);

    expect(note).toContain(`Location ${DOORLESS_LOCATION} has no access-controlled doors`);
    expect(note).toContain(`${DOOR_LOCATION_A} (2)`);
    expect(note).toContain(`${DOOR_LOCATION_B} (1)`);
  });

  it("stays silent when the queried location does have doors", async () => {
    mockDoors([DOOR_LOCATION_A]);

    expect(await describeEmptyComponentEventResult(DOOR_LOCATION_A, DOOR_EVENT_TYPES)).toBeUndefined();
  });

  it("annotates an unfiltered query, which implicitly includes door events", async () => {
    mockDoors([DOOR_LOCATION_A]);

    expect(await describeEmptyComponentEventResult(DOORLESS_LOCATION, [])).toBeDefined();
  });

  it("stays silent for a query that cannot involve doors", async () => {
    mockDoors([DOOR_LOCATION_A]);

    const note = await describeEmptyComponentEventResult(DOORLESS_LOCATION, ["ButtonEvent"]);

    expect(note).toBeUndefined();
    expect(entity.getAccessControlledDoors).not.toHaveBeenCalled();
  });

  it("says so when the org has no doors at all", async () => {
    mockDoors([]);

    expect(await describeEmptyComponentEventResult(DOORLESS_LOCATION, DOOR_EVENT_TYPES)).toContain(
      "no access-controlled doors at any location"
    );
  });

  it("degrades to no note when the door lookup fails", async () => {
    vi.mocked(entity.getAccessControlledDoors).mockRejectedValue(new Error("boom"));

    expect(await describeEmptyComponentEventResult(DOORLESS_LOCATION, DOOR_EVENT_TYPES)).toBeUndefined();
  });
});

describe("describeCappedComponentEventResult", () => {
  const events = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ timestampMs: 1_000 + i, datetime: `t${i}` }));

  it("stays silent below the API limit", () => {
    expect(describeCappedComponentEventResult(events(COMPONENT_EVENTS_LIMIT - 1))).toBeUndefined();
  });

  it("flags a result at the limit as truncated, with the span it does cover", () => {
    const note = describeCappedComponentEventResult(events(COMPONENT_EVENTS_LIMIT).reverse());

    expect(note).toContain("truncated");
    expect(note).toContain("lower bounds");
    expect(note).toContain(`span t0 to t${COMPONENT_EVENTS_LIMIT - 1}`);
  });
});

describe("getComponentEventsByLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // A report once said a door was held UNLOCKED for half an hour without naming the door:
  // the mapper dropped the door and the user, and read fields the event does not have.
  it("maps a door-state change to its door, user and source", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      componentEvents: [
        {
          type: "DoorStateChangeEvent",
          componentUuid: "component",
          componentCompositeUuid: "door-uuid",
          newState: "UNLOCKED",
          source: "ADMIN",
          originator: { type: "USER", username: "Pat Example" },
          timestampMs: 1_790_000_000_000,
        },
      ],
    } as never);

    const [event] = await getComponentEventsByLocation(
      "location",
      ["DoorStateChangeEvent"],
      undefined,
      undefined,
      "America/Los_Angeles"
    );

    expect(event).toMatchObject({
      eventType: "DoorStateChangeEvent",
      newState: "UNLOCKED",
      doorUuid: "door-uuid",
      user: "Pat Example",
      source: "ADMIN",
    });
  });
});
