import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createTool } from "../../src/tools-console/create-camera-policy-tool.js";
import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const SCHEDULE_UUID = "Wq1nR0kBS9y_2hZpVvGkAA";
const CAMERA_UUID = "4Toqs6naTbulCRen-RxAPA";
const CAMERA_UUID_2 = "9Kpqr2nbTculDRfn-SxBQB";
const CREATED_POLICY_UUID = "pol1cyUu1dS9y2hZpVvGkAA";

/** The proxy injects `includeFields` / `filterBy` / `groupBy` as nullable args. */
function withNulledArgs(overrides: Record<string, unknown> = {}) {
  return { includeFields: null, filterBy: null, groupBy: null, ...overrides };
}

async function callTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "create-camera-policy-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function textOf(result: Awaited<ReturnType<typeof callTool>>): string {
  return (result.content as { text: string }[]).map(item => item.text).join("\n");
}

function routesCalled(): string[] {
  return vi.mocked(network.postApi).mock.calls.map(call => call[0].route);
}

/** Happy path: create → schedules → cameras all succeed. */
function mockAllPhasesOk() {
  vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
    if (route === "/policy/createCameraPolicy") {
      return { error: false, policyUuid: CREATED_POLICY_UUID };
    }
    return { error: false };
  }) as never);
}

function fullRunArgs(overrides: Record<string, unknown> = {}) {
  return withNulledArgs({
    name: "After Hours Motion",
    description: "Alert on people and vehicles after hours",
    orgUuid: "org1234567890abcdefghi",
    scheduleConfigs: JSON.stringify([
      { scheduleUuid: SCHEDULE_UUID, activities: ["MOTION_HUMAN", "MOTION_CAR"] },
    ]),
    cameraUuids: `${CAMERA_UUID},${CAMERA_UUID_2}`,
    ...overrides,
  });
}

describe("create-camera-policy-tool — malformed scheduleConfigs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The prod failure (2026-08-04). The playbook tells the model to JSON-encode
  // structured values into the form context; it then re-embedded the encoded
  // string, so `activities` arrived as a STRING containing an array. The old code
  // ran `config.activities.map` inside the JSON.parse try-block and reported
  // "scheduleConfigs is not valid JSON (config.activities.map is not a
  // function)" — which the model relayed as "an invalid configuration format".
  it("accepts a double-encoded activities array instead of failing on it", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, activities: JSON.stringify(["MOTION_HUMAN"]) },
        ]),
      })
    );

    expect(result.isError).toBeFalsy();
    expect(routesCalled()).toEqual([
      "/policy/createCameraPolicy",
      "/policy/updateCameraPolicy",
      "/camera/updateDetailsBulkV2",
    ]);
    const scheduleCall = vi
      .mocked(network.postApi)
      .mock.calls.find(call => call[0].route === "/policy/updateCameraPolicy")!;
    expect((scheduleCall[0].body as any).policy.scheduledTriggers).toEqual([
      { scheduleUuid: SCHEDULE_UUID, triggerSet: [{ activity: "MOTION_HUMAN" }] },
    ]);
  });

  it("accepts a comma-separated activities string", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, activities: "MOTION_HUMAN, MOTION_CAR" },
        ]),
      })
    );

    expect(result.isError).toBeFalsy();
    const scheduleCall = vi
      .mocked(network.postApi)
      .mock.calls.find(call => call[0].route === "/policy/updateCameraPolicy")!;
    expect((scheduleCall[0].body as any).policy.scheduledTriggers[0].triggerSet).toEqual([
      { activity: "MOTION_HUMAN" },
      { activity: "MOTION_CAR" },
    ]);
  });

  it("accepts a double-encoded scheduleConfigs string", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify(
          JSON.stringify([{ scheduleUuid: SCHEDULE_UUID, activities: ["MOTION"] }])
        ),
      })
    );

    expect(result.isError).toBeFalsy();
    expect(routesCalled()).toContain("/policy/createCameraPolicy");
  });

  it("accepts a single config object instead of a one-element array", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify({
          scheduleUuid: SCHEDULE_UUID,
          activities: ["MOTION_HUMAN"],
        }),
      })
    );

    expect(result.isError).toBeFalsy();
    expect(routesCalled()).toContain("/policy/updateCameraPolicy");
  });

  it("accepts the API's own triggerSet shape", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, triggerSet: [{ activity: "MOTION_CAR" }] },
        ]),
      })
    );

    expect(result.isError).toBeFalsy();
    const scheduleCall = vi
      .mocked(network.postApi)
      .mock.calls.find(call => call[0].route === "/policy/updateCameraPolicy")!;
    expect((scheduleCall[0].body as any).policy.scheduledTriggers[0].triggerSet).toEqual([
      { activity: "MOTION_CAR" },
    ]);
  });

  it("rejects truly malformed JSON with the expected shape, before any mutation", async () => {
    const result = await callTool(
      fullRunArgs({ scheduleConfigs: '[{"scheduleUuid": "abc"' })
    );

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("not valid JSON");
    // The model needs the target shape, not just "invalid".
    expect(text).toContain("scheduleUuid");
    expect(text).toContain("activities");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("names the offending field when activities is unreadable", async () => {
    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([{ scheduleUuid: SCHEDULE_UUID, activities: 42 }]),
      })
    );

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("scheduleConfigs[0].activities");
    expect(text).not.toContain("is not a function");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  // The playbook used to offer activities that were not in the API's ActivityEnum
  // at all: create succeeded, updateCameraPolicy then rejected them, and the user
  // was left with an empty orphan policy. (The original offenders, LOITER_HUMAN /
  // INACTIVITY_HUMAN, were added to ActivityEnum in the 2026-08-04 spec, so this
  // now uses a value that is still not a constant.)
  it("rejects an activity that is not an API constant before creating anything", async () => {
    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, activities: ["NOT_A_REAL_ACTIVITY"] },
        ]),
      })
    );

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("NOT_A_REAL_ACTIVITY");
    expect(text).toContain("MOTION_HUMAN"); // lists what IS supported
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("rejects a display label rather than sending it to the API", async () => {
    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, activities: ["Human Movement"] },
        ]),
      })
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("HUMAN_MOVEMENT");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("rejects a schedule name where a uuid belongs", async () => {
    const result = await callTool(
      fullRunArgs({
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: "Business Hours", activities: ["MOTION_HUMAN"] },
        ]),
      })
    );

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("Business Hours");
    expect(text).toContain("not a UUID");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });
});

