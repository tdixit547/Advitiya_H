// ============================================
// SMART LINK HUB - Home Page
// ============================================

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-[#00FF00]">Smart</span> Link Hub
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          One link to rule them all. Show the right links to the right people at
          the right time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demo"
            className="px-8 py-4 bg-[#00FF00] text-black font-bold rounded-xl hover:bg-[#00CC00] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.5)]"
          >
            View Demo Hub →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 border-2 border-[#00FF00] text-[#00FF00] font-bold rounded-xl hover:bg-[#00FF00]/10 transition-all"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-[#00FF00]">Smart</span> Features
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
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>
          Built for{' '}
          <span className="text-[#00FF00] font-semibold">Advitiya 2026</span> Hackathon
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
    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#00FF00]/50 transition-all group">
      <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
