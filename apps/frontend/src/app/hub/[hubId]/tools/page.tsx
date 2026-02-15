'use client';

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import { shortenHubUrl, getShortenerStatus } from '@/lib/api-client';
import type { ShortenerProvider } from '@/lib/api-client';
import QRCode from 'qrcode';

// ==================== Types ====================

interface HubData {
    hub_id: string;
    slug: string;
    short_code?: string;
    external_short_url?: string;
    default_url: string;
}

// ==================== Provider Config ====================

const PROVIDER_OPTIONS: { value: ShortenerProvider; label: string; icon: React.ReactNode }[] = [
    { value: 'tinyurl', label: 'TinyURL', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>) },
    { value: 'dagd', label: 'da.gd', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>) },
];

// ==================== Main Component ====================

export default function HubToolsPage() {
    const params = useParams();
    const router = useRouter();
    const hubId = params.hubId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hubData, setHubData] = useState<HubData | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Shortener state
    const [shortenerAvailable, setShortenerAvailable] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ShortenerProvider>('tinyurl');
    const [shortening, setShortening] = useState(false);
    const [externalShortUrl, setExternalShortUrl] = useState<string | null>(null);
    const [shortenError, setShortenError] = useState<string | null>(null);

    // Fetch hub data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/hubs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch hubs');

                const data = await res.json();
                const hub = data.find?.((h: HubData) => h.hub_id === hubId) ||
                    data.hubs?.find((h: HubData) => h.hub_id === hubId);

                if (hub) {
                    setHubData(hub);
                    if (hub.external_short_url) setExternalShortUrl(hub.external_short_url);
                } else {
                    setError('Hub not found');
                }

                try {
                    const status = await getShortenerStatus();
                    setShortenerAvailable(status.available);
                } catch {
                    setShortenerAvailable(false);
                }
            } catch (err) {
                console.error('Failed to load hub:', err);
                setError('Failed to load hub data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [hubId]);

    // URL helpers
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = hubData ? `${baseUrl}/${hubData.slug}` : '';
    const shortUrl = hubData?.short_code ? `${baseUrl}/r/${hubData.short_code}` : '';

    // QR code value — prefers external short URL, then internal short, then full
    const qrValue = externalShortUrl || shortUrl || fullUrl;

    // QR code state
    const [qrSrc, setQrSrc] = useState<string>('');
    const [qrLoading, setQrLoading] = useState(true);
    const [qrDark, setQrDark] = useState(false); // false = white bg, true = dark bg

    // QR color scheme
    const qrColors = qrDark
        ? { dark: '#00C853', light: '#0a0a0a' }
        : { dark: '#000000', light: '#FFFFFF' };

    // Generate QR code whenever qrValue or theme changes
    useEffect(() => {
        if (!qrValue) return;
        setQrLoading(true);
        QRCode.toDataURL(qrValue, {
            width: 220,
            margin: 1,
            color: qrColors,
            errorCorrectionLevel: 'M',
        })
            .then((url) => { setQrSrc(url); setQrLoading(false); })
            .catch(() => setQrLoading(false));
    }, [qrValue, qrDark]);

    // Download QR as PNG
    const downloadQRPNG = useCallback(async () => {
        if (!qrValue) return;
        try {
            const url = await QRCode.toDataURL(qrValue, {
                width: 600,
                margin: 1,
                color: qrColors,
            });
            const link = document.createElement('a');
            link.download = `qr-${hubData?.slug || hubId}.png`;
            link.href = url;
            link.click();
        } catch (err) {
            console.error('QR download failed:', err);
        }
    }, [qrValue, hubData, hubId, qrDark]);

    // Download QR as SVG
    const downloadQRSVG = useCallback(async () => {
        if (!qrValue) return;
        try {
            const svgString = await QRCode.toString(qrValue, {
                type: 'svg',
                width: 400,
                margin: 1,
                color: qrColors,
            });
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `qr-${hubData?.slug || hubId}.svg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('QR download failed:', err);
        }
    }, [qrValue, hubData, hubId, qrDark]);

    const copyToClipboard = useCallback(async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleShortenUrl = async () => {
        if (!hubData) return;
        setShortening(true);
        setShortenError(null);
        try {
            const result = await shortenHubUrl(hubData.hub_id, selectedProvider);
            setExternalShortUrl(result.external_short_url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setShortenError(err.message || 'Failed to shorten URL');
        } finally {
            setShortening(false);
        }
    };

    // ==================== Loading / Error States ====================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="w-10 h-10 border-3 border-[#00C853] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-2xl flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
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

    // ==================== Render ====================

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <DashboardNav />

            {/* Page Header */}
            <header className="sticky top-[49px] z-10 backdrop-blur-md" style={{ background: 'var(--background)', borderBottom: '1px solid var(--border-default)' }}>
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tools
                        </h1>
                        <p className="text-sm text-[#666] mt-0.5">
                            Utilities for <span className="text-[#00C853] font-medium">/{hubData?.slug}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 text-sm text-[#888] border border-[#333] rounded-lg hover:text-white hover:border-[#555] transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* ─── Section 1: Share Your Link ─── */}
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 bg-[#00C853]/15 rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold">Share Your Link</h2>
                    </div>

                    <div className="rounded-2xl divide-y" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', '--tw-divide-opacity': 1 } as React.CSSProperties}>
                        {/* Full URL */}
                        <div className="p-5 flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="text-xs text-[#666] uppercase tracking-wider font-medium mb-1.5">Full URL</div>
                                <code className="text-[#ccc] text-sm break-all font-mono">{fullUrl}</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard(fullUrl, 'full')}
                                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied === 'full'
                                    ? 'bg-[#00C853]/20 text-[#00C853]'
                                    : ''
                                    }`}
                            >
                                {copied === 'full' ? '✓ Copied' : 'Copy'}
                            </button>
                        </div>



                        {/* External Short URL (if generated) */}
                        {externalShortUrl && (
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="text-xs text-[#666] uppercase tracking-wider font-medium">External Short URL</div>
                                        <div className="w-1.5 h-1.5 bg-[#00C853] rounded-full" />
                                    </div>
                                    <code className="text-[#00C853] text-sm break-all font-mono font-bold">{externalShortUrl}</code>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(externalShortUrl, 'external')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied === 'external'
                                            ? 'bg-[#00C853]/20 text-[#00C853]'
                                            : 'bg-[#00C853] text-black hover:bg-[#00E676]'
                                            }`}
                                    >
                                        {copied === 'external' ? '✓ Copied' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={() => window.open(externalShortUrl, '_blank')}
                                        className="px-3 py-2 rounded-lg text-sm transition-colors"
                                        style={{ color: 'var(--foreground-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}
                                        title="Open in new tab"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Section 2: QR Code ─── */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00C853]/15 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold">QR Code</h2>
                        </div>
                        <button
                            onClick={() => router.push(`/hub/${hubId}/qr`)}
                            className="text-xs text-[#555] hover:text-[#00C853] transition-colors"
                        >
                            Customize →
                        </button>
                    </div>

                    <div className="rounded-2xl p-6" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* QR Code Preview */}
                            <div className="shrink-0">
                                <div className={`p-3 rounded-xl transition-colors duration-200 ${qrDark ? 'bg-[#0a0a0a] border border-[#222]' : 'bg-white'}`} style={{ width: 156, height: 156 }}>
                                    {qrLoading ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : qrSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={qrSrc} alt="QR Code" width={132} height={132} className="rounded" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#ccc] text-xs">No URL</div>
                                    )}
                                </div>
                                {/* Dark/Light QR Toggle */}
                                <div className="flex justify-center mt-2 gap-1">
                                    <button
                                        onClick={() => setQrDark(false)}
                                        className={`w-6 h-6 rounded border-2 transition-all duration-150 ${!qrDark ? 'border-[#00C853] bg-white' : 'border-[#333] bg-white/80 opacity-50 hover:opacity-80'
                                            }`}
                                        title="Light background"
                                    />
                                    <button
                                        onClick={() => setQrDark(true)}
                                        className={`w-6 h-6 rounded border-2 transition-all duration-150 ${qrDark ? 'border-[#00C853] bg-[#0a0a0a]' : 'border-[#333] bg-[#0a0a0a] opacity-50 hover:opacity-80'
                                            }`}
                                        title="Dark background"
                                    />
                                </div>
                            </div>

                            {/* QR Info + Actions */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="text-xs text-[#555] uppercase tracking-wider font-medium mb-1.5">Pointing to</div>
                                <code className="text-sm text-[#00C853] font-mono break-all block mb-4">
                                    {qrValue || 'Loading...'}
                                </code>

                                {externalShortUrl && (
                                    <div className="flex items-center gap-1.5 mb-4 justify-center sm:justify-start">
                                        <div className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse" />
                                        <span className="text-xs text-[#00C853]/70">Using shortened URL</span>
                                    </div>
                                )}

                                <div className="flex gap-2 justify-center sm:justify-start">
                                    <button
                                        onClick={downloadQRPNG}
                                        className="px-4 py-2 bg-[#00C853] text-black rounded-lg text-sm font-medium hover:bg-[#00E676] transition-colors"
                                    >
                                        PNG
                                    </button>
                                    <button
                                        onClick={downloadQRSVG}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        style={{ background: 'var(--surface-2)', color: 'var(--foreground-secondary)', border: '1px solid var(--border-default)' }}
                                    >
                                        SVG
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(qrValue, 'qr')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied === 'qr'
                                            ? 'bg-[#00C853]/20 text-[#00C853]'
                                            : ''
                                            }`}
                                    >
                                        {copied === 'qr' ? '✓ Copied' : 'Copy URL'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Section 3: URL Shortener ─── */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00C853]/15 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold">URL Shortener</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${shortenerAvailable ? 'bg-[#00C853]' : 'bg-red-500'}`} />
                            <span className={`text-xs ${shortenerAvailable ? 'text-[#555]' : 'text-red-400'}`}>
                                {shortenerAvailable ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl p-6" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
                        {!shortenerAvailable ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                </div>
                                <p className="text-sm text-[#666] mb-1">Shortener service is offline</p>
                                <p className="text-xs text-[#444]">Start the shortener service to generate external short URLs</p>
                            </div>
                        ) : (
                            <>
                                {/* Provider selection */}
                                <div className="mb-5">
                                    <label className="text-xs text-[#555] uppercase tracking-wider font-medium mb-3 block">Provider</label>
                                    <div className="flex gap-2">
                                        {PROVIDER_OPTIONS.map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setSelectedProvider(p.value)}
                                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${selectedProvider === p.value
                                                    ? 'bg-[#00C853]/15 text-[#00C853] ring-1 ring-[#00C853]/30'
                                                    : ''
                                                    }`}
                                            >
                                                <span className="mr-2">{p.icon}</span>
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate button */}
                                <button
                                    onClick={handleShortenUrl}
                                    disabled={shortening}
                                    className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${shortening
                                        ? 'bg-[#222] text-[#666] cursor-wait'
                                        : 'bg-gradient-to-r from-[#00C853] to-[#00E676] text-black hover:shadow-[0_0_24px_rgba(0,200,83,0.2)] hover:scale-[1.005] active:scale-[0.995]'
                                        }`}
                                >
                                    {shortening ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="w-4 h-4 border-2 border-[#666] border-t-transparent rounded-full animate-spin" />
                                            Generating...
                                        </span>
                                    ) : (
                                        `Shorten with ${PROVIDER_OPTIONS.find(p => p.value === selectedProvider)?.label}`
                                    )}
                                </button>

                                {/* Error message */}
                                {shortenError && (
                                    <div className="mt-4 flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <p className="text-red-400 text-sm">{shortenError}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* ─── Section 4: How It Works ─── */}
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 bg-[#00C853]/15 rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold">How It Works</h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            {
                                step: '1',
                                title: 'Share',
                                desc: 'Copy your hub URL or generate an external short link and share it anywhere.',
                            },
                            {
                                step: '2',
                                title: 'Route',
                                desc: 'Visitors are routed through your hub rules — by device, location, time, and priority.',
                            },
                            {
                                step: '3',
                                title: 'Track',
                                desc: 'Every click and impression is tracked with detailed analytics and insights.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="rounded-xl p-5" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
                                <div className="w-7 h-7 bg-[#00C853]/10 rounded-lg flex items-center justify-center mb-3">
                                    <span className="text-xs font-bold text-[#00C853]">{item.step}</span>
                                </div>
                                <h4 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{item.title}</h4>
                                <p className="text-xs text-[#555] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
