// ============================================
// SMART LINK HUB - Edit Hub Modal
// Modal for editing an existing link hub
// ============================================

'use client';

import { useState, useEffect } from 'react';
import type { LinkHub, UpdateHubInput } from '@/types';

interface EditHubModalProps {
  hub: LinkHub;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (hubId: string, input: UpdateHubInput) => Promise<void>;
}

export default function EditHubModal({ hub, isOpen, onClose, onUpdate }: EditHubModalProps) {
  const [slug, setSlug] = useState('');
  const [defaultUrl, setDefaultUrl] = useState('');
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [accentColor, setAccentColor] = useState('#00C853');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form with hub data
  useEffect(() => {
    if (isOpen && hub) {
      setSlug(hub.slug);
      setDefaultUrl(hub.default_url);
      setBgColor(hub.theme?.bg || '#1a1a2e');
      setAccentColor(hub.theme?.accent || '#00C853');
    }
  }, [isOpen, hub]);

  const handleSlugChange = (value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setSlug(cleanSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!slug || !defaultUrl) {
      setError('All fields are required');
      return;
    }

    // Validate URL
    try {
      new URL(defaultUrl.startsWith('http') ? defaultUrl : `https://${defaultUrl}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(hub.hub_id, {
        slug,
        default_url: defaultUrl.startsWith('http') ? defaultUrl : `https://${defaultUrl}`,
        theme: {
          bg: bgColor,
          accent: accentColor,
        },
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hub');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-2xl w-full max-w-md m-4 shadow-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border-default)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Edit Hub Settings</h2>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Hub ID (Read only) */}
           <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Hub ID <span className="text-[#666]">(Cannot be changed)</span>
            </label>
            <input
              type="text"
              value={hub.hub_id}
              disabled
              className="input-field opacity-50 cursor-not-allowed"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Slug <span className="text-[#666]">(URL path)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="input-field"
              placeholder="my-awesome-hub"
              required
            />
            <p className="text-[#666] text-xs mt-1">
              Your hub is at: /{slug}
            </p>
          </div>

          {/* Default URL */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Default URL <span className="text-[#666]">(Fallback when no rules match)</span>
            </label>
            <input
              type="url"
              value={defaultUrl}
              onChange={(e) => setDefaultUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Theme Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#333] cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#333] cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>Preview</label>
            <div 
              className="p-4 rounded-xl border border-[#333] flex items-center gap-3"
              style={{ backgroundColor: bgColor }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                style={{ backgroundColor: accentColor, color: bgColor }}
              >
                {slug.charAt(0).toUpperCase() || 'H'}
              </div>
              <div>
                <p style={{ color: accentColor }} className="font-semibold">
                  {slug || 'your-hub'}
                </p>
                <p className="text-xs opacity-60" style={{ color: accentColor }}>
                  {defaultUrl || 'https://...'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary py-3"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
