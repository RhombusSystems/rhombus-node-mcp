import { z } from "zod";

export const REDUCE_OUTPUT_ARGS = {
  includeFields: z
    .array(z.string())
    .describe("The fields to include in the response."),
}

export function addReduceOutputParams<TInputArgs extends object>(
  args: TInputArgs
): TInputArgs & typeof REDUCE_OUTPUT_ARGS {
  return {
    ...args,
    ...REDUCE_OUTPUT_ARGS,
  };
}

export function generateEndpointToKeysWorkflowText(
  endpointMap: Record<string, string>
): string {
  const endpointList = Object.entries(endpointMap)
    .map(([entityType, endpoint]) => `- ${entityType}: ${endpoint}`)
    .join('\n');

  // Automatically generate example from first entry in the map
  const [firstEntityType, firstEndpoint] = Object.entries(endpointMap)[0];
  const exampleEntityTypeName = firstEntityType.toLowerCase().replace(/_/g, ' ');
  const exampleFields = ["field1", "field2", "field3"];

  return `IMPORTANT: Before using this tool, you MUST first use the endpoint-to-keys-tool to get the available output fields for the relevant endpoints, then specify the fields you want in the includeFields parameter to reduce context size.

The following endpoints are called for each device type:
${endpointList}

REQUIRED WORKFLOW:
1. First call endpoint-to-keys-tool with the relevant endpoint(s) above, if the endpoint is not found, you can proceed to this tool with an empty includeFields parameter.
2. Then call this tool with the specific fields you need in includeFields parameter

Example for ${exampleEntityTypeName}s: 
1. Call endpoint-to-keys-tool with "${firstEndpoint}"
2. Use the returned keys to populate includeFields (e.g., ${JSON.stringify(exampleFields)})

Always use includeFields to limit the response size and get only the data you need.`;
}