// ============================================
// SMART LINK HUB - Public Hub Page
// Dynamic route: /[slug]
// ============================================

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Hub, Link, LinkWithRules, LinkRule } from '@/types';
import { evaluateRules } from '@/lib/rule-engine';
import { getVisitorContext } from '@/lib/visitor-context';
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

const DEMO_LINKS: LinkWithRules[] = [
  {
    id: 1,
    hub_id: 1,
    title: '🌐 My Website',
    url: 'https://example.com',
    icon: null,
    priority: 100,
    click_count: 150,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    hub_id: 1,
    title: '💻 GitHub',
    url: 'https://github.com',
    icon: null,
    priority: 90,
    click_count: 120,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    hub_id: 1,
    title: '💼 LinkedIn',
    url: 'https://linkedin.com',
    icon: null,
    priority: 80,
    click_count: 100,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    hub_id: 1,
    title: '📅 Join Meeting (9AM-5PM)',
    url: 'https://meet.google.com',
    icon: null,
    priority: 70,
    click_count: 50,
    is_active: true,
    rules: [
      {
        id: 1,
        link_id: 4,
        rule_type: 'TIME',
        conditions: { startHour: 9, endHour: 17 },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    hub_id: 1,
    title: '📱 Download iOS App',
    url: 'https://apps.apple.com',
    icon: null,
    priority: 60,
    click_count: 40,
    is_active: true,
    rules: [
      {
        id: 2,
        link_id: 5,
        rule_type: 'DEVICE',
        conditions: { device: 'mobile', os: 'ios' },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    hub_id: 1,
    title: '🤖 Download Android App',
    url: 'https://play.google.com',
    icon: null,
    priority: 60,
    click_count: 35,
    is_active: true,
    rules: [
      {
        id: 3,
        link_id: 6,
        rule_type: 'DEVICE',
        conditions: { device: 'mobile', os: 'android' },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    hub_id: 1,
    title: '🇮🇳 Amazon India',
    url: 'https://amazon.in',
    icon: null,
    priority: 50,
    click_count: 25,
    is_active: true,
    rules: [
      {
        id: 4,
        link_id: 7,
        rule_type: 'LOCATION',
        conditions: { country: 'IN' },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    hub_id: 1,
    title: '🇺🇸 Amazon US',
    url: 'https://amazon.com',
    icon: null,
    priority: 50,
    click_count: 20,
    is_active: true,
    rules: [
      {
        id: 5,
        link_id: 8,
        rule_type: 'LOCATION',
        conditions: { country: 'US' },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

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
  // TODO: Replace with actual database query
  if (slug === 'demo') {
    return DEMO_HUB;
  }
  return null;
}

// Fetch links with rules (demo implementation)
async function getLinksWithRules(hubId: number): Promise<LinkWithRules[]> {
  // TODO: Replace with actual database query
  if (hubId === 1) {
    return DEMO_LINKS;
  }
  return [];
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
  console.log('Page View:', {
    hubId,
    visitorCountry,
    visitorDevice,
    userAgent: userAgent.substring(0, 50),
    referrer,
  });
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
