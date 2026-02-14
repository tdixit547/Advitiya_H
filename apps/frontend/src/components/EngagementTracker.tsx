'use client';

import { useEffect, useRef } from 'react';

interface EngagementTrackerProps {
    hubId: string;
}

export default function EngagementTracker({ hubId }: EngagementTrackerProps) {
    const startTime = useRef<number>(0);
    const maxScroll = useRef(0);
    const sent = useRef(false);

    useEffect(() => {
        // Reset on mount
        startTime.current = Date.now();
        maxScroll.current = 0;
        sent.current = false;

        // Track scroll depth
        const handleScroll = () => {
            const scrollPercent = Math.min(
                100,
                Math.round(
                    (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
                )
            );
            if (scrollPercent > maxScroll.current) {
                maxScroll.current = scrollPercent;
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Send data on unmount/hide
        const sendData = () => {
            if (sent.current) return;

            const endTime = Date.now();
            const dwellTime = Math.round((endTime - startTime.current) / 1000); // seconds

            // Ignore very short bounces (< 1s) to save bandwidth? 
            // User requirements say "Low < 3s", so we should track everything.

            let score: 'Low' | 'Medium' | 'High' = 'Low';
            if (dwellTime > 20) score = 'High';
            else if (dwellTime >= 3) score = 'Medium';

            const data = {
                event_type: 'hub_impression', // Augmenting the impression or separate event?
                // Actually, we probably want a specialized event or update the existing session.
                // For simplicity reusing 'hub_view' event logic but sending extra data
                hub_id: hubId,
                dwell_time: dwellTime,
                scroll_depth: maxScroll.current,
                engagement_score: score
            };

            // We need a specific endpoint to log this "end of session" data
            // Or we can hit the standard analytics endpoint.
            // Let's assume we POST to /api/analytics/engagement

            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Use sendBeacon for reliability on unload
            navigator.sendBeacon(`${apiUrl}/api/analytics/engagement`, blob);

            sent.current = true;
        };

        // Handle visibility change (tab switch/close)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendData();
            }
        };

        // Handle page unload
        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', sendData);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', sendData);
            // Ensure we send if unmounted (e.g. client-side nav)
            sendData();
        };
    }, [hubId]);

    return null; // Invisible component
}
