'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-[#222]">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-lg text-[#00C853]">Smart Link Hub</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard/analytics"
                className={`text-sm font-medium transition-colors ${pathname === '/dashboard/analytics'
                    ? 'text-white'
                    : 'text-[#9A9A9A] hover:text-white'
                  }`}
              >
                Analytics
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${pathname === '/dashboard'
                    ? 'text-white'
                    : 'text-[#9A9A9A] hover:text-white'
                  }`}
              >
                Links
              </Link>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#00C853] text-black font-bold text-sm rounded-lg hover:bg-[#00E676] transition-colors"
              >
                View Hub →
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
