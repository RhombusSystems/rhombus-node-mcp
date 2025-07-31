import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';
import { TextChunker, ChunkResult } from './utils/text-chunker.js';
import { EmbeddingService, EmbeddingRequest } from '../src/services/embedding-service.js';

// Constants following coding style guidelines
const SCRAPED_DATA_PATH = './data/scraped';
const EMBEDDINGS_OUTPUT_PATH = './data/embeddings';
const EMBEDDINGS_FILE = 'embeddings.json';
const MANIFEST_FILE = 'manifest.json';
const BATCH_SIZE = 50; // Number of chunks to process at once

interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  scrapedAt: string;
  contentLength: number;
  success: boolean;
}

interface EmbeddingData {
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

interface ProcessingManifest {
  startedAt: string;
  totalFiles: number;
  processedFiles: number;
  successfulFiles: number;
  failedFiles: number;
  totalChunks: number;
  totalTokens: number;
  totalCost: number;
  results: {
    sourceFile: string;
    sourceUrl: string;
    success: boolean;
    chunkCount: number;
    tokenCount: number;
    cost: number;
    error?: string;
    processedAt: string;
  }[];
}

class EmbeddingGenerator {
  private textChunker: TextChunker;
  private embeddingService: EmbeddingService;
  private manifest: ProcessingManifest;

