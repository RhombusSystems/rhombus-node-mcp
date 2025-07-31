import { writeFileSync } from 'fs';
import { join } from 'path';

const SITEMAP_URLS: string[] = [
    'https://www.rhombus.com/sitemap-0.xml',
    'https://support.rhombussystems.com/hc/sitemap.xml'
];

/**
 * Scrapes a sitemap XML file and extracts all URLs from <loc> tags
 */
async function scrapeSitemap(sitemapUrl: string): Promise<string[]> {
    try {
        console.log(`Scraping sitemap: ${sitemapUrl}`);
        const response = await fetch(sitemapUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${sitemapUrl}: ${response.status} ${response.statusText}`);
        }
        const xmlContent = await response.text();
        // Extract URLs from <loc></loc> tags using regex
        const locTagMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
        if (!locTagMatches) {
            console.warn(`No <loc> tags found in ${sitemapUrl}`);
            return [];
        }
        // Extract the URL content from each <loc> tag
        const extractedUrls = locTagMatches.map(match => {
            const urlMatch = match.match(/<loc>(.*?)<\/loc>/);
            return urlMatch ? urlMatch[1].trim() : '';
        }).filter(url => url.length > 0);
        console.log(`Found ${extractedUrls.length} URLs in ${sitemapUrl}`);
        return extractedUrls;
    }
    catch (error) {
        console.error(`Error scraping sitemap ${sitemapUrl}:`, error);
        return [];
    }
}

/**
 * Main function to scrape all sitemaps and combine URLs
 */
async function scrapeAllSitemaps(): Promise<void> {
    console.log('Starting sitemap scraping...');
    const allUrls: string[] = [];
    for (const sitemapUrl of SITEMAP_URLS) {
        const urls = await scrapeSitemap(sitemapUrl);
        allUrls.push(...urls);
    }
    // Remove duplicates
    const uniqueUrls: string[] = [...new Set(allUrls)];
    console.log(`Total unique URLs found: ${uniqueUrls.length}`);
    // Write to JSON file
    const outputPath = './data/scraped-sitemap-urls.json';
    writeFileSync(outputPath, JSON.stringify(uniqueUrls, null, 2));
    console.log(`URLs saved to: ${outputPath}`);
}

// Run the script if called directly
// Note: import.meta.url is available in ES Module environments.
// If using CommonJS, you might need a different check (e.g., process.argv[1] === __filename)
if (import.meta.url === `file://${process.argv[1]}`) {
    scrapeAllSitemaps().catch(console.error);
}