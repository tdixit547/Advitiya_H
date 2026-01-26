// ============================================
// SMART LINK HUB - Skeleton Loader Components
// Shimmer loading placeholders
// ============================================

'use client';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`skeleton skeleton-animate ${className}`}
            aria-hidden="true"
        />
    );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={className} aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton skeleton-animate skeleton-text"
                    style={{
                        width: i === lines - 1 ? '60%' : '100%',
                        animationDelay: `${i * 50}ms`
                    }}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-[#111] rounded-xl border border-[#222] p-4 ${className}`} aria-hidden="true">
            <div className="flex items-start gap-3">
                <div className="skeleton skeleton-animate w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton skeleton-animate h-4 w-1/3 rounded" />
                    <div className="skeleton skeleton-animate h-3 w-full rounded" />
                    <div className="flex gap-2 mt-3">
                        <div className="skeleton skeleton-animate h-5 w-16 rounded" />
                        <div className="skeleton skeleton-animate h-5 w-12 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonStatCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-[#111] rounded-xl border border-[#222] p-4 ${className}`} aria-hidden="true">
            <div className="skeleton skeleton-animate h-3 w-1/2 rounded mb-2" />
            <div className="skeleton skeleton-animate h-8 w-2/3 rounded" />
        </div>
    );
}

export function SkeletonVariantList({ count = 3 }: { count?: number }) {
    return (
        <div className="bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 border-b border-[#222] last:border-b-0"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="skeleton skeleton-animate w-2 h-2 rounded-full" />
                                <div className="skeleton skeleton-animate h-4 w-24 rounded" />
                                <div className="skeleton skeleton-animate h-4 w-8 rounded" />
                            </div>
                            <div className="skeleton skeleton-animate h-3 w-full rounded mb-2" />
                            <div className="flex gap-2">
                                <div className="skeleton skeleton-animate h-5 w-16 rounded" />
                                <div className="skeleton skeleton-animate h-5 w-12 rounded" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="skeleton skeleton-animate h-4 w-16 rounded mb-1" />
                            <div className="skeleton skeleton-animate h-3 w-12 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
