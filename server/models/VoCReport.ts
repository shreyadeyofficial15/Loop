import mongoose, { Schema, Document } from 'mongoose';

export interface IVoCReportDocument extends Document {
  workspaceId: string;
  title: string;
  dateRange: string;
  generatedAt: string;
  executiveSummary: string;
  overallHealth: {
    nps: number;
    csat: number;
    positivePercentage: number;
    negativePercentage: number;
    totalFeedbackAnalyzed: number;
  };
  keyThemes: Array<{
    theme: string;
    sentimentRatio: string;
    volume: number;
    summary: string;
  }>;
  emergingTrends: Array<{
    trend: string;
    type: 'positive_spike' | 'negative_surge' | 'new_demand';
    evidence: string;
  }>;
  criticalChurnRisks: Array<{
    account: string;
    tier: string;
    issue: string;
    urgency: string;
  }>;
  strategicActionItems: Array<{
    team: 'Product' | 'Engineering' | 'Support' | 'Leadership';
    action: string;
    priority: 'P0' | 'P1' | 'P2';
  }>;
}

const VoCReportSchema: Schema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    dateRange: { type: String, required: true },
    generatedAt: { type: String, default: () => new Date().toISOString() },
    executiveSummary: { type: String, required: true },
    overallHealth: {
      nps: { type: Number, default: 0 },
      csat: { type: Number, default: 0 },
      positivePercentage: { type: Number, default: 70 },
      negativePercentage: { type: Number, default: 30 },
      totalFeedbackAnalyzed: { type: Number, default: 0 },
    },
    keyThemes: [
      {
        theme: String,
        sentimentRatio: String,
        volume: Number,
        summary: String,
      },
    ],
    emergingTrends: [
      {
        trend: String,
        type: { type: String, enum: ['positive_spike', 'negative_surge', 'new_demand'] },
        evidence: String,
      },
    ],
    criticalChurnRisks: [
      {
        account: String,
        tier: String,
        issue: String,
        urgency: String,
      },
    ],
    strategicActionItems: [
      {
        team: { type: String, enum: ['Product', 'Engineering', 'Support', 'Leadership'] },
        action: String,
        priority: { type: String, enum: ['P0', 'P1', 'P2'] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

VoCReportSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

VoCReportSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const VoCReportModel =
  mongoose.models.VoCReport || mongoose.model<IVoCReportDocument>('VoCReport', VoCReportSchema);
