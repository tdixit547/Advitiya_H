// ============================================
// SMART LINK HUB - Premium Landing Page
// Glassmorphism + Animated Gradients + Floating Orbs
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// ─── Animated Counter ───
function AnimCount({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, visible]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

// ─── Feature Card ───
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl p-6 transition-all duration-500 hover:translate-y-[-4px]"
      style={{
        background: 'linear-gradient(135deg, rgba(17,17,17,0.8) 0%, rgba(10,10,10,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,200,83,0.08) 0%, transparent 70%)' }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300"
          style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.12)' }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Step Card ───
function StepCard({ number, title, desc, delay }: { number: string; title: string; desc: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(0,200,83,0.1) 0%, rgba(0,200,83,0.02) 100%)',
          border: '1px solid rgba(0,200,83,0.15)',
          color: '#00C853',
        }}
      >
        {number}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{desc}</p>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen relative overflow-hidden noise-overlay" style={{ background: '#000' }}>

      {/* ─── Animated Background Orbs ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[700px] h-[700px] rounded-full animate-glow-pulse"
          style={{
            top: '-15%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.08) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-float-slow"
          style={{
            bottom: '-10%',
            right: '-8%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.06) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full animate-float"
          style={{
            top: '40%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.04) 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ─── Navigation ─── */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.15)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Smart Link Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #00C853, #00E676)',
              color: '#000',
              boxShadow: '0 2px 12px rgba(0,200,83,0.2)',
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{
            border: '1px solid rgba(0,200,83,0.15)',
            color: '#00C853',
            background: 'rgba(0,200,83,0.04)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
          Built for Advitiya 2026 Hackathon
        </div>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-7 leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-white">One link.</span>
          <br />
          <span className="gradient-text">Infinite reach.</span>
        </h1>

        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: '#888' }}
        >
          Route visitors to the right content based on their device, location, and time.
          Track engagement with real-time analytics.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Link
            href="/register"
            className="group px-8 py-4 font-semibold rounded-2xl transition-all text-base flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #00C853, #00E676)',
              color: '#000',
              boxShadow: '0 4px 32px rgba(0,200,83,0.25)',
            }}
          >
            Create Your Hub
            <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 font-semibold rounded-2xl transition-all text-base hover:scale-[1.02] active:scale-[0.97]"
            style={{
              border: '1px solid rgba(0,200,83,0.25)',
              color: '#00C853',
              background: 'rgba(0,200,83,0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ─── Terminal Preview ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-28">
        <div
          className={`rounded-2xl overflow-hidden transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(17,17,17,0.6) 0%, rgba(10,10,10,0.8) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,200,83,0.04)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="text-xs ml-3 font-mono" style={{ color: '#555' }}>smart-link-hub — zsh</span>
          </div>
          {/* Terminal content */}
          <div className="p-6 font-mono text-sm leading-7" style={{ color: '#888' }}>
            <div><span style={{ color: '#00C853' }}>$</span> hub create <span className="text-white">my-portfolio</span></div>
            <div style={{ color: '#444' }}>  Creating hub with smart routing...</div>
            <div style={{ color: '#444' }}>  Generating short URL: <span className="text-blue-400">slh.io/r/x7k2m9</span></div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device mobile --target &quot;app-store-link&quot;</span></div>
            <div style={{ color: '#444' }}>  Rule added: Mobile → App Store</div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device desktop --target &quot;web-portfolio&quot;</span></div>
            <div style={{ color: '#444' }}>  Rule added: Desktop → Web Portfolio</div>
            <div className="mt-2"><span style={{ color: '#00C853' }}>$</span> hub stats</div>
            <div className="text-white mt-1">  Views: <span className="text-[#00C853]">8,420</span>  Clicks: <span className="text-[#00C853]">2,106</span>  CTR: <span className="text-[#00C853]">25.0%</span></div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#00C853' }}>How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Three steps to smarter links
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <StepCard number="01" title="Create a Hub" desc="Set up your smart link hub in seconds. Give it a name and default URL." delay={0} />
          <StepCard number="02" title="Add Rules" desc="Define routing rules based on device type, location, time, and more." delay={100} />
          <StepCard number="03" title="Share & Track" desc="Share a single link. Track clicks, CTR, and engagement in real-time." delay={200} />
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#00C853' }}>Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Intelligent Routing Engine
          </h2>
          <p className="text-[#888] max-w-xl mx-auto">
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
            <FeatureCard key={feat.title} icon={feat.icon} title={feat.title} desc={feat.desc} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="relative z-10 py-20 mb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: 12000, suffix: '+', label: 'Links Routed' },
            { value: 98, suffix: '%', label: 'Uptime' },
            { value: 45, suffix: 'ms', label: 'Avg Latency' },
            { value: 180, suffix: '+', label: 'Countries' },
          ].map(stat => (
            <div key={stat.label} className="group">
              <div className="text-3xl md:text-5xl font-extrabold text-white tabular-nums mb-2 tracking-tight">
                <AnimCount end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium" style={{ color: '#555' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
          Ready to build smarter links?
        </h2>
        <p className="text-[#888] mb-10 max-w-lg mx-auto text-lg">
          Set up your hub in under a minute. No credit card, no BS.
        </p>
        <Link
          href="/register"
          className="group inline-flex items-center gap-2.5 px-10 py-4 font-semibold rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.97] text-base"
          style={{
            background: 'linear-gradient(135deg, #00C853, #00E676)',
            color: '#000',
            boxShadow: '0 4px 40px rgba(0,200,83,0.25)',
          }}
        >
          Get Started — Free
          <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </Link>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 py-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-sm" style={{ color: '#444' }}>
          Built for <span className="font-medium text-[#00C853]">Advitiya 2026</span> Hackathon
        </p>
      </footer>
    </main>
  );
}
