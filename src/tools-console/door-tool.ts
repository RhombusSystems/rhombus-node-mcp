import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getDoorControllerRules,
  createDoorControllerRule,
  getDoorControllerRule,
  updateDoorControllerRule,
  deleteDoorControllerRule,
  getDoorPolicies,
  createDoorPolicy,
  updateDoorPolicy,
  deleteDoorPolicy,
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
- ${DoorToolRequestType.UPDATE_DOOR_CONTROLLER_RULE}: Change an existing rule. Requires doorControllerUuid, ruleUuid and ruleConfig; ruleConfig is merged over the rule's current configuration.
- ${DoorToolRequestType.DELETE_DOOR_CONTROLLER_RULE}: Delete a rule. Requires doorControllerUuid, ruleUuid and confirmDelete.
- ${DoorToolRequestType.GET_DOOR_POLICIES}: Get all door alert policies in the organization.
- ${DoorToolRequestType.CREATE_DOOR_POLICY}: Create a new door policy. Requires policyName and policyConfig (JSON string).
- ${DoorToolRequestType.UPDATE_DOOR_POLICY}: Rename a door policy and/or change its configuration. Requires policyUuid plus policyName and/or policyConfig.
- ${DoorToolRequestType.DELETE_DOOR_POLICY}: Delete a door policy. Requires policyUuid and confirmDelete.

