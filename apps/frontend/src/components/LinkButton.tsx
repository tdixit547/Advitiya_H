'use client';

import { useState } from 'react';

interface LinkButtonProps {
  variantId: string;
  hubId: string;
  title: string;
  targetUrl: string;
  description?: string;
  icon?: string;
}

/**
 * LinkButton Component
 * Displays a single link in the hub profile with click tracking
 */
export default function LinkButton({
  variantId,
  hubId,
  title,
  targetUrl,
  description,
  icon,
}: LinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

      // Track the click before opening the URL - FIRE AND FORGET
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/analytics/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true, // Ensure request survives page unload/navigation
        body: JSON.stringify({
          hub_id: hubId,
          variant_id: variantId,
          visitor_context: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch(err => console.error('Failed to track click:', err)); // Catch in background


    // Open the URL in a new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="link-button group relative w-full"
      style={{
        display: 'block',
        width: '100%',
        padding: '16px 24px',
        background: isHovered ? 'var(--accent, #00C853)' : 'var(--surface-1)',
        border: '2px solid var(--accent, #00C853)',
        borderRadius: '12px',
        color: isHovered ? 'var(--background)' : 'var(--foreground)',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        textAlign: 'center',
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.7 : 1,
        boxShadow: isHovered ? '0 0 20px rgba(0, 200, 83, 0.3)' : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div className="flex items-center justify-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <span>{title}</span>
      </div>
      {description && (
        <p
          style={{
            marginTop: '8px',
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          {description}
        </p>
      )}
      {isLoading && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          [...]
        </span>
      )}
    </button>
  );
}
