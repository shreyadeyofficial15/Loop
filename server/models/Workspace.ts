import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspaceDocument extends Document {
  id: string;
  name: string;
  industry: string;
  plan: string;
  feedbackCount: number;
  npsScore: number;
  avatarGradient: string;
}

const WorkspaceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    industry: { type: String, required: true },
    plan: { type: String, default: 'Enterprise Plus' },
    feedbackCount: { type: Number, default: 0 },
    npsScore: { type: Number, default: 42 },
    avatarGradient: { type: String, default: 'from-indigo-600 to-violet-600' },
  },
  {
    timestamps: true,
  }
);

WorkspaceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const WorkspaceModel =
  mongoose.models.Workspace || mongoose.model<IWorkspaceDocument>('Workspace', WorkspaceSchema);
