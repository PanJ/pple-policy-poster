// Script to scrape People's Party policy URLs (end-level pages)
const fs = require('fs');

async function scrapePolicyUrls() {
  const baseUrl = 'https://election69.peoplesparty.or.th';
  const categories = ['A', 'B', 'C', 'D'];
  const categoryUrls = new Set();
  const policyUrls = new Set();
  
  console.log('Stage 1: Fetching category pages...\n');
  
  // First, get all category pages (e.g., A-1, A-2, B-1, etc.)
  for (const category of categories) {
    const listingUrl = `${baseUrl}/policy/1/${category}`;
    console.log(`Fetching: ${listingUrl}`);
    
    try {
      const response = await fetch(listingUrl);
      if (!response.ok) {
        console.error(`Failed to fetch ${listingUrl}: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      
      // Extract category links like /policy/2/A-1, /policy/2/B-3
      const urlPattern = /href=["'](\/policy\/2\/[A-Z]-\d+)["']/g;
      let match;
      
      while ((match = urlPattern.exec(html)) !== null) {
        const policyPath = match[1];
        const fullUrl = `${baseUrl}${policyPath}`;
        categoryUrls.add(fullUrl);
      }
      
      console.log(`  Found ${categoryUrls.size} category URLs so far`);
      
    } catch (error) {
      console.error(`Error fetching ${listingUrl}:`, error.message);
    }
  }
  
  console.log(`\nStage 2: Fetching end-level policy pages from ${categoryUrls.size} categories...\n`);
  
  const level3Urls = new Set();
  
  // Now fetch each category page to get level-3 policy URLs
  for (const categoryUrl of categoryUrls) {
    console.log(`Fetching: ${categoryUrl}`);
    
    try {
      const response = await fetch(categoryUrl);
      if (!response.ok) {
        console.error(`Failed to fetch ${categoryUrl}: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      
      // Extract policy links
      const urlPattern = /href=["'](\/policy\/\d+\/[A-Z]-[\d-]+)["']/g;
      let match;
      
      while ((match = urlPattern.exec(html)) !== null) {
        const policyPath = match[1];
        // Only add if it has more segments (not category pages like A-1)
        if (policyPath.split('-').length > 2) {
          const fullUrl = `${baseUrl}${policyPath}`;
          level3Urls.add(fullUrl);
        }
      }
      
      console.log(`  Level-3 URLs: ${level3Urls.size}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error fetching ${categoryUrl}:`, error.message);
    }
  }
  
  console.log(`\nStage 3: Checking ${level3Urls.size} level-3 pages for level-4 sub-policies...\n`);
  
  // Check each level-3 URL for potential level-4 sub-pages
  for (const level3Url of level3Urls) {
    try {
      const response = await fetch(level3Url);
      if (!response.ok) {
        continue;
      }
      
      const html = await response.text();
      
      // Check if this page has sub-policies (level 4)
      const urlPattern = /href=["'](\/policy\/\d+\/[A-Z]-[\d-]+)["']/g;
      let match;
      let hasSubPolicies = false;
      
      while ((match = urlPattern.exec(html)) !== null) {
        const policyPath = match[1];
        const fullUrl = `${baseUrl}${policyPath}`;
        
        // Check if this is a deeper level URL (more segments than parent)
        const parentSegments = level3Url.split('/').pop().split('-').length;
        const childSegments = policyPath.split('/').pop().split('-').length;
        
        if (childSegments > parentSegments || policyPath.includes('-0')) {
          policyUrls.add(fullUrl);
          hasSubPolicies = true;
        }
      }
      
      // If no sub-policies found, this is an end-level page
      if (!hasSubPolicies) {
        policyUrls.add(level3Url);
      } else {
        console.log(`  Found sub-policies for: ${level3Url.split('/').pop()}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      // If we can't fetch it, assume it's an end-level page
      policyUrls.add(level3Url);
    }
  }
  
  // Convert Set to sorted array
  const sortedUrls = Array.from(policyUrls).sort();
  
  console.log(`\n✅ Total end-level policy URLs found: ${sortedUrls.length}\n`);
  
  // Write to file
  const output = sortedUrls.join('\n');
  fs.writeFileSync('policy-urls.txt', output, 'utf8');
  
  console.log('✅ URLs saved to policy-urls.txt');
  
  // Also create a JSON version for easier programmatic use
  fs.writeFileSync('policy-urls.json', JSON.stringify(sortedUrls, null, 2), 'utf8');
  console.log('✅ URLs also saved to policy-urls.json');
  
  return sortedUrls;
}

// Run the scraper
scrapePolicyUrls().catch(console.error);
