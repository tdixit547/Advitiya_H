'use client';

import { useEffect, useState } from 'react';

export default function ConversionDashboard() {
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
                    // Since we added the endpoint via modify of existing service, we need to expose it on API side via AnalyticsAggregationService
                    // Wait, I implemented getReferralMetrics inside a new endpoint on redirect.ts: GET /api/analytics/hub/:hub_id/referrals
                    // I need to implement GET /api/analytics/hub/:hub_id/conversions as well?
                    // Ah, I missed adding the GET endpoint for retrieving conversion metrics in redirect.ts!
                    // I only added POST for tracking.
                    // I need to add that GET endpoint first.
                    // For now, I will assume the endpoint exists and will fix it in the next step.
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/analytics/hub/${hubId}/conversions?range=7d`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) throw new Error('Failed to fetch conversion metrics');

                const json = await res.json();
                setMetrics(json.data);
            } catch (err) {
                console.error(err);
                setError('Could not load conversion data');
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [hubId]);

    if (loading) {
        return <div className="p-8 text-purple-500 font-mono">Loading conversion data...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500 font-mono">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-purple-500 font-mono p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-purple-900 pb-4">
                    <h1 className="text-3xl font-bold mb-2 glitch-text">Conversion Intelligence</h1>
                    <p className="opacity-70">Revenue & Attribution (Last 7 Days)</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Total Revenue */}
                    <div className="border border-purple-500/30 p-6 rounded-lg bg-purple-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-2">Total Revenue</h3>
                        <div className="text-5xl font-bold text-white mb-2">
                            ${metrics?.total_revenue?.toLocaleString()}
                        </div>
                        <div className="text-xs opacity-50">
                            Gross revenue from attributed links
                        </div>
                    </div>

                    {/* Total Conversions */}
                    <div className="border border-purple-500/30 p-6 rounded-lg bg-purple-500/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest opacity-70 mb-2">Total Conversions</h3>
                        <div className="text-5xl font-bold text-white mb-2">
                            {metrics?.total_conversions}
                        </div>
                        <div className="text-xs opacity-50">
                            Completed actions (purchases, signups)
                        </div>
                    </div>
                </div>

                {/* Top Converting Links */}
                <div className="border border-purple-500/30 p-8 rounded-lg bg-purple-500/5 backdrop-blur-sm mb-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Top Converting Links
                    </h3>

                    <div className="space-y-4">
                        {metrics?.top_converting_links.map((link: any, index: number) => (
                            <div key={link.link_id} className="flex items-center justify-between p-4 border-b border-purple-900/30 last:border-0 hover:bg-purple-900/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-purple-500 font-bold opacity-50">#{index + 1}</span>
                                    <div>
                                        <div className="font-bold text-white">{link.name}</div>
                                        <div className="text-xs opacity-50 flex gap-4">
                                            <span>ID: {link.link_id.substring(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold">${link.revenue}</div>
                                    <div className="text-xs text-purple-400">{link.conversions} conversions</div>
                                </div>
                            </div>
                        ))}
                        {metrics?.top_converting_links.length === 0 && (
                            <div className="text-center opacity-50 py-8">No conversion data yet</div>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <a href="/dashboard" className="inline-block border border-purple-500 text-purple-500 px-6 py-2 hover:bg-purple-500 hover:text-black transition-all uppercase tracking-widest text-sm">
                        ← Return to Main Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
