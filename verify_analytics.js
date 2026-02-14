/**
 * Analytics Verification Script
 * 
 * This script tests all analytics features by:
 * 1. Viewing a hub (triggers impression)
 * 2. Clicking a link (triggers click)
 * 3. Fetching analytics to verify data was recorded
 * 
 * Usage: node verify_analytics.js <slug> [authToken]
 * 
 * Example:
 *   node verify_analytics.js my-hub
 *   node verify_analytics.js my-hub eyJhbGciOiJI...
 */

const API_BASE = process.env.API_URL || 'http://localhost:3001';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyAnalytics(slug, authToken) {
    console.log('='.repeat(60));
    console.log('ANALYTICS VERIFICATION TEST');
    console.log('='.repeat(60));
    console.log(`Testing hub: ${slug}`);
    console.log(`API Base: ${API_BASE}`);
    console.log('');

    // Step 1: Fetch hub data (triggers HUB_IMPRESSION)
    console.log('[1/5] Fetching hub data (triggers impression)...');
    try {
        const hubRes = await fetch(`${API_BASE}/${slug}`);
        const hubData = await hubRes.json();
        
        if (hubData.error) {
            console.error('ERROR:', hubData.error);
            return;
        }
        
        console.log(`  ✓ Hub loaded: @${hubData.profile?.username}`);
        console.log(`  ✓ Links found: ${hubData.links?.length || 0}`);
        
        if (!hubData.links || hubData.links.length === 0) {
            console.log('  ⚠ No links available to test clicks');
            return;
        }

        // Step 2: Simulate clicking the first link
        console.log('\n[2/5] Simulating link click...');
        const firstLink = hubData.links[0];
        console.log(`  Target: ${firstLink.title} (${firstLink.variant_id})`);
        
        // We need the hub_id from the database, let's get it via debug endpoint
        const debugRes = await fetch(`${API_BASE}/${slug}/debug`);
        const debugData = await debugRes.json();
        const hubId = debugData.hub?.hub_id;
        
        if (!hubId) {
            console.error('  ✗ Could not get hub_id');
            return;
        }
        
        console.log(`  Hub ID: ${hubId}`);
        
        // Send click event
        const clickRes = await fetch(`${API_BASE}/api/analytics/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hub_id: hubId,
                variant_id: firstLink.variant_id,
                visitor_context: {
                    userAgent: 'AnalyticsVerificationScript/1.0',
                    timestamp: new Date().toISOString()
                }
            })
        });
        
        const clickData = await clickRes.json();
        if (clickData.success) {
            console.log('  ✓ Click event logged successfully');
        } else {
            console.error('  ✗ Click failed:', clickData.error);
        }

        // Step 3: Wait for analytics to process
        console.log('\n[3/5] Waiting for analytics to process (3 seconds)...');
        await sleep(3000);

        // Step 4: Fetch analytics (requires auth token)
        console.log('\n[4/5] Fetching analytics data...');
        
        if (!authToken) {
            console.log('  ⚠ No auth token provided. Skipping analytics fetch.');
            console.log('  To test analytics endpoints, provide an auth token:');
            console.log(`    node verify_analytics.js ${slug} <your-auth-token>`);
            console.log('\n  You can get an auth token by logging in via the frontend or:');
            console.log(`    curl -X POST ${API_BASE}/api/auth/login -H "Content-Type: application/json" -d '{"email":"your@email.com","password":"yourpass"}'`);
        } else {
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            };
            
            // Fetch hub overview
            try {
                const overviewRes = await fetch(`${API_BASE}/api/analytics/hub/${hubId}/overview?range=24h`, { headers });
                const overview = await overviewRes.json();
                
                if (overview.success) {
                    console.log('  ✓ Analytics Overview:');
                    console.log(`    - Total Visits: ${overview.data?.total_visits || 0}`);
                    console.log(`    - Total Clicks: ${overview.data?.total_clicks || 0}`);
                    console.log(`    - Unique Users: ${overview.data?.unique_users || 0}`);
                    console.log(`    - Average CTR: ${overview.data?.average_ctr || 0}%`);
                    console.log(`    - Trend: ${overview.data?.traffic_trend || 'N/A'} (${overview.data?.trend_percentage || 0}%)`);
                } else {
                    console.error('  ✗ Failed to fetch overview:', overview.error);
                }
            } catch (e) {
                console.error('  ✗ Overview fetch error:', e.message);
            }
            
            // Fetch link performance
            try {
                const linksRes = await fetch(`${API_BASE}/api/analytics/hub/${hubId}/links?range=24h`, { headers });
                const links = await linksRes.json();
                
                if (links.success) {
                    console.log('\n  ✓ Link Performance:');
                    (links.data || []).forEach((link, i) => {
                        console.log(`    ${i+1}. ${link.variant_id}: ${link.clicks} clicks (CTR: ${link.ctr}%)`);
                    });
                } else {
                    console.error('  ✗ Failed to fetch links:', links.error);
                }
            } catch (e) {
                console.error('  ✗ Links fetch error:', e.message);
            }
        }

        // Step 5: Check MongoDB directly (via debug info)
        console.log('\n[5/5] Verification Summary:');
        console.log('  ----------------------------------------');
        console.log('  If clicks show 0, check:');
        console.log('    1. Is the backend server running? (npm run dev:backend)');
        console.log('    2. Is MongoDB connected?');
        console.log('    3. Clear Redis cache and retry');
        console.log('  ----------------------------------------');
        
    } catch (error) {
        console.error('ERROR:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60));
}

// Get command line args
const slug = process.argv[2] || 'test-hub';
const authToken = process.argv[3] || null;

verifyAnalytics(slug, authToken);
