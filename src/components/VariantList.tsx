// ============================================
// SMART LINK HUB - Variant List Component
// Displays and manages list of variants
// With hover effects and premium animations
// ============================================

'use client';

import type { Variant, VariantStats } from '@/types';
import { SkeletonVariantList } from '@/components/ui/SkeletonLoader';

interface VariantListProps {
  variants: Variant[];
  selectedId?: string;
  onSelect: (variant: Variant) => void;
  onDelete: (variantId: string) => void;
  isLoading?: boolean;
  stats?: VariantStats[];
}

export default function VariantList({
  variants,
  selectedId,
  onSelect,
  onDelete,
  isLoading = false,
  stats = [],
}: VariantListProps) {
  // Get stats for a variant
  const getVariantStats = (variantId: string) => {
    return stats.find(s => s.variant_id === variantId);
  };

  if (isLoading) {
    return <SkeletonVariantList count={3} />;
  }

  if (variants.length === 0) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl border border-[#222] p-8 text-center animate-fade-in-up">
        <p className="text-4xl mb-3">🔗</p>
        <p className="text-[#666]">No variants yet. Add your first variant!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden">
      <div className="divide-y divide-[#222]">
        {variants.map((variant, index) => {
          const variantStats = getVariantStats(variant.variant_id);
          const isSelected = variant.variant_id === selectedId;

          return (
            <div
              key={variant.variant_id}
              onClick={() => onSelect(variant)}
              className={`p-4 cursor-pointer transition-all duration-200 animate-fade-in-up stagger-${Math.min(index + 1, 6)} ${isSelected
                  ? 'bg-[#00C853]/10 border-l-2 border-l-[#00C853]'
                  : 'hover:bg-[#111] hover:translate-x-1'
                }`}
              style={{
                boxShadow: isSelected ? '0 0 20px rgba(0, 200, 83, 0.1)' : undefined
              }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${variant.enabled
                          ? 'bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.5)]'
                          : 'bg-[#666]'
                        }`}
                    />
                    <span className="text-white font-medium truncate">
                      {variant.variant_id}
                    </span>
                    <span className="text-xs bg-[#222] text-[#9A9A9A] px-2 py-0.5 rounded transition-colors hover:bg-[#333]">
                      P{variant.priority}
                    </span>
                  </div>

                  <p className="text-[#666] text-sm truncate mb-2">
                    {variant.target_url}
                  </p>

                  {/* Conditions badges with hover effects */}
                  {variant.conditions && (
                    <div className="flex flex-wrap gap-1.5">
                      {variant.conditions.device_types?.map(device => (
                        <span
                          key={device}
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded transition-all hover:bg-blue-500/30 hover:scale-105"
                        >
                          📱 {device}
                        </span>
                      ))}
                      {variant.conditions.countries?.map(country => (
                        <span
                          key={country}
                          className="text-xs bg-[#00C853]/20 text-[#00C853] px-2 py-0.5 rounded transition-all hover:bg-[#00C853]/30 hover:scale-105"
                        >
                          🌍 {country}
                        </span>
                      ))}
                      {variant.conditions.time_windows?.length ? (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded transition-all hover:bg-purple-500/30 hover:scale-105">
                          ⏰ {variant.conditions.time_windows.length} time rule{variant.conditions.time_windows.length > 1 ? 's' : ''}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex items-center gap-3">
                  {variantStats && (
                    <div className="text-right text-sm">
                      <p className="text-[#00C853] font-medium font-mono">
                        {(variantStats.ctr * 100).toFixed(1)}% CTR
                      </p>
                      <p className="text-[#666] font-mono">
                        {variantStats.clicks.toLocaleString()}/{variantStats.impressions.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(variant.variant_id);
                    }}
                    className="p-2 text-[#666] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all press-feedback"
                    title="Delete variant"
                    aria-label={`Delete variant ${variant.variant_id}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
