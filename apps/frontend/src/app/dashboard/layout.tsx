// ============================================
// SMART LINK HUB - Dashboard Layout
// Clean navigation structure
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/links', label: 'Links', icon: '🔗' },
    { href: '/dashboard/rules', label: 'Rules', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-[#00FF00]">Smart Link Hub</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isActive
                    ? 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="w-px h-6 bg-gray-700 mx-2" />

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
      <main>
        {children}
      </main>
    </div>
  );
}

