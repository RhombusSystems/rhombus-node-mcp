import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  filterIncludedFields,
  applyFilterBy,
  applyGroupBy,
  createFilteringProxy,
  deepOptionalizeSchema,
  protectFields,
} from "../src/filtering-utils.js";

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

// ---------------------------------------------------------------------------
// Output-schema relaxation — the MCP SDK validates structuredContent against
// the registered outputSchema AFTER the proxy has projected it, so a required
// field the caller did not ask for used to fail the whole call with
// "MCP error -32602: Output validation error". Reproduced here with the shape
// that hit prod: events-tool/brivo-access-control, where brivoDoorId is the
// only required field under brivoDoors.
// ---------------------------------------------------------------------------

const brivoOutputShape = {
  eventType: z.enum(["brivo-access-control", "component-events"]).optional(),
  brivoAccessControlEvents: z.optional(
    z.object({
      integrationEnabled: z.boolean(),
      brivoDoorsConfigured: z.number(),
      brivoDoors: z.array(
        z.object({
          brivoDoorId: z.string().describe("Brivo's door ID"),
          doorName: z.string().optional(),
          locationUuid: z.string().optional(),
        }),
      ),
    }),
  ),
};

const brivoResult = {
  eventType: "brivo-access-control",
  brivoAccessControlEvents: {
    integrationEnabled: true,
    brivoDoorsConfigured: 2,
    brivoDoors: [
      { brivoDoorId: "11001", doorName: "Front", locationUuid: "loc-1" },
      { brivoDoorId: "11002", doorName: "Back", locationUuid: "loc-1" },
    ],
  },
};

/** Registers a tool through the proxy and hands back what the SDK would see. */
function registerThroughProxy(config: any, handler: any) {
  let registered: { config: any; handler: any } | undefined;
  const server = {
    registerTool: (_name: string, c: any, h: any) => {
      registered = { config: c, handler: h };
    },
  };
  createFilteringProxy(server as any).registerTool("test-tool", config, handler);
  return registered!;
}

/** Mirrors the SDK's post-handler check in server/mcp.js. */
function sdkValidate(outputSchema: any, structuredContent: unknown) {
  const asObject =
    outputSchema instanceof z.ZodType ? outputSchema : z.object(outputSchema);
  return asObject.safeParse(structuredContent);
}

describe("createFilteringProxy — outputSchema survives projection", () => {
  it("accepts a projection that drops a required nested field", async () => {
    const { config, handler } = registerThroughProxy(
      { description: "brivo", outputSchema: brivoOutputShape },
      async () => ({
        content: [{ type: "text", text: JSON.stringify(brivoResult) }],
        structuredContent: brivoResult,
      }),
    );

    // The exact includeFields the model sent in prod — no brivoDoorId.
    const result = await handler(
      {
        includeFields: [
          "brivoAccessControlEvents.brivoDoors.doorName",
          "brivoAccessControlEvents.brivoDoors.locationUuid",
        ],
        filterBy: null,
      },
      {},
    );

    expect(
      result.structuredContent.brivoAccessControlEvents.brivoDoors[0],
    ).toEqual({ doorName: "Front", locationUuid: "loc-1" });
    expect(sdkValidate(config.outputSchema, result.structuredContent).success).toBe(true);
  });

  it("still validates an unprojected result", async () => {
    const { config, handler } = registerThroughProxy(
      { description: "brivo", outputSchema: brivoOutputShape },
      async () => ({
        content: [{ type: "text", text: JSON.stringify(brivoResult) }],
        structuredContent: brivoResult,
      }),
    );
    const result = await handler({ includeFields: null, filterBy: null }, {});
    expect(sdkValidate(config.outputSchema, result.structuredContent).success).toBe(true);
  });

  it("leaves tools without an outputSchema alone", () => {
    const { config } = registerThroughProxy({ description: "x" }, async () => ({
      content: [],
    }));
    expect("outputSchema" in config).toBe(false);
  });

  it("keeps the field-path catalog derived from the original schema", () => {
    const { config } = registerThroughProxy(
      { description: "brivo", outputSchema: brivoOutputShape },
      async () => ({ content: [] }),
    );
    expect(config.inputSchema.includeFields.description).toContain(
      "brivoAccessControlEvents.brivoDoors.brivoDoorId",
    );
  });
});

// ---------------------------------------------------------------------------
// Protected fields — the cross-cutting set is global, everything else is
// declared by the tool that emits it via protectFields().
// ---------------------------------------------------------------------------

/** A result shaped like faces-tool's: bulky rows plus a small roster beside them. */
const rosterResult = {
  requestType: "get-face-events",
  getFaceEventsResponse: [
    { faceName: "Jess", uuid: "e1" },
    { faceName: "Alex", uuid: "e2" },
  ],
  faceEventSummary: {
    totalEventsThisPage: 2,
    identifiedPeople: [
      { name: "Jess", eventCount: 1 },
      { name: "Alex", eventCount: 1 },
    ],
  },
  note: "SCOPE CHANGED: results are org-wide.",
};

/** The narrow projection a model sends when it only wants the raw rows. */
const ROWS_ONLY = ["getFaceEventsResponse.faceName"];

