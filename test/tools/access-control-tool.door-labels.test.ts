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

const HQ = "locHqAbCdEfGhIjKlMnOp";
const SAT = "locSatAbCdEfGhIjKlMnO";
const LOBBY = "dorLobbyAbCdEfGhIjKlM";
const SIDE = "dorSideAbCdEfGhIjKlMn";
const SAT_FRONT = "dorSatFrontAbCdEfGhIj";

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
				{ uuid: LOBBY, name: "Lobby Entry", locationUuid: HQ },
				{ uuid: SIDE, name: "Side Door", locationUuid: HQ },
				{ uuid: SAT_FRONT, name: "Front Door", locationUuid: SAT },
			],
		},
		"/component/getAccessControlledDoorLabelsForOrg": {
			accessControlledDoorLabels: {
				[LOBBY]: ["Exterior", "Lobby"],
				[SIDE]: ["Exterior"],
				[SAT_FRONT]: ["Exterior", null],
			},
		},
		...overrides,
	};
	vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
		if (!(route in table)) throw new Error(`unexpected route ${route}`);
		return table[route];
	}) as never);
}

type Structured = {
	doorLabels?: {
		label?: string;
		doorCount?: number;
		doors?: { doorUuid?: string; doorName?: string; locationUuid?: string }[];
	}[];
	error?: string;
};

describe("access-control-tool get-door-labels", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
		clearOrgReferenceCache();
	});

	it("lists each label with the doors it covers, and passes output-schema validation", async () => {
		mockRoutes();

		const result = await callTool({ requestType: "get-door-labels" });
		expect(result.isError).toBeFalsy();
		const structured = result.structuredContent as Structured;

		expect(structured.doorLabels).toEqual([
			{
				label: "Exterior",
				doorCount: 3,
				doors: [
					{ doorUuid: LOBBY, doorName: "Lobby Entry", locationUuid: HQ },
					{ doorUuid: SIDE, doorName: "Side Door", locationUuid: HQ },
					{ doorUuid: SAT_FRONT, doorName: "Front Door", locationUuid: SAT },
				],
			},
			{
				label: "Lobby",
				doorCount: 1,
				doors: [{ doorUuid: LOBBY, doorName: "Lobby Entry", locationUuid: HQ }],
			},
		]);
	});

	// Labels are org-wide, but the question is usually "which labels apply HERE".
	it("narrows to one location's doors, dropping labels with no door there", async () => {
		mockRoutes();

		const result = await callTool({ requestType: "get-door-labels", locationUuid: SAT });
		const structured = result.structuredContent as Structured;

		expect(structured.doorLabels).toEqual([
			{
				label: "Exterior",
				doorCount: 1,
				doors: [{ doorUuid: SAT_FRONT, doorName: "Front Door", locationUuid: SAT }],
			},
		]);
	});

	// A labelled door missing from the door list has been deleted; its label entry
	// is stale, so it counts toward nothing.
	it("leaves out a labelled door that is no longer in the door list", async () => {
		mockRoutes({
			"/component/getAccessControlledDoorLabelsForOrg": {
				accessControlledDoorLabels: {
					[LOBBY]: ["Lobby"],
					dorGoneAbCdEfGhIjKlMn: ["Lobby", "Retired"],
				},
			},
		});

		const structured = (await callTool({ requestType: "get-door-labels" })).structuredContent as Structured;

		expect(structured.doorLabels).toEqual([
			{
				label: "Lobby",
				doorCount: 1,
				doors: [{ doorUuid: LOBBY, doorName: "Lobby Entry", locationUuid: HQ }],
			},
		]);
	});

	it("reads each route once", async () => {
		mockRoutes();

		await callTool({ requestType: "get-door-labels" });
		const routes = vi.mocked(network.postApi).mock.calls.map(call => call[0].route);

		expect(routes.sort()).toEqual([
			"/component/findAccessControlledDoors",
			"/component/getAccessControlledDoorLabelsForOrg",
		]);
	});
});
