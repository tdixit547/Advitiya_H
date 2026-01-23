// ============================================
// SMART LINK HUB - Rule Configurator Component
// No-code UI for setting up smart rules
// ============================================

'use client';

import { useState } from 'react';
import { LinkWithRules, LinkRule, RuleType, RuleAction } from '@/types';

interface RuleConfiguratorProps {
  link: LinkWithRules;
  onAddRule: (rule: Omit<LinkRule, 'id' | 'link_id' | 'created_at'>) => void;
  onDeleteRule: (ruleId: number) => void;
}

export default function RuleConfigurator({
  link,
  onAddRule,
  onDeleteRule,
}: RuleConfiguratorProps) {
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [ruleType, setRuleType] = useState<RuleType>('TIME');
  const [action, setAction] = useState<RuleAction>('SHOW');

  // Time rule state
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);

  // Device rule state
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [os, setOs] = useState<'ios' | 'android' | ''>('');

  // Location rule state
  const [country, setCountry] = useState('IN');

  const handleAddRule = () => {
    let conditions: Record<string, unknown> = {};

    switch (ruleType) {
      case 'TIME':
        conditions = { startHour, endHour };
        break;
      case 'DEVICE':
        conditions = { device };
        if (os) conditions.os = os;
        break;
      case 'LOCATION':
        conditions = { country };
        break;
    }

    onAddRule({
      rule_type: ruleType,
      conditions,
      action,
      is_active: true,
    });

    setIsAddingRule(false);
    // Reset form
    setStartHour(9);
    setEndHour(17);
    setDevice('mobile');
    setOs('');
    setCountry('IN');
  };

  const getRuleDescription = (rule: LinkRule): string => {
    const conditions = rule.conditions as Record<string, unknown>;
    switch (rule.rule_type) {
      case 'TIME':
        return `${rule.action} between ${conditions.startHour}:00 - ${conditions.endHour}:00`;
      case 'DEVICE':
        return `${rule.action} on ${conditions.device}${conditions.os ? ` (${conditions.os})` : ''}`;
      case 'LOCATION':
        return `${rule.action} in ${conditions.country}`;
      default:
        return 'Unknown rule';
    }
  };

  const getRuleIcon = (type: RuleType): string => {
    switch (type) {
      case 'TIME':
        return '⏰';
      case 'DEVICE':
        return '📱';
      case 'LOCATION':
        return '🌍';
      default:
        return '⚙️';
    }
  };

  return (
    <div className="dashboard-card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#00FF00] mb-1">
          Smart Rules for "{link.title}"
        </h2>
        <p className="text-gray-500 text-sm">
          Configure when this link should appear based on visitor context
        </p>
      </div>

      {/* Existing Rules */}
      <div className="space-y-3">
        {link.rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-gray-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getRuleIcon(rule.rule_type)}</span>
              <div>
                <span className="text-xs text-[#00FF00] uppercase font-medium">
                  {rule.rule_type}
                </span>
                <p className="text-white">{getRuleDescription(rule)}</p>
              </div>
            </div>
            <button
              onClick={() => onDeleteRule(rule.id)}
              className="text-red-500 hover:text-red-400 p-2"
            >
              ✕
            </button>
          </div>
        ))}

        {link.rules.length === 0 && !isAddingRule && (
          <p className="text-gray-500 text-center py-4">
            No rules configured. This link is always visible.
          </p>
        )}
      </div>

      {/* Add Rule Form */}
      {isAddingRule ? (
        <div className="space-y-4 p-4 bg-black/50 rounded-lg border border-[#00FF00]/30">
          <h3 className="font-medium text-white">Add New Rule</h3>

          {/* Rule Type Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Rule Type</label>
            <div className="flex gap-2">
              {(['TIME', 'DEVICE', 'LOCATION'] as RuleType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setRuleType(type)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    ruleType === type
                      ? 'bg-[#00FF00] text-black border-[#00FF00]'
                      : 'border-gray-600 text-gray-400 hover:border-[#00FF00]'
                  }`}
                >
                  {getRuleIcon(type)} {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Action</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAction('SHOW')}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  action === 'SHOW'
                    ? 'bg-[#00FF00] text-black border-[#00FF00]'
                    : 'border-gray-600 text-gray-400 hover:border-[#00FF00]'
                }`}
              >
                SHOW only when
              </button>
              <button
                onClick={() => setAction('HIDE')}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  action === 'HIDE'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-600 text-gray-400 hover:border-red-500'
                }`}
              >
                HIDE when
              </button>
            </div>
          </div>

          {/* Condition Fields */}
          <div className="pt-2">
            {ruleType === 'TIME' && (
              <div className="flex gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Start Hour</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(parseInt(e.target.value))}
                    className="w-24"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-gray-500 mt-6">to</span>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">End Hour</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(parseInt(e.target.value))}
                    className="w-24"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {ruleType === 'DEVICE' && (
              <div className="flex gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Device</label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value as 'mobile' | 'desktop')}
                    className="w-32"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    OS (Optional)
                  </label>
                  <select
                    value={os}
                    onChange={(e) => setOs(e.target.value as 'ios' | 'android' | '')}
                    className="w-32"
                  >
                    <option value="">Any</option>
                    <option value="ios">iOS</option>
                    <option value="android">Android</option>
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                  </select>
                </div>
              </div>
            )}

            {ruleType === 'LOCATION' && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-48"
                >
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="JP">🇯🇵 Japan</option>
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddRule} className="btn btn-primary">
              Add Rule
            </button>
            <button
              onClick={() => setIsAddingRule(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingRule(true)}
          className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-[#00FF00] hover:text-[#00FF00] transition-all"
        >
          + Add Smart Rule
        </button>
      )}
    </div>
  );
}
