// ============================================
// SMART LINK HUB - Variant Editor Component
// Form for creating/editing variants with map and clock
// ============================================

'use client';

import { useState, useEffect } from 'react';
import type { Variant, CreateVariantInput, UpdateVariantInput, VariantConditions } from '@/types';
import { updateVariant, ApiError } from '@/lib/api-client';
import WorldMapSelector, { getCountryName } from './WorldMapSelector';
import AnalogClockPicker, { TimeValue, formatTime } from './AnalogClockPicker';

interface VariantEditorProps {
  hubId: string;
  variant?: Variant;
  onSave?: (input: CreateVariantInput) => Promise<void>;
  onUpdate?: (variant: Variant) => void;
  onCancel: () => void;
  existingVariantIds?: string[];
}

interface TimeWindow {
  startTime: TimeValue;
  endTime: TimeValue;
  days: number[]; // 0 = Sunday, 6 = Saturday
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function VariantEditor({
  hubId,
  variant,
  onSave,
  onUpdate,
  onCancel,
  existingVariantIds = [],
}: VariantEditorProps) {
  const isEditing = !!variant;
  
  // Form state
  const [variantId, setVariantId] = useState(variant?.variant_id || '');
  const [targetUrl, setTargetUrl] = useState(variant?.target_url || '');
  const [priority, setPriority] = useState(variant?.priority ?? 10);
  const [weight, setWeight] = useState(variant?.weight ?? 1);
  const [enabled, setEnabled] = useState(variant?.enabled ?? true);
  
  // Conditions state
  const [deviceTypes, setDeviceTypes] = useState<string[]>(
    variant?.conditions?.device_types || []
  );
  const [countries, setCountries] = useState<string[]>(
    variant?.conditions?.countries || []
  );
  
  // Map modal state
  const [showMapSelector, setShowMapSelector] = useState(false);
  
  // Time window state
  const [enableTimeWindow, setEnableTimeWindow] = useState(false);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>({
    startTime: { hour: 9, minute: 0, period: 'AM' },
    endTime: { hour: 5, minute: 0, period: 'PM' },
    days: [1, 2, 3, 4, 5], // Mon-Fri
  });
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when variant changes
  useEffect(() => {
    if (variant) {
      setVariantId(variant.variant_id);
      setTargetUrl(variant.target_url);
      setPriority(variant.priority);
      setWeight(variant.weight);
      setEnabled(variant.enabled);
      setDeviceTypes(variant.conditions?.device_types || []);
      setCountries(variant.conditions?.countries || []);
      
      // Check for time windows
      if (variant.conditions?.time_windows && variant.conditions.time_windows.length > 0) {
        setEnableTimeWindow(true);
        const tw = variant.conditions.time_windows[0];
        if (tw.recurring) {
          setTimeWindow({
            startTime: parseTimeString(tw.recurring.start_time),
            endTime: parseTimeString(tw.recurring.end_time),
            days: tw.recurring.days,
          });
        }
      }
    }
  }, [variant]);

  const parseTimeString = (timeStr: string): TimeValue => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return {
      hour: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
      minute: minutes,
      period: hours >= 12 ? 'PM' : 'AM',
    };
  };

