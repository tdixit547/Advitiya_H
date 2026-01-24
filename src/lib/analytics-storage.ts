import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { AnalyticsEvent } from '@/types';

// Store data in OS temp directory
const DATA_DIR = path.join(os.tmpdir(), 'smart-link-hub-data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Helper to revive dates from JSON
const dateReviver = (key: string, value: any) => {
    if (key === 'created_at') {
        return new Date(value);
    }
    return value;
};

// Helper to ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function readEvents(): Promise<AnalyticsEvent[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(EVENTS_FILE, 'utf-8');
        return JSON.parse(data, dateReviver);
    } catch (error) {
        return [];
    }
}

export async function writeEvents(events: AnalyticsEvent[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
    const events = await readEvents();
    events.push(event);
    await writeEvents(events);
}
