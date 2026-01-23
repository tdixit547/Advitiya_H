// ============================================
// SMART LINK HUB - TypeScript Type Definitions
// ============================================

// ==================== Database Models ====================

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ThemeConfig {
  bg: string;
  accent: string;
  textColor: string;
}

export interface Hub {
  id: number;
  user_id: number;
  slug: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  theme_config: ThemeConfig;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Link {
  id: number;
  hub_id: number;
  title: string;
  url: string;
  icon: string | null;
  priority: number;
  click_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ==================== Rule Types ====================

export type RuleType = 'TIME' | 'DEVICE' | 'LOCATION';
export type RuleAction = 'SHOW' | 'HIDE';

export interface TimeConditions {
  startHour: number; // 0-23
  endHour: number;   // 0-23
  timezone?: string; // e.g., "Asia/Kolkata"
  days?: number[];   // 0 = Sunday, 6 = Saturday
}

export interface DeviceConditions {
  device: 'mobile' | 'desktop' | 'tablet';
  os?: 'ios' | 'android' | 'windows' | 'macos' | 'linux';
}

export interface LocationConditions {
  country?: string;    // Single country code (e.g., "IN")
  countries?: string[]; // Multiple country codes (e.g., ["US", "UK"])
}

export type RuleConditions = TimeConditions | DeviceConditions | LocationConditions;

export interface LinkRule {
  id: number;
  link_id: number;
  rule_type: RuleType;
  conditions: RuleConditions;
  action: RuleAction;
  is_active: boolean;
  created_at: Date;
}

// Combined link with its rules
export interface LinkWithRules extends Link {
  rules: LinkRule[];
}

// ==================== Visitor Context ====================

export interface VisitorContext {
  ip: string;
  userAgent: string;
  device: 'mobile' | 'desktop' | 'tablet';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  country: string | null; // ISO 2-letter country code
  currentHour: number;    // 0-23 in visitor's timezone
  currentDay: number;     // 0 = Sunday, 6 = Saturday
  timezone: string;
  referrer: string | null;
}

// ==================== Analytics ====================

export type EventType = 'VIEW' | 'CLICK';

export interface AnalyticsEvent {
  id?: number;
  hub_id: number;
  link_id: number | null; // NULL for page views
  event_type: EventType;
  visitor_ip: string | null;
  visitor_country: string | null;
  visitor_device: string | null;
  visitor_user_agent: string | null;
  referrer: string | null;
  created_at?: Date;
}

export interface AnalyticsStats {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: {
    id: number;
    title: string;
    clicks: number;
    ctr: number; // Click-through rate
  }[];
  viewsByDay: {
    date: string;
    views: number;
    clicks: number;
  }[];
  viewsByCountry: {
    country: string;
    count: number;
  }[];
  viewsByDevice: {
    device: string;
    count: number;
  }[];
}

// ==================== API Types ====================

export interface CreateLinkInput {
  hub_id: number;
  title: string;
  url: string;
  icon?: string;
  priority?: number;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  icon?: string;
  priority?: number;
  is_active?: boolean;
}

export interface CreateRuleInput {
  link_id: number;
  rule_type: RuleType;
  conditions: RuleConditions;
  action?: RuleAction;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== Hub Page Props ====================

export interface HubPageData {
  hub: Hub;
  links: LinkWithRules[];
  filteredLinks: Link[]; // After rule evaluation
}
