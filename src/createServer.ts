import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import path from "path";
import { resolveAccessibleApps } from "./api/get-accessible-apps.js";
import { logger } from "./logger.js";
import { createFilteringProxy } from "./util.js";
import getResources from "./resources/getResources.js";
import {
	getConsoleTools,
	getPartnerTools,
	getSharedTools,
	type ToolFactory,
} from "./tools/getTools.js";
import { RhombusAppEnum } from "./types/schema.js";

let initiated = false;
let resources: Awaited<ReturnType<typeof getResources>>;
let sharedTools: ToolFactory[];
let consoleTools: ToolFactory[];
let partnerTools: ToolFactory[];

export async function serverInit() {
	resources = await getResources();
	logger.info(`📚 Found ${resources.length} resources`);
	for (const resource of resources) {
		logger.debug(`📕 - ${resource.name}`);
	}

	sharedTools = await getSharedTools();
	consoleTools = await getConsoleTools();
	partnerTools = await getPartnerTools();

	logger.info(
		`🛠️ Found ${sharedTools.length} shared, ${consoleTools.length} console, ${partnerTools.length} partner tools`,
	);
	for (const tool of sharedTools) logger.debug(`🔧 shared - ${tool.name}`);
	for (const tool of consoleTools) logger.debug(`🔧 console - ${tool.name}`);
	for (const tool of partnerTools) logger.debug(`🔧 partner - ${tool.name}`);

	initiated = true;
}

/**
 * Compose the tool set to register based on the caller's accessibleRhombusApps.
 * Shared tools are always included.
 *
 * If **PARTNER** is among the caller's apps (including alongside CONSOLE), only
 * **partner** tools are added — never the console-only set (partner capability
 * is stricter).
 *
 * Else if **CONSOLE** is present, add **console** tools only.
 *
 * Otherwise (unresolved session, empty apps, or only other enums like
 * RHOMBUS_KEY), fall back to the permissive union of console + partner sets.
 */
function pickToolsForSession(apps: RhombusAppEnum[] | null): ToolFactory[] {
	if (apps !== null && apps.length > 0 && apps.includes(RhombusAppEnum.PARTNER)) {
		return [...sharedTools, ...partnerTools];
	}
	if (apps !== null && apps.length > 0 && apps.includes(RhombusAppEnum.CONSOLE)) {
		return [...sharedTools, ...consoleTools];
	}
	return [...sharedTools, ...consoleTools, ...partnerTools];
}

function isNodeDevEnvironment(): boolean {
	return process.env.NODE_ENV === "development";
}

/**
 * Human-readable caller + tool-set summary for dev logs (must stay aligned with
 * {@link pickToolsForSession}).
 */
function describeCallerForDevLogs(apps: RhombusAppEnum[] | null): string {
	if (apps === null) {
		return "caller=unknown (no session or unresolved apps); tool sets=shared + console + partner (permissive)";
	}
	if (apps.length === 0) {
		return "caller=unknown (empty accessibleRhombusApps); tool sets=shared + console + partner (permissive)";
	}
	if (apps.includes(RhombusAppEnum.PARTNER)) {
		const alsoConsole = apps.includes(RhombusAppEnum.CONSOLE);
		return alsoConsole
			? `caller=partner (PARTNER in [${apps.join(", ")}], console tools suppressed); tool sets=shared + partner`
			: "caller=partner user; tool sets=shared + partner";
	}
	if (apps.includes(RhombusAppEnum.CONSOLE)) {
		return "caller=console user; tool sets=shared + console";
	}
	return `caller=other (accessibleRhombusApps=[${apps.join(", ")}]); tool sets=shared + console + partner (permissive)`;
}

function logDevToolRegistration(
	sessionId: string | undefined,
	apps: RhombusAppEnum[] | null,
	toolsToRegister: ToolFactory[],
): void {
	if (!isNodeDevEnvironment()) return;

	const names = toolsToRegister.map((t) => path.basename(t.name, ".js")).sort();
	logger.info(
		`[dev MCP tools] session=${sessionId ?? "(none)"} — ${describeCallerForDevLogs(apps)} — registering ${names.length} tools`,
	);
	logger.info(`[dev MCP tools] tool names: ${names.join(", ")}`);
}

export default async function createServer({ sessionId }: { sessionId?: string } = {}) {
	if (!initiated) {
		await serverInit();
	}

	logger.info(`🖥️ Creating Server for session ${sessionId ?? "(stateless)"}`);

	const server = new McpServer(
		{
			name: "rhombus-node-mcp",
			version: "1.0.0",
		},
		{
			capabilities: {
				...(resources.length > 0 ? { resources: {} } : {}),
				tools: {},
			},
		},
	);

	for (const resource of resources) {
		resource.create(server);
	}
	logger.info(`📚 Registered ${resources.length} resources`);

	const apps = await resolveAccessibleApps(sessionId);
	const toolsToRegister = pickToolsForSession(apps);
	logDevToolRegistration(sessionId, apps, toolsToRegister);
	logger.info(
		`🔒 Session ${sessionId ?? "(none)"}: apps=[${apps?.join(", ") ?? "unknown"}] — registering ${toolsToRegister.length} tools`,
	);

	const filteredServer = createFilteringProxy(
		server,
		new Set(["time-tool", "count-tool", "time-conversion-tool"]),
	);

	for (const tool of toolsToRegister) {
		try {
			await tool.create(filteredServer);
		} catch (error) {
			logger.error(`Failed to register tool ${tool.name}:`, error);
			// Continue with other tools instead of failing completely
		}
	}
	logger.info(`🛠️ Registered ${toolsToRegister.length} tools`);

	logger.info(`✅ Server created`);

	return server;
}
