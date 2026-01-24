// ============================================
// SMART LINK HUB - Animated Counter Component
// Smooth counting animation for analytics
// ============================================

'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    duration = 1000,
    suffix = '',
    prefix = '',
    decimals = 0,
    className = '',
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const previousValue = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setDisplayValue(value);
            return;
        }

        const startValue = previousValue.current;
        const endValue = value;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (endValue - startValue) * easeOut;

            setDisplayValue(current);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                previousValue.current = endValue;
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value, duration]);

    const formattedValue = decimals > 0
        ? displayValue.toFixed(decimals)
        : Math.round(displayValue).toLocaleString();

    return (
        <span className={`stat-value ${className}`}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
}

// Utility component for percentage values
export function AnimatedPercentage({
    value,
    className = '',
}: {
    value: number;
    className?: string;
}) {
    return (
        <AnimatedCounter
            value={value}
            suffix="%"
            decimals={1}
            className={className}
        />
    );
}
