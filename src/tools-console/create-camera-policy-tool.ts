import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";
import { createCameraPolicy } from "../api/create-camera-policy-tool-api.js";
import { ApiPayloadSchema, OUTPUT_SCHEMA } from "../types/create-camera-policy-tool-types.js";
import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";

const TOOL_NAME = "create-camera-policy-tool";
const TOOL_DESCRIPTION = `
A tool for creating a camera policy.

Preferred (single call): pass name, description, orgUuid, scheduleConfigs, and cameraUuids together — the tool creates the policy, configures its schedule triggers, and assigns the cameras all in one call. Omit policyUuid; it is created for you.

Legacy step-by-step: calling with only a subset of args advances one phase at a time (name/description/orgUuid to create → policyUuid+scheduleConfigs for schedules → policyUuid+cameraUuids for camera assignment).
`;

// All args are optional: each step of the flow uses a different subset, and
// requiring the unused ones forces callers to pad with "" — the guided
// workflow's "pass ONLY this step's args" instruction then fails validation.
const TOOL_ARGS = {
  // Step 1: Policy creation
  name: z.string().optional().describe("Policy name (for creating policy)"),
  description: z.string().optional().describe("Policy description (for creating policy)"),
  orgUuid: z.string().optional().describe("Organization UUID (for creating policy)"),

  // Step 2: Schedule configuration
  policyUuid: z.string().optional().describe("Policy UUID (for configuring schedules)"),
  scheduleConfigs: z.string().optional().describe("JSON string of schedule configurations"),

  // Step 3: Camera assignment
  cameraUuids: z.string().optional().describe("Comma-separated camera UUIDs to assign policy to"),
  policyName: z.string().optional().describe("Policy name (for reference)"),
} as const;

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

// Every result from this tool MUST carry structuredContent: the tool registers
// an outputSchema, and the MCP SDK rejects any result without structuredContent
// as "MCP error -32602" — which REPLACES the real failure text and historically
// made the model (and user) see a validation crash instead of the API error.
function errorResult(text: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text }],
    structuredContent: { needUserInput: false, message: text },
  };
}

