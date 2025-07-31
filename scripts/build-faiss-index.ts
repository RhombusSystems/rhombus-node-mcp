import * as fs from 'fs/promises';
import * as path from 'path';
import { FaissSearchService } from '../src/services/faiss-search-service.js';

const EMBEDDINGS_DATA_PATH = './data/embeddings/embeddings.json';
const FAISS_INDEX_PATH = './data/embeddings/faiss.index';

interface IndexManifest {
  createdAt: string;
  totalVectors: number;
  embeddingDimensions: number;
  indexType: string;
  sourceFile: string;
  buildTime: number;
  validationResults: {
    isValid: boolean;
    errors: string[];
  };
  performance: {
    indexBuildTime: number;
    indexSaveTime: number;
    averageSearchTime?: number;
  };
}

class FaissIndexBuilder {
  private faissService: FaissSearchService;

  constructor() {
    this.faissService = new FaissSearchService();
  }

  async run(): Promise<void> {
    try {
      console.log('🏗️ Starting FAISS index building process...\n');

      // Check if embeddings file exists
      await this.validateEmbeddingsFile();

      // Load embeddings
      console.log('📚 Loading embeddings...');
      await this.faissService.loadEmbeddings(EMBEDDINGS_DATA_PATH);

      // Validate embeddings integrity
      console.log('🔍 Validating embeddings...');
      const validationResults = this.faissService.validateEmbeddings();
      if (!validationResults.isValid) {
        console.error('❌ Embedding validation failed:');
        validationResults.errors.forEach(error => console.error(`   • ${error}`));
        throw new Error('Invalid embeddings data');
      }
      console.log('✅ Embeddings validation passed');

      // Build FAISS index
      console.log('\n🏗️ Building FAISS index...');
      const buildStartTime = Date.now();
      await this.faissService.buildIndex();
      const buildTime = Date.now() - buildStartTime;

      // Save index to file
      console.log('💾 Saving FAISS index...');
      const saveStartTime = Date.now();
      await this.faissService.saveIndex(FAISS_INDEX_PATH);
      const saveTime = Date.now() - saveStartTime;

      // Get index statistics
      const indexStats = this.faissService.getIndexStats();
      if (!indexStats) {
        throw new Error('Failed to get index statistics');
      }

      // Create and save manifest
      const manifest: IndexManifest = {
        createdAt: new Date().toISOString(),
        totalVectors: indexStats.totalVectors,
        embeddingDimensions: indexStats.dimensions,
        indexType: indexStats.indexType,
        sourceFile: EMBEDDINGS_DATA_PATH,
        buildTime: buildTime + saveTime,
        validationResults,
        performance: {
          indexBuildTime: buildTime,
          indexSaveTime: saveTime,
        },
      };

      await this.saveManifest(manifest);

      // Run performance benchmarks
      console.log('\n⚡ Running performance benchmarks...');
      const avgSearchTime = await this.runPerformanceBenchmarks();
      manifest.performance.averageSearchTime = avgSearchTime;
      await this.saveManifest(manifest); // Update with benchmark results

      console.log('\n🎉 FAISS index building completed successfully!');
      this.printSummary(manifest);

    } catch (error) {
      console.error('❌ FAISS index building failed:', error);
      throw error;
    } finally {
      this.faissService.dispose();
    }
  }

