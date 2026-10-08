import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { requestAuthContext } from "../src/auth-context.js";
import createServer from "../src/createServer.js";
import { constructRequestHeaders } from "../src/network/network.js";
import { cachedPostApi, clearOrgReferenceCache } from "../src/network/org-reference-cache.js";
import { createTool as createOrgTool } from "../src/tools/get-org-information-tool.js";
import streamableHttpTransport from "../src/transports/streamable-http.js";

/**
 * Partner credentials act in a client org through the `x-auth-org` header
 * (HTTP) or RHOMBUS_PARTNER_ORG (stdio). The org is never a tool argument.
 */

const ORG = "ClientOrgUuid000000001";
const OTHER_ORG = "ClientOrgUuid000000002";

function markerTool(name: string) {
  return {
    name: `${name}.js`,
    create: (server: McpServer) => {
      server.registerTool(name, { description: name }, async () => ({ content: [] }));
    },
  };
}

// vitest runs src/*.ts, which the directory loaders skip (they load built .js),
// so hand createServer one real shared tool plus a marker per tool set.
vi.mock("../src/tools/getTools.js", () => ({
  getSharedTools: async () => [{ name: "get-org-information-tool.js", create: createOrgTool }],
  getConsoleTools: async () => [markerTool("console-marker")],
  getPartnerTools: async () => [markerTool("partner-marker")],
}));
vi.mock("../src/resources/getResources.js", () => ({ default: async () => [] }));

const realFetch = globalThis.fetch;
const apiCalls: { url: string; headers: Record<string, string> }[] = [];

beforeEach(() => {
  apiCalls.length = 0;
  clearOrgReferenceCache();
  // Calls to the local test server pass through; anything else is the Rhombus API.
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith("http://127.0.0.1")) return realFetch(input, init);
      apiCalls.push({ url, headers: { ...(init?.headers as Record<string, string>) } });
      return new Response(JSON.stringify({ org: { name: "Client Org" } }), { status: 200 });
    })
  );
});

describe("constructRequestHeaders", () => {
  it.each([
    [{ apiKey: "key-1", partnerOrg: ORG }, "x-auth-apikey", "key-1", "partner-api-token"],
    [
      { oauthBearer: "tok-1", partnerOrg: ORG },
      "x-auth-access-token",
      "tok-1",
      "partner-api-oauth-token",
    ],
  ])(
    "a partner org switches to the partner scheme and sends x-auth-org",
    (auth, header, value, scheme) => {
      const { requestHeaders } = requestAuthContext.run(auth, () =>
        constructRequestHeaders("https://api.example/x")
      );
      expect(requestHeaders[header]).toBe(value);
      expect(requestHeaders["x-auth-scheme"]).toBe(scheme);
      expect(requestHeaders["x-auth-org"]).toBe(ORG);
    }
  );

  it.each([
    [{ apiKey: "key-1" }, "api-token"],
    [{ oauthBearer: "tok-1" }, "api-oauth-token"],
  ])("no partner org keeps the plain scheme and no x-auth-org", (auth, scheme) => {
    const { requestHeaders } = requestAuthContext.run(auth, () =>
      constructRequestHeaders("https://api.example/x")
    );
    expect(requestHeaders["x-auth-scheme"]).toBe(scheme);
    expect(requestHeaders).not.toHaveProperty("x-auth-org");
  });
});

describe("org-reference cache", () => {
  it("never shares an entry between client orgs of the same key", async () => {
    const call = (partnerOrg: string) =>
      requestAuthContext.run({ apiKey: "key-1", partnerOrg }, () =>
        cachedPostApi({ route: "/org/getOrgV2", body: {} })
      );
    await call(ORG);
    await call(OTHER_ORG);
    await call(ORG);
    expect(apiCalls.map(c => c.headers["x-auth-org"])).toEqual([ORG, OTHER_ORG]);
  });
});

