'use client';

import { useEffect, useState } from 'react';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { useParams } from 'next/navigation';

export default function EngagementDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [rageClicks, setRageClicks] = useState<any>(null);
    const [linkRanking, setLinkRanking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hardcoded for now, ideally selected from context/url or user's main hub
    const hubId = 'shreyas';

    useEffect(() => {
        async function fetchAllData() {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

                // Fetch engagement metrics
                const metricsRes = await fetch(
                    `${apiUrl}/api/analytics/hub/${hubId}/engagement?range=7d`,
                    { headers }
                );
                if (metricsRes.ok) {
                    const metricsJson = await metricsRes.json();
                    setMetrics(metricsJson.data);
                }

                // Fetch rage clicks
                const rageClicksRes = await fetch(
                    `${apiUrl}/api/analytics/hub/${hubId}/rage-clicks?range=7d`,
                    { headers }
                );
                if (rageClicksRes.ok) {
                    const rageClicksJson = await rageClicksRes.json();
                    setRageClicks(rageClicksJson.data);
                }

                // Fetch link ranking
                const rankingRes = await fetch(
                    `${apiUrl}/api/analytics/hub/${hubId}/link-ranking`,
                    { headers }
                );
                if (rankingRes.ok) {
                    const rankingJson = await rankingRes.json();
                    setLinkRanking(rankingJson.data);
                }
            } catch (err) {
                console.error(err);
                setError('Could not load engagement data');
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();
    }, [hubId]);

    if (loading) {
        return <div className="p-8 text-green-500 font-mono">Loading engagement data...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500 font-mono">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-green-900 pb-4">
                    <h1 className="text-3xl font-bold mb-2 glitch-text">Engagement Intelligence</h1>
                    <p className="opacity-70">Traffic Quality & Attention Scoring (Last 7 Days)</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Average Dwell Time */}
                    <div className="border border-green-500/30 p-6 rounded-lg bg-green-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-2">Avg. Dwell Time</h3>
                        <div className="text-5xl font-bold text-white mb-2">
                            {metrics?.average_dwell_time}s
                        </div>
                        <div className="text-xs opacity-50">
                            Target: &gt; 20s for High Quality
                        </div>
                    </div>

                    {/* Total Engaged Sessions */}
                    <div className="border border-green-500/30 p-6 rounded-lg bg-green-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-2">Engaged Sessions</h3>
                        <div className="text-5xl font-bold text-white mb-2">
                            {metrics?.total_engaged_sessions}
                        </div>
                        <div className="text-xs opacity-50">
                            Sessions with tracking enabled
                        </div>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="border border-green-500/30 p-8 rounded-lg bg-green-500/5 backdrop-blur-sm mb-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Engagement Score Distribution
                    </h3>

                    <div className="space-y-6">
                        {/* High Score */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-white">High Quality (&gt; 20s)</span>
                                <span>{metrics?.score_distribution.high} sessions</span>
                            </div>
                            <div className="h-4 bg-green-900/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 shadow-[0_0_10px_#00ff00]"
                                    style={{
                                        width: `${(metrics?.score_distribution.high / (metrics?.total_engaged_sessions || 1)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Medium Score */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-yellow-500">Medium Quality (3-20s)</span>
                                <span>{metrics?.score_distribution.medium} sessions</span>
                            </div>
                            <div className="h-4 bg-green-900/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 opacity-80"
                                    style={{
                                        width: `${(metrics?.score_distribution.medium / (metrics?.total_engaged_sessions || 1)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Low Score */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-red-500">Low Quality (&lt; 3s)</span>
                                <span>{metrics?.score_distribution.low} sessions</span>
                            </div>
                            <div className="h-4 bg-green-900/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 opacity-80"
                                    style={{
                                        width: `${(metrics?.score_distribution.low / (metrics?.total_engaged_sessions || 1)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rage Clicks Section */}
                <div className="border border-red-500/30 p-8 rounded-lg bg-red-500/5 backdrop-blur-sm mb-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Rage Click Detection (UX Issues)
                    </h3>

                    {rageClicks && rageClicks.total_incidents > 0 ? (
                        <>
                            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded">
                                <div className="text-sm uppercase tracking-widest opacity-70 mb-1">Total Rage Click Incidents</div>
                                <div className="text-3xl font-bold text-white">{rageClicks.total_incidents}</div>
                                <div className="text-xs opacity-50 mt-1">Users frantically clicking non-responsive elements</div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-sm uppercase tracking-widest opacity-70">Problematic Elements</h4>
                                {rageClicks.rage_clicks.slice(0, 5).map((rc: any, idx: number) => (
                                    <div key={idx} className="border border-red-500/20 p-4 rounded bg-red-500/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="font-mono text-sm text-white">{rc.element_selector}</div>
                                                {rc.target_url && rc.target_url !== 'unknown' && (
                                                    <div className="text-xs opacity-50 mt-1 truncate">{rc.target_url}</div>
                                                )}
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold text-red-400">{rc.total_incidents}</div>
                                                <div className="text-xs opacity-50">incidents</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs mt-3 pt-3 border-t border-red-500/20">
                                            <div>
                                                <span className="opacity-50">Total Clicks:</span> {rc.total_clicks}
                                            </div>
                                            <div>
                                                <span className="opacity-50">Avg per Incident:</span> {rc.avg_clicks_per_incident}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 opacity-50">
                            <div className="text-green-500 text-4xl mb-2">✓</div>
                            <div>No rage clicks detected - your UX is working well!</div>
                        </div>
                    )}
                </div>

                {/* Predictive Link Ranking Section */}
                <div className="border border-blue-500/30 p-8 rounded-lg bg-blue-500/5 backdrop-blur-sm mb-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        AI-Powered Link Ranking Suggestions
                    </h3>

                    {linkRanking && linkRanking.ranked_links && linkRanking.ranked_links.length > 0 ? (
                        <>
                            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                                <div className="text-sm font-bold mb-2 text-white">{linkRanking.recommendation}</div>
                                <div className="text-xs opacity-50">Based on CTR and engagement data from the last 7 days</div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-widest opacity-70 mb-4">Suggested Order</h4>
                                {linkRanking.ranked_links.map((link: any, idx: number) => (
                                    <div key={idx} className="border border-blue-500/20 p-4 rounded bg-blue-500/5 flex items-center gap-4">
                                        <div className="text-3xl font-bold text-blue-400 w-12 text-center">
                                            #{link.suggested_position}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white mb-1">{link.title}</div>
                                            <div className="text-xs opacity-70">{link.reasoning}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white">
                                                {link.ctr.toFixed(1)}% CTR
                                            </div>
                                            <div className="text-xs opacity-50">
                                                {link.total_clicks} clicks / {link.total_impressions} views
                                            </div>
                                            <div className={`text-xs mt-1 px-2 py-1 rounded inline-block ${link.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                                                    link.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {link.confidence} confidence
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 opacity-50">
                            <div className="text-blue-400 text-2xl mb-2">📊</div>
                            <div>Not enough data yet to provide ranking suggestions</div>
                            <div className="text-xs mt-2">Come back after your links have more traffic!</div>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <a href="/dashboard" className="inline-block border border-green-500 text-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition-all uppercase tracking-widest text-sm">
                        ← Return to Main Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
