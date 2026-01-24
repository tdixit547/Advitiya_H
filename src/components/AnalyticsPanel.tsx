// ============================================
// SMART LINK HUB - Analytics Panel
// Real analytics from backend stats
<<<<<<< Updated upstream
=======
// With animated counters and premium UI
>>>>>>> Stashed changes
// ============================================

'use client';

import { useState } from 'react';
<<<<<<< Updated upstream
import { 
=======
import {
>>>>>>> Stashed changes
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import type { HubStats } from '@/types';
import { forceAggregateStats, ApiError } from '@/lib/api-client';
<<<<<<< Updated upstream
=======
import AnimatedCounter, { AnimatedPercentage } from '@/components/ui/AnimatedCounter';
>>>>>>> Stashed changes

interface AnalyticsPanelProps {
  hubId: string;
  stats: HubStats | null;
}

export default function AnalyticsPanel({ hubId, stats }: AnalyticsPanelProps) {
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregateMessage, setAggregateMessage] = useState<string | null>(null);

  // Force aggregation
  const handleForceAggregate = async () => {
    setIsAggregating(true);
    setAggregateMessage(null);
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
    try {
      await forceAggregateStats(hubId);
      setAggregateMessage('Stats aggregated! Refresh to see updated data.');
      setTimeout(() => setAggregateMessage(null), 5000);
    } catch (err) {
      if (err instanceof ApiError) {
        setAggregateMessage(`Error: ${err.message}`);
      }
    } finally {
      setIsAggregating(false);
    }
  };

  // Prepare chart data from variant stats
  const chartData = stats?.variants.map(v => ({
    name: v.variant_id.substring(0, 12),
    clicks: v.clicks,
    impressions: v.impressions,
    ctr: Math.round(v.ctr * 100),
  })) || [];

  return (
<<<<<<< Updated upstream
    <div className="space-y-6">
=======
    <div className="space-y-6 animate-fade-in-up">
>>>>>>> Stashed changes
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <button
          onClick={handleForceAggregate}
          disabled={isAggregating}
          className="btn btn-secondary text-sm py-2 px-4 disabled:opacity-50"
        >
<<<<<<< Updated upstream
          {isAggregating ? 'Aggregating...' : '🔄 Force Aggregate'}
=======
          {isAggregating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
              Aggregating...
            </span>
          ) : (
            '🔄 Force Aggregate'
          )}
>>>>>>> Stashed changes
        </button>
      </div>

      {aggregateMessage && (
<<<<<<< Updated upstream
        <div className={`p-3 rounded-lg text-sm ${
          aggregateMessage.startsWith('Error') 
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-green-500/10 border border-green-500/30 text-green-400'
        }`}>
=======
        <div className={`p-3 rounded-lg text-sm animate-fade-in-up ${aggregateMessage.startsWith('Error')
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853]'
          }`}>
>>>>>>> Stashed changes
          {aggregateMessage}
        </div>
      )}

      {/* No Data State */}
      {!stats && (
<<<<<<< Updated upstream
        <div className="bg-[#111] rounded-xl border border-[#222] p-12 text-center">
          <div className="text-5xl mb-4 opacity-30">📊</div>
          <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">No Analytics Yet</h3>
          <p className="text-[#9A9A9A] text-sm max-w-md mx-auto">
            Analytics will appear after visitors access your hub. 
=======
        <div className="bg-[#111] rounded-xl border border-[#222] p-12 text-center animate-fade-in-up">
          <div className="text-5xl mb-4 opacity-30">📊</div>
          <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">No Analytics Yet</h3>
          <p className="text-[#9A9A9A] text-sm max-w-md mx-auto">
            Analytics will appear after visitors access your hub.
>>>>>>> Stashed changes
            Stats are aggregated every 5 minutes.
          </p>
        </div>
      )}

      {stats && (
        <>
<<<<<<< Updated upstream
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              label="Total Impressions" 
              value={stats.aggregated.total_impressions.toLocaleString()} 
              icon="👁️"
            />
            <KpiCard 
              label="Total Clicks" 
              value={stats.aggregated.total_clicks.toLocaleString()} 
              icon="🖱️"
            />
            <KpiCard 
              label="Average CTR" 
              value={`${(stats.aggregated.average_ctr * 100).toFixed(1)}%`} 
              icon="📈"
            />
            <KpiCard 
              label="Active Variants" 
              value={stats.aggregated.variant_count.toString()} 
              icon="🎯"
=======
          {/* KPI Cards with animated counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Impressions"
              value={stats.aggregated.total_impressions}
              icon="👁️"
              delay={0}
            />
            <KpiCard
              label="Total Clicks"
              value={stats.aggregated.total_clicks}
              icon="🖱️"
              delay={1}
            />
            <KpiCard
              label="Average CTR"
              value={stats.aggregated.average_ctr * 100}
              isPercentage
              icon="📈"
              delay={2}
            />
            <KpiCard
              label="Active Variants"
              value={stats.aggregated.variant_count}
              icon="🎯"
              delay={3}
>>>>>>> Stashed changes
            />
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clicks & Impressions Bar Chart */}
<<<<<<< Updated upstream
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
=======
              <div className="bg-[#111] rounded-xl border border-[#222] p-6 card-lift animate-fade-in-up stagger-1">
>>>>>>> Stashed changes
                <h3 className="text-lg font-bold text-[#E6E6E6] mb-4">
                  Performance by Variant
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#9A9A9A" fontSize={12} />
                      <YAxis stroke="#9A9A9A" fontSize={12} />
<<<<<<< Updated upstream
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        itemStyle={{ color: '#E6E6E6' }}
                      />
                      <Bar dataKey="impressions" fill="#666" name="Impressions" />
                      <Bar dataKey="clicks" fill="#00C853" name="Clicks" />
=======
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#E6E6E6' }}
                        cursor={{ fill: 'rgba(0, 200, 83, 0.1)' }}
                      />
                      <Bar
                        dataKey="impressions"
                        fill="#444"
                        name="Impressions"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="clicks"
                        fill="#00C853"
                        name="Clicks"
                        radius={[4, 4, 0, 0]}
                      />
>>>>>>> Stashed changes
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CTR Chart */}
<<<<<<< Updated upstream
              <div className="bg-[#111] rounded-xl border border-[#222] p-6">
=======
              <div className="bg-[#111] rounded-xl border border-[#222] p-6 card-lift animate-fade-in-up stagger-2">
>>>>>>> Stashed changes
                <h3 className="text-lg font-bold text-[#E6E6E6] mb-4">
                  CTR by Variant (%)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#9A9A9A" fontSize={12} />
                      <YAxis stroke="#9A9A9A" fontSize={12} domain={[0, 100]} />
<<<<<<< Updated upstream
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        itemStyle={{ color: '#E6E6E6' }}
                        formatter={(value) => [`${value}%`, 'CTR']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ctr" 
                        stroke="#00C853" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#00C853' }}
=======
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#E6E6E6' }}
                        formatter={(value) => [`${value}%`, 'CTR']}
                      />
                      <Line
                        type="monotone"
                        dataKey="ctr"
                        stroke="#00C853"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#00C853', strokeWidth: 2, stroke: '#000' }}
                        activeDot={{ r: 8, fill: '#00E676', stroke: '#000', strokeWidth: 2 }}
>>>>>>> Stashed changes
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Variant Stats Table */}
<<<<<<< Updated upstream
          <div className="bg-[#111] rounded-xl border border-[#222] p-6">
=======
          <div className="bg-[#111] rounded-xl border border-[#222] p-6 card-lift animate-fade-in-up stagger-3">
>>>>>>> Stashed changes
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#E6E6E6]">Variant Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#333] text-[#9A9A9A] text-sm">
                    <th className="py-3">Variant ID</th>
                    <th className="py-3 text-right">Impressions</th>
                    <th className="py-3 text-right">Clicks</th>
                    <th className="py-3 text-right">CTR</th>
                    <th className="py-3 text-right">Score</th>
                    <th className="py-3 text-right">Recent (1h)</th>
                  </tr>
                </thead>
                <tbody className="text-[#E6E6E6]">
                  {stats.variants.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#666]">
                        No variant stats yet
                      </td>
                    </tr>
                  )}
<<<<<<< Updated upstream
                  {stats.variants.map((variant) => (
                    <tr key={variant.variant_id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                      <td className="py-3 font-medium">{variant.variant_id}</td>
                      <td className="py-3 text-right">{variant.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right">{variant.clicks.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={variant.ctr > 0.1 ? 'text-[#00C853]' : 'text-[#9A9A9A]'}>
                          {(variant.ctr * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right">{variant.score.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className="text-xs bg-[#222] px-2 py-1 rounded">
=======
                  {stats.variants.map((variant, index) => (
                    <tr
                      key={variant.variant_id}
                      className="border-b border-[#222] transition-colors hover:bg-[#1a1a1a]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 font-medium">{variant.variant_id}</td>
                      <td className="py-3 text-right font-mono">{variant.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono">{variant.clicks.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={`font-mono ${variant.ctr > 0.1 ? 'text-[#00C853]' : 'text-[#9A9A9A]'}`}>
                          {(variant.ctr * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono">{variant.score.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className="text-xs bg-[#222] px-2 py-1 rounded transition-colors hover:bg-[#333]">
>>>>>>> Stashed changes
                          {variant.recent_clicks_hour} clicks
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

<<<<<<< Updated upstream
// Helper Component
function KpiCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-[#111] rounded-xl border border-[#222] p-4">
=======
// Enhanced KPI Card with animated counter
function KpiCard({
  label,
  value,
  icon,
  isPercentage = false,
  delay = 0
}: {
  label: string;
  value: number;
  icon: string;
  isPercentage?: boolean;
  delay?: number;
}) {
  return (
    <div className={`stat-card animate-fade-in-up stagger-${delay + 1}`}>
>>>>>>> Stashed changes
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <p className="text-[#9A9A9A] text-sm">{label}</p>
      </div>
<<<<<<< Updated upstream
      <span className="text-2xl font-bold text-white">{value}</span>
=======
      <div className="text-2xl font-bold text-white">
        {isPercentage ? (
          <AnimatedPercentage value={value} />
        ) : (
          <AnimatedCounter value={value} />
        )}
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
