'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode';

// ==================== Types ====================

type QRSize = 'small' | 'medium' | 'large';
type QRTheme = 'light' | 'dark';

const SIZE_MAP: Record<QRSize, number> = {
    small: 200,
    medium: 300,
    large: 400,
};

// ==================== QRCode Display Component ====================

interface QRCodeDisplayProps {
    value: string;
    size: number;
    fgColor: string;
    bgColor: string;
}

function QRCodeDisplay({ value, size, fgColor, bgColor }: QRCodeDisplayProps) {
    const [qrSrc, setQrSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!value) return;
        
        setLoading(true);
        // Generate QR code locally
        QRCode.toDataURL(value, {
            width: size,
            margin: 1,
            color: {
                dark: fgColor,
                light: bgColor,
            },
            errorCorrectionLevel: 'M',
        })
            .then((url) => {
                setQrSrc(url);
                setLoading(false);
            })
            .catch((err) => {
                console.error('QR Generation failed:', err);
                setLoading(false);
            });
    }, [value, size, fgColor, bgColor]);

    if (loading) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg"
                style={{ width: size, height: size }}
            >
                <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="qr-code-container">
            {qrSrc && (
                <img
                    src={qrSrc}
                    alt="QR Code"
                    width={size}
                    height={size}
                    style={{
                        borderRadius: '8px'
                    }}
                />
            )}
        </div>
    );
}

// ==================== Main Component ====================