describe("createServer tool set", () => {
  async function toolNames(partnerOrg?: string): Promise<string[]> {
    const server = await createServer({ partnerOrg });
    const client = new Client({ name: "test-client", version: "0.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    try {
      return (await client.listTools()).tools.map(t => t.name).sort();
    } finally {
      await client.close();
      await server.close();
    }
  }

  it("a partner acting in a client org gets the console tools, not the partner tools", async () => {
    expect(await toolNames(ORG)).toEqual(["console-marker", "get-org-information"]);
  });

  it("without an org the unresolved caller keeps the permissive union", async () => {
    expect(await toolNames()).toEqual(["console-marker", "get-org-information", "partner-marker"]);
  });
});

describe("HTTP transport: x-auth-org", () => {
  let server: Server;
  let base: string;

  beforeAll(async () => {
    vi.stubEnv("PORT", "0");
    vi.stubEnv("OAUTH_AS_ISSUER_URL", "https://auth.example/");
    server = streamableHttpTransport();
    await new Promise<void>(resolve => server.once("listening", () => resolve()));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    vi.unstubAllEnvs();
    await new Promise(resolve => server.close(resolve));
  });

  async function post(headers: Record<string, string>, body: object, path = "/mcp") {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...headers,
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }),
    });
    const text = await res.text();
    const data = text.split("\n").find(line => line.startsWith("data: "));
    return { status: res.status, json: JSON.parse(data ? data.slice(6) : text) };
  }

  // includeFields/filterBy/groupBy are the filtering proxy's required projection args.
  const ORG_TOOL_CALL = {
    method: "tools/call",
    params: {
      name: "get-org-information",
      arguments: { includeFields: null, filterBy: null, groupBy: null },
    },
  };
  const callOrgTool = (headers: Record<string, string>, path?: string) =>
    post(headers, ORG_TOOL_CALL, path);

  it("forwards an API key with x-auth-org as partner-api-token", async () => {
    const res = await callOrgTool({ "x-auth-apikey": "key-1", "x-auth-org": ORG });
    expect(res.status).toBe(200);
    expect(res.json.result.isError).toBeFalsy();
    expect(apiCalls).toHaveLength(1);
    expect(apiCalls[0].headers).toMatchObject({
      "x-auth-apikey": "key-1",
      "x-auth-scheme": "partner-api-token",
      "x-auth-org": ORG,
    });
  });

  it("forwards a Bearer with x-auth-org as partner-api-oauth-token", async () => {
    const res = await callOrgTool({ Authorization: "Bearer tok-1", "x-auth-org": ORG });
    expect(res.status).toBe(200);
    expect(apiCalls[0].headers).toMatchObject({
      "x-auth-access-token": "tok-1",
      "x-auth-scheme": "partner-api-oauth-token",
      "x-auth-org": ORG,
    });
  });

  it("treats a blank x-auth-org as absent", async () => {
    await callOrgTool({ "x-auth-apikey": "key-1", "x-auth-org": "   " });
    expect(apiCalls[0].headers["x-auth-scheme"]).toBe("api-token");
    expect(apiCalls[0].headers).not.toHaveProperty("x-auth-org");
  });

  it("reads the org from the header only, never the query string", async () => {
    await callOrgTool({ "x-auth-apikey": "key-1" }, `/mcp?x-auth-org=${ORG}`);
    expect(apiCalls[0].headers).not.toHaveProperty("x-auth-org");
  });

  it("refuses x-auth-org with a credential that cannot act in a client org", async () => {
    const res = await callOrgTool({
      "x-auth-scheme": "chatbot",
      "x-auth-session": "s",
      "x-auth-chat": "c",
      "x-auth-org": ORG,
    });
    expect(res.status).toBe(401);
    expect(apiCalls).toHaveLength(0);
  });

  it("registers the console tool set when an org is set", async () => {
    const res = await post(
      { "x-auth-apikey": "key-1", "x-auth-org": ORG },
      { method: "tools/list" }
    );
    const names = (res.json.result.tools as { name: string }[]).map(t => t.name);
    expect(names).toContain("console-marker");
    expect(names).not.toContain("partner-marker");
  });

  it("allows x-auth-org in CORS preflight", async () => {
    const res = await realFetch(`${base}/mcp`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://app.example",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "x-auth-org",
      },
    });
    expect(res.headers.get("access-control-allow-headers")?.split(",")).toContain("x-auth-org");
  });
});
