import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { clearOrgReferenceCache } from "../../src/network/org-reference-cache.js";
import { createTool } from "../../src/tools-console/access-control-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

const USER = "usrAliceAbCdEfGhIjKlM";
const GROUP = "grpStaffAbCdEfGhIjKlM";
const LOCATION = "locHqAbCdEfGhIjKlMnOp";
const LOBBY = "dorLobbyAbCdEfGhIjKlM";
const SERVER = "dorServerAbCdEfGhIjKl";
const CONTROLLER = "dcuAbCdEfGhIjKlMnOpQr";
const READER = "rdrAbCdEfGhIjKlMnOpQr";

const NULL_ARGS = {
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
};

/** Drives the REAL SDK + filtering proxy, so output-schema validation runs. */
async function callTool(args: Record<string, unknown>) {
	const server = new McpServer({ name: "test", version: "0.0.0" });
	createTool(createFilteringProxy(server));
	const client = new Client({ name: "test-client", version: "0.0.0" });
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
	await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
	try {
		return await client.callTool({ name: "access-control-tool", arguments: { ...NULL_ARGS, ...args } });
	} finally {
		await client.close();
		await server.close();
	}
}

function mockRoutes(overrides: Record<string, unknown> = {}) {
	const table: Record<string, unknown> = {
		"/component/findAccessControlledDoors": {
			accessControlledDoors: [
				{ uuid: LOBBY, name: "Lobby Entry", locationUuid: LOCATION, ownerDeviceUuid: CONTROLLER, readerComponents: [{ componentUuid: READER }] },
				{ uuid: SERVER, name: "Server Room", locationUuid: LOCATION, ownerDeviceUuid: CONTROLLER, readerComponents: [{ componentUuid: READER }] },
			],
		},
		"/accesscontrol/findLocationAccessGrantsByOrg": {
			accessGrants: [
				{
					uuid: "gntStaff",
					name: "Staff Doors",
					locationUuid: LOCATION,
					userUuids: [],
					groupUuids: [GROUP],
					accessControlledDoorUuids: [LOBBY],
					doorLabelIds: [],
					mode: "DEFAULT",
				},
			],
		},
		"/accesscontrol/findAccessControlGroupMembershipsByUser": {
			userGroupMemberships: [{ groupUuid: GROUP, userUuid: USER, type: "RHOMBUS_ACCESS_CONTROL" }],
		},
		"/accesscontrol/findAccessControlGroupsByOrg": { groups: [{ uuid: GROUP, name: "All Staff" }] },
		"/accesscontrol/findLocationAccessRevocationsByOrg": { accessRevocations: [] },
		"/component/getAccessControlledDoorLabelsForOrg": { accessControlledDoorLabels: {} },
		"/schedule/getSchedules": { weeklySchedules: [], absoluteSchedules: [], relativeDatetimeSchedules: [], relativeSchedules: [] },
		"/accesscontrol/findAccessControlCredentialByUser": {
			credentials: [
				{ uuid: "crd1", userUuid: USER, type: "RHOMBUS_SECURE_CSN", workflowStatus: "ACTIVE" },
				{ uuid: "crd2", userUuid: USER, type: "PIN_CODE", workflowStatus: "ACTIVE", endDateEpochSecExclusive: 1_000_000_000 },
			],
		},
		"/location/getLocationsV2": { locations: [{ uuid: LOCATION, name: "Main Office", tz: "America/Los_Angeles" }] },
		"/component/findComponentsByOwnerDevice": {
			components: [
				{ uuid: READER, type: "RhombusOsdpDoorReader", readerType: "rhombus_osdp", name: "Lobby reader" },
				{ uuid: "rlyAbCdEfGhIjKlMnOpQr", type: "IntegratedDoorRelay" },
			],
		},
		"/accesscontrol/lockdownPlan/findLocationLockdownStates": { states: [] },
		"/accesscontrol/firstIn/findLocationFirstInSettingsByOrg": { settingsList: [] },
		"/user/findUser": { user: { uuid: USER, status: "JOINED", deleted: false } },
		...overrides,
	};
	vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
		if (!(route in table)) throw new Error(`unexpected route ${route}`);
		return table[route];
	}) as never);
}

type Structured = {
	userDoorAccess?: {
		doors?: { doorName?: string; access?: string; grants?: { via?: string; groupName?: string }[]; credentialFit?: string; lockdown?: string; firstIn?: string }[];
		account?: { found?: boolean; status?: string };
		notChecked?: string[];
		credentials?: { credentialType?: string; effectiveStatus?: string }[];
		summary?: { accessNow?: number; noAccess?: number; usableCredentials?: number };
		inputsUnavailable?: { input?: string }[];
	};
	note?: string;
	error?: string;
};

