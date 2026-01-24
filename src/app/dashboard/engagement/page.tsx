import { readEvents } from '@/lib/analytics-storage';
import { AnalyticsEvent } from '@/types';

function getEngagementColor(score?: 'LOW' | 'MEDIUM' | 'HIGH') {
    switch (score) {
        case 'HIGH': return 'text-green-500';
        case 'MEDIUM': return 'text-yellow-500';
        case 'LOW': return 'text-red-500';
        default: return 'text-gray-500';
    }
}

function formatDuration(ms?: number) {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
}

export default async function EngagementPage() {
    const events = await readEvents();

    // Filter for events with dwell time (meaningful engagement data)
    const engagementEvents = events.filter(e => e.dwell_time_ms !== undefined).reverse();

    // Calculate Aggregates
    const totalEngagements = engagementEvents.length;
    const avgDwell = totalEngagements > 0
        ? Math.round(engagementEvents.reduce((acc, e) => acc + (e.dwell_time_ms || 0), 0) / totalEngagements / 1000)
        : 0;

    const scoreCounts = {
        HIGH: engagementEvents.filter(e => e.engagement_score === 'HIGH').length,
        MEDIUM: engagementEvents.filter(e => e.engagement_score === 'MEDIUM').length,
        LOW: engagementEvents.filter(e => e.engagement_score === 'LOW').length,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Engagement Analytics</h1>
                <p className="text-gray-400">Track user attention span and interaction quality.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm mb-1">Avg. Dwell Time</h3>
                    <p className="text-2xl font-bold">{avgDwell}s</p>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm mb-1">High Engagement</h3>
                    <p className="text-2xl font-bold text-green-500">{scoreCounts.HIGH}</p>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm mb-1">Medium Engagement</h3>
                    <p className="text-2xl font-bold text-yellow-500">{scoreCounts.MEDIUM}</p>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm mb-1">Low Engagement</h3>
                    <p className="text-2xl font-bold text-red-500">{scoreCounts.LOW}</p>
                </div>
            </div>

            {/* Guide */}
            <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-bold mb-4">Scoring Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <span className="text-red-500 font-bold block mb-1">Low</span>
                        &lt; 3 seconds
                        <p className="text-gray-500 text-xs mt-1">Quick bounce or accidental click</p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <span className="text-yellow-500 font-bold block mb-1">Medium</span>
                        3 - 20 seconds
                        <p className="text-gray-500 text-xs mt-1">Moderate interest</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="text-green-500 font-bold block mb-1">High</span>
                        &gt; 20 seconds
                        <p className="text-gray-500 text-xs mt-1">Deep engagement</p>
                    </div>
                </div>
            </div>

            {/* Detailed Log Table */}
            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#1a1a1a] text-gray-400">
                            <tr>
                                <th className="p-4">Time</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Dwell Time</th>
                                <th className="p-4">Scroll</th>
                                <th className="p-4">Score</th>
                                <th className="p-4">Device</th>
                                <th className="p-4">Country</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {engagementEvents.length > 0 ? (
                                engagementEvents.map((event, i) => (
                                    <tr key={i} className="hover:bg-[#161616]">
                                        <td className="p-4 text-gray-400">
                                            {event.created_at ? new Date(event.created_at).toLocaleString() : '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${event.event_type === 'CLICK' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                                                }`}>
                                                {event.event_type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono">{formatDuration(event.dwell_time_ms)}</td>
                                        <td className="p-4">{event.scroll_depth_percent}%</td>
                                        <td className={`p-4 font-bold ${getEngagementColor(event.engagement_score)}`}>
                                            {event.engagement_score || '-'}
                                        </td>
                                        <td className="p-4 text-gray-400 capitalize">{event.visitor_device}</td>
                                        <td className="p-4 text-gray-400">{event.visitor_country || 'Unknown'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No engagement data recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
