import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools-console/access-control-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

const GROUP_UUID = "grp1AbCdEfGhIjKlMnOpQ";
const GRANT_UUID = "gnt1AbCdEfGhIjKlMnOpQ";
const CRED_UUID = "crd1AbCdEfGhIjKlMnOpQ";
const PLAN_UUID = "pln1AbCdEfGhIjKlMnOpQ";
const LOCATION_UUID = "loc1AbCdEfGhIjKlMnOpQ";
const DOOR_A = "dorAAbCdEfGhIjKlMnOpQ";
const DOOR_B = "dorBAbCdEfGhIjKlMnOpQ";
const USER_A = "usrAAbCdEfGhIjKlMnOpQ";
const USER_B = "usrBAbCdEfGhIjKlMnOpQ";

function withNulledArgs(overrides: Record<string, unknown> = {}) {
	return {
		includeFields: null,
		filterBy: null,
		groupBy: null,
		doorUuid: null,
		userUuid: null,
		locationUuid: null,
		lockdownPlanUuid: null,
		groupUuid: null,
		groupName: null,
		groupDescription: null,
		userUuids: null,
		credentialUuid: null,
		credentialHexValue: null,
		credentialNote: null,
		accessGrantUuid: null,
		accessGrantName: null,
		doorUuids: null,
		groupUuids: null,
		scheduleUuid: null,
		confirmDelete: null,
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
		return await client.callTool({ name: "access-control-tool", arguments: args });
	} finally {
		await client.close();
		await server.close();
	}
}

function resultText(result: Awaited<ReturnType<typeof callTool>>): string {
	return (result.content as { text: string }[])[0].text;
}

const GROUP = {
	uuid: GROUP_UUID,
	name: "Night Shift",
	description: "After-hours staff",
	userUuids: [USER_A, USER_B],
};

const GRANT = {
	uuid: GRANT_UUID,
	name: "Warehouse Access",
	locationUuid: LOCATION_UUID,
	userUuids: [USER_A, USER_B],
	groupUuids: [GROUP_UUID],
	accessControlledDoorUuids: [DOOR_A, DOOR_B],
	scheduleUuid: null,
};

