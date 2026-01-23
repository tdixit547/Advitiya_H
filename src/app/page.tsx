// ============================================
// SMART LINK HUB - Home Page
// ============================================

'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <main className="min-h-screen page-bg">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-[var(--accent)]">Smart</span>
          <span style={{ color: 'var(--foreground)' }}> Link Hub</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--foreground-secondary)' }}>
          One link to rule them all. Show the right links to the right people at
          the right time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 font-bold rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#000',
              boxShadow: '0 0 30px var(--focus-ring)'
            }}
          >
            Get Started →
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 border-2 font-bold rounded-xl transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
              backgroundColor: 'rgba(0, 200, 83, 0.05)'
            }}
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-[var(--accent)]">Smart</span>
          <span style={{ color: 'var(--foreground)' }}> Features</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="⏰"
            title="Time-Based Rules"
            description="Show meeting links only during work hours. Hide promotions on weekends."
          />
          <FeatureCard
            icon="📱"
            title="Device Detection"
            description="Show App Store link to iOS users, Play Store to Android users."
          />
          <FeatureCard
            icon="🌍"
            title="Geo-Targeting"
            description="Show region-specific links based on visitor location."
          />
          <FeatureCard
            icon="📈"
            title="Performance Sorting"
            description="Automatically move popular links to the top."
          />
          <FeatureCard
            icon="📊"
            title="Real-Time Analytics"
            description="Track views, clicks, and visitor insights."
          />
          <FeatureCard
            icon="🎨"
            title="Custom Themes"
            description="Match your brand with customizable themes."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--foreground-secondary)' }}>
        <p>
          Built for{' '}
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>Advitiya 2026</span> Hackathon
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div 
      className="p-6 rounded-xl transition-all group panel"
      style={{ 
        borderColor: 'var(--border)',
      }}
    >
      <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{title}</h3>
      <p style={{ color: 'var(--foreground-secondary)' }}>{description}</p>
    </div>
  );
}

