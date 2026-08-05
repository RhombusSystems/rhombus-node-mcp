import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/camera-policy-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

const POLICY_UUID = "pol1cyUu1dS9y2hZpVvGkAA";
const OTHER_POLICY_UUID = "otherPol1cy9y2hZpVvGkAA";
const SCHEDULE_UUID = "Wq1nR0kBS9y_2hZpVvGkAA";
const CAMERA_A = "4Toqs6naTbulCRen-RxAPA";
const CAMERA_B = "9Kpqr2nbTculDRfn-SxBQB";

function withNulledArgs(overrides: Record<string, unknown> = {}) {
	return {
		includeFields: null,
		filterBy: null,
		groupBy: null,
		policyUuid: null,
		name: null,
		description: null,
		scheduleConfigs: null,
		cameraUuids: null,
		confirmDeleteInUse: null,
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
		return await client.callTool({ name: "camera-policy-tool", arguments: args });
	} finally {
		await client.close();
		await server.close();
	}
}

function resultText(result: Awaited<ReturnType<typeof callTool>>): string {
	return (result.content as { text: string }[])[0].text;
}

const AFTER_HOURS_POLICY = {
	uuid: POLICY_UUID,
	name: "After Hours Alerts",
	description: "Alert on people after hours",
	defaultTriggers: [{ activity: "TAMPER" }],
	scheduledTriggers: [
		{
			schedule: {
				uuid: SCHEDULE_UUID,
				name: "After Hours",
				intervalList: [{ minuteOfWeekStart: 1080, minuteOfWeekStop: 1440 }],
			},
			triggerSet: [{ activity: "MOTION_HUMAN" }],
		},
	],
};

