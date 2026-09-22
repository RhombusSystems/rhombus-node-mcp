/**
 * Measure the tool "description surface" this server contributes to an LLM's
 * billed prefix.
 *
 * Why this exists: with OpenAI hosted `tool_search`, a deferred tool's PARAMETER
 * SCHEMA is not billed but its NAME + DESCRIPTION always is (verified
 * empirically — see PERF_MASTER_PLAN P2 #4a). So the description string is the
 * only lever for deferred tools, and this script reports it per tool so we can
 * see where the bytes are.
 *
 * Usage:
 *   npx tsx scripts/measure-tool-surface.ts            # table, biggest first
 *   npx tsx scripts/measure-tool-surface.ts --json     # machine output
 *   npx tsx scripts/measure-tool-surface.ts --json > /tmp/before.json
 *   npx tsx scripts/measure-tool-surface.ts --diff /tmp/before.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createFilteringProxy } from "../src/filtering-utils.js";

type Captured = { name: string; description: string; paramDescChars: number };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "..", "src");

function toolFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith(".ts") && f !== "getTools.ts")
		.map((f) => path.join(dir, f));
}

/**
 * Sum of every `.describe()` string reachable from an inputSchema shape.
 * Zod 4 keeps descriptions in a global registry behind the `.description`
 * getter (not on `_def`), and nests sub-schemas under `.def`.
 */
function paramDescriptionChars(inputSchema: unknown): number {
	let total = 0;
	const seen = new Set<unknown>();
	const walk = (node: unknown, depth: number) => {
		if (node === null || typeof node !== "object" || depth > 20) return;
		if (seen.has(node)) return;
		seen.add(node);
		const zod = node as { def?: unknown; description?: unknown };
		if (zod.def !== undefined && typeof zod.description === "string") {
			total += zod.description.length;
		}
		const children = zod.def !== undefined ? [zod.def] : Object.values(node as object);
		for (const value of children) {
			if (typeof value === "function") continue;
			if (value && typeof value === "object") {
				for (const inner of Array.isArray(value) ? value : Object.values(value)) {
					walk(inner, depth + 1);
				}
			}
		}
	};
	for (const arg of Object.values((inputSchema ?? {}) as Record<string, unknown>)) {
		walk(arg, 0);
	}
	return total;
}

async function collect(): Promise<Captured[]> {
	const captured: Captured[] = [];
	const stub = {
		registerTool(name: string, config: Record<string, unknown>) {
			captured.push({
				name,
				description: String(config.description ?? ""),
				paramDescChars: paramDescriptionChars(config.inputSchema),
			});
		},
		// Tools occasionally touch these during registration.
		registerResource() {},
		registerPrompt() {},
		server: { setRequestHandler() {} },
	};
	// biome-ignore lint/suspicious/noExplicitAny: stub stands in for McpServer
	const proxied = createFilteringProxy(stub as any);

	const files = [
		...toolFiles(path.join(SRC, "tools")),
		...toolFiles(path.join(SRC, "tools-console")),
		...toolFiles(path.join(SRC, "tools-partner")),
	];
	for (const file of files) {
		const mod = (await import(pathToFileURL(file).href)) as {
			createTool?: (server: unknown) => void | Promise<void>;
		};
		if (mod.createTool) await mod.createTool(proxied);
	}
	return captured;
}

/** Rough token estimate. Prose runs ~4 chars/token; good enough for targeting. */
const tok = (chars: number) => Math.round(chars / 4);

const args = process.argv.slice(2);
const tools = (await collect()).sort(
	(a, b) => b.description.length - a.description.length,
);

if (args.includes("--json")) {
	console.log(
		JSON.stringify(
			{
				tools: tools.map((t) => ({
					name: t.name,
					descChars: t.description.length,
					paramDescChars: t.paramDescChars,
				})),
				totalDescChars: tools.reduce((s, t) => s + t.description.length, 0),
			},
			null,
			2,
		),
	);
} else {
	const diffIdx = args.indexOf("--diff");
	let before: Map<string, number> | undefined;
	if (diffIdx >= 0) {
		const prev = JSON.parse(fs.readFileSync(args[diffIdx + 1], "utf8")) as {
			tools: { name: string; descChars: number }[];
		};
		before = new Map(prev.tools.map((t) => [t.name, t.descChars]));
	}

	console.log(
		`${"tool".padEnd(36)} ${"desc chars".padStart(11)} ${"~tokens".padStart(8)} ${"param desc".padStart(11)}${before ? "  delta" : ""}`,
	);
	for (const t of tools) {
		const delta = before
			? `  ${(t.description.length - (before.get(t.name) ?? 0) >= 0 ? "+" : "") + (t.description.length - (before.get(t.name) ?? 0))}`
			: "";
		console.log(
			`${t.name.padEnd(36)} ${String(t.description.length).padStart(11)} ${String(tok(t.description.length)).padStart(8)} ${String(t.paramDescChars).padStart(11)}${delta}`,
		);
	}
	const total = tools.reduce((s, t) => s + t.description.length, 0);
	const totalParam = tools.reduce((s, t) => s + t.paramDescChars, 0);
	console.log(
		`\n${tools.length} tools · descriptions ${total} chars (~${tok(total)} tokens, BILLED even when deferred)` +
			`\n${" ".repeat(String(tools.length).length)}  param descriptions ${totalParam} chars (~${tok(totalParam)} tokens, unbilled until loaded)`,
	);
	if (before) {
		const beforeTotal = [...before.values()].reduce((s, v) => s + v, 0);
		console.log(
			`  vs baseline: ${beforeTotal} -> ${total} chars (${(((total - beforeTotal) / beforeTotal) * 100).toFixed(1)}%)`,
		);
	}
}
