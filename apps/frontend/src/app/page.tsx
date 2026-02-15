// ============================================
// SMART LINK HUB - Premium Landing Page
// Fully immersive with particles, typewriter,
// scroll reveals, magnetic buttons, parallax
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TypewriterText from '@/components/animations/TypewriterText';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import MagneticButton from '@/components/animations/MagneticButton';
import GradientMesh from '@/components/animations/GradientMesh';

// ─── Parallax Section ───
function ParallaxSection({ children, speed = 0.3, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.1s linear' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Animated Logo Glow ───
function AnimatedLogo() {
  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10"
        style={{ background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.2)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-xl animate-ping"
        style={{ background: 'rgba(0,200,83,0.05)', animationDuration: '3s' }}
      />
    </div>
  );
}

// ─── Feature Card with Tilt ───
function TiltCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <ScrollReveal variant="fadeUp" delay={delay} duration={600}>
      <div
        ref={cardRef}
        className="group relative rounded-2xl p-6 h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))',
          border: '1px solid rgba(255,255,255,0.06)',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at top right, rgba(0,200,83,0.1) 0%, transparent 70%)',
            borderTopRightRadius: '1rem',
          }}
        />
        <div className="relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.12)' }}
          >
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{desc}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── Animated Terminal ───
function AnimatedTerminal() {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const delays = [0, 400, 800, 1400, 1800, 2200, 2800, 3200, 3600, 4200, 4600];
    delays.forEach((delay, i) => {
      timers.push(setTimeout(() => setLines(i + 1), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const lineStyle = (index: number) => ({
    opacity: lines > index ? 1 : 0,
    transform: lines > index ? 'translateY(0)' : 'translateY(8px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(17,17,17,0.6), rgba(10,10,10,0.8))',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,200,83,0.04)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition-all cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-125 transition-all cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-125 transition-all cursor-pointer" />
        <span className="text-xs ml-3 font-mono" style={{ color: '#555' }}>smart-link-hub — zsh</span>
      </div>
      {/* Terminal content — each line animates in */}
      <div className="p-6 font-mono text-sm leading-7" style={{ color: '#888' }}>
        <div style={lineStyle(0)}><span style={{ color: '#00C853' }}>$</span> hub create <span className="text-white">my-portfolio</span></div>
        <div style={lineStyle(1)}><span style={{ color: '#444' }}>  ✦ Creating hub with smart routing...</span></div>
        <div style={lineStyle(2)}><span style={{ color: '#444' }}>  ✦ Generating short URL: <span className="text-blue-400">slh.io/r/x7k2m9</span></span></div>
        <div className="mt-2" style={lineStyle(3)}><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device mobile --target &quot;app-store-link&quot;</span></div>
        <div style={lineStyle(4)}><span style={{ color: '#28c840' }}>  ✓ Rule added: Mobile → App Store</span></div>
        <div className="mt-2" style={lineStyle(5)}><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--device desktop --target &quot;web-portfolio&quot;</span></div>
        <div style={lineStyle(6)}><span style={{ color: '#28c840' }}>  ✓ Rule added: Desktop → Web Portfolio</span></div>
        <div className="mt-2" style={lineStyle(7)}><span style={{ color: '#00C853' }}>$</span> hub add-rule <span className="text-white">--geo IN --target &quot;india-page&quot;</span></div>
        <div style={lineStyle(8)}><span style={{ color: '#28c840' }}>  ✓ Rule added: India → India Page</span></div>
        <div className="mt-2" style={lineStyle(9)}><span style={{ color: '#00C853' }}>$</span> hub stats</div>
        <div className="text-white mt-1" style={lineStyle(10)}>
          {'  '}Views: <span className="text-[#00C853] font-bold">8,420</span>{'  '}Clicks: <span className="text-[#00C853] font-bold">2,106</span>{'  '}CTR: <span className="text-[#00C853] font-bold">25.0%</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen relative overflow-hidden noise-overlay" style={{ background: '#000' }}>
      {/* ─── Gradient Mesh Background ─── */}
      <GradientMesh intensity={0.06} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ─── Navigation ─── */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AnimatedLogo />
          <span className="font-bold text-white text-lg tracking-tight">Smart Link Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Sign In
          </Link>
          <MagneticButton strength={0.25}>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #00C853, #00E676)',
                color: '#000',
                boxShadow: '0 2px 12px rgba(0,200,83,0.2)',
              }}
            >
              Get Started
            </Link>
          </MagneticButton>
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
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C853]" />
          </span>
          Built for Advitiya 2026 Hackathon
        </div>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-7 leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="text-white">One link.</span>
          <br />
          <span className="gradient-text">
            <TypewriterText
              phrases={['Infinite reach.', 'Smart routing.', 'Real-time analytics.', 'Global targeting.']}
              typingSpeed={70}
              deletingSpeed={35}
              pauseDuration={2500}
            />
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: '#888' }}
        >
          Route visitors to the right content based on their device, location, and time.
          Track engagement with real-time analytics powered by AI.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <MagneticButton strength={0.2}>
            <Link
              href="/register"
              className="group px-8 py-4 font-semibold rounded-2xl text-base flex items-center justify-center gap-2.5"
              style={{
                background: 'linear-gradient(135deg, #00C853, #00E676)',
                color: '#000',
                boxShadow: '0 4px 32px rgba(0,200,83,0.25)',
              }}
            >
              Create Your Hub
              <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.15}>
            <Link
              href="/login"
              className="px-8 py-4 font-semibold rounded-2xl text-base"
              style={{
                border: '1px solid rgba(0,200,83,0.25)',
                color: '#00C853',
                background: 'rgba(0,200,83,0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Sign In
            </Link>
          </MagneticButton>
        </div>
      </section>

      {/* ─── Animated Terminal Preview ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-32">
        <ScrollReveal variant="scaleUp" duration={800}>
          <ParallaxSection speed={-0.05}>
            <AnimatedTerminal />
          </ParallaxSection>
        </ScrollReveal>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <ScrollReveal variant="blur" duration={600}>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#00C853' }}>How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Three steps to smarter links
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-7 left-[17%] right-[17%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,83,0.15), rgba(0,200,83,0.15), transparent)' }} />

          {[
            { number: '01', title: 'Create a Hub', desc: 'Set up your smart link hub in seconds. Give it a name and a default URL.', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>) },
            { number: '02', title: 'Add Rules', desc: 'Define routing rules based on device type, location, time of day, and more.', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>) },
            { number: '03', title: 'Share & Track', desc: 'Share a single link. Track clicks, CTR, and engagement in real time.', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>) },
          ].map((step, i) => (
            <ScrollReveal key={step.number} variant="fadeUp" delay={i * 150} duration={600}>
              <div className="text-center group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,200,83,0.1), rgba(0,200,83,0.02))',
                    border: '1px solid rgba(0,200,83,0.15)',
                  }}
                >
                  {step.icon}
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: '#00C853', color: '#000' }}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <ScrollReveal variant="blur" duration={600}>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#00C853' }}>Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Intelligent Routing Engine
            </h2>
            <p className="text-[#888] max-w-xl mx-auto">
              Show the right link to the right person at the right time.
            </p>
          </div>
        </ScrollReveal>

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
              title: 'AI Performance Sorting',
              desc: 'Machine learning ranks your links automatically based on click performance.',
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
            <TiltCard key={feat.title} icon={feat.icon} title={feat.title} desc={feat.desc} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <ParallaxSection speed={-0.08}>
        <section className="relative z-10 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: 12000, suffix: '+', label: 'Links Routed' },
              { value: 98, suffix: '%', label: 'Uptime' },
              { value: 45, suffix: 'ms', label: 'Avg Latency' },
              { value: 180, suffix: '+', label: 'Countries' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} variant="fadeUp" delay={i * 100} duration={500}>
                <div className="group">
                  <div className="text-3xl md:text-5xl font-extrabold text-white tabular-nums mb-2 tracking-tight group-hover:text-[#00C853] transition-colors duration-300">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000 + i * 200} />
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#555' }}>{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ParallaxSection>

      {/* ─── Testimonial / Social Proof ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-28">
        <ScrollReveal variant="scaleUp" duration={700}>
          <div
            className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(17,17,17,0.7), rgba(0,200,83,0.03))',
              border: '1px solid rgba(0,200,83,0.1)',
            }}
          >
            {/* Decorative corner gradients */}
            <div className="absolute top-0 left-0 w-40 h-40 opacity-50" style={{ background: 'radial-gradient(circle at top left, rgba(0,200,83,0.06), transparent)' }} />
            <div className="absolute bottom-0 right-0 w-40 h-40 opacity-50" style={{ background: 'radial-gradient(circle at bottom right, rgba(0,200,83,0.06), transparent)' }} />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.12)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </div>
              <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6 max-w-2xl mx-auto">
                &ldquo;Smart Link Hub completely changed how we share links across platforms. One link, infinite possibilities.&rdquo;
              </blockquote>
              <p className="text-sm" style={{ color: '#888' }}>— Advitiya 2026 Hackathon Participant</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-28 text-center">
        <ScrollReveal variant="blur" duration={700}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Ready to build smarter links?
          </h2>
          <p className="text-[#888] mb-10 max-w-lg mx-auto text-lg">
            Set up your hub in under a minute. No credit card, no BS.
          </p>
          <MagneticButton strength={0.2}>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 px-10 py-4 font-semibold rounded-2xl text-base"
              style={{
                background: 'linear-gradient(135deg, #00C853, #00E676)',
                color: '#000',
                boxShadow: '0 4px 40px rgba(0,200,83,0.25)',
              }}
            >
              Get Started — Free
              <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </MagneticButton>
        </ScrollReveal>
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