describe("access-control-tool get-user-door-access", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
		clearOrgReferenceCache();
	});

	it("resolves group access per door and passes output-schema validation", async () => {
		mockRoutes();

		const result = await callTool({ requestType: "get-user-door-access", userUuid: USER, locationUuid: LOCATION });
		expect(result.isError).toBeFalsy();
		const structured = result.structuredContent as Structured;

		expect(structured.userDoorAccess?.doors).toMatchObject([
			{ doorName: "Lobby Entry", access: "yes", grants: [{ via: "group", groupName: "All Staff" }] },
			{ doorName: "Server Room", access: "no" },
		]);
		// The credential type comes from `type`; the PIN's end date has passed.
		expect(structured.userDoorAccess?.credentials).toEqual([
			expect.objectContaining({ credentialType: "RHOMBUS_SECURE_CSN", effectiveStatus: "ACTIVE" }),
			expect.objectContaining({ credentialType: "PIN_CODE", effectiveStatus: "EXPIRED" }),
		]);
		expect(structured.userDoorAccess?.summary).toMatchObject({ accessNow: 1, noAccess: 1, usableCredentials: 1 });
		expect(structured.userDoorAccess?.doors?.[0].credentialFit).toBe("Accepts: Rhombus Secure card.");
		expect(structured.userDoorAccess?.account).toMatchObject({ found: true, status: "JOINED" });
		expect(structured.userDoorAccess?.notChecked).toBeUndefined();
		expect(structured.note).toContain("No access: Server Room.");
		expect(structured.note).toContain("No lockdown is active.");
		expect(structured.note).toContain("Account status does not affect badge access.");
	});

	it("makes no follow-up calls on the common path — one round, one reader lookup per controller", async () => {
		mockRoutes();

		await callTool({ requestType: "get-user-door-access", userUuid: USER, locationUuid: LOCATION });
		const routes = vi.mocked(network.postApi).mock.calls.map(call => call[0].route);

		expect(routes.filter(r => r === "/component/findComponentsByOwnerDevice")).toHaveLength(1);
		expect(routes).not.toContain("/accesscontrol/lockdownPlan/getLockdownPlan");
		expect(routes).not.toContain("/component/findAccessControlledDoorShadowsByLocation");
	});

	it("applies an active lockdown and a first-in rule, reading their details only then", async () => {
		mockRoutes({
			"/accesscontrol/lockdownPlan/findLocationLockdownStates": {
				states: [
					{ locationUuid: "locOtherAbCdEfGhIjKlM", state: "LOCKED_DOWN", activeLockdownPlans: [{ lockdownPlanUuid: "plnOther" }] },
				],
			},
			"/accesscontrol/firstIn/findLocationFirstInSettingsByOrg": {
				settingsList: [
					{
						settingsUuid: "fisA",
						name: "Managers first",
						doorUuids: [LOBBY],
						userUuids: ["usrManagerAbCdEfGhIjK"],
						groupUuids: [],
						doorAuthRequirementEnabled: true,
						doorAuthFirstInState: { state: "SATISFIED", requestedAtMillis: 1 },
					},
				],
			},
			"/component/findAccessControlledDoorShadowsByLocation": {
				shadows: [{ componentCompositeUuid: LOBBY, authFirstIn: { state: "REQUIRED" } }],
			},
		});

		const result = await callTool({ requestType: "get-user-door-access", userUuid: USER, locationUuid: LOCATION });
		const structured = result.structuredContent as Structured;
		const routes = vi.mocked(network.postApi).mock.calls.map(call => call[0].route);

		// The live controller state (REQUIRED) wins over the stale cloud setting.
		expect(structured.userDoorAccess?.doors?.[0]).toMatchObject({ doorName: "Lobby Entry", access: "first-in-required" });
		// A lockdown at another location is out of scope: no plan lookup.
		expect(routes).not.toContain("/accesscontrol/lockdownPlan/getLockdownPlan");
		expect(routes).toContain("/component/findAccessControlledDoorShadowsByLocation");
	});

	it("keeps answering when one input fails, and reports the gap", async () => {
		mockRoutes({
			"/accesscontrol/findAccessControlGroupMembershipsByUser": {
				error: true,
				status: "Sorry, I don't have permission to help with this request.",
			},
		});

		const result = await callTool({ requestType: "get-user-door-access", userUuid: USER, locationUuid: LOCATION });
		const structured = result.structuredContent as Structured;

		expect(structured.userDoorAccess?.doors?.map(d => d.access)).toEqual(["unknown", "unknown"]);
		expect(structured.userDoorAccess?.summary?.noAccess).toBe(0);
		expect(structured.userDoorAccess?.inputsUnavailable?.[0].input).toBe("access control group membership");
	});

	it("fails loudly when the door list cannot be read, rather than reporting no doors", async () => {
		mockRoutes({ "/component/findAccessControlledDoors": { error: true, status: "HTTP 500" } });

		const result = await callTool({ requestType: "get-user-door-access", userUuid: USER, locationUuid: LOCATION });
		const structured = result.structuredContent as Structured;
		expect(structured.error).toContain("HTTP 500");
		expect(structured.userDoorAccess).toBeUndefined();
	});

	it("asks for a userUuid instead of guessing one", async () => {
		mockRoutes();

		const result = await callTool({ requestType: "get-user-door-access" });
		expect(result.isError).toBe(true);
		expect((result.content as { text: string }[])[0].text).toContain("user-tool");
		expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
	});
});