function mockRoutes(overrides: Record<string, unknown> = {}) {
	const table: Record<string, unknown> = {
		"/accesscontrol/findAccessControlGroupsByOrg": { groups: [GROUP] },
		"/accesscontrol/findLocationAccessGrantsByOrg": { accessGrants: [GRANT] },
		"/accesscontrol/lockdownPlan/findLockdownPlans": {
			lockdownPlans: [{ uuid: PLAN_UUID, name: "Full Lockdown", locationUuid: LOCATION_UUID }],
		},
		"/accesscontrol/createAccessGrant": { accessGrant: { uuid: GRANT_UUID } },
		"/accesscontrol/updateAccessGrant": { accessGrant: { uuid: GRANT_UUID } },
		"/accesscontrol/deleteLocationAccessGrant": {},
		"/accesscontrol/deleteAccessControlGroup": {},
		"/accesscontrol/updateAccessControlGroup": {},
		"/accesscontrol/addUsersToAccessControlGroup": {},
		"/accesscontrol/removeUsersFromAccessControlGroup": {},
		"/accesscontrol/suspendAccessControlCredential": {},
		"/accesscontrol/deleteAccessControlCredential": {},
		"/accesscontrol/lockdownPlan/deleteLockdownPlan": {},
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

describe("access-control-tool write paths", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
	});

	it("refuses to delete a group without confirmation and names how many people are affected", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({ requestType: "delete-group", groupUuid: GROUP_UUID }),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("NOT DELETED");
		expect(structured.note).toContain("2 member(s)");
		expect(callsTo("/accesscontrol/deleteAccessControlGroup")).toHaveLength(0);
	});

	it("steers a credential delete towards the reversible suspend", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({ requestType: "delete-credential", credentialUuid: CRED_UUID }),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("suspend-credential");
		expect(callsTo("/accesscontrol/deleteAccessControlCredential")).toHaveLength(0);
	});

	it("distinguishes suspend from revoke and delete in what it reports", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({ requestType: "suspend-credential", credentialUuid: CRED_UUID }),
		);
		const structured = result.structuredContent as {
			credentialChange?: { action?: string };
			note?: string;
		};
		expect(structured.credentialChange?.action).toBe("suspend");
		expect(structured.note).toContain("unsuspend-credential");
		expect(callsTo("/accesscontrol/suspendAccessControlCredential")).toHaveLength(1);
	});

	it("preserves the user and group lists when a grant update only changes doors", async () => {
		mockRoutes();

		await callTool(
			withNulledArgs({
				requestType: "update-access-grant",
				accessGrantUuid: GRANT_UUID,
				doorUuids: [DOOR_A],
			}),
		);

		const body = callsTo("/accesscontrol/updateAccessGrant")[0][0].body as {
			accessGrant: {
				userUuids: string[];
				groupUuids: string[];
				accessControlledDoorUuids: string[];
			};
		};
		// updateAccessGrant takes the whole grant, so omitting these would revoke
		// everyone's access rather than just narrowing the doors.
		expect(body.accessGrant.userUuids).toEqual([USER_A, USER_B]);
		expect(body.accessGrant.groupUuids).toEqual([GROUP_UUID]);
		expect(body.accessGrant.accessControlledDoorUuids).toEqual([DOOR_A]);
	});

	it("spells out which doors an update removed access to", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "update-access-grant",
				accessGrantUuid: GRANT_UUID,
				doorUuids: [DOOR_A],
			}),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("ACCESS REMOVED");
		expect(structured.note).toContain(DOOR_B);
	});

	it("refuses an update that would leave a grant with no doors", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "update-access-grant",
				accessGrantUuid: GRANT_UUID,
				doorUuids: [],
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("gives nobody access");
		expect(callsTo("/accesscontrol/updateAccessGrant")).toHaveLength(0);
	});

	it("refuses to create a grant that nobody is on", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "create-access-grant",
				accessGrantName: "Empty",
				locationUuid: LOCATION_UUID,
				doorUuids: [DOOR_A],
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("gives nobody access");
		expect(callsTo("/accesscontrol/createAccessGrant")).toHaveLength(0);
	});

	it("reports doors whose access-control licence makes the grant a no-op", async () => {
		mockRoutes({
			"/accesscontrol/createAccessGrant": {
				accessGrant: { uuid: GRANT_UUID },
				expiredACDLicensesDoorUuids: [DOOR_B],
			},
		});

		const result = await callTool(
			withNulledArgs({
				requestType: "create-access-grant",
				accessGrantName: "Warehouse",
				locationUuid: LOCATION_UUID,
				doorUuids: [DOOR_A, DOOR_B],
				userUuids: [USER_A],
			}),
		);
		const structured = result.structuredContent as {
			doorsWithoutLicense?: string[];
			note?: string;
		};
		// The grant saves cleanly, so without this the answer would claim access
		// that DOOR_B does not actually give.
		expect(structured.doorsWithoutLicense).toEqual([DOOR_B]);
		expect(structured.note).toContain("expired or unassigned");
	});

	it("treats a lockdown plan delete as life-safety and refuses without confirmation", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({ requestType: "delete-lockdown-plan", lockdownPlanUuid: PLAN_UUID }),
		);
		const structured = result.structuredContent as { note?: string };
		expect(structured.note).toContain("life-safety");
		expect(callsTo("/accesscontrol/lockdownPlan/deleteLockdownPlan")).toHaveLength(0);
	});

	it("rejects a group membership change with no users rather than calling the API", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "add-users-to-group",
				groupUuid: GROUP_UUID,
				userUuids: [],
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("user-tool");
		expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
	});

	it("tells the model to list rather than guess when a group uuid is unknown", async () => {
		mockRoutes();

		const result = await callTool(
			withNulledArgs({
				requestType: "update-group",
				groupUuid: "madeUpGroupUuid123456",
				groupName: "Nope",
			}),
		);
		expect(result.isError).toBe(true);
		expect(resultText(result)).toContain("do not guess");
		expect(callsTo("/accesscontrol/updateAccessControlGroup")).toHaveLength(0);
	});
});
