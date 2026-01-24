import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILink extends Document {
    title: string;
    url: string;
    hubId: mongoose.Schema.Types.ObjectId; // Reference to Hub
    icon?: string;
    priority: number;
    clickCount: number;
    isActive: boolean;
    // Link Rot Fields
    lastCheckedAt?: Date;
    statusCode?: number;
    isHealthy: boolean;
    archiveUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LinkSchema: Schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    hubId: { type: Schema.Types.ObjectId, ref: 'Hub', required: true },
    icon: { type: String },
    priority: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // Link Rot
    lastCheckedAt: { type: Date },
    statusCode: { type: Number },
    isHealthy: { type: Boolean, default: true },
    archiveUrl: { type: String },
}, {
    timestamps: true,
});

// Prevent overwrite on hot reload
const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;
