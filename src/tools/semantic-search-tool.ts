import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FaissSearchService } from '../services/faiss-search-service.js';
import { createToolTextContent } from '../util.js';
import { logger } from '../logger.js';
import { TOOL_ARGS, ToolArgs } from '../types/semantic-search-tool-args.js';

// Constants following coding style guidelines
const DEFAULT_SEARCH_LIMIT = 10;
const DEFAULT_MIN_SIMILARITY = 0.3;

const TOOL_NAME = "semantic-search";

const TOOL_DESCRIPTION = `
This tool performs semantic search across the Rhombus knowledge base using AI embeddings and vector similarity.

It searches through documentation, blog posts, support articles, and other content to find the most relevant 
information based on the meaning of your query, not just keyword matching.

The tool returns an array of search results, each containing:
- sourceTitle: The title of the source document
- sourceUrl: The URL where the content can be found
- chunkText: The relevant text snippet that matches your query

Use this tool when you need to find information about:
- Camera features, specifications, or comparisons
- Installation and setup procedures  
- Technical troubleshooting
- Product capabilities and benefits
- Access control and security features
- Cloud storage and management
- Any other Rhombus-related topics
`;

// Singleton instance for reuse across searches
let globalSearchService: FaissSearchService | null = null;
let isGlobalServiceInitialized = false;

async function getSearchService(): Promise<FaissSearchService> {
  if (!globalSearchService) {
    globalSearchService = new FaissSearchService();
  }
  
  if (!isGlobalServiceInitialized) {
    await globalSearchService.loadEmbeddings();
    await globalSearchService.loadIndex();
    isGlobalServiceInitialized = true;
  }
  
  return globalSearchService;
}

const TOOL_HANDLER = async (args: ToolArgs, extra: any) => {
  const { query } = args;

  try {
    if (!query || query.trim().length === 0) {
      return createToolTextContent(JSON.stringify({ error: "Query cannot be empty" }));
    }

    const searchService = await getSearchService();
    
    const searchOptions = {
      query: query.trim(),
      limit: DEFAULT_SEARCH_LIMIT,
      minSimilarity: DEFAULT_MIN_SIMILARITY,
      urlPattern: undefined,
    };

    const { results, stats } = await searchService.search(searchOptions);
    
    const searchResults = results.map(result => ({
      sourceTitle: result.sourceTitle,
      sourceUrl: result.sourceUrl,
      chunkText: result.chunkText,
    }));

    logger.info('Semantic search results:', results);

    // Log search statistics for debugging
    logger.info('Semantic search stats:', {
      searchTime: stats.searchTime,
      totalVectors: stats.totalVectors,
      resultsReturned: stats.resultsReturned,
      resultsFiltered: stats.resultsFiltered,
      query: query.trim()
    });

    return createToolTextContent(JSON.stringify(searchResults));

  } catch (error) {
    return createToolTextContent(JSON.stringify({ 
      error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }));
  }
};

export function createTool(server: McpServer) {
  server.tool(TOOL_NAME, TOOL_DESCRIPTION, TOOL_ARGS, TOOL_HANDLER);
}
