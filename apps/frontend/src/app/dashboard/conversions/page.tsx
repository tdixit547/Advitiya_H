// ============================================
// SMART LINK HUB - Conversions Dashboard Page
// Performance classification, link ranking & ROI
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import type { LinkHub } from '@/types';
import {
  getHubs,
  getHubPerformanceClassification,
  getHubAnalyticsLinks,
  getBeforeAfterComparison,
  type PerformanceClassification,
  type AnalyticsLinks,
  type BeforeAfterComparison,
  type TimeRange,
} from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';

export default function ConversionsPage() {
  return (
    <ProtectedRoute>
      <ConversionsContent />
    </ProtectedRoute>
  );
}

function ConversionsContent() {
  const { user, logout } = useAuth();

  const [hubs, setHubs] = useState<LinkHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<LinkHub | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(true);

  const [perf, setPerf] = useState<PerformanceClassification | null>(null);
  const [links, setLinks] = useState<AnalyticsLinks | null>(null);
  const [comparison, setComparison] = useState<BeforeAfterComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<TimeRange>('1h');

  const hasFetched = useRef(false);

  const fetchHubs = useCallback(async () => {
    setIsLoadingHubs(true);
    try {
      const hubList = await getHubs();
      setHubs(hubList);
      if (hubList.length > 0 && !selectedHub) setSelectedHub(hubList[0]);
    } catch {
      setError('Failed to load hubs');
    } finally {
      setIsLoadingHubs(false);
    }
  }, [selectedHub]);

  const fetchData = useCallback(async (hubId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [p, l, c] = await Promise.allSettled([
        getHubPerformanceClassification(hubId, range),
        getHubAnalyticsLinks(hubId, range),
        getBeforeAfterComparison(hubId),
      ]);
      if (p.status === 'fulfilled') setPerf(p.value);
      if (l.status === 'fulfilled') setLinks(l.value);
      if (c.status === 'fulfilled') setComparison(c.value);
    } catch {
      setError('Failed to load conversion data');
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchHubs();
  }, [fetchHubs]);

  useEffect(() => {
    if (selectedHub) fetchData(selectedHub.hub_id);
  }, [selectedHub, fetchData]);

  const topLinks = perf?.topLinks || [];
  const leastLinks = perf?.leastLinks || [];
  const linkData = links?.data || [];

  return (
    <div className="min-h-screen page-bg">
      <DashboardNav />
      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#9A9A9A] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'rgba(168,85,247,0.12)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </span>
              Conversions
            </h1>
            <HubSelector
              hubs={hubs}
              selectedHub={selectedHub}
              onSelect={setSelectedHub}
              onCreateNew={() => {}}
              isLoading={isLoadingHubs}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#333' }}>
              {(['1h', '24h', '7d', 'lifetime'] as TimeRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: range === r ? 'rgba(168,85,247,0.15)' : 'transparent',
                    color: range === r ? '#a855f7' : '#9A9A9A',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="text-sm text-[#9A9A9A] hidden sm:inline">{user?.email}</span>
            <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : selectedHub ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Total Links Analyzed</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{perf?.meta?.total_links_analyzed ?? linkData.length}</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Top Performers</p>
                <p className="text-3xl font-bold text-[#00C853]">{topLinks.length}</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Underperformers</p>
                <p className="text-3xl font-bold text-red-400">{leastLinks.length}</p>
              </div>
            </div>

            {/* Top Performers & Underperformers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid rgba(0, 200, 83, 0.2)' }}>
                <h2 className="text-lg font-bold text-[#00C853] mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  Top Performing
                </h2>
                {topLinks.length > 0 ? (
                  <div className="space-y-3">
                    {topLinks.map((l, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white font-medium truncate">{l.link_name}</p>
                          <p className="text-xs text-[#9A9A9A] truncate">{l.target_url}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-sm font-mono text-[#00C853]">{l.ctr.toFixed(1)}% CTR</p>
                          <p className="text-xs text-[#9A9A9A]">{l.clicks} clicks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9A9A9A] text-sm">Not enough data to classify top performers yet.</p>
                )}
              </div>

              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                  Underperforming
                </h2>
                {leastLinks.length > 0 ? (
                  <div className="space-y-3">
                    {leastLinks.map((l, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white font-medium truncate">{l.link_name}</p>
                          <p className="text-xs text-[#9A9A9A] truncate">{l.target_url}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-sm font-mono text-red-400">{l.ctr.toFixed(1)}% CTR</p>
                          <p className="text-xs text-[#9A9A9A]">{l.clicks} clicks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9A9A9A] text-sm">Not enough data to classify underperformers yet.</p>
                )}
              </div>
            </div>

            {/* All Links Performance Table */}
            <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Link Performance Overview</h2>
              {linkData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left text-[#9A9A9A] pb-3 font-medium">Link</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Impressions</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Clicks</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">CTR</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Rank Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkData.map((l, i) => (
                        <tr key={i} className="border-b border-[#222] last:border-0">
                          <td className="py-3">
                            <p className="text-[#ccc] font-medium truncate max-w-[250px]">{l.name}</p>
                            <p className="text-xs text-[#9A9A9A] truncate max-w-[250px]">{l.target_url}</p>
                          </td>
                          <td className="py-3 text-right text-white font-mono">{l.impressions.toLocaleString()}</td>
                          <td className="py-3 text-right text-white font-mono">{l.clicks.toLocaleString()}</td>
                          <td className="py-3 text-right font-mono" style={{ color: l.ctr > 5 ? '#00C853' : l.ctr > 2 ? '#eab308' : '#ef4444' }}>
                            {l.ctr.toFixed(1)}%
                          </td>
                          <td className="py-3 text-right text-purple-400 font-mono">{l.rank_score.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#9A9A9A] text-sm">No link performance data available yet.</p>
              )}
            </div>

            {/* Before/After Comparison */}
            {comparison?.metrics && comparison.metrics.length > 0 && (
              <div className="rounded-xl p-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Before / After Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left text-[#9A9A9A] pb-3 font-medium">Metric</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Before</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">After</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.metrics.map((m, i) => (
                        <tr key={i} className="border-b border-[#222] last:border-0">
                          <td className="py-3 text-[#ccc]">{m.name}</td>
                          <td className="py-3 text-right text-[#9A9A9A] font-mono">{m.before}</td>
                          <td className="py-3 text-right text-white font-mono">{m.after}</td>
                          <td className="py-3 text-right font-mono" style={{ color: m.changePercent > 0 ? '#00C853' : m.changePercent < 0 ? '#ef4444' : '#9A9A9A' }}>
                            {m.changePercent > 0 ? '+' : ''}{m.changePercent.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : !isLoadingHubs && (
          <div className="text-center py-20">
            <p className="text-[#9A9A9A]">Create a hub to start tracking conversions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