describe("create-camera-policy-tool — cameraUuids validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a JSON-array-encoded cameraUuids", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      fullRunArgs({ cameraUuids: JSON.stringify([CAMERA_UUID, CAMERA_UUID_2]) })
    );

    expect(result.isError).toBeFalsy();
    const cameraCall = vi
      .mocked(network.postApi)
      .mock.calls.find(call => call[0].route === "/camera/updateDetailsBulkV2")!;
    expect((cameraCall[0].body as any).cameraBulkDetails.map((d: any) => d.uuid)).toEqual([
      CAMERA_UUID,
      CAMERA_UUID_2,
    ]);
  });

  it("rejects camera names before creating the policy", async () => {
    const result = await callTool(fullRunArgs({ cameraUuids: "Front Door, Back Lot" }));

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("Front Door");
    expect(text).toContain("not camera names");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  // Previously: cameraList was empty, the `cameraList.length > 0` branch fell
  // through with no return, and execution continued into policy creation —
  // creating a second policy and reporting success.
  it("does not fall through to policy creation when cameraUuids is unusable", async () => {
    mockAllPhasesOk();

    const result = await callTool(
      withNulledArgs({
        name: "Should Not Be Created",
        policyUuid: CREATED_POLICY_UUID,
        cameraUuids: " , , ",
      })
    );

    expect(result.isError).toBe(true);
    expect(routesCalled()).not.toContain("/policy/createCameraPolicy");
  });
});

