// ============================================
// SMART LINK HUB - API Client
// Centralized API utility with auth handling
// ============================================

import { API_BASE_URL } from '@/types';

// ==================== Token Management ====================

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser<T>(user: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ==================== API Error Class ====================

export class ApiError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// ==================== Core API Request Function ====================

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...rest } = options;

  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders as Record<string, string>,
  };

  // Add auth header if token exists and not skipped
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || '60';
    throw new ApiError(
      `Too many requests. Try again in ${retryAfter} seconds.`,
      429
    );
  }

  // Handle unauthorized - redirect to login
  if (response.status === 401) {
    // For auth endpoints (login/register), pass through the actual backend error
    if (endpoint.includes('/auth/')) {
      let errorMessage = 'Authentication failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response body is not valid JSON, use default message
      }
      throw new ApiError(errorMessage, 401);
    }

    removeStoredToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Session expired. Please login again.', 401);
  }

  // Parse response
  let data: T | { error: string; details?: Record<string, string> };

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError('Request failed', response.status);
    }
    return {} as T;
  }

  // Handle errors
  if (!response.ok) {
    const errorData = data as { error: string; details?: Record<string, string> };
    throw new ApiError(
      errorData.error || 'Request failed',
      response.status,
      errorData.details
    );
  }

  return data as T;
}

// ==================== Auth API Functions ====================

import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User
} from '@/types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });

  setStoredToken(response.token);
  setStoredUser(response.user);

  return response;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });

  setStoredToken(response.token);
  setStoredUser(response.user);

  return response;
}

