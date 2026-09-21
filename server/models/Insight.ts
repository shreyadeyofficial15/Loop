import mongoose, { Schema, Document } from 'mongoose';
import { CategoryTheme } from '../../src/types';

export interface IInsightDocument extends Document {
  workspaceId: string;
  title: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium';
  effort: 'Quick Win' | 'Medium' | 'Major Project';
  category: CategoryTheme;
  affectedAccounts: number;
  sentimentLiftEstimate: string;
  department: 'Product' | 'Engineering' | 'Support' | 'Leadership';
  status: 'open' | 'in_progress' | 'completed';
  sampleFeedbackIds: string[];
}

const InsightSchema: Schema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    impact: {
      type: String,
      enum: ['Critical', 'High', 'Medium'],
      default: 'High',
      index: true,
    },
    effort: {
      type: String,
      enum: ['Quick Win', 'Medium', 'Major Project'],
      default: 'Medium',
    },
    category: { type: String, required: true },
    affectedAccounts: { type: Number, default: 1 },
    sentimentLiftEstimate: { type: String, default: '+5%' },
    department: {
      type: String,
      enum: ['Product', 'Engineering', 'Support', 'Leadership'],
      default: 'Product',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed'],
      default: 'open',
      index: true,
    },
    sampleFeedbackIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

InsightSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

InsightSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const InsightModel =
  mongoose.models.Insight || mongoose.model<IInsightDocument>('Insight', InsightSchema);
