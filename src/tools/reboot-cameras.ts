import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { BASE_URL, postApi } from "../network.js";

async function rebootCameras(cameraUuids: string[], requestModifiers?: any) {
  const url = BASE_URL + "/camera/reboot";
  let successCount = 0;
  let errorCount = 0;
  for (const cameraUuid in cameraUuids) {
    try {
      const body = JSON.stringify({ cameraUuid: cameraUuid });
      const response = await postApi(url, body, requestModifiers);
      if (response.error) {
        errorCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      const ret = `Error rebooting cameras: ${error}`;
      return { error: true, status: ret };
    }

    let status;
    if (successCount === cameraUuids.length) status = "SUCCESS";
    else if (successCount > 0 && successCount < cameraUuids.length) status = "PARTIAL_SUCCESS";
    else status = "ERROR";

    return { status, successCount, errorCount };
  }
}

export function createTool(server: McpServer) {
  server.tool(
    "reboot-cameras",
    "this tool is for rebooting one or more cameras causing them to reconnect to the server, this is a helpful option when a camera is experiencing connectivity issues or is in need of troubleshooting",
    createToolArgs({
      cameraUuids: z
        .array(z.string())
        .describe("An array of camera UUID strings which are unique identifiers for cameras"),
    }),
    async ({ cameraUuids, requestModifiers }) => {
      const cameraRebootData = await rebootCameras(cameraUuids, requestModifiers);

      if (!cameraRebootData) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to reboot cameras",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(cameraRebootData),
          },
        ],
      };
    }
  );
}
