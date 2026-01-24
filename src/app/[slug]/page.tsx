// ============================================
// SMART LINK HUB - Public Hub Page
// Dynamic route: /[slug]
<<<<<<< Updated upstream
// Now uses backend redirect/debug endpoint
// ============================================

import { notFound, redirect } from 'next/navigation';
=======
// Premium debug view with animations
// ============================================

import { notFound } from 'next/navigation';
>>>>>>> Stashed changes
import { Metadata } from 'next';
import { API_BASE_URL } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Try to fetch hub info for metadata
async function getHubInfo(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}/debug`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const debugInfo = await getHubInfo(slug);

  if (!debugInfo?.hub) {
    return {
      title: 'Hub Not Found',
    };
  }

  return {
    title: `${debugInfo.hub.slug} | Smart Link Hub`,
    description: `Visit ${debugInfo.hub.slug} - powered by Smart Link Hub`,
    openGraph: {
      title: debugInfo.hub.slug,
      type: 'website',
    },
  };
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params;

<<<<<<< Updated upstream
  // For production: The backend handles redirects directly at GET /:slug
  // This page shows a preview/debug view
  
  // Fetch debug info
  const debugInfo = await getHubInfo(slug);
  
=======
  // Fetch debug info
  const debugInfo = await getHubInfo(slug);

>>>>>>> Stashed changes
  if (!debugInfo?.hub) {
    notFound();
  }

  const hub = debugInfo.hub;
  const resolution = debugInfo.resolution;
  const context = debugInfo.context;

  // If there's a resolved variant, show option to redirect
  const finalUrl = resolution?.final_url || hub.default_url;

<<<<<<< Updated upstream
  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ backgroundColor: hub.theme.bg }}
    >
      {/* Profile Section */}
      <div className="text-center mb-8 animate-fade-in">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
          style={{
            backgroundColor: `${hub.theme.accent}20`,
            border: `3px solid ${hub.theme.accent}`,
            boxShadow: `0 0 20px ${hub.theme.accent}40`,
            color: hub.theme.accent,
=======
  // Use the hub's accent color for dynamic theming
  const accentColor = hub.theme.accent || '#00C853';

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{
        backgroundColor: hub.theme.bg,
        '--hub-accent': accentColor,
        '--hub-accent-glow': `${accentColor}40`,
      } as React.CSSProperties}
    >
      {/* Profile Section with staggered animations */}
      <div className="text-center mb-8">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold animate-[scaleIn_0.5s_ease-out] transition-transform hover:scale-105"
          style={{
            backgroundColor: `${accentColor}20`,
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 30px ${accentColor}40`,
            color: accentColor,
            animation: 'scaleIn 0.5s ease-out, pulseGlow 3s ease-in-out infinite',
>>>>>>> Stashed changes
          }}
        >
          {hub.slug.charAt(0).toUpperCase()}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-2"
<<<<<<< Updated upstream
          style={{ color: hub.theme.accent }}
=======
          style={{
            color: accentColor,
            animation: 'fadeInUp 0.5s ease-out 0.1s both',
          }}
>>>>>>> Stashed changes
        >
          {hub.slug}
        </h1>

        {/* Redirect Info */}
<<<<<<< Updated upstream
        <p className="text-gray-400 max-w-md mx-auto mb-4">
          This hub redirects to:
        </p>
        <a
          href={finalUrl}
          className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: hub.theme.accent,
            color: hub.theme.bg,
            boxShadow: `0 0 20px ${hub.theme.accent}40`,
=======
        <p
          className="text-gray-400 max-w-md mx-auto mb-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
        >
          This hub redirects to:
        </p>

        <a
          href={finalUrl}
          className="inline-block px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            backgroundColor: accentColor,
            color: hub.theme.bg,
            boxShadow: `0 0 30px ${accentColor}40`,
            animation: 'fadeInUp 0.5s ease-out 0.3s both',
>>>>>>> Stashed changes
          }}
        >
          Go to {resolution?.resolved_variant?.variant_id || 'Default'} →
        </a>
      </div>

