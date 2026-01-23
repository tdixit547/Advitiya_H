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
    removeStoredToken();
    if (typeof window !== 'undefined' && !endpoint.includes('/auth/')) {
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

// ==================== Debug API Function ====================

import type { DebugResponse } from '@/types';

export async function getDebugInfo(slug: string): Promise<DebugResponse> {
  return apiRequest<DebugResponse>(`/${slug}/debug`, { skipAuth: true });
}
