import mongoose from 'mongoose';
import { FeedbackModel } from './models/Feedback';
import { WorkspaceModel } from './models/Workspace';
import { InsightModel } from './models/Insight';
import { VoCReportModel } from './models/VoCReport';
import { INITIAL_FEEDBACK, INITIAL_INSIGHTS, INITIAL_VOC_REPORTS, WORKSPACES } from '../src/data/mockData';
import { FeedbackItem, WorkspaceTenant, InsightRecommendation, VoCReport } from '../src/types';

let isConnectedToMongo = false;
let connectionError: string | null = null;
let lastPingTime = 0;

// Fallback in-memory cache synchronized with collections
let inMemoryFeedbacks: FeedbackItem[] = [...INITIAL_FEEDBACK];
let inMemoryWorkspaces: WorkspaceTenant[] = [...WORKSPACES];
let inMemoryInsights: InsightRecommendation[] = [...INITIAL_INSIGHTS];
let inMemoryVoCReports: VoCReport[] = [...INITIAL_VOC_REPORTS];

export async function initDatabase(): Promise<{ status: string; uriProvided: boolean }> {
  const uri = process.env.MONGODB_URI= "mongodb+srv://deyshreya816_db_user:lbAjPwJ4rFPKcktk@cluster0.knr1w32.mongodb.net/?appName=Cluster0/Loop";

  if (!uri) {
    console.log('[MERN Stack] Notice: MONGODB_URI not configured in environment. Utilizing in-memory MongoDB-compatible collection layer.');
    isConnectedToMongo = false;
    return { status: 'fallback_in_memory', uriProvided: false };
  }

  try {
    console.log('[MERN Stack] Connecting to MongoDB via Mongoose...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    isConnectedToMongo = true;
    connectionError = null;
    lastPingTime = Date.now();
    console.log('[MERN Stack] Successfully connected to MongoDB cluster.');
console.log('[MERN Stack] Database name:', mongoose.connection.name);
console.log('[MERN Stack] Host:', mongoose.connection.host);
    // Seed database if empty
    await seedMongoIfEmpty();

    return { status: 'connected', uriProvided: true };
  } catch (err: any) {
    console.warn('[MERN Stack] MongoDB cluster connection attempt failed:', err.message);
    connectionError = err.message;
    isConnectedToMongo = false;
    return { status: 'fallback_in_memory', uriProvided: true };
  }
}

async function seedMongoIfEmpty() {
  try {
    const feedbackCount = await FeedbackModel.countDocuments();
    if (feedbackCount === 0) {
      console.log('[MERN Stack] Seeding initial customer feedback into MongoDB collection...');
      await FeedbackModel.insertMany(
        INITIAL_FEEDBACK.map((fb) => ({
          workspaceId: fb.workspaceId,
          customerName: fb.customerName,
          customerCompany: fb.customerCompany,
          customerEmail: fb.customerEmail,
          customerTier: fb.customerTier,
          channel: fb.channel,
          rating: fb.rating,
          content: fb.content,
          sentiment: fb.sentiment,
          sentimentScore: fb.sentimentScore,
          urgency: fb.urgency,
          churnRisk: fb.churnRisk,
          themes: fb.themes,
          aiSummary: fb.aiSummary,
          actionableNextStep: fb.actionableNextStep,
          assignedTeam: fb.assignedTeam,
          status: fb.status,
          createdAt: fb.createdAt,
        }))
      );
    }

    const wsCount = await WorkspaceModel.countDocuments();
    if (wsCount === 0) {
      console.log('[MERN Stack] Seeding workspaces into MongoDB collection...');
      await WorkspaceModel.insertMany(WORKSPACES);
    }

    const insightCount = await InsightModel.countDocuments();
    if (insightCount === 0) {
      console.log('[MERN Stack] Seeding insights into MongoDB collection...');
      await InsightModel.insertMany(INITIAL_INSIGHTS);
    }

    const vocCount = await VoCReportModel.countDocuments();
    if (vocCount === 0) {
      console.log('[MERN Stack] Seeding VoC reports into MongoDB collection...');
      await VoCReportModel.insertMany(INITIAL_VOC_REPORTS);
    }
  } catch (err) {
    console.error('[MERN Stack] Error seeding MongoDB:', err);
  }
}

// ---------------- Feedback Operations ----------------
export async function getFeedbacks(workspaceId?: string): Promise<FeedbackItem[]> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const filter: any = {};
      if (workspaceId) filter.workspaceId = workspaceId;
      const docs = await FeedbackModel.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map((doc: any) => ({
        id: doc._id.toString(),
        workspaceId: doc.workspaceId,
        customerName: doc.customerName,
        customerCompany: doc.customerCompany,
        customerEmail: doc.customerEmail,
        customerTier: doc.customerTier,
        channel: doc.channel,
        rating: doc.rating,
        content: doc.content,
        sentiment: doc.sentiment,
        sentimentScore: doc.sentimentScore,
        urgency: doc.urgency,
        churnRisk: doc.churnRisk,
        themes: doc.themes || [],
        aiSummary: doc.aiSummary,
        actionableNextStep: doc.actionableNextStep,
        assignedTeam: doc.assignedTeam,
        status: doc.status,
        createdAt: doc.createdAt,
      }));
    } catch (err) {
      console.error('[MERN Stack] Feedback find query error, falling back to local store:', err);
    }
  }

  let items = inMemoryFeedbacks;
  if (workspaceId) {
    items = items.filter((f) => f.workspaceId === workspaceId);
  }
  return items;
}

