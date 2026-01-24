// ============================================
// SMART LINK HUB - Hub Selector Component
// Dropdown for selecting/creating hubs
<<<<<<< Updated upstream
=======
// With smooth transitions and animations
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  return (
    <div className="relative" ref={dropdownRef}>
=======
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
>>>>>>> Stashed changes
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
<<<<<<< Updated upstream
        className="flex items-center gap-3 bg-[#111] border border-[#333] rounded-xl px-4 py-2 hover:border-[#00C853]/50 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
        ) : selectedHub ? (
          <>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
=======
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select a hub"
        className="flex items-center gap-3 bg-[#111] border border-[#333] rounded-xl px-4 py-2 transition-all duration-200 disabled:opacity-50 hover:border-[#00C853]/50 hover:shadow-[0_0_15px_rgba(0,200,83,0.1)] press-feedback"
      >
        {isLoading ? (
          <div className="w-8 h-8 skeleton skeleton-animate rounded-lg" />
        ) : selectedHub ? (
          <>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-transform hover:scale-105"
>>>>>>> Stashed changes
              style={{ backgroundColor: selectedHub.theme.accent, color: selectedHub.theme.bg }}
            >
              {selectedHub.slug.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">{selectedHub.slug}</p>
              <p className="text-[#666] text-xs truncate max-w-[150px]">{selectedHub.default_url}</p>
            </div>
          </>
        ) : (
          <span className="text-[#9A9A9A]">Select a hub</span>
        )}
        <svg
<<<<<<< Updated upstream
          className={`w-4 h-4 text-[#9A9A9A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
=======
          className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
>>>>>>> Stashed changes
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

<<<<<<< Updated upstream
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#111] border border-[#333] rounded-xl shadow-xl z-50 overflow-hidden">
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
                    <p className="text-white font-medium text-sm">{hub.slug}</p>
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
          <div className="border-t border-[#333]">
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
=======
      {/* Dropdown Menu with animation */}
      <div
        className={`absolute top-full left-0 mt-2 w-64 bg-[#111] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-200 origin-top ${isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        role="listbox"
      >
        <div className="max-h-60 overflow-y-auto">
          {hubs.length === 0 ? (
            <div className="p-4 text-center text-[#666] text-sm">
              No hubs yet
            </div>
          ) : (
            hubs.map((hub, index) => (
              <button
                key={hub.hub_id}
                role="option"
                aria-selected={selectedHub?.hub_id === hub.hub_id}
                onClick={() => {
                  onSelect(hub);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 ${selectedHub?.hub_id === hub.hub_id
                    ? 'bg-[#00C853]/10'
                    : 'hover:bg-[#1a1a1a] hover:translate-x-1'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: hub.theme.accent, color: hub.theme.bg }}
                >
                  {hub.slug.charAt(0).toUpperCase()}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-white font-medium text-sm">{hub.slug}</p>
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
        <div className="border-t border-[#333]">
          <button
            onClick={() => {
              onCreateNew();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-[#00C853] transition-all duration-150 hover:bg-[#00C853]/10 hover:translate-x-1 press-feedback"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Create New Hub</span>
          </button>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
