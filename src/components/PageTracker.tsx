'use client';

import { useEffect, useRef } from 'react';
import { useEngagement } from './EngagementProvider';
import { AnalyticsEvent } from '@/types';

interface PageTrackerProps {
    hubId: number;
}

export default function PageTracker({ hubId }: PageTrackerProps) {
    const { getMetrics } = useEngagement();
    const hasTrackedView = useRef(false);

    useEffect(() => {
        // 1. Track initial View (optional: could be done server-side, but client gives us timezone/screen size etc)
        if (!hasTrackedView.current) {
            const trackView = async () => {
                try {
                    await fetch('/api/analytics/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            hub_id: hubId,
                            event_type: 'VIEW',
                        }),
                    });
                } catch (e) {
                    console.error('Failed to track view', e);
                }
            };
            trackView();
            hasTrackedView.current = true;
        }

        // 2. Track Engagement on Unload / Visibility Change
        const handleUnload = () => {
            const metrics = getMetrics();

            // Use navigator.sendBeacon for reliability on page exit
            const payload = {
                hub_id: hubId,
                event_type: 'VIEW', // Updating the view with metrics
                dwell_time_ms: metrics.dwellTimeMs,
                scroll_depth_percent: metrics.scrollDepth,
            };

            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics/track', blob);
        };

        // Handle both visibility change (mobile app switch/tab change) and unload
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleUnload();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        // window.addEventListener('beforeunload', handleUnload); // visibilitychange is generally enough and more reliable

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            // window.removeEventListener('beforeunload', handleUnload);
        };
    }, [hubId, getMetrics]);

    return null;
}
