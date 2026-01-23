// ============================================
// SMART LINK HUB - Link Management Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LinkWithRules, LinkRule, RuleType } from '@/types';
import RuleConfigurator from '@/components/RuleConfigurator';

export default function LinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkWithRules[]>([]);
  const [selectedLink, setSelectedLink] = useState<LinkWithRules | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links?hub_id=1');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      } else {
        setError(data.error || 'Failed to load links');
      }
    } catch (err) {
      console.error('Error loading links:', err);
      setError('Failed to load links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return;

    try {
      const formattedUrl = newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`;
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hub_id: 1,
          title: newLink.title,
          url: formattedUrl,
          priority: 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to create link');
      const data = await res.json();
      
      if (data.success) {
        setLinks([...links, data.data]);
        setNewLink({ title: '', url: '' });
        setIsAddingLink(false);
        router.refresh(); // Sync server components
      }
    } catch (err) {
      console.error('Error adding link:', err);
      alert('Failed to add link');
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete link');
      const data = await res.json();

      if (data.success) {
        setLinks(links.filter((l) => l.id !== id));
        if (selectedLink?.id === id) {
          setSelectedLink(null);
        }
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting link:', err);
      alert('Failed to delete link');
    }
  };

  const handleToggleActive = async (id: number) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;

    try {
      // Optimistic update
      setLinks(
        links.map((l) =>
          l.id === id ? { ...l, is_active: !l.is_active } : l
        )
      );

      const res = await fetch('/api/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          is_active: !link.is_active,
        }),
      });

      if (!res.ok) {
        // Revert on failure
        setLinks(
          links.map((l) =>
            l.id === id ? { ...l, is_active: link.is_active } : l
          )
        );
        throw new Error('Failed to update link');
      }
      
      router.refresh();
    } catch (err) {
      console.error('Error updating link:', err);
    }
  };

  const handleAddRule = async (linkId: number, rule: Omit<LinkRule, 'id' | 'link_id' | 'created_at'>) => {
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link_id: linkId,
          ...rule,
        }),
      });

      if (!res.ok) throw new Error('Failed to add rule');
      const data = await res.json();

      if (data.success) {
        const newRule = data.data;
        setLinks(
          links.map((l) => {
            if (l.id === linkId) {
              const updatedLink = { ...l, rules: [...l.rules, newRule] };
              // Update selected link if it's the one we modified
              if (selectedLink?.id === linkId) {
                setSelectedLink(updatedLink);
              }
              return updatedLink;
            }
            return l;
          })
        );
        router.refresh();
      }
    } catch (err) {
      console.error('Error adding rule:', err);
      alert('Failed to add rule');
    }
  };

  const handleDeleteRule = async (linkId: number, ruleId: number) => {
    try {
      const res = await fetch(`/api/rules?id=${ruleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete rule');
      const data = await res.json();

      if (data.success) {
        setLinks(
          links.map((l) => {
            if (l.id === linkId) {
              const updatedLink = { ...l, rules: l.rules.filter((r) => r.id !== ruleId) };
              if (selectedLink?.id === linkId) {
                setSelectedLink(updatedLink);
              }
              return updatedLink;
            }
            return l;
          })
        );
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert('Failed to delete rule');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading links...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Links</h1>
          <p className="text-gray-400">Add, edit, and configure smart rules for your links</p>
        </div>
        <button
          onClick={() => setIsAddingLink(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <span>+</span> Add Link
        </button>
      </div>

      {/* Add Link Modal */}
      {isAddingLink && (
        <div className="dashboard-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#00FF00]">Add New Link</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Link Title (e.g., My Portfolio)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="flex-1"
            />
            <input
              type="url"
              placeholder="URL (e.g., https://example.com)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="flex-1"
            />
            <button onClick={handleAddLink} className="btn btn-primary">
              Add
            </button>
            <button
              onClick={() => setIsAddingLink(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Links Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#00FF00]">Your Links</h2>
          {links.map((link, index) => (
            <div
              key={link.id}
              className={`dashboard-card p-4 cursor-pointer transition-all ${
                selectedLink?.id === link.id ? 'border-[#00FF00]' : ''
              }`}
              onClick={() => setSelectedLink(link)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono">#{index + 1}</span>
                  <div>
                    <h3 className={`font-medium ${link.is_active ? 'text-white' : 'text-gray-500 line-through'}`}>
                      {link.title}
                    </h3>
                    <p className="text-gray-500 text-sm truncate max-w-xs">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Rule indicators */}
                  {link.rules.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-[#00FF00]/20 text-[#00FF00] rounded">
                      {link.rules.length} rule{link.rules.length > 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(link.id);
                    }}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      link.is_active ? 'bg-[#00FF00]' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                        link.is_active ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLink(link.id);
                    }}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">🔗</p>
              <p>No links yet. Add your first link!</p>
            </div>
          )}
        </div>

        {/* Rule Configurator Column */}
        <div>
          {selectedLink ? (
            <RuleConfigurator
              link={selectedLink}
              onAddRule={(rule) => handleAddRule(selectedLink.id, rule)}
              onDeleteRule={(ruleId) => handleDeleteRule(selectedLink.id, ruleId)}
            />
          ) : (
            <div className="dashboard-card p-8 text-center text-gray-500">
              <p className="text-4xl mb-4">⚙️</p>
              <p>Select a link to configure smart rules</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