  const formatTimeFor24h = (time: TimeValue): string => {
    let hour24 = time.hour;
    if (time.period === 'PM' && time.hour !== 12) hour24 += 12;
    if (time.period === 'AM' && time.hour === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!variantId) {
      setError('Variant ID is required');
      return;
    }
    if (!targetUrl) {
      setError('Target URL is required');
      return;
    }
    if (!isEditing && existingVariantIds.includes(variantId)) {
      setError('A variant with this ID already exists');
      return;
    }

    // Build conditions
    const conditions: VariantConditions = {};
    if (deviceTypes.length > 0) {
      conditions.device_types = deviceTypes as ('mobile' | 'desktop' | 'tablet')[];
    }
    if (countries.length > 0) {
      conditions.countries = countries;
    }
    if (enableTimeWindow && timeWindow.days.length > 0) {
      conditions.time_windows = [{
        branch_id: `time-${Date.now()}`,
        recurring: {
          days: timeWindow.days,
          start_time: formatTimeFor24h(timeWindow.startTime),
          end_time: formatTimeFor24h(timeWindow.endTime),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      }];
    }

    setIsSubmitting(true);

    try {
      if (isEditing && onUpdate) {
        const input: UpdateVariantInput = {
          target_url: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
          priority,
          weight,
          enabled,
          conditions: conditions,
        };
        
        const updated = await updateVariant(hubId, variantId, input);
        onUpdate(updated);
      } else if (onSave) {
        const input: CreateVariantInput = {
          variant_id: variantId,
          target_url: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
          priority,
          weight,
          enabled,
          conditions: conditions,
        };
        
        await onSave(input);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save variant');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDevice = (device: string) => {
    setDeviceTypes(prev =>
      prev.includes(device)
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  const removeCountry = (code: string) => {
    setCountries(countries.filter(c => c !== code));
  };

  const toggleDay = (day: number) => {
    setTimeWindow(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  return (
    <>
      <div className="panel p-6">
        <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          {isEditing ? `Edit: ${variant.variant_id}` : 'Create New Variant'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Variant ID */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Variant ID
            </label>
            <input
              type="text"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              className="input-field"
              placeholder="variant-mobile-us"
              disabled={isEditing}
              required
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Target URL
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/landing"
              required
            />
          </div>

          {/* Priority & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Priority <span style={{ color: 'var(--foreground-muted)' }}>(higher = preferred)</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>
                <span>0</span>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>{priority}</span>
                <span>100</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Weight <span style={{ color: 'var(--foreground-muted)' }}>(for random selection)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="input-field"
              />
            </div>
          </div>

          {/* Enabled Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border-secondary)]'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
            <span style={{ color: 'var(--foreground)' }}>
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {/* Conditions Section */}
          <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-medium mb-4" style={{ color: 'var(--foreground)' }}>
              🎯 Targeting Conditions
            </h4>
            
            {/* Device Types */}
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                📱 Device Types <span style={{ color: 'var(--foreground-muted)' }}>(leave empty for all)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {['mobile', 'desktop', 'tablet'].map((device) => (
                  <button
                    key={device}
                    type="button"
                    onClick={() => toggleDevice(device)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      deviceTypes.includes(device)
                        ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                        : 'border-[var(--border-secondary)] hover:border-[var(--accent)]'
                    }`}
                    style={!deviceTypes.includes(device) ? { color: 'var(--foreground-secondary)' } : {}}
                  >
                    {device === 'mobile' && '📱'}
                    {device === 'desktop' && '💻'}
                    {device === 'tablet' && '📟'}
                    {' '}{device}
                  </button>
                ))}
              </div>
            </div>

            {/* Countries with Map Selector */}
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                🌍 Countries
              </label>
              <button
                type="button"
                onClick={() => setShowMapSelector(true)}
                className="btn btn-secondary px-4 py-2 w-full justify-center"
              >
                🗺️ Select Countries on Map ({countries.length} selected)
              </button>
              
              {countries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {countries.map((code) => (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: 'rgba(0, 200, 83, 0.2)',
                        color: 'var(--accent)'
                      }}
                    >
                      🌍 {getCountryName(code)} ({code})
                      <button
                        type="button"
                        onClick={() => removeCountry(code)}
                        className="hover:opacity-70 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time Windows */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                  ⏰ Time Window
                </label>
                <button
                  type="button"
                  onClick={() => setEnableTimeWindow(!enableTimeWindow)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    enableTimeWindow ? 'bg-[var(--accent)]' : 'bg-[var(--border-secondary)]'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    enableTimeWindow ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {enableTimeWindow && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)' }}>
                  {/* Days Selection */}
                  <div className="mb-4">
                    <span className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>Active Days</span>
                    <div className="flex gap-1">
                      {DAY_NAMES.map((name, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleDay(idx)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            timeWindow.days.includes(idx)
                              ? 'bg-[var(--accent)] text-black'
                              : 'hover:opacity-80'
                          }`}
                          style={!timeWindow.days.includes(idx) ? { 
                            backgroundColor: 'var(--background-tertiary)',
                            color: 'var(--foreground-muted)'
                          } : {}}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>Start Time</span>
                      <button
                        type="button"
                        onClick={() => setShowTimePicker(showTimePicker === 'start' ? null : 'start')}
                        className="w-full px-3 py-2 rounded-lg text-left transition-colors"
                        style={{
                          backgroundColor: showTimePicker === 'start' ? 'rgba(0, 200, 83, 0.15)' : 'var(--background-tertiary)',
                          border: `1px solid ${showTimePicker === 'start' ? 'var(--accent)' : 'var(--border)'}`,
                          color: 'var(--foreground)'
                        }}
                      >
                        🕐 {formatTime(timeWindow.startTime)}
                      </button>
                      {showTimePicker === 'start' && (
                        <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                          <AnalogClockPicker
                            value={timeWindow.startTime}
                            onChange={(newTime) => setTimeWindow(prev => ({ ...prev, startTime: newTime }))}
                            label="Start Time"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>End Time</span>
                      <button
                        type="button"
                        onClick={() => setShowTimePicker(showTimePicker === 'end' ? null : 'end')}
                        className="w-full px-3 py-2 rounded-lg text-left transition-colors"
                        style={{
                          backgroundColor: showTimePicker === 'end' ? 'rgba(0, 200, 83, 0.15)' : 'var(--background-tertiary)',
                          border: `1px solid ${showTimePicker === 'end' ? 'var(--accent)' : 'var(--border)'}`,
                          color: 'var(--foreground)'
                        }}
                      >
                        🕐 {formatTime(timeWindow.endTime)}
                      </button>
                      {showTimePicker === 'end' && (
                        <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                          <AnalogClockPicker
                            value={timeWindow.endTime}
                            onChange={(newTime) => setTimeWindow(prev => ({ ...prev, endTime: newTime }))}
                            label="End Time"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Variant' : 'Create Variant'}
            </button>
          </div>
        </form>
      </div>

      {/* World Map Selector Modal */}
      <WorldMapSelector
        selectedCountries={countries}
        onCountriesChange={setCountries}
        isOpen={showMapSelector}
        onClose={() => setShowMapSelector(false)}
      />
    </>
  );
}
