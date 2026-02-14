/**
 * ShortenerService - Calls the Python pyshorteners microservice
 * to get external shortened URLs (TinyURL, is.gd, etc.)
 */

const SHORTENER_SERVICE_URL = process.env.SHORTENER_SERVICE_URL || 'http://localhost:5000';

export type ShortenerProvider = 'tinyurl' | 'isgd' | 'dagd' | 'clckru';

export interface ShortenResult {
    short_url: string;
    original_url: string;
    provider: string;
    note?: string;
}

class ShortenerService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = SHORTENER_SERVICE_URL;
    }

    /**
     * Shorten a URL using the Python microservice
     */
    async shortenUrl(url: string, provider: ShortenerProvider = 'tinyurl'): Promise<ShortenResult> {
        try {
            const response = await fetch(`${this.baseUrl}/shorten`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, provider }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
                throw new Error(errorData.error || `Shortener service returned ${response.status}`);
            }

            return await response.json() as ShortenResult;
        } catch (error: any) {
            // Check if the service is unreachable
            if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
                throw new Error('URL shortener service is not running. Start it with: cd apps/shortener && python app.py');
            }
            throw error;
        }
    }

    /**
     * Check if the shortener service is available
     */
    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                signal: AbortSignal.timeout(2000),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Expand a shortened URL
     */
    async expandUrl(url: string): Promise<{ original_url: string; short_url: string }> {
        const response = await fetch(`${this.baseUrl}/expand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
            throw new Error(errorData.error || `Expand failed with status ${response.status}`);
        }

        return await response.json() as { original_url: string; short_url: string };
    }
}

export const shortenerService = new ShortenerService();
