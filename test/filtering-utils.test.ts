import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  filterIncludedFields,
  applyFilterBy,
  createFilteringProxy,
  deepOptionalizeSchema,
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
// that hit prod: events-tool/brivo-access-control, where brivoDoornId is the
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
          brivoDoornId: z.string().describe("Brivo's door ID"),
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
      { brivoDoornId: "11001", doorName: "Front", locationUuid: "loc-1" },
      { brivoDoornId: "11002", doorName: "Back", locationUuid: "loc-1" },
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

    // The exact includeFields the model sent in prod — no brivoDoornId.
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
      "brivoAccessControlEvents.brivoDoors.brivoDoornId",
    );
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
