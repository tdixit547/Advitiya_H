'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LinkWithRules, LinkRule } from '@/types';
import RuleConfigurator from '@/components/RuleConfigurator';
import LinkListReorder from '@/components/LinkListReorder';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { SettingsPanel, OnboardingModal } from '@/components/SettingsPanel';

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkWithRules[]>([]);
  const [selectedLink, setSelectedLink] = useState<LinkWithRules | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false); // Set to true for demo if needed
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links?hub_id=1');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      if (data.success) setLinks(data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load links');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchLinks();
    // Check if first time user (simple mock check)
    if (!localStorage.getItem('hasSeenOnboarding')) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, []);

  // CRUD Handlers
  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return;
    try {
      const formattedUrl = newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`;
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hub_id: 1, title: newLink.title, url: formattedUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks([...links, data.data]);
        setNewLink({ title: '', url: '' });
        setIsAddingLink(false);
      }
    } catch (err) { alert('Failed to add link'); }
  };

  const handleReorder = (newOrder: LinkWithRules[]) => {
    setLinks(newOrder);
    // TODO: Sync order to backend via API (PUT /api/links/reorder)
  };

  const handleDeleteLink = async (id: number) => {
    if(!confirm("Delete link?")) return;
    try {
      await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      setLinks(prev => prev.filter(l => l.id !== id));
      if(selectedLink?.id === id) setSelectedLink(null);
    } catch(e) { alert("Error deleting"); }
  };

  const handleAddRule = async (linkId: number, rule: any) => {
    // Reuse existing logic from previous implementation...
     try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link_id: linkId, ...rule }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks(links.map(l => l.id === linkId ? { ...l, rules: [...l.rules, data.data] } : l));
        // Refresh selected link if needed
        if (selectedLink?.id === linkId) {
             setSelectedLink(prev => prev ? { ...prev, rules: [...prev.rules, data.data]} : null);
        }
      }
    } catch (err) { alert('Failed to add rule'); }
  };

   const handleDeleteRule = async (linkId: number, ruleId: number) => {
    try {
      await fetch(`/api/rules?id=${ruleId}`, { method: 'DELETE' });
      setLinks(links.map(l => l.id === linkId ? { ...l, rules: l.rules.filter(r => r.id !== ruleId) } : l));
       if (selectedLink?.id === linkId) {
             setSelectedLink(prev => prev ? { ...prev, rules: prev.rules.filter(r => r.id !== ruleId)} : null);
        }
    } catch (err) { alert('Failed to delete rule'); }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Main Container with proper max-width */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00C853] rounded-xl flex items-center justify-center font-bold text-black text-2xl shadow-lg shadow-[#00C853]/20">T</div>
            <div>
              <h1 className="font-bold text-2xl text-white">Tannupai Hub</h1>
              <p className="text-[#9A9A9A] text-sm">Manage your smart links</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-[#00C853] bg-[#00C853]/10 px-3 py-2 rounded-lg border border-[#00C853]/20 text-sm">domain.com/demo</code>
            <button 
              className="btn btn-secondary text-sm py-2 px-4" 
              onClick={() => window.open('/demo', '_blank')}
            >
              View Live →
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Views" value="1245" change="+12%" />
          <StatCard label="Total Clicks" value="854" change="+8%" />
          <StatCard label="CTR" value="68.5%" change="+2%" />
          <StatCard label="Unique Visitors" value="950" change="+15%" />
        </div>

        {/* Main Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Links Management */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Links</h2>
              <button 
                onClick={() => setIsAddingLink(true)}
                className="btn btn-primary text-sm py-2 px-4"
              >
                + Add Link
              </button>
            </div>

            {/* Add Link Form */}
            {isAddingLink && (
              <div className="bg-[#111] rounded-xl p-6 border border-[#00C853]/30">
                <h3 className="text-lg font-bold text-white mb-4">Create New Link</h3>
                <div className="space-y-4">
                  <input 
                    className="input-field" 
                    placeholder="Link Title (e.g., My Portfolio)"
                    value={newLink.title}
                    onChange={e => setNewLink({...newLink, title: e.target.value})}
                  />
                  <input 
                    className="input-field" 
                    placeholder="URL (e.g., https://example.com)"
                    value={newLink.url}
                    onChange={e => setNewLink({...newLink, url: e.target.value})}
                  />
                  <div className="flex gap-3 justify-end">
                    <button className="btn btn-secondary text-sm py-2 px-4" onClick={() => setIsAddingLink(false)}>Cancel</button>
                    <button className="btn btn-primary text-sm py-2 px-4" onClick={handleAddLink}>Create Link</button>
                  </div>
                </div>
              </div>
            )}

            {/* Links List */}
            <div className="bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden">
              <LinkListReorder 
                links={links} 
                onReorder={handleReorder}
                onEdit={(l) => setSelectedLink(l)}
                onDelete={handleDeleteLink}
                onSelect={(l) => setSelectedLink(l)}
                selectedId={selectedLink?.id}
              />
              {links.length === 0 && (
                <div className="p-8 text-center text-[#666]">
                  <p className="text-4xl mb-3">🔗</p>
                  <p>No links yet. Add your first link!</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Rule Editor & Analytics */}
          <div className="space-y-6">
            {/* Rule Configurator */}
            {selectedLink ? (
              <RuleConfigurator 
                link={selectedLink}
                onAddRule={(r) => handleAddRule(selectedLink.id, r)}
                onDeleteRule={(rid) => handleDeleteRule(selectedLink.id, rid)}
              />
            ) : (
              !isAddingLink && (
                <div className="bg-[#111] rounded-xl border border-[#222] p-8 text-center">
                  <div className="text-5xl mb-4 opacity-30">⚙️</div>
                  <h3 className="text-lg font-bold text-[#E6E6E6] mb-2">Select a link to configure</h3>
                  <p className="text-[#9A9A9A] text-sm">Click on a link from the list to add smart rules</p>
                </div>
              )
            )}

            {/* Mini Analytics */}
            <div className="bg-[#111] rounded-xl border border-[#222] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Top Performing Links</h3>
                <button className="text-xs text-[#00C853] hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                <TopLinkRow title="🌐 My Portfolio" clicks={452} ctr="12%" />
                <TopLinkRow title="💻 GitHub" clicks={320} ctr="8%" />
                <TopLinkRow title="💼 LinkedIn" clicks={180} ctr="5%" />
              </div>
            </div>

            {/* Quick Settings */}
            <SettingsPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}

// Helper Components
function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="bg-[#111] rounded-xl border border-[#222] p-4">
      <p className="text-[#9A9A9A] text-xs mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded">{change}</span>
      </div>
    </div>
  );
}

function TopLinkRow({ title, clicks, ctr }: { title: string; clicks: number; ctr: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
      <span className="text-[#E6E6E6] text-sm">{title}</span>
      <div className="flex gap-4 text-sm">
        <span className="text-[#9A9A9A]">{clicks} clicks</span>
        <span className="text-[#00C853]">{ctr}</span>
      </div>
    </div>
  );
}
