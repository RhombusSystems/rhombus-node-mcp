import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";
import { logger } from "../logger.js";
import { TOOL_ARGS, type ToolArgs } from "../types/semantic-search-tool-types.js";

const TOOL_NAME = "semantic-search";
const REQUEST_TIMEOUT_MS = 10_000;

const TOOL_DESCRIPTION = `
This tool performs semantic search across the Rhombus knowledge base (documentation,
support articles, and product content) using AI embeddings and vector similarity.

It finds the most relevant information based on the meaning of the query, not just
keyword matching. Each result contains:
- sourceTitle: the title of the source document
- sourceUrl: the URL where the content can be found
- chunkText: the relevant text snippet that matches the query
- score: similarity score (higher is more relevant)

Use this tool when you need to find information about:
- Camera features, specifications, or comparisons
- Installation, setup, and troubleshooting procedures
- Product capabilities, access control, and security features
- Cloud storage, management, and any other Rhombus product topics
`;

const TOOL_HANDLER = async (args: ToolArgs, _extra: any) => {
  const { query } = args;

  if (!query || query.trim().length === 0) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ error: "Query cannot be empty" }) }],
    };
  }

  try {
    const response = await axios.post(
      `${process.env.SEMANTIC_SEARCH_URL}/search`,
      { query: query.trim() },
      { timeout: REQUEST_TIMEOUT_MS }
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(response.data) }],
    };
  } catch (error) {
    logger.error(`semantic-search request failed: ${error instanceof Error ? error.message : error}`);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          }),
        },
      ],
    };
  }
};

export function createTool(server: McpServer) {
  // The semantic-search webservice is a separate, internally-hosted deployment
  // (rhombus-semantic-search). Only register the tool when it is configured.
  if (!process.env.SEMANTIC_SEARCH_URL) {
    logger.warn("SEMANTIC_SEARCH_URL not set — semantic-search tool not registered");
    return;
  }
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
