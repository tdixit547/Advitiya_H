import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { analyticsAggregationService, TimeWindow } from '../services/AnalyticsAggregationService';
import { LinkHub } from '../models/LinkHub';

const router = Router();

/**
 * Validate time window parameter
 */
function parseTimeWindow(range?: string): TimeWindow {
    switch (range) {
        case '5m': return TimeWindow.FIVE_MINUTES;
        case '1h': return TimeWindow.ONE_HOUR;
        case '24h': return TimeWindow.TWENTY_FOUR_HOURS;
        case '7d': return TimeWindow.SEVEN_DAYS;
        case 'lifetime': return TimeWindow.LIFETIME;
        default: return TimeWindow.TWENTY_FOUR_HOURS;
    }
}

/**
 * Validate hub ownership
 */
async function validateHubAccess(hubId: string, userId: string): Promise<boolean> {
    const hub = await LinkHub.findOne({ hub_id: hubId, owner_id: userId });
    return hub !== null;
}

/**
 * GET /api/analytics/hub/:hubId/overview
 * Returns hub overview metrics
 */
router.get('/hub/:hubId/overview', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        // Validate access
        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const overview = await analyticsAggregationService.getHubOverview(hubId, window);

        res.json({
            success: true,
            data: overview,
            meta: {
                hub_id: hubId,
                time_window: window,
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics overview error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/timeseries
 * Returns time series data for charts
 */
router.get('/hub/:hubId/timeseries', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const timeseries = await analyticsAggregationService.getTimeSeries(hubId, window);

        res.json({
            success: true,
            data: timeseries,
            meta: {
                hub_id: hubId,
                time_window: window,
                data_points: timeseries.length,
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics timeseries error:', error);
        res.status(500).json({ error: 'Failed to fetch timeseries data' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/links
 * Returns link performance metrics
 */
router.get('/hub/:hubId/links', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const links = await analyticsAggregationService.getLinkPerformance(hubId, window);

        res.json({
            success: true,
            data: links,
            meta: {
                hub_id: hubId,
                time_window: window,
                total_links: links.length,
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics links error:', error);
        res.status(500).json({ error: 'Failed to fetch link performance' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/segments
 * Returns audience segment data (devices, locations)
 */
router.get('/hub/:hubId/segments', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const segments = await analyticsAggregationService.getSegments(hubId, window);

        res.json({
            success: true,
            data: segments,
            meta: {
                hub_id: hubId,
                time_window: window,
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics segments error:', error);
        res.status(500).json({ error: 'Failed to fetch segment data' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/heatmap
 * Returns temporal heatmap data
 */
router.get('/hub/:hubId/heatmap', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const heatmap = await analyticsAggregationService.getHeatmap(hubId, window);

        res.json({
            success: true,
            data: heatmap,
            meta: {
                hub_id: hubId,
                time_window: window,
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics heatmap error:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/performance
 * Returns top-performing and least-performing link classification
 * 
 * Performance Score = rank_score × CTR
 * - rank_score: time-decayed click count (24h half-life)
 * - CTR: clicks / impressions
 */
router.get('/hub/:hubId/performance', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const classification = await analyticsAggregationService.getPerformanceClassification(hubId, window);

        res.json({
            success: true,
            ...classification
        });
    } catch (error) {
        console.error('Analytics performance error:', error);
        res.status(500).json({ error: 'Failed to fetch performance classification' });
    }
});

// ==================== ENHANCED ANALYTICS ENDPOINTS ====================

import { enhancedAnalyticsService, TimeGranularity } from '../services/EnhancedAnalyticsService';

/**
 * GET /api/analytics/hub/:hubId/kpi
 * Returns KPIs with day-over-day deltas and trend indicators
 */
router.get('/hub/:hubId/kpi', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const kpis = await enhancedAnalyticsService.getEnhancedKPIs(hubId);

        // Transform to frontend-expected format with metrics array
        res.json({
            success: true,
            metrics: [
                { name: 'Total Visits', value: kpis.total_visits.value, previousValue: kpis.total_visits.previous_value, delta: kpis.total_visits.delta_percentage, trend: kpis.total_visits.trend },
                { name: 'Unique Users', value: kpis.unique_users.value, previousValue: kpis.unique_users.previous_value, delta: kpis.unique_users.delta_percentage, trend: kpis.unique_users.trend },
                { name: 'Average CTR', value: kpis.average_ctr.value, previousValue: kpis.average_ctr.previous_value, delta: kpis.average_ctr.delta_percentage, trend: kpis.average_ctr.trend },
                { name: 'Best Link', value: kpis.best_link?.name || 'N/A', previousValue: kpis.best_link?.clicks || 0, delta: 0, trend: 'stable' as const }
            ],
            generated_at: kpis.generated_at
        });
    } catch (error) {
        console.error('Analytics KPI error:', error);
        res.status(500).json({ error: 'Failed to fetch KPIs' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/trends
 * Returns time-based trends with granularity selector
 */
router.get('/hub/:hubId/trends', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { granularity = 'day', days = '30' } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const trends = await enhancedAnalyticsService.getTrends(
            hubId,
            granularity as TimeGranularity,
            parseInt(days as string, 10)
        );

        res.json({
            success: true,
            data: trends,
            meta: {
                hub_id: hubId,
                granularity,
                days: parseInt(days as string, 10),
                generated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics trends error:', error);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/weekday-weekend
 * Returns weekday vs weekend engagement comparison
 */
router.get('/hub/:hubId/weekday-weekend', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { days = '30' } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const analysis = await enhancedAnalyticsService.getWeekdayVsWeekend(hubId, parseInt(days as string, 10));

        // Transform to frontend-expected format
        res.json({
            success: true,
            weekdayAvg: analysis.weekday_avg_clicks,
            weekendAvg: analysis.weekend_avg_clicks,
            percentDifference: analysis.difference_percentage,
            recommendation: analysis.recommendation
        });
    } catch (error) {
        console.error('Weekday/weekend analysis error:', error);
        res.status(500).json({ error: 'Failed to fetch weekday/weekend analysis' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/countries
 * Returns country breakdown for location analytics
 */
router.get('/hub/:hubId/countries', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const countries = await enhancedAnalyticsService.getCountryBreakdown(hubId, window);

        res.json({
            success: true,
            data: countries
        });
    } catch (error) {
        console.error('Country breakdown error:', error);
        res.status(500).json({ error: 'Failed to fetch country breakdown' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/rules
 * Returns rule trigger analytics - explains why links were shown
 */
router.get('/hub/:hubId/rules', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const ruleAnalytics = await enhancedAnalyticsService.getRuleAnalytics(hubId, window);

        res.json({
            success: true,
            data: ruleAnalytics
        });
    } catch (error) {
        console.error('Rule analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch rule analytics' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/compare
 * Returns before/after comparison (last 7 days vs previous 7 days)
 */
router.get('/hub/:hubId/compare', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const comparison = await enhancedAnalyticsService.getBeforeAfterComparison(hubId);

        // Transform to frontend-expected format with metrics array
        const impressionsChangePct = comparison.previous_period.impressions > 0
            ? Math.round(((comparison.current_period.impressions - comparison.previous_period.impressions) / comparison.previous_period.impressions) * 10000) / 100
            : 0;

        res.json({
            success: true,
            metrics: [
                { name: 'Clicks', before: comparison.previous_period.clicks, after: comparison.current_period.clicks, changePercent: comparison.improvements.clicks_change_pct },
                { name: 'CTR', before: comparison.previous_period.ctr, after: comparison.current_period.ctr, changePercent: comparison.improvements.ctr_change_pct },
                { name: 'Impressions', before: comparison.previous_period.impressions, after: comparison.current_period.impressions, changePercent: impressionsChangePct }
            ]
        });
    } catch (error) {
        console.error('Before/after comparison error:', error);
        res.status(500).json({ error: 'Failed to fetch comparison data' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/position-impact
 * Returns link position impact analysis
 */
router.get('/hub/:hubId/position-impact', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const { range } = req.query;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const window = parseTimeWindow(range as string);
        const positionImpact = await enhancedAnalyticsService.getPositionImpact(hubId, window);

        res.json({
            success: true,
            data: positionImpact
        });
    } catch (error) {
        console.error('Position impact error:', error);
        res.status(500).json({ error: 'Failed to fetch position impact data' });
    }
});

/**
 * GET /api/analytics/hub/:hubId/insights
 * Returns ML-generated insights and recommendations (advisory only)
 */
router.get('/hub/:hubId/insights', requireAuth, async (req: Request, res: Response) => {
    try {
        const { hubId } = req.params;
        const userId = (req as any).user?.userId;

        if (!await validateHubAccess(hubId, userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const rawInsights = await enhancedAnalyticsService.generateMLInsights(hubId);

        // Transform to frontend-expected format
        const insights = rawInsights.map(i => ({
            type: i.type === 'performance' ? 'success' : i.type === 'timing' ? 'opportunity' : i.type === 'device' ? 'info' : 'opportunity',
            priority: i.priority,
            title: i.type.charAt(0).toUpperCase() + i.type.slice(1) + ' Insight',
            description: i.message,
            action: i.priority === 'high' ? 'Review and optimize' : undefined,
            confidence: i.priority === 'high' ? 85 : i.priority === 'medium' ? 70 : 55
        }));

        res.json({
            success: true,
            insights,
            disclaimer: 'These are advisory recommendations only. No automatic changes are made.',
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('ML insights error:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

export default router;


