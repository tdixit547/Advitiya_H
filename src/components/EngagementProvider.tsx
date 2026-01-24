'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

interface EngagementContextType {
    getMetrics: () => { dwellTimeMs: number; scrollDepth: number };
}

const EngagementContext = createContext<EngagementContextType | null>(null);

export function EngagementProvider({ children }: { children: React.ReactNode }) {
    const startTime = useRef<number>(Date.now());
    const maxScroll = useRef<number>(0);

    useEffect(() => {
        // Reset timer on mount (in case of navigation)
        startTime.current = Date.now();
        maxScroll.current = 0;

        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            if (height > 0) {
                const scrolled = Math.round((winScroll / height) * 100);
                if (scrolled > maxScroll.current) {
                    maxScroll.current = Math.min(100, Math.max(0, scrolled));
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getMetrics = () => {
        return {
            dwellTimeMs: Date.now() - startTime.current,
            scrollDepth: maxScroll.current,
        };
    };

    return (
        <EngagementContext.Provider value={{ getMetrics }}>
            {children}
        </EngagementContext.Provider>
    );
}

export const useEngagement = () => {
    const context = useContext(EngagementContext);
    if (!context) {
        throw new Error('useEngagement must be used within EngagementProvider');
    }
    return context;
};
