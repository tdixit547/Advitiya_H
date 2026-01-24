import { Router, Request, Response } from 'express';
import { LinkHub } from '../models/LinkHub';
import { Variant } from '../models/Variant';
import { VariantStats } from '../models/VariantStats';
import { decisionTreeEngine, IRequestContext, IVariantWithConditions } from '../services/DecisionTreeEngine';
import { eventLogger } from '../services/EventLogger';

const router = Router();

/**
 * Main hub endpoint - Returns JSON for Link Hub profile page
 * GET /:slug - Returns profile and filtered links (NOT a redirect)
 * 
 * Event logging:
 * - Logs a HUB_VIEW when the hub is loaded
 */
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // Find the hub by slug
        const hub = await LinkHub.findOne({ slug }).lean();

        if (!hub) {
            return res.status(404).json({ error: 'Hub not found' });
        }

        // Build request context
        const context: IRequestContext = {
            userAgent: req.headers['user-agent'] || '',
            country: extractCountry(req),
            lat: parseFloat(req.query.lat as string) || 0,
            lon: parseFloat(req.query.lon as string) || 0,
            timestamp: new Date(),
        };

        // Get all variants for this hub
        const variants = await Variant.find({ 
            hub_id: hub.hub_id,
            enabled: true 
        }).lean();

        // Get stats for scoring
        const stats = await VariantStats.find({ hub_id: hub.hub_id }).lean();
        const statsMap = new Map(stats.map(s => [s.variant_id, s]));

        // Prepare variants with conditions and scores
        const variantsWithConditions: IVariantWithConditions[] = variants.map(v => ({
            variant_id: v.variant_id,
            target_url: v.target_url,
            title: v.title || v.variant_id,
            description: v.description,
            icon: v.icon,
            priority: v.priority,
            enabled: v.enabled,
            score: statsMap.get(v.variant_id)?.score || 0,
            conditions: v.conditions,
        }));

        // Filter variants based on context (device, location, time)
        const filteredLinks = decisionTreeEngine.filterVariants(context, variantsWithConditions);

        // Get device info for logging
        const deviceInfo = decisionTreeEngine.parseDevice(context.userAgent);

        // Log HUB_VIEW event
        eventLogger.logHubView({
            hub_id: hub.hub_id,
            ip: getClientIP(req),
            country: context.country,
            user_agent: context.userAgent,
            device_type: deviceInfo.type,
            timestamp: context.timestamp,
        });

        // Return JSON response for the Link Hub page
        return res.json({
            profile: {
                username: hub.username || hub.slug,
                avatar: hub.avatar || null,
                bio: hub.bio || '',
                slug: hub.slug,
                theme: hub.theme || { bg: '#000000', accent: '#00FF00' },
            },
            links: filteredLinks,
            context: {
                device: deviceInfo.type,
                country: context.country,
                timestamp: context.timestamp,
            },
        });
    } catch (error) {
        console.error('Hub load error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Click tracking endpoint
 * POST /api/analytics/click - Logs link click events
 */
router.post('/api/analytics/click', async (req: Request, res: Response) => {
    try {
        const { hub_id, variant_id, visitor_context } = req.body;

        if (!hub_id || !variant_id) {
            return res.status(400).json({ error: 'hub_id and variant_id required' });
        }

        const context: IRequestContext = {
            userAgent: visitor_context?.userAgent || req.headers['user-agent'] || '',
            country: visitor_context?.country || extractCountry(req),
            lat: visitor_context?.lat || 0,
            lon: visitor_context?.lon || 0,
            timestamp: new Date(),
        };

        const deviceInfo = decisionTreeEngine.parseDevice(context.userAgent);

        // Log CLICK event
        eventLogger.logClick({
            hub_id,
            ip: getClientIP(req),
            country: context.country,
            lat: context.lat,
            lon: context.lon,
            user_agent: context.userAgent,
            device_type: deviceInfo.type,
            timestamp: context.timestamp,
            chosen_variant_id: variant_id,
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Click tracking error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Debug endpoint - returns resolution details
 * GET /:slug/debug
 */
router.get('/:slug/debug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const hub = await LinkHub.findOne({ slug }).lean();

        if (!hub) {
            return res.status(404).json({ error: 'Hub not found' });
        }

        const context: IRequestContext = {
            userAgent: req.headers['user-agent'] || '',
            country: extractCountry(req),
            lat: parseFloat(req.query.lat as string) || 0,
            lon: parseFloat(req.query.lon as string) || 0,
            timestamp: new Date(),
        };

        const variants = await Variant.find({ 
            hub_id: hub.hub_id,
            enabled: true 
        }).lean();

        const stats = await VariantStats.find({ hub_id: hub.hub_id }).lean();
        const statsMap = new Map(stats.map(s => [s.variant_id, s]));

        const variantsWithConditions: IVariantWithConditions[] = variants.map(v => ({
            variant_id: v.variant_id,
            target_url: v.target_url,
            title: v.title || v.variant_id,
            priority: v.priority,
            enabled: v.enabled,
            score: statsMap.get(v.variant_id)?.score || 0,
            conditions: v.conditions,
        }));

        const filteredLinks = decisionTreeEngine.filterVariants(context, variantsWithConditions);
        const deviceInfo = decisionTreeEngine.parseDevice(context.userAgent);

        return res.json({
            hub: {
                hub_id: hub.hub_id,
                slug: hub.slug,
                username: hub.username,
            },
            context: {
                ...context,
                device: deviceInfo,
            },
            total_variants: variants.length,
            filtered_links: filteredLinks.length,
            links: filteredLinks,
        });
    } catch (error) {
        console.error('Debug error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Extract country from request headers or query params
 */
function extractCountry(req: Request): string {
    const cfCountry = req.headers['cf-ipcountry'];
    if (cfCountry) return cfCountry as string;

    const xCountry = req.headers['x-country'];
    if (xCountry) return xCountry as string;

    if (req.query.country) return req.query.country as string;

    return 'unknown';
}

/**
 * Get client IP address
 */
function getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return (forwarded as string).split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
}

export default router;
