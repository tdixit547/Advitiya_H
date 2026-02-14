// ============================================
// SMART LINK HUB - Referrals / Sources Page
// Traffic sources, country breakdown & segments
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import type { LinkHub } from '@/types';
import {
  getHubs,
  getHubAnalyticsSegments,
  getCountryBreakdown,
  getHubAnalyticsOverview,
  type AnalyticsSegments,
  type CountryBreakdown,
  type AnalyticsOverview,
  type TimeRange,
} from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';

export default function ReferralsPage() {
  return (
    <ProtectedRoute>
      <ReferralsContent />
    </ProtectedRoute>
  );
}

function ReferralsContent() {
  const { user, logout } = useAuth();

  const [hubs, setHubs] = useState<LinkHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<LinkHub | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(true);

  const [segments, setSegments] = useState<AnalyticsSegments | null>(null);
  const [countries, setCountries] = useState<CountryBreakdown | null>(null);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
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
      const [seg, ctry, ov] = await Promise.allSettled([
        getHubAnalyticsSegments(hubId, range),
        getCountryBreakdown(hubId, range),
        getHubAnalyticsOverview(hubId, range),
      ]);
      if (seg.status === 'fulfilled') setSegments(seg.value);
      if (ctry.status === 'fulfilled') setCountries(ctry.value);
      if (ov.status === 'fulfilled') setOverview(ov.value);
    } catch {
      setError('Failed to load referral data');
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

  const devices = segments?.data?.devices || [];
  const locations = segments?.data?.locations || [];
  const countryList = countries?.data?.countries || [];

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
              <span className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'rgba(59,130,246,0.12)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              Traffic Sources
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
                    background: range === r ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: range === r ? '#3b82f6' : '#9A9A9A',
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
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : selectedHub ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Total Visits</p>
                <p className="text-3xl font-bold text-white">{(overview?.data?.total_visits || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Unique Users</p>
                <p className="text-3xl font-bold text-blue-400">{(overview?.data?.unique_users || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <p className="text-xs text-[#9A9A9A] mb-1 uppercase tracking-wider">Traffic Trend</p>
                <p className="text-3xl font-bold" style={{ color: overview?.data?.traffic_trend === 'up' ? '#00C853' : overview?.data?.traffic_trend === 'down' ? '#ef4444' : '#9A9A9A' }}>
                  {overview?.data?.traffic_trend === 'up' ? '↑' : overview?.data?.traffic_trend === 'down' ? '↓' : '→'}{' '}
                  {overview?.data?.trend_percentage ? `${overview.data.trend_percentage.toFixed(1)}%` : '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Devices */}
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <h2 className="text-lg font-bold text-white mb-4">Device Breakdown</h2>
                {devices.length > 0 ? (
                  <div className="space-y-3">
                    {devices.map(d => (
                      <div key={d.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#ccc] capitalize">{d.type}</span>
                          <span className="text-sm font-mono text-blue-400">{d.count} ({d.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.percentage}%`, background: '#3b82f6' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9A9A9A] text-sm">No device data yet.</p>
                )}
              </div>

              {/* Locations */}
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <h2 className="text-lg font-bold text-white mb-4">Location Breakdown</h2>
                {locations.length > 0 ? (
                  <div className="space-y-3">
                    {locations.slice(0, 8).map(l => (
                      <div key={l.location}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#ccc]">{l.location || 'Unknown'}</span>
                          <span className="text-sm font-mono text-blue-400">{l.count} ({l.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${l.percentage}%`, background: '#6366f1' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9A9A9A] text-sm">No location data yet.</p>
                )}
              </div>
            </div>

            {/* Country Table */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Country Breakdown</h2>
              {countryList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left text-[#9A9A9A] pb-3 font-medium">Country</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Clicks</th>
                        <th className="text-right text-[#9A9A9A] pb-3 font-medium">Share</th>
                        <th className="text-left text-[#9A9A9A] pb-3 pl-4 font-medium w-40">Distribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countryList.map((c, i) => (
                        <tr key={i} className="border-b border-[#222] last:border-0">
                          <td className="py-3 text-[#ccc]">{c.country || 'Unknown'}</td>
                          <td className="py-3 text-right text-white font-mono">{c.clicks.toLocaleString()}</td>
                          <td className="py-3 text-right text-blue-400 font-mono">{c.percentage.toFixed(1)}%</td>
                          <td className="py-3 pl-4">
                            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${c.percentage}%`, background: '#3b82f6' }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#9A9A9A] text-sm">No country data available yet.</p>
              )}
            </div>
          </>
        ) : !isLoadingHubs && (
          <div className="text-center py-20">
            <p className="text-[#9A9A9A]">Create a hub to start tracking traffic sources.</p>
          </div>
        )}
      </div>
    </div>
  );
}
