// ============================================
// SMART LINK HUB - Rules Management Page
// Dedicated page for rule tree configuration
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { LinkHub, Variant } from '@/types';
import { getHubs, createHub, getVariants } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import HubSelector from '@/components/HubSelector';
import CreateHubModal from '@/components/CreateHubModal';
import RuleTreeBuilder from '@/components/RuleTreeBuilder';

export default function RulesPage() {
  return (
    <ProtectedRoute>
      <RulesContent />
    </ProtectedRoute>
  );
}

function RulesContent() {
  const { user, logout } = useAuth();
  
  // Hub state
  const [hubs, setHubs] = useState<LinkHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<LinkHub | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(true);
  const [showCreateHub, setShowCreateHub] = useState(false);
  
  // Variant state
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  
  // UI state
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
    }
  }, [selectedHub, fetchVariants]);

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
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Rule Configuration
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
              <span className="text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create a Hub First</h2>
            <p className="text-[#9A9A9A] mb-6 max-w-md mx-auto">
              You need to create a hub before configuring rules.
            </p>
            <button
              onClick={() => setShowCreateHub(true)}
              className="btn btn-primary py-3 px-8"
            >
              + Create Hub
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingVariants && selectedHub && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#9A9A9A]">Loading variants...</p>
          </div>
        )}

        {/* Main Content */}
        {selectedHub && !isLoadingVariants && (
          <>
            {/* Info Banner */}
            <div className="bg-[#00C853]/10 border border-[#00C853]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <p className="text-[#00C853] text-sm">
                  <strong>Rule Tree:</strong> Define conditions to route visitors to different link variants. 
                  Rules are evaluated in order - the first matching rule wins.
                </p>
              </div>
            </div>

            {/* Rule Tree Builder */}
            <RuleTreeBuilder
              hubId={selectedHub.hub_id}
              variants={variants}
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
    </div>
  );
}
