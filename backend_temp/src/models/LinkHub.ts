import mongoose, { Schema, Document } from 'mongoose';

export interface ITheme {
    bg: string;
    accent: string;
}

export interface ILinkHub extends Document {
    hub_id: string;
    slug: string;
    default_url: string;
    theme: ITheme;
    rule_tree_id?: mongoose.Types.ObjectId;
    owner_user_id?: string;  // Optional creator ownership
    created_at: Date;
    updated_at: Date;
}

const ThemeSchema = new Schema<ITheme>({
    bg: { type: String, required: true },
    accent: { type: String, required: true },
}, { _id: false });

const LinkHubSchema = new Schema<ILinkHub>({
    hub_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    default_url: {
        type: String,
        required: true
    },
    theme: {
        type: ThemeSchema,
        required: true
    },
    rule_tree_id: {
        type: Schema.Types.ObjectId,
        ref: 'RuleTree'
    },
    owner_user_id: {
        type: String,
        index: true  // For querying hubs by owner
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index for owner queries
LinkHubSchema.index({ owner_user_id: 1, created_at: -1 });

export const LinkHub = mongoose.model<ILinkHub>('LinkHub', LinkHubSchema);
