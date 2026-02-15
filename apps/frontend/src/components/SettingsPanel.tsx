'use client';

import { useState } from 'react';

// ==================== Settings Panel ====================

export function SettingsPanel() {
  const [themeMode, setThemeMode] = useState<'auto' | 'dark'>('dark');

  const copyToClipboard = () => {
    // In real app, this would use the real hub URL
    navigator.clipboard.writeText('https://mylinkhub.com/demo');
    alert('Copied to clipboard!');
  };

  return (
    <div className="dashboard-card p-6 space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Hub Settings</h3>
        
        {/* Theme Toggles */}
        <div className="mb-6">
          <label className="block text-[#9A9A9A] mb-2 text-sm">Appearance</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setThemeMode('dark')}
              className={`px-4 py-2 rounded border ${themeMode === 'dark' ? 'border-[#00C853] bg-[#00C853]/10 text-[#00C853]' : ''}`}
              style={themeMode !== 'dark' ? { borderColor: 'var(--border-default)', color: 'var(--foreground-secondary)' } : {}}
            >
              Force Dark
            </button>
            <button 
              onClick={() => setThemeMode('auto')}
              className={`px-4 py-2 rounded border ${themeMode === 'auto' ? 'border-[#00C853] bg-[#00C853]/10 text-[#00C853]' : ''}`}
              style={themeMode !== 'auto' ? { borderColor: 'var(--border-default)', color: 'var(--foreground-secondary)' } : {}}
            >
              Auto Detect
            </button>
          </div>
        </div>

        {/* Share Actions */}
        <div className="mb-6">
          <label className="block text-[#9A9A9A] mb-2 text-sm">Share Hub</label>
          <div className="flex gap-2">
            <button onClick={copyToClipboard} className="btn btn-secondary text-sm py-2 px-3">
              Copy URL
            </button>
            <button className="btn btn-secondary text-sm py-2 px-3">
              Download QR
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t pt-6" style={{ borderColor: 'var(--border-default)' }}>
          <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
          <button className="text-red-500 hover:text-red-400 text-sm underline">
            Delete this Hub
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Onboarding Modal ====================

interface OnboardingModalProps {
  onClose: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="p-8 rounded-2xl max-w-md w-full shadow-2xl relative" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: 'var(--foreground-secondary)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#00C853]' : ''}`}
              style={s > step ? { background: 'var(--surface-3)' } : {}} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[200px] flex flex-col justify-center text-center">
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="flex justify-center mb-4"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Add Your Links</h2>
              <p className="text-[#9A9A9A]">Start by adding your important links. You can drag to reorder them later.</p>
            </div>
          )}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="flex justify-center mb-4"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.28.44 2.46 1.18 3.4A4.5 4.5 0 0 0 4 14.5C4 17 6 19 8.5 19h1V9.5A5.5 5.5 0 0 0 9.5 2z" /><path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.28-.44 2.46-1.18 3.4A4.5 4.5 0 0 1 20 14.5c0 2.5-2 4.5-4.5 4.5h-1V9.5A5.5 5.5 0 0 1 14.5 2z" /><path d="M8 19v3" /><path d="M16 19v3" /></svg></div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Set Smart Rules</h2>
              <p className="text-[#9A9A9A]">Use rules to show links only on specific devices, locations, or times of day.</p>
            </div>
          )}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="flex justify-center mb-4"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Track Analytics</h2>
              <p className="text-[#9A9A9A]">See who is visiting your hub with detailed charts and click-through rates.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <button onClick={nextStep} className="btn btn-primary w-full mt-6">
          {step === totalSteps ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}
