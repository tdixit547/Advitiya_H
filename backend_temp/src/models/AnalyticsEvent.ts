import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Analytics Event Types
 */
export enum AnalyticsEventType {
    HUB_IMPRESSION = 'HUB_IMPRESSION',
    LINK_CLICK = 'LINK_CLICK',
    REDIRECT = 'REDIRECT'
}

/**
 * Device Types
 */
export enum DeviceType {
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
    TABLET = 'tablet'
}

/**
 * Source Types - How the user arrived
 */
export enum SourceType {
    DIRECT = 'direct',           // Direct URL access
    SHORT_URL = 'short_url',     // Via /r/:code
    QR_CODE = 'qr_code',         // QR scan (detected via referrer)
    REFERRAL = 'referral'        // External referral
}

/**
 * Analytics Event Interface
 */
export interface IAnalyticsEvent extends Document {
    event_id: string;
    event_type: AnalyticsEventType;
    hub_id: string;
    link_id: string | null;
    variant_id: string | null;
    timestamp: Date;
    session_id: string;
    user_agent: string;
    device_type: DeviceType;
    coarse_location: string | null;
    referrer: string | null;
    // New fields for enhanced analytics
    rule_id: string | null;           // Which rule triggered link selection
    rule_reason: string | null;       // Human-readable explanation
    link_position: number | null;     // Position of link when shown (1, 2, 3...)
    source_type: SourceType;          // How user arrived (direct, short_url, qr, referral)
    metadata: Record<string, unknown>;
}

/**
 * Analytics Event Schema
 * Append-only event log for analytics
 */
const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
    {
        event_id: {
            type: String,
            required: true,
            unique: true,
            default: () => uuidv4(),
            index: true
        },
        event_type: {
            type: String,
            required: true,
            enum: Object.values(AnalyticsEventType),
            index: true
        },
        hub_id: {
            type: String,
            required: true,
            index: true
        },
        link_id: {
            type: String,
            default: null,
            index: true
        },
        variant_id: {
            type: String,
            default: null,
            index: true
        },
        timestamp: {
            type: Date,
            required: true,
            default: () => new Date(),
            index: true
        },
        session_id: {
            type: String,
            required: true,
            index: true
        },
        user_agent: {
            type: String,
            required: true
        },
        device_type: {
            type: String,
            required: true,
            enum: Object.values(DeviceType),
            index: true
        },
        coarse_location: {
            type: String,
            default: null,
            index: true
        },
        referrer: {
            type: String,
            default: null
        },
        // Enhanced analytics fields
        rule_id: {
            type: String,
            default: null,
            index: true
        },
        rule_reason: {
            type: String,
            default: null
        },
        link_position: {
            type: Number,
            default: null,
            index: true
        },
        source_type: {
            type: String,
            enum: Object.values(SourceType),
            default: SourceType.DIRECT,
            index: true
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: false, // We use our own timestamp field
        collection: 'analytics_events'
    }
);

// Compound indexes for efficient queries
AnalyticsEventSchema.index({ hub_id: 1, timestamp: -1 });
AnalyticsEventSchema.index({ hub_id: 1, event_type: 1, timestamp: -1 });
AnalyticsEventSchema.index({ hub_id: 1, link_id: 1, timestamp: -1 });
AnalyticsEventSchema.index({ hub_id: 1, device_type: 1 });
AnalyticsEventSchema.index({ hub_id: 1, coarse_location: 1 });

// New indexes for enhanced analytics
AnalyticsEventSchema.index({ hub_id: 1, rule_id: 1, timestamp: -1 });
AnalyticsEventSchema.index({ hub_id: 1, link_position: 1 });
AnalyticsEventSchema.index({ hub_id: 1, source_type: 1 });

// Time-based index for rolling windows
AnalyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days TTL

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

