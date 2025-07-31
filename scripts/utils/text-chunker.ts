import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { get_encoding } from "tiktoken";

// Constants following coding style guidelines
const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;
const MIN_CHUNK_SIZE = 100;
const MAX_CHUNK_SIZE = 2000;

// tiktoken encoder for accurate token counting
const encoder = get_encoding("cl100k_base"); // GPT-3.5/4 tokenizer

export interface ChunkResult {
  chunkId: string;
  content: string;
  tokenCount: number;
  chunkIndex: number;
}

export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export class TextChunker {
  private splitter: RecursiveCharacterTextSplitter;

  constructor(options: ChunkingOptions = {}) {
    const chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
    const chunkOverlap = options.chunkOverlap || DEFAULT_OVERLAP;

    // Validate chunk size bounds
    if (chunkSize < MIN_CHUNK_SIZE || chunkSize > MAX_CHUNK_SIZE) {
      throw new Error(`Chunk size must be between ${MIN_CHUNK_SIZE} and ${MAX_CHUNK_SIZE} tokens`);
    }

    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
      separators: ["\n\n", "\n", " ", ""], // Logical split points
      lengthFunction: (text: string) => {
        // Get accurate token count using tiktoken
        const tokens = encoder.encode(text);
        return tokens.length;
      },
    });
  }

  /**
   * Chunk text content into semantically meaningful pieces
   * @param content - The text content to chunk
   * @param sourceId - Unique identifier for the source (used in chunk IDs)
   * @returns Array of chunk results with metadata
   */
  async chunkText(content: string, sourceId: string): Promise<ChunkResult[]> {
    if (!content || content.trim().length === 0) {
      return [];
    }

    try {
      const chunks = await this.splitter.splitText(content);
      
      return chunks.map((chunkContent, index) => {
        const tokens = encoder.encode(chunkContent);
        
        return {
          chunkId: `${sourceId}-chunk-${String(index).padStart(3, '0')}`,
          content: chunkContent.trim(),
          tokenCount: tokens.length,
          chunkIndex: index,
        };
      }).filter(chunk => chunk.content.length > 0); // Filter out empty chunks
    } catch (error) {
      throw new Error(`Failed to chunk text for ${sourceId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get token count for a given text
   * @param text - Text to count tokens for
   * @returns Number of tokens
   */
  getTokenCount(text: string): number {
    const tokens = encoder.encode(text);
    return tokens.length;
  }

  /**
   * Clean up tiktoken encoder resources
   */
  dispose(): void {
    encoder.free();
  }
}

// Export convenience function for one-off chunking
export async function chunkText(
  content: string, 
  sourceId: string, 
  options: ChunkingOptions = {}
): Promise<ChunkResult[]> {
  const chunker = new TextChunker(options);
  try {
    return await chunker.chunkText(content, sourceId);
  } finally {
    chunker.dispose();
  }
}
