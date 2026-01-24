import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHub extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    slug: string;
    title: string;
    bio?: string;
    avatarUrl?: string;
    themeConfig: Record<string, any>; // Flexible JSON
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HubSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    bio: { type: String },
    avatarUrl: { type: String },
    themeConfig: { type: Schema.Types.Mixed, default: { bg: "#000000", accent: "#00FF00", textColor: "#FFFFFF" } },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Hub: Model<IHub> = mongoose.models.Hub || mongoose.model<IHub>('Hub', HubSchema);

export default Hub;
