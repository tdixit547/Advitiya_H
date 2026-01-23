'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { AnalyticsStats } from '@/types';

// Mock data integration
const EMPTY_STATS: AnalyticsStats = {
  totalViews: 0,
  totalClicks: 0,
  uniqueVisitors: 0,
  topLinks: [],
  viewsByDay: [],
  viewsByCountry: [],
  viewsByDevice: []
};

interface AnalyticsPanelProps {
  stats?: AnalyticsStats;
}

export default function AnalyticsPanel({ stats = EMPTY_STATS }: AnalyticsPanelProps) {
  // Use mock data if empty for visualization in dev
  const chartData = stats.viewsByDay.length > 0 ? stats.viewsByDay : [
    { date: 'Mon', views: 45, clicks: 20 },
    { date: 'Tue', views: 65, clicks: 35 },
    { date: 'Wed', views: 85, clicks: 45 },
    { date: 'Thu', views: 120, clicks: 80 },
    { date: 'Fri', views: 95, clicks: 60 },
    { date: 'Sat', views: 150, clicks: 90 },
    { date: 'Sun', views: 180, clicks: 110 },
  ];

  return (
    <div className="space-y-6" aria-label="Analytics Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Views" value={stats.totalViews || 1245} change="+12%" />
        <KpiCard label="Total Clicks" value={stats.totalClicks || 854} change="+8%" />
        <KpiCard label="CTR" value="68.5%" change="+2%" />
        <KpiCard label="Unique Visitors" value={stats.uniqueVisitors || 950} change="+15%" />
      </div>

      {/* Main Chart */}
      <div className="dashboard-card p-6 h-80">
        <h3 className="text-lg font-bold mb-4 text-[#E6E6E6]">Traffic Overview</h3>
        <div className="h-64 w-full" role="img" aria-label="Line chart showing visits over the last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#9A9A9A" />
              <YAxis stroke="#9A9A9A" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                itemStyle={{ color: '#E6E6E6' }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#00C853" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#00C853' }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#E6E6E6" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Links Table */}
      <div className="dashboard-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#E6E6E6]">Top Performing Links</h3>
          <button className="text-sm text-[#00C853] hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333] text-[#9A9A9A] text-sm">
                <th className="py-2">Link Title</th>
                <th className="py-2 text-right">Clicks</th>
                <th className="py-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="text-[#E6E6E6]">
              <tr className="border-b border-[#222] hover:bg-[#1a1a1a]">
                <td className="py-3">🌐 My Portfolio</td>
                <td className="py-3 text-right">452</td>
                <td className="py-3 text-right">12%</td>
              </tr>
              <tr className="border-b border-[#222] hover:bg-[#1a1a1a]">
                <td className="py-3">💻 GitHub</td>
                <td className="py-3 text-right">320</td>
                <td className="py-3 text-right">8%</td>
              </tr>
              {stats.topLinks.map(link => (
                <tr key={link.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                  <td className="py-3">{link.title}</td>
                  <td className="py-3 text-right">{link.clicks}</td>
                  <td className="py-3 text-right">{link.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, change }: { label: string, value: string | number, change: string }) {
  return (
    <div className="dashboard-card p-4">
      <p className="text-[#9A9A9A] text-sm mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-[#00C853] bg-[#00C853]/10 px-2 py-1 rounded">
          {change}
        </span>
      </div>
    </div>
  );
}
