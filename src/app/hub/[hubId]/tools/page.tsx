'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// ==================== Types ====================

interface HubData {
    hub_id: string;
    slug: string;
    short_code?: string;
    default_url: string;
}

// ==================== Main Component ====================

export default function HubToolsPage() {
    const params = useParams();
    const router = useRouter();
    const hubId = params.hubId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hubData, setHubData] = useState<HubData | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Fetch hub data
    useEffect(() => {
        const fetchHub = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/hubs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch hubs');
                }

                const data = await res.json();
                const hub = data.find?.((h: HubData) => h.hub_id === hubId) ||
                    data.hubs?.find((h: HubData) => h.hub_id === hubId);

                if (hub) {
                    setHubData(hub);
                } else {
                    setError('Hub not found');
                }
            } catch (err) {
                console.error('Failed to load hub:', err);
                setError('Failed to load hub data');
            } finally {
                setLoading(false);
            }
        };
        fetchHub();
    }, [hubId]);

    // Generate URLs
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = hubData ? `${baseUrl}/${hubData.slug}` : '';
    const shortUrl = hubData?.short_code ? `${baseUrl}/r/${hubData.short_code}` : '';

    // Copy to clipboard
    const copyToClipboard = useCallback(async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">❌</div>
                    <h1 className="text-xl font-bold text-white mb-2">Error</h1>
                    <p className="text-[#888] mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-[#00C853] text-black rounded-xl font-medium hover:bg-[#00E676] transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#333]">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-[#888] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span>←</span>
                            <span>Dashboard</span>
                        </button>
                        <h1 className="text-xl font-bold">
                            🛠️ Hub Tools: <span className="text-[#00C853]">/{hubData?.slug}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* URL Display Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Your Smart URLs</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Full URL Card */}
                        <div className="bg-[#0f0f0f] border border-[#333] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#222] rounded-xl flex items-center justify-center">
                                    🔗
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Full URL</h3>
                                    <p className="text-xs text-[#888]">Your smart link slug</p>
                                </div>
                            </div>
                            <div className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 mb-4">
                                <code className="text-[#00C853] text-sm break-all">{fullUrl}</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard(fullUrl, 'full')}
                                className="w-full py-3 bg-[#222] text-white rounded-xl font-medium hover:bg-[#333] transition-colors"
                            >
                                {copied === 'full' ? '✅ Copied!' : '📋 Copy Full URL'}
                            </button>
                        </div>

                        {/* Short URL Card */}
                        <div className="bg-[#0f0f0f] border border-[#00C853]/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#00C853]/20 rounded-xl flex items-center justify-center">
                                    ⚡
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Short URL</h3>
                                    <p className="text-xs text-[#00C853]">Compact & easy to share</p>
                                </div>
                            </div>
                            {shortUrl ? (
                                <>
                                    <div className="bg-[#111] border border-[#00C853]/30 rounded-xl px-4 py-3 mb-4">
                                        <code className="text-[#00C853] text-sm font-bold">{shortUrl}</code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(shortUrl, 'short')}
                                        className="w-full py-3 bg-[#00C853] text-black rounded-xl font-medium hover:bg-[#00E676] transition-colors"
                                    >
                                        {copied === 'short' ? '✅ Copied!' : '📋 Copy Short URL'}
                                    </button>
                                </>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 mb-4">
                                    <p className="text-[#666] text-sm text-center">
                                        Short URL not available for this hub
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Tools Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Tools</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* QR Code Generator Card */}
                        <button
                            onClick={() => router.push(`/hub/${hubId}/qr`)}
                            className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#333] rounded-2xl p-8 text-left
                                       hover:border-[#00C853]/50 hover:shadow-lg hover:shadow-[#00C853]/10 transition-all duration-300
                                       group"
                        >
                            <div className="w-16 h-16 bg-[#00C853]/20 rounded-2xl flex items-center justify-center mb-6 
                                          group-hover:scale-110 group-hover:bg-[#00C853]/30 transition-all duration-300">
                                <span className="text-4xl">📱</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">QR Code Generator</h3>
                            <p className="text-[#888] mb-4">
                                Create scannable QR codes for your smart link. Download in PNG or SVG format with customizable size and themes.
                            </p>
                            <div className="flex items-center gap-2 text-[#00C853] font-medium">
                                <span>Generate QR Code</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </button>

                        {/* Link Shortener Info Card */}
                        <div className="bg-gradient-to-br from-[#1a2e1a] to-[#0f1f0f] border border-[#333] rounded-2xl p-8">
                            <div className="w-16 h-16 bg-[#00C853]/20 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-4xl">🔗</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Link Shortening</h3>
                            <p className="text-[#888] mb-4">
                                {shortUrl
                                    ? 'Your hub has a short URL automatically generated. Use it for social media, QR codes, or anywhere character count matters.'
                                    : 'Short URLs are automatically generated when you create a hub. No additional setup required!'
                                }
                            </p>

                            {shortUrl ? (
                                <div className="space-y-3">
                                    <div className="bg-[#111] border border-[#00C853]/30 rounded-xl px-4 py-3">
                                        <code className="text-[#00C853] text-sm font-bold">{shortUrl}</code>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => copyToClipboard(shortUrl, 'short2')}
                                            className="flex-1 py-2 bg-[#00C853] text-black rounded-lg font-medium hover:bg-[#00E676] transition-colors text-sm"
                                        >
                                            {copied === 'short2' ? '✅ Copied!' : '📋 Copy'}
                                        </button>
                                        <button
                                            onClick={() => window.open(shortUrl, '_blank')}
                                            className="flex-1 py-2 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-colors text-sm"
                                        >
                                            🔗 Test Link
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-center">
                                    <p className="text-[#666] text-sm">Short URL will appear here once generated</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats At-a-Glance */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
                    <div className="bg-[#0f0f0f] border border-[#333] rounded-2xl p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#00C853] mb-1">📱</div>
                                <div className="text-xs text-[#888]">QR Scans</div>
                                <div className="text-xl font-bold text-white">—</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#00C853] mb-1">🔗</div>
                                <div className="text-xs text-[#888]">Short URL Clicks</div>
                                <div className="text-xl font-bold text-white">—</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#00C853] mb-1">📊</div>
                                <div className="text-xs text-[#888]">Total Views</div>
                                <div className="text-xl font-bold text-white">—</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#00C853] mb-1">🎯</div>
                                <div className="text-xs text-[#888]">CTR</div>
                                <div className="text-xl font-bold text-white">—</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#333] text-center">
                            <button
                                onClick={() => router.push(`/analysis/${hubId}`)}
                                className="text-[#00C853] hover:text-[#00E676] font-medium text-sm transition-colors"
                            >
                                View Full Analytics →
                            </button>
                        </div>
                    </div>
                </section>

                {/* Info Section */}
                <section className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 How It Works</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-[#888]">
                        <div>
                            <h4 className="text-white font-medium mb-2">QR Codes</h4>
                            <p>Generate QR codes that point to your smart link. When scanned, visitors go through your configured rules and analytics are tracked.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-2">Short URLs</h4>
                            <p>Your short URLs work exactly like regular links. They redirect through your hub, preserving all routing rules and analytics.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-2">Analytics</h4>
                            <p>All visits through QR codes or short URLs are tracked. View detailed analytics including devices, locations, and click patterns.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
