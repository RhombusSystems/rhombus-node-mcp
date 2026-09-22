/**
 * Connect to a running MCP server over streamable HTTP and report the tool
 * catalog it actually serves (count + total description chars).
 *
 * Use this before any catalog-affecting eval run: a stale server holding the
 * port silently serves the OLD catalog and turns the run into a null
 * measurement (see PERF_MASTER_PLAN P2 #4a "harness gotcha").
 *
 *   npx tsx scripts/probe-served-catalog.ts http://localhost:3123/mcp
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.argv[2] ?? "http://localhost:3123/mcp";
const apiKey = process.env.RHOMBUS_API_KEY ?? "";

const transport = new StreamableHTTPClientTransport(new URL(url), {
	requestInit: { headers: { "x-auth-apikey": apiKey } },
});
const client = new Client({ name: "catalog-probe", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
const total = tools.reduce((sum, t) => sum + (t.description?.length ?? 0), 0);
const biggest = [...tools]
	.sort((a, b) => (b.description?.length ?? 0) - (a.description?.length ?? 0))
	.slice(0, 5)
	.map((t) => `${t.name}=${t.description?.length ?? 0}`)
	.join(", ");

console.log(
	`${url}\n  ${tools.length} tools · ${total} description chars (~${Math.round(total / 4)} tokens)\n  biggest: ${biggest}`,
);
await client.close();
