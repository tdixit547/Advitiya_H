'use client';

import { useEffect, useState } from 'react';

export default function ReferralDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hardcoded for now
    const hubId = 'shreyas';

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/analytics/hub/${hubId}/referrals?range=7d`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) throw new Error('Failed to fetch referral metrics');

                const json = await res.json();
                setMetrics(json.data);
            } catch (err) {
                console.error(err);
                setError('Could not load referral data');
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [hubId]);

    if (loading) {
        return <div className="p-8 text-blue-500 font-mono">Loading referral data...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500 font-mono">{error}</div>;
    }

    // Calculate totals for max width bars
    const maxSource = Math.max(...(metrics?.sources.map((s: any) => s.count) || [0]));
    const maxReferrer = Math.max(...(metrics?.top_referrers.map((r: any) => r.count) || [0]));

    return (
        <div className="min-h-screen bg-black text-blue-500 font-mono p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-blue-900 pb-4">
                    <h1 className="text-3xl font-bold mb-2 glitch-text">Referral Intelligence</h1>
                    <p className="opacity-70">Traffic Sources & Top Referrers (Last 7 Days)</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Source Distribution */}
                    <div className="border border-blue-500/30 p-6 rounded-lg bg-blue-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-6">Traffic Sources</h3>

                        <div className="space-y-4">
                            {metrics?.sources.map((source: any) => (
                                <div key={source.type}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="capitalize text-white">{source.type}</span>
                                        <span>{source.count} ({source.percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 shadow-[0_0_10px_#0088ff]"
                                            style={{
                                                width: `${(source.count / (maxSource || 1)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {metrics?.sources.length === 0 && (
                                <div className="text-center opacity-50 py-8">No source data yet</div>
                            )}
                        </div>
                    </div>

                    {/* Top Referrers */}
                    <div className="border border-blue-500/30 p-6 rounded-lg bg-blue-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-6">Top Referrers</h3>

                        <div className="space-y-4">
                            {metrics?.top_referrers.map((referrer: any) => (
                                <div key={referrer.domain}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="text-white truncate max-w-[200px]">{referrer.domain}</span>
                                        <span>{referrer.count} visits</span>
                                    </div>
                                    <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 shadow-[0_0_10px_#8800ff]"
                                            style={{
                                                width: `${(referrer.count / (maxReferrer || 1)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {metrics?.top_referrers.length === 0 && (
                                <div className="text-center opacity-50 py-8">No referrer data yet</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <a href="/dashboard" className="inline-block border border-blue-500 text-blue-500 px-6 py-2 hover:bg-blue-500 hover:text-black transition-all uppercase tracking-widest text-sm">
                        ← Return to Main Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