export async function createFeedback(item: Partial<FeedbackItem>): Promise<FeedbackItem> {
  const generatedId = item.id || `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const formatted: FeedbackItem = {
    id: generatedId,
    workspaceId: item.workspaceId || 'ws-acme',
    customerName: item.customerName || 'Anonymous Customer',
    customerCompany: item.customerCompany || 'Global Enterprise',
    customerEmail: item.customerEmail || 'contact@client.com',
    customerTier: item.customerTier || 'growth',
    channel: item.channel || 'zendesk',
    rating: item.rating ?? 3,
    content: item.content || '',
    sentiment: item.sentiment || 'neutral',
    sentimentScore: item.sentimentScore ?? 0,
    urgency: item.urgency || 'medium',
    churnRisk: item.churnRisk || 'low',
    themes: item.themes || ['Feature Request'],
    aiSummary: item.aiSummary || (item.content ? item.content.slice(0, 120) : 'Ingested feedback record'),
    actionableNextStep: item.actionableNextStep || 'Review and triage to product team',
    assignedTeam: item.assignedTeam || 'Product',
    status: item.status || 'new',
    createdAt: item.createdAt || now,
  };

  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const doc = await FeedbackModel.create(formatted);
      formatted.id = doc._id.toString();
    } catch (err) {
      console.error('[MERN Stack] Mongo create error, keeping memory copy:', err);
    }
  }

  inMemoryFeedbacks.unshift(formatted);
  return formatted;
}

export async function updateFeedback(id: string, updates: Partial<FeedbackItem>): Promise<FeedbackItem | null> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const updated = await FeedbackModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
      if (updated) {
        return {
          id: (updated as any)._id.toString(),
          workspaceId: (updated as any).workspaceId,
          customerName: (updated as any).customerName,
          customerCompany: (updated as any).customerCompany,
          customerEmail: (updated as any).customerEmail,
          customerTier: (updated as any).customerTier,
          channel: (updated as any).channel,
          rating: (updated as any).rating,
          content: (updated as any).content,
          sentiment: (updated as any).sentiment,
          sentimentScore: (updated as any).sentimentScore,
          urgency: (updated as any).urgency,
          churnRisk: (updated as any).churnRisk,
          themes: (updated as any).themes || [],
          aiSummary: (updated as any).aiSummary,
          actionableNextStep: (updated as any).actionableNextStep,
          assignedTeam: (updated as any).assignedTeam,
          status: (updated as any).status,
          createdAt: (updated as any).createdAt,
        };
      }
    } catch (err) {
      console.error('[MERN Stack] Mongo update error, updating memory store:', err);
    }
  }

  const idx = inMemoryFeedbacks.findIndex((f) => f.id === id);
  if (idx !== -1) {
    inMemoryFeedbacks[idx] = { ...inMemoryFeedbacks[idx], ...updates };
    return inMemoryFeedbacks[idx];
  }
  return null;
}

export async function deleteFeedback(id: string): Promise<boolean> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      await FeedbackModel.findByIdAndDelete(id);
    } catch (err) {
      console.error('[MERN Stack] Mongo delete error:', err);
    }
  }

  const prevLen = inMemoryFeedbacks.length;
  inMemoryFeedbacks = inMemoryFeedbacks.filter((f) => f.id !== id);
  return inMemoryFeedbacks.length < prevLen;
}

// ---------------- Workspace Operations ----------------
export async function getWorkspaces(): Promise<WorkspaceTenant[]> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const wsDocs = await WorkspaceModel.find().lean();
      if (wsDocs && wsDocs.length > 0) {
        // Aggregate real feedback counts from MongoDB
        const result: WorkspaceTenant[] = [];
        for (const ws of wsDocs as any[]) {
          const count = await FeedbackModel.countDocuments({ workspaceId: ws.id });
          result.push({
            id: ws.id,
            name: ws.name,
            industry: ws.industry,
            plan: ws.plan,
            feedbackCount: count,
            npsScore: ws.npsScore,
            avatarGradient: ws.avatarGradient,
          });
        }
        return result;
      }
    } catch (err) {
      console.error('[MERN Stack] Mongo workspaces fetch error:', err);
    }
  }

  return inMemoryWorkspaces.map((ws) => ({
    ...ws,
    feedbackCount: inMemoryFeedbacks.filter((f) => f.workspaceId === ws.id).length,
  }));
}

// ---------------- Insights Operations ----------------
export async function getInsights(workspaceId?: string): Promise<InsightRecommendation[]> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const filter: any = {};
      if (workspaceId) filter.workspaceId = workspaceId;
      const docs = await InsightModel.find(filter).lean();
      return docs.map((d: any) => ({
        id: d._id.toString(),
        workspaceId: d.workspaceId,
        title: d.title,
        description: d.description,
        impact: d.impact,
        effort: d.effort,
        category: d.category,
        affectedAccounts: d.affectedAccounts,
        sentimentLiftEstimate: d.sentimentLiftEstimate,
        department: d.department,
        status: d.status,
        sampleFeedbackIds: d.sampleFeedbackIds || [],
      }));
    } catch (err) {
      console.error('[MERN Stack] Mongo insights fetch error:', err);
    }
  }

  let items = inMemoryInsights;
  if (workspaceId) items = items.filter((i) => i.workspaceId === workspaceId);
  return items;
}

export async function updateInsightStatus(id: string, status: 'open' | 'in_progress' | 'completed'): Promise<InsightRecommendation | null> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const updated = await InsightModel.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
      if (updated) {
        return {
          id: (updated as any)._id.toString(),
          workspaceId: (updated as any).workspaceId,
          title: (updated as any).title,
          description: (updated as any).description,
          impact: (updated as any).impact,
          effort: (updated as any).effort,
          category: (updated as any).category,
          affectedAccounts: (updated as any).affectedAccounts,
          sentimentLiftEstimate: (updated as any).sentimentLiftEstimate,
          department: (updated as any).department,
          status: (updated as any).status,
          sampleFeedbackIds: (updated as any).sampleFeedbackIds || [],
        };
      }
    } catch (err) {
      console.error('[MERN Stack] Mongo insight update error:', err);
    }
  }

  const idx = inMemoryInsights.findIndex((i) => i.id === id);
  if (idx !== -1) {
    inMemoryInsights[idx] = { ...inMemoryInsights[idx], status };
    return inMemoryInsights[idx];
  }
  return null;
}

// ---------------- VoC Reports Operations ----------------
export async function getVoCReports(workspaceId?: string): Promise<VoCReport[]> {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const filter: any = {};
      if (workspaceId) filter.workspaceId = workspaceId;
      const docs = await VoCReportModel.find(filter).sort({ generatedAt: -1 }).lean();
      return docs.map((d: any) => ({
        id: d._id.toString(),
        workspaceId: d.workspaceId,
        title: d.title,
        dateRange: d.dateRange,
        generatedAt: d.generatedAt,
        executiveSummary: d.executiveSummary,
        overallHealth: d.overallHealth,
        keyThemes: d.keyThemes || [],
        emergingTrends: d.emergingTrends || [],
        criticalChurnRisks: d.criticalChurnRisks || [],
        strategicActionItems: d.strategicActionItems || [],
      }));
    } catch (err) {
      console.error('[MERN Stack] Mongo VoC fetch error:', err);
    }
  }

  let items = inMemoryVoCReports;
  if (workspaceId) items = items.filter((r) => r.workspaceId === workspaceId);
  return items;
}

export async function createVoCReport(report: Partial<VoCReport>): Promise<VoCReport> {
  const formatted: VoCReport = {
    id: report.id || `voc-${Date.now()}`,
    workspaceId: report.workspaceId || 'ws-acme',
    title: report.title || 'Voice of Customer Executive Brief',
    dateRange: report.dateRange || 'Last 30 Days',
    generatedAt: report.generatedAt || new Date().toISOString(),
    executiveSummary: report.executiveSummary || 'Customer intelligence report generated by Project LOOP.',
    overallHealth: report.overallHealth || {
      nps: 45,
      csat: 4.2,
      positivePercentage: 68,
      negativePercentage: 22,
      totalFeedbackAnalyzed: 140,
    },
    keyThemes: report.keyThemes || [],
    emergingTrends: report.emergingTrends || [],
    criticalChurnRisks: report.criticalChurnRisks || [],
    strategicActionItems: report.strategicActionItems || [],
  };

  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const doc = await VoCReportModel.create(formatted);
      formatted.id = doc._id.toString();
    } catch (err) {
      console.error('[MERN Stack] Mongo VoC create error:', err);
    }
  }

  inMemoryVoCReports.unshift(formatted);
  return formatted;
}

// ---------------- Diagnostic Stack Information ----------------
export async function getMernStackDiagnostics() {
  const mongoStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  const isMongoLive = isConnectedToMongo && stateCode === 1;

  let counts = {
    feedback: inMemoryFeedbacks.length,
    workspaces: inMemoryWorkspaces.length,
    insights: inMemoryInsights.length,
    vocReports: inMemoryVoCReports.length,
  };

  if (isMongoLive) {
    try {
      const [fbC, wsC, inC, vocC] = await Promise.all([
        FeedbackModel.countDocuments(),
        WorkspaceModel.countDocuments(),
        InsightModel.countDocuments(),
        VoCReportModel.countDocuments(),
      ]);
      counts = {
        feedback: fbC,
        workspaces: wsC,
        insights: inC,
        vocReports: vocC,
      };
    } catch (err) {
      console.error('[MERN Stack] Count diagnostic error:', err);
    }
  }

  return {
    stack: {
      name: 'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
      database: 'MongoDB (Mongoose ODM)',
      backendServer: 'Express.js v4.21 on Node.js',
      frontendUI: 'React 19 + Vite + Tailwind CSS',
      runtime: `Node.js ${process.version}`,
    },
    database: {
      driver: 'Mongoose ODM',
      status: isMongoLive ? 'connected' : Boolean(process.env.MONGODB_URI) ? 'connection_failed_fallback' : 'ready_in_memory',
      connectionState: mongoStateMap[stateCode] || 'disconnected',
      uriConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI !== ''),
      databaseName: mongoose.connection.name || 'project_loop',
      collections: ['feedbacks', 'workspaces', 'insights', 'vocreports'],
      counts,
      error: connectionError,
    },
    apiEndpoints: [
      { method: 'GET', path: '/api/feedback', description: 'Query customer feedback with MongoDB filters' },
      { method: 'POST', path: '/api/feedback', description: 'Insert new feedback document with schema validation' },
      { method: 'PUT', path: '/api/feedback/:id', description: 'Update document status and triage details' },
      { method: 'DELETE', path: '/api/feedback/:id', description: 'Remove feedback document from collection' },
      { method: 'GET', path: '/api/workspaces', description: 'Retrieve tenant workspaces with signal counts' },
      { method: 'GET', path: '/api/insights', description: 'Fetch AI-derived strategic recommendations' },
      { method: 'GET', path: '/api/voc-reports', description: 'Fetch generated Voice-of-Customer reports' },
      { method: 'GET', path: '/api/mern-status', description: 'Diagnostic status of MongoDB, Express, React, Node' },
    ],
  };
}
