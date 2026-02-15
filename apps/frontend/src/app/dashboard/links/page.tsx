// ============================================
// SMART LINK HUB - Links Management Page
// Dedicated page for managing link variants
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DashboardNav from '@/components/DashboardNav';
import type { LinkHub, Variant, VariantStats } from '@/types';
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

export default function LinksPage() {
  return (
    <ProtectedRoute>
      <LinksContent />
    </ProtectedRoute>
  );
}

function LinksContent() {
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
  const [variantStats, setVariantStats] = useState<VariantStats[]>([]);
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      
      // Also fetch stats
      const hubStats = await getHubStats(hubId);
      if (hubStats?.variants) {
        setVariantStats(hubStats.variants);
      }
    } catch (err) {
      console.error('Failed to fetch variants:', err);
    } finally {
      setIsLoadingVariants(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchHubs();
  }, [fetchHubs]);

  // Fetch data when hub changes
  useEffect(() => {
    if (selectedHub) {
      fetchVariants(selectedHub.hub_id);
      setSelectedVariant(null);
    }
  }, [selectedHub, fetchVariants]);

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
    if (!selectedHub || !confirm('Delete this link variant?')) return;
    
    try {
      await deleteVariant(selectedHub.hub_id, variantId);
      setVariants(variants.filter(v => v.variant_id !== variantId));
      if (selectedVariant?.variant_id === variantId) {
        setSelectedVariant(null);
      }
    } catch (err) {
      console.error('Failed to delete variant:', err);
      const message = err instanceof ApiError ? err.message : 'Failed to delete variant';
      setError(message);
    }
  };

  const handleVariantUpdate = (updatedVariant: Variant) => {
    setVariants(variants.map(v => 
      v.variant_id === updatedVariant.variant_id ? updatedVariant : v
    ));
    setSelectedVariant(updatedVariant);
  };

  // Filter variants by search query
  const filteredVariants = variants.filter(v => 
    v.variant_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.target_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen page-bg">
      <DashboardNav />
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
              <span className="flex items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></span>
              Link Manager
            </h1>
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
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--surface-2)' }}>
              <span className="flex items-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Create Your First Hub</h2>
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
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-64"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none" style={{ color: 'var(--foreground-secondary, #9A9A9A)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></span>
                </div>
                <span className="text-sm text-[#9A9A9A]">
                  {filteredVariants.length} link{filteredVariants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => setIsAddingVariant(true)}
                className="btn btn-primary py-2 px-6"
              >
                + Add New Link
              </button>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Link List */}
              <div className="space-y-4">
                <VariantList
                  variants={filteredVariants}
                  selectedId={selectedVariant?.variant_id}
                  onSelect={setSelectedVariant}
                  onDelete={handleDeleteVariant}
                  isLoading={isLoadingVariants}
                  stats={variantStats}
                />
                
                {!isLoadingVariants && filteredVariants.length === 0 && (
                  <div className="rounded-xl p-8 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                    <div className="mb-4 opacity-30 flex justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div>
                    <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">
                      {searchQuery ? 'No links found' : 'No links yet'}
                    </h3>
                    <p className="text-[#9A9A9A] text-sm mb-4">
                      {searchQuery 
                        ? 'Try a different search term'
                        : 'Add your first link to get started'
                      }
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setIsAddingVariant(true)}
                        className="btn btn-secondary text-sm"
                      >
                        + Add Link
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Link Editor */}
              <div className="lg:sticky lg:top-24 lg:self-start">
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
                  <div className="rounded-xl p-8 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
                    <div className="mb-4 opacity-30 flex justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></div>
                    <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">
                      Select a link to edit
                    </h3>
                    <p className="text-[#9A9A9A] text-sm">
                      Click on a link from the list to view and edit its details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)' }}>
              <h3 className="text-sm font-medium text-[#9A9A9A] mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{variants.length}</p>
                  <p className="text-xs text-[#9A9A9A]">Total Links</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#00C853]">
                    {variants.filter(v => v.enabled).length}
                  </p>
                  <p className="text-xs text-[#9A9A9A]">Active Links</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {variants.filter(v => !v.enabled).length}
                  </p>
                  <p className="text-xs text-[#9A9A9A]">Inactive Links</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {variantStats.reduce((sum, s) => sum + (s.clicks || 0), 0)}
                  </p>
                  <p className="text-xs text-[#9A9A9A]">Total Clicks</p>
                </div>
              </div>
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
    </div>
  );
}