function registerRosterTool(config: any) {
  return registerThroughProxy(config, async () => ({
    content: [{ type: "text", text: JSON.stringify(rosterResult) }],
    structuredContent: rosterResult,
  }));
}

describe("createFilteringProxy — protected fields", () => {
  it("keeps a field the tool declared, even when the caller didn't ask for it", async () => {
    const { handler } = registerRosterTool(
      protectFields({ description: "faces" }, ["faceEventSummary"]),
    );

    const result = await handler({ includeFields: ROWS_ONLY, filterBy: null }, {});

    // The projection still narrows the rows it was pointed at...
    expect(result.structuredContent.getFaceEventsResponse).toEqual([
      { faceName: "Jess" },
      { faceName: "Alex" },
    ]);
    // ...but the roster survives whole, subtree included.
    expect(result.structuredContent.faceEventSummary.identifiedPeople).toHaveLength(2);
    expect(JSON.parse(result.content[0].text).faceEventSummary.totalEventsThisPage).toBe(2);
  });

  it("does NOT keep that field for a tool that didn't declare it", async () => {
    const { handler } = registerRosterTool({ description: "some other tool" });

    const result = await handler({ includeFields: ROWS_ONLY, filterBy: null }, {});

    // This is the whole point of moving it off the global list.
    expect(result.structuredContent.faceEventSummary).toBeUndefined();
  });

  it("keeps the cross-cutting fields for every tool regardless", async () => {
    const { handler } = registerRosterTool({ description: "some other tool" });

    const result = await handler({ includeFields: ROWS_ONLY, filterBy: null }, {});

    expect(result.structuredContent.note).toBe("SCOPE CHANGED: results are org-wide.");
    expect(result.structuredContent.requestType).toBe("get-face-events");
  });

  it("does not hand the marker to the SDK", () => {
    const { config } = registerRosterTool(
      protectFields({ description: "faces" }, ["faceEventSummary"]),
    );

    expect(Object.getOwnPropertySymbols(config)).toHaveLength(0);
  });

  it("leaves an unprojected result untouched", async () => {
    const { handler } = registerRosterTool(
      protectFields({ description: "faces" }, ["faceEventSummary"]),
    );

    const result = await handler({ includeFields: null, filterBy: null }, {});

    expect(result.structuredContent).toEqual(rosterResult);
  });
});

describe("deepOptionalizeSchema", () => {
  it("relaxes objects nested in arrays, records and unions", () => {
    const schema = z.object({
      rows: z.array(z.object({ id: z.string(), name: z.string().optional() })),
      byKey: z.record(z.string(), z.object({ id: z.string() })),
      either: z.union([
        z.object({ kind: z.literal("a"), a: z.string() }),
        z.object({ kind: z.literal("b"), b: z.string() }),
      ]),
    });
    const relaxed = deepOptionalizeSchema(schema);
    expect(
      relaxed.safeParse({ rows: [{ name: "x" }], byKey: { k: {} }, either: {} })
        .success,
    ).toBe(true);
    // Still a schema, not a passthrough: wrong types are rejected.
    expect(relaxed.safeParse({ rows: "not-an-array" }).success).toBe(false);
  });

  it("preserves descriptions", () => {
    const relaxed = deepOptionalizeSchema(
      z.object({ id: z.string().describe("the id") }).describe("a row"),
    );
    expect(relaxed.description).toBe("a row");
    expect((relaxed as any).shape.id.description).toBe("the id");
  });
});

// ---------------------------------------------------------------------------
// Phantom-field filterBy — a condition on a field no item has used to silently
// drop every row, so the model read {cameras: [], camerasCount: 213} as
// "0 offline" (the live get-entity `connected` incident). Such conditions are
// now skipped with a loud warning, and sibling <key>Count fields are synced to
// the filtered array length.
// ---------------------------------------------------------------------------

