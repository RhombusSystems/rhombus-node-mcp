import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import faiss from 'faiss-node';
import { EmbeddingService } from './embedding-service.js';

// Constants following coding style guidelines
const FAISS_INDEX_TYPE = 'IndexFlatIP'; // Inner Product for cosine similarity
const SEARCH_RESULTS_LIMIT = 50;
const SIMILARITY_THRESHOLD = 0.3;
const EMBEDDING_DIMENSIONS = 1536; // text-embedding-3-small dimensions

// Get project root directory - resolves relative to the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const EMBEDDINGS_DATA_PATH = path.join(PROJECT_ROOT, 'data/embeddings/embeddings.json');
const FAISS_INDEX_PATH = path.join(PROJECT_ROOT, 'data/embeddings/faiss.index');

export interface EmbeddingData {
  chunkId: string;
  embedding: number[];
  chunkText: string;
  sourceUrl: string;
  sourceTitle: string;
  chunkIndex: number;
  tokenCount: number;
  model: string;
  cost: number;
  createdAt: string;
  metadata: {
    totalChunksFromSource: number;
    chunkingStrategy: string;
    sourceFile: string;
  };
}

export interface SearchParams {
  query: string;
  limit?: number;
  minSimilarity?: number;
  urlPattern?: string;
}

export interface SearchResult {
  chunkText: string;      // The actual chunk content
  sourceUrl: string;      // Original page URL
  sourceTitle: string;    // Original page title
  similarity: number;     // Cosine similarity score
  chunkId: string;        // Unique chunk identifier
  chunkIndex: number;     // Position in original document
  tokenCount: number;     // Number of tokens in chunk
  metadata: {
    totalChunksFromSource: number;
    chunkingStrategy: string;
    sourceFile: string;
  };
}

export interface SearchStats {
  totalVectors: number;
  searchTime: number;
  resultsReturned: number;
  resultsFiltered: number;
}

