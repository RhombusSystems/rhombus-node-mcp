import { describe, expect, it } from "vitest";
import DeviceType from "../src/types/deviceType.js";

// ---------------------------------------------------------------------------
// Drift guard: rhombus-mind-types defines EntityType (the dynamic-form
// palette's entity-select vocabulary) as a superset of this repo's DeviceType,
// with values DUPLICATED because the two packages share no dependency edge.
// See rhombus-mind-root/DYNAMIC_FORMS_DESIGN.md.
//
// MIND_TYPES_ENTITY_TYPE_VALUES below is a snapshot of
// rhombus-mind-types/src/response/dynamic-form.ts::EntityType. If this test
// fails, someone changed DeviceType here — propagate the change to EntityType
// in rhombus-mind-types, then update the snapshot.
// ---------------------------------------------------------------------------

const MIND_TYPES_ENTITY_TYPE_VALUES = [
  // device entities (must mirror DeviceType verbatim)
  "camera",
  "doorbell-camera",
  "badge-reader",
  "access-control-door",
  "audio-gateway",
  "door-sensor",
  "environmental-sensor",
  "motion-sensor",
  "button",
  "keypad",
  "environmental-gateway",
  // non-device entities (EntityType only)
  "location",
  "schedule",
];

describe("EntityType (rhombus-mind-types) stays a superset of DeviceType", () => {
  it("every DeviceType value exists in EntityType", () => {
    const missing = Object.values(DeviceType).filter(
      (v) => !MIND_TYPES_ENTITY_TYPE_VALUES.includes(v)
    );
    expect(
      missing,
      `DeviceType value(s) [${missing.join(", ")}] are missing from EntityType in ` +
        `rhombus-mind-types/src/response/dynamic-form.ts — add them there, then update ` +
        `MIND_TYPES_ENTITY_TYPE_VALUES in this test`
    ).toEqual([]);
  });

  it("snapshot's device subset exactly matches DeviceType (catches removals/renames)", () => {
    const deviceValues = Object.values(DeviceType) as string[];
    const snapshotDeviceSubset = MIND_TYPES_ENTITY_TYPE_VALUES.filter(
      (v) => !["location", "schedule"].includes(v)
    );
    expect(snapshotDeviceSubset.sort()).toEqual([...deviceValues].sort());
  });
});