  private async validateEmbeddingsFile(): Promise<void> {
    try {
      await fs.access(EMBEDDINGS_DATA_PATH);
      const stats = await fs.stat(EMBEDDINGS_DATA_PATH);
      console.log(`📁 Found embeddings file (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
    } catch (error) {
      throw new Error(`Embeddings file not found at ${EMBEDDINGS_DATA_PATH}. Run 'npm run generate-embeddings' first.`);
    }
  }

  private async saveManifest(manifest: IndexManifest): Promise<void> {
    const manifestPath = path.join(path.dirname(FAISS_INDEX_PATH), 'index-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  private async runPerformanceBenchmarks(): Promise<number> {
    const testQueries = [
      'What are the benefits of dome cameras?',
      'How does air quality monitoring work?',
      'Compare R1 vs R2 cameras',
      'Installation requirements for security cameras',
      'Cloud storage benefits for video surveillance',
    ];

    let totalSearchTime = 0;
    let successfulSearches = 0;

    console.log(`   🔍 Running ${testQueries.length} test searches...`);

    for (let i = 0; i < testQueries.length; i++) {
      const query = testQueries[i];
      
      try {
        const { stats } = await this.faissService.search({
          query,
          limit: 10,
          minSimilarity: 0.1, // Lower threshold for benchmarking
        });

        totalSearchTime += stats.searchTime;
        successfulSearches++;
        
        console.log(`      ${i + 1}. "${query}" - ${stats.searchTime}ms (${stats.resultsReturned} results)`);

      } catch (error) {
        console.warn(`      ${i + 1}. "${query}" - FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const avgSearchTime = successfulSearches > 0 ? totalSearchTime / successfulSearches : 0;
    console.log(`   ⚡ Average search time: ${avgSearchTime.toFixed(1)}ms`);

    return avgSearchTime;
  }

  private printSummary(manifest: IndexManifest): void {
    console.log('\n📊 Index Build Summary:');
    console.log(`   📁 Source file: ${manifest.sourceFile}`);
    console.log(`   🔢 Total vectors: ${manifest.totalVectors.toLocaleString()}`);
    console.log(`   📏 Dimensions: ${manifest.embeddingDimensions}`);
    console.log(`   🏗️ Index type: ${manifest.indexType}`);
    console.log(`   ⏱️ Build time: ${manifest.performance.indexBuildTime}ms`);
    console.log(`   💾 Save time: ${manifest.performance.indexSaveTime}ms`);
    console.log(`   ⚡ Average search: ${manifest.performance.averageSearchTime?.toFixed(1) || 'N/A'}ms`);
    console.log(`   📍 Index saved to: ${FAISS_INDEX_PATH}`);
    
    // File size information
    this.printFileSizes();
  }

  private async printFileSizes(): Promise<void> {
    try {
      const indexStats = await fs.stat(FAISS_INDEX_PATH);
      const embeddingsStats = await fs.stat(EMBEDDINGS_DATA_PATH);
      
      console.log('\n💾 File Sizes:');
      console.log(`   📊 Embeddings: ${(embeddingsStats.size / 1024 / 1024).toFixed(1)} MB`);
      console.log(`   🔍 FAISS Index: ${(indexStats.size / 1024 / 1024).toFixed(1)} MB`);
      console.log(`   📈 Compression: ${(indexStats.size / embeddingsStats.size * 100).toFixed(1)}% of original`);
    } catch (error) {
      console.warn('⚠️ Could not determine file sizes');
    }
  }
}

// Test search functionality
async function testSearch(): Promise<void> {
  console.log('🧪 Testing FAISS search functionality...\n');

  const faissService = new FaissSearchService();

  try {
    // Load embeddings and index
    await faissService.loadEmbeddings(EMBEDDINGS_DATA_PATH);
    await faissService.loadIndex(FAISS_INDEX_PATH);

    // Test searches
    const testQueries = [
      'What are dome cameras used for?',
      'How to install security cameras?',
      'Benefits of cloud video surveillance',
    ];

    for (const query of testQueries) {
      console.log(`🔍 Searching: "${query}"`);
      
      const { results, stats } = await faissService.search({
        query,
        limit: 3,
        minSimilarity: 0.3,
      });

      console.log(`   ⚡ Search time: ${stats.searchTime}ms`);
      console.log(`   📊 Results: ${results.length}`);
      
      results.forEach((result, i) => {
        console.log(`   ${i + 1}. [${result.similarity.toFixed(3)}] ${result.sourceTitle}`);
        console.log(`      🔗 ${result.sourceUrl}`);
        console.log(`      📝 "${result.chunkText.substring(0, 100)}..."`);
      });
      
      console.log();
    }

    console.log('✅ Search test completed successfully!');

  } catch (error) {
    console.error('❌ Search test failed:', error);
    throw error;
  } finally {
    faissService.dispose();
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
🔍 FAISS Index Builder

Usage:
  npm run build-faiss-index          # Build FAISS index from embeddings
  npm run test-faiss-search          # Test search functionality

Options:
  --help                              # Show this help message
  --test                              # Test search functionality only
`);
    return;
  }

  if (args.includes('--test')) {
    await testSearch();
    return;
  }

  // Run the main index building process
  const builder = new FaissIndexBuilder();
  await builder.run();
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
