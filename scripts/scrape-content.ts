#!/usr/bin/env npx tsx

import { promises as fs } from 'fs';
import path from 'path';
import { WebScraper, ScrapedContent } from './utils/web-scraper.js';

interface ScrapingManifest {
  startedAt: Date;
  completedAt?: Date;
  totalUrls: number;
  processedUrls: number;
  successfulUrls: number;
  failedUrls: number;
  results: {
    url: string;
    filename?: string;
    success: boolean;
    error?: string;
    contentLength: number;
    processedAt: Date;
  }[];
}

const BATCH_SIZE = 5; // Process 5 URLs concurrently
const DELAY_BETWEEN_BATCHES_MS = 2000; // 2 seconds delay between batches
const TIMEOUT_MS = 15000; // 15 seconds timeout
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
const PROGRESS_SAVE_INTERVAL = 10; // Save manifest every N URLs
const OUTPUT_DIR = './data/scraped';
const MANIFEST_FILE = './data/scraped/manifest.json';
const URLS_FILE = './data/scraped-sitemap-urls.json';

class ContentScraper {
  private scraper: WebScraper;
  private manifest: ScrapingManifest;

  constructor() {
    this.scraper = new WebScraper({
      timeout: TIMEOUT_MS,
      retryAttempts: RETRY_ATTEMPTS,
      retryDelay: RETRY_DELAY_MS,
    });

    this.manifest = {
      startedAt: new Date(),
      totalUrls: 0,
      processedUrls: 0,
      successfulUrls: 0,
      failedUrls: 0,
      results: [],
    };
  }

  /**
   * Load URLs from the sitemap file
   */
  async loadUrls(): Promise<string[]> {
    try {
      const urlsContent = await fs.readFile(URLS_FILE, 'utf-8');
      const urls: string[] = JSON.parse(urlsContent);
      console.log(`Loaded ${urls.length} URLs from ${URLS_FILE}`);
      return urls;
    } catch (error) {
      console.error(`Failed to load URLs from ${URLS_FILE}:`, error);
      throw error;
    }
  }

  /**
   * Load existing manifest if it exists (for resume capability)
   */
  async loadExistingManifest(): Promise<void> {
    try {
      const manifestContent = await fs.readFile(MANIFEST_FILE, 'utf-8');
      const existingManifest: ScrapingManifest = JSON.parse(manifestContent);
      
      // Resume from existing manifest
      this.manifest = {
        ...existingManifest,
        startedAt: existingManifest.startedAt ? new Date(existingManifest.startedAt) : new Date(),
      };
      
      console.log(`Resuming from existing manifest: ${this.manifest.processedUrls}/${this.manifest.totalUrls} URLs processed`);
    } catch (error) {
      // No existing manifest, start fresh
      console.log('No existing manifest found, starting fresh');
    }
  }

  /**
   * Save manifest to file
   */
  async saveManifest(): Promise<void> {
    await fs.writeFile(MANIFEST_FILE, JSON.stringify(this.manifest, null, 2), 'utf-8');
  }

  /**
   * Check if URL has already been processed successfully
   */
  isUrlProcessed(url: string): boolean {
    return this.manifest.results.some(result => result.url === url && result.success);
  }

  /**
   * Process a single URL
   */
  async processUrl(url: string): Promise<void> {
    if (this.isUrlProcessed(url)) {
      console.log(`Skipping already processed URL: ${url}`);
      return;
    }

    const startTime = Date.now();
    
    try {
      const scrapedContent = await this.scraper.scrapeUrl(url);
      let filename: string | undefined;

      if (scrapedContent.success) {
        filename = await this.scraper.saveToFile(scrapedContent, OUTPUT_DIR);
        this.manifest.successfulUrls++;
        console.log(`✅ Successfully scraped: ${url} (${scrapedContent.contentLength} chars) -> ${filename}`);
      } else {
        this.manifest.failedUrls++;
        console.log(`❌ Failed to scrape: ${url} - ${scrapedContent.error}`);
      }

      // Update manifest
      const existingResultIndex = this.manifest.results.findIndex(r => r.url === url);
      const result = {
        url,
        filename: filename ? path.basename(filename) : undefined,
        success: scrapedContent.success,
        error: scrapedContent.error,
        contentLength: scrapedContent.contentLength,
        processedAt: new Date(),
      };

      if (existingResultIndex >= 0) {
        this.manifest.results[existingResultIndex] = result;
      } else {
        this.manifest.results.push(result);
      }

      this.manifest.processedUrls++;
      
      // Save manifest every N URLs
      if (this.manifest.processedUrls % PROGRESS_SAVE_INTERVAL === 0) {
        await this.saveManifest();
        console.log(`Progress: ${this.manifest.processedUrls}/${this.manifest.totalUrls} URLs processed`);
      }

    } catch (error) {
      this.manifest.failedUrls++;
      console.error(`Unexpected error processing ${url}:`, error);
      
      // Add error result to manifest
      this.manifest.results.push({
        url,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        contentLength: 0,
        processedAt: new Date(),
      });
    }
  }