<<<<<<< Updated upstream
      {/* Resolution Details */}
      {resolution && (
        <div className="w-full max-w-md space-y-4">
          <div
            className="p-4 rounded-xl text-sm"
            style={{ backgroundColor: '#111' }}
          >
            <h3 className="font-bold text-white mb-3">Resolution Details</h3>
            <div className="space-y-1 text-gray-400">
              <p>
                <span className="text-gray-500">Tree Found:</span>{' '}
                {resolution.tree_found ? '✅ Yes' : '❌ No'}
              </p>
              {resolution.leaf_variant_ids?.length > 0 && (
                <p>
                  <span className="text-gray-500">Matched Variants:</span>{' '}
                  {resolution.leaf_variant_ids.join(', ')}
                </p>
              )}
              {resolution.resolved_variant && (
                <>
                  <p>
                    <span className="text-gray-500">Selected:</span>{' '}
                    <span style={{ color: hub.theme.accent }}>
                      {resolution.resolved_variant.variant_id}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Target:</span>{' '}
                    <span className="text-white break-all">
                      {resolution.resolved_variant.target_url}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Visitor Context */}
          {context && (
            <div
              className="p-4 rounded-xl text-sm"
              style={{ backgroundColor: '#111' }}
            >
              <h3 className="font-bold text-white mb-3">Visitor Context</h3>
              <div className="space-y-1 text-gray-400">
                <p>
                  <span className="text-gray-500">Device:</span>{' '}
                  {context.device?.type || 'Unknown'}
                </p>
                <p>
                  <span className="text-gray-500">Browser:</span>{' '}
                  {context.device?.browser || 'Unknown'}
                </p>
                <p>
                  <span className="text-gray-500">OS:</span>{' '}
                  {context.device?.os || 'Unknown'}
                </p>
                <p>
                  <span className="text-gray-500">Country:</span>{' '}
                  {context.country || 'Unknown'}
                </p>
              </div>
            </div>
=======
      {/* Resolution Details with staggered cards */}
      {resolution && (
        <div className="w-full max-w-md space-y-4">
          <InfoCard
            title="Resolution Details"
            delay={0.4}
            accentColor={accentColor}
          >
            <InfoRow label="Tree Found" value={resolution.tree_found ? '✅ Yes' : '❌ No'} />
            {resolution.leaf_variant_ids?.length > 0 && (
              <InfoRow label="Matched Variants" value={resolution.leaf_variant_ids.join(', ')} />
            )}
            {resolution.resolved_variant && (
              <>
                <InfoRow
                  label="Selected"
                  value={resolution.resolved_variant.variant_id}
                  highlight
                  accentColor={accentColor}
                />
                <InfoRow
                  label="Target"
                  value={resolution.resolved_variant.target_url}
                  breakAll
                />
              </>
            )}
          </InfoCard>

          {/* Visitor Context */}
          {context && (
            <InfoCard title="Visitor Context" delay={0.5} accentColor={accentColor}>
              <InfoRow label="Device" value={context.device?.type || 'Unknown'} />
              <InfoRow label="Browser" value={context.device?.browser || 'Unknown'} />
              <InfoRow label="OS" value={context.device?.os || 'Unknown'} />
              <InfoRow label="Country" value={context.country || 'Unknown'} />
            </InfoCard>
>>>>>>> Stashed changes
          )}

          {/* Cache Info */}
          {debugInfo.cache && (
<<<<<<< Updated upstream
            <div
              className="p-4 rounded-xl text-sm"
              style={{ backgroundColor: '#111' }}
            >
              <h3 className="font-bold text-white mb-3">Cache Status</h3>
              <p className="text-gray-400">
                {debugInfo.cache.cached ? (
                  <span className="text-yellow-400">
                    Cached (TTL: {debugInfo.cache.ttl_seconds}s)
                  </span>
                ) : (
                  <span className="text-green-400">Fresh</span>
                )}
              </p>
            </div>
=======
            <InfoCard title="Cache Status" delay={0.6} accentColor={accentColor}>
              <p className="text-gray-400">
                {debugInfo.cache.cached ? (
                  <span className="text-yellow-400 font-medium">
                    Cached (TTL: {debugInfo.cache.ttl_seconds}s)
                  </span>
                ) : (
                  <span className="font-medium" style={{ color: accentColor }}>
                    Fresh
                  </span>
                )}
              </p>
            </InfoCard>
>>>>>>> Stashed changes
          )}
        </div>
      )}

      {/* Footer */}
<<<<<<< Updated upstream
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>
          Powered by{' '}
          <span style={{ color: hub.theme.accent }} className="font-semibold">
=======
      <footer className="mt-12 text-center text-gray-600 text-sm" style={{ animation: 'fadeInUp 0.5s ease-out 0.7s both' }}>
        <p>
          Powered by{' '}
          <span style={{ color: accentColor }} className="font-semibold">
>>>>>>> Stashed changes
            Smart Link Hub
          </span>
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Note: Actual visitors are redirected automatically via backend
        </p>
      </footer>
    </main>
  );
}
<<<<<<< Updated upstream
=======

// Reusable info card component
function InfoCard({
  title,
  children,
  delay = 0,
  accentColor = '#00C853'
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
}) {
  return (
    <div
      className="p-4 rounded-xl text-sm bg-[#111] border border-[#222] transition-all hover:border-opacity-50"
      style={{
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
        borderColor: '#222',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.borderColor = `${accentColor}50`);
        (e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}10`);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.borderColor = '#222');
        (e.currentTarget.style.boxShadow = 'none');
      }}
    >
      <h3 className="font-bold text-white mb-3">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

// Reusable info row component
function InfoRow({
  label,
  value,
  highlight = false,
  breakAll = false,
  accentColor = '#00C853'
}: {
  label: string;
  value: string;
  highlight?: boolean;
  breakAll?: boolean;
  accentColor?: string;
}) {
  return (
    <p className="text-gray-400">
      <span className="text-gray-500">{label}:</span>{' '}
      <span
        className={breakAll ? 'break-all' : ''}
        style={{ color: highlight ? accentColor : '#E6E6E6' }}
      >
        {value}
      </span>
    </p>
  );
}
>>>>>>> Stashed changes