/** Route table for the two reads every branch performs. */
function mockRoutes(overrides: Record<string, unknown> = {}) {
	const table: Record<string, unknown> = {
		"/policy/getCameraPolicies": { policies: [AFTER_HOURS_POLICY] },
		"/camera/getMinimalCameraStateList": {
			cameraStates: [
				{ uuid: CAMERA_A, name: "Front Door", policyUuid: POLICY_UUID },
				{ uuid: CAMERA_B, name: "Loading Dock", policyUuid: OTHER_POLICY_UUID },
			],
		},
		"/policy/updateCameraPolicy": {},
		"/policy/deleteCameraPolicy": {},
		"/camera/updateDetailsBulkV2": {},
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

describe("camera-policy-tool", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
	});

	it("pre-computes the assigned camera count and names policies that can never fire", async () => {
		mockRoutes({
			"/policy/getCameraPolicies": {
				policies: [AFTER_HOURS_POLICY, { uuid: OTHER_POLICY_UUID, name: "Orphan Policy" }],
			},
			"/camera/getMinimalCameraStateList": {
				cameraStates: [{ uuid: CAMERA_A, name: "Front Door", policyUuid: POLICY_UUID }],
			},
		});

		const result = await callTool(withNulledArgs({ requestType: "list" }));
		const structured = result.structuredContent as {
			policies: { name: string; assignedCameraCount: number }[];
			note?: string;
		};
		expect(structured.policies[0].assignedCameraCount).toBe(1);
		expect(structured.policies[1].assignedCameraCount).toBe(0);
		expect(structured.note).toContain("Orphan Policy");
		expect(structured.note).toContain("never fire");
	});

	it("renders each schedule window for reading", async () => {
		mockRoutes();
		const result = await callTool(withNulledArgs({ requestType: "get", policyUuid: POLICY_UUID }));
		const structured = result.structuredContent as {
			policy: { scheduledTriggers: { scheduleName: string; scheduleWindows: string[] }[] };
		};
		expect(structured.policy.scheduledTriggers[0].scheduleName).toBe("After Hours");
		expect(structured.policy.scheduledTriggers[0].scheduleWindows).toEqual([
			"Monday 18:00 – Tuesday 00:00",
		]);
	});

	it("resends name, description and triggers when update only changes one field", async () => {
		mockRoutes();

		await callTool(
			withNulledArgs({ requestType: "update", policyUuid: POLICY_UUID, name: "Night Alerts" }),
		);

		const body = callsTo("/policy/updateCameraPolicy")[0][0].body as {
			policy: {
				name: string;
				description: string;
				scheduledTriggers: { scheduleUuid: string; triggerSet: { activity: string }[] }[];
			};
		};
		expect(body.policy.name).toBe("Night Alerts");
		// updateCameraPolicy REPLACES the policy object, so omitting either of these
		// would silently blank them.
		expect(body.policy.description).toBe("Alert on people after hours");
		expect(body.policy.scheduledTriggers).toEqual([
			{ scheduleUuid: SCHEDULE_UUID, triggerSet: [{ activity: "MOTION_HUMAN" }] },
		]);
	});

	it("says so when update replaces the schedule triggers", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "update",
				policyUuid: POLICY_UUID,
				scheduleConfigs: `[{"scheduleUuid":"${SCHEDULE_UUID}","activities":["MOTION_CAR"]}]`,
			}),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("Replaced all schedule triggers");
	});

	it("validates scheduleConfigs before spending a read, and labels the failure retryable", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "update",
				policyUuid: POLICY_UUID,
				scheduleConfigs: '[{"scheduleUuid":"After Hours","activities":["MOTION_HUMAN"]}]',
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("RETRYABLE");
		// A name-instead-of-uuid must be caught without touching the API at all.
		expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
	});

	it("refuses to delete a policy while cameras are assigned, and deletes nothing", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({ requestType: "delete", policyUuid: POLICY_UUID }),
		);
		const structured = result.structuredContent as { note?: string; deleted?: unknown };
		expect(structured.note).toContain("NOT DELETED");
		expect(structured.note).toContain("Front Door");
		expect(structured.deleted).toBeUndefined();
		expect(callsTo("/policy/deleteCameraPolicy")).toHaveLength(0);
	});

	it("deletes once confirmed and reports which cameras lost their policy", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "delete",
				policyUuid: POLICY_UUID,
				confirmDeleteInUse: true,
			}),
		);
		const structured = result.structuredContent as {
			deleted?: { success?: boolean };
			note?: string;
		};
		expect(structured.deleted?.success).toBe(true);
		expect(structured.note).toContain("Front Door");
		expect(structured.note).toContain("no alert policy");
	});

	it("never clears a camera that belongs to a different policy", async () => {
		mockRoutes();

		// CAMERA_B is on OTHER_POLICY_UUID. Unassigning it via this policy must not
		// write an empty policyUuid to it — that would strip its real policy.
		const result = await callTool(
			withNulledArgs({
				requestType: "unassign-cameras",
				policyUuid: POLICY_UUID,
				cameraUuids: `${CAMERA_A},${CAMERA_B}`,
			}),
		);

		const body = callsTo("/camera/updateDetailsBulkV2")[0][0].body as {
			cameraBulkDetails: { uuid: string; policyUuid: string | null }[];
		};
		// policyUuid MUST be null, not "". The field is `format: RUUID,
		// nullable: true`, and api2 rejects an empty string for the whole bulk
		// body with HTTP 400 "JSON doesn't match expected object structure"
		// (found on ITG 2026-08-05; this assertion previously pinned "").
		expect(body.cameraBulkDetails).toEqual([
			{ uuid: CAMERA_A, policyUuid: null, policyUuidUpdated: true },
		]);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("SCOPE REDUCED");
		expect(structured.note).toContain(CAMERA_B);
	});

	it("changes nothing when no listed camera is on the policy", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "unassign-cameras",
				policyUuid: POLICY_UUID,
				cameraUuids: CAMERA_B,
			}),
		);
		expect(callsTo("/camera/updateDetailsBulkV2")).toHaveLength(0);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("Nothing was changed");
	});

	it("reports the policy an assignment displaced", async () => {
		mockRoutes({
			"/policy/getCameraPolicies": {
				policies: [AFTER_HOURS_POLICY, { uuid: OTHER_POLICY_UUID, name: "Daytime Alerts" }],
			},
		});

		const result = await callTool(
			withNulledArgs({
				requestType: "assign-cameras",
				policyUuid: POLICY_UUID,
				cameraUuids: CAMERA_B,
			}),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("REPLACED");
		expect(structured.note).toContain("Daytime Alerts");
	});

	it("refuses to assign a policy uuid that does not exist", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "assign-cameras",
				policyUuid: "madeUpPolicyUuid123456",
				cameraUuids: CAMERA_A,
			}),
		);
		expect(result.isError).toBe(true);
		// Assigning a bogus uuid would leave the cameras with no policy at all.
		expect(callsTo("/camera/updateDetailsBulkV2")).toHaveLength(0);
	});

	it("surfaces an api2 in-band errorMsg rather than a generic failure", async () => {
		mockRoutes({ "/policy/getCameraPolicies": { error: true, errorMsg: "Policy service down." } });

		const result = await callTool(withNulledArgs({ requestType: "list" }));
		const structured = result.structuredContent as { error?: string };
		expect(structured.error).toBe("Policy service down.");
	});
});
