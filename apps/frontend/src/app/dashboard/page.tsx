// ============================================
// SMART LINK HUB - Dashboard Overview Page  
// Analytics and overview dashboard (no duplicate tabs)
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { LinkHub, Variant, HubStats } from '@/types';
import { getHubs, createHub, updateHub, getVariants, getHubStats } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';
import CreateHubModal from '@/components/CreateHubModal';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import EditHubModal from '@/components/EditHubModal';
import { OnboardingModal } from '@/components/SettingsPanel';
import { LinkIcon, GearIcon, WrenchIcon, ChartIcon, ClockIcon, GlobeIcon, DollarIcon, EditIcon } from '@/components/ui/Icons';

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
  const [showEditHub, setShowEditHub] = useState(false);

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

  const handleUpdateHub = async (hubId: string, input: Parameters<typeof updateHub>[1]) => {
    const updatedHub = await updateHub(hubId, input);
    setHubs(hubs.map(h => h.hub_id === hubId ? updatedHub : h));
    setSelectedHub(updatedHub);
  };

  return (
    <div className="min-h-screen page-bg">
      {/* Top Navigation Bar */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(0,0,0,0.7)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-white text-base tracking-tight">Smart Link Hub</span>
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
              style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(0,200,83,0.2), rgba(0,200,83,0.05))', color: '#00C853' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-[#aaa] hidden sm:inline max-w-[180px] truncate">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm px-3.5 py-2 rounded-xl text-[#888] hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* Hub Toolbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <HubSelector
            hubs={hubs}
            selectedHub={selectedHub}
            onSelect={setSelectedHub}
            onCreateNew={() => setShowCreateHub(true)}
            isLoading={isLoadingHubs}
          />

          {selectedHub && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditHub(true)}
                className="text-sm py-2 px-4 rounded-lg border border-[#333] text-[#ccc] bg-transparent transition-all duration-200 ease-out hover:border-[#00C853]/50 hover:bg-[#0a0a0a] hover:text-white hover:scale-[1.02] active:scale-[0.97] flex items-center gap-1.5 cursor-pointer"
              >
                <EditIcon size={14} /> Edit Hub
              </button>
              <button
                onClick={() => window.open(`/${selectedHub.slug}`, '_blank')}
                className="text-sm py-2 px-4 rounded-lg bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/25 transition-all duration-200 ease-out hover:bg-[#00C853]/20 hover:border-[#00C853]/50 hover:shadow-[0_0_15px_rgba(0,200,83,0.2)] hover:scale-[1.02] active:scale-[0.97] flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                View Live
              </button>
            </div>
          )}
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
            <div className="w-20 h-20 bg-[#111] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#333]">
              <LinkIcon size={36} color="#555" />
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
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.12)' }}><LinkIcon size={22} color="#00C853" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00C853] transition-colors">
                      Manage Links
                    </h3>
                    <p className="text-[#888] text-sm">
                      {variants.length} link{variants.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                  <span className="ml-auto text-[#888] group-hover:text-[#00C853] group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/rules"
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(154,154,154,0.06)', border: '1px solid rgba(154,154,154,0.1)' }}><GearIcon size={22} color="#9A9A9A" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00C853] transition-colors">
                      Configure Rules
                    </h3>
                    <p className="text-[#888] text-sm">
                      Set up targeting
                    </p>
                  </div>
                  <span className="ml-auto text-[#888] group-hover:text-[#00C853] group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href={`/hub/${selectedHub.hub_id}/tools`}
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(26,26,46,0.8), rgba(22,33,62,0.7))', border: '1px solid rgba(74,74,232,0.15)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,74,232,0.08)', border: '1px solid rgba(74,74,232,0.15)' }}><WrenchIcon size={22} color="#7a7aff" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-[#7a7aff] group-hover:text-[#9a9aff] transition-colors">
                      Tools
                    </h3>
                    <p className="text-[#888] text-sm">
                      QR Code & Short URLs
                    </p>
                  </div>
                  <span className="ml-auto text-[#7a7aff] group-hover:text-[#9a9aff] group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href={`/analysis/${selectedHub.hub_id}`}
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,32,16,0.7))', border: '1px solid rgba(0,200,83,0.15)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.12)' }}><ChartIcon size={22} color="#00C853" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-[#00C853] group-hover:text-[#00FF00] transition-colors">
                      Analytics
                    </h3>
                    <p className="text-[#888] text-sm">
                      Charts & AI insights
                    </p>
                  </div>
                  <span className="ml-auto text-[#00C853] group-hover:text-[#00FF00] group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/engagement"
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.1)' }}><ClockIcon size={22} color="#eab308" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors">
                      Engagement
                    </h3>
                    <p className="text-[#888] text-sm">
                      Time & Attention
                    </p>
                  </div>
                  <span className="ml-auto text-[#888] group-hover:text-yellow-500 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/referrals"
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}><GlobeIcon size={22} color="#3b82f6" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors">
                      Sources
                    </h3>
                    <p className="text-[#888] text-sm">
                      Traffic & Referrers
                    </p>
                  </div>
                  <span className="ml-auto text-[#888] group-hover:text-blue-500 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/conversions"
                className="group rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.1)' }}><DollarIcon size={22} color="#a855f7" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-500 transition-colors">
                      Conversions
                    </h3>
                    <p className="text-[#888] text-sm">
                      Revenue & ROI
                    </p>
                  </div>
                  <span className="ml-auto text-[#888] group-hover:text-purple-500 group-hover:translate-x-1 transition-all">→</span>
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

      {selectedHub && (
        <EditHubModal
          hub={selectedHub}
          isOpen={showEditHub}
          onClose={() => setShowEditHub(false)}
          onUpdate={handleUpdateHub}
        />
      )}

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
