import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getDoorControllerRules,
  createDoorControllerRule,
  getDoorPolicies,
  createDoorPolicy,
} from "../api/door-tool-api.js";
import {
  DoorToolRequestType,
  OUTPUT_SCHEMA,
  TOOL_ARGS,
  type ToolArgs,
} from "../types/door-tool-types.js";
import {
  createToolStructuredContent,
  createToolTextContent,
  extractFromToolExtra,
} from "../util.js";

const TOOL_NAME = "door-tool";

const TOOL_DESCRIPTION = `
This tool manages Rhombus door controller rules and door policies.

It has the following modes of operation, determined by the "requestType" parameter:
- ${DoorToolRequestType.GET_DOOR_CONTROLLER_RULES}: Get all rules for a specific door controller. Requires doorControllerUuid.
- ${DoorToolRequestType.CREATE_DOOR_CONTROLLER_RULE}: Create a new rule for a door controller. Requires doorControllerUuid and ruleConfig (JSON string).
- ${DoorToolRequestType.GET_DOOR_POLICIES}: Get all door alert policies in the organization.
- ${DoorToolRequestType.CREATE_DOOR_POLICY}: Create a new door policy. Requires policyName and policyConfig (JSON string).

Use the get-entity-tool to find door controller and access controlled door UUIDs.
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: unknown) => {
  const { requestModifiers, sessionId } = extractFromToolExtra(_extra);

  try {
    switch (args.requestType) {
      case DoorToolRequestType.GET_DOOR_CONTROLLER_RULES: {
        if (!args.doorControllerUuid) {
          return createToolTextContent(
            JSON.stringify({ error: "doorControllerUuid is required for get-door-controller-rules." })
          );
        }
        const doorControllerRules = await getDoorControllerRules(
          args.doorControllerUuid, requestModifiers, sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({ doorControllerRules });
      }
      case DoorToolRequestType.CREATE_DOOR_CONTROLLER_RULE: {
        if (!args.doorControllerUuid || !args.ruleConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "doorControllerUuid and ruleConfig are required for create-door-controller-rule." })
          );
        }
        const config = JSON.parse(args.ruleConfig);
        config.deviceUuid = args.doorControllerUuid;
        const createdRule = await createDoorControllerRule(config, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ createdRule });
      }
      case DoorToolRequestType.GET_DOOR_POLICIES: {
        const doorPolicies = await getDoorPolicies(requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ doorPolicies });
      }
      case DoorToolRequestType.CREATE_DOOR_POLICY: {
        if (!args.policyConfig) {
          return createToolTextContent(
            JSON.stringify({ error: "policyConfig is required for create-door-policy." })
          );
        }
        const config = JSON.parse(args.policyConfig);
        if (args.policyName) config.name = args.policyName;
        const createdPolicy = await createDoorPolicy(config, requestModifiers, sessionId);
        return createToolStructuredContent<OUTPUT_SCHEMA>({ createdPolicy });
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
