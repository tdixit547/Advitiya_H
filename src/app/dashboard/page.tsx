'use client';

import { useState, useEffect, useRef } from 'react';
import { LinkWithRules } from '@/types';
import RuleConfigurator from '@/components/RuleConfigurator';
import LinkListReorder from '@/components/LinkListReorder';
import AnalyticsPanel from '@/components/AnalyticsPanel';

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkWithRules[]>([]);
  const [selectedLink, setSelectedLink] = useState<LinkWithRules | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links?hub_id=1');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      if (data.success) setLinks(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (err) {
      alert('Failed to add link');
    }
  };

  const handleReorder = (newOrder: LinkWithRules[]) => {
    setLinks(newOrder);
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Delete link?')) return;
    try {
      await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      setLinks(prev => prev.filter(l => l.id !== id));
      if (selectedLink?.id === id) setSelectedLink(null);
    } catch (e) {
      alert('Error deleting');
    }
  };

  const handleAddRule = async (linkId: number, rule: any) => {
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link_id: linkId, ...rule }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks(links.map(l => l.id === linkId ? { ...l, rules: [...l.rules, data.data] } : l));
        if (selectedLink?.id === linkId) {
          setSelectedLink(prev => prev ? { ...prev, rules: [...prev.rules, data.data] } : null);
        }
      }
    } catch (err) {
      alert('Failed to add rule');
    }
  };

  const handleDeleteRule = async (linkId: number, ruleId: number) => {
    try {
      await fetch(`/api/rules?id=${ruleId}`, { method: 'DELETE' });
      setLinks(links.map(l => l.id === linkId ? { ...l, rules: l.rules.filter(r => r.id !== ruleId) } : l));
      if (selectedLink?.id === linkId) {
        setSelectedLink(prev => prev ? { ...prev, rules: prev.rules.filter(r => r.id !== ruleId) } : null);
      }
    } catch (err) {
      alert('Failed to delete rule');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">

      {/* LEFT COLUMN: Link Management */}
      <div className="lg:col-span-3 space-y-6">
        {/* Hub Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00C853] rounded-lg flex items-center justify-center font-bold text-black text-xl">
            T
          </div>
          <h1 className="font-bold text-xl text-white">Tannupai Hub</h1>
        </div>

        {/* Add Link Button */}
        <button
          onClick={() => setIsAddingLink(true)}
          className="w-full py-3 bg-[#00C853] hover:bg-[#00E676] text-black font-bold rounded-lg transition-colors"
        >
          + Add New Link
        </button>

        {/* Your Links */}
        <div className="bg-[#111] rounded-xl p-4 min-h-[400px] border border-[#222]">
          <h2 className="text-[#9A9A9A] text-sm font-bold mb-4 uppercase tracking-wider">
            Your Links
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-[#00C853] border-t-transparent rounded-full" />
            </div>
          ) : (
            <LinkListReorder
              links={links}
              onReorder={handleReorder}
              onEdit={(l) => setSelectedLink(l)}
              onDelete={handleDeleteLink}
              onSelect={(l) => setSelectedLink(l)}
              selectedId={selectedLink?.id}
            />
          )}
        </div>
      </div>

      {/* CENTER COLUMN: Create/Edit */}
      <div className="lg:col-span-5 space-y-6">
        {/* Public URL Bar */}
        <div className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-[#222]">
          <span className="text-white font-bold">Public URL:</span>
          <code className="text-[#00C853] bg-[#00C853]/10 px-3 py-1 rounded">
            domain.com/demo
          </code>
          <button
            className="text-sm text-[#9A9A9A] hover:text-white transition-colors"
            onClick={() => window.open('/demo', '_blank')}
          >
            Open
          </button>
        </div>

        {/* Create New Link Form */}
        {isAddingLink && (
          <div className="bg-[#111] rounded-xl p-6 border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-4">Create New Link</h3>
            <div className="space-y-4">
              <input
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none"
                placeholder="Title"
                value={newLink.title}
                onChange={e => setNewLink({ ...newLink, title: e.target.value })}
              />
              <input
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none"
                placeholder="URL"
                value={newLink.url}
                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              />
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 bg-transparent border border-[#00C853] text-[#00C853] rounded-lg hover:bg-[#00C853]/10 transition-colors"
                  onClick={() => setIsAddingLink(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#00C853] text-black font-bold rounded-lg hover:bg-[#00E676] transition-colors"
                  onClick={handleAddLink}
                >
                  Create
                </button>
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
            <div className="bg-[#111] rounded-xl border border-[#222] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-4 opacity-20">⚡</div>
              <h3 className="text-xl font-bold text-[#E6E6E6] mb-2">Select a link to configure</h3>
              <p className="text-[#9A9A9A]">Add smart rules, schedule availability, or target specific devices.</p>
            </div>
          )
        )}
      </div>

      {/* RIGHT COLUMN: Analytics */}
      <div className="lg:col-span-4 space-y-6">
        <AnalyticsPanel />
      </div>
    </div>
  );
}