export class FaissSearchService {
  private index: faiss.IndexFlatIP | null = null;
  private embeddings: EmbeddingData[] = [];
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Load embeddings from file and build FAISS index
   * @param embeddingsPath - Path to embeddings.json file (optional, defaults to project data directory)
   */
  async loadEmbeddings(embeddingsPath?: string): Promise<void> {

    const resolvedEmbeddingsPath = embeddingsPath || EMBEDDINGS_DATA_PATH;

    console.log(`📚 Loading embeddings from ${resolvedEmbeddingsPath}...`);
    
    try {
      const fileContent = await fs.readFile(resolvedEmbeddingsPath, 'utf-8');
      this.embeddings = JSON.parse(fileContent);
      
      if (!Array.isArray(this.embeddings)) {
        throw new Error('Embeddings file does not contain a valid array');
      }

      console.log(`✅ Loaded ${this.embeddings.length} embeddings`);
      
      // Validate embedding dimensions
      if (this.embeddings.length > 0) {
        const firstEmbedding = this.embeddings[0];
        if (!firstEmbedding.embedding || firstEmbedding.embedding.length !== EMBEDDING_DIMENSIONS) {
          throw new Error(`Invalid embedding dimensions. Expected ${EMBEDDING_DIMENSIONS}, got ${firstEmbedding.embedding?.length || 0}`);
        }
      }

    } catch (error) {
      throw new Error(`Failed to load embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build FAISS index from loaded embeddings
   */
  async buildIndex(): Promise<void> {
    if (this.embeddings.length === 0) {
      throw new Error('No embeddings loaded. Call loadEmbeddings() first.');
    }

    console.log(`🏗️ Building FAISS index with ${this.embeddings.length} vectors...`);
    
    const startTime = Date.now();
    
    try {
      // Create FAISS index for inner product (cosine similarity with normalized vectors)
      this.index = new faiss.IndexFlatIP(EMBEDDING_DIMENSIONS);
      
      // Prepare embeddings matrix
      const embeddingMatrix = new Float32Array(this.embeddings.length * EMBEDDING_DIMENSIONS);
      
      for (let i = 0; i < this.embeddings.length; i++) {
        const embedding = this.embeddings[i].embedding;
        
        // Normalize the embedding for cosine similarity
        const normalizedEmbedding = this.normalizeVector(embedding);
        
        // Copy normalized embedding to matrix
        for (let j = 0; j < EMBEDDING_DIMENSIONS; j++) {
          embeddingMatrix[i * EMBEDDING_DIMENSIONS + j] = normalizedEmbedding[j];
        }
      }
      
      // Add vectors to index
      this.index.add(Array.from(embeddingMatrix));
      
      const buildTime = Date.now() - startTime;
      console.log(`✅ FAISS index built successfully in ${buildTime}ms`);
      console.log(`   📊 Index type: ${FAISS_INDEX_TYPE}`);
      console.log(`   📏 Dimensions: ${EMBEDDING_DIMENSIONS}`);
      console.log(`   🔢 Total vectors: ${this.index.ntotal()}`);

    } catch (error) {
      throw new Error(`Failed to build FAISS index: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save FAISS index to file
   * @param indexPath - Path to save the index file
   */
  async saveIndex(indexPath: string): Promise<void> {
    if (!this.index) {
      throw new Error('No index built. Call buildIndex() first.');
    }

    console.log(`💾 Saving FAISS index to ${indexPath}...`);
    
    try {
      // Ensure directory exists
      const indexDir = path.dirname(indexPath);
      await fs.mkdir(indexDir, { recursive: true });
      
      // Save the index
      this.index.write(indexPath);
      
      console.log(`✅ Index saved successfully`);

    } catch (error) {
      throw new Error(`Failed to save FAISS index: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load FAISS index from file
   * @param indexPath - Path to the index file (optional, defaults to project data directory)
   */
  async loadIndex(indexPath?: string): Promise<void> {
    const resolvedIndexPath = indexPath || FAISS_INDEX_PATH;
    console.log(`📖 Loading FAISS index from ${resolvedIndexPath}...`);
    
    try {
      this.index = faiss.IndexFlatIP.read(resolvedIndexPath);
      
      console.log(`✅ Index loaded successfully`);
      console.log(`   📏 Dimensions: ${EMBEDDING_DIMENSIONS}`);
      console.log(`   🔢 Total vectors: ${this.index.ntotal()}`);

      // Note: IndexFlatIP doesn't expose dimension property directly
      // We validate using our known dimensions constant

    } catch (error) {
      throw new Error(`Failed to load FAISS index: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for similar vectors using natural language query
   * @param params - Search parameters
   * @returns Search results with metadata
   */
  async search(params: SearchParams): Promise<{ results: SearchResult[]; stats: SearchStats }> {
    if (!this.index) {
      throw new Error('No index loaded. Call loadIndex() or buildIndex() first.');
    }

    if (this.embeddings.length === 0) {
      throw new Error('No embeddings metadata loaded. Call loadEmbeddings() first.');
    }

    const startTime = Date.now();
    
    try {
      // Generate embedding for the query
      console.log(`🔍 Searching for: "${params.query}"`);
      
      const queryEmbeddingResult = await this.embeddingService.generateSingleEmbedding(
        params.query,
        `query-${Date.now()}`
      );
      
      // Normalize query embedding for cosine similarity
      const normalizedQueryEmbedding = this.normalizeVector(queryEmbeddingResult.embedding);
      
      // Determine search parameters
      const searchLimit = Math.min(params.limit || SEARCH_RESULTS_LIMIT, this.embeddings.length);
      const similarityThreshold = params.minSimilarity || SIMILARITY_THRESHOLD;
      
      // Perform FAISS search
      const searchResults = this.index.search(
        normalizedQueryEmbedding,
        searchLimit
      );
      
      // Process results
      const results: SearchResult[] = [];
      let filteredCount = 0;
      
      for (let i = 0; i < searchResults.labels.length; i++) {
        const vectorIndex = searchResults.labels[i];
        const similarity = searchResults.distances[i]; // Inner product similarity
        
        // Skip invalid indices
        if (vectorIndex < 0 || vectorIndex >= this.embeddings.length) {
          continue;
        }
        
        // Apply similarity threshold
        if (similarity < similarityThreshold) {
          filteredCount++;
          continue;
        }
        
        const embedding = this.embeddings[vectorIndex];
        
        // Apply URL pattern filter if specified
        if (params.urlPattern && !embedding.sourceUrl.includes(params.urlPattern)) {
          filteredCount++;
          continue;
        }
        
        results.push({
          chunkText: embedding.chunkText,
          sourceUrl: embedding.sourceUrl,
          sourceTitle: embedding.sourceTitle,
          similarity: similarity,
          chunkId: embedding.chunkId,
          chunkIndex: embedding.chunkIndex,
          tokenCount: embedding.tokenCount,
          metadata: embedding.metadata,
        });
      }
      
      const searchTime = Date.now() - startTime;
      
      const stats: SearchStats = {
        totalVectors: this.index.ntotal(),
        searchTime,
        resultsReturned: results.length,
        resultsFiltered: filteredCount,
      };
      
      console.log(`✅ Search completed in ${searchTime}ms`);
      console.log(`   🔍 Query tokens: ${queryEmbeddingResult.tokenCount}`);
      console.log(`   📊 Results found: ${results.length}`);
      console.log(`   🚫 Results filtered: ${filteredCount}`);
      
      return { results, stats };

    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get index statistics
   */
  getIndexStats(): { totalVectors: number; dimensions: number; indexType: string } | null {
    if (!this.index) {
      return null;
    }

    return {
      totalVectors: this.index.ntotal(),
      dimensions: EMBEDDING_DIMENSIONS,
      indexType: FAISS_INDEX_TYPE,
    };
  }

  /**
   * Normalize vector for cosine similarity computation
   * @param vector - Input vector
   * @returns Normalized vector
   */
  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude === 0) {
      return vector.slice(); // Return copy of zero vector
    }
    
    return vector.map(val => val / magnitude);
  }

  /**
   * Validate embeddings data integrity
   */
  validateEmbeddings(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.embeddings.length === 0) {
      errors.push('No embeddings loaded');
      return { isValid: false, errors };
    }

    // Check each embedding
    for (let i = 0; i < Math.min(this.embeddings.length, 10); i++) { // Sample first 10
      const embedding = this.embeddings[i];
      
      if (!embedding.chunkId) {
        errors.push(`Embedding ${i}: Missing chunkId`);
      }
      
      if (!embedding.embedding || embedding.embedding.length !== EMBEDDING_DIMENSIONS) {
        errors.push(`Embedding ${i}: Invalid embedding dimensions`);
      }
      
      if (!embedding.chunkText || embedding.chunkText.trim().length === 0) {
        errors.push(`Embedding ${i}: Missing or empty chunkText`);
      }
      
      if (!embedding.sourceUrl) {
        errors.push(`Embedding ${i}: Missing sourceUrl`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // FAISS resources are automatically cleaned up
    this.index = null;
    this.embeddings = [];
  }
}