export async function verifyToken(): Promise<{ valid: boolean; user?: User }> {
  try {
    const response = await apiRequest<{ valid: boolean; user: User }>('/api/auth/verify');
    return response;
  } catch {
    return { valid: false };
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/me');
}

export function logout(): void {
  removeStoredToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ==================== Hub API Functions ====================

import type { LinkHub, CreateHubInput, UpdateHubInput } from '@/types';

export async function getHubs(): Promise<LinkHub[]> {
  return apiRequest<LinkHub[]>('/api/admin/hubs');
}

export async function getHub(hubId: string): Promise<LinkHub> {
  return apiRequest<LinkHub>(`/api/admin/hubs/${hubId}`);
}

export async function createHub(input: CreateHubInput): Promise<LinkHub> {
  return apiRequest<LinkHub>('/api/admin/hubs', {
    method: 'POST',
    body: input,
  });
}

export async function updateHub(hubId: string, input: UpdateHubInput): Promise<LinkHub> {
  return apiRequest<LinkHub>(`/api/admin/hubs/${hubId}`, {
    method: 'PUT',
    body: input,
  });
}

export async function deleteHub(hubId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/admin/hubs/${hubId}`, {
    method: 'DELETE',
  });
}

// ==================== Variant API Functions ====================

import type { Variant, CreateVariantInput, UpdateVariantInput } from '@/types';

export async function getVariants(hubId: string): Promise<Variant[]> {
  return apiRequest<Variant[]>(`/api/admin/hubs/${hubId}/variants`);
}

export async function createVariant(hubId: string, input: CreateVariantInput): Promise<Variant> {
  return apiRequest<Variant>(`/api/admin/hubs/${hubId}/variants`, {
    method: 'POST',
    body: input,
  });
}

export async function updateVariant(
  hubId: string,
  variantId: string,
  input: UpdateVariantInput
): Promise<Variant> {
  return apiRequest<Variant>(`/api/admin/hubs/${hubId}/variants/${variantId}`, {
    method: 'PUT',
    body: input,
  });
}

export async function deleteVariant(hubId: string, variantId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/admin/hubs/${hubId}/variants/${variantId}`, {
    method: 'DELETE',
  });
}

// ==================== Rule Tree API Functions ====================

import type { RuleTree, CreateRuleTreeInput } from '@/types';

export async function getRuleTree(hubId: string): Promise<{
  ruleTree: RuleTree | null;
  cache: { cached: boolean; ttl_seconds: number }
}> {
  return apiRequest(`/api/admin/hubs/${hubId}/tree`);
}

export async function updateRuleTree(
  hubId: string,
  input: CreateRuleTreeInput
): Promise<{ message: string; version: number; ruleTree: RuleTree }> {
  return apiRequest(`/api/admin/hubs/${hubId}/tree`, {
    method: 'PUT',
    body: input,
  });
}

export async function invalidateRuleTreeCache(hubId: string): Promise<{ message: string }> {
  return apiRequest(`/api/admin/hubs/${hubId}/tree/invalidate`, {
    method: 'POST',
  });
}

// ==================== Analytics API Functions ====================

import type { HubStats, VariantStats } from '@/types';

export async function getHubStats(hubId: string): Promise<HubStats> {
  return apiRequest<HubStats>(`/api/admin/hubs/${hubId}/stats`);
}

export async function forceAggregateStats(hubId: string): Promise<{
  message: string;
  stats: VariantStats[]
}> {
  return apiRequest(`/api/admin/hubs/${hubId}/stats/aggregate`, {
    method: 'POST',
  });
}

// ==================== Analytics API Functions ====================

export interface AnalyticsOverview {
  success: boolean;
  data: {
    total_visits: number;
    unique_users: number;
    total_sessions: number;
    total_clicks: number;
    average_ctr: number;
    top_performing_link: { link_id: string; name: string; clicks: number } | null;
    traffic_trend: 'up' | 'down' | 'stable';
    trend_percentage: number;
  };
  meta: { hub_id: string; time_window: string; generated_at: string };
}

export interface TimeSeriesPoint {
  timestamp: string;
  visits: number;
  clicks: number;
}

export interface AnalyticsTimeseries {
  success: boolean;
  data: TimeSeriesPoint[];
  meta: { hub_id: string; time_window: string; data_points: number; generated_at: string };
}

export interface LinkPerformance {
  link_id: string;
  variant_id: string;
  name: string;
  target_url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  rank_score: number;
}

export interface AnalyticsLinks {
  success: boolean;
  data: LinkPerformance[];
  meta: { hub_id: string; time_window: string; total_links: number; generated_at: string };
}

export interface AnalyticsSegments {
  success: boolean;
  data: {
    devices: { type: string; count: number; percentage: number }[];
    locations: { location: string; count: number; percentage: number }[];
  };
  meta: { hub_id: string; time_window: string; generated_at: string };
}

export interface AnalyticsHeatmap {
  success: boolean;
  data: {
    data: { hour: number; day: number; value: number }[];
  };
  meta: { hub_id: string; time_window: string; generated_at: string };
}

export type TimeRange = '1h' | '24h' | '7d' | 'lifetime';

export async function getHubAnalyticsOverview(hubId: string, range: TimeRange = '24h'): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>(`/api/analytics/hub/${hubId}/overview?range=${range}`);
}

export async function getHubAnalyticsTimeseries(hubId: string, range: TimeRange = '24h'): Promise<AnalyticsTimeseries> {
  return apiRequest<AnalyticsTimeseries>(`/api/analytics/hub/${hubId}/timeseries?range=${range}`);
}

export async function getHubAnalyticsLinks(hubId: string, range: TimeRange = '24h'): Promise<AnalyticsLinks> {
  return apiRequest<AnalyticsLinks>(`/api/analytics/hub/${hubId}/links?range=${range}`);
}

export async function getHubAnalyticsSegments(hubId: string, range: TimeRange = '24h'): Promise<AnalyticsSegments> {
  return apiRequest<AnalyticsSegments>(`/api/analytics/hub/${hubId}/segments?range=${range}`);
}

export async function getHubAnalyticsHeatmap(hubId: string, range: TimeRange = '7d'): Promise<AnalyticsHeatmap> {
  return apiRequest<AnalyticsHeatmap>(`/api/analytics/hub/${hubId}/heatmap?range=${range}`);
}

// ==================== Performance Classification API ====================

export interface PerformanceLink {
  link_id: string;
  link_name: string;
  target_url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  rank_score: number;
  performance_score: number;
}

