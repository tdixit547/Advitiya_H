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

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Track the click before opening the URL
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/analytics/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hub_id: hubId,
          variant_id: variantId,
          visitor_context: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open the URL in a new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="link-button group relative w-full"
      style={{
        display: 'block',
        width: '100%',
        padding: '16px 24px',
        background: '#000000',
        border: '2px solid #00FF00',
        borderRadius: '8px',
        color: '#00FF00',
        fontFamily: "'Fira Code', 'Courier New', monospace",
        fontWeight: 600,
        textAlign: 'center',
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = '#00FF00';
          e.currentTarget.style.color = '#000000';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.6)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#000000';
        e.currentTarget.style.color = '#00FF00';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
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
