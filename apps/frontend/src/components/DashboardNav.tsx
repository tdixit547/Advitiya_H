// ============================================
// SMART LINK HUB - Dashboard Navigation Bar
// Persistent top bar with branding & back link
// ============================================

'use client';

import Link from 'next/link';

export default function DashboardNav() {
  return (
    <nav className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity"
        >
          {/* Lightning icon */}
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00C853]/15">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00C853"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <span className="font-bold text-sm tracking-wide">Smart Link Hub</span>
        </Link>
      </div>
    </nav>
  );
}
