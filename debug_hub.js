// using global fetch

async function debugHub(slug) {
  try {
    const response = await fetch(`http://localhost:3001/${slug}/debug`);
    const data = await response.json();
    
    console.log('--- DEBUG INFO ---');
    console.log(`Slug: ${slug}`);
    console.log(`Context:`, data.context);
    console.log(`Total Variants: ${data.total_variants}`);
    console.log(`Filtered Links: ${data.filtered_links}`);
    
    // We want to see WHY they were filtered.
    // The debug endpoint returns filtered links, but we want to see ALL variants to check conditions.
    // The /debug endpoint provided in the code earlier does exactly this! 
    // Wait, looking at redirect.ts line 463: it returns `links: filteredLinks`.
    // BUT line 512 says `total_variants: variants.length`.
    // It doesn't seem to return the raw variants list in the JSON response, only the filtered ones.
    
    // Let's modify the script to fetch the raw variants if possible, 
    // OR we relies on the fact that /debug endpoint MIGHT return more info if I request it?
    // Actually, I can just console.log the response I get.
    
    const fs = require('fs');
    fs.writeFileSync('debug_output.json', JSON.stringify(data, null, 2));
    console.log('Written to debug_output.json');

  } catch (error) {
    console.error('Error fetching debug info:', error);
  }
}

// Get slug from args
const slug = process.argv[2] || 'heer-com';
debugHub(slug);
