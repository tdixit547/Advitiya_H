// ============================================
// SMART LINK HUB - Link Button Component
// ============================================

'use client';

import { Link } from '@/types';
import { useState } from 'react';

interface LinkButtonProps {
  link: Link;
  accent: string;
  index: number;
}

export default function LinkButton({ link, accent, index }: LinkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    setIsClicked(true);

    // Track click (non-blocking)
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link_id: link.id,
          hub_id: link.hub_id,
          event_type: 'CLICK',
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block w-full p-4 rounded-xl text-center font-medium transition-all duration-300 transform"
      style={{
        backgroundColor: isHovered ? accent : `${accent}15`,
        color: isHovered ? '#000000' : '#FFFFFF',
        border: `2px solid ${accent}`,
        boxShadow: isHovered
          ? `0 0 30px ${accent}60, 0 0 60px ${accent}30`
          : `0 0 10px ${accent}20`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        animationDelay: `${index * 100}ms`,
      }}
    >
      <span className="relative z-10">{link.title}</span>

      {/* Pulse effect on hover */}
      {isHovered && (
        <span
          className="absolute inset-0 rounded-xl animate-ping opacity-20"
          style={{ backgroundColor: accent }}
        />
      )}
    </a>
  );
}
