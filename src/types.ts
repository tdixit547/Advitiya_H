// ============================================
// SMART LINK HUB - TypeScript Type Definitions
// Backend-aligned data models
// ============================================

// ==================== API Configuration ====================

<<<<<<< Updated upstream
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
=======
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
>>>>>>> Stashed changes

// ==================== User Model ====================

export interface User {
  user_id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

// ==================== Hub Model ====================

export interface Theme {
  bg: string;
  accent: string;
}

export interface LinkHub {
  hub_id: string;
  slug: string;
  default_url: string;
  theme: Theme;
  rule_tree_id?: string;
  owner_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateHubInput {
  hub_id: string;
  slug: string;
  default_url: string;
  theme: Theme;
}

export interface UpdateHubInput {
  slug?: string;
  default_url?: string;
  theme?: Theme;
}

// ==================== Variant Model ====================

export interface TimeWindow {
  branch_id: string;
  recurring?: {
    days: number[]; // 0 = Sunday, 6 = Saturday
    start_time: string; // "HH:mm"
    end_time: string; // "HH:mm"
    timezone: string; // e.g., "America/New_York"
  };
}

export interface VariantConditions {
  device_types?: ('mobile' | 'desktop' | 'tablet')[];
  countries?: string[]; // ISO 2-letter codes
  time_windows?: TimeWindow[];
}

export interface Variant {
  variant_id: string;
  hub_id: string;
  target_url: string;
  priority: number;
  weight: number;
  enabled: boolean;
  conditions?: VariantConditions;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVariantInput {
  variant_id: string;
  target_url: string;
  priority?: number;
  weight?: number;
  enabled?: boolean;
  conditions?: VariantConditions;
}

export interface UpdateVariantInput {
  target_url?: string;
  priority?: number;
  weight?: number;
  enabled?: boolean;
  conditions?: VariantConditions;
}

// ==================== Rule Tree Model ====================

export type DecisionNodeType = 'device' | 'location' | 'time' | 'leaf';

export interface LeafNode {
  type: 'leaf';
  variant_ids: string[];
}

export interface DeviceNode {
  type: 'device';
  device_branches: {
    mobile?: DecisionNode;
    desktop?: DecisionNode;
    tablet?: DecisionNode;
    default?: DecisionNode;
  };
}

export interface LocationNode {
  type: 'location';
  country_branches: Record<string, DecisionNode>;
  default_node?: DecisionNode;
}

export interface TimeNode {
  type: 'time';
  time_windows: {
    branch_id: string;
    node: DecisionNode;
    recurring?: {
      days: number[];
      start_time: string;
      end_time: string;
      timezone: string;
    };
  }[];
  time_default_node?: DecisionNode;
}

export type DecisionNode = LeafNode | DeviceNode | LocationNode | TimeNode;

export interface RuleTree {
  _id?: string;
  name: string;
  hub_id: string;
  root: DecisionNode;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRuleTreeInput {
  name: string;
  root: DecisionNode;
}

// ==================== Analytics Model ====================

export type EventType = 'impression' | 'click';

export interface VariantStats {
  variant_id: string;
  hub_id: string;
  clicks: number;
  impressions: number;
  ctr: number;
  score: number;
  recent_clicks_hour: number;
  last_updated: string;
}

export interface HubStats {
  aggregated: {
    total_clicks: number;
    total_impressions: number;
    average_ctr: number;
    variant_count: number;
  };
  variants: VariantStats[];
}

// ==================== Debug/Resolution Types ====================

export interface DebugResponse {
  hub: LinkHub;
  context: {
    userAgent: string;
    country: string;
    lat: number;
    lon: number;
    timestamp: string;
    device: {
      type: string;
      browser: string;
      os: string;
    };
  };
  cache: {
    cached: boolean;
    ttl_seconds: number;
  };
  resolution: {
    tree_found: boolean;
    leaf_variant_ids: string[];
    resolved_variant: Variant | null;
    final_url: string;
  };
}

// ==================== API Response Types ====================

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}

// ==================== Auth State Types ====================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
