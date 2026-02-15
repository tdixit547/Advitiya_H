// ============================================
// SMART LINK HUB - Hub Selector Component
// Dropdown for selecting/creating hubs
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import type { LinkHub } from '@/types';

interface HubSelectorProps {
  hubs: LinkHub[];
  selectedHub: LinkHub | null;
  onSelect: (hub: LinkHub) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

export default function HubSelector({
  hubs,
  selectedHub,
  onSelect,
  onCreateNew,
  isLoading = false,
}: HubSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-3 rounded-xl px-4 py-2 hover:border-[#00C853]/50 transition-colors disabled:opacity-50"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}
      >
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
        ) : selectedHub ? (
          <>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: selectedHub.theme.accent, color: selectedHub.theme.bg }}
            >
              {selectedHub.slug.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{selectedHub.slug}</p>
              <p className="text-[#666] text-xs truncate max-w-[150px]">{selectedHub.default_url}</p>
            </div>
          </>
        ) : (
          <span className="text-[#9A9A9A]">Select a hub</span>
        )}
        <svg
          className={`w-4 h-4 text-[#9A9A9A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
          <div className="max-h-60 overflow-y-auto">
            {hubs.length === 0 ? (
              <div className="p-4 text-center text-[#666] text-sm">
                No hubs yet
              </div>
            ) : (
              hubs.map((hub) => (
                <button
                  key={hub.hub_id}
                  onClick={() => {
                    onSelect(hub);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] transition-colors ${
                    selectedHub?.hub_id === hub.hub_id ? 'bg-[#00C853]/10' : ''
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: hub.theme.accent, color: hub.theme.bg }}
                  >
                    {hub.slug.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{hub.slug}</p>
                    <p className="text-[#666] text-xs truncate">{hub.default_url}</p>
                  </div>
                  {selectedHub?.hub_id === hub.hub_id && (
                    <svg className="w-4 h-4 text-[#00C853] ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
          
          {/* Create New Hub Button */}
          <div style={{ borderTop: '1px solid var(--border-default)' }}>
            <button
              onClick={() => {
                onCreateNew();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-[#00C853] hover:bg-[#00C853]/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create New Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
