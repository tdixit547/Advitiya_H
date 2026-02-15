// ============================================
// Particle Field Background
// Floating particles with connecting lines
// Creates depth and movement in the background
// ============================================

'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    pulse: number;
    pulseSpeed: number;
}

export default function ParticleField({ count = 50, color = '0,200,83' }: { count?: number; color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef<number | undefined>(undefined);

    const initParticles = useCallback((width: number, height: number) => {
        particles.current = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005,
        }));
    }, [count]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (particles.current.length === 0) {
                initParticles(canvas.width, canvas.height);
            }
        };

        const handleMouse = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouse);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach((p, i) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += p.pulseSpeed;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Mouse repulsion (subtle)
                const dx = mouse.current.x - p.x;
                const dy = mouse.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 0.015;
                    p.vx -= dx * force;
                    p.vy -= dy * force;
                }

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                // Pulsing opacity
                const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${Math.max(0, pulseOpacity)})`;
                ctx.fill();

                // Draw connections to nearby particles
                for (let j = i + 1; j < particles.current.length; j++) {
                    const other = particles.current[j];
                    const dx2 = p.x - other.x;
                    const dy2 = p.y - other.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist2 / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [color, initParticles]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[0]"
            style={{ opacity: 0.8 }}
        />
    );
}
