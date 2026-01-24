// ============================================
// SMART LINK HUB - Analytics Tracking API
// POST /api/analytics/track
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent, EventType } from '@/types';

import { trackEvent } from '@/lib/analytics-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hub_id,
      link_id,
      event_type,
      dwell_time_ms,
      scroll_depth_percent
    } = body;

    // Validate required fields
    if (!hub_id || !event_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate event type
    if (!['VIEW', 'CLICK'].includes(event_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Extract visitor info from headers
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const referrer = request.headers.get('referer') || null;

    // Detect device from user agent
    const device = detectDevice(userAgent);

    // Get country (simplified - would use geo-ip in production)
    const country = await getCountryFromIP(ip);

    // Calculate Engagement Score
    let engagement_score: 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
    if (dwell_time_ms !== undefined) {
      if (dwell_time_ms < 3000) engagement_score = 'LOW';
      else if (dwell_time_ms <= 20000) engagement_score = 'MEDIUM';
      else engagement_score = 'HIGH';
    }

    // Create event record
    const event: AnalyticsEvent = {
      hub_id,
      link_id: link_id || null,
      event_type: event_type as EventType,
      visitor_ip: ip,
      visitor_country: country,
      visitor_device: device,
      visitor_user_agent: userAgent,
      referrer,
      dwell_time_ms,
      scroll_depth_percent,
      engagement_score,
      created_at: new Date(),
    };

    // Store event
    await trackEvent(event);

    // TODO: In production, insert into database
    // await query(
    //   `INSERT INTO events (hub_id, link_id, event_type, visitor_ip, visitor_country, visitor_device, visitor_user_agent, referrer)
    //    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    //   [hub_id, link_id, event_type, ip, country, device, userAgent, referrer]
    // );

    console.log(`[Analytics] ${event_type} recorded for hub ${hub_id}`, {
      link_id,
      device,
      country,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to detect device
function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/ipad|android(?!.*mobile)/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Helper function to get country from IP
async function getCountryFromIP(ip: string): Promise<string | null> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
    return null;
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const data = await response.json();
      return data.countryCode || null;
    }
  } catch {
    return null;
  }
  return null;
}

// GET endpoint to retrieve events (for debugging)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hubId = searchParams.get('hub_id');

  // Dynamically import readEvents to avoid build time issues if needed, but standard import is fine
  const { readEvents } = await import('@/lib/analytics-storage');
  const events = await readEvents();

  if (!hubId) {
    return NextResponse.json({ success: true, data: events });
  }

  const filteredEvents = events.filter((e) => e.hub_id === parseInt(hubId));
  return NextResponse.json({ success: true, data: filteredEvents });
}
