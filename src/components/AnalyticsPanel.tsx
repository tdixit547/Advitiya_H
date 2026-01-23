'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsPanelProps {
  hubId?: number;
}

export default function AnalyticsPanel({ hubId = 1 }: AnalyticsPanelProps) {
  const [stats, setStats] = useState({
    totalViews: 1245,
    totalClicks: 854,
    ctr: 68.5,
    uniqueVisitors: 950,
  });

  const chartData = [
    { date: 'Mon', views: 45 },
    { date: 'Tue', views: 65 },
    { date: 'Wed', views: 85 },
    { date: 'Thu', views: 120 },
    { date: 'Fri', views: 95 },
    { date: 'Sat', views: 150 },
    { date: 'Sun', views: 180 },
  ];

  const topLinks = [
    { id: 1, title: 'My Portfolio', clicks: 452, ctr: 12 },
    { id: 2, title: 'GitHub', clicks: 320, ctr: 8 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/analytics/stats?hub_id=${hubId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setStats({
            totalViews: data.data.totalViews || 0,
            totalClicks: data.data.totalClicks || 0,
            ctr: data.data.totalViews > 0
              ? ((data.data.totalClicks / data.data.totalViews) * 100).toFixed(1)
              : 0,
            uniqueVisitors: data.data.uniqueVisitors || 0,
          });
        }
      } catch (e) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, [hubId]);

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#111] rounded-lg p-3 border border-[#222]">
          <p className="text-[#9A9A9A] text-[10px] uppercase">Total Views</p>
          <p className="text-lg font-bold text-white">{stats.totalViews}</p>
          <span className="text-[10px] text-[#00C853]">+12%</span>
        </div>
        <div className="bg-[#111] rounded-lg p-3 border border-[#222]">
          <p className="text-[#9A9A9A] text-[10px] uppercase">Total Clicks</p>
          <p className="text-lg font-bold text-white">{stats.totalClicks}</p>
          <span className="text-[10px] text-[#00C853]">+8%</span>
        </div>
        <div className="bg-[#111] rounded-lg p-3 border border-[#222]">
          <p className="text-[#9A9A9A] text-[10px] uppercase">CTR</p>
          <p className="text-lg font-bold text-white">{stats.ctr}%</p>
        </div>
        <div className="bg-[#111] rounded-lg p-3 border border-[#222]">
          <p className="text-[#9A9A9A] text-[10px] uppercase">Visitors</p>
          <p className="text-lg font-bold text-white">{stats.uniqueVisitors}</p>
          <span className="text-[10px] text-[#00C853]">+15%</span>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-[#111] rounded-xl border border-[#222] p-4">
        <h3 className="text-sm font-bold text-white mb-3">Traffic Overview</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#00C853"
                strokeWidth={2}
                dot={{ r: 3, fill: '#00C853' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Links */}
      <div className="bg-[#111] rounded-xl border border-[#222] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Top Performing Links</h3>
          <button className="text-[10px] text-[#00C853] hover:text-[#00E676]">
            Export CSV
          </button>
        </div>
        <div className="space-y-2">
          {topLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-sm">🌐</span>
                <span className="text-sm text-white">{link.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#00C853] font-medium">{link.clicks}</span>
                <span className="text-[#9A9A9A] w-10 text-right">{link.ctr}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