Door rules and policies govern physical access. Deleting or disabling one can leave a door permanently unlocked or permanently locked, so state what will change and get explicit confirmation before any update or delete.

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
      case DoorToolRequestType.UPDATE_DOOR_POLICY: {
        if (!args.policyUuid) {
          return createToolTextContent("policyUuid is required for update-door-policy.");
        }
        if (!args.policyName?.trim() && !args.policyConfig) {
          return createToolTextContent(
            "update-door-policy needs at least one of policyName or policyConfig — both were empty, so there is nothing to change."
          );
        }

        // Parse before reading anything, so malformed JSON costs no calls and is
        // unambiguously safe to retry.
        let configPatch: Record<string, unknown> = {};
        if (args.policyConfig) {
          try {
            const parsed = JSON.parse(args.policyConfig);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
              return createToolTextContent(
                `RETRYABLE — nothing was changed. policyConfig must be a JSON object describing the door policy; received ${Array.isArray(parsed) ? "an array" : typeof parsed}.`
              );
            }
            configPatch = parsed as Record<string, unknown>;
          } catch (parseError) {
            return createToolTextContent(
              `RETRYABLE — nothing was changed. policyConfig is not valid JSON (${parseError instanceof Error ? parseError.message : "parse error"}).`
            );
          }
        }

        // updateDoorPolicy REPLACES the policy object, so merge over the current
        // one rather than sending the patch alone.
        const policies = await getDoorPolicies(requestModifiers, sessionId);
        const existing = policies.find(policy => policy.uuid === args.policyUuid);
        if (!existing) {
          return createToolTextContent(
            `No door policy in this organization has the uuid "${args.policyUuid}". Use get-door-policies to see the policies that exist — do not guess a uuid.`
          );
        }

        const { success, warningMsg } = await updateDoorPolicy(
          {
            ...existing,
            ...configPatch,
            uuid: args.policyUuid,
            name: args.policyName?.trim() || existing.name,
          },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated: { success, uuid: args.policyUuid },
          warningMsg,
          note: `Updated the door policy "${args.policyName?.trim() || existing.name || args.policyUuid}". Fields not included in policyConfig kept their previous values. This changes how every door on this policy behaves.`,
        });
      }
      case DoorToolRequestType.DELETE_DOOR_POLICY: {
        if (!args.policyUuid) {
          return createToolTextContent("policyUuid is required for delete-door-policy.");
        }
        const policies = await getDoorPolicies(requestModifiers, sessionId);
        const existing = policies.find(policy => policy.uuid === args.policyUuid);
        if (!existing) {
          return createToolTextContent(
            `No door policy in this organization has the uuid "${args.policyUuid}". Use get-door-policies to see the policies that exist.`
          );
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            doorPolicies: [existing],
            note:
              `NOT DELETED — nothing was changed. Deleting the door policy "${existing.name ?? args.policyUuid}" is irreversible and ` +
              `removes the alerting rules from every door using it. Tell the user what will stop being monitored and get explicit ` +
              `confirmation, then call this tool again with confirmDelete: true.`,
          });
        }
        const { success, uuid, warningMsg } = await deleteDoorPolicy(
          args.policyUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted: { success, uuid },
          warningMsg,
          note: `Deleted the door policy "${existing.name ?? args.policyUuid}". Doors that used it no longer have its alerting rules.`,
        });
      }
      case DoorToolRequestType.UPDATE_DOOR_CONTROLLER_RULE: {
        if (!args.doorControllerUuid || !args.ruleUuid) {
          return createToolTextContent(
            "doorControllerUuid and ruleUuid are both required for update-door-controller-rule — a rule is addressed by controller AND rule uuid."
          );
        }
        if (!args.ruleConfig) {
          return createToolTextContent("ruleConfig is required for update-door-controller-rule.");
        }
        let configPatch: Record<string, unknown>;
        try {
          const parsed = JSON.parse(args.ruleConfig);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return createToolTextContent(
              `RETRYABLE — nothing was changed. ruleConfig must be a JSON object describing the rule; received ${Array.isArray(parsed) ? "an array" : typeof parsed}.`
            );
          }
          configPatch = parsed as Record<string, unknown>;
        } catch (parseError) {
          return createToolTextContent(
            `RETRYABLE — nothing was changed. ruleConfig is not valid JSON (${parseError instanceof Error ? parseError.message : "parse error"}).`
          );
        }

        // updateDoorControllerRule REPLACES the rule, so merge over the current one.
        const existing = await getDoorControllerRule(
          args.doorControllerUuid,
          args.ruleUuid,
          requestModifiers,
          sessionId
        );
        if (!existing) {
          return createToolTextContent(
            `Door controller ${args.doorControllerUuid} has no rule with the uuid "${args.ruleUuid}". Use get-door-controller-rules for that controller to see its rules.`
          );
        }

        const { success } = await updateDoorControllerRule(
          args.doorControllerUuid,
          { ...existing, ...configPatch, uuid: args.ruleUuid },
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          updated: { success, uuid: args.ruleUuid },
          note: `Updated rule "${existing.name ?? args.ruleUuid}" on door controller ${args.doorControllerUuid}. Fields not included in ruleConfig kept their previous values. This changes the physical behaviour of the door.`,
        });
      }
      case DoorToolRequestType.DELETE_DOOR_CONTROLLER_RULE: {
        if (!args.doorControllerUuid || !args.ruleUuid) {
          return createToolTextContent(
            "doorControllerUuid and ruleUuid are both required for delete-door-controller-rule."
          );
        }
        const existing = await getDoorControllerRule(
          args.doorControllerUuid,
          args.ruleUuid,
          requestModifiers,
          sessionId
        );
        if (!existing) {
          return createToolTextContent(
            `Door controller ${args.doorControllerUuid} has no rule with the uuid "${args.ruleUuid}", so there is nothing to delete.`
          );
        }
        if (!args.confirmDelete) {
          return createToolStructuredContent<OUTPUT_SCHEMA>({
            doorControllerRules: [
              {
                uuid: existing.uuid ?? undefined,
                name: existing.name ?? undefined,
                deviceUuid: args.doorControllerUuid,
              },
            ],
            note:
              `NOT DELETED — nothing was changed. Deleting rule "${existing.name ?? args.ruleUuid}" from door controller ` +
              `${args.doorControllerUuid} is irreversible and changes how that door physically behaves — it can leave the door ` +
              `unlocked or locked outside its schedule. Confirm with the user, then call this tool again with confirmDelete: true.`,
          });
        }
        const { success, uuid } = await deleteDoorControllerRule(
          args.doorControllerUuid,
          args.ruleUuid,
          requestModifiers,
          sessionId
        );
        return createToolStructuredContent<OUTPUT_SCHEMA>({
          deleted: { success, uuid },
          note: `Deleted rule "${existing.name ?? args.ruleUuid}" from door controller ${args.doorControllerUuid}.`,
        });
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
      title: "Doors",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    TOOL_HANDLER
  );
}
