import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createFilteringProxy } from "../../src/filtering-utils.js";
import { createTool } from "../../src/tools-console/reboot-cameras-tool.js";
import * as rebootApi from "../../src/api/reboot-cameras-tool-api.js";

vi.mock("../../src/api/reboot-cameras-tool-api.js");

const ONLINE = "OnlineCam000000000000A";
const OFFLINE = "OfflineCam00000000000B";

async function reboot(args: Record<string, unknown>) {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  createTool(createFilteringProxy(server));
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return await client.callTool({
      name: "reboot-cameras",
      arguments: { includeFields: null, filterBy: null, groupBy: null, confirmationId: null, ...args },
    });
  } finally {
    await client.close();
    await server.close();
  }
}

const textOf = (result: Awaited<ReturnType<typeof reboot>>) =>
  (result.content as { text: string }[]).map(item => item.text).join("\n");

describe("reboot-cameras — disconnected cameras", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rebootApi.getCameraConnections).mockResolvedValue(
      new Map([
        [ONLINE, { name: "Lobby", connectionStatus: "GREEN" }],
        [OFFLINE, { name: "Loading Dock", connectionStatus: "RED" }],
      ])
    );
    vi.mocked(rebootApi.rebootCameras).mockResolvedValue({
      status: "SUCCESS",
      successCount: 1,
      errorCount: 0,
    } as never);
  });

  // The API answers success for a disconnected camera, so it used to be reported as rebooted.
  it("reports an offline camera as offline, asks nothing and sends nothing", async () => {
    const result = await reboot({ cameraUuids: [OFFLINE] });

    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toMatchObject({
      status: "OFFLINE",
      successCount: 0,
      offlineCameras: ["Loading Dock"],
    });
    expect(textOf(result)).toContain("no confirmation is needed");
    expect(textOf(result)).not.toContain("confirmation id");
    expect(vi.mocked(rebootApi.rebootCameras)).not.toHaveBeenCalled();
  });

  it("asks once, then reboots only the reachable cameras and names the offline ones", async () => {
    const ask = await reboot({ cameraUuids: [ONLINE, OFFLINE] });
    const confirmationId = textOf(ask).match(/confirmation id: (\w+)/)?.[1];
    expect(confirmationId).toBeTruthy();

    const result = await reboot({ cameraUuids: [ONLINE, OFFLINE], confirmationId });

    expect(vi.mocked(rebootApi.rebootCameras)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(rebootApi.rebootCameras).mock.calls[0][0]).toEqual([ONLINE]);
    expect(result.structuredContent).toMatchObject({
      status: "SUCCESS",
      successCount: 1,
      offlineCameras: ["Loading Dock"],
    });
    expect((result.structuredContent as { message: string }).message).toMatch(/offline .* not rebooted/);
  });

  // Prod 2026-10-16: the model echoed a valid id with a repeated chunk appended and was re-asked.
  it("confirms with a valid id even when the model appended extra characters", async () => {
    const ask = await reboot({ cameraUuids: [ONLINE] });
    const id = textOf(ask).match(/confirmation id: (\w+)/)?.[1] as string;

    const result = await reboot({ cameraUuids: [ONLINE], confirmationId: id + id.slice(-21) });

    expect(textOf(result)).not.toContain("confirmation id");
    expect(vi.mocked(rebootApi.rebootCameras)).toHaveBeenCalledWith([ONLINE], undefined, undefined);
  });
});
