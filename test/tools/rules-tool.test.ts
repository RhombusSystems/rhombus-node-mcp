import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/rules-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
  const actual = await importOriginal<typeof network>();
  return { ...actual, postApi: vi.fn() };
});

const RULE_UUID = "ru1eUu1dS9y2hZpVvGkAAA";
const SENSOR_LEFT = "sensorLeftS9y2hZpVvGkA";
const SENSOR_RIGHT = "sensorRightS9y2hZpVvGk";
const GATEWAY_UUID = "gatewayUu1dS9y2hZpVvGk";
const CLIP_UUID = "c1ipUu1dS9y2hZpVvGkAAA";
const SCHEDULE_UUID = "Wq1nR0kBS9y_2hZpVvGkAA";

const DOOR_RULE = {
  uuid: RULE_UUID,
  name: "Back Door",
  orgUuid: "orgUu1dS9y2hZpVvGkAAAA",
  ruleType: "USER_DEFINED",
  conjunction: "OR",
  ruleFilters: { scheduleUuids: [SCHEDULE_UUID], triggerBackoffSecs: 15 },
  triggers: [
    {
      type: "DEVICE_ACTIVITY_EVENT",
      activityEvent: { activityEvent: "DOOR_AJAR", doorAjarThresholdSec: 300 },
      deviceUuids: [SENSOR_LEFT, SENSOR_RIGHT],
      locationUuids: [],
    },
  ],
  action: {
    audioPlaybackActions: [{ audioClipUuid: CLIP_UUID, audioGateways: [GATEWAY_UUID] }],
    webhookActions: [],
  },
};

function withNulledArgs(overrides: Record<string, unknown> = {}) {
  return {
    includeFields: null,
    filterBy: null,
    groupBy: null,
    ruleUuid: null,
    ruleName: null,
    ruleConfig: null,
    ...overrides,
  };
}

async function callTool(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));

  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    return await client.callTool({ name: "rules-tool", arguments: args });
  } finally {
    await client.close();
    await server.close();
  }
}

function resultText(result: Awaited<ReturnType<typeof callTool>>): string {
  return (result.content as { text: string }[])[0].text;
}

function mockRoutes(overrides: Record<string, unknown> = {}) {
  const table: Record<string, unknown> = {
    "/rules/getRulesForOrg": { rules: [DOOR_RULE] },
    "/rules/updateRule": {},
    "/rules/createRule": { ruleUuid: "newRu1eS9y2hZpVvGkAAAA" },
    "/deviceconfig/getFacetedConfig": {
      config: { doorSensorSettings: { ajar_threshold_enabled: true, ajar_threshold_sec: 15 } },
    },
    ...overrides,
  };
  vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
    if (!(route in table)) throw new Error(`unexpected route ${route}`);
    return table[route];
  }) as never);
}

function callsTo(route: string) {
  return vi.mocked(network.postApi).mock.calls.filter(call => call[0].route === route);
}