// postApi returns {error: true, status: "..."} on 401/403 and domain errors
// arrive as {error: true, errorMsg: "..."} — normalize both.
function apiErrorText(result: { errorMsg?: string | null; status?: string | null }): string {
  return result.errorMsg || result.status || "Unknown error";
}

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { name, description, orgUuid, policyUuid, scheduleConfigs, cameraUuids, policyName } = args;

  // Full run: all inputs present and no pre-existing policyUuid — create the
  // policy, configure schedules, and assign cameras in ONE call. The guided
  // workflow collects everything before confirming, and executing across three
  // model round trips proved fragile: the model wobbles at each call boundary
  // (re-renders forms, splits args wrong), so the boundaries are removed.
  if (
    name?.trim() &&
    scheduleConfigs?.trim() &&
    scheduleConfigs.trim() !== "[]" &&
    cameraUuids?.trim() &&
    !policyUuid?.trim()
  ) {
    // Validate both structured inputs BEFORE any mutation.
    let scheduledTriggers: Array<{ scheduleUuid: string; triggerSet: Array<{ activity: string }> }>;
    try {
      const configs = JSON.parse(scheduleConfigs) as Array<{
        scheduleUuid: string;
        activities: string[];
      }>;
      scheduledTriggers = configs.map(config => ({
        scheduleUuid: config.scheduleUuid,
        triggerSet: config.activities.map(activity => ({ activity })),
      }));
    } catch (error) {
      return errorResult(
        `scheduleConfigs is not valid JSON (${error instanceof Error ? error.message : "Unknown error"}). Nothing was created — fix scheduleConfigs and retry.`
      );
    }
    const cameraList = cameraUuids
      .split(",")
      .map((uuid: string) => uuid.trim())
      .filter((uuid: string) => uuid);
    if (scheduledTriggers.length === 0 || cameraList.length === 0) {
      return errorResult(
        `scheduleConfigs and cameraUuids must both be non-empty for a full-run call. Nothing was created.`
      );
    }

    // Phase 1: create.
    let createdUuid: string;
    try {
      const payload = ApiPayloadSchema.parse({
        policy: {
          name,
          description: description?.trim() ? description : undefined,
          orgUuid: orgUuid?.trim() ? orgUuid : undefined,
          scheduledTriggers: [],
        },
      });
      const result = await createCameraPolicy(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );
      if (result.error) {
        return errorResult(
          `Failed to create camera policy: ${apiErrorText(result)}. Nothing was created — report this failure to the user; do not claim any part succeeded.`
        );
      }
      if (!result.policyUuid) {
        return errorResult(
          `Policy creation returned no policyUuid — treat this as a failure. Nothing was created — report this to the user.`
        );
      }
      createdUuid = result.policyUuid;
    } catch (error) {
      return errorResult(
        `Error creating camera policy: ${error instanceof Error ? error.message : "Unknown error"}. Nothing was created — report this failure to the user.`
      );
    }

    // Phase 2: schedules (updateCameraPolicy REPLACES the policy object, so
    // resend the identity fields — see the legacy schedule branch below).
    try {
      const result = await postApi<schema["Policy_UpdateCameraPolicyWSResponse"]>({
        route: "/policy/updateCameraPolicy",
        body: {
          policy: {
            uuid: createdUuid,
            name,
            description: description?.trim() ? description : undefined,
            scheduledTriggers,
          },
        },
        modifiers: extra._meta?.requestModifiers as RequestModifiers,
        sessionId: extra.sessionId,
      });
      if (result.error) {
        return errorResult(
          `Policy "${name}" was created (uuid ${createdUuid}) but configuring its schedules failed: ${apiErrorText(result)}. No cameras were assigned. Report exactly this partial state to the user.`
        );
      }
    } catch (error) {
      return errorResult(
        `Policy "${name}" was created (uuid ${createdUuid}) but configuring its schedules failed: ${error instanceof Error ? error.message : "Unknown error"}. No cameras were assigned. Report exactly this partial state to the user.`
      );
    }

    // Phase 3: cameras.
    try {
      const result = await postApi<{ error?: boolean; errorMsg?: string; status?: string }>({
        route: "/camera/updateDetailsBulkV2",
        body: {
          cameraBulkDetails: cameraList.map(cameraUuid => ({
            uuid: cameraUuid,
            policyUuid: createdUuid,
            policyUuidUpdated: true,
          })),
        },
        modifiers: extra._meta?.requestModifiers as RequestModifiers,
        sessionId: extra.sessionId,
      });
      if (result?.error) {
        return errorResult(
          `Policy "${name}" was created with its schedules (uuid ${createdUuid}) but camera assignment failed: ${apiErrorText(result)}. Report exactly this partial state to the user.`
        );
      }
    } catch (error) {
      return errorResult(
        `Policy "${name}" was created with its schedules (uuid ${createdUuid}) but camera assignment failed: ${error instanceof Error ? error.message : "Unknown error"}. Report exactly this partial state to the user.`
      );
    }

    const fullRunResponse = {
      needUserInput: false,
      message: `Policy "${name}" created with ${scheduledTriggers.length} schedule trigger(s) and assigned to ${cameraList.length} camera(s).`,
      policyUuid: createdUuid,
      policyName: name,
    };
    return {
      content: [
        {
          type: "text" as const,
          text: `🎉 Camera policy setup completely finished!\n\n✅ Policy "${name}" created with ${scheduledTriggers.length} schedule trigger(s)\n✅ Assigned to ${cameraList.length} camera(s)\n✅ Policy is now fully active`,
        },
      ],
      structuredContent: fullRunResponse,
    };
  }

  // Step 3: Camera assignment (if cameraUuids provided)
  if (cameraUuids?.trim()) {
    // Guard BEFORE the API call: an empty policyUuid here would write
    // policyUuid: "" with policyUuidUpdated: true to every listed camera —
    // i.e. UNASSIGN their existing policies, not assign the new one.
    if (!policyUuid?.trim()) {
      return errorResult(
        `Cannot assign cameras: policyUuid is empty. The policy has not been created (or its creation failed). Create the policy first (name/description/orgUuid call) and pass the returned policyUuid. Do NOT combine creation, schedule, and camera args in one call — the steps run one at a time.`
      );
    }
    try {
      const cameraList = cameraUuids
        .split(",")
        .map((uuid: string) => uuid.trim())
        .filter((uuid: string) => uuid);

      if (cameraList.length > 0) {
        const cameraPayload = {
          cameraBulkDetails: cameraList.map(cameraUuid => ({
            uuid: cameraUuid,
            policyUuid: policyUuid,
            policyUuidUpdated: true,
          })),
        };

        const result = await postApi<{ error?: boolean; errorMsg?: string; status?: string }>({
          route: "/camera/updateDetailsBulkV2",
          body: cameraPayload,
          modifiers: extra._meta?.requestModifiers as RequestModifiers,
          sessionId: extra.sessionId,
        });
        if (result?.error) {
          return errorResult(
            `Failed to assign policy to cameras: ${apiErrorText(result)}. The policy was NOT assigned — report this failure to the user; do not claim success.`
          );
        }
        const jsonResultResponse = {
          needUserInput: false,
          message: `Excellent! Policy created and assigned to ${cameraList.length} camera(s)!`,
          policyUuid,
          policyName,
        };
        return {
          content: [
            {
              type: "text" as const,
              text: `🎉 Camera policy setup completely finished!\n\n✅ Policy "${policyName?.trim() || policyUuid}" assigned to ${cameraList.length} camera(s)\n✅ Policy is now fully active\n\nYour cameras will now generate alerts according to the policy configuration.`,
            },
          ],
          structuredContent: jsonResultResponse,
        };
      }
    } catch (error) {
      return errorResult(
        `Failed to assign policy to cameras: ${error instanceof Error ? error.message : "Unknown error"}. The policy was NOT assigned — report this failure to the user; do not claim success.`
      );
    }
  }

  // Step 2: Schedule configuration (if scheduleConfigs provided and non-empty)
  if (scheduleConfigs?.trim() && scheduleConfigs.trim() !== "[]") {
    if (!policyUuid?.trim()) {
      return errorResult(
        `Cannot configure schedules: policyUuid is empty. Create the policy first (name/description/orgUuid call) and pass the returned policyUuid. Do NOT combine creation, schedule, and camera args in one call — the steps run one at a time.`
      );
    }
    try {
      const configs = JSON.parse(scheduleConfigs) as Array<{
        scheduleUuid: string;
        activities: string[];
      }>;

      // Only proceed if we have actual schedule configurations
      if (configs.length > 0) {
        const scheduledTriggers = configs.map(config => ({
          scheduleUuid: config.scheduleUuid,
          triggerSet: config.activities.map(activity => ({ activity })),
        }));

        // /policy/updateCameraPolicy has REPLACE semantics: any field omitted
        // from the policy object is NULLED on the stored policy. Sending only
        // {uuid, scheduledTriggers} erases the name/description that step 1
        // just set (observed in ITG: wizard-created policies with name: null,
        // invisible in the Console). Always resend the identity fields.
        const effectiveName = policyName?.trim() || name?.trim();
        if (!effectiveName) {
          return errorResult(
            `Cannot configure schedules: policyName is required — updateCameraPolicy replaces the whole policy object, so omitting the name would erase it. Pass policyName (and description, if any) along with policyUuid and scheduleConfigs.`
          );
        }
        const payload = {
          policy: {
            uuid: policyUuid,
            name: effectiveName,
            description: description?.trim() ? description : undefined,
            scheduledTriggers,
          },
        };

        const result = await postApi<schema["Policy_UpdateCameraPolicyWSResponse"]>({
          route: "/policy/updateCameraPolicy",
          body: payload,
          modifiers: extra._meta?.requestModifiers as RequestModifiers,
          sessionId: extra.sessionId,
        });

        if (result.error) {
          return errorResult(
            `Failed to configure policy schedules: ${apiErrorText(result)}. The schedules were NOT configured — report this failure to the user; do not claim success.`
          );
        }

        // Neutral, fact-only message: imperative text like "Please select
        // which cameras..." is an instruction the model follows over the
        // workflow playbook (observed: it re-rendered the confirm form or
        // stopped mid-execution to ask for cameras it already had).
        const jsonResultResponse = {
          needUserInput: false,
          message: `Schedules configured for policy "${effectiveName}" (${policyUuid}).`,
          policyUuid,
          policyName,
        };
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(jsonResultResponse),
            },
          ],
          structuredContent: jsonResultResponse,
        };
      }
      // If configs.length === 0, fall through to policy creation
    } catch (error) {
      return errorResult(
        `Error configuring schedules: ${error instanceof Error ? error.message : "Unknown error"}. The schedules were NOT configured — report this failure to the user; do not claim success.`
      );
    }
  }

  // Step 1: Policy creation (if name provided)
  if (name?.trim()) {
    try {
      const payload = ApiPayloadSchema.parse({
        policy: {
          name,
          description: description?.trim() ? description : undefined,
          orgUuid: orgUuid?.trim() ? orgUuid : undefined,
          scheduledTriggers: [],
        },
      });

      const result = await createCameraPolicy(
        payload,
        extra._meta?.requestModifiers as RequestModifiers,
        extra.sessionId
      );

      if (result.error) {
        return errorResult(
          `Failed to create camera policy: ${apiErrorText(result)}. The policy was NOT created — report this failure to the user and stop the workflow; do not proceed to schedules or cameras.`
        );
      }
      if (!result.policyUuid) {
        return errorResult(
          `Policy creation returned no policyUuid — treat this as a failure. Report it to the user and stop the workflow; do not proceed to schedules or cameras.`
        );
      }
      console.error(
        `[createCameraPolicyTool] -- Policy created. Got result ${JSON.stringify(result)}`
      );
      // Neutral, fact-only message (see the schedule-step comment above).
      const jsonResultResponse = {
        needUserInput: false,
        message: `Policy "${name}" created with UUID: ${result.policyUuid}`,
        policyUuid: result.policyUuid,
        policyName: name,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(jsonResultResponse),
          },
        ],
        structuredContent: jsonResultResponse,
      };
    } catch (error) {
      return errorResult(
        `Error creating camera policy: ${error instanceof Error ? error.message : "Unknown error"}. The policy was NOT created — report this failure to the user and stop the workflow.`
      );
    }
  }

  // Step 0: Show initial form (no args provided)
  const initialFormResponse = {
    needUserInput: true,
    message:
      "Please provide the following information to create your camera policy:\n\n1. **Policy Name** (required): A descriptive name for the policy\n2. **Policy Description** (optional): What this policy does\n3. **Organization UUID** (optional): Leave blank to use your current organization\n\nOnce you provide this information, I'll create the policy for you.",
    requestType: "policy-creation-form" as const,
    submitAction: "create-camera-policy-tool",
  };
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(initialFormResponse),
      },
    ],
    structuredContent: initialFormResponse,
  };
};

export function createTool(server: McpServer) {
  server.registerTool(
    TOOL_NAME,
    {
      title: "Create Camera Policy",
      description: TOOL_DESCRIPTION,
      inputSchema: TOOL_ARGS,
      outputSchema: OUTPUT_SCHEMA.shape,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    TOOL_HANDLER
  );
}
