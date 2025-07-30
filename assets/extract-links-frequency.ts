#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// extractLinksFrequency: Extract all links from file and count their frequency
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_FILE_PATH = path.join(__dirname, 'llms.txt');

interface LinkFrequencyMap {
  [url: string]: number;
}

function extractLinksFromFile(filePath: string): LinkFrequencyMap {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const linkFrequencyMap: LinkFrequencyMap = {};
    
    // Regular expression to match URLs (both standalone and in markdown links)
    const urlRegex = /https?:\/\/[^\s\])\}]+/g;
    
    const urlMatches = fileContent.match(urlRegex);
    
    if (urlMatches) {
      urlMatches.forEach(url => {
        // Clean up the URL by removing trailing punctuation that might not be part of the URL
        let cleanedUrl = url.replace(/[,;.)]+$/, '');
        
        // Remove hashtag and everything after it (fragment identifier)
        cleanedUrl = cleanedUrl.split('#')[0];
        
        // Only include URLs that contain the specified domains and exclude article_attachments
        if ((cleanedUrl.startsWith('https://support.rhombussystems.com') || cleanedUrl.includes('www.rhombus.com')) && 
            !cleanedUrl.includes('article_attachments')) {
          if (linkFrequencyMap[cleanedUrl]) {
            linkFrequencyMap[cleanedUrl]++;
          } else {
            linkFrequencyMap[cleanedUrl] = 1;
          }
        }
      });
    }
    
    return linkFrequencyMap;
  } catch (error) {
    console.error('Error reading file:', error);
    return {};
  }
}

function saveLinksFrequencyAsJson(linkFrequencyMap: LinkFrequencyMap): void {
  // Sort by frequency (descending) then by URL (ascending)
  const sortedEntries = Object.entries(linkFrequencyMap)
    .sort(([urlA, freqA], [urlB, freqB]) => {
      if (freqA !== freqB) {
        return freqB - freqA; // Sort by frequency descending
      }
      return urlA.localeCompare(urlB); // Sort by URL ascending for same frequency
    });
  
  const totalUniqueLinks = sortedEntries.length;
  const totalOccurrences = Object.values(linkFrequencyMap).reduce((sum, count) => sum + count, 0);
  
  const jsonOutput = {
    summary: {
      totalUniqueLinks,
      totalOccurrences,
      analysisDate: new Date().toISOString()
    },
    linksByFrequency: sortedEntries.map(([url, frequency]) => ({
      url,
      frequency
    })),
    linkFrequencyMap: linkFrequencyMap
  };
  
  // Generate output filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFilePath = path.join(__dirname, `rhombus-links-frequency-${timestamp}.json`);
  
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
    console.log(`✅ Analysis complete!`);
    console.log(`📊 Found ${totalUniqueLinks} unique links with ${totalOccurrences} total occurrences`);
    console.log(`💾 Results saved to: ${outputFilePath}`);
  } catch (error) {
    console.error('❌ Error writing JSON file:', error);
  }
}

function main(): void {
  console.log(`Analyzing Rhombus links in: ${INPUT_FILE_PATH}`);
  console.log(`Filtering for: support.rhombussystems.com and www.rhombus.com\n`);
  
  if (!fs.existsSync(INPUT_FILE_PATH)) {
    console.error(`File not found: ${INPUT_FILE_PATH}`);
    process.exit(1);
  }
  
  const linkFrequencyMap = extractLinksFromFile(INPUT_FILE_PATH);
  
  if (Object.keys(linkFrequencyMap).length === 0) {
    console.log('No Rhombus links found in the file.');
    return;
  }
  
  saveLinksFrequencyAsJson(linkFrequencyMap);
}

// Run the script
main();
