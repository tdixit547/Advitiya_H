'use client';

import { useEffect, useRef } from 'react';

interface RageClickDetectorProps {
    hubId: string;
}

interface ClickEvent {
    element: HTMLElement;
    timestamp: number;
    selector: string;
    targetUrl: string | null;
}

/**
 * RageClickDetector Component
 * Detects when users repeatedly click on elements (rage clicking)
 * which may indicate broken links or non-responsive UI elements
 */
export default function RageClickDetector({ hubId }: RageClickDetectorProps) {
    const clickHistory = useRef<ClickEvent[]>([]);
    const rageClickThreshold = 3; // Number of clicks to consider "rage"
    const timeWindow = 1000; // Time window in ms (1 second)
    const sessionId = useRef<string>('');

    useEffect(() => {
        // Generate or retrieve session ID
        const generateSessionId = () => {
            const stored = sessionStorage.getItem('analytics_session_id');
            if (stored) return stored;

            const newId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            sessionStorage.setItem('analytics_session_id', newId);
            return newId;
        };

        sessionId.current = generateSessionId();

        // Get CSS selector for an element
        const getSelector = (element: HTMLElement): string => {
            if (element.id) return `#${element.id}`;
            if (element.className) {
                const classes = element.className.split(' ').filter(c => c).join('.');
                if (classes) return `${element.tagName.toLowerCase()}.${classes}`;
            }
            return element.tagName.toLowerCase();
        };

        // Get target URL from element
        const getTargetUrl = (element: HTMLElement): string | null => {
            // Check if it's a link
            if (element.tagName === 'A') {
                return (element as HTMLAnchorElement).href;
            }

            // Check if it has a data attribute
            if (element.hasAttribute('data-url')) {
                return element.getAttribute('data-url');
            }

            // Check parent elements
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                if (parent.tagName === 'A') {
                    return (parent as HTMLAnchorElement).href;
                }
                if (parent.hasAttribute('data-url')) {
                    return parent.getAttribute('data-url');
                }
                parent = parent.parentElement;
            }

            return null;
        };

        // Track click events
        const handleClick = (e: MouseEvent) => {
            const element = e.target as HTMLElement;
            if (!element) return;

            const now = Date.now();
            const selector = getSelector(element);
            const targetUrl = getTargetUrl(element);

            // Add to history
            clickHistory.current.push({
                element,
                timestamp: now,
                selector,
                targetUrl
            });

            // Clean old events outside time window
            clickHistory.current = clickHistory.current.filter(
                click => now - click.timestamp < timeWindow * 2
            );

            // Check for rage clicks on the same element
            const recentClicks = clickHistory.current.filter(
                click =>
                    click.selector === selector &&
                    now - click.timestamp < timeWindow
            );

            if (recentClicks.length >= rageClickThreshold) {
                // Rage click detected!
                console.warn(`Rage click detected on ${selector}`, {
                    clicks: recentClicks.length,
                    element: selector,
                    targetUrl
                });

                // Send rage click event to backend
                sendRageClickEvent({
                    hub_id: hubId,
                    session_id: sessionId.current,
                    rage_click_count: recentClicks.length,
                    element_selector: selector,
                    target_url: targetUrl || 'unknown',
                    variant_id: element.getAttribute('data-variant-id') || undefined
                });

                // Clear history for this element to avoid duplicate reports
                clickHistory.current = clickHistory.current.filter(
                    click => click.selector !== selector
                );
            }
        };

        // Send rage click event to backend
        const sendRageClickEvent = async (data: {
            hub_id: string;
            session_id: string;
            rage_click_count: number;
            element_selector: string;
            target_url: string;
            variant_id?: string;
        }) => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

                // Use sendBeacon for reliability (works even if page is closing)
                const sent = navigator.sendBeacon(`${apiUrl}/api/analytics/rage-click`, blob);

                if (!sent) {
                    // Fallback to fetch if sendBeacon fails
                    await fetch(`${apiUrl}/api/analytics/rage-click`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                }
            } catch (error) {
                console.error('Failed to send rage click event:', error);
            }
        };

        // Add global click listener
        document.addEventListener('click', handleClick, true);

        // Cleanup
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [hubId]);

    // This component doesn't render anything
    return null;
}
