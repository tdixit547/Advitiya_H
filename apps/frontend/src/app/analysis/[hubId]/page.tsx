'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import {
    getHubAnalyticsOverview,
    getHubAnalyticsTimeseries,
    getHubAnalyticsLinks,
    getHubAnalyticsSegments,
    getHubAnalyticsHeatmap,
    getHubPerformanceClassification,
    getEnhancedKPIs,
    getWeekdayWeekend,
    getBeforeAfterComparison,
    getMLInsights,
    type AnalyticsOverview,
    type AnalyticsTimeseries,
    type AnalyticsLinks,
    type AnalyticsSegments,
    type AnalyticsHeatmap,
    type PerformanceClassification,
    type TimeRange,
    type EnhancedKPIs,
    type WeekdayWeekendAnalysis,
    type BeforeAfterComparison,
    type MLInsightsResponse,
} from '@/lib/api-client';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// ==================== Types ====================

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
    icon: string;
}

// ==================== Components ====================

function MetricCard({ title, value, subtitle, trend, trendValue, icon }: MetricCardProps) {
    const trendColors = {
        up: 'text-green-400',
        down: 'text-red-400',
        stable: 'text-gray-400',
    };
    const trendIcons = {
        up: '↑',
        down: '↓',
        stable: '→',
    };
    const iconMap: Record<string, React.ReactNode> = {
        views: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
        users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        clicks: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="M13 13l6 6" /></svg>,
        chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    };

    return (
        <div className="bg-[#111] border border-[#333] rounded-xl p-5 hover:border-[#00C853]/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <span className="flex items-center">{iconMap[icon] || icon}</span>
                {trend && (
                    <span className={`text-sm font-medium ${trendColors[trend]}`}>
                        {trendIcons[trend]} {trendValue !== undefined ? `${Math.abs(trendValue).toFixed(1)}%` : ''}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-[#888]">{title}</div>
            {subtitle && <div className="text-xs text-[#666] mt-1">{subtitle}</div>}
        </div>
    );
}

function TimeRangeSelector({ value, onChange }: { value: TimeRange; onChange: (v: TimeRange) => void }) {
    const ranges: { value: TimeRange; label: string }[] = [
        { value: '1h', label: '1 Hour' },
        { value: '24h', label: '24 Hours' },
        { value: '7d', label: '7 Days' },
        { value: 'lifetime', label: 'All Time' },
    ];

    return (
        <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-lg">
            {ranges.map((r) => (
                <button
                    key={r.value}
                    onClick={() => onChange(r.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${value === r.value
                        ? 'bg-[#00C853] text-black'
                        : 'text-[#888] hover:text-white hover:bg-[#222]'
                        }`}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

// ==================== Main Component ====================

export default function AnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const hubId = params.hubId as string;

    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [timeseries, setTimeseries] = useState<AnalyticsTimeseries | null>(null);
    const [links, setLinks] = useState<AnalyticsLinks | null>(null);
    const [segments, setSegments] = useState<AnalyticsSegments | null>(null);
    const [heatmap, setHeatmap] = useState<AnalyticsHeatmap | null>(null);

    // Performance classification state (lazy loaded)
    const [showPerformanceModal, setShowPerformanceModal] = useState(false);
    const [performanceData, setPerformanceData] = useState<PerformanceClassification | null>(null);
    const [performanceLoading, setPerformanceLoading] = useState(false);

    // Enhanced Analytics state
    const [enhancedKPIs, setEnhancedKPIs] = useState<EnhancedKPIs | null>(null);
    const [comparison, setComparison] = useState<BeforeAfterComparison | null>(null);
    const [mlInsights, setMLInsights] = useState<MLInsightsResponse | null>(null);
    const [weekdayWeekend, setWeekdayWeekend] = useState<WeekdayWeekendAnalysis | null>(null);
    const [enhancedLoading, setEnhancedLoading] = useState(false);

    const COLORS = ['#00C853', '#00E676', '#69F0AE', '#B9F6CA', '#E8F5E9'];

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [overviewRes, timeseriesRes, linksRes, segmentsRes, heatmapRes] = await Promise.all([
                getHubAnalyticsOverview(hubId, timeRange),
                getHubAnalyticsTimeseries(hubId, timeRange),
                getHubAnalyticsLinks(hubId, timeRange),
                getHubAnalyticsSegments(hubId, timeRange),
                getHubAnalyticsHeatmap(hubId, '7d'),
            ]);

            setOverview(overviewRes);
            setTimeseries(timeseriesRes);
            setLinks(linksRes);
            setSegments(segmentsRes);
            setHeatmap(heatmapRes);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [hubId, timeRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Lazy load performance classification
    const loadPerformanceData = useCallback(async () => {
        setPerformanceLoading(true);
        try {
            const data = await getHubPerformanceClassification(hubId, timeRange);
            setPerformanceData(data);
        } catch (err) {
            console.error('Failed to load performance data:', err);
        } finally {
            setPerformanceLoading(false);
        }
    }, [hubId, timeRange]);

    // Load enhanced analytics (KPIs, comparison, insights)
    const loadEnhancedAnalytics = useCallback(async () => {
        setEnhancedLoading(true);
        try {
            const [kpisRes, compRes, insightsRes, wwRes] = await Promise.allSettled([
                getEnhancedKPIs(hubId),
                getBeforeAfterComparison(hubId),
                getMLInsights(hubId),
                getWeekdayWeekend(hubId, 30)
            ]);

            if (kpisRes.status === 'fulfilled') setEnhancedKPIs(kpisRes.value);
            if (compRes.status === 'fulfilled') setComparison(compRes.value);
            if (insightsRes.status === 'fulfilled') setMLInsights(insightsRes.value);
            if (wwRes.status === 'fulfilled') setWeekdayWeekend(wwRes.value);
        } catch (err) {
            console.error('Failed to load enhanced analytics:', err);
        } finally {
            setEnhancedLoading(false);
        }
    }, [hubId]);

    // Load enhanced analytics on mount
    useEffect(() => {
        loadEnhancedAnalytics();
    }, [loadEnhancedAnalytics]);

    // Open modal and load data
    const handleOpenPerformanceModal = () => {
        setShowPerformanceModal(true);
        loadPerformanceData();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></div>
                    <h1 className="text-xl font-bold text-white mb-2">Analytics Error</h1>
                    <p className="text-[#888] mb-4">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#00C853] text-black rounded-lg font-medium hover:bg-[#00E676]"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Handle export
    const handleExport = async (format: 'csv' | 'pdf') => {
        const token = localStorage.getItem('auth_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const url = `${apiUrl}/api/export/hub/${hubId}?format=${format}&range=${timeRange}`;

        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `analytics-${hubId}-${timeRange}.${format === 'pdf' ? 'html' : format}`;
            link.click();
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <DashboardNav />
            {/* Header */}
            <header className="sticky top-[49px] z-10 bg-black/80 backdrop-blur-md border-b border-[#333]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold">
                            Analytics: <span className="text-[#00C853]">{hubId}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenPerformanceModal}
                            className="px-4 py-2 bg-gradient-to-r from-[#00C853] to-[#69F0AE] text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Top & Least
                        </button>
                        <div className="relative group">
                            <button className="px-4 py-2 bg-[#222] text-white rounded-lg font-medium border border-[#444] hover:bg-[#333] transition-colors">
                                Export Report
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#333] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="w-full px-4 py-3 text-left hover:bg-[#222] rounded-t-lg text-sm"
                                >
                                    Export as CSV
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full px-4 py-3 text-left hover:bg-[#222] rounded-b-lg text-sm border-t border-[#333]"
                                >
                                    Export as PDF
                                </button>
                            </div>
                        </div>
                        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-8">
                        {/* Overview Panel */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetricCard
                                    icon="views"
                                    title="Total Visits"
                                    value={overview?.data.total_visits?.toLocaleString() || '0'}
                                    trend={overview?.data.traffic_trend}
                                    trendValue={overview?.data.trend_percentage}
                                />
                                <MetricCard
                                    icon="users"
                                    title="Unique Users"
                                    value={overview?.data.unique_users?.toLocaleString() || '0'}
                                />
                                <MetricCard
                                    icon="clicks"
                                    title="Total Clicks"
                                    value={overview?.data.total_clicks?.toLocaleString() || '0'}
                                />
                                <MetricCard
                                    icon="chart"
                                    title="Average CTR"
                                    value={`${overview?.data.average_ctr?.toFixed(2) || '0'}%`}
                                    subtitle={overview?.data.top_performing_link?.name || 'No clicks yet'}
                                />
                            </div>
                        </section>

                        {/* Time Series Charts */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Traffic Over Time</h2>
                            <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                {timeseries?.data && timeseries.data.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={timeseries.data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis
                                                dataKey="timestamp"
                                                stroke="#666"
                                                fontSize={12}
                                                tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            />
                                            <YAxis stroke="#666" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                labelStyle={{ color: '#888' }}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="visits" stroke="#00C853" strokeWidth={2} dot={false} name="Visits" />
                                            <Line type="monotone" dataKey="clicks" stroke="#69F0AE" strokeWidth={2} dot={false} name="Clicks" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-[#666] py-12">No data available for this time period</div>
                                )}
                            </div>
                        </section>

                        {/* Link Performance */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Link Performance</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Clicks Bar Chart */}
                                <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                    <h3 className="text-sm font-medium text-[#888] mb-4">Clicks per Link</h3>
                                    {links?.data && links.data.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={links.data.slice(0, 5)} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis type="number" stroke="#666" fontSize={12} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    stroke="#666"
                                                    fontSize={11}
                                                    width={100}
                                                    tickFormatter={(v) => v.substring(0, 15) + '...'}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                />
                                                <Bar dataKey="clicks" fill="#00C853" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center text-[#666] py-12">No link data</div>
                                    )}
                                </div>

                                {/* CTR Bar Chart */}
                                <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                    <h3 className="text-sm font-medium text-[#888] mb-4">CTR per Link (%)</h3>
                                    {links?.data && links.data.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={links.data.slice(0, 5)} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis type="number" stroke="#666" fontSize={12} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    stroke="#666"
                                                    fontSize={11}
                                                    width={100}
                                                    tickFormatter={(v) => v.substring(0, 15) + '...'}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                />
                                                <Bar dataKey="ctr" fill="#69F0AE" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center text-[#666] py-12">No link data</div>
                                    )}
                                </div>
                            </div>

                            {/* Performance Table */}
                            <div className="bg-[#111] border border-[#333] rounded-xl p-6 mt-6 overflow-x-auto">
                                <h3 className="text-sm font-medium text-[#888] mb-4">Detailed Performance</h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[#666] border-b border-[#333]">
                                            <th className="pb-3 pr-4">Link</th>
                                            <th className="pb-3 pr-4 text-right">Impressions</th>
                                            <th className="pb-3 pr-4 text-right">Clicks</th>
                                            <th className="pb-3 pr-4 text-right">CTR</th>
                                            <th className="pb-3 text-right">Rank Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {links?.data.map((link) => (
                                            <tr key={link.link_id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                                                <td className="py-3 pr-4">
                                                    <div className="text-white truncate max-w-[200px]" title={link.target_url}>
                                                        {link.name}
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4 text-right text-[#888]">{link.impressions.toLocaleString()}</td>
                                                <td className="py-3 pr-4 text-right text-[#00C853] font-medium">{link.clicks.toLocaleString()}</td>
                                                <td className="py-3 pr-4 text-right">{link.ctr.toFixed(2)}%</td>
                                                <td className="py-3 text-right">
                                                    <span className="px-2 py-1 bg-[#00C853]/20 text-[#00C853] rounded text-xs font-medium">
                                                        {link.rank_score.toFixed(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!links?.data || links.data.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-[#666]">No link data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Audience Breakdown */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Audience Breakdown</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Device Distribution */}
                                <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                    <h3 className="text-sm font-medium text-[#888] mb-4">Device Distribution</h3>
                                    {segments?.data.devices && segments.data.devices.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={segments.data.devices}
                                                    dataKey="count"
                                                    nameKey="type"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                                >
                                                    {segments.data.devices.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center text-[#666] py-12">No device data</div>
                                    )}
                                </div>

                                {/* Location Distribution */}
                                <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                    <h3 className="text-sm font-medium text-[#888] mb-4">Top Locations</h3>
                                    {segments?.data.locations && segments.data.locations.length > 0 ? (
                                        <div className="space-y-3">
                                            {segments.data.locations.slice(0, 5).map((loc, i) => (
                                                <div key={loc.location} className="flex items-center gap-3">
                                                    <div className="w-6 text-lg text-[#00C853] font-bold">{i + 1}</div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm text-white">{loc.location}</span>
                                                            <span className="text-sm text-[#00C853]">{loc.percentage}%</span>
                                                        </div>
                                                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#00C853] to-[#69F0AE] rounded-full"
                                                                style={{ width: `${loc.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-[#666] py-12">No location data</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Heatmap */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Engagement Heatmap (7 Days)</h2>
                            <div className="bg-[#111] border border-[#333] rounded-xl p-6 overflow-x-auto">
                                {heatmap?.data.data && heatmap.data.data.length > 0 ? (
                                    <div>
                                        <div className="flex gap-1 mb-2">
                                            <div className="w-10"></div>
                                            {['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((h) => (
                                                <div key={h} className="flex-1 text-center text-xs text-[#666]">{h}</div>
                                            ))}
                                        </div>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => {
                                            const dayData = heatmap.data.data.filter((d) => d.day === dayIndex);
                                            const maxValue = Math.max(...heatmap.data.data.map((d) => d.value), 1);
                                            return (
                                                <div key={day} className="flex gap-1 mb-1">
                                                    <div className="w-10 text-xs text-[#666] flex items-center">{day}</div>
                                                    {Array.from({ length: 24 }, (_, hour) => {
                                                        const cell = dayData.find((d) => d.hour === hour);
                                                        const intensity = cell ? cell.value / maxValue : 0;
                                                        return (
                                                            <div
                                                                key={hour}
                                                                className="flex-1 h-6 rounded-sm transition-colors"
                                                                style={{
                                                                    backgroundColor: intensity > 0
                                                                        ? `rgba(0, 200, 83, ${0.1 + intensity * 0.8})`
                                                                        : '#1a1a1a',
                                                                }}
                                                                title={`${day} ${hour}:00 - ${cell?.value || 0} events`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <span className="text-xs text-[#666]">Less</span>
                                            <div className="flex gap-1">
                                                {[0.1, 0.3, 0.5, 0.7, 0.9].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="w-4 h-4 rounded-sm"
                                                        style={{ backgroundColor: `rgba(0, 200, 83, ${i})` }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-[#666]">More</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-[#666] py-12">No heatmap data available</div>
                                )}
                            </div>
                        </section>

                        {/* ==================== ENHANCED ANALYTICS SECTIONS ==================== */}

                        {/* Enhanced KPIs with Day-over-Day Deltas */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888] flex items-center gap-2">
                                Enhanced KPIs
                                {enhancedLoading && <span className="animate-spin inline-block w-4 h-4 border-2 border-[#00C853] border-t-transparent rounded-full"></span>}
                            </h2>
                            {enhancedKPIs ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {enhancedKPIs.metrics.map((metric) => (
                                        <div key={metric.name} className="bg-[#111] border border-[#333] rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-[#666] uppercase">{metric.name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${metric.trend === 'up' ? 'bg-green-900/30 text-green-400' :
                                                        metric.trend === 'down' ? 'bg-red-900/30 text-red-400' :
                                                            'bg-gray-800 text-gray-400'
                                                    }`}>
                                                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                                                    {metric.delta !== undefined && ` ${metric.delta > 0 ? '+' : ''}${metric.delta.toFixed(1)}%`}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                {typeof metric.value === 'number' ?
                                                    metric.name.includes('CTR') ? `${metric.value.toFixed(2)}%` : metric.value.toLocaleString()
                                                    : metric.value}
                                            </div>
                                            <div className="text-xs text-[#666] mt-1">
                                                vs yesterday: {metric.previousValue !== undefined ?
                                                    (typeof metric.previousValue === 'number' ? metric.previousValue.toLocaleString() : metric.previousValue)
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center text-[#666]">
                                    {enhancedLoading ? 'Loading enhanced KPIs...' : 'Enhanced KPIs not available'}
                                </div>
                            )}
                        </section>

                        {/* Before vs After Comparison */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">7-Day Comparison (Before vs After)</h2>
                            {comparison ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {comparison.metrics.map((m) => (
                                        <div key={m.name} className="bg-[#111] border border-[#333] rounded-xl p-5">
                                            <div className="text-sm text-[#888] mb-3">{m.name}</div>
                                            <div className="flex items-end justify-between mb-2">
                                                <div>
                                                    <div className="text-xs text-[#666]">Previous 7d</div>
                                                    <div className="text-lg font-semibold text-[#888]">
                                                        {typeof m.before === 'number' ? m.before.toLocaleString() : m.before}
                                                    </div>
                                                </div>
                                                <div className="text-2xl text-[#444]">→</div>
                                                <div className="text-right">
                                                    <div className="text-xs text-[#666]">Last 7d</div>
                                                    <div className="text-lg font-semibold text-white">
                                                        {typeof m.after === 'number' ? m.after.toLocaleString() : m.after}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-medium text-center py-1 rounded ${m.changePercent > 0 ? 'bg-green-900/30 text-green-400' :
                                                    m.changePercent < 0 ? 'bg-red-900/30 text-red-400' :
                                                        'bg-gray-800 text-gray-400'
                                                }`}>
                                                {m.changePercent > 0 ? '↑' : m.changePercent < 0 ? '↓' : '→'} {Math.abs(m.changePercent).toFixed(1)}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center text-[#666]">
                                    {enhancedLoading ? 'Loading comparison...' : 'Comparison data not available'}
                                </div>
                            )}
                        </section>

                        {/* Weekday vs Weekend Engagement */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">Weekday vs Weekend Engagement</h2>
                            {weekdayWeekend ? (
                                <div className="bg-[#111] border border-[#333] rounded-xl p-6">
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg></div>
                                            <div className="text-xs text-[#666] uppercase mb-1">Weekday Avg</div>
                                            <div className="text-2xl font-bold text-white">
                                                {weekdayWeekend.weekdayAvg?.toFixed(1) || 0}
                                            </div>
                                            <div className="text-xs text-[#888]">clicks/day</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg></div>
                                            <div className="text-xs text-[#666] uppercase mb-1">Weekend Avg</div>
                                            <div className="text-2xl font-bold text-white">
                                                {weekdayWeekend.weekendAvg?.toFixed(1) || 0}
                                            </div>
                                            <div className="text-xs text-[#888]">clicks/day</div>
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 rounded-lg ${weekdayWeekend.percentDifference > 0 ? 'bg-blue-900/20 text-blue-300' : 'bg-purple-900/20 text-purple-300'
                                        }`}>
                                        {weekdayWeekend.percentDifference > 0
                                            ? `Weekdays outperform weekends by ${weekdayWeekend.percentDifference.toFixed(1)}%`
                                            : `Weekends outperform weekdays by ${Math.abs(weekdayWeekend.percentDifference).toFixed(1)}%`
                                        }
                                    </div>
                                    {weekdayWeekend.recommendation && (
                                        <div className="mt-3 text-xs text-[#888] text-center">
                                            {weekdayWeekend.recommendation}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center text-[#666]">
                                    {enhancedLoading ? 'Loading weekday/weekend data...' : 'Engagement data not available'}
                                </div>
                            )}
                        </section>

                        {/* ML Insights & Recommendations */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4 text-[#888]">AI Insights & Recommendations</h2>
                            {mlInsights && mlInsights.insights && mlInsights.insights.length > 0 ? (
                                <div className="space-y-3">
                                    {mlInsights.insights.map((insight, i) => (
                                        <div
                                            key={i}
                                            className={`bg-[#111] border rounded-xl p-4 ${insight.priority === 'high' ? 'border-yellow-500/50' :
                                                    insight.priority === 'medium' ? 'border-blue-500/30' :
                                                        'border-[#333]'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">
                                                    {insight.type === 'opportunity' ? '→' :
                                                        insight.type === 'warning' ? '!' :
                                                            insight.type === 'success' ? '✓' : 'i'}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium">{insight.title}</div>
                                                    <div className="text-sm text-[#888] mt-1">{insight.description}</div>
                                                    {insight.action && (
                                                        <div className="text-xs text-[#00C853] mt-2 flex items-center gap-1">
                                                            <span>→</span> {insight.action}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded ${insight.priority === 'high' ? 'bg-yellow-900/30 text-yellow-400' :
                                                        insight.priority === 'medium' ? 'bg-blue-900/30 text-blue-400' :
                                                            'bg-gray-800 text-gray-400'
                                                    }`}>
                                                    {insight.priority}
                                                </span>
                                            </div>
                                            {insight.confidence && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="text-xs text-[#666]">Confidence:</div>
                                                    <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#00C853] to-[#69F0AE] rounded-full"
                                                            style={{ width: `${insight.confidence}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-[#888]">{insight.confidence}%</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center">
                                    <div className="flex justify-center mb-3"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg></div>
                                    <div className="text-[#666]">
                                        {enhancedLoading ? 'Generating AI insights...' : 'No insights available yet. Keep collecting data!'}
                                    </div>
                                </div>
                            )}
                        </section>

                    </div>
                )}
            </main>

            {/* Performance Classification Modal */}
            {showPerformanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#333]">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Link Performance Classification
                                </h2>
                                <p className="text-sm text-[#888] mt-1">
                                    Based on Performance Score = rank_score × CTR (time-decayed)
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPerformanceModal(false)}
                                className="text-[#888] hover:text-white transition-colors text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                            {performanceLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : performanceData ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Top Performing Links */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                            <span className="text-2xl">↑</span> Top Performing Links
                                        </h3>
                                        {performanceData.topLinks.length > 0 ? (
                                            <div className="space-y-3">
                                                {performanceData.topLinks.map((link, i) => (
                                                    <div
                                                        key={link.link_id}
                                                        className="bg-[#0a2f0a] border border-green-800/50 rounded-xl p-4 hover:border-green-600 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-bold text-green-400">
                                                                    #{i + 1}
                                                                </span>
                                                                <span className="text-white font-medium truncate max-w-[180px]" title={link.target_url}>
                                                                    {link.link_name}
                                                                </span>
                                                            </div>
                                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                                                                {link.performance_score.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                                            <div className="text-center">
                                                                <div className="text-[#888]">CTR</div>
                                                                <div className="text-green-400 font-medium">{link.ctr.toFixed(2)}%</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-[#888]">Clicks</div>
                                                                <div className="text-white font-medium">{link.clicks}</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-[#888]">Rank Score</div>
                                                                <div className="text-white font-medium">{link.rank_score.toFixed(1)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-[#666] py-8 bg-[#0a0a0a] rounded-xl border border-[#222]">
                                                No top performing links found
                                            </div>
                                        )}
                                    </div>

                                    {/* Least Performing Links */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                            <span className="text-2xl">↓</span> Least Performing Links
                                        </h3>
                                        {performanceData.leastLinks.length > 0 ? (
                                            <div className="space-y-3">
                                                {performanceData.leastLinks.map((link, i) => (
                                                    <div
                                                        key={link.link_id}
                                                        className="bg-[#2f0a0a] border border-red-800/50 rounded-xl p-4 hover:border-red-600 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-bold text-red-400">
                                                                    #{i + 1}
                                                                </span>
                                                                <span className="text-white font-medium truncate max-w-[180px]" title={link.target_url}>
                                                                    {link.link_name}
                                                                </span>
                                                            </div>
                                                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                                                                {link.performance_score.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                                            <div className="text-center">
                                                                <div className="text-[#888]">CTR</div>
                                                                <div className="text-red-400 font-medium">{link.ctr.toFixed(2)}%</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-[#888]">Clicks</div>
                                                                <div className="text-white font-medium">{link.clicks}</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-[#888]">Rank Score</div>
                                                                <div className="text-white font-medium">{link.rank_score.toFixed(1)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-[#666] py-8 bg-[#0a0a0a] rounded-xl border border-[#222]">
                                                No least performing links found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-[#666] py-12">
                                    Failed to load performance data
                                </div>
                            )}

                            {/* Meta Info */}
                            {performanceData?.meta && (
                                <div className="mt-6 pt-6 border-t border-[#333] text-xs text-[#666] flex justify-between">
                                    <span>Time Window: {performanceData.meta.time_window}</span>
                                    <span>Min Impressions: {performanceData.meta.min_impressions_threshold}</span>
                                    <span>Links Analyzed: {performanceData.meta.total_links_analyzed}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

