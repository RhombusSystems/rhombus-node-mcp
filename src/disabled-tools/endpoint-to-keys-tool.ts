import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createToolTextContent } from "../util.js";
import { TOOL_ARGS, ToolArgs } from "../types/endpoint-to-keys-tool-types.js";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOL_NAME = "endpoint-to-keys-tool";

const TOOL_DESCRIPTION = `
Returns the output keys for a given API endpoint.
This tool helps you understand what fields are available in the response of any API endpoint.
Use this to determine which fields to include when using other tools that accept includeFields parameters.

Example usage:
- Input: "POST /api/camera/getMinimalCameraStateList"
- Output: ["wifiSignalStrength", "uuid", "name", "locationUuid", ...]

Always use this tool first when you need to know what fields are available for any API endpoint.
`;

// Load the routes-to-output-keys.json data
let routesData: Record<string, string[]> = {};

function loadRoutesData() {
  try {
    // Try multiple possible locations for the routes data
    const possiblePaths = [
      path.join(process.cwd(), 'assets', 'routes-to-output-keys.json'),
      path.join(process.cwd(), 'routes-to-output-keys.json'),
      path.join(__dirname, '..', '..', 'assets', 'routes-to-output-keys.json'),
    ];
    
    let fileContent = '';
    let usedPath = '';
    
    for (const routesPath of possiblePaths) {
      try {
        fileContent = fs.readFileSync(routesPath, 'utf8');
        usedPath = routesPath;
        break;
      } catch (e) {
        // Continue to next path
      }
    }
    
    if (!fileContent) {
      throw new Error(`Could not find routes-to-output-keys.json in any of: ${possiblePaths.join(', ')}`);
    }
    
    const data = JSON.parse(fileContent);
    routesData = data.routes || {};
    console.log(`Loaded ${Object.keys(routesData).length} route endpoints from ${usedPath}`);
  } catch (error) {
    console.error('Failed to load routes-to-output-keys.json:', error);
    routesData = {};
  }
}

// Load data on module initialization
loadRoutesData();

const TOOL_HANDLER = async (args: any, extra: any) => {
  const { endpoint } = args as ToolArgs;
  
  // Normalize the endpoint format
  const normalizedEndpoint = endpoint.trim();
  
  // Find the matching endpoint
  const outputKeys = routesData[normalizedEndpoint];
  
  if (!outputKeys) {
    // Try to find a partial match or suggest similar endpoints
    const availableEndpoints = Object.keys(routesData);
    const similarEndpoints = availableEndpoints.filter(ep => 
      ep.toLowerCase().includes(endpoint.toLowerCase()) || 
      endpoint.toLowerCase().includes(ep.toLowerCase())
    );
    
    return createToolTextContent(JSON.stringify({
      error: "Endpoint not found",
      message: `No output keys found for endpoint: ${endpoint}`,
      suggestion: similarEndpoints.length > 0 
        ? `Similar endpoints found: ${similarEndpoints.slice(0, 5).join(', ')}`
        : "Check the endpoint format. It should be like 'POST /api/camera/getMinimalCameraStateList'",
      availableEndpointsCount: availableEndpoints.length
    }, null, 2));
  }
  
  return createToolTextContent(JSON.stringify({
    endpoint: normalizedEndpoint,
    outputKeys: outputKeys,
    totalKeys: outputKeys.length
  }, null, 2));
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
