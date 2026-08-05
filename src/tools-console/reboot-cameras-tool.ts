import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";
import { isConfirmed, requireConfirmation } from "../utils/confirmation.js";
import { rebootCameras } from "../api/reboot-cameras-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/reboot-cameras-tool-types.js";

const TOOL_NAME = "reboot-cameras";
const TOOL_DESCRIPTION =
  "this tool is for rebooting one or more cameras causing them to reconnect to the server, this is a helpful option when a camera is experiencing connectivity issues or is in need of troubleshooting. THIS TOOL PERFORMS AN ACTION.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { cameraUuids, confirmationId } = args;
  const confirmation = requireConfirmation(confirmationId);

  if (!isConfirmed(confirmation)) {
    return confirmation;
  }

  const cameraRebootData = await rebootCameras(
    cameraUuids,
    extra._meta?.requestModifiers as RequestModifiers,
    extra.sessionId
  );

  if (!cameraRebootData || ("error" in cameraRebootData && cameraRebootData.error)) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text:
            cameraRebootData && "status" in cameraRebootData && cameraRebootData.status
              ? String(cameraRebootData.status)
              : "Failed to reboot cameras",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(cameraRebootData),
      },
    ],
    structuredContent: cameraRebootData,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Reboot Cameras",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      // The confirmation-needed result goes through createToolTextContent,
      // which sets isError: true — so it legitimately skips output validation.
      outputSchema: {
        status: z
          .string()
          .optional()
          .describe("SUCCESS when every camera rebooted, PARTIAL_SUCCESS when some did, ERROR when none did"),
        successCount: z.number().optional(),
        errorCount: z.number().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
