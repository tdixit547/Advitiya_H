import connectDB from './db';
import Link from '@/models/Link';

/**
 * Checks the health of a URL by sending a HEAD request.
 * Returns the HTTP status code.
 */
export async function checkUrlHealth(url: string): Promise<number> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        // We use fetch with method HEAD. 
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'SmartLinkHub-LinkChecker/1.0',
            },
        });

        clearTimeout(timeoutId);
        return response.status;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return 408; // Request Timeout
        }
        // Network errors, DNS resolution failure, etc.
        return 0;
    }
}

/**
 * Queries the Internet Archive (Wayback Machine) Availability API.
 * Returns the URL of the latest snapshot if available.
 */
export async function getArchiveUrl(url: string): Promise<string | null> {
    try {
        const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.archived_snapshots && data.archived_snapshots.closest) {
            return data.archived_snapshots.closest.url;
        }
        return null;
    } catch (error) {
        console.error('Error fetching archive URL:', error);
        return null;
    }
}

/**
 * Processes a batch of links:
 * 1. Finds links that haven't been checked in the last 24 hours.
 * 2. Checks their health.
 * 3. Updates the database.
 * 4. Fills in archive_url if unhealthy.
 */
export async function processLinkBatch(batchSize = 10) {
    await connectDB();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find unchecked links (checked > 24h ago or never checked)
    const links = await Link.find({
        $or: [
            { lastCheckedAt: { $exists: false } }, // Never checked
            { lastCheckedAt: null },
            { lastCheckedAt: { $lt: twentyFourHoursAgo } }
        ]
    }).limit(batchSize);

    const updates = [];

    for (const link of links) {
        // 1. Check health
        const status = await checkUrlHealth(link.url);
        const isHealthy = status >= 200 && status < 300;

        let archiveUrl = link.archiveUrl; // Keep existing if present, or update

        if (!isHealthy) {
            // Only fetch new archive URL if we don't have one or if we assume it might have changed (usually id doesn't change much)
            // Let's refetch to be safe/current
            const newArchive = await getArchiveUrl(link.url);
            if (newArchive) archiveUrl = newArchive;
        }

        // 2. Update Link document
        link.lastCheckedAt = new Date();
        link.statusCode = status;
        link.isHealthy = isHealthy;
        if (archiveUrl) link.archiveUrl = archiveUrl;

        await link.save();

        updates.push({
            id: link._id,
            url: link.url,
            status,
            isHealthy,
            archiveUrl
        });
    }

    return updates;
}
