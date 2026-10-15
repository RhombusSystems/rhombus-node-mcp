import { describe, it, expect } from "vitest";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createFilteringProxy, deepOptionalizeSchema } from "../src/filtering-utils.js";

// ---------------------------------------------------------------------------
// Unknown properties in structured results.
//
// The SDK advertises a tool's outputSchema to clients as JSON Schema generated
// in zod's output mode, where a plain z.object becomes
// `additionalProperties: false`; MCP clients then validate structuredContent
// against it. So when the upstream API grew fields the generated schema did
// not list, every result from a device listing failed on the client as
// "MCP error -32602: Structured content does not match the tool's output
// schema: data/cameras/0 must NOT have additional properties" — a working call
// discarded over fields nobody asked about. The relaxed schema the proxy
// registers must tolerate unknown keys at every level.
// ---------------------------------------------------------------------------

const cameraOutputShape = {
  cameras: z.array(
    z.object({
      uuid: z.string(),
      name: z.string(),
      connected: z.boolean(),
      healthStatus: z.string().optional(),
    }),
  ),
  camerasCount: z.number().int(),
};

/** A listing whose records carry fields the schema above never heard of. */
const cameraResult = {
  cameras: [
    {
      uuid: "cam-1",
      name: "Front Door",
      connected: true,
      healthStatus: "GREEN",
      // fields added upstream after the schema was generated
      storageDaysRemaining: 12,
      licenseType: "ENTERPRISE",
      nested: { a: 1, b: [1, 2, 3] },
    },
  ],
  camerasCount: 1,
  // and a new top-level field
  generatedAtMs: 1700000000000,
};

function noStrictObjects(jsonSchema: unknown): boolean {
  const json = JSON.stringify(jsonSchema);
  return !json.includes('"additionalProperties":false');
}

async function withServer<T>(
  outputSchema: unknown,
  structuredContent: Record<string, unknown>,
  run: (client: Client) => Promise<T>,
): Promise<T> {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createFilteringProxy(server).registerTool(
    "camera-list",
    {
      description: "camera listing",
      inputSchema: {},
      outputSchema: outputSchema as any,
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(structuredContent) }],
      structuredContent,
    }),
  );
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await run(client);
  } finally {
    await client.close();
    await server.close();
  }
}

const nulledArgs = { includeFields: null, filterBy: null, groupBy: null };

describe("deepOptionalizeSchema — unknown properties", () => {
  it("keeps unknown keys at every level and still type-checks known ones", () => {
    const relaxed = deepOptionalizeSchema(z.object(cameraOutputShape));
    const parsed = relaxed.safeParse(cameraResult);
    expect(parsed.success).toBe(true);
    // loose, not strip: the extra fields survive validation
    expect((parsed as any).data.cameras[0].storageDaysRemaining).toBe(12);
    expect((parsed as any).data.generatedAtMs).toBe(1700000000000);
    // still a schema: a known field of the wrong type is rejected
    expect(
      relaxed.safeParse({ cameras: [{ uuid: 7 }], camerasCount: 1 }).success,
    ).toBe(false);
  });

  it("advertises no additionalProperties:false in the generated JSON Schema", () => {
    const relaxed = deepOptionalizeSchema(
      z.object({
        rows: z.array(z.object({ id: z.string() })),
        byKey: z.record(z.string(), z.object({ id: z.string() })),
        either: z.union([z.object({ a: z.string() }), z.object({ b: z.string() })]),
      }),
    );
    expect(noStrictObjects(z.toJSONSchema(relaxed, { io: "output" }))).toBe(true);
  });
});

describe("createFilteringProxy — results with unknown properties reach the client", () => {
  // Driven end-to-end through the real SDK on purpose: the failure lives in the
  // CLIENT's validation of structuredContent against the advertised JSON
  // Schema, which no handler-level test can see.
  it("a raw-shape outputSchema: the client accepts extra nested and top-level fields", async () => {
    const result = await withServer(cameraOutputShape, cameraResult, async client => {
      const tools = await client.listTools();
      const tool = tools.tools.find(t => t.name === "camera-list");
      expect(tool?.outputSchema).toBeDefined();
      expect(noStrictObjects(tool?.outputSchema)).toBe(true);
      return client.callTool({ name: "camera-list", arguments: nulledArgs });
    });
    expect(result.isError).toBeFalsy();
    const content = result.structuredContent as typeof cameraResult;
    expect(content.cameras[0].storageDaysRemaining).toBe(12);
    expect(content.generatedAtMs).toBe(1700000000000);
  });

  it("a ZodObject outputSchema behaves the same", async () => {
    const result = await withServer(z.object(cameraOutputShape), cameraResult, client =>
      client.callTool({ name: "camera-list", arguments: nulledArgs }),
    );
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as typeof cameraResult).cameras[0].licenseType).toBe(
      "ENTERPRISE",
    );
  });

  it("a projection that drops known fields still validates", async () => {
    const result = await withServer(cameraOutputShape, cameraResult, client =>
      client.callTool({
        name: "camera-list",
        arguments: { ...nulledArgs, includeFields: ["cameras.name"] },
      }),
    );
    expect(result.isError).toBeFalsy();
    const cams = (result.structuredContent as { cameras: Record<string, unknown>[] }).cameras;
    expect(cams[0].name).toBe("Front Door");
    expect(cams[0].storageDaysRemaining).toBeUndefined();
  });

  it("a known field of the wrong type is still rejected", async () => {
    // The server's own post-handler validation catches this first and turns it
    // into an error result; a client-side rejection would surface as a throw.
    const result = await withServer(
      cameraOutputShape,
      { cameras: "not-an-array", camerasCount: 1 },
      client => client.callTool({ name: "camera-list", arguments: nulledArgs }),
    ).catch(error => ({ isError: true, content: [{ type: "text", text: String(error) }] }));
    expect(result.isError).toBe(true);
    const text = (result.content as { text: string }[]).map(item => item.text).join("\n");
    expect(text).toMatch(/output|structured content/i);
  });
});
