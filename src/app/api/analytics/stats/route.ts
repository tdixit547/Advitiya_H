// ============================================
// SMART LINK HUB - Analytics Stats API
// GET /api/analytics/stats
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsStats } from '@/types';

// Demo stats data (replace with database queries in production)
const DEMO_STATS: AnalyticsStats = {
  totalViews: 1250,
  totalClicks: 487,
  uniqueVisitors: 892,
  topLinks: [
    { id: 1, title: '🌐 My Website', clicks: 150, ctr: 12.0 },
    { id: 2, title: '💻 GitHub', clicks: 120, ctr: 9.6 },
    { id: 3, title: '💼 LinkedIn', clicks: 100, ctr: 8.0 },
    { id: 4, title: '📅 Join Meeting', clicks: 50, ctr: 4.0 },
    { id: 5, title: '📱 Download iOS App', clicks: 40, ctr: 3.2 },
  ],
  viewsByDay: [
    { date: '2026-01-17', views: 145, clicks: 52 },
    { date: '2026-01-18', views: 178, clicks: 67 },
    { date: '2026-01-19', views: 156, clicks: 58 },
    { date: '2026-01-20', views: 189, clicks: 72 },
    { date: '2026-01-21', views: 201, clicks: 85 },
    { date: '2026-01-22', views: 223, clicks: 91 },
    { date: '2026-01-23', views: 158, clicks: 62 },
  ],
  viewsByCountry: [
    { country: 'IN', count: 456 },
    { country: 'US', count: 298 },
    { country: 'UK', count: 156 },
    { country: 'CA', count: 89 },
    { country: 'DE', count: 67 },
  ],
  viewsByDevice: [
    { device: 'mobile', count: 625 },
    { device: 'desktop', count: 512 },
    { device: 'tablet', count: 113 },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hubId = searchParams.get('hub_id');
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    // TODO: In production, query database for actual stats
    // const stats = await getStatsFromDatabase(hubId, period);

    // For demo, return mock data
    console.log(`[Analytics] Fetching stats for hub ${hubId}, period: ${period}`);

    return NextResponse.json({
      success: true,
      data: DEMO_STATS,
    });
  } catch (error) {
    console.error('[Analytics] Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
