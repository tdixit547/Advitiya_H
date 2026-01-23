// ============================================
// SMART LINK HUB - Public Hub Page
// Dynamic route: /[slug]
// Now uses backend redirect/debug endpoint
// ============================================

import { notFound, redirect } from 'next/navigation';
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

  // For production: The backend handles redirects directly at GET /:slug
  // This page shows a preview/debug view
  
  // Fetch debug info
  const debugInfo = await getHubInfo(slug);
  
  if (!debugInfo?.hub) {
    notFound();
  }

  const hub = debugInfo.hub;
  const resolution = debugInfo.resolution;
  const context = debugInfo.context;

  // If there's a resolved variant, show option to redirect
  const finalUrl = resolution?.final_url || hub.default_url;

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
          }}
        >
          {hub.slug.charAt(0).toUpperCase()}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: hub.theme.accent }}
        >
          {hub.slug}
        </h1>

        {/* Redirect Info */}
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
          }}
        >
          Go to {resolution?.resolved_variant?.variant_id || 'Default'} →
        </a>
      </div>

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
          )}

          {/* Cache Info */}
          {debugInfo.cache && (
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
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>
          Powered by{' '}
          <span style={{ color: hub.theme.accent }} className="font-semibold">
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
