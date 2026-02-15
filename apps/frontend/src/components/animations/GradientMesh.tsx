// ============================================
// Animated Gradient Mesh Background
// Slowly shifting organic gradient blobs
// Creates a living, breathing background
// ============================================

'use client';

import { useEffect, useRef } from 'react';

interface GradientMeshProps {
    className?: string;
    intensity?: number; // 0-1
}

export default function GradientMesh({ className = '', intensity = 0.08 }: GradientMeshProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const blobs = containerRef.current?.querySelectorAll('.mesh-blob');
        if (!blobs) return;

        const animations: Animation[] = [];

        blobs.forEach((blob, i) => {
            const el = blob as HTMLElement;
            const duration = 15000 + i * 5000;
            const xRange = 30 + i * 10;
            const yRange = 20 + i * 8;

            const keyframes = [
                { transform: `translate(0, 0) scale(1)` },
                { transform: `translate(${xRange}px, -${yRange}px) scale(1.1)` },
                { transform: `translate(-${xRange / 2}px, ${yRange}px) scale(0.95)` },
                { transform: `translate(${xRange / 3}px, -${yRange / 2}px) scale(1.05)` },
                { transform: `translate(0, 0) scale(1)` },
            ];

            const animation = el.animate(keyframes, {
                duration,
                iterations: Infinity,
                easing: 'ease-in-out',
                direction: i % 2 === 0 ? 'normal' : 'reverse',
            });

            animations.push(animation);
        });

        return () => animations.forEach(a => a.cancel());
    }, []);

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div
                className="mesh-blob absolute w-[600px] h-[600px] rounded-full"
                style={{
                    top: '-10%',
                    left: '-5%',
                    background: `radial-gradient(circle, rgba(0,200,83,${intensity}) 0%, transparent 60%)`,
                    filter: 'blur(60px)',
                }}
            />
            <div
                className="mesh-blob absolute w-[500px] h-[500px] rounded-full"
                style={{
                    bottom: '-15%',
                    right: '-10%',
                    background: `radial-gradient(circle, rgba(0,230,118,${intensity * 0.7}) 0%, transparent 60%)`,
                    filter: 'blur(80px)',
                }}
            />
            <div
                className="mesh-blob absolute w-[400px] h-[400px] rounded-full"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(105,240,174,${intensity * 0.4}) 0%, transparent 60%)`,
                    filter: 'blur(100px)',
                }}
            />
            <div
                className="mesh-blob absolute w-[350px] h-[350px] rounded-full"
                style={{
                    top: '20%',
                    right: '15%',
                    background: `radial-gradient(circle, rgba(0,200,83,${intensity * 0.5}) 0%, transparent 60%)`,
                    filter: 'blur(70px)',
                }}
            />
        </div>
    );
}
