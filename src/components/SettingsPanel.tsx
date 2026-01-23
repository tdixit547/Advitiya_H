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
        <h3 className="text-xl font-bold text-white mb-4">Hub Settings</h3>
        
        {/* Theme Toggles */}
        <div className="mb-6">
          <label className="block text-[#9A9A9A] mb-2 text-sm">Appearance</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setThemeMode('dark')}
              className={`px-4 py-2 rounded border ${themeMode === 'dark' ? 'border-[#00C853] bg-[#00C853]/10 text-[#00C853]' : 'border-[#333] text-[#9A9A9A]'}`}
            >
              Force Dark
            </button>
            <button 
              onClick={() => setThemeMode('auto')}
              className={`px-4 py-2 rounded border ${themeMode === 'auto' ? 'border-[#00C853] bg-[#00C853]/10 text-[#00C853]' : 'border-[#333] text-[#9A9A9A]'}`}
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
        <div className="border-t border-[#333] pt-6">
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
      <div className="bg-[#111] border border-[#333] p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white">✕</button>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#00C853]' : 'bg-[#333]'}`} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[200px] flex flex-col justify-center text-center">
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-white mb-2">Add Your Links</h2>
              <p className="text-[#9A9A9A]">Start by adding your important links. You can drag to reorder them later.</p>
            </div>
          )}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-2xl font-bold text-white mb-2">Set Smart Rules</h2>
              <p className="text-[#9A9A9A]">Use rules to show links only on specific devices, locations, or times of day.</p>
            </div>
          )}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-2">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-white mb-2">Track Analytics</h2>
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
