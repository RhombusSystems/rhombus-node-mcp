import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RequestModifiers } from "../util.js";
import { createCameraPolicy } from "../api/create-camera-policy-tool-api.js";
import { ApiPayloadSchema, OUTPUT_SCHEMA } from "../types/create-camera-policy-tool-types.js";
import { postApi } from "../network.js";
import schema from "../types/schema.js";

const TOOL_NAME = "create-camera-policy-tool";
const TOOL_DESCRIPTION = `
A tool for creating a camera policy that walks users through a multi-step process.

The step begins with the user providing a policy name, description, and organization UUID.
Then, the user is presented with a form to configure the schedules for the policy.
Finally, the user is presented with a form to assign the policy to cameras.

Uses elicitation forms for rich user interaction.
`;

const TOOL_ARGS = {
  // Step 1: Policy creation
  name: z.string().describe("Policy name (for creating policy)"),
  description: z.string().describe("Policy description (for creating policy)"),
  orgUuid: z.string().describe("Organization UUID (for creating policy)"),

  // Step 2: Schedule configuration
  policyUuid: z.string().describe("Policy UUID (for configuring schedules)"),
  scheduleConfigs: z.string().describe("JSON string of schedule configurations"),

  // Step 3: Camera assignment
  cameraUuids: z.string().describe("Comma-separated camera UUIDs to assign policy to"),
  policyName: z.string().describe("Policy name (for reference)"),
} as const;

const TOOL_ARGS_SCHEMA = z.object(TOOL_ARGS);
export type ToolArgs = z.infer<typeof TOOL_ARGS_SCHEMA>;

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { name, description, orgUuid, policyUuid, scheduleConfigs, cameraUuids, policyName } = args;

  // Step 3: Camera assignment (if cameraUuids provided)
  if (cameraUuids?.trim()) {
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

        await postApi({
          route: "/camera/updateDetailsBulkV2",
          body: cameraPayload,
          modifiers: extra._meta?.requestModifiers as RequestModifiers,
          sessionId: extra.sessionId,
        });
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
              text: `🎉 Camera policy setup completely finished!\n\n✅ Policy "${policyName}" assigned to ${cameraList.length} camera(s)\n✅ Policy is now fully active\n\nYour cameras will now generate alerts according to the policy configuration.`,
            },
          ],
          structuredContent: jsonResultResponse,
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to assign policy to cameras: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      };
    }
  }

  // Step 2: Schedule configuration (if scheduleConfigs provided and non-empty)
  if (scheduleConfigs?.trim() && scheduleConfigs.trim() !== "[]") {
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

        const payload = {
          policy: { uuid: policyUuid, scheduledTriggers },
        };

        const result = await postApi<schema["Policy_UpdateCameraPolicyWSResponse"]>({
          route: "/policy/updateCameraPolicy",
          body: payload,
          modifiers: extra._meta?.requestModifiers as RequestModifiers,
          sessionId: extra.sessionId,
        });

        if (result.error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Failed to configure policy schedules: ${result.errorMsg || "Unknown error"}`,
              },
            ],
          };
        }

        // Success - now show camera assignment form
        const jsonResultResponse = {
          needUserInput: true,
          message: `Excellent! Policy schedules configured.\n\nFinal step: Please select which cameras should use this policy.`,
          requestType: "camera-assignment",
          submitAction: "create-camera-policy-tool",
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
      return {
        content: [
          {
            type: "text" as const,
            text: `Error configuring schedules: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      };
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
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to create camera policy: ${result.errorMsg || "Unknown error"}`,
            },
          ],
        };
      }
      console.error(
        `[createCameraPolicyTool] -- Proceeding with schedule-trigger-configuration form. Got result ${JSON.stringify(result)}`
      );
      // Success - now show schedule configuration form
      const jsonResultResponse = {
        needUserInput: true,
        message: `Great! Your policy "${name}" was created with UUID: ${result.policyUuid}\n\nNext, let's configure when this policy should be active and what activities should trigger alerts.`,
        requestType: "schedule-trigger-configuration",
        submitAction: "create-camera-policy-tool",
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
      return {
        content: [
          {
            type: "text" as const,
            text: `Error creating camera policy: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      };
    }
  }

  // Step 0: Show initial form (no args provided)
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({
          needUserInput: true,
          message:
            "Please provide the following information to create your camera policy:\n\n1. **Policy Name** (required): A descriptive name for the policy\n2. **Policy Description** (optional): What this policy does\n3. **Organization UUID** (optional): Leave blank to use your current organization\n\nOnce you provide this information, I'll create the policy for you.",
          requestType: "policy-creation-form",
          submitAction: "create-camera-policy-tool",
        }),
      },
    ],
  };
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
