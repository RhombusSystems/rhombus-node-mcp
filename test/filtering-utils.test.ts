import { describe, it, expect } from "vitest";
import { filterIncludedFields, applyFilterBy } from "../src/filtering-utils.js";

// ---------------------------------------------------------------------------
// Protected status fields — a model-supplied includeFields projection must not
// be able to strip connectivity/health off a device list (the "camera status"
// prod failure: project to name/uuid, then report "status not included").
// ---------------------------------------------------------------------------

const cameraStates = [
  {
    uuid: "cam-1",
    name: "Front Door",
    connected: true,
    healthStatus: "GREEN",
    healthStatusDetails: "OK",
    firmwareVersion: "1.2.3",
    serialNumber: "SN1",
  },
  {
    uuid: "cam-2",
    name: "Loading Dock",
    connected: false,
    healthStatus: "RED",
    healthStatusDetails: "Offline 3d",
    firmwareVersion: "1.2.3",
    serialNumber: "SN2",
  },
];

describe("filterIncludedFields — protected status fields", () => {
  it("retains connectivity/health fields when the projection omits them", () => {
    const result = filterIncludedFields(
      { cameraStates },
      ["cameraStates.name", "cameraStates.uuid"],
    );
    expect(result.cameraStates).toEqual([
      {
        uuid: "cam-1",
        name: "Front Door",
        connected: true,
        healthStatus: "GREEN",
        healthStatusDetails: "OK",
      },
      {
        uuid: "cam-2",
        name: "Loading Dock",
        connected: false,
        healthStatus: "RED",
        healthStatusDetails: "Offline 3d",
      },
    ]);
    // Non-protected fields the model excluded stay excluded.
    expect(result.cameraStates[0].firmwareVersion).toBeUndefined();
    expect(result.cameraStates[0].serialNumber).toBeUndefined();
  });

  it("does not invent protected fields the payload never had", () => {
    const result = filterIncludedFields(
      { events: [{ id: 1, kind: "motion", raw: "x" }] },
      ["events.id"],
    );
    expect(result.events).toEqual([{ id: 1 }]);
  });

  it("leaves an include-all subtree untouched", () => {
    const result = filterIncludedFields({ cameraStates }, ["cameraStates"]);
    expect(result.cameraStates).toEqual(cameraStates);
  });

  it("protects status fields at nested levels too", () => {
    const doc = {
      locations: [
        {
          name: "HQ",
          devices: [
            { uuid: "d1", name: "Cam A", connected: true, extra: "drop-me" },
          ],
        },
      ],
    };
    const result = filterIncludedFields(doc, ["locations.devices.name"]);
    expect(result.locations[0].devices[0]).toEqual({
      name: "Cam A",
      connected: true,
    });
  });

  it("returns the object unchanged when no includeFields are given", () => {
    const doc = { cameraStates };
    expect(filterIncludedFields(doc, [])).toBe(doc);
  });
});

describe("applyFilterBy — unaffected by the protection", () => {
  it("still filters rows on any field, protected or not", () => {
    const result = applyFilterBy({ cameraStates }, [
      { field: "cameraStates.connected", op: "=", value: false },
    ]);
    expect(result.cameraStates).toHaveLength(1);
    expect(result.cameraStates[0].uuid).toBe("cam-2");
  });
});
