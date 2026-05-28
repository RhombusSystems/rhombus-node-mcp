import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  resolveUserUuid,
  getAccessEventsByUser,
} from "../api/user-access-trail-tool-api.js";
import {
  UserAccessTrailRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/user-access-trail-tool-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "user-access-trail-tool";

const TOOL_DESCRIPTION = `
This tool traces a specific user's physical access events across all doors and access points. It answers questions like "Where did this person badge in?" or "Show me all access events for this user."

It has the following modes of operation, determined by the "requestType" parameter:
- ${UserAccessTrailRequestType.GET_ACCESS_EVENTS_BY_USER}: Get access events using a known userUuid. Requires userUuid.
- ${UserAccessTrailRequestType.GET_ACCESS_EVENTS_BY_EMAIL}: Get access events by looking up the user's email first. Requires email. Automatically resolves the user UUID.

Both modes support optional startTimeMs, endTimeMs, and limit parameters.
Use the user-tool to find user UUIDs if needed, or use the email-based lookup directly.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    let userUuid: string;
    let userName: string | undefined;

    switch (args.requestType) {
      case UserAccessTrailRequestType.GET_ACCESS_EVENTS_BY_USER: {
        if (!args.userUuid) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "userUuid is required for get-access-events-by-user.",
          });
        }
        userUuid = args.userUuid;
        break;
      }
      case UserAccessTrailRequestType.GET_ACCESS_EVENTS_BY_EMAIL: {
        if (!args.email) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            error: "email is required for get-access-events-by-email.",
          });
        }
        const resolved = await resolveUserUuid(args.email, requestModifiers, sessionId);
        userUuid = resolved.uuid;
        userName = resolved.name;
        break;
      }
      default:
        return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Invalid request type" });
    }

    const accessEvents = await getAccessEventsByUser(
      userUuid,
      args.startTimeMs ?? undefined,
      args.endTimeMs ?? undefined,
      args.limit ?? undefined,
      requestModifiers,
      sessionId
    );

    return createToolStructuredContent<OUTPUT_SCHEMA>({
      userUuid,
      userName,
      accessEvents,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }
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
