import { Router, Request, Response } from 'express';
import { LinkHub } from '../models/LinkHub';
import { decisionTreeEngine, IRequestContext } from '../services/DecisionTreeEngine';
import { variantResolver } from '../services/VariantResolver';
import { cacheService } from '../services/CacheService';
import { eventLogger } from '../services/EventLogger';

const router = Router();

/**
 * Main redirect endpoint
 * GET /:slug - Resolves the best URL and redirects
 * 
 * Event logging:
 * - Logs an IMPRESSION when variant is resolved
 * - Logs a CLICK when redirect is executed
 * This enables meaningful CTR calculation (clicks / impressions)
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

        // Get the rule tree (cached)
        const ruleTree = await cacheService.getRuleTree(hub.hub_id);

        let targetUrl = hub.default_url;
        let chosenVariantId = 'default';

        if (ruleTree) {
            // Traverse the decision tree
            const variantIds = decisionTreeEngine.traverse(context, ruleTree.root);

            if (variantIds && variantIds.length > 0) {
                // Resolve the best variant
                const variant = await variantResolver.resolveVariant(variantIds, hub.hub_id);

                if (variant) {
                    targetUrl = variant.target_url;
                    chosenVariantId = variant.variant_id;
                }
            }
        }

        // Get device info for logging
        const deviceInfo = decisionTreeEngine.parseDevice(context.userAgent);

        // Extract referrer from request header
        const referrer = extractReferrer(req);

        // Create base event context (without event_type)
        const eventContext = {
            hub_id: hub.hub_id,
            ip: getClientIP(req),
            country: context.country,
            lat: context.lat,
            lon: context.lon,
            user_agent: context.userAgent,
            device_type: deviceInfo.type,
            timestamp: context.timestamp,
            chosen_variant_id: chosenVariantId,
            referrer: referrer,
            referrer_variant_id: '', // For future hub-to-hub tracking
        };

        // Log IMPRESSION event (variant was resolved)
        eventLogger.logImpression(eventContext);

        // Log CLICK event (redirect is being executed)
        eventLogger.logClick(eventContext);

        // Redirect to the target URL
        return res.redirect(302, targetUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Debug endpoint - returns resolution details without redirecting
 * GET /:slug/debug
 * Note: Does NOT log events (no impression, no click)
 */
router.get('/:slug/debug', async (req: Request, res: Response) => {
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

        // Get the rule tree (cached)
        const ruleTree = await cacheService.getRuleTree(hub.hub_id);
        const isCached = await cacheService.isCached(hub.hub_id);
        const cacheTTL = await cacheService.getCacheTTL(hub.hub_id);

        const deviceInfo = decisionTreeEngine.parseDevice(context.userAgent);

        let variantIds: string[] = [];
        let resolvedVariant = null;
        let targetUrl = hub.default_url;

        if (ruleTree) {
            variantIds = decisionTreeEngine.traverse(context, ruleTree.root);

            if (variantIds && variantIds.length > 0) {
                resolvedVariant = await variantResolver.resolveVariant(variantIds, hub.hub_id);
                if (resolvedVariant) {
                    targetUrl = resolvedVariant.target_url;
                }
            }
        }

        return res.json({
            hub: {
                hub_id: hub.hub_id,
                slug: hub.slug,
                default_url: hub.default_url,
                theme: hub.theme,
            },
            context: {
                ...context,
                device: deviceInfo,
            },
            cache: {
                cached: isCached,
                ttl_seconds: cacheTTL,
            },
            resolution: {
                tree_found: !!ruleTree,
                leaf_variant_ids: variantIds,
                resolved_variant: resolvedVariant ? {
                    variant_id: resolvedVariant.variant_id,
                    target_url: resolvedVariant.target_url,
                    priority: resolvedVariant.priority,
                    weight: resolvedVariant.weight,
                } : null,
                final_url: targetUrl,
            },
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
    // Try CF-IPCountry header (Cloudflare)
    const cfCountry = req.headers['cf-ipcountry'];
    if (cfCountry) {
        return cfCountry as string;
    }

    // Try X-Country header (custom proxy)
    const xCountry = req.headers['x-country'];
    if (xCountry) {
        return xCountry as string;
    }

    // Try query parameter
    if (req.query.country) {
        return req.query.country as string;
    }

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

/**
 * Extract referrer from request headers
 * Parses the Referer header to determine traffic source
 */
function extractReferrer(req: Request): string {
    const referer = req.headers['referer'] || req.headers['referrer'];

    if (!referer) {
        return 'direct';
    }

    try {
        const url = new URL(referer as string);
        return url.hostname;
    } catch {
        return referer as string;
    }
}

export default router;
