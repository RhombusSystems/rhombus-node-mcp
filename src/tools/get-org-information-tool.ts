import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getOrg } from "../api/get-org-information-tool-api.js";
import { TOOL_ARGS, type ToolArgs } from "../types/get-org-information-tool-types.js";
import { RequestModifiers } from "../util.js";

const TOOL_NAME = "get-org-information";
const TOOL_DESCRIPTION =
  "Get general information about the organization including org name, camera configuration defaults, contact information, and org settings.";

const TOOL_HANDLER = async (_: ToolArgs, extra: any) => {
  const response = await getOrg(extra._meta?.requestModifiers as RequestModifiers, extra.sessionId);

  if (response?.error) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Failed to fetch organization information: ${response.errorMsg ?? response.status ?? "unknown error"}`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response),
      },
    ],
    structuredContent: response,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Organization Information",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      // /org/getOrgV2's org record is free-form (contact info, defaults,
      // settings), so it is declared as an open record rather than enumerated —
      // field paths like "org.name" / "org.uuid" still project fine.
      outputSchema: {
        org: z
          .record(z.string(), z.unknown())
          .optional()
          .describe(
            "The organization record: name, uuid, contact information, camera configuration defaults, org settings. Project with paths like \"org.name\", \"org.uuid\"."
          ),
        warningMsg: z.string().nullable().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    TOOL_HANDLER
  );
}