describe("create-camera-policy-tool — error classification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("labels a pre-mutation validation failure RETRYABLE", async () => {
    const result = await callTool(fullRunArgs({ scheduleConfigs: "not json at all" }));

    const text = textOf(result);
    expect(text).toContain("RETRYABLE");
    expect(text).toContain("nothing was created or changed");
    expect(text).not.toContain("PARTIAL STATE");
    // Survives the caller's projection, so the model still sees the reason.
    expect((result.structuredContent as { message?: string }).message).toContain("RETRYABLE");
  });

  it("labels a failed create RETRYABLE and surfaces the API's message", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      error: true,
      errorMsg: "a policy with that name already exists",
    } as never);

    const result = await callTool(fullRunArgs());

    const text = textOf(result);
    expect(text).toContain("RETRYABLE");
    expect(text).toContain("a policy with that name already exists");
    expect(routesCalled()).toEqual(["/policy/createCameraPolicy"]);
  });

  it("labels a schedule failure after a successful create PARTIAL STATE", async () => {
    vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
      if (route === "/policy/createCameraPolicy") {
        return { error: false, policyUuid: CREATED_POLICY_UUID };
      }
      return { error: true, errorMsg: "schedule not found" };
    }) as never);

    const result = await callTool(fullRunArgs());

    const text = textOf(result);
    expect(text).toContain("PARTIAL STATE");
    expect(text).toContain("do NOT retry");
    expect(text).toContain(CREATED_POLICY_UUID);
    expect(text).toContain("schedule not found");
    expect(text).not.toContain("RETRYABLE");
    // Camera assignment must not run after the schedule step failed.
    expect(routesCalled()).not.toContain("/camera/updateDetailsBulkV2");
  });

  it("labels a camera-assignment failure after create+schedules PARTIAL STATE", async () => {
    vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
      if (route === "/policy/createCameraPolicy") {
        return { error: false, policyUuid: CREATED_POLICY_UUID };
      }
      if (route === "/camera/updateDetailsBulkV2") {
        return { error: true, errorMsg: "camera is offline" };
      }
      return { error: false };
    }) as never);

    const result = await callTool(fullRunArgs());

    const text = textOf(result);
    expect(text).toContain("PARTIAL STATE");
    expect(text).toContain("camera is offline");
  });

  // The legacy per-step calls mutate an EXISTING policy, so retrying the failed
  // step is safe — but re-creating the policy is not.
  it("labels a legacy step failure retryable while forbidding a second policy", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      error: true,
      errorMsg: "schedule not found",
    } as never);

    const result = await callTool(
      withNulledArgs({
        policyUuid: CREATED_POLICY_UUID,
        policyName: "After Hours Motion",
        scheduleConfigs: JSON.stringify([
          { scheduleUuid: SCHEDULE_UUID, activities: ["MOTION_HUMAN"] },
        ]),
      })
    );

    const text = textOf(result);
    expect(text).toContain("RETRYABLE");
    expect(text).toContain("already exists");
    expect(text).toContain("do NOT create another one");
  });
});

describe("create-camera-policy-tool — phase selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuses a full input set that also carries a policyUuid", async () => {
    const result = await callTool(fullRunArgs({ policyUuid: CREATED_POLICY_UUID }));

    const text = textOf(result);
    expect(result.isError).toBe(true);
    expect(text).toContain("RETRYABLE");
    expect(text).toContain("Ambiguous");
    // Neither creation nor a silent camera-assignment-only run.
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  // Only the literal "[]" used to be recognized as "no schedules yet" on a
  // legacy step-1 call. Every other spelling of empty entered the schedule
  // branch instead: "[ ]" hit `configs.length === 0` and fell through, and
  // '"[]"' made `configs.length` read 2 off a string and then threw on
  // `configs.map` — reported as "Error configuring schedules".
  it.each(["[]", "[ ]", "[\n]", '"[]"'])(
    "treats %s as no schedule configs and creates the policy",
    async emptyConfigs => {
      vi.mocked(network.postApi).mockResolvedValue({
        error: false,
        policyUuid: CREATED_POLICY_UUID,
      } as never);

      const result = await callTool(
        withNulledArgs({ name: "New Policy", scheduleConfigs: emptyConfigs })
      );

      expect(result.isError).toBeFalsy();
      expect(routesCalled()).toEqual(["/policy/createCameraPolicy"]);
      expect(textOf(result)).toContain(CREATED_POLICY_UUID);
    }
  );

  it("assigns cameras on the legacy step without claiming the whole setup finished", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false } as never);

    const result = await callTool(
      withNulledArgs({
        policyUuid: CREATED_POLICY_UUID,
        policyName: "After Hours Motion",
        cameraUuids: CAMERA_UUID,
      })
    );

    const text = textOf(result);
    expect(result.isError).toBeFalsy();
    expect(text).toContain("assigned to 1 camera");
    expect(text).not.toContain("completely finished");
    expect(text).not.toContain("fully active");
  });

  it("refuses to assign cameras with an empty policyUuid", async () => {
    const result = await callTool(withNulledArgs({ cameraUuids: CAMERA_UUID }));

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("policyUuid is empty");
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });

  it("still runs the happy path end to end", async () => {
    mockAllPhasesOk();

    const result = await callTool(fullRunArgs());

    expect(result.isError).toBeFalsy();
    expect(routesCalled()).toEqual([
      "/policy/createCameraPolicy",
      "/policy/updateCameraPolicy",
      "/camera/updateDetailsBulkV2",
    ]);
    const structured = result.structuredContent as { policyUuid?: string; message?: string };
    expect(structured.policyUuid).toBe(CREATED_POLICY_UUID);
    expect(structured.message).toContain("2 camera(s)");
  });

  it("surfaces an API warning on an otherwise successful run", async () => {
    vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
      if (route === "/policy/createCameraPolicy") {
        return {
          error: false,
          policyUuid: CREATED_POLICY_UUID,
          warningMsg: "2 cameras do not support vehicle detection",
        };
      }
      return { error: false };
    }) as never);

    const result = await callTool(fullRunArgs());

    expect(result.isError).toBeFalsy();
    expect(textOf(result)).toContain("2 cameras do not support vehicle detection");
  });
});