export interface PerformanceClassification {
  success: boolean;
  topLinks: PerformanceLink[];
  leastLinks: PerformanceLink[];
  meta: {
    hub_id: string;
    time_window: string;
    min_impressions_threshold: number;
    total_links_analyzed: number;
    generated_at: string;
  };
}

export async function getHubPerformanceClassification(hubId: string, range: TimeRange = '24h'): Promise<PerformanceClassification> {
  return apiRequest<PerformanceClassification>(`/api/analytics/hub/${hubId}/performance?range=${range}`);
}

// ==================== Enhanced Analytics API ====================

/** KPI Metric with day-over-day delta */
export interface KPIMetric {
  name: string;
  value: number | string;
  previousValue?: number | string;
  delta?: number;
  trend: 'up' | 'down' | 'stable';
}

/** Enhanced KPIs response */
export interface EnhancedKPIs {
  success: boolean;
  metrics: KPIMetric[];
  generated_at: string;
}

/** Trend data point */
export interface TrendDataPoint {
  period: string;
  visits: number;
  clicks: number;
  ctr: number;
}

/** Trends response */
export interface TrendsResponse {
  success: boolean;
  data: TrendDataPoint[];
  meta: { hub_id: string; granularity: string; days: number; generated_at: string };
}

/** Weekday vs Weekend analysis */
export interface WeekdayWeekendAnalysis {
  success: boolean;
  weekdayAvg: number;
  weekendAvg: number;
  percentDifference: number;
  recommendation?: string;
}

/** Country breakdown */
export interface CountryBreakdown {
  success: boolean;
  data: {
    countries: { country: string; clicks: number; percentage: number }[];
    total_clicks: number;
  };
}

/** Rule analytics */
export interface RuleAnalytics {
  success: boolean;
  data: {
    links: {
      link_id: string;
      link_name: string;
      rules: { rule_id: string; rule_reason: string; count: number; percentage: number }[];
    }[];
    total_impressions: number;
  };
}

/** Comparison metric */
export interface ComparisonMetric {
  name: string;
  before: number | string;
  after: number | string;
  changePercent: number;
}

/** Before/After comparison */
export interface BeforeAfterComparison {
  success: boolean;
  metrics: ComparisonMetric[];
}

/** Position impact analysis */
export interface PositionImpact {
  success: boolean;
  data: {
    positions: { position: number; clicks: number; impressions: number; ctr: number; percentage_of_total: number }[];
    insight: string;
  };
}

/** ML Insight */
export interface MLInsight {
  type: 'opportunity' | 'warning' | 'success' | 'info';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  confidence?: number;
}

/** ML Insights response */
export interface MLInsightsResponse {
  success: boolean;
  insights: MLInsight[];
  disclaimer?: string;
  generated_at?: string;
}

export type TimeGranularity = 'day' | 'week' | 'month';

/** Get enhanced KPIs with day-over-day deltas */
export async function getEnhancedKPIs(hubId: string): Promise<EnhancedKPIs> {
  return apiRequest<EnhancedKPIs>(`/api/analytics/hub/${hubId}/kpi`);
}

/** Get trends by granularity */
export async function getTrends(hubId: string, granularity: TimeGranularity = 'day', days: number = 30): Promise<TrendsResponse> {
  return apiRequest<TrendsResponse>(`/api/analytics/hub/${hubId}/trends?granularity=${granularity}&days=${days}`);
}

/** Get weekday vs weekend analysis */
export async function getWeekdayWeekend(hubId: string, days: number = 30): Promise<WeekdayWeekendAnalysis> {
  return apiRequest<WeekdayWeekendAnalysis>(`/api/analytics/hub/${hubId}/weekday-weekend?days=${days}`);
}

/** Get country breakdown */
export async function getCountryBreakdown(hubId: string, range: TimeRange = '7d'): Promise<CountryBreakdown> {
  return apiRequest<CountryBreakdown>(`/api/analytics/hub/${hubId}/countries?range=${range}`);
}

/** Get rule analytics */
export async function getRuleAnalytics(hubId: string, range: TimeRange = '7d'): Promise<RuleAnalytics> {
  return apiRequest<RuleAnalytics>(`/api/analytics/hub/${hubId}/rules?range=${range}`);
}

