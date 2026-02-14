const http = require('http');

// Configuration
const HUB_ID = 'heer_com'; // Using the hub ID we saw earlier
const SLUG = 'heer-com';
const SHORT_CODE = 'D1Yn0V'; // The short code we found earlier
const ITERATIONS = 5;

// Function to make a request
function makeRequest(path, label) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'http://google.com'
            }
        };

        const req = http.request(options, (res) => {
            console.log(`[${label}] Status: ${res.statusCode}`);
            // Consume response to free resources
            res.on('data', () => {});
            res.on('end', () => resolve(res.statusCode));
        });

        req.on('error', (e) => {
            console.error(`[${label}] Error: ${e.message}`);
            reject(e);
        });

        req.end();
    });
}

async function runSimulation() {
    console.log(`Starting simulation for Hub: ${HUB_ID} (Short Code: ${SHORT_CODE})`);
    
    // 1. Simulate Short URL Redirection (Should trigger REDIRECT and HUB_IMPRESSION events)
    // Note: Our modified short URL logic redirects to /{slug}, which is the Profile Page.
    // The shorturl.ts logic logs 'hub_profile' variant redirect.
    console.log('\n--- Simulating Short URL Clicks ---');
    for (let i = 0; i < ITERATIONS; i++) {
        await makeRequest(`/r/${SHORT_CODE}`, `ShortURL-${i+1}`);
        await new Promise(r => setTimeout(r, 200)); // Small delay
    }

    // 2. Simulate Hub Profile Page Visits (Should trigger HUB_IMPRESSION via client-side or server-side logging?)
    // Wait, the frontend tracks impressions. The backend tracks redirects. 
    // If we only hit the backend via /r/, we verified backend logging in shorturl.ts.
    // The frontend likely has a useEffect to log impressions. 
    // Since we can't run the browser, we rely on the backend logging we verified in shorturl.ts 
    // and the fact that /r/ redirects trigger logging on the backend.

    console.log('\nSimulation complete. Waiting 6 seconds for buffer flush...');
    await new Promise(r => setTimeout(r, 6000));
}

runSimulation();
