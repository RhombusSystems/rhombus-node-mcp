# AGENTS.md — Rhombus MCP Server

Guidance for AI coding agents working in this repository or connecting to the Rhombus MCP server.

## What this is

The official Model Context Protocol (MCP) server for the [Rhombus](https://www.rhombus.com) physical-security platform. It exposes Rhombus API capabilities (entity lookup, org information, users, time utilities) as MCP tools for assistants like Claude. Machine-readable server card: <https://www.rhombus.com/.well-known/mcp/server-card.json>.

## Connecting as an agent

- **Install**: npm package [`rhombus-node-mcp`](https://www.npmjs.com/package/rhombus-node-mcp) (binary `mcp-server-rhombus`), Docker image `rhombussystems/mcp-server-rhombus`, or via [Smithery](https://smithery.ai/server/@RhombusSystems/rhombus-node-mcp).
- **Auth**: set `RHOMBUS_API_KEY` (create one at <https://console.rhombus.com/settings/api-management>). The key inherits the creating user's permissions.
- **Transports**: stdio by default; `TRANSPORT_TYPE=streamable-http` serves HTTP.
- The underlying API: base URL `https://api2.rhombussystems.com/api`, POST + JSON everywhere; OpenAPI spec at <https://api2.rhombussystems.com/api/openapi/public.json>; agent auth guide at <https://www.rhombus.com/auth.md>.

## Working on this repository

- **Build**: `npm run build` (TypeScript → `dist/`). Node project; install deps with `npm install`.
- **Run locally**: `npm run start:stdio` or `npm run start:http`.
- **Test**: `npm test` (vitest).
- **Tools** live in `src/tools/` — one file per tool, registered via `src/tools/getTools.ts`. Follow the existing pattern (zod input schemas; `npm run generate-schemas` regenerates derived schemas).
- **Tool descriptions are routing surfaces for guided workflows.** The Rhombus chatbot pairs this server's tools with playbook-driven workflows (defined in the sibling `rhombus-node-private-mcp` repo); a keyword-matched instruction in a tool description here can silently outcompete a workflow that covers the same request, and playbooks name this server's tools directly. Before editing a description's "when to use" language or renaming a tool, read `../docs/writing-workflows.md` (in the `rhombus-mind-root` superproject, when checked out side-by-side).
- **Docker**: `npm run docker:build`.
- **Telemetry** (optional): each tool invocation emits an `mcp.tool.call` OpenTelemetry span (`mcp.tool.name`, success, duration, arg keys — never arg values). Uses only `@opentelemetry/api`; spans export when a host process registers an SDK (Rhombus EB deploy loads `otel-init.mjs`). Wiring: `src/telemetry/tracingProxy.ts`; identity from cached `getCurrentUser` in `src/api/get-accessible-apps.ts`.

## Related resources

- Rhombus CLI: <https://github.com/RhombusSystems/rhombus-cli>
- Developer docs: <https://api-docs.rhombus.community/> (LLM index: <https://api-docs.rhombus.community/llms.txt>)
- Platform overview for agents: <https://www.rhombus.com/llms.txt>
- Community: <https://rhombus.community/>
