// ============================================
// SMART LINK HUB - Public Hub Page
// Dynamic route: /[slug]
// ============================================

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Hub, Link, LinkWithRules } from '@/types';
import { evaluateRules } from '@/lib/rule-engine';
import { getVisitorContext } from '@/lib/visitor-context';
import { getLinksWithRules as fetchLinksFromStorage } from '@/lib/storage';
import LinkButton from '@/components/LinkButton';

// Demo data for initial testing (replace with DB queries later)
const DEMO_HUB: Hub = {
  id: 1,
  user_id: 1,
  slug: 'demo',
  title: 'Demo Hub',
  bio: 'Welcome to my Smart Link Hub! 🚀',
  avatar_url: null,
  theme_config: {
    bg: '#000000',
    accent: '#00FF00',
    textColor: '#FFFFFF',
  },
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = await getHub(slug);

  if (!hub) {
    return {
      title: 'Hub Not Found',
    };
  }

  return {
    title: `${hub.title} | Smart Link Hub`,
    description: hub.bio || `Check out ${hub.title}'s links`,
    openGraph: {
      title: hub.title,
      description: hub.bio || undefined,
      type: 'profile',
    },
  };
}

// Fetch hub data (demo implementation)
async function getHub(slug: string): Promise<Hub | null> {
  // Allow accessing the demo hub via 'demo' or '1'
  if (slug === 'demo' || slug === '1') {
    return DEMO_HUB;
  }
  return null;
}

// Fetch links with rules (using file storage)
async function getLinksWithRules(hubId: number): Promise<LinkWithRules[]> {
  try {
    const allLinks = await fetchLinksFromStorage();
    return allLinks
      .filter((l) => l.hub_id === hubId)
      .sort((a, b) => b.priority - a.priority);
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

// Track page view (demo implementation)
async function trackPageView(
  hubId: number,
  visitorCountry: string | null,
  visitorDevice: string,
  userAgent: string,
  referrer: string | null
): Promise<void> {
  // TODO: Replace with actual database insert
  // console.log('Page View:', { hubId, visitorCountry, ... }); 
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch hub data
  const hub = await getHub(slug);
  if (!hub) {
    notFound();
  }

  // Get visitor context from headers
  const headersList = await headers();
  const context = await getVisitorContext(headersList);

  // Fetch links with their rules
  const linksWithRules = await getLinksWithRules(hub.id);

  // Apply smart rules to filter links
  const filteredLinks = evaluateRules(linksWithRules, context);

  // Track page view (async, don't wait)
  trackPageView(
    hub.id,
    context.country,
    context.device,
    context.userAgent,
    context.referrer
  );

  const { bg, accent, textColor } = hub.theme_config;

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Profile Section */}
      <div className="text-center mb-8 animate-fade-in">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
          style={{
            backgroundColor: `${accent}20`,
            border: `3px solid ${accent}`,
            boxShadow: `0 0 20px ${accent}40`,
          }}
        >
          {hub.title.charAt(0).toUpperCase()}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: accent }}
        >
          {hub.title}
        </h1>

        {/* Bio */}
        {hub.bio && (
          <p className="text-gray-400 max-w-md mx-auto">{hub.bio}</p>
        )}
      </div>

      {/* Links Section */}
      <div className="w-full max-w-md space-y-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link, index) => (
            <LinkButton
              key={link.id}
              link={link}
              accent={accent}
              index={index}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No links available</p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>
          Powered by{' '}
          <span style={{ color: accent }} className="font-semibold">
            Smart Link Hub
          </span>
        </p>
      </footer>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 rounded-lg text-xs font-mono" style={{ backgroundColor: '#111' }}>
          <p className="text-gray-500 mb-2">Debug Info:</p>
          <p>Device: {context.device}</p>
          <p>OS: {context.os}</p>
          <p>Country: {context.country || 'Unknown'}</p>
          <p>Hour: {context.currentHour}</p>
          <p>Day: {context.currentDay}</p>
          <p>Total Links: {linksWithRules.length}</p>
          <p>Filtered Links: {filteredLinks.length}</p>
        </div>
      )}
    </main>
  );
}
