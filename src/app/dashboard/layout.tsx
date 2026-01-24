// ============================================
// SMART LINK HUB - Dashboard Layout
// ============================================

import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-[#00FF00]">Smart Link Hub</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-[#00FF00] transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/links"
              className="text-gray-400 hover:text-[#00FF00] transition-colors"
            >
              Links
            </Link>
            <Link
              href="/dashboard/engagement"
              className="text-gray-400 hover:text-[#00FF00] transition-colors"
            >
              Engagement
            </Link>
            <Link
              href="/demo"
              target="_blank"
              className="px-4 py-2 rounded-lg bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30 hover:bg-[#00FF00]/20 transition-all"
            >
              View Hub →
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