describe("applyFilterBy — phantom fields and count sync", () => {
  const cameras = [
    { uuid: "cam-1", name: "Front Door", connectionStatus: "GREEN" },
    { uuid: "cam-2", name: "Loading Dock", connectionStatus: "RED" },
    { uuid: "cam-3", name: "Lobby", connectionStatus: "GREEN" },
  ];

  it("skips a condition on a field absent from every item and warns loudly", () => {
    const result = applyFilterBy(
      { cameras, camerasCount: 3 },
      [{ field: "connected", op: "=", value: false }],
    );
    expect(result.cameras).toHaveLength(3); // NOT silently emptied
    expect(result.filterByWarnings).toHaveLength(1);
    expect(result.filterByWarnings[0]).toContain('"connected"');
    expect(result.filterByWarnings[0]).toContain("IGNORED");
    expect(result.filterByWarnings[0]).toContain("connectionStatus"); // advertises real fields
  });

  it("applies valid conditions while skipping phantom ones", () => {
    const result = applyFilterBy(
      { cameras },
      [
        { field: "connected", op: "=", value: false },
        { field: "connectionStatus", op: "=", value: "RED" },
      ],
    );
    expect(result.cameras).toHaveLength(1);
    expect(result.cameras[0].uuid).toBe("cam-2");
    expect(result.filterByWarnings).toHaveLength(1);
  });

  it("syncs <key>Count siblings to the filtered array length", () => {
    const result = applyFilterBy(
      { cameras, camerasCount: 3 },
      [{ field: "connectionStatus", op: "=", value: "RED" }],
    );
    expect(result.cameras).toHaveLength(1);
    expect(result.camerasCount).toBe(1);
  });

  it("does not warn for a filter against an empty array", () => {
    const result = applyFilterBy(
      { cameras: [], camerasCount: 0 },
      [{ field: "connected", op: "=", value: false }],
    );
    expect(result.cameras).toEqual([]);
    expect(result.filterByWarnings).toBeUndefined();
  });

  it("still syncs the legacy bare `count` sibling", () => {
    const result = applyFilterBy(
      { items: [{ a: 1 }, { a: 2 }], count: 2 },
      [{ field: "a", op: "=", value: 1 }],
    );
    expect(result.items).toHaveLength(1);
    expect(result.count).toBe(1);
  });

  it("warns per targeted array with a dotted top-key condition", () => {
    const result = applyFilterBy(
      { cameras, doorStates: [{ uuid: "d1", locked: true }] },
      [{ field: "cameras.connected", op: "=", value: false }],
    );
    expect(result.cameras).toHaveLength(3);
    expect(result.doorStates).toHaveLength(1); // untargeted array untouched
    expect(result.filterByWarnings).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// applyGroupBy — server-side per-group counts, so "how many per X" is computed
// in code instead of the model tallying rows (observed off-by-one on ITG:
// 36 vs 37 offline at a location, tallied from 63 in-context rows).
// ---------------------------------------------------------------------------

describe("applyGroupBy", () => {
  const cams = [
    { uuid: "c1", locationUuid: "loc-a", connected: false },
    { uuid: "c2", locationUuid: "loc-a", connected: false },
    { uuid: "c3", locationUuid: "loc-b", connected: false },
    { uuid: "c4", locationUuid: "loc-a", connected: true },
  ];

  it("replaces the array with exact per-group counts, sorted descending", () => {
    const result = applyGroupBy({ cameras: cams, camerasCount: 4 }, "locationUuid");
    expect(result.cameras).toBeUndefined();
    expect(result.camerasGrouped).toEqual({
      by: "locationUuid",
      total: 4,
      groups: { "loc-a": 3, "loc-b": 1 },
    });
    expect(result.camerasCount).toBe(4);
  });

  it("composes with filterBy: offline per location", () => {
    const filtered = applyFilterBy({ cameras: cams, camerasCount: 4 }, [
      { field: "connected", op: "=", value: false },
    ]);
    const result = applyGroupBy(filtered, "locationUuid");
    expect(result.camerasGrouped.groups).toEqual({ "loc-a": 2, "loc-b": 1 });
    expect(result.camerasGrouped.total).toBe(3);
    expect(result.camerasCount).toBe(3);
  });

  it("targets one array with a dotted path and leaves others alone", () => {
    const result = applyGroupBy(
      { cameras: cams, doorStates: [{ uuid: "d1" }] },
      "cameras.locationUuid",
    );
    expect(result.camerasGrouped).toBeDefined();
    expect(result.doorStates).toHaveLength(1);
  });

  it("warns and keeps rows when no item has the field", () => {
    const result = applyGroupBy({ cameras: cams }, "sector");
    expect(result.cameras).toHaveLength(4);
    expect(result.camerasGrouped).toBeUndefined();
    expect(result.groupByWarnings[0]).toContain('"sector"');
    expect(result.groupByWarnings[0]).toContain("locationUuid");
  });

  it("warns when the targeted array key does not exist", () => {
    const result = applyGroupBy({ cameras: cams }, "widgets.locationUuid");
    expect(result.cameras).toHaveLength(4);
    expect(result.groupByWarnings[0]).toContain("widgets");
  });

  it("buckets missing values under (none)", () => {
    const result = applyGroupBy(
      { cameras: [...cams, { uuid: "c5", connected: false }] },
      "locationUuid",
    );
    expect(result.camerasGrouped.groups["(none)"]).toBe(1);
  });

  it("caps high-cardinality groupings and reports the omission", () => {
    const wide = Array.from({ length: 120 }, (_, i) => ({ uuid: `u${i}`, tag: `t${i}` }));
    const result = applyGroupBy({ items: wide }, "tag");
    expect(Object.keys(result.itemsGrouped.groups)).toHaveLength(50);
    expect(result.itemsGrouped.omittedGroups).toBe(70);
    expect(result.itemsGrouped.note).toContain("120 distinct");
  });

  it("grouped summaries survive an includeFields projection", () => {
    const grouped = applyGroupBy({ cameras: cams, camerasCount: 4 }, "locationUuid");
    const projected = filterIncludedFields(grouped, ["cameras.uuid", "cameras.name"]);
    expect(projected.camerasGrouped).toBeDefined();
    expect(projected.camerasGrouped.groups["loc-a"]).toBe(3);
    expect(projected.camerasCount).toBe(4);
  });
});
