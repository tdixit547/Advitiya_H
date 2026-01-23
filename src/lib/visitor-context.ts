// ============================================
// SMART LINK HUB - Visitor Context Utilities
// ============================================

import { VisitorContext } from '@/types';
import { detectDevice, detectOS, getCurrentHour, getCurrentDay } from './rule-engine';

/**
 * Extracts visitor context from Next.js headers.
 */
export async function getVisitorContext(
  headers: Headers
): Promise<VisitorContext> {
  // Get User-Agent
  const userAgent = headers.get('user-agent') || '';

  // Get IP address
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '127.0.0.1';

  // Detect device and OS from User-Agent
  const device = detectDevice(userAgent);
  const os = detectOS(userAgent);

  // Get country from IP (using free geo-ip services)
  const country = await getCountryFromIP(ip);

  // Get timezone (default to UTC, can be improved with client-side detection)
  const timezone = headers.get('x-timezone') || 'UTC';

  // Get current time in visitor's timezone
  const currentHour = getCurrentHour(timezone);
  const currentDay = getCurrentDay(timezone);

  // Get referrer
  const referrer = headers.get('referer') || null;

  return {
    ip,
    userAgent,
    device,
    os,
    country,
    currentHour,
    currentDay,
    timezone,
    referrer,
  };
}

/**
 * Gets country code from IP address using free geo-ip services.
 * Falls back gracefully if services are unavailable.
 */
async function getCountryFromIP(ip: string): Promise<string | null> {
  // Skip for localhost/private IPs
  if (isPrivateIP(ip)) {
    return null;
  }

  try {
    // Using ip-api.com (free, no API key required, 45 req/min limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      return data.countryCode || null;
    }
  } catch (error) {
    console.warn('Failed to get country from IP:', error);
  }

  // Fallback: Try ipapi.co
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country/`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const country = await response.text();
      return country.trim() || null;
    }
  } catch (error) {
    console.warn('Fallback geo-ip failed:', error);
  }

  return null;
}

/**
 * Checks if an IP address is private/local.
 */
function isPrivateIP(ip: string): boolean {
  // IPv4 private ranges
  if (
    ip === '127.0.0.1' ||
    ip === 'localhost' ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.20.') ||
    ip.startsWith('172.21.') ||
    ip.startsWith('172.22.') ||
    ip.startsWith('172.23.') ||
    ip.startsWith('172.24.') ||
    ip.startsWith('172.25.') ||
    ip.startsWith('172.26.') ||
    ip.startsWith('172.27.') ||
    ip.startsWith('172.28.') ||
    ip.startsWith('172.29.') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('192.168.')
  ) {
    return true;
  }

  // IPv6 localhost
  if (ip === '::1') {
    return true;
  }

  return false;
}
