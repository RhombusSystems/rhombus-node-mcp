import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getMyRequest } from "../api/NEW_TOOL_NAME-api.js";
import {
  MyToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/NEW_TOOL_NAME-types.js";
import { createToolStructuredContent, extractFromToolExtra } from "../util.js";

const TOOL_NAME = "NEW_TOOL_NAME";

const TOOL_DESCRIPTION = `
TODO: PLEASE WRITE A DESCRIPTION FOR THIS TOOL.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const responseType = args.requestType;

  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (responseType) {
      // TODO: ADD CASES FOR EACH REQUEST TYPE
      case MyToolRequestType.NOT_IMPLEMENTED: {
        const myData = await getMyRequest(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          myData,
        });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({
        error: error.message,
      });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({
      error: "Unknown error",
    });
  }

  return createToolStructuredContent({
    error: "Invalid request type",
  });
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
