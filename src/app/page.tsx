// ============================================
// SMART LINK HUB - Home Page
// Premium landing with micro-animations
// ============================================

'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated background gradient */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 200, 83, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Hero Section */}
      <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
        {/* Animated title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span
            className="inline-block text-[#00C853] animate-fade-in-up"
            style={{ textShadow: '0 0 40px rgba(0, 200, 83, 0.3)' }}
          >
            Smart
          </span>
          <span
            className="inline-block text-[#E6E6E6] animate-fade-in-up stagger-1"
          >
            {' '}Link Hub
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-[#9A9A9A] animate-fade-in-up stagger-2"
        >
          One link to rule them all. Show the right links to the right people at
          the right time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <Link
            href="/login"
            className="px-8 py-4 font-bold rounded-xl transition-all duration-200 bg-[#00C853] text-black hover:bg-[#00E676] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,200,83,0.4)] active:scale-[0.98]"
          >
            Get Started →
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 border-2 border-[#00C853] text-[#00C853] font-bold rounded-xl transition-all duration-200 bg-[#00C853]/5 hover:bg-[#00C853]/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </Link>
        </div>

        {/* Decorative element */}
        <div className="mt-16 animate-fade-in-up stagger-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-[#333] text-sm text-[#9A9A9A]">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            Built for Advitiya 2026 Hackathon
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">
          <span className="text-[#00C853]">Smart</span>
          <span className="text-[#E6E6E6]"> Features</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="⏰"
            title="Time-Based Rules"
            description="Show meeting links only during work hours. Hide promotions on weekends."
            delay={1}
          />
          <FeatureCard
            icon="📱"
            title="Device Detection"
            description="Show App Store link to iOS users, Play Store to Android users."
            delay={2}
          />
          <FeatureCard
            icon="🌍"
            title="Geo-Targeting"
            description="Show region-specific links based on visitor location."
            delay={3}
          />
          <FeatureCard
            icon="📈"
            title="Performance Sorting"
            description="Automatically move popular links to the top."
            delay={4}
          />
          <FeatureCard
            icon="📊"
            title="Real-Time Analytics"
            description="Track views, clicks, and visitor insights."
            delay={5}
          />
          <FeatureCard
            icon="🎨"
            title="Custom Themes"
            description="Match your brand with customizable themes."
            delay={6}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#222] py-8 text-center text-[#9A9A9A]">
        <p>
          Powered by{' '}
          <span className="font-semibold text-[#00C853]">Smart Link Hub</span>
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <div
      className={`p-6 rounded-xl bg-[#111] border border-[#222] transition-all duration-300 group animate-fade-in-up stagger-${delay} hover:border-[#00C853]/50 hover:shadow-[0_8px_30px_rgba(0,200,83,0.1)] hover:-translate-y-1`}
    >
      <span className="text-4xl mb-4 block transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,200,83,0.5)]">
        {icon}
      </span>
      <h3 className="text-xl font-semibold mb-2 text-[#E6E6E6]">{title}</h3>
      <p className="text-[#9A9A9A] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