  /**
   * Process all URLs with concurrency control
   */
  async processAllUrls(): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Load existing manifest (for resume capability)
    await this.loadExistingManifest();

    // Load URLs
    const urls = await this.loadUrls();
    this.manifest.totalUrls = urls.length;

    console.log(`Starting to process ${urls.length} URLs with concurrency limit of ${BATCH_SIZE}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);

    // Filter out already processed URLs
    const urlsToProcess = urls.filter(url => !this.isUrlProcessed(url));
    console.log(`${urlsToProcess.length} URLs remaining to process`);

    if (urlsToProcess.length === 0) {
      console.log('All URLs have already been processed!');
      return;
    }

    // Process URLs in batches with delays between batches
    const urlBatches: string[][] = [];
    for (let i = 0; i < urlsToProcess.length; i += BATCH_SIZE) {
      urlBatches.push(urlsToProcess.slice(i, i + BATCH_SIZE));
    }

    console.log(`Processing ${urlBatches.length} batches of up to ${BATCH_SIZE} URLs each`);

    for (let batchIndex = 0; batchIndex < urlBatches.length; batchIndex++) {
      const batch = urlBatches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${urlBatches.length} (${batch.length} URLs)`);

      // Process all URLs in this batch concurrently
      const batchPromises = batch.map(url => this.processUrl(url));
      
      try {
        await Promise.all(batchPromises);
      } catch (error) {
        console.error(`Error in batch ${batchIndex + 1}:`, error);
      }

      // Add delay between batches (except after the last batch)
      if (batchIndex < urlBatches.length - 1) {
        console.log(`Waiting ${DELAY_BETWEEN_BATCHES_MS}ms before next batch...`);
        await this.delay(DELAY_BETWEEN_BATCHES_MS);
      }
    }

    // Final manifest save
    this.manifest.completedAt = new Date();
    await this.saveManifest();

    // Print summary
    this.printSummary();
  }

  /**
   * Print processing summary
   */
  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total URLs: ${this.manifest.totalUrls}`);
    console.log(`Processed URLs: ${this.manifest.processedUrls}`);
    console.log(`Successful URLs: ${this.manifest.successfulUrls}`);
    console.log(`Failed URLs: ${this.manifest.failedUrls}`);
    console.log(`Success Rate: ${((this.manifest.successfulUrls / this.manifest.processedUrls) * 100).toFixed(1)}%`);
    
    if (this.manifest.startedAt && this.manifest.completedAt) {
      const duration = this.manifest.completedAt.getTime() - this.manifest.startedAt.getTime();
      console.log(`Duration: ${(duration / 1000 / 60).toFixed(1)} minutes`);
    }

    console.log(`Manifest saved to: ${MANIFEST_FILE}`);
    console.log(`Content saved to: ${OUTPUT_DIR}`);
    
    if (this.manifest.failedUrls > 0) {
      console.log('\nFailed URLs:');
      this.manifest.results
        .filter(r => !r.success)
        .slice(0, 10) // Show first 10 failures
        .forEach(r => console.log(`  - ${r.url}: ${r.error}`));
      
      if (this.manifest.failedUrls > 10) {
        console.log(`  ... and ${this.manifest.failedUrls - 10} more`);
      }
    }
    console.log('='.repeat(60));
  }

  /**
   * Show current progress without processing
   */
  async showProgress(): Promise<void> {
    await this.loadExistingManifest();
    const urls = await this.loadUrls();
    this.manifest.totalUrls = urls.length;
    this.printSummary();
  }

  /**
   * Utility method for delays between batches
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  const scraper = new ContentScraper();

  try {
    if (command === '--progress') {
      await scraper.showProgress();
    } else {
      await scraper.processAllUrls();
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
