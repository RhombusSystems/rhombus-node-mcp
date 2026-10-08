import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * stdio has no request headers, so a partner key names its client org with
 * RHOMBUS_PARTNER_ORG. network.ts reads the env at import, so each test sets
 * it first and imports fresh modules.
 */

const ORG = "ClientOrgUuid000000001";

const { createServer } = vi.hoisted(() => ({
  createServer: vi.fn(async (_opts?: { partnerOrg?: string }) => ({ connect: vi.fn() })),
}));
vi.mock("../src/createServer.js", () => ({ default: createServer }));
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: class {},
}));

beforeEach(() => {
  createServer.mockClear();
  vi.stubEnv("RHOMBUS_API_KEY", "env-key");
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("stdio: RHOMBUS_PARTNER_ORG", () => {
  it("adds x-auth-org and the partner scheme to the env key", async () => {
    vi.stubEnv("RHOMBUS_PARTNER_ORG", ` ${ORG} `);
    const { constructRequestHeaders } = await import("../src/network/network.js");
    const { requestHeaders } = constructRequestHeaders("https://api.example/x");
    expect(requestHeaders).toMatchObject({
      "x-auth-apikey": "env-key",
      "x-auth-scheme": "partner-api-token",
      "x-auth-org": ORG,
    });
  });

  it("picks the client-org tool set", async () => {
    vi.stubEnv("RHOMBUS_PARTNER_ORG", ORG);
    const { default: stdioTransport } = await import("../src/transports/stdio.js");
    await stdioTransport();
    expect(createServer).toHaveBeenCalledWith({ partnerOrg: ORG });
  });

  it("unset or blank keeps the plain api-token scheme", async () => {
    vi.stubEnv("RHOMBUS_PARTNER_ORG", "  ");
    const { constructRequestHeaders } = await import("../src/network/network.js");
    const { requestHeaders } = constructRequestHeaders("https://api.example/x");
    expect(requestHeaders["x-auth-scheme"]).toBe("api-token");
    expect(requestHeaders).not.toHaveProperty("x-auth-org");

    const { default: stdioTransport } = await import("../src/transports/stdio.js");
    await stdioTransport();
    expect(createServer).toHaveBeenCalledWith({ partnerOrg: undefined });
  });
});
