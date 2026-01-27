// ============================================
// SMART LINK HUB - Links Management Page
// Dedicated page for managing link variants
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    v.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔗</span>
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
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10 w-64"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]">🔍</span>
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
                  <div className="bg-[#111] rounded-xl border border-[#222] p-8 text-center">
                    <div className="text-5xl mb-4 opacity-30">🔗</div>
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
                  <div className="bg-[#111] rounded-xl border border-[#222] p-8 text-center">
                    <div className="text-5xl mb-4 opacity-30">✏️</div>
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
            <div className="mt-8 p-4 bg-[#111] rounded-xl border border-[#222]">
              <h3 className="text-sm font-medium text-[#9A9A9A] mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{variants.length}</p>
                  <p className="text-xs text-[#9A9A9A]">Total Links</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#00C853]">
                    {variants.filter(v => v.is_active).length}
                  </p>
                  <p className="text-xs text-[#9A9A9A]">Active Links</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {variants.filter(v => !v.is_active).length}
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
