// ============================================
// SMART LINK HUB - Engagement Dashboard Page
// Dwell time, scroll depth & engagement scoring
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import type { LinkHub } from '@/types';
import {
  getHubs,
  getEngagementMetrics,
  getRageClicks,
  type EngagementMetrics,
  type RageClickData,
  type TimeRange,
} from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';

export default function EngagementPage() {
  return (
    <ProtectedRoute>
      <EngagementContent />
    </ProtectedRoute>
  );
}

function EngagementContent() {
  const { user, logout } = useAuth();

  // Hub state
  const [hubs, setHubs] = useState<LinkHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<LinkHub | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(true);

  // Data state
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [rageClicks, setRageClicks] = useState<RageClickData | null>(null);
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
      const [eng, rage] = await Promise.allSettled([
        getEngagementMetrics(hubId, range),
        getRageClicks(hubId, range),
      ]);
      if (eng.status === 'fulfilled') setEngagement(eng.value);
      if (rage.status === 'fulfilled') setRageClicks(rage.value);
    } catch {
      setError('Failed to load engagement data');
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

  const dist = engagement?.data?.score_distribution;
  const totalEngaged = engagement?.data?.total_engaged_sessions || 0;

  // Format dwell time for display
  // The EngagementTracker sends dwell_time in seconds, but if stored incorrectly
  // as milliseconds (values > 300 are suspicious for avg dwell), we detect and fix
  const formatDwellTime = (raw: number | undefined | null): string => {
    if (!raw || raw === 0) return '—';
    // If avg dwell > 300, it's likely stored in ms — convert to seconds
    let seconds = raw > 300 ? Math.round(raw / 1000) : Math.round(raw);
    if (seconds < 0) seconds = 0;
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  };

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
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'rgba(234,179,8,0.12)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              Engagement
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
            {/* Time range selector */}
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#333' }}>
              {(['1h', '24h', '7d', 'lifetime'] as TimeRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: range === r ? 'rgba(234,179,8,0.15)' : 'transparent',
                    color: range === r ? '#eab308' : '#9A9A9A',
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
            <div className="w-10 h-10 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : selectedHub ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Avg Dwell Time</p>
                <p className="text-3xl font-bold text-white">
                  {formatDwellTime(engagement?.data?.average_dwell_time)}
                </p>
                <p className="text-xs text-[#9A9A9A] mt-1">seconds per session</p>
              </div>

              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Engaged Sessions</p>
                <p className="text-3xl font-bold text-yellow-400">{totalEngaged.toLocaleString()}</p>
                <p className="text-xs text-[#9A9A9A] mt-1">total tracked sessions</p>
              </div>

              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Rage Clicks</p>
                <p className="text-3xl font-bold text-red-400">
                  {rageClicks?.data?.total_incidents ?? '—'}
                </p>
                <p className="text-xs text-[#9A9A9A] mt-1">frustration incidents</p>
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Engagement Score Distribution</h2>
              {dist ? (
                <div className="space-y-4">
                  {[
                    { label: 'High (>20s)', value: dist.high, color: '#00C853' },
                    { label: 'Medium (3–20s)', value: dist.medium, color: '#eab308' },
                    { label: 'Low (<3s)', value: dist.low, color: '#ef4444' },
                  ].map(({ label, value, color }) => {
                    const pct = totalEngaged > 0 ? (value / totalEngaged) * 100 : 0;
                    return (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#ccc]">{label}</span>
                          <span className="text-sm font-mono" style={{ color }}>{value} ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#9A9A9A] text-sm">No engagement data available yet.</p>
              )}
            </div>

            {/* Rage Clicks Table */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Rage Click Incidents</h2>
              {rageClicks?.data?.rage_clicks && rageClicks.data.rage_clicks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left text-[#9A9A9A] pb-3 font-medium">Element</th>
                        <th className="text-left text-[#9A9A9A] pb-3 font-medium">URL</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Incidents</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Avg Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rageClicks.data.rage_clicks.map((rc, i) => (
                        <tr key={i} className="border-b border-[#222] last:border-0">
                          <td className="py-3 text-[#ccc] font-mono text-xs truncate max-w-[200px]">{rc.element_selector}</td>
                          <td className="py-3 text-[#9A9A9A] truncate max-w-[250px]">{rc.target_url}</td>
                          <td className="py-3 text-right text-red-400 font-mono">{rc.total_incidents}</td>
                          <td className="py-3 text-right text-yellow-400 font-mono">{rc.avg_clicks_per_incident.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#9A9A9A] text-sm">No rage click incidents detected — great UX! 🎉</p>
              )}
            </div>
          </>
        ) : !isLoadingHubs && (
          <div className="text-center py-20">
            <p className="text-[#9A9A9A]">Create a hub to start tracking engagement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
