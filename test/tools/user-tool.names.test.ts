import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import * as network from "../../src/network/network.js";
import { createTool } from "../../src/tools/user-tool.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

// A user whose only name is the display name, as an org's rows can be.
const AVERY = {
	uuid: "usrAveryAbCdEfGhIjKlM",
	name: "Avery Quinn",
	email: "avery@example.com",
	firstName: null,
	lastName: null,
};
const MORGAN = {
	uuid: "usrMorganAbCdEfGhIjKl",
	name: "Morgan Lee",
	email: "morgan@example.com",
	firstName: "Morgan",
	lastName: "Lee",
};
const RILEY = {
	uuid: "usrRileyAbCdEfGhIjKlM",
	name: null,
	email: "riley@example.com",
	firstName: "Riley",
	lastName: "Park",
};

const NULL_ARGS = {
	includeFields: null,
	filterBy: null,
	groupBy: null,
	email: null,
	userUuid: null,
	userName: null,
	permissionGroupUuid: null,
	suppressWelcomeEmail: null,
	confirmDelete: null,
};

/** Drives the REAL SDK + filtering proxy, so output-schema validation runs. */
async function connect() {
	const server = new McpServer({ name: "test", version: "0.0.0" });
	createTool(createFilteringProxy(server));
	const client = new Client({ name: "test-client", version: "0.0.0" });
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
	await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
	return {
		client,
		close: async () => {
			await client.close();
			await server.close();
		},
	};
}

async function callTool(args: Record<string, unknown>) {
	const { client, close } = await connect();
	try {
		return await client.callTool({ name: "user-tool", arguments: { ...NULL_ARGS, ...args } });
	} finally {
		await close();
	}
}

function mockRoutes() {
	const table: Record<string, unknown> = {
		"/user/getUsersInOrg": { users: [AVERY, MORGAN, RILEY] },
		"/user/findUserByEmail": { user: AVERY },
	};
	vi.mocked(network.postApi).mockImplementation((async ({ route }: { route: string }) => {
		if (!(route in table)) throw new Error(`unexpected route ${route}`);
		return table[route];
	}) as never);
}

type UserRow = { uuid?: string; name?: string; firstName?: string; lastName?: string };
type Structured = { users?: UserRow[]; user?: UserRow; error?: string };

describe("user-tool names", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
		mockRoutes();
	});

	it("lists every user with a name, and passes output-schema validation", async () => {
		const result = await callTool({ requestType: "list-users" });
		expect(result.isError).toBeFalsy();

		const users = (result.structuredContent as Structured).users;
		expect(users?.map(user => user.name)).toEqual(["Avery Quinn", "Morgan Lee", "Riley Park"]);
	});

	// The user a name-based lookup used to miss: no firstName/lastName to filter on.
	it("finds a user who has only a display name by filtering on users.name", async () => {
		const result = await callTool({
			requestType: "list-users",
			filterBy: [{ field: "users.name", op: "contains", value: "Avery" }],
		});

		const users = (result.structuredContent as Structured).users;
		expect(users?.map(user => user.uuid)).toEqual([AVERY.uuid]);
	});

	it("returns the name from find-by-email", async () => {
		const result = await callTool({ requestType: "find-by-email", email: AVERY.email });

		expect((result.structuredContent as Structured).user?.name).toBe("Avery Quinn");
	});

	it("tells the model to find people by users.name", async () => {
		const { client, close } = await connect();
		try {
			const { tools } = await client.listTools();
			const description = tools.find(tool => tool.name === "user-tool")?.description ?? "";
			expect(description).toContain("users.name");
		} finally {
			await close();
		}
	});
});
