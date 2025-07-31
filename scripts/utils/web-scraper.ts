import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  scrapedAt: Date;
  contentLength: number;
  success: boolean;
  error?: string;
}

export interface WebScraperOptions {
  userAgent?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

const DEFAULT_OPTIONS: Required<WebScraperOptions> = {
  userAgent: 'Mozilla/5.0 (compatible; RhombusContentScraper/1.0)',
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

export class WebScraper {
  private options: Required<WebScraperOptions>;

  constructor(options: WebScraperOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scrape content from a single URL
   */
  async scrapeUrl(url: string): Promise<ScrapedContent> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        console.log(`Scraping ${url} (attempt ${attempt}/${this.options.retryAttempts})`);
        
        const response = await axios.get(url, {
          timeout: this.options.timeout,
          headers: {
            'User-Agent': this.options.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
          },
        });

        const cleanedContent = this.extractCleanText(response.data, url);
        const title = this.extractTitle(response.data);

        return {
          url,
          title,
          content: cleanedContent,
          scrapedAt: new Date(),
          contentLength: cleanedContent.length,
          success: true,
        };

      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed for ${url}:`, error instanceof AxiosError ? error.message : error);
        
        if (attempt < this.options.retryAttempts) {
          await this.delay(this.options.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    // All attempts failed
    return {
      url,
      title: '',
      content: '',
      scrapedAt: new Date(),
      contentLength: 0,
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }

  /**
   * Extract clean text content from HTML, removing navigation, ads, and other noise
   */
  private extractCleanText(html: string, url: string): string {
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, noscript').remove();

    // Remove common navigation and UI elements
    $('nav, header, footer, aside').remove();
    $('.navigation, .nav, .navbar, .sidebar, .footer, .header').remove();
    $('.advertisement, .ad, .ads, .social-share, .social-sharing').remove();
    $('.cookie-banner, .cookie-notice, .gdpr-banner').remove();
    $('.popup, .modal, .overlay').remove();

    // For Rhombus blog posts, focus on main content
    let mainContent = '';
    
    // Try to find main content areas (common patterns)
    const contentSelectors = [
      'main',
      '.main-content',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.blog-post',
      'article',
      '.single-post',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        mainContent = element.text();
        break;
      }
    }

    // If no main content found, extract from body but be more selective
    if (!mainContent) {
      $('h1, h2, h3, h4, h5, h6, p, li, blockquote, .text').each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 20) { // Only include substantial text blocks
          mainContent += text + '\n\n';
        }
      });
    }

    // Clean up the text
    const cleanedText = mainContent
      .replace(/\s+/g, ' ') // Replace multiple whitespaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .trim();

    return cleanedText;
  }

  /**
   * Extract the page title
   */
  private extractTitle(html: string): string {
    const $ = cheerio.load(html);
    
    // Try different title sources in order of preference
    const titleSelectors = [
      'h1.post-title',
      'h1.entry-title',
      '.post-title',
      'h1',
      'title',
    ];

    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title && title.length > 0) {
        return title;
      }
    }

    return 'Untitled';
  }

  /**
   * Generate a safe filename from a URL
   */
  static generateFilename(url: string): string {
    // Remove protocol and convert to safe filename
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
    const safeFilename = urlWithoutProtocol
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe characters with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 200); // Limit length

    return `${safeFilename}.json`;
  }

  /**
   * Save scraped content to a file
   */
  async saveToFile(content: ScrapedContent, outputDir: string): Promise<string> {
    const filename = WebScraper.generateFilename(content.url);
    const filePath = path.join(outputDir, filename);

    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    return filePath;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
