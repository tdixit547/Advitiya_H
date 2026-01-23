// ============================================
// SMART LINK HUB - Link Management Page
// ============================================

'use client';

import { useState } from 'react';
import { Link, LinkWithRules, LinkRule, RuleType } from '@/types';
import RuleConfigurator from '@/components/RuleConfigurator';

// Demo links data
const INITIAL_LINKS: LinkWithRules[] = [
  {
    id: 1,
    hub_id: 1,
    title: '🌐 My Website',
    url: 'https://example.com',
    icon: null,
    priority: 100,
    click_count: 150,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    hub_id: 1,
    title: '💻 GitHub',
    url: 'https://github.com',
    icon: null,
    priority: 90,
    click_count: 120,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    hub_id: 1,
    title: '💼 LinkedIn',
    url: 'https://linkedin.com',
    icon: null,
    priority: 80,
    click_count: 100,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    hub_id: 1,
    title: '📅 Join Meeting (9AM-5PM)',
    url: 'https://meet.google.com',
    icon: null,
    priority: 70,
    click_count: 50,
    is_active: true,
    rules: [
      {
        id: 1,
        link_id: 4,
        rule_type: 'TIME',
        conditions: { startHour: 9, endHour: 17 },
        action: 'SHOW',
        is_active: true,
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function LinksPage() {
  const [links, setLinks] = useState<LinkWithRules[]>(INITIAL_LINKS);
  const [selectedLink, setSelectedLink] = useState<LinkWithRules | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) return;

    const link: LinkWithRules = {
      id: Date.now(),
      hub_id: 1,
      title: newLink.title,
      url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`,
      icon: null,
      priority: 0,
      click_count: 0,
      is_active: true,
      rules: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    setLinks([...links, link]);
    setNewLink({ title: '', url: '' });
    setIsAddingLink(false);
  };

  const handleDeleteLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id));
    if (selectedLink?.id === id) {
      setSelectedLink(null);
    }
  };

  const handleToggleActive = (id: number) => {
    setLinks(
      links.map((l) =>
        l.id === id ? { ...l, is_active: !l.is_active } : l
      )
    );
  };

  const handleAddRule = (linkId: number, rule: Omit<LinkRule, 'id' | 'link_id' | 'created_at'>) => {
    setLinks(
      links.map((l) => {
        if (l.id === linkId) {
          const newRule: LinkRule = {
            ...rule,
            id: Date.now(),
            link_id: linkId,
            created_at: new Date(),
          };
          return { ...l, rules: [...l.rules, newRule] };
        }
        return l;
      })
    );
  };

  const handleDeleteRule = (linkId: number, ruleId: number) => {
    setLinks(
      links.map((l) => {
        if (l.id === linkId) {
          return { ...l, rules: l.rules.filter((r) => r.id !== ruleId) };
        }
        return l;
      })
    );
  };

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
