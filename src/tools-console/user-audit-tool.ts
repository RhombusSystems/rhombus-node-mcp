import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAuditFeedForPrincipal,
  getAuditFeedForTarget,
} from "../api/user-audit-tool-api.js";
import {
  UserAuditRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/user-audit-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "user-audit-tool";

const TOOL_DESCRIPTION = `
This tool retrieves configuration audit trails for specific users or specific targets (devices, policies, etc.).
Unlike the general audit feed, this focuses on a SINGLE user or a SINGLE target entity.

It has the following modes of operation, determined by the "requestType" parameter:
- ${UserAuditRequestType.AUDIT_BY_USER}: Get all configuration changes made BY a specific user. Requires userUuid (use user-tool to find it). Answers: "What did this admin change recently?"
- ${UserAuditRequestType.AUDIT_BY_TARGET}: Get all configuration changes made TO a specific entity (camera, door, policy, etc.). Requires targetUuid. Answers: "Who changed the settings on this camera?"

Both modes return audit events with action, display text, who did it, what was changed, and when.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case UserAuditRequestType.AUDIT_BY_USER: {
        if (!args.userUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "userUuid is required for audit-by-user. Use user-tool to find it.",
          });
        }
        const auditEvents = await getAuditFeedForPrincipal(
          args.userUuid,
          args.maxResults ?? undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ auditEvents });
      }
      case UserAuditRequestType.AUDIT_BY_TARGET: {
        if (!args.targetUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "targetUuid is required for audit-by-target.",
          });
        }
        const auditEvents = await getAuditFeedForTarget(
          args.targetUuid,
          args.maxResults ?? undefined,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ auditEvents });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
    },
    TOOL_HANDLER
  );
}
