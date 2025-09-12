import OpenAI from "openai";

// Constants following coding style guidelines
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_BATCH_SIZE = 100;
const MAX_TOKENS_PER_REQUEST = 8000;
const DELAY_BETWEEN_BATCHES_MS = 1000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

export interface EmbeddingRequest {
  text: string;
  chunkId: string;
}

export interface EmbeddingResult {
  chunkId: string;
  embedding: number[];
  tokenCount: number;
  cost: number;
  model: string;
}

export interface EmbeddingBatchResult {
  results: EmbeddingResult[];
  totalTokens: number;
  totalCost: number;
  batchCount: number;
}

export class EmbeddingService {
  private openai: OpenAI;
  private model: string;
  private batchSize: number;

  constructor(apiKey?: string, model: string = EMBEDDING_MODEL) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.model = model;
    this.batchSize = EMBEDDING_BATCH_SIZE;
  }

  /**
   * Generate embeddings for a batch of text chunks
   * @param requests - Array of embedding requests
   * @returns Batch result with embeddings and cost information
   */
  async generateEmbeddings(requests: EmbeddingRequest[]): Promise<EmbeddingBatchResult> {
    if (!requests || requests.length === 0) {
      return {
        results: [],
        totalTokens: 0,
        totalCost: 0,
        batchCount: 0,
      };
    }

    const results: EmbeddingResult[] = [];
    let totalTokens = 0;
    let totalCost = 0;
    const batches = this.createBatches(requests);

    console.log(`Processing ${requests.length} embeddings in ${batches.length} batches`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} items)`);

      try {
        const batchResult = await this.processBatch(batch);
        results.push(...batchResult.results);
        totalTokens += batchResult.totalTokens;
        totalCost += batchResult.totalCost;

        // Add delay between batches to respect rate limits
        if (batchIndex < batches.length - 1) {
          await this.delay(DELAY_BETWEEN_BATCHES_MS);
        }
      } catch (error) {
        console.error(`Error processing batch ${batchIndex + 1}:`, error);
        throw error;
      }
    }

    return {
      results,
      totalTokens,
      totalCost,
      batchCount: batches.length,
    };
  }

  /**
   * Generate embedding for a single text chunk
   * @param text - Text to embed
   * @param chunkId - Unique identifier for the chunk
   * @returns Single embedding result
   */
  async generateSingleEmbedding(text: string, chunkId: string): Promise<EmbeddingResult> {
    const result = await this.generateEmbeddings([{ text, chunkId }]);
    if (result.results.length === 0) {
      throw new Error(`Failed to generate embedding for chunk ${chunkId}`);
    }
    return result.results[0];
  }

  /**
   * Estimate cost for embedding generation
   * @param tokenCount - Total number of tokens to embed
   * @returns Estimated cost in USD
   */
  estimateCost(tokenCount: number): number {
    // text-embedding-3-small costs $0.02 per 1M tokens
    const costPerMilTokens = 0.02;
    return (tokenCount / 1_000_000) * costPerMilTokens;
  }

  private async processBatch(batch: EmbeddingRequest[]): Promise<EmbeddingBatchResult> {
    const texts = batch.map(req => req.text);

    let attempt = 0;
    while (attempt < MAX_RETRY_ATTEMPTS) {
      try {
        const response = await this.openai.embeddings.create({
          model: this.model,
          input: texts,
        });

        const results: EmbeddingResult[] = batch.map((request, index) => {
          const embeddingData = response.data[index];
          const tokenCount = response.usage?.total_tokens
            ? Math.round(response.usage.total_tokens / batch.length)
            : 0;

          return {
            chunkId: request.chunkId,
            embedding: embeddingData.embedding,
            tokenCount,
            cost: this.estimateCost(tokenCount),
            model: this.model,
          };
        });

        return {
          results,
          totalTokens: response.usage?.total_tokens || 0,
          totalCost: this.estimateCost(response.usage?.total_tokens || 0),
          batchCount: 1,
        };
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed for batch:`, error);

        if (attempt >= MAX_RETRY_ATTEMPTS) {
          throw new Error(
            `Failed to process batch after ${MAX_RETRY_ATTEMPTS} attempts: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        // Exponential backoff delay
        const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delayMs}ms...`);
        await this.delay(delayMs);
      }
    }

    throw new Error("Unexpected end of retry attempts");
  }

  private createBatches(requests: EmbeddingRequest[]): EmbeddingRequest[][] {
    const batches: EmbeddingRequest[][] = [];

    for (let i = 0; i < requests.length; i += this.batchSize) {
      const batch = requests.slice(i, i + this.batchSize);

      // Check if batch exceeds token limit (rough estimate)
      const estimatedTokens = batch.reduce((sum, req) => sum + req.text.length / 4, 0);
      if (estimatedTokens > MAX_TOKENS_PER_REQUEST) {
        // Split large batch into smaller ones
        const halfSize = Math.floor(batch.length / 2);
        batches.push(batch.slice(0, halfSize));
        if (halfSize < batch.length) {
          batches.push(batch.slice(halfSize));
        }
      } else {
        batches.push(batch);
      }
    }

    return batches;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
