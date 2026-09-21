import mongoose, { Schema, Document } from 'mongoose';
import { CustomerTier, FeedbackChannel, UrgencyLevel, SentimentType } from '../../src/types';

export interface IFeedbackDocument extends Document {
  workspaceId: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerTier: CustomerTier;
  channel: FeedbackChannel;
  rating: number;
  content: string;
  sentiment: SentimentType;
  sentimentScore: number;
  urgency: UrgencyLevel;
  churnRisk: 'none' | 'low' | 'medium' | 'high';
  themes: string[];
  aiSummary: string;
  actionableNextStep?: string;
  assignedTeam?: 'Product' | 'Support' | 'Engineering' | 'Executive';
  status: 'new' | 'investigating' | 'planned' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

const FeedbackSchema: Schema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerCompany: { type: String, required: true, index: true },
    customerEmail: { type: String, required: true },
    customerTier: {
      type: String,
      enum: ['enterprise', 'growth', 'starter', 'free'],
      default: 'growth',
      index: true,
    },
    channel: {
      type: String,
      enum: [
        'zendesk',
        'intercom',
        'app_store',
        'g2',
        'trustpilot',
        'email',
        'in_app_survey',
        'slack',
        'twitter',
      ],
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    sentiment: {
  type: String,
  enum: ['positive', 'negative', 'neutral', 'mixed'],
  required: true,
  index: true,
},
    sentimentScore: { type: Number, required: true },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    churnRisk: {
  type: String,
  enum: ['none', 'low', 'medium', 'high'],
  default: 'none',
  index: true,
},
    themes: [{ type: String, index: true }],
    aiSummary: { type: String, required: true },
    actionableNextStep: { type: String },
    assignedTeam: {
      type: String,
      enum: ['Product', 'Support', 'Engineering', 'Executive'],
      default: 'Product',
    },
    status: {
      type: String,
      enum: ['new', 'investigating', 'planned', 'resolved'],
      default: 'new',
      index: true,
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

// Virtual for id mapped to _id
FeedbackSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

FeedbackSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const FeedbackModel =
  mongoose.models.Feedback || mongoose.model<IFeedbackDocument>('Feedback', FeedbackSchema);