  constructor() {
    this.textChunker = new TextChunker({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    this.embeddingService = new EmbeddingService();
    
    this.manifest = {
      startedAt: new Date().toISOString(),
      totalFiles: 0,
      processedFiles: 0,
      successfulFiles: 0,
      failedFiles: 0,
      totalChunks: 0,
      totalTokens: 0,
      totalCost: 0,
      results: [],
    };
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 Starting embedding generation process...\n');

      // Create output directory if it doesn't exist
      await this.ensureOutputDirectory();

      // Check if we should resume from existing progress
      const existingManifest = await this.loadExistingManifest();
      if (existingManifest) {
        console.log('📋 Found existing manifest, resuming from previous progress...');
        this.manifest = existingManifest;
      }

      // Get all scraped files
      const scrapedFiles = await this.getScrapedFiles();
      this.manifest.totalFiles = scrapedFiles.length;

      console.log(`📁 Found ${scrapedFiles.length} scraped files`);
      console.log(`✅ Already processed: ${this.manifest.processedFiles} files`);
      console.log(`⏳ Remaining: ${scrapedFiles.length - this.manifest.processedFiles} files\n`);

      // Filter out already processed files
      const remainingFiles = scrapedFiles.filter(
        file => !this.manifest.results.some(result => result.sourceFile === file)
      );

      if (remainingFiles.length === 0) {
        console.log('🎉 All files have already been processed!');
        return;
      }

      // Process files in batches
      const allEmbeddings: EmbeddingData[] = await this.loadExistingEmbeddings();
      
      for (let i = 0; i < remainingFiles.length; i += BATCH_SIZE) {
        const batch = remainingFiles.slice(i, i + BATCH_SIZE);
        console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(remainingFiles.length / BATCH_SIZE)}`);
        
        const batchEmbeddings = await this.processBatch(batch);
        allEmbeddings.push(...batchEmbeddings);

        // Save progress after each batch
        await this.saveEmbeddings(allEmbeddings);
        await this.saveManifest();
        
        console.log(`💾 Saved progress (${allEmbeddings.length} total embeddings)`);
      }

      console.log('\n🎉 Embedding generation completed successfully!');
      this.printSummary();

    } catch (error) {
      console.error('❌ Error during embedding generation:', error);
      throw error;
    } finally {
      this.textChunker.dispose();
    }
  }

  private async processBatch(files: string[]): Promise<EmbeddingData[]> {
    const batchEmbeddings: EmbeddingData[] = [];
    const embeddingRequests: EmbeddingRequest[] = [];
    const chunkMetadata: Map<string, { chunk: ChunkResult; sourceData: ScrapedContent; sourceFile: string }> = new Map();

    // First pass: Load files and generate chunks
    for (const filename of files) {
      try {
        const filePath = path.join(SCRAPED_DATA_PATH, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const scrapedData: ScrapedContent = JSON.parse(fileContent);

        // Skip files that failed scraping
        if (!scrapedData.success || !scrapedData.content) {
          this.recordFileResult(filename, scrapedData.url, false, 0, 0, 0, 'No content available');
          continue;
        }

        // Generate unique source ID from URL
        const sourceId = this.generateSourceId(scrapedData.url);
        
        // Chunk the content
        const chunks = await this.textChunker.chunkText(scrapedData.content, sourceId);
        
        if (chunks.length === 0) {
          this.recordFileResult(filename, scrapedData.url, false, 0, 0, 0, 'No chunks generated');
          continue;
        }

        // Prepare embedding requests
        for (const chunk of chunks) {
          embeddingRequests.push({
            text: chunk.content,
            chunkId: chunk.chunkId,
          });

          chunkMetadata.set(chunk.chunkId, {
            chunk,
            sourceData: scrapedData,
            sourceFile: filename,
          });
        }

        console.log(`  📄 ${filename}: ${chunks.length} chunks, ~${chunks.reduce((sum, c) => sum + c.tokenCount, 0)} tokens`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`  ❌ Error processing ${filename}: ${errorMessage}`);
        this.recordFileResult(filename, 'unknown', false, 0, 0, 0, errorMessage);
      }
    }

    if (embeddingRequests.length === 0) {
      console.log('  ⚠️ No valid embedding requests in this batch');
      return [];
    }

    // Second pass: Generate embeddings
    console.log(`  🧠 Generating embeddings for ${embeddingRequests.length} chunks...`);
    
    try {
      const embeddingResults = await this.embeddingService.generateEmbeddings(embeddingRequests);
      
      // Third pass: Combine embeddings with metadata
      for (const embeddingResult of embeddingResults.results) {
        const metadata = chunkMetadata.get(embeddingResult.chunkId);
        if (!metadata) {
          console.warn(`  ⚠️ No metadata found for chunk ${embeddingResult.chunkId}`);
          continue;
        }

        const embeddingData: EmbeddingData = {
          chunkId: embeddingResult.chunkId,
          embedding: embeddingResult.embedding,
          chunkText: metadata.chunk.content,
          sourceUrl: metadata.sourceData.url,
          sourceTitle: metadata.sourceData.title,
          chunkIndex: metadata.chunk.chunkIndex,
          tokenCount: embeddingResult.tokenCount,
          model: embeddingResult.model,
          cost: embeddingResult.cost,
          createdAt: new Date().toISOString(),
          metadata: {
            totalChunksFromSource: 0, // Will be updated after processing all chunks from this source
            chunkingStrategy: 'recursive',
            sourceFile: metadata.sourceFile,
          },
        };

        batchEmbeddings.push(embeddingData);
      }

      // Update file results with success info
      const fileGroups = new Map<string, EmbeddingData[]>();
      for (const embedding of batchEmbeddings) {
        const filename = embedding.metadata.sourceFile;
        if (!fileGroups.has(filename)) {
          fileGroups.set(filename, []);
        }
        fileGroups.get(filename)!.push(embedding);
      }

      for (const [filename, embeddings] of fileGroups) {
        const totalTokens = embeddings.reduce((sum, e) => sum + e.tokenCount, 0);
        const totalCost = embeddings.reduce((sum, e) => sum + e.cost, 0);
        const sourceUrl = embeddings[0].sourceUrl;

        // Update totalChunksFromSource for all embeddings from this file
        for (const embedding of embeddings) {
          embedding.metadata.totalChunksFromSource = embeddings.length;
        }

        this.recordFileResult(filename, sourceUrl, true, embeddings.length, totalTokens, totalCost);
      }

      console.log(`  ✅ Generated ${batchEmbeddings.length} embeddings (cost: $${embeddingResults.totalCost.toFixed(6)})`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`  ❌ Error generating embeddings: ${errorMessage}`);
      
      // Mark all files in this batch as failed
      for (const filename of files) {
        const existingResult = this.manifest.results.find(r => r.sourceFile === filename);
        if (!existingResult) {
          this.recordFileResult(filename, 'unknown', false, 0, 0, 0, errorMessage);
        }
      }
    }

    return batchEmbeddings;
  }

  private recordFileResult(
    sourceFile: string,
    sourceUrl: string,
    success: boolean,
    chunkCount: number,
    tokenCount: number,
    cost: number,
    error?: string
  ): void {
    // Remove existing result if present (for retry scenarios)
    this.manifest.results = this.manifest.results.filter(r => r.sourceFile !== sourceFile);

    this.manifest.results.push({
      sourceFile,
      sourceUrl,
      success,
      chunkCount,
      tokenCount,
      cost,
      error,
      processedAt: new Date().toISOString(),
    });

    this.manifest.processedFiles++;
    if (success) {
      this.manifest.successfulFiles++;
      this.manifest.totalChunks += chunkCount;
      this.manifest.totalTokens += tokenCount;
      this.manifest.totalCost += cost;
    } else {
      this.manifest.failedFiles++;
    }
  }

  private async getScrapedFiles(): Promise<string[]> {
    const files = await fs.readdir(SCRAPED_DATA_PATH);
    return files.filter(file => file.endsWith('.json') && file !== 'manifest.json');
  }

  private generateSourceId(url: string): string {
    const hash = createHash('md5').update(url).digest('hex');
    return `url-${hash.substring(0, 8)}`;
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(EMBEDDINGS_OUTPUT_PATH);
    } catch {
      await fs.mkdir(EMBEDDINGS_OUTPUT_PATH, { recursive: true });
      console.log(`📁 Created output directory: ${EMBEDDINGS_OUTPUT_PATH}`);
    }
  }

  private async loadExistingManifest(): Promise<ProcessingManifest | null> {
    try {
      const manifestPath = path.join(EMBEDDINGS_OUTPUT_PATH, MANIFEST_FILE);
      const content = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private async loadExistingEmbeddings(): Promise<EmbeddingData[]> {
    try {
      const embeddingsPath = path.join(EMBEDDINGS_OUTPUT_PATH, EMBEDDINGS_FILE);
      const content = await fs.readFile(embeddingsPath, 'utf-8');
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private async saveEmbeddings(embeddings: EmbeddingData[]): Promise<void> {
    const embeddingsPath = path.join(EMBEDDINGS_OUTPUT_PATH, EMBEDDINGS_FILE);
    await fs.writeFile(embeddingsPath, JSON.stringify(embeddings, null, 2));
  }

  private async saveManifest(): Promise<void> {
    const manifestPath = path.join(EMBEDDINGS_OUTPUT_PATH, MANIFEST_FILE);
    await fs.writeFile(manifestPath, JSON.stringify(this.manifest, null, 2));
  }

  private printSummary(): void {
    console.log('\n📊 Final Summary:');
    console.log(`   📁 Total files: ${this.manifest.totalFiles}`);
    console.log(`   ✅ Successful: ${this.manifest.successfulFiles}`);
    console.log(`   ❌ Failed: ${this.manifest.failedFiles}`);
    console.log(`   🧩 Total chunks: ${this.manifest.totalChunks}`);
    console.log(`   🔤 Total tokens: ${this.manifest.totalTokens.toLocaleString()}`);
    console.log(`   💰 Total cost: $${this.manifest.totalCost.toFixed(6)}`);
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
📚 Rhombus Embedding Generation Script

Usage:
  npm run generate-embeddings          # Process all scraped content
  npm run embedding-progress           # Show current progress
  npm run estimate-cost               # Estimate cost without processing

Options:
  --help                              # Show this help message
  --progress                          # Show progress only
  --estimate-only                     # Estimate cost without processing
`);
    return;
  }

  if (args.includes('--progress')) {
    await showProgress();
    return;
  }

  if (args.includes('--estimate-only')) {
    await estimateCost();
    return;
  }

  // Run the main embedding generation
  const generator = new EmbeddingGenerator();
  await generator.run();
}

async function showProgress(): Promise<void> {
  try {
    const manifestPath = path.join(EMBEDDINGS_OUTPUT_PATH, MANIFEST_FILE);
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest: ProcessingManifest = JSON.parse(content);

    console.log('\n📊 Current Progress:');
    console.log(`   📁 Total files: ${manifest.totalFiles}`);
    console.log(`   ✅ Processed: ${manifest.processedFiles} (${(manifest.processedFiles / manifest.totalFiles * 100).toFixed(1)}%)`);
    console.log(`   ✅ Successful: ${manifest.successfulFiles}`);
    console.log(`   ❌ Failed: ${manifest.failedFiles}`);
    console.log(`   🧩 Total chunks: ${manifest.totalChunks}`);
    console.log(`   🔤 Total tokens: ${manifest.totalTokens.toLocaleString()}`);
    console.log(`   💰 Total cost: $${manifest.totalCost.toFixed(6)}`);
    console.log(`   🕒 Started: ${new Date(manifest.startedAt).toLocaleString()}`);

    if (manifest.failedFiles > 0) {
      console.log('\n❌ Failed files:');
      manifest.results
        .filter(r => !r.success)
        .slice(0, 5) // Show first 5 failures
        .forEach(result => {
          console.log(`   • ${result.sourceFile}: ${result.error}`);
        });
      
      if (manifest.failedFiles > 5) {
        console.log(`   • ... and ${manifest.failedFiles - 5} more`);
      }
    }

  } catch (error) {
    console.log('📋 No progress found - run embedding generation first');
  }
}

async function estimateCost(): Promise<void> {
  console.log('💰 Estimating embedding generation cost...\n');

  try {
    const files = await fs.readdir(SCRAPED_DATA_PATH);
    const scrapedFiles = files.filter(file => file.endsWith('.json') && file !== 'manifest.json');
    
    let totalTokens = 0;
    let totalFiles = 0;
    let validFiles = 0;

    const chunker = new TextChunker({ chunkSize: 1000, chunkOverlap: 200 });
    const embeddingService = new EmbeddingService();

    console.log(`📁 Analyzing ${scrapedFiles.length} files...`);

    for (const filename of scrapedFiles.slice(0, 50)) { // Sample first 50 files for estimation
      try {
        const filePath = path.join(SCRAPED_DATA_PATH, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const scrapedData: ScrapedContent = JSON.parse(fileContent);

        totalFiles++;

        if (scrapedData.success && scrapedData.content) {
          const sourceId = createHash('md5').update(scrapedData.url).digest('hex').substring(0, 8);
          const chunks = await chunker.chunkText(scrapedData.content, `url-${sourceId}`);
          const fileTokens = chunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0);
          
          totalTokens += fileTokens;
          validFiles++;
        }

      } catch (error) {
        // Skip problematic files in estimation
      }
    }

    chunker.dispose();

    // Extrapolate to all files
    const avgTokensPerFile = validFiles > 0 ? totalTokens / validFiles : 0;
    const estimatedTotalTokens = Math.round(avgTokensPerFile * scrapedFiles.length);
    const estimatedCost = embeddingService.estimateCost(estimatedTotalTokens);

    console.log('\n📊 Cost Estimation:');
    console.log(`   📁 Total files: ${scrapedFiles.length}`);
    console.log(`   📄 Sampled files: ${totalFiles} (${validFiles} valid)`);
    console.log(`   🔤 Average tokens per file: ${Math.round(avgTokensPerFile).toLocaleString()}`);
    console.log(`   🔤 Estimated total tokens: ${estimatedTotalTokens.toLocaleString()}`);
    console.log(`   💰 Estimated cost: $${estimatedCost.toFixed(6)}`);
    console.log(`   💡 Model: text-embedding-3-small ($0.02 per 1M tokens)`);

  } catch (error) {
    console.error('❌ Error estimating cost:', error);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
