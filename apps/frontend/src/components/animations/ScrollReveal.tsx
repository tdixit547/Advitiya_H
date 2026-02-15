// ============================================
// Scroll Reveal Component
// Smooth entrance animations triggered by scrolling
// Multiple animation variants for variety
// ============================================

'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type RevealVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'blur';

interface ScrollRevealProps {
    children: ReactNode;
    variant?: RevealVariant;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    once?: boolean;
}

const variants: Record<RevealVariant, { from: React.CSSProperties; to: React.CSSProperties }> = {
    fadeUp: {
        from: { opacity: 0, transform: 'translateY(40px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeLeft: {
        from: { opacity: 0, transform: 'translateX(-40px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
    },
    fadeRight: {
        from: { opacity: 0, transform: 'translateX(40px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
    },
    scaleUp: {
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' },
    },
    blur: {
        from: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' },
        to: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
    },
};

export default function ScrollReveal({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 700,
    threshold = 0.15,
    className = '',
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    const v = variants[variant];

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...(visible ? v.to : v.from),
                transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                willChange: 'opacity, transform, filter',
            }}
        >
            {children}
        </div>
    );
}
