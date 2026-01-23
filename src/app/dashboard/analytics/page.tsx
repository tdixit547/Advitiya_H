'use client';

import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface StatsData {
    totalViews: number;
    totalClicks: number;
    ctr: number;
    uniqueVisitors: number;
    topLinks: { id: number; title: string; clicks: number; ctr: number }[];
    viewsByDay: { date: string; views: number }[];
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
    const [stats, setStats] = useState<StatsData | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/analytics/stats?hub_id=1&period=${period}`);
                const data = await res.json();
                if (data.success) setStats(data.data);
            } catch (e) {
                console.error('Failed to fetch analytics');
            }
        };
        fetchStats();
    }, [period]);

    // Mock data for visualization
    const chartData = stats?.viewsByDay?.length ? stats.viewsByDay : [
        { date: 'Mon', views: 45 },
        { date: 'Tue', views: 65 },
        { date: 'Wed', views: 85 },
        { date: 'Thu', views: 120 },
        { date: 'Fri', views: 95 },
        { date: 'Sat', views: 150 },
        { date: 'Sun', views: 180 },
    ];

    const topLinks = stats?.topLinks?.length ? stats.topLinks : [
        { id: 1, title: 'My Portfolio', clicks: 452, ctr: 12 },
        { id: 2, title: 'GitHub', clicks: 320, ctr: 8 },
        { id: 3, title: 'LinkedIn', clicks: 280, ctr: 7 },
        { id: 4, title: 'Twitter', clicks: 190, ctr: 5 },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <div className="flex bg-[#111] border border-[#222] rounded-lg p-1">
                    {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${period === p
                                    ? 'bg-[#00C853] text-black font-bold'
                                    : 'text-[#9A9A9A] hover:text-white'
                                }`}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Total Views" value={stats?.totalViews || 1245} change="+12%" />
                <KpiCard label="Total Clicks" value={stats?.totalClicks || 854} change="+8%" />
                <KpiCard label="CTR" value={`${stats?.ctr || 68.5}%`} change="" />
                <KpiCard label="Unique Visitors" value={stats?.uniqueVisitors || 950} change="+15%" />
            </div>

            {/* Traffic Chart */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <h2 className="text-lg font-bold text-white mb-4">Traffic Overview</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#9A9A9A' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#00C853"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#00C853' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Links Table */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Top Performing Links</h2>
                    <button className="text-sm text-[#00C853] hover:text-[#00E676]">
                        Export CSV
                    </button>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#222]">
                            <th className="text-left py-3 text-[#9A9A9A] text-sm font-medium">Link Title</th>
                            <th className="text-right py-3 text-[#9A9A9A] text-sm font-medium">Clicks</th>
                            <th className="text-right py-3 text-[#9A9A9A] text-sm font-medium">CTR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topLinks.map((link) => (
                            <tr key={link.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🌐</span>
                                        <span className="text-white">{link.title}</span>
                                    </div>
                                </td>
                                <td className="text-right py-3 text-[#00C853] font-medium">{link.clicks}</td>
                                <td className="text-right py-3 text-[#9A9A9A]">{link.ctr}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function KpiCard({ label, value, change }: { label: string; value: string | number; change: string }) {
    return (
        <div className="bg-[#111] rounded-xl border border-[#222] p-4">
            <p className="text-[#9A9A9A] text-xs uppercase tracking-wider mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{value}</p>
                {change && (
                    <span className="text-xs text-[#00C853]">{change}</span>
                )}
            </div>
        </div>
    );
}
