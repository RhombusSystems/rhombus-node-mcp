import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

  if (!cameraRebootData) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Failed to reboot cameras",
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
  };
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
