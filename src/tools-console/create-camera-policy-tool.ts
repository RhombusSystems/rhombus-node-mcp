import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";
import { createCameraPolicy } from "../api/create-camera-policy-tool-api.js";
import {
  ApiPayloadSchema,
  OUTPUT_SCHEMA,
  SCHEDULE_CONFIGS_EXAMPLE,
  SUGGESTED_CAMERA_ACTIVITIES,
  isEmptyScheduleConfigs,
  parseCameraUuids,
  parseScheduleConfigs,
} from "../types/create-camera-policy-tool-types.js";
import { postApi } from "../network/network.js";
import type { schema } from "../types/schema.js";

const TOOL_NAME = "create-camera-policy-tool";
const TOOL_DESCRIPTION = `
A tool for creating a camera policy.

Preferred (single call): pass name, description, orgUuid, scheduleConfigs, and cameraUuids together — the tool creates the policy, configures its schedule triggers, and assigns the cameras all in one call. Omit policyUuid; it is created for you.

Legacy step-by-step: calling with only a subset of args advances one phase at a time (name/description/orgUuid to create → policyUuid+scheduleConfigs for schedules → policyUuid+cameraUuids for camera assignment).

Errors are labelled: a "RETRYABLE" error means nothing was written and you should call again with corrected arguments; a "PARTIAL STATE" error means part of the policy now exists and you must stop and report it.
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
  policyUuid: z
    .string()
    .optional()
    .describe(
      "Policy UUID of an EXISTING policy (for configuring schedules or assigning cameras on an already-created policy). Omit it when creating a policy — including on a single full call that also passes scheduleConfigs and cameraUuids."
    ),
  scheduleConfigs: z
    .string()
    .optional()
    .describe(
      `JSON array string of schedule configurations: [{"scheduleUuid": <uuid>, "activities": [<activity>, ...]}]. ` +
        `"activities" must be a real JSON array of activity strings, not a string containing an array, and each ` +
        `value must be an API activity constant (e.g. ${SUGGESTED_CAMERA_ACTIVITIES.slice(0, 6).join(", ")}) — ` +
        `never a display label like "Human Movement". Example: ${SCHEDULE_CONFIGS_EXAMPLE}`
    ),

  // Step 3: Camera assignment
  cameraUuids: z
    .string()
    .optional()
    .describe(
      'Comma-separated camera UUIDs to assign policy to, e.g. "uuidA,uuidB". Camera uuids only — resolve names to uuids first.'
    ),
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

// Errors are labelled by whether anything was written, because the caller cannot
// otherwise tell. The guided workflow says "on error, STOP and make no further
// calls" — correct after a partial mutation (a retry would create a SECOND
// policy) and wrong before one, where a corrected retry is free. Prod 2026-08-04:
// a malformed `scheduleConfigs` was rejected before any write, the model stopped
// and apologized, and the identical request succeeded when the user asked again.
const RETRYABLE_PREFIX = "RETRYABLE — nothing was created or changed by this call.";
const PARTIAL_PREFIX = "PARTIAL STATE — do NOT retry this call and do NOT create another policy.";
const RETRY_INSTRUCTION =
  "Fix the arguments named above, then call this tool ONCE more with corrected arguments. Do not tell the user the policy could not be created unless a corrected retry also fails.";

function retryableError(detail: string) {
  return errorResult(`${RETRYABLE_PREFIX} ${detail} ${RETRY_INSTRUCTION}`);
}

/** Retryable, but a policy from an earlier call already exists — don't re-create it. */
function retryableStepError(detail: string, existingPolicyUuid: string) {
  return errorResult(
    `${RETRYABLE_PREFIX} Policy ${existingPolicyUuid} already exists from an earlier call — do NOT create another one. ${detail} ${RETRY_INSTRUCTION}`
  );
}

function partialStateError(detail: string) {
  return errorResult(`${PARTIAL_PREFIX} ${detail} Report exactly this state to the user.`);
}

// postApi returns {error: true, status: "..."} on transport/HTTP failures and
// domain errors arrive as {error: true, errorMsg: "..."} — normalize both.
function apiErrorText(result: {
  errorMsg?: string | null;
  status?: string | null;
}): string {
  return (
    result.errorMsg?.trim() ||
    result.status?.trim() ||
    "the Rhombus API reported a failure without a message"
  );
}

/** api2 can succeed while reporting a caveat; dropping it hides real problems. */
function apiWarningSuffix(result: { warningMsg?: string | null }): string {
  const warning = result.warningMsg?.trim();
  return warning ? ` Note from the API: ${warning}` : "";
}

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { name, description, orgUuid, policyUuid, scheduleConfigs, cameraUuids, policyName } = args;

  // An empty list is how the legacy step-1 call spells "no schedules yet", so it
  // must not select the schedule phase. Detected by parsing, not by comparing to
  // the literal "[]" — "[ ]" and "\"[]\"" used to slip past that compare and
  // fall through into policy creation, silently creating a DUPLICATE policy.
  const hasScheduleConfigs = Boolean(
    scheduleConfigs?.trim() && !isEmptyScheduleConfigs(scheduleConfigs)
  );
  const hasFullInputSet = Boolean(name?.trim() && hasScheduleConfigs && cameraUuids?.trim());

  // A full input set PLUS a policyUuid is ambiguous: create everything, or treat
  // the uuid as an existing policy? It used to silently fall through to
  // camera-assignment-only and then report "setup completely finished" for a
  // policy whose schedules were never configured.
  if (hasFullInputSet && policyUuid?.trim()) {
    return retryableError(
      `Ambiguous arguments: name, scheduleConfigs, and cameraUuids were all provided (a full creation call) together with policyUuid "${policyUuid.trim()}". ` +
        `To create a new policy, drop policyUuid. To modify the existing policy ${policyUuid.trim()}, drop name and send policyUuid with ONE of scheduleConfigs or cameraUuids.`
    );
  }

  // Full run: all inputs present and no pre-existing policyUuid — create the
  // policy, configure schedules, and assign cameras in ONE call. The guided
  // workflow collects everything before confirming, and executing across three
  // model round trips proved fragile: the model wobbles at each call boundary
  // (re-renders forms, splits args wrong), so the boundaries are removed.
  if (hasFullInputSet) {
    // Validate BOTH structured inputs BEFORE any mutation, so anything wrong
    // with them is a clean retryable failure rather than a half-built policy.
    const parsedConfigs = parseScheduleConfigs(scheduleConfigs!);
    if (!parsedConfigs.ok) {
      return retryableError(parsedConfigs.message);
    }
    const parsedCameras = parseCameraUuids(cameraUuids!);
    if (!parsedCameras.ok) {
      return retryableError(parsedCameras.message);
    }
    const scheduledTriggers = parsedConfigs.value.map(config => ({
      scheduleUuid: config.scheduleUuid,
      triggerSet: config.activities.map(activity => ({ activity })),
    }));
    const cameraList = parsedCameras.value;

    // Phase 1: create.
    let createdUuid: string;
    let createWarning = "";
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
        return retryableError(`Creating the policy failed: ${apiErrorText(result)}.`);
      }
      if (!result.policyUuid) {
        return retryableError("Creating the policy returned no policyUuid, so it did not succeed.");
      }
      createdUuid = result.policyUuid;
      createWarning = apiWarningSuffix(result);
    } catch (error) {
      return retryableError(
        `Creating the policy failed: ${error instanceof Error ? error.message : "Unknown error"}.`
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
        return partialStateError(
          `Policy "${name}" was created (uuid ${createdUuid}) but configuring its schedules failed: ${apiErrorText(result)}. No cameras were assigned.`
        );
      }
      createWarning += apiWarningSuffix(result);
    } catch (error) {
      return partialStateError(
        `Policy "${name}" was created (uuid ${createdUuid}) but configuring its schedules failed: ${error instanceof Error ? error.message : "Unknown error"}. No cameras were assigned.`
      );
    }

    // Phase 3: cameras.
    try {
      const result = await postApi<{
        error?: boolean;
        errorMsg?: string;
        status?: string;
        warningMsg?: string;
      }>({
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
        return partialStateError(
          `Policy "${name}" was created with its schedules (uuid ${createdUuid}) but camera assignment failed: ${apiErrorText(result)}.`
        );
      }
      createWarning += apiWarningSuffix(result);
    } catch (error) {
      return partialStateError(
        `Policy "${name}" was created with its schedules (uuid ${createdUuid}) but camera assignment failed: ${error instanceof Error ? error.message : "Unknown error"}.`
      );
    }

    const fullRunResponse = {
      needUserInput: false,
      message: `Policy "${name}" created with ${scheduledTriggers.length} schedule trigger(s) and assigned to ${cameraList.length} camera(s).${createWarning}`,
      policyUuid: createdUuid,
      policyName: name,
    };
    return {
      content: [
        {
          type: "text" as const,
          text: `🎉 Camera policy setup completely finished!\n\n✅ Policy "${name}" created with ${scheduledTriggers.length} schedule trigger(s)\n✅ Assigned to ${cameraList.length} camera(s)\n✅ Policy is now fully active${createWarning}`,
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
      return retryableError(
        `Cannot assign cameras: policyUuid is empty, so the policy has not been created yet. ` +
          `Either pass the full set (name, scheduleConfigs, cameraUuids) in one call to create everything at once, or create the policy first (name/description/orgUuid call) and pass the returned policyUuid.`
      );
    }

    const parsedCameras = parseCameraUuids(cameraUuids);
    if (!parsedCameras.ok) {
      // Previously an unusable cameraUuids string (e.g. ",") left this branch
      // with no return at all and fell through into policy creation, creating a
      // duplicate policy and reporting success.
      return retryableStepError(parsedCameras.message, policyUuid.trim());
    }
    const cameraList = parsedCameras.value;

    try {
      const result = await postApi<{
        error?: boolean;
        errorMsg?: string;
        status?: string;
        warningMsg?: string;
      }>({
        route: "/camera/updateDetailsBulkV2",
        body: {
          cameraBulkDetails: cameraList.map(cameraUuid => ({
            uuid: cameraUuid,
            policyUuid: policyUuid,
            policyUuidUpdated: true,
          })),
        },
        modifiers: extra._meta?.requestModifiers as RequestModifiers,
        sessionId: extra.sessionId,
      });
      if (result?.error) {
        // Assigning cameras is idempotent, so a corrected retry is safe — but
        // the policy itself already exists and must not be created again.
        return retryableStepError(
          `Assigning the policy to the cameras failed: ${apiErrorText(result)}.`,
          policyUuid
        );
      }
      const warning = apiWarningSuffix(result);
      const jsonResultResponse = {
        needUserInput: false,
        message: `Policy "${policyName?.trim() || policyUuid}" assigned to ${cameraList.length} camera(s).${warning}`,
        policyUuid,
        policyName,
      };
      return {
        content: [
          {
            type: "text" as const,
            // Claims only what THIS call did: schedules may or may not have been
            // configured by an earlier call, and this branch cannot know.
            text: `✅ Policy "${policyName?.trim() || policyUuid}" assigned to ${cameraList.length} camera(s).${warning}`,
          },
        ],
        structuredContent: jsonResultResponse,
      };
    } catch (error) {
      return retryableStepError(
        `Assigning the policy to the cameras failed: ${error instanceof Error ? error.message : "Unknown error"}.`,
        policyUuid
      );
    }
  }

  // Step 2: Schedule configuration (if scheduleConfigs provided and non-empty)
  if (hasScheduleConfigs) {
    if (!policyUuid?.trim()) {
      return retryableError(
        `Cannot configure schedules: policyUuid is empty. Create the policy first (name/description/orgUuid call) and pass the returned policyUuid, or pass the full set (name, scheduleConfigs, cameraUuids) in one call to do everything at once.`
      );
    }

    const parsedConfigs = parseScheduleConfigs(scheduleConfigs!);
    if (!parsedConfigs.ok) {
      return retryableStepError(parsedConfigs.message, policyUuid.trim());
    }
    const scheduledTriggers = parsedConfigs.value.map(config => ({
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
      return retryableStepError(
        `Cannot configure schedules: policyName is required — updateCameraPolicy replaces the whole policy object, so omitting the name would erase it. Pass policyName (and description, if any) along with policyUuid and scheduleConfigs.`,
        policyUuid.trim()
      );
    }

    try {
      const result = await postApi<schema["Policy_UpdateCameraPolicyWSResponse"]>({
        route: "/policy/updateCameraPolicy",
        body: {
          policy: {
            uuid: policyUuid,
            name: effectiveName,
            description: description?.trim() ? description : undefined,
            scheduledTriggers,
          },
        },
        modifiers: extra._meta?.requestModifiers as RequestModifiers,
        sessionId: extra.sessionId,
      });

      if (result.error) {
        // Replacing the schedules is idempotent — safe to retry, as long as the
        // policy is not created a second time.
        return retryableStepError(
          `Configuring the policy schedules failed: ${apiErrorText(result)}.`,
          policyUuid
        );
      }

      // Neutral, fact-only message: imperative text like "Please select
      // which cameras..." is an instruction the model follows over the
      // workflow playbook (observed: it re-rendered the confirm form or
      // stopped mid-execution to ask for cameras it already had).
      const jsonResultResponse = {
        needUserInput: false,
        message: `Schedules configured for policy "${effectiveName}" (${policyUuid}).${apiWarningSuffix(result)}`,
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
    } catch (error) {
      return retryableStepError(
        `Configuring the policy schedules failed: ${error instanceof Error ? error.message : "Unknown error"}.`,
        policyUuid
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
        return retryableError(`Creating the policy failed: ${apiErrorText(result)}.`);
      }
      if (!result.policyUuid) {
        return retryableError("Creating the policy returned no policyUuid, so it did not succeed.");
      }
      console.error(
        `[createCameraPolicyTool] -- Policy created. Got result ${JSON.stringify(result)}`
      );
      // Neutral, fact-only message (see the schedule-step comment above).
      const jsonResultResponse = {
        needUserInput: false,
        message: `Policy "${name}" created with UUID: ${result.policyUuid}${apiWarningSuffix(result)}`,
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
      return retryableError(
        `Creating the policy failed: ${error instanceof Error ? error.message : "Unknown error"}.`
      );
    }
  }

  // Step 0: no args provided — tell the caller what's needed (plain facts, no
  // legacy elicitation requestType/submitAction hints).
  const initialFormResponse = {
    needUserInput: true,
    message:
      "No policy was created — this call had no arguments. To create a camera policy, collect from the user: a policy name (required), an optional description, the schedule triggers, and the cameras to assign, then call this tool again with name, description, orgUuid, scheduleConfigs, and cameraUuids together.",
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