export default function QRCodePage() {
    const params = useParams();
    const router = useRouter();
    const hubId = params.hubId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hubData, setHubData] = useState<{ slug: string; short_code: string } | null>(null);

    const [qrSize, setQRSize] = useState<QRSize>('medium');
    const [qrTheme, setQRTheme] = useState<QRTheme>('dark');
    const [copied, setCopied] = useState(false);

    // Fetch hub data
    useEffect(() => {
        const fetchHub = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/hubs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                // Handle both array response and object with hubs property
                const hubList = Array.isArray(data) ? data : (data.hubs || []);
                const hub = hubList.find((h: any) => h.hub_id === hubId);
                if (hub) {
                    setHubData({ slug: hub.slug, short_code: hub.short_code });
                } else {
                    setError('Hub not found');
                }
            } catch (err) {
                console.error('Hub fetch error:', err);
                setError('Failed to load hub data');
            } finally {
                setLoading(false);
            }
        };
        fetchHub();
    }, [hubId]);

    // Generate QR URL
    // Use window.location.origin only on client side
    const [baseUrl, setBaseUrl] = useState('');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    const fullUrl = hubData ? `${baseUrl}/${hubData.slug}` : '';
    const shortUrl = hubData?.short_code ? `${baseUrl}/r/${hubData.short_code}` : '';

    const size = SIZE_MAP[qrSize];
    const fgColor = qrTheme === 'dark' ? '#000000' : '#FFFFFF';
    const bgColor = qrTheme === 'dark' ? '#FFFFFF' : '#000000';
    const qrValue = shortUrl || fullUrl;

    // Download as PNG
    const downloadPNG = useCallback(async () => {
        if (!qrValue) return;

        try {
            // Generate high-res for download
            const url = await QRCode.toDataURL(qrValue, {
                width: size * 2, // 2x size for better quality
                margin: 1,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
            });
            
            const link = document.createElement('a');
            link.download = `qr-${hubData?.slug || hubId}.png`;
            link.href = url;
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to generate PNG download');
        }
    }, [qrValue, hubData, hubId, size, fgColor, bgColor]);

    // Download as SVG
    const downloadSVG = useCallback(async () => {
        if (!qrValue) return;

        try {
            const svgString = await QRCode.toString(qrValue, {
                type: 'svg',
                width: size,
                margin: 1,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
            });
            
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `qr-${hubData?.slug || hubId}.svg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to generate SVG download');
        }
    }, [qrValue, hubData, hubId, size, fgColor, bgColor]);

    // Copy URL to clipboard
    const copyUrl = useCallback(async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <h1 className="text-xl font-bold text-white mb-2">Error</h1>
                    <p className="text-[#888] mb-4">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#00C853] text-black rounded-lg font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#333]">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/hub/${hubId}/tools`)}
                            className="text-[#888] hover:text-white transition-colors"
                        >
                            ← Back to Tools
                        </button>
                        <h1 className="text-xl font-bold">
                            📱 QR Code: <span className="text-[#00C853]">/{hubData?.slug}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* QR Code Display */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`p-8 rounded-2xl ${qrTheme === 'dark' ? 'bg-white' : 'bg-black border border-[#333]'}`}
                            style={{ width: size + 64, height: size + 64 }}
                        >
                            <QRCodeDisplay
                                value={qrValue}
                                size={size}
                                fgColor={fgColor}
                                bgColor={bgColor}
                            />
                        </div>

                        {/* Download Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={downloadPNG}
                                className="px-6 py-3 bg-[#00C853] text-black rounded-xl font-medium hover:bg-[#00E676] transition-colors"
                            >
                                ⬇️ Download PNG
                            </button>
                            <button
                                onClick={downloadSVG}
                                className="px-6 py-3 bg-[#222] text-white rounded-xl font-medium hover:bg-[#333] transition-colors border border-[#444]"
                            >
                                ⬇️ Download SVG
                            </button>
                        </div>
                    </div>

                    {/* Controls & Info */}
                    <div className="space-y-8">
                        {/* URLs */}
                        <section>
                            <h2 className="text-lg font-semibold text-[#888] mb-4">URLs</h2>
                            <div className="space-y-4">
                                {/* Full URL */}
                                <div className="bg-[#111] border border-[#333] rounded-xl p-4">
                                    <div className="text-xs text-[#666] mb-2">Full URL</div>
                                    <div className="flex items-center gap-3">
                                        <code className="flex-1 text-[#00C853] truncate">{fullUrl || 'Loading...'}</code>
                                        <button
                                            onClick={() => copyUrl(fullUrl)}
                                            className="px-3 py-1 bg-[#222] rounded-lg text-sm hover:bg-[#333]"
                                            disabled={!fullUrl}
                                        >
                                            {copied ? '✓ Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                {/* Short URL */}
                                {shortUrl && (
                                    <div className="bg-[#111] border border-[#00C853]/30 rounded-xl p-4">
                                        <div className="text-xs text-[#00C853] mb-2">Short URL</div>
                                        <div className="flex items-center gap-3">
                                            <code className="flex-1 text-[#00C853] font-bold">{shortUrl}</code>
                                            <button
                                                onClick={() => copyUrl(shortUrl)}
                                                className="px-3 py-1 bg-[#00C853] text-black rounded-lg text-sm font-medium hover:bg-[#00E676]"
                                            >
                                                {copied ? '✓ Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Size Selector */}
                        <section>
                            <h2 className="text-lg font-semibold text-[#888] mb-4">Size</h2>
                            <div className="flex gap-3">
                                {(['small', 'medium', 'large'] as QRSize[]).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQRSize(s)}
                                        className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${qrSize === s
                                            ? 'bg-[#00C853] text-black'
                                            : 'bg-[#222] text-[#888] hover:bg-[#333]'
                                            }`}
                                    >
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                        <div className="text-xs opacity-75">{SIZE_MAP[s]}px</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Theme Selector */}
                        <section>
                            <h2 className="text-lg font-semibold text-[#888] mb-4">Theme</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setQRTheme('dark')}
                                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${qrTheme === 'dark'
                                        ? 'bg-white text-black'
                                        : 'bg-[#222] text-[#888] hover:bg-[#333]'
                                        }`}
                                >
                                    ⬜ Light Background
                                </button>
                                <button
                                    onClick={() => setQRTheme('light')}
                                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${qrTheme === 'light'
                                        ? 'bg-black text-white border border-white'
                                        : 'bg-[#222] text-[#888] hover:bg-[#333]'
                                        }`}
                                >
                                    ⬛ Dark Background
                                </button>
                            </div>
                        </section>

                        {/* Info */}
                        <section className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 text-sm text-[#666]">
                            <p className="mb-2">
                                <strong className="text-[#888]">💡 Tip:</strong> The QR code always points to your hub&apos;s current URL.
                            </p>
                            <p>
                                Scanning this QR will redirect visitors through your smart link, preserving all analytics and routing rules.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