/** Get before/after comparison */
export async function getBeforeAfterComparison(hubId: string): Promise<BeforeAfterComparison> {
  return apiRequest<BeforeAfterComparison>(`/api/analytics/hub/${hubId}/compare`);
}

/** Get position impact analysis */
export async function getPositionImpact(hubId: string, range: TimeRange = '7d'): Promise<PositionImpact> {
  return apiRequest<PositionImpact>(`/api/analytics/hub/${hubId}/position-impact?range=${range}`);
}

/** Get ML insights (advisory only) */
export async function getMLInsights(hubId: string): Promise<MLInsightsResponse> {
  return apiRequest<MLInsightsResponse>(`/api/analytics/hub/${hubId}/insights`);
}

// ==================== Engagement & Ranking API Functions ====================

/** Engagement metrics */
export interface EngagementMetrics {
  success: boolean;
  data: {
    average_dwell_time: number;
    score_distribution: { low: number; medium: number; high: number };
    total_engaged_sessions: number;
  };
  meta: { hub_id: string; time_window: string; generated_at: string };
}

/** Rage click data */
export interface RageClickData {
  success: boolean;
  data: {
    rage_clicks: {
      variant_id?: string;
      element_selector: string;
      target_url: string;
      total_incidents: number;
      total_clicks: number;
      avg_clicks_per_incident: number;
      last_occurrence?: string;
    }[];
    total_incidents: number;
    most_problematic: unknown;
  };
  meta: { hub_id: string; time_window: string; generated_at: string };
}

/** Link ranking */
export interface LinkRankingData {
  success: boolean;
  data: {
    ranked_links: {
      variant_id: string;
      title: string;
      current_position: number;
      suggested_position: number;
      ranking_score: number;
      ctr: number;
      total_clicks: number;
      total_impressions: number;
      confidence: 'high' | 'medium' | 'low';
      reasoning: string;
    }[];
    total_links: number;
    recommendation: string;
  };
  meta: { hub_id: string; time_window: string; algorithm: string; generated_at: string };
}

/** Get engagement metrics (dwell time, score distribution) */
export async function getEngagementMetrics(hubId: string, range: TimeRange = '7d'): Promise<EngagementMetrics> {
  return apiRequest<EngagementMetrics>(`/api/analytics/hub/${hubId}/engagement?range=${range}`);
}

/** Get rage click incidents */
export async function getRageClicks(hubId: string, range: TimeRange = '7d'): Promise<RageClickData> {
  return apiRequest<RageClickData>(`/api/analytics/hub/${hubId}/rage-clicks?range=${range}`);
}

/** Get AI-powered link ranking */
export async function getLinkRanking(hubId: string): Promise<LinkRankingData> {
  return apiRequest<LinkRankingData>(`/api/analytics/hub/${hubId}/link-ranking`);
}

// ==================== Debug API Function ====================

import type { DebugResponse } from '@/types';

export async function getDebugInfo(slug: string): Promise<DebugResponse> {
  return apiRequest<DebugResponse>(`/${slug}/debug`, { skipAuth: true });
}
// ==================== URL Shortener API Functions ====================

export type ShortenerProvider = 'tinyurl' | 'isgd' | 'dagd' | 'clckru';

export interface ShortenResponse {
  external_short_url: string;
  original_url: string;
  provider: string;
  note?: string;
}

export interface ShortenerStatus {
  available: boolean;
  providers: string[];
}

/**
 * Shorten a hub's URL using the Python pyshorteners microservice
 */
export async function shortenHubUrl(
  hubId: string,
  provider: ShortenerProvider = 'tinyurl'
): Promise<ShortenResponse> {
  return apiRequest<ShortenResponse>(`/api/admin/hubs/${hubId}/shorten`, {
    method: 'POST',
    body: { provider },
  });
}

/**
 * Check if the Python URL shortener service is available
 */
export async function getShortenerStatus(): Promise<ShortenerStatus> {
  return apiRequest<ShortenerStatus>('/api/admin/shortener/status');
}
