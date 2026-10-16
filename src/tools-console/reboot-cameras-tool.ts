import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";
import { isConfirmed, requireConfirmation } from "../utils/confirmation.js";
import { getCameraConnections, rebootCameras } from "../api/reboot-cameras-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/reboot-cameras-tool-types.js";

const TOOL_NAME = "reboot-cameras";
// The tool runs its own confirmation step. A model that also asked (or rendered a confirm form)
// before the first call made the user confirm twice, and passed the form's key as the
// confirmationId, which can never verify.
const TOOL_DESCRIPTION =
  "Reboots one or more cameras so they reconnect to the server — useful when a camera has connectivity issues or needs troubleshooting. THIS TOOL PERFORMS AN ACTION and runs its own confirmation step, so the user confirms exactly ONCE: call this tool FIRST, with confirmationId null — do not ask the user or render a form beforehand. It answers with an id; ask the user one plain yes/no question, and when they agree call it again with the same cameraUuids and exactly that id.";

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { cameraUuids, confirmationId } = args;
  const requestModifiers = extra._meta?.requestModifiers as RequestModifiers;

  // A reboot is a command the camera has to receive. For a disconnected camera the API still
  // answers success, so the user was told it rebooted when nothing could have happened.
  // Disconnected cameras are reported, not rebooted — and with none reachable there is nothing
  // to confirm.
  const connections = await getCameraConnections(cameraUuids, requestModifiers, extra.sessionId);
  const offline = cameraUuids.filter(uuid => connections.get(uuid)?.connectionStatus === "RED");
  const offlineNames = offline.map(uuid => connections.get(uuid)?.name ?? uuid);
  const reachable = cameraUuids.filter(uuid => !offline.includes(uuid));
  const offlineNote =
    offline.length > 0
      ? `${offlineNames.join(", ")} ${offline.length === 1 ? "is" : "are"} offline (disconnected), so a reboot cannot reach ${offline.length === 1 ? "it" : "them"} and ${offline.length === 1 ? "it was" : "they were"} not rebooted. Suggest checking power and network on site; a reboot can be retried once it reconnects.`
      : undefined;
  if (reachable.length === 0) {
    const result = {
      status: "OFFLINE",
      successCount: 0,
      errorCount: 0,
      offlineCameras: offlineNames,
      message: `${offlineNote} Nothing was rebooted and no confirmation is needed.`,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
      structuredContent: result,
    };
  }

  // The id is bound to this tool and these cameras: confirming one reboot
  // never authorizes another.
  const confirmation = requireConfirmation(confirmationId, {
    tool: TOOL_NAME,
    args: { cameraUuids },
  });

  if (!isConfirmed(confirmation)) {
    return confirmation;
  }

  const cameraRebootData = await rebootCameras(reachable, requestModifiers, extra.sessionId);

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

  const result = offlineNote
    ? { ...cameraRebootData, offlineCameras: offlineNames, message: offlineNote }
    : cameraRebootData;
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result),
      },
    ],
    structuredContent: result,
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
          .describe(
            "SUCCESS when every reachable camera rebooted, PARTIAL_SUCCESS when some did, ERROR when none did, OFFLINE when every camera was disconnected (nothing sent)"
          ),
        successCount: z.number().optional(),
        errorCount: z.number().optional(),
        offlineCameras: z
          .array(z.string())
          .optional()
          .describe("Cameras that were disconnected and therefore not rebooted"),
        message: z.string().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
