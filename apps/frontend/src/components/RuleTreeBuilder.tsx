// ============================================
// SMART LINK HUB - Rule Tree Builder
// Visual editor for decision trees
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Variant, RuleTree, DecisionNode, LeafNode } from '@/types';
import { getRuleTree, updateRuleTree, invalidateRuleTreeCache, ApiError } from '@/lib/api-client';
import WorldMapSelector, { getCountryName } from './WorldMapSelector';

interface RuleTreeBuilderProps {
  hubId: string;
  variants: Variant[];
}

export default function RuleTreeBuilder({ hubId, variants }: RuleTreeBuilderProps) {
  const [ruleTree, setRuleTree] = useState<RuleTree | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; ttl_seconds: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tree editing state
  const [treeName, setTreeName] = useState('');
  const [rootNode, setRootNode] = useState<DecisionNode | null>(null);

  // Fetch rule tree
  const fetchRuleTree = useCallback(async () => {
    setIsLoading(true);
    try {
      const { ruleTree: tree, cache } = await getRuleTree(hubId);
      setRuleTree(tree);
      setCacheInfo(cache);
      if (tree) {
        setTreeName(tree.name);
        setRootNode(tree.root);
      } else {
        // Initialize with default leaf node
        setTreeName('Main Decision Tree');
        setRootNode({
          type: 'leaf',
          variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
        });
      }
    } catch (err) {
      // 404 = no rule tree yet — initialize with defaults
      if (err instanceof ApiError && err.status === 404) {
        setTreeName('Main Decision Tree');
        setRootNode({
          type: 'leaf',
          variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
        });
      } else {
        console.error('Failed to fetch rule tree:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hubId, variants]);

  useEffect(() => {
    fetchRuleTree();
  }, [fetchRuleTree]);

  // Save tree
  const handleSave = async () => {
    if (!rootNode) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateRuleTree(hubId, {
        name: treeName,
        root: rootNode,
      });
      setRuleTree(result.ruleTree);
      setSuccess(`Saved! Version: ${result.version}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save rule tree');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Invalidate cache
  const handleInvalidateCache = async () => {
    try {
      await invalidateRuleTreeCache(hubId);
      setCacheInfo({ cached: false, ttl_seconds: 0 });
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
  };

  // Update root node type
  const changeNodeType = (type: DecisionNode['type']) => {
    switch (type) {
      case 'leaf':
        setRootNode({
          type: 'leaf',
          variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
        });
        break;
      case 'device':
        setRootNode({
          type: 'device',
          device_branches: {
            default: {
              type: 'leaf',
              variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
            },
          },
        });
        break;
      case 'location':
        setRootNode({
          type: 'location',
          country_branches: {},
          default_node: {
            type: 'leaf',
            variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
          },
        });
        break;
      case 'time':
        setRootNode({
          type: 'time',
          time_windows: [],
          time_default_node: {
            type: 'leaf',
            variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
          },
        });
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#111] rounded-xl border border-[#222] p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#9A9A9A]">Loading rule tree...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111] rounded-xl border border-[#222] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Rule Tree</h2>
            <p className="text-[#666] text-sm">
              Define how visitors are routed to variants
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {cacheInfo && (
              <div className="text-xs text-[#666]">
                {cacheInfo.cached ? (
                  <span className="text-yellow-500">Cached ({cacheInfo.ttl_seconds}s TTL)</span>
                ) : (
                  <span className="text-green-500">Not cached</span>
                )}
                <button
                  onClick={handleInvalidateCache}
                  className="ml-2 text-[#00C853] hover:underline"
                >
                  Invalidate
                </button>
              </div>
            )}
            {ruleTree && (
              <span className="text-xs bg-[#222] text-[#9A9A9A] px-2 py-1 rounded">
                v{ruleTree.version}
              </span>
            )}
          </div>
        </div>

        {/* Tree Name */}
        <div className="mb-4">
          <label className="block text-[#9A9A9A] text-sm mb-2">Tree Name</label>
          <input
            type="text"
            value={treeName}
            onChange={(e) => setTreeName(e.target.value)}
            className="input-field max-w-md"
            placeholder="Main Decision Tree"
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}
      </div>

      {/* Node Type Selector */}
      <div className="bg-[#111] rounded-xl border border-[#222] p-6">
        <h3 className="text-white font-medium mb-4">Root Node Type</h3>
        <div className="flex gap-2">
          {(['leaf', 'device', 'location', 'time'] as const).map((type) => (
            <button
              key={type}
              onClick={() => changeNodeType(type)}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                rootNode?.type === type
                  ? 'bg-[#00C853] text-black border-[#00C853]'
                  : 'border-[#333] text-[#9A9A9A] hover:border-[#00C853]'
              }`}
            >
              {type === 'leaf' && 'Leaf (Direct)'}
              {type === 'device' && 'Device Branch'}
              {type === 'location' && 'Location Branch'}
              {type === 'time' && 'Time Branch'}
            </button>
          ))}
        </div>
      </div>

      {/* Node Editor */}
      {rootNode && (
        <div className="bg-[#111] rounded-xl border border-[#222] p-6">
          <NodeEditor
            node={rootNode}
            onChange={setRootNode}
            variants={variants}
            depth={0}
          />
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary py-3 px-8 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Rule Tree'}
        </button>
      </div>
    </div>
  );
}

// ==================== Node Editor Component ====================

interface NodeEditorProps {
  node: DecisionNode;
  onChange: (node: DecisionNode) => void;
  variants: Variant[];
  depth: number;
}

function NodeEditor({ node, onChange, variants, depth }: NodeEditorProps) {
  switch (node.type) {
    case 'leaf':
      return <LeafEditor node={node} onChange={onChange} variants={variants} />;
    case 'device':
      return <DeviceEditor node={node} onChange={onChange} variants={variants} depth={depth} />;
    case 'location':
      return <LocationEditor node={node} onChange={onChange} variants={variants} depth={depth} />;
    case 'time':
      return <TimeEditor node={node} onChange={onChange} variants={variants} depth={depth} />;
    default:
      return <div className="text-red-400">Unknown node type</div>;
  }
}

// ==================== Leaf Node Editor ====================

function LeafEditor({ 
  node, 
  onChange, 
  variants 
}: { 
  node: LeafNode; 
  onChange: (node: LeafNode) => void; 
  variants: Variant[];
}) {
  const toggleVariant = (variantId: string) => {
    const newIds = node.variant_ids.includes(variantId)
      ? node.variant_ids.filter(id => id !== variantId)
      : [...node.variant_ids, variantId];
    onChange({ ...node, variant_ids: newIds });
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3">Select Variants</h4>
      <p className="text-[#666] text-sm mb-4">
        Choose which variants to serve when this leaf is reached
      </p>
      <div className="grid grid-cols-2 gap-2">
        {variants.map((v) => (
          <button
            key={v.variant_id}
            onClick={() => toggleVariant(v.variant_id)}
            className={`p-3 rounded-lg border text-left text-sm transition-colors ${
              node.variant_ids.includes(v.variant_id)
                ? 'bg-[#00C853]/20 border-[#00C853] text-white'
                : 'border-[#333] text-[#9A9A9A] hover:border-[#00C853]/50'
            }`}
          >
            <div className="font-medium">{v.variant_id}</div>
            <div className="text-xs truncate opacity-60">{v.target_url}</div>
          </button>
        ))}
        {variants.length === 0 && (
          <p className="text-[#666] col-span-2">No variants available. Create some first!</p>
        )}
      </div>
    </div>
  );
}

// ==================== Device Branch Editor ====================

function DeviceEditor({ 
  node, 
  onChange, 
  variants,
  depth 
}: { 
  node: Extract<DecisionNode, { type: 'device' }>; 
  onChange: (node: DecisionNode) => void; 
  variants: Variant[];
  depth: number;
}) {
  const devices = ['mobile', 'desktop', 'tablet', 'default'] as const;
  
  const setBranchVariants = (device: string, variantIds: string[]) => {
    const newBranches = { ...node.device_branches };
    newBranches[device as keyof typeof newBranches] = {
      type: 'leaf',
      variant_ids: variantIds,
    };
    onChange({ ...node, device_branches: newBranches });
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3">Device Branches</h4>
      <p className="text-[#666] text-sm mb-4">
        Route visitors based on their device type
      </p>
      <div className="space-y-4">
        {devices.map((device) => {
          const branch = node.device_branches[device];
          const selectedIds = branch?.type === 'leaf' ? branch.variant_ids : [];
          
          return (
            <div key={device} className="p-4 bg-black/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium capitalize">
                  {device === 'default' ? 'Default' : device}
                </span>
              </div>
              <select
                multiple
                value={selectedIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, o => o.value);
                  setBranchVariants(device, selected);
                }}
                className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-white text-sm"
                size={Math.min(variants.length, 4)}
              >
                {variants.map((v) => (
                  <option key={v.variant_id} value={v.variant_id}>
                    {v.variant_id}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== Location Branch Editor ====================

function LocationEditor({ 
  node, 
  onChange, 
  variants,
  depth 
}: { 
  node: Extract<DecisionNode, { type: 'location' }>; 
  onChange: (node: DecisionNode) => void; 
  variants: Variant[];
  depth: number;
}) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Get current country codes from branches
  const selectedCountries = Object.keys(node.country_branches);

  // Handle countries change from WorldMapSelector
  const handleCountriesChange = (countries: string[]) => {
    const newBranches: typeof node.country_branches = {};
    
    // Keep existing branches for countries that are still selected
    countries.forEach((code) => {
      if (node.country_branches[code]) {
        newBranches[code] = node.country_branches[code];
      } else {
        // Add new branch for newly selected country
        newBranches[code] = {
          type: 'leaf',
          variant_ids: variants.length > 0 ? [variants[0].variant_id] : [],
        };
      }
    });
    
    onChange({
      ...node,
      country_branches: newBranches,
    });
  };

  const removeCountryBranch = (code: string) => {
    const newBranches = { ...node.country_branches };
    delete newBranches[code];
    onChange({ ...node, country_branches: newBranches });
  };

  const setCountryVariants = (code: string, variantIds: string[]) => {
    onChange({
      ...node,
      country_branches: {
        ...node.country_branches,
        [code]: { type: 'leaf', variant_ids: variantIds },
      },
    });
  };

  const setDefaultVariants = (variantIds: string[]) => {
    onChange({
      ...node,
      default_node: { type: 'leaf', variant_ids: variantIds },
    });
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3">Location Branches</h4>
      <p className="text-[#666] text-sm mb-4">
        Route visitors based on their country
      </p>

      {/* Open Map Button */}
      <div className="mb-4">
        <button 
          onClick={() => setIsMapOpen(true)} 
          className="btn btn-primary px-6 py-3 flex items-center gap-2"
        >
          <span>Map</span>
          <span>Select Countries from Map</span>
          {selectedCountries.length > 0 && (
            <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-full text-sm">
              {selectedCountries.length} selected
            </span>
          )}
        </button>
      </div>

      {/* WorldMapSelector Modal */}
      <WorldMapSelector
        selectedCountries={selectedCountries}
        onCountriesChange={handleCountriesChange}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      {/* Country Branches */}
      <div className="space-y-3">
        {Object.entries(node.country_branches).map(([code, branch]) => {
          const selectedIds = branch.type === 'leaf' ? branch.variant_ids : [];
          return (
            <div key={code} className="p-4 bg-black/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">
                  {getCountryName(code)} <span className="text-[#666]">({code})</span>
                </span>
                <button
                  onClick={() => removeCountryBranch(code)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <select
                multiple
                value={selectedIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, o => o.value);
                  setCountryVariants(code, selected);
                }}
                className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-white text-sm"
                size={Math.min(variants.length, 3)}
              >
                {variants.map((v) => (
                  <option key={v.variant_id} value={v.variant_id}>{v.variant_id}</option>
                ))}
              </select>
            </div>
          );
        })}

        {selectedCountries.length === 0 && (
          <div className="p-6 border border-dashed border-[#333] rounded-lg text-center">
            <p className="text-[#666]">No countries selected yet.</p>
            <p className="text-[#666] text-sm mt-1">Click the button above to select countries from the map.</p>
          </div>
        )}

        {/* Default */}
        <div className="p-4 bg-black/30 rounded-lg border border-dashed border-[#333]">
          <span className="text-white font-medium">Default (other countries)</span>
          <select
            multiple
            value={node.default_node?.type === 'leaf' ? node.default_node.variant_ids : []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, o => o.value);
              setDefaultVariants(selected);
            }}
            className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-white text-sm mt-2"
            size={Math.min(variants.length, 3)}
          >
            {variants.map((v) => (
              <option key={v.variant_id} value={v.variant_id}>{v.variant_id}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ==================== Time Branch Editor (Simplified) ====================

function TimeEditor({ 
  node, 
  onChange, 
  variants,
  depth 
}: { 
  node: Extract<DecisionNode, { type: 'time' }>; 
  onChange: (node: DecisionNode) => void; 
  variants: Variant[];
  depth: number;
}) {
  const setDefaultVariants = (variantIds: string[]) => {
    onChange({
      ...node,
      time_default_node: { type: 'leaf', variant_ids: variantIds },
    });
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3">⏰ Time-Based Routing</h4>
      <p className="text-[#666] text-sm mb-4">
        Time-based routing requires more complex configuration. 
        For now, set a default variant.
      </p>

      <div className="p-4 bg-black/30 rounded-lg">
        <span className="text-white font-medium">Default Variant</span>
        <select
          multiple
          value={node.time_default_node?.type === 'leaf' ? node.time_default_node.variant_ids : []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, o => o.value);
            setDefaultVariants(selected);
          }}
          className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-white text-sm mt-2"
          size={Math.min(variants.length, 4)}
        >
          {variants.map((v) => (
            <option key={v.variant_id} value={v.variant_id}>{v.variant_id}</option>
          ))}
        </select>
      </div>

      <p className="text-[#666] text-xs mt-4 italic">
        Note: For advanced time windowing, configure the rule tree via API.
      </p>
    </div>
  );
}
