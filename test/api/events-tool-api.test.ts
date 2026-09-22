import { describe, it, expect, vi, beforeEach } from "vitest";

import * as entity from "../../src/api/get-entity-tool-api.js";
import { describeEmptyComponentEventResult } from "../../src/api/events-tool-api.js";

vi.mock("../../src/api/get-entity-tool-api.js");

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
