import { Event } from '../models/Event';
import { Variant } from '../models/Variant';

/**
 * Sankey Diagram Node
 */
export interface SankeyNode {
    id: string;       // Node identifier
    label: string;    // Human-readable label
    type: 'source' | 'link' | 'destination';
}

/**
 * Sankey Diagram Link (flow between nodes)
 */
export interface SankeyLink {
    source: string;   // Source node ID
    target: string;   // Target node ID
    value: number;    // Number of transitions (thickness)
}

/**
 * Complete Sankey Data Structure
 */
export interface SankeyData {
    nodes: SankeyNode[];
    links: SankeyLink[];
    period: {
        start: string;
        end: string;
    };
}

/**
 * Network Graph Node
 */
export interface NetworkNode {
    id: string;
    label: string;
    weight: number;   // Total interactions (for node size)
    type: 'source' | 'link' | 'destination';
}

/**
 * Network Graph Edge
 */
export interface NetworkEdge {
    source: string;
    target: string;
    weight: number;   // Transition count
}

/**
 * Complete Network Graph Data Structure
 */
export interface NetworkData {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

/**
 * Flow Analytics Service
 * Calculates user flow data for Sankey diagrams and Network graphs
 */
export class FlowAnalyticsService {

    /**
     * Get Sankey diagram data for a hub
     * Shows: Source → Variant/Link → Destination flow
     */
    async getSankeyData(hubId: string, startDate?: Date, endDate?: Date): Promise<SankeyData> {
        const dateFilter: any = { hub_id: hubId, event_type: 'click' };

        if (startDate || endDate) {
            dateFilter.timestamp = {};
            if (startDate) dateFilter.timestamp.$gte = startDate;
            if (endDate) dateFilter.timestamp.$lte = endDate;
        }

        // Aggregate flows: referrer → chosen_variant_id
        const flowAggregation = await Event.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        source: '$referrer',
                        target: '$chosen_variant_id'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get variant info for labels
        const variantIds = [...new Set(flowAggregation.map(f => f._id.target))];
        const variants = await Variant.find({ variant_id: { $in: variantIds } });
        const variantMap = new Map(variants.map(v => [v.variant_id, v]));

        // Build nodes
        const nodeMap = new Map<string, SankeyNode>();
        const linkArray: SankeyLink[] = [];

        for (const flow of flowAggregation) {
            const sourceId = flow._id.source || 'direct';
            const targetId = flow._id.target;

            // Add source node
            if (!nodeMap.has(sourceId)) {
                nodeMap.set(sourceId, {
                    id: sourceId,
                    label: this.formatSourceLabel(sourceId),
                    type: 'source'
                });
            }

            // Add target node (variant)
            if (!nodeMap.has(targetId)) {
                const variant = variantMap.get(targetId);
                nodeMap.set(targetId, {
                    id: targetId,
                    label: variant ? this.extractDomain(variant.target_url) : targetId,
                    type: 'link'
                });
            }

            // Add link
            linkArray.push({
                source: sourceId,
                target: targetId,
                value: flow.count
            });
        }

        // Also add destination nodes from variant URLs
        for (const variant of variants) {
            const destId = `dest_${this.extractDomain(variant.target_url)}`;
            if (!nodeMap.has(destId)) {
                nodeMap.set(destId, {
                    id: destId,
                    label: this.extractDomain(variant.target_url),
                    type: 'destination'
                });
            }

            // Add link from variant to destination (use same count as incoming)
            const incomingFlow = linkArray.filter(l => l.target === variant.variant_id);
            const totalIncoming = incomingFlow.reduce((sum, l) => sum + l.value, 0);
            if (totalIncoming > 0) {
                linkArray.push({
                    source: variant.variant_id,
                    target: destId,
                    value: totalIncoming
                });
            }
        }

        return {
            nodes: Array.from(nodeMap.values()),
            links: linkArray,
            period: {
                start: (startDate || new Date(0)).toISOString(),
                end: (endDate || new Date()).toISOString()
            }
        };
    }

    /**
     * Get Network graph data for a hub
     * Shows nodes (sources/variants) and edges (transitions)
     */
    async getNetworkData(hubId: string, startDate?: Date, endDate?: Date): Promise<NetworkData> {
        const dateFilter: any = { hub_id: hubId, event_type: 'click' };

        if (startDate || endDate) {
            dateFilter.timestamp = {};
            if (startDate) dateFilter.timestamp.$gte = startDate;
            if (endDate) dateFilter.timestamp.$lte = endDate;
        }

        // Aggregate by referrer for source nodes
        const sourceAggregation = await Event.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$referrer',
                    weight: { $sum: 1 }
                }
            }
        ]);

        // Aggregate by variant for link nodes
        const variantAggregation = await Event.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$chosen_variant_id',
                    weight: { $sum: 1 }
                }
            }
        ]);

        // Aggregate edges (source → target transitions)
        const edgeAggregation = await Event.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        source: '$referrer',
                        target: '$chosen_variant_id'
                    },
                    weight: { $sum: 1 }
                }
            }
        ]);

        // Get variant info for labels
        const variantIds = variantAggregation.map(v => v._id);
        const variants = await Variant.find({ variant_id: { $in: variantIds } });
        const variantMap = new Map(variants.map(v => [v.variant_id, v]));

        // Build nodes
        const nodes: NetworkNode[] = [];

        // Source nodes
        for (const source of sourceAggregation) {
            const sourceId = source._id || 'direct';
            nodes.push({
                id: sourceId,
                label: this.formatSourceLabel(sourceId),
                weight: source.weight,
                type: 'source'
            });
        }

        // Link nodes (variants)
        for (const variantAgg of variantAggregation) {
            const variant = variantMap.get(variantAgg._id);
            nodes.push({
                id: variantAgg._id,
                label: variant ? this.extractDomain(variant.target_url) : variantAgg._id,
                weight: variantAgg.weight,
                type: 'link'
            });
        }

        // Build edges
        const edges: NetworkEdge[] = edgeAggregation.map(e => ({
            source: e._id.source || 'direct',
            target: e._id.target,
            weight: e.weight
        }));

        return { nodes, edges };
    }

    /**
     * Format source label for display
     */
    private formatSourceLabel(source: string): string {
        if (!source || source === 'direct') return 'Direct';
        if (source === 'unknown') return 'Unknown';

        // Try to extract domain from URL
        try {
            const url = new URL(source);
            return url.hostname.replace('www.', '');
        } catch {
            return source;
        }
    }

    /**
     * Extract domain from URL
     */
    private extractDomain(url: string): string {
        try {
            const parsed = new URL(url);
            return parsed.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }
}

// Singleton instance
export const flowAnalyticsService = new FlowAnalyticsService();
