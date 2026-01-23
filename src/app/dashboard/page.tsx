// ============================================
// SMART LINK HUB - Dashboard Home (Analytics)
// ============================================

import { AnalyticsStats } from '@/types';

// Demo stats (replace with API call in production)
const DEMO_STATS: AnalyticsStats = {
  totalViews: 1250,
  totalClicks: 487,
  uniqueVisitors: 892,
  topLinks: [
    { id: 1, title: '🌐 My Website', clicks: 150, ctr: 12.0 },
    { id: 2, title: '💻 GitHub', clicks: 120, ctr: 9.6 },
    { id: 3, title: '💼 LinkedIn', clicks: 100, ctr: 8.0 },
    { id: 4, title: '📅 Join Meeting', clicks: 50, ctr: 4.0 },
    { id: 5, title: '📱 Download iOS App', clicks: 40, ctr: 3.2 },
  ],
  viewsByDay: [
    { date: '2026-01-17', views: 145, clicks: 52 },
    { date: '2026-01-18', views: 178, clicks: 67 },
    { date: '2026-01-19', views: 156, clicks: 58 },
    { date: '2026-01-20', views: 189, clicks: 72 },
    { date: '2026-01-21', views: 201, clicks: 85 },
    { date: '2026-01-22', views: 223, clicks: 91 },
    { date: '2026-01-23', views: 158, clicks: 62 },
  ],
  viewsByCountry: [
    { country: 'IN', count: 456 },
    { country: 'US', count: 298 },
    { country: 'UK', count: 156 },
    { country: 'CA', count: 89 },
    { country: 'DE', count: 67 },
  ],
  viewsByDevice: [
    { device: 'mobile', count: 625 },
    { device: 'desktop', count: 512 },
    { device: 'tablet', count: 113 },
  ],
};

export default function DashboardPage() {
  const stats = DEMO_STATS;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Track your hub performance and visitor insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon="👁️"
          trend="+12.5%"
        />
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks}
          icon="🖱️"
          trend="+8.3%"
        />
        <StatCard
          title="Click Rate"
          value={`${((stats.totalClicks / stats.totalViews) * 100).toFixed(1)}%`}
          icon="📈"
          trend="+2.1%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="dashboard-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#00FF00]">Views & Clicks</h2>
          <div className="space-y-3">
            {stats.viewsByDay.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-24">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 flex gap-2">
                  <div
                    className="h-6 bg-[#00FF00]/30 rounded"
                    style={{ width: `${(day.views / 250) * 100}%` }}
                  />
                  <span className="text-sm text-gray-400">{day.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Links */}
        <div className="dashboard-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#00FF00]">Top Performing Links</h2>
          <div className="space-y-4">
            {stats.topLinks.map((link, index) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#00FF00] font-bold text-lg">#{index + 1}</span>
                  <span className="text-white">{link.title}</span>
                </div>
                <div className="text-right">
                  <div className="text-[#00FF00] font-semibold">{link.clicks} clicks</div>
                  <div className="text-gray-500 text-sm">{link.ctr}% CTR</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Country */}
        <div className="dashboard-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#00FF00]">Views by Country</h2>
          <div className="space-y-3">
            {stats.viewsByCountry.map((item) => (
              <div key={item.country} className="flex items-center gap-4">
                <span className="text-2xl">{getCountryFlag(item.country)}</span>
                <span className="text-gray-300 w-12">{item.country}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00FF00] to-[#00CC00]"
                    style={{ width: `${(item.count / stats.viewsByCountry[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-16 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Device */}
        <div className="dashboard-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#00FF00]">Views by Device</h2>
          <div className="flex items-center justify-around py-8">
            {stats.viewsByDevice.map((item) => (
              <div key={item.device} className="text-center">
                <div className="text-4xl mb-2">{getDeviceIcon(item.device)}</div>
                <div className="text-2xl font-bold text-[#00FF00] stat-number">{item.count}</div>
                <div className="text-gray-500 capitalize">{item.device}</div>
                <div className="text-gray-600 text-sm">
                  {((item.count / stats.totalViews) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
}) {
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white stat-number">{value}</p>
          <p className="text-[#00FF00] text-sm mt-1">{trend} vs last week</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

// Helper functions
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    IN: '🇮🇳',
    US: '🇺🇸',
    UK: '🇬🇧',
    CA: '🇨🇦',
    DE: '🇩🇪',
  };
  return flags[code] || '🌍';
}

function getDeviceIcon(device: string): string {
  const icons: Record<string, string> = {
    mobile: '📱',
    desktop: '💻',
    tablet: '📲',
  };
  return icons[device] || '📱';
}