describe("rules-tool", () => {
  beforeEach(() => {
    vi.mocked(network.postApi).mockReset();
  });

  describe("update", () => {
    it("sends the complete rule inside ruleUpdate, keeping the fields it did not change", async () => {
      mockRoutes();
      const triggers = [{ ...DOOR_RULE.triggers[0], deviceUuids: [SENSOR_LEFT] }];

      const result = await callTool(
        withNulledArgs({
          requestType: "update",
          ruleUuid: RULE_UUID,
          ruleConfig: JSON.stringify({ triggers }),
        })
      );

      expect(result.isError).toBeFalsy();
      const body = callsTo("/rules/updateRule")[0][0].body as { ruleUpdate: typeof DOOR_RULE };
      // updateRule replaces the stored rule, so the action, filters and name must ride along.
      expect(body.ruleUpdate).toEqual({ ...DOOR_RULE, triggers });
      expect(result.structuredContent).toMatchObject({
        rule: { uuid: RULE_UUID, name: "Back Door", success: true, changedFields: ["triggers"] },
      });
    });

    it("renames with ruleName", async () => {
      mockRoutes();
      await callTool(
        withNulledArgs({
          requestType: "update",
          ruleUuid: RULE_UUID,
          ruleName: "Back Door Announcer",
          ruleConfig: "{}",
        })
      );
      const body = callsTo("/rules/updateRule")[0][0].body as { ruleUpdate: typeof DOOR_RULE };
      expect(body.ruleUpdate.name).toBe("Back Door Announcer");
      expect(body.ruleUpdate.action).toEqual(DOOR_RULE.action);
    });

    it("accepts a config already wrapped in the API's ruleUpdate envelope", async () => {
      mockRoutes();
      await callTool(
        withNulledArgs({
          requestType: "update",
          ruleUuid: RULE_UUID,
          ruleConfig: JSON.stringify({ ruleUpdate: { conjunction: "AND" } }),
        })
      );
      const body = callsTo("/rules/updateRule")[0][0].body as { ruleUpdate: typeof DOOR_RULE };
      expect(body.ruleUpdate.conjunction).toBe("AND");
      expect(body.ruleUpdate.triggers).toEqual(DOOR_RULE.triggers);
    });

    it("rejects a guessed rule shape without calling the API", async () => {
      mockRoutes();
      const result = await callTool(
        withNulledArgs({
          requestType: "update",
          ruleUuid: RULE_UUID,
          ruleConfig: JSON.stringify({
            trigger: { type: "DOOR_OPEN", deviceUuids: [SENSOR_LEFT], durationSeconds: 15 },
            actions: [{ type: "PLAY_AUDIO", audioGatewayUuid: GATEWAY_UUID, message: "Door open" }],
          }),
        })
      );

      expect(result.isError).toBe(true);
      expect(resultText(result)).toContain("RETRYABLE — nothing was changed");
      expect(resultText(result)).toContain("trigger, actions");
      expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
    });

    it("refuses an unknown rule uuid instead of creating a rule with it", async () => {
      mockRoutes();
      const result = await callTool(
        withNulledArgs({
          requestType: "update",
          ruleUuid: "unknownRu1eS9y2hZpVvGkA",
          ruleConfig: JSON.stringify({ conjunction: "AND" }),
        })
      );
      expect(result.isError).toBe(true);
      expect(resultText(result)).toContain("No rule in this organization");
      expect(callsTo("/rules/updateRule")).toHaveLength(0);
    });

    it("reports invalid JSON as retryable", async () => {
      mockRoutes();
      const result = await callTool(
        withNulledArgs({ requestType: "update", ruleUuid: RULE_UUID, ruleConfig: "{triggers:" })
      );
      expect(resultText(result)).toContain("RETRYABLE");
      expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("sends the rule inside the rule envelope", async () => {
      mockRoutes();
      const { uuid: _uuid, orgUuid: _org, name: _name, ...config } = DOOR_RULE;

      const result = await callTool(
        withNulledArgs({
          requestType: "create",
          ruleName: "Side Door",
          ruleConfig: JSON.stringify(config),
        })
      );

      expect(result.isError).toBeFalsy();
      const body = callsTo("/rules/createRule")[0][0].body as { rule: Record<string, unknown> };
      expect(body.rule).toEqual({ ...config, name: "Side Door" });
    });

    it("needs a trigger and an action", async () => {
      mockRoutes();
      const result = await callTool(
        withNulledArgs({
          requestType: "create",
          ruleName: "Side Door",
          ruleConfig: JSON.stringify({ triggers: DOOR_RULE.triggers }),
        })
      );
      expect(resultText(result)).toContain("RETRYABLE");
      expect(callsTo("/rules/createRule")).toHaveLength(0);
    });
  });

  describe("get", () => {
    it("returns the full rule with each door sensor's ajar delay", async () => {
      mockRoutes();
      const result = await callTool(withNulledArgs({ requestType: "get", ruleUuid: RULE_UUID }));

      const rule = (result.structuredContent as { rule: Record<string, unknown> }).rule;
      expect(rule.triggers).toEqual(DOOR_RULE.triggers);
      expect(rule.action).toEqual(DOOR_RULE.action);
      expect(rule.doorSensorAjarSeconds).toEqual([
        {
          deviceUuid: SENSOR_LEFT,
          ajarThresholdEnabled: true,
          ajarThresholdSec: 15,
          effectiveAjarSeconds: 15,
        },
        {
          deviceUuid: SENSOR_RIGHT,
          ajarThresholdEnabled: true,
          ajarThresholdSec: 15,
          effectiveAjarSeconds: 15,
        },
      ]);
      expect(callsTo("/deviceconfig/getFacetedConfig").map(call => call[0].body)).toEqual([
        { deviceUuid: SENSOR_LEFT },
        { deviceUuid: SENSOR_RIGHT },
      ]);
    });

    it("reports the 30-second default when a sensor's threshold is disabled", async () => {
      mockRoutes({
        "/deviceconfig/getFacetedConfig": {
          config: { doorSensorSettings: { ajar_threshold_enabled: false, ajar_threshold_sec: 15 } },
        },
      });
      const result = await callTool(withNulledArgs({ requestType: "get", ruleUuid: RULE_UUID }));
      const rule = (
        result.structuredContent as {
          rule: { doorSensorAjarSeconds: { effectiveAjarSeconds: number }[] };
        }
      ).rule;
      expect(rule.doorSensorAjarSeconds[0].effectiveAjarSeconds).toBe(30);
    });

    it("tells the model not to guess an unknown uuid", async () => {
      mockRoutes();
      const result = await callTool(
        withNulledArgs({ requestType: "get", ruleUuid: "unknownRu1eS9y2hZpVvGkA" })
      );
      expect(result.isError).toBe(true);
      expect(resultText(result)).toContain("do not guess");
    });
  });

  it("get-records asks for this rule's records only", async () => {
    mockRoutes({
      "/rulesRecords/getLatestRulesEventRecords": {
        rulesEventRecords: [
          {
            uuid: "rec0rdS9y2hZpVvGkAAAAA",
            ruleUuid: RULE_UUID,
            triggeredTimestampMs: 1700000000000,
            deviceEventRecords: [
              {
                deviceUuid: SENSOR_LEFT,
                locationUuid: "locUu1dS9y2hZpVvGkAAAA",
                activities: ["DOOR_AJAR"],
              },
            ],
            audioPlaybackActionRecords: [
              { audioClipUuid: CLIP_UUID, audioGatewayStatuses: { [GATEWAY_UUID]: "SUBMITTED" } },
            ],
          },
        ],
      },
    });

    const result = await callTool(
      withNulledArgs({ requestType: "get-records", ruleUuid: RULE_UUID })
    );

    expect(callsTo("/rulesRecords/getLatestRulesEventRecords")[0][0].body).toEqual({
      ruleUuid: RULE_UUID,
      n: 50,
    });
    expect(result.structuredContent).toEqual({
      ruleRecords: [
        {
          uuid: "rec0rdS9y2hZpVvGkAAAAA",
          ruleUuid: RULE_UUID,
          triggeredAtMs: 1700000000000,
          deviceUuid: SENSOR_LEFT,
          locationUuid: "locUu1dS9y2hZpVvGkAAAA",
          activities: ["DOOR_AJAR"],
          audioPlayback: [
            { audioClipUuid: CLIP_UUID, gatewayStatuses: { [GATEWAY_UUID]: "SUBMITTED" } },
          ],
        },
      ],
    });
  });

  it("list-audio-clips resolves clip text to uuids", async () => {
    mockRoutes({
      "/audioplayback/getAudioUploadMetadataForOrg": {
        audioUploadMetadata: [
          {
            uuid: CLIP_UUID,
            displayName: "Back door open",
            audioPlaintext: "The back door is open",
            durationMs: 1800,
          },
        ],
      },
    });

    const result = await callTool(withNulledArgs({ requestType: "list-audio-clips" }));

    expect(result.structuredContent).toEqual({
      audioClips: [
        {
          uuid: CLIP_UUID,
          displayName: "Back door open",
          text: "The back door is open",
          durationMs: 1800,
        },
      ],
    });
  });
});
