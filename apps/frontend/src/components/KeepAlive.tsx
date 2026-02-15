'use client';

import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/types';

/**
 * KeepAlive Component
 * 
 * Prevents Vercel serverless cold starts by pinging the backend
 * every 5 minutes while any user has the site open.
 * 
 * - Runs silently in the background (renders nothing)
 * - Pings /api/keep-alive on the backend
 * - Pauses when tab is hidden (saves resources)
 * - Resumes instantly when tab becomes visible again
 */
export default function KeepAlive() {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

        const ping = async () => {
            try {
                await fetch(`${API_BASE_URL}/api/keep-alive`, {
                    method: 'GET',
                    cache: 'no-store',
                });
            } catch {
                // Silently ignore — backend might be cold, next ping will warm it
            }
        };

        const startPinging = () => {
            // Ping immediately on start
            ping();
            // Then ping every 5 minutes
            if (!intervalRef.current) {
                intervalRef.current = setInterval(ping, PING_INTERVAL);
            }
        };

        const stopPinging = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // Handle tab visibility — pause pings when tab hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPinging();
            } else {
                startPinging();
            }
        };

        // Start pinging
        startPinging();

        // Listen for tab visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPinging();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Renders nothing — invisible background component
    return null;
}
