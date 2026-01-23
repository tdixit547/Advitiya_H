// ============================================
// SMART LINK HUB - Dashboard Page
// Main management interface (protected)
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { LinkHub, Variant, HubStats } from '@/types';
import { 
  getHubs, 
  createHub, 
  getVariants, 
  createVariant,
  deleteVariant,
  getHubStats,
  ApiError 
} from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';
import CreateHubModal from '@/components/CreateHubModal';
import VariantList from '@/components/VariantList';
import VariantEditor from '@/components/VariantEditor';
import RuleTreeBuilder from '@/components/RuleTreeBuilder';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { SettingsPanel, OnboardingModal } from '@/components/SettingsPanel';
import ThemeToggle from '@/components/ThemeToggle';

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
  
  // Variant state
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState<HubStats | null>(null);
  
  // UI state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'variants' | 'rules' | 'analytics'>('variants');
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);

  // Fetch hubs on mount
  const fetchHubs = useCallback(async () => {
    setIsLoadingHubs(true);
    try {
      const hubList = await getHubs();
      setHubs(hubList);
      
      // Auto-select first hub if available
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

  // Fetch variants when hub changes
  const fetchVariants = useCallback(async (hubId: string) => {
    setIsLoadingVariants(true);
    try {
      const variantList = await getVariants(hubId);
      setVariants(variantList);
    } catch (err) {
      console.error('Failed to fetch variants:', err);
    } finally {
      setIsLoadingVariants(false);
    }
  }, []);

  // Fetch stats when hub changes
  const fetchStats = useCallback(async (hubId: string) => {
    try {
      const hubStats = await getHubStats(hubId);
      setStats(hubStats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchHubs();
    
    // Check onboarding
    if (typeof window !== 'undefined' && !localStorage.getItem('hasSeenOnboarding')) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, [fetchHubs]);

  // Fetch data when hub changes
  useEffect(() => {
    if (selectedHub) {
      fetchVariants(selectedHub.hub_id);
      fetchStats(selectedHub.hub_id);
      setSelectedVariant(null);
    }
  }, [selectedHub, fetchVariants, fetchStats]);

  // Hub handlers
  const handleCreateHub = async (input: Parameters<typeof createHub>[0]) => {
    const newHub = await createHub(input);
    setHubs([...hubs, newHub]);
    setSelectedHub(newHub);
  };

  // Variant handlers
  const handleAddVariant = async (input: Parameters<typeof createVariant>[1]) => {
    if (!selectedHub) return;
    
    try {
      const newVariant = await createVariant(selectedHub.hub_id, input);
      setVariants([...variants, newVariant]);
      setIsAddingVariant(false);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      }
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!selectedHub || !confirm('Delete this variant?')) return;
    
    try {
      await deleteVariant(selectedHub.hub_id, variantId);
      setVariants(variants.filter(v => v.variant_id !== variantId));
      if (selectedVariant?.variant_id === variantId) {
        setSelectedVariant(null);
      }
    } catch (err) {
      console.error('Failed to delete variant:', err);
    }
  };

  const handleVariantUpdate = (updatedVariant: Variant) => {
    setVariants(variants.map(v => 
      v.variant_id === updatedVariant.variant_id ? updatedVariant : v
    ));
    setSelectedVariant(updatedVariant);
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
              <code className="text-[#00C853] bg-[#00C853]/10 px-3 py-2 rounded-lg border border-[#00C853]/20 text-sm">
                /{selectedHub.slug}
              </code>
            )}
            <button
              onClick={() => selectedHub && window.open(`/${selectedHub.slug}`, '_blank')}
              disabled={!selectedHub}
              className="btn btn-secondary text-sm py-2 px-4 disabled:opacity-50"
            >
              View Live →
            </button>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
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
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                label="Total Impressions" 
                value={stats?.aggregated.total_impressions ?? '-'} 
              />
              <StatCard 
                label="Total Clicks" 
                value={stats?.aggregated.total_clicks ?? '-'} 
              />
              <StatCard 
                label="Average CTR" 
                value={stats?.aggregated.average_ctr != null 
                  ? `${(stats.aggregated.average_ctr * 100).toFixed(1)}%` 
                  : '-'} 
              />
              <StatCard 
                label="Variants" 
                value={stats?.aggregated.variant_count ?? variants.length} 
              />
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-[#111] rounded-xl p-1 w-fit">
              {(['variants', 'rules', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-[#00C853] text-black'
                      : 'text-[#9A9A9A] hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeTab === 'variants' && (
                <>
                  {/* Left: Variant List */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Variants</h2>
                      <button
                        onClick={() => setIsAddingVariant(true)}
                        className="btn btn-primary text-sm py-2 px-4"
                      >
                        + Add Variant
                      </button>
                    </div>
                    
                    <VariantList
                      variants={variants}
                      selectedId={selectedVariant?.variant_id}
                      onSelect={setSelectedVariant}
                      onDelete={handleDeleteVariant}
                      isLoading={isLoadingVariants}
                      stats={stats?.variants}
                    />
                  </div>

                  {/* Right: Variant Editor */}
                  <div>
                    {isAddingVariant ? (
                      <VariantEditor
                        hubId={selectedHub.hub_id}
                        onSave={handleAddVariant}
                        onCancel={() => setIsAddingVariant(false)}
                        existingVariantIds={variants.map(v => v.variant_id)}
                      />
                    ) : selectedVariant ? (
                      <VariantEditor
                        hubId={selectedHub.hub_id}
                        variant={selectedVariant}
                        onUpdate={handleVariantUpdate}
                        onCancel={() => setSelectedVariant(null)}
                      />
                    ) : (
                      <div className="bg-[#111] rounded-xl border border-[#222] p-8 text-center">
                        <div className="text-5xl mb-4 opacity-30">🔗</div>
                        <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">
                          Select a variant to edit
                        </h3>
                        <p className="text-[#9A9A9A] text-sm">
                          Click on a variant from the list or add a new one
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'rules' && (
                <div className="lg:col-span-2">
                  <RuleTreeBuilder
                    hubId={selectedHub.hub_id}
                    variants={variants}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="lg:col-span-2">
                  <AnalyticsPanel
                    hubId={selectedHub.hub_id}
                    stats={stats}
                  />
                </div>
              )}
            </div>
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

// Helper Components
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#111] rounded-xl border border-[#222] p-4">
      <p className="text-[#9A9A9A] text-xs mb-1">{label}</p>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}
