'use client';

import { useState, useEffect } from 'react';
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

  // Initial Fetch
  useEffect(() => {
    fetchLinks();
    // Check if first time user (simple mock check)
    if (!localStorage.getItem('hasSeenOnboarding')) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, []);

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      
      {/* LEFT COLUMN: Navigation (Simulated) & Link Management */}
      <div className="lg:col-span-3 space-y-6">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#00C853] rounded-lg flex items-center justify-center font-bold text-black text-xl">T</div>
            <h1 className="font-bold text-xl text-white">Tannupai Hub</h1>
         </div>

         {/* Add Link Button */}
         <button 
           onClick={() => setIsAddingLink(true)}
           className="btn btn-primary w-full"
         >
           + Add New Link
         </button>

         {/* Link List */}
         <div className="bg-[#111] rounded-xl p-4 min-h-[500px]">
           <h2 className="text-[#9A9A9A] text-sm font-bold mb-4 uppercase tracking-wider">Your Links</h2>
           <LinkListReorder 
             links={links} 
             onReorder={handleReorder}
             onEdit={(l) => setSelectedLink(l)}
             onDelete={handleDeleteLink}
             onSelect={(l) => setSelectedLink(l)}
             selectedId={selectedLink?.id}
           />
         </div>
      </div>

      {/* CENTER COLUMN: Main Content / Rule Editor / Preview */}
      <div className="lg:col-span-5 space-y-6">
        {/* Mobile Onboarding or Context Header */}
        <div className="flex justify-between items-center bg-[#111] p-4 rounded-xl border border-[#222]">
           <span className="text-white font-bold">Public URL:</span>
           <code className="text-[#00C853] bg-[#00C853]/10 px-2 py-1 rounded">domain.com/demo</code>
           <button className="text-sm text-[#9A9A9A] hover:text-white" onClick={() => window.open('/demo', '_blank')}>Open</button>
        </div>

        {/* Add Link Form */}
        {isAddingLink && (
           <div className="dashboard-card p-6 animate-in slide-down">
             <h3 className="text-lg font-bold text-white mb-4">Create New Link</h3>
             <div className="space-y-4">
               <input 
                 className="input-field" 
                 placeholder="Title"
                 value={newLink.title}
                 onChange={e => setNewLink({...newLink, title: e.target.value})}
               />
               <input 
                 className="input-field" 
                 placeholder="URL"
                 value={newLink.url}
                 onChange={e => setNewLink({...newLink, url: e.target.value})}
               />
               <div className="flex gap-2 justify-end">
                 <button className="btn btn-secondary" onClick={() => setIsAddingLink(false)}>Cancel</button>
                 <button className="btn btn-primary" onClick={handleAddLink}>Create</button>
               </div>
             </div>
           </div>
        )}

        {/* Rule Editor */}
        {selectedLink ? (
          <RuleConfigurator 
             link={selectedLink}
             onAddRule={(r) => handleAddRule(selectedLink.id, r)}
             onDeleteRule={(rid) => handleDeleteRule(selectedLink.id, rid)}
          />
        ) : (
           !isAddingLink && (
             <div className="dashboard-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
               <div className="text-6xl mb-4 opacity-20">⚡</div>
               <h3 className="text-xl font-bold text-[#E6E6E6] mb-2">Select a link to configure</h3>
               <p className="text-[#9A9A9A]">Add smart rules, schedule availability, or target specific devices.</p>
             </div>
           )
        )}
      </div>

      {/* RIGHT COLUMN: Analytics & Settings */}
      <div className="lg:col-span-4 space-y-6">
         <AnalyticsPanel />
         <SettingsPanel />
      </div>

      {/* Modals */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
