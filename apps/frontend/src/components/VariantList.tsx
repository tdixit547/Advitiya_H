// ============================================
// SMART LINK HUB - Variant List Component
// Displays and manages list of variants
// ============================================

'use client';

import type { Variant, VariantStats } from '@/types';

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
    return (
      <div className="rounded-xl p-8" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Loading variants...</p>
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--surface-0)', border: '1px solid var(--border-default)' }}>
        <div className="mb-4 opacity-30 flex justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        </div>
        <p style={{ color: 'var(--foreground-secondary)' }}>No variants yet. Add your first variant!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
      <div className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
        {variants.map((variant) => {
          const variantStats = getVariantStats(variant.variant_id);
          const isSelected = variant.variant_id === selectedId;
          
          return (
            <div
              key={variant.variant_id}
              onClick={() => onSelect(variant)}
              className={`p-4 cursor-pointer transition-colors`}
              style={{ 
                background: isSelected ? 'rgba(0, 200, 83, 0.1)' : 'transparent',
                borderLeft: isSelected ? '2px solid #00C853' : '2px solid transparent',
                '--hover-bg': 'var(--surface-2)'
              } as React.CSSProperties}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--hover-bg)'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        variant.enabled ? 'bg-[#00C853]' : 'bg-[#666]'
                      }`}
                    />
                    <span className="font-medium truncate" style={{ color: 'var(--foreground)' }}>
                      {variant.variant_id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--foreground-tertiary)' }}>
                      P{variant.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm truncate mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                    {variant.target_url}
                  </p>
                  
                  {/* Conditions badges */}
                  {variant.conditions && (
                    <div className="flex flex-wrap gap-1.5">
                      {variant.conditions.device_types?.map(device => (
                        <span 
                          key={device}
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded"
                        >
                          {device}
                        </span>
                      ))}
                      {variant.conditions.countries?.map(country => (
                        <span 
                          key={country}
                          className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded"
                        >
                          {country}
                        </span>
                      ))}
                      {variant.conditions.time_windows?.length ? (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                          {variant.conditions.time_windows.length} time rule{variant.conditions.time_windows.length > 1 ? 's' : ''}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Right: Stats & Actions */}
                <div className="flex items-center gap-3">
                  {variantStats && (
                    <div className="text-right text-sm">
                      <p className="text-[#00C853] font-medium">
                        {(variantStats.ctr * 100).toFixed(1)}% CTR
                      </p>
                      <p className="text-[#666]">
                        {variantStats.clicks}/{variantStats.impressions}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(variant.variant_id);
                    }}
                    className="p-2 text-[#666] hover:text-red-400 transition-colors"
                    title="Delete variant"
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
