// ============================================
// SMART LINK HUB - Link Button Component
// ============================================

'use client';

import { Link } from '@/types';
import { useState } from 'react';
import { useEngagement } from './EngagementProvider';

interface LinkButtonProps {
  link: Link;
  accent: string;
  index: number;
}

export default function LinkButton({ link, accent, index }: LinkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { getMetrics } = useEngagement();

  const handleClick = async () => {
    setIsClicked(true);
    const metrics = getMetrics();

    // Track click (non-blocking)
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link_id: link.id,
          hub_id: link.hub_id,
          event_type: 'CLICK',
          dwell_time_ms: metrics.dwellTimeMs,
          scroll_depth_percent: metrics.scrollDepth,
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const isDead = typeof link.is_healthy === 'boolean' && !link.is_healthy;
  const showArchive = isDead && link.archive_url;

  // Decide which URL to use
  // If dead and we have archive, user might want to click the archive instead?
  // Or we provide a separate button. Let's provide a separate small button or tooltip.

  return (
    <div className="relative w-full mb-4">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block w-full p-4 rounded-xl text-center font-medium transition-all duration-300 transform relative"
        style={{
          backgroundColor: isHovered ? accent : `${accent}15`,
          color: isHovered ? '#000000' : '#FFFFFF',
          border: `2px solid ${isDead ? '#EF4444' : accent}`, // Red border if dead
          boxShadow: isHovered
            ? `0 0 30px ${accent}60, 0 0 60px ${accent}30`
            : `0 0 10px ${accent}20`,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          animationDelay: `${index * 100}ms`,
        }}
      >
        <div className="flex items-center justify-center flex-col md:flex-row relative z-10">
          <span>{link.title}</span>
          {isDead && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              Broken Link
            </span>
          )}
        </div>

        {/* Pulse effect on hover */}
        {isHovered && !isDead && (
          <span
            className="absolute inset-0 rounded-xl animate-ping opacity-20"
            style={{ backgroundColor: accent }}
          />
        )}
      </a>

      {showArchive && (
        <div className="text-center mt-1">
          <a
            href={link.archive_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white underline"
          >
            View Archived Version
          </a>
        </div>
      )}
    </div>
  );
}
