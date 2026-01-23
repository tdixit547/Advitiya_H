// ============================================
// SMART LINK HUB - Rule Engine
// The core "Smart" routing logic
// ============================================

import {
  Link,
  LinkWithRules,
  LinkRule,
  VisitorContext,
  TimeConditions,
  DeviceConditions,
  LocationConditions,
} from '@/types';

/**
 * Evaluates all smart rules for a list of links based on visitor context.
 * Returns filtered and sorted links that should be displayed.
 */
export function evaluateRules(
  links: LinkWithRules[],
  context: VisitorContext
): Link[] {
  // Filter only active links
  const activeLinks = links.filter((link) => link.is_active);

  // Apply rules to each link
  const filteredLinks = activeLinks.filter((link) => {
    return shouldShowLink(link, context);
  });

  // Sort by priority (higher first) and click_count (performance-based)
  const sortedLinks = filteredLinks.sort((a, b) => {
    // Primary: priority (descending)
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    // Secondary: click_count for performance-based sorting (descending)
    return b.click_count - a.click_count;
  });

  // Return links without the rules property (clean response)
  return sortedLinks.map(({ rules, ...link }) => link);
}

/**
 * Determines if a link should be shown based on its rules and visitor context.
 */
function shouldShowLink(link: LinkWithRules, context: VisitorContext): boolean {
  // If no rules, always show
  if (!link.rules || link.rules.length === 0) {
    return true;
  }

  // Get only active rules
  const activeRules = link.rules.filter((rule) => rule.is_active);

  // If no active rules, always show
  if (activeRules.length === 0) {
    return true;
  }

  // Check each rule - if ANY rule says HIDE, hide the link
  // If a SHOW rule's condition is NOT met, also hide the link
  for (const rule of activeRules) {
    const conditionMet = evaluateRule(rule, context);

    if (rule.action === 'SHOW' && !conditionMet) {
      // SHOW rule condition not met = hide
      return false;
    }

    if (rule.action === 'HIDE' && conditionMet) {
      // HIDE rule condition met = hide
      return false;
    }
  }

  return true;
}

/**
 * Evaluates a single rule against the visitor context.
 * Returns true if the condition is satisfied.
 */
function evaluateRule(rule: LinkRule, context: VisitorContext): boolean {
  switch (rule.rule_type) {
    case 'TIME':
      return evaluateTimeRule(rule.conditions as TimeConditions, context);
    case 'DEVICE':
      return evaluateDeviceRule(rule.conditions as DeviceConditions, context);
    case 'LOCATION':
      return evaluateLocationRule(rule.conditions as LocationConditions, context);
    default:
      console.warn(`Unknown rule type: ${rule.rule_type}`);
      return true; // Unknown rules are ignored
  }
}

/**
 * Evaluates TIME-based rules.
 * Checks if current time is within the specified hours/days.
 */
function evaluateTimeRule(
  conditions: TimeConditions,
  context: VisitorContext
): boolean {
  const { startHour, endHour, days } = conditions;
  const { currentHour, currentDay } = context;

  // Check day of week if specified
  if (days && days.length > 0) {
    if (!days.includes(currentDay)) {
      return false;
    }
  }

  // Handle time ranges (handles overnight ranges like 22:00 - 06:00)
  if (startHour <= endHour) {
    // Normal range (e.g., 9 to 17)
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // Overnight range (e.g., 22 to 6)
    return currentHour >= startHour || currentHour < endHour;
  }
}

/**
 * Evaluates DEVICE-based rules.
 * Checks device type and optionally OS.
 */
function evaluateDeviceRule(
  conditions: DeviceConditions,
  context: VisitorContext
): boolean {
  const { device, os } = conditions;

  // Check device type
  if (device && device !== context.device) {
    return false;
  }

  // Check OS if specified
  if (os && os !== context.os) {
    return false;
  }

  return true;
}

/**
 * Evaluates LOCATION-based rules.
 * Checks if visitor's country matches.
 */
function evaluateLocationRule(
  conditions: LocationConditions,
  context: VisitorContext
): boolean {
  const { country, countries } = conditions;

  // If visitor country is unknown, don't apply location rules
  if (!context.country) {
    return true; // Show by default if we can't determine location
  }

  // Single country match
  if (country) {
    return context.country.toUpperCase() === country.toUpperCase();
  }

  // Multiple countries match
  if (countries && countries.length > 0) {
    return countries
      .map((c) => c.toUpperCase())
      .includes(context.country.toUpperCase());
  }

  return true;
}

// ==================== Utility Functions ====================

/**
 * Parses User-Agent string to detect device type.
 */
export function detectDevice(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const ua = userAgent.toLowerCase();

  // Check for tablets first (iPads, Android tablets)
  if (/ipad|android(?!.*mobile)/i.test(ua)) {
    return 'tablet';
  }

  // Check for mobile devices
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Parses User-Agent string to detect OS.
 */
export function detectOS(
  userAgent: string
): 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown' {
  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (/windows/i.test(ua)) return 'windows';
  if (/macintosh|mac os/i.test(ua)) return 'macos';
  if (/linux/i.test(ua)) return 'linux';

  return 'unknown';
}

/**
 * Gets current hour in a specific timezone.
 */
export function getCurrentHour(timezone: string = 'UTC'): number {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    };
    const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));
    return hour === 24 ? 0 : hour;
  } catch {
    return new Date().getHours();
  }
}

/**
 * Gets current day of week (0 = Sunday, 6 = Saturday).
 */
export function getCurrentDay(timezone: string = 'UTC'): number {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      timeZone: timezone,
    };
    const dayStr = new Intl.DateTimeFormat('en-US', options).format(now);
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    return dayMap[dayStr] ?? new Date().getDay();
  } catch {
    return new Date().getDay();
  }
}
