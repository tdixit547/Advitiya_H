// ============================================
// SMART LINK HUB - Dashboard Overview Page  
// Analytics and overview dashboard (no duplicate tabs)
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { LinkHub, Variant, HubStats } from '@/types';
import { getHubs, createHub, getVariants, getHubStats } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';
import CreateHubModal from '@/components/CreateHubModal';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { OnboardingModal } from '@/components/SettingsPanel';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  // Hub state
  const [hubs, setHubs] = useState<LinkHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<LinkHub | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(true);
  const [showCreateHub, setShowCreateHub] = useState(false);

  // Variant and Stats state
  const [variants, setVariants] = useState<Variant[]>([]);
  const [stats, setStats] = useState<HubStats | null>(null);

  // UI state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  // Fetch hubs on mount
  const fetchHubs = useCallback(async () => {
    setIsLoadingHubs(true);
    try {
      const hubList = await getHubs();
      setHubs(hubList);
      if (hubList.length > 0 && !selectedHub) {
        setSelectedHub(hubList[0]);
      }
    } catch (err) {
      console.error('Failed to fetch hubs:', err);
      setError('Failed to load hubs');
    } finally {
      setIsLoadingHubs(false);
    }
  }, [selectedHub]);

  // Fetch data when hub changes
  const fetchHubData = useCallback(async (hubId: string) => {
    try {
      const [variantList, hubStats] = await Promise.all([
        getVariants(hubId),
        getHubStats(hubId)
      ]);
      setVariants(variantList);
      setStats(hubStats);
    } catch (err) {
      console.error('Failed to fetch hub data:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchHubs();

    if (typeof window !== 'undefined' && !localStorage.getItem('hasSeenOnboarding')) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, [fetchHubs]);

  // Fetch data when hub changes
  useEffect(() => {
    if (selectedHub) {
      fetchHubData(selectedHub.hub_id);
    }
  }, [selectedHub, fetchHubData]);

  // Hub handlers
  const handleCreateHub = async (input: Parameters<typeof createHub>[0]) => {
    const newHub = await createHub(input);
    setHubs([...hubs, newHub]);
    setSelectedHub(newHub);
  };

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <HubSelector
              hubs={hubs}
              selectedHub={selectedHub}
              onSelect={setSelectedHub}
              onCreateNew={() => setShowCreateHub(true)}
              isLoading={isLoadingHubs}
            />
          </div>

          <div className="flex items-center gap-4">
            {selectedHub && (
              <button
                onClick={() => window.open(`/${selectedHub.slug}`, '_blank')}
                className="btn btn-secondary text-sm py-2 px-4"
              >
                View Live →
              </button>
            )}
            <div className="flex items-center gap-2 ml-4 border-l pl-4" style={{ borderColor: 'var(--border-secondary)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>{user?.email}</span>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {/* No Hub State */}
        {!isLoadingHubs && hubs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#111] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔗</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your First Hub</h2>
            <p className="text-[#9A9A9A] mb-6 max-w-md mx-auto">
              A hub is a smart link that routes visitors to different URLs based on rules you define.
            </p>
            <button
              onClick={() => setShowCreateHub(true)}
              className="btn btn-primary py-3 px-8"
            >
              + Create Hub
            </button>
          </div>
        )}

        {/* Main Content */}
        {selectedHub && (
          <>
            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link
                href="/dashboard/links"
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-[#00C853]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🔗</div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00C853] transition-colors">
                      Manage Links
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      {variants.length} link{variants.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                  <span className="ml-auto text-[#9A9A9A] group-hover:text-[#00C853] transition-colors">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/rules"
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-[#00C853]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">⚙️</div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00C853] transition-colors">
                      Configure Rules
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Set up targeting
                    </p>
                  </div>
                  <span className="ml-auto text-[#9A9A9A] group-hover:text-[#00C853] transition-colors">→</span>
                </div>
              </Link>

              <Link
                href={`/hub/${selectedHub.hub_id}/tools`}
                className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl border border-[#4a4ae8]/30 p-6 hover:border-[#4a4ae8] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🛠️</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#7a7aff] group-hover:text-[#9a9aff] transition-colors">
                      Tools
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      QR Code & Short URLs
                    </p>
                  </div>
                  <span className="ml-auto text-[#7a7aff] group-hover:text-[#9a9aff] transition-colors">→</span>
                </div>
              </Link>

              <Link
                href={`/analysis/${selectedHub.hub_id}`}
                className="bg-gradient-to-br from-[#111] to-[#0a2010] rounded-xl border border-[#00C853]/30 p-6 hover:border-[#00C853] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#00C853] group-hover:text-[#00FF00] transition-colors">
                      Analytics
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Charts & AI insights
                    </p>
                  </div>
                  <span className="ml-auto text-[#00C853] group-hover:text-[#00FF00] transition-colors">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/engagement"
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-yellow-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">⏱️</div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors">
                      Engagement
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Time & Attention
                    </p>
                  </div>
                  <span className="ml-auto text-[#9A9A9A] group-hover:text-yellow-500 transition-colors">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/referrals"
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🌍</div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors">
                      Sources
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Traffic & Referrers
                    </p>
                  </div>
                  <span className="ml-auto text-[#9A9A9A] group-hover:text-blue-500 transition-colors">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/conversions"
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">💰</div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-500 transition-colors">
                      Conversions
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Revenue & ROI
                    </p>
                  </div>
                  <span className="ml-auto text-[#9A9A9A] group-hover:text-purple-500 transition-colors">→</span>
                </div>
              </Link>
            </div>

            {/* Analytics Panel */}
            <AnalyticsPanel
              hubId={selectedHub.hub_id}
              stats={stats}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <CreateHubModal
        isOpen={showCreateHub}
        onClose={() => setShowCreateHub(false)}
        onCreate={handleCreateHub}
      />

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
