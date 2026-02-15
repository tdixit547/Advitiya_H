// ============================================
// Magnetic Button Component
// Button that subtly follows the cursor when nearby
// Creates a playful, premium interactive feel
// ============================================

'use client';

import { useRef, useState, ReactNode } from 'react';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    strength?: number;
    onClick?: () => void;
    href?: string;
}

export default function MagneticButton({
    children,
    className = '',
    style = {},
    strength = 0.3,
    onClick,
    href,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setTransform({ x: deltaX, y: deltaY, scale: 1.05 });
    };

    const handleMouseLeave = () => {
        setTransform({ x: 0, y: 0, scale: 1 });
    };

    const Tag = href ? 'a' : 'div';

    return (
        <Tag
            ref={ref as React.Ref<HTMLDivElement & HTMLAnchorElement>}
            href={href}
            className={className}
            style={{
                ...style,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                display: 'inline-flex',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}
        </Tag>
    );
}
