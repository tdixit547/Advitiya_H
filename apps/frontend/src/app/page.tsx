// ============================================
// SMART LINK HUB - Premium Landing Page
// Redesigned with animated elements, no emojis
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Counter animation component
function AnimCount({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#000' }}>

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #00C853 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #00C853 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,200,83,0.15)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg">Smart Link Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#9A9A9A] hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-5 py-2 rounded-lg transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#00C853', color: '#000' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8 border"
          style={{
            borderColor: 'rgba(0,200,83,0.2)',
            color: '#00C853',
            background: 'rgba(0,200,83,0.05)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
          Built for Advitiya 2026 Hackathon
        </div>

        <h1
          className={`text-5xl md:text-7xl font-bold mb-6 leading-[1.1] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="text-white">One link.</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #00C853 0%, #00E676 50%, #69F0AE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Infinite possibilities.
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ color: '#9A9A9A' }}
        >
          Route visitors to the right content based on their device, location, and time.
          Track engagement with real-time analytics.
        </p>

        {/* CTA */}
        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Link
            href="/register"
            className="px-8 py-3.5 font-semibold rounded-xl transition-all hover:scale-[1.03] text-base flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#00C853',
              color: '#000',
              boxShadow: '0 0 40px rgba(0,200,83,0.2)',
            }}
          >
            Create Your Hub
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 font-semibold rounded-xl transition-all hover:scale-[1.02] border text-base"
            style={{
              borderColor: 'rgba(0,200,83,0.3)',
              color: '#00C853',
              background: 'rgba(0,200,83,0.03)',
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Terminal Preview */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-24">
        <div
          className={`rounded-xl overflow-hidden border transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ borderColor: '#222', background: '#0a0a0a' }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#1a1a1a' }}>
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="text-xs ml-3" style={{ color: '#666' }}>smart-link-hub — terminal</span>
          </div>
          {/* Terminal content */}
          <div className="p-5 font-mono text-sm leading-7" style={{ color: '#9A9A9A' }}>
            <div><span style={{ color: '#00C853' }}>$</span> hub create <span className="text-white">my-portfolio</span></div>
            <div style={{ color: '#555' }}>  Creating hub with smart routing...</div>
            <div style={{ color: '#555' }}>  Generating short URL: <span className="text-blue-400">slh.io/r/x7k2m9</span></div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device mobile --target &quot;app-store-link&quot;</span></div>
            <div style={{ color: '#555' }}>  Rule added: Mobile → App Store</div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device desktop --target &quot;web-portfolio&quot;</span></div>
            <div style={{ color: '#555' }}>  Rule added: Desktop → Web Portfolio</div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub stats</div>
            <div className="text-white mt-1">  Views: <span className="text-[#00C853]">8,420</span>  Clicks: <span className="text-[#00C853]">2,106</span>  CTR: <span className="text-[#00C853]">25.0%</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Intelligent Routing
          </h2>
          <p className="text-[#9A9A9A] max-w-xl mx-auto">
            Show the right link to the right person at the right time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: 'Time-Based Rules',
              desc: 'Show meeting links only during work hours. Schedule promotions for peak times.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              ),
              title: 'Device Detection',
              desc: 'Route iOS users to the App Store, Android to Play Store — automatically.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              title: 'Geo-Targeting',
              desc: 'Show region-specific links based on visitor location. Global reach, local content.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
              ),
              title: 'Performance Sorting',
              desc: 'AI-powered link ranking moves popular links to the top automatically.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              ),
              title: 'Real-Time Analytics',
              desc: 'Track impressions, clicks, CTR, dwell time, rage clicks, and engagement scores.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: 'Built-in QR Codes',
              desc: 'Generate scannable QR codes with custom themes. Download as PNG or SVG.',
            },
          ].map((feat, i) => (
            <div
              key={feat.title}
              className={`rounded-xl p-6 border group transition-all duration-500 hover:border-[#00C853]/40 hover:translate-y-[-2px] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{
                background: '#0a0a0a',
                borderColor: '#1a1a1a',
                transitionDelay: `${400 + i * 80}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(0,200,83,0.08)' }}
              >
                {feat.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-t border-b py-16 mb-20" style={{ borderColor: '#111' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 12000, suffix: '+', label: 'Links Routed' },
            { value: 98, suffix: '%', label: 'Uptime' },
            { value: 45, suffix: 'ms', label: 'Avg Latency' },
            { value: 180, suffix: '+', label: 'Countries' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-bold text-white tabular-nums mb-1">
                {mounted ? <AnimCount end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to build smarter links?
        </h2>
        <p className="text-[#9A9A9A] mb-8 max-w-lg mx-auto">
          Set up your hub in under a minute. No credit card, no BS.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all hover:scale-[1.03] text-base"
          style={{
            backgroundColor: '#00C853',
            color: '#000',
            boxShadow: '0 0 40px rgba(0,200,83,0.2)',
          }}
        >
          Get Started — Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 text-center" style={{ borderColor: '#111' }}>
        <p className="text-sm" style={{ color: '#555' }}>
          Built for <span className="font-medium text-[#00C853]">Advitiya 2026</span> Hackathon
        </p>
      </footer>
    </main>
  );
}
