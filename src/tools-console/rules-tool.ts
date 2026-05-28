import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  listRules,
  createRule,
  updateRule,
  deleteRule,
  getRuleRecords,
} from "../api/rules-tool-api.js";
import {
  RulesToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/rules-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "rules-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus automation rules for triggering actions based on events.

It has the following modes of operation, determined by the "requestType" parameter:
- ${RulesToolRequestType.LIST}: List all automation rules in the organization.
- ${RulesToolRequestType.CREATE}: Create a new automation rule. Requires ruleName and ruleConfig (JSON string with the rule definition).
- ${RulesToolRequestType.UPDATE}: Update an existing rule. Requires ruleUuid and ruleConfig (JSON string with updated fields).
- ${RulesToolRequestType.DELETE}: Delete a rule. Requires ruleUuid.
- ${RulesToolRequestType.GET_RECORDS}: Get the event trigger history for a specific rule. Requires ruleUuid.

Rules can trigger notifications, recordings, and other actions based on events from cameras, sensors, doors, etc.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case RulesToolRequestType.LIST: {
        const rules = await listRules(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ rules });
      }
      case RulesToolRequestType.CREATE: {
        if (!args.ruleConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleConfig is required for create." })
          );
        }
        const config = JSON.parse(args.ruleConfig);
        if (args.ruleName) config.name = args.ruleName;
        const rule = await createRule(config, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ rule });
      }
      case RulesToolRequestType.UPDATE: {
        if (!args.ruleUuid || !args.ruleConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid and ruleConfig are required for update." })
          );
        }
        const updateConfig = JSON.parse(args.ruleConfig);
        updateConfig.ruleUuid = args.ruleUuid;
        const rule = await updateRule(updateConfig, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          rule: { uuid: args.ruleUuid, ...rule },
        });
      }
      case RulesToolRequestType.DELETE: {
        if (!args.ruleUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid is required for delete." })
          );
        }
        const rule = await deleteRule(args.ruleUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ rule });
      }
      case RulesToolRequestType.GET_RECORDS: {
        if (!args.ruleUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "ruleUuid is required for get-records." })
          );
        }
        const ruleRecords = await getRuleRecords(args.ruleUuid, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ ruleRecords });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return createToolStructuredContent<OUTPUT_SCHEMA>({ error: error.message });
    }
    return createToolStructuredContent<OUTPUT_SCHEMA>({ error: "Unknown error" });
  }

  return createToolStructuredContent({ error: "Invalid request type" });
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
