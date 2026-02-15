// ============================================
// Cursor Glow Effect
// A soft green glow that follows the mouse cursor
// Creates an immersive, premium feel across the app
// ============================================

'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
    const glowRef = useRef<HTMLDivElement>(null);
    const position = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            target.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            // Smooth lerp for silky movement
            position.current.x += (target.current.x - position.current.x) * 0.08;
            position.current.y += (target.current.y - position.current.y) * 0.08;

            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${position.current.x - 200}px, ${position.current.y - 200}px)`;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            className="fixed top-0 left-0 pointer-events-none z-[1]"
            style={{
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,200,83,0.06) 0%, rgba(0,200,83,0.02) 40%, transparent 70%)',
                willChange: 'transform',
                mixBlendMode: 'screen',
            }}
        />
    );
}
