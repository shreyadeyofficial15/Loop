export type FeedbackChannel =
  | 'zendesk'
  | 'intercom'
  | 'app_store'
  | 'g2'
  | 'trustpilot'
  | 'email'
  | 'in_app_survey'
  | 'slack'
  | 'twitter';

export type SentimentType = 'positive' | 'neutral' | 'negative' | 'mixed';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export type ChurnRisk = 'high' | 'medium' | 'low' | 'none';

export type CustomerTier = 'enterprise' | 'growth' | 'starter' | 'free';

export type CategoryTheme =
  | 'Performance & Speed'
  | 'Pricing & Billing'
  | 'UI & Usability'
  | 'Integrations & API'
  | 'Customer Support'
  | 'Feature Request'
  | 'Bugs & Reliability'
  | 'Security & Compliance'
  | 'Onboarding';

export type UserRole = 'admin' | 'product_manager' | 'support_lead' | 'executive';

export interface FeedbackItem {
  id: string;
  workspaceId: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerTier: CustomerTier;
  channel: FeedbackChannel;
  rating?: number; // 1-5 or NPS 0-10
  content: string;
  createdAt: string;
  // AI Analyzed Fields
  sentiment: SentimentType;
  sentimentScore: number; // -1.0 to 1.0
  urgency: UrgencyLevel;
  churnRisk: ChurnRisk;
  themes: CategoryTheme[];
  aiSummary: string;
  actionableNextStep?: string;
  assignedTeam?: 'Product' | 'Support' | 'Engineering' | 'Executive';
  status: 'new' | 'investigating' | 'planned' | 'resolved';
}

export interface WorkspaceTenant {
  id: string;
  name: string;
  industry: string;
  plan: string;
  feedbackCount: number;
  npsScore: number;
  avatarGradient: string;
}

export interface InsightRecommendation {
  id: string;
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

export interface VoCReport {
  id: string;
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
  keyThemes: {
    theme: string;
    sentimentRatio: string;
    volume: number;
    summary: string;
  }[];
  emergingTrends: {
    trend: string;
    type: 'positive_spike' | 'negative_surge' | 'new_demand';
    evidence: string;
  }[];
  criticalChurnRisks: {
    account: string;
    tier: string;
    issue: string;
    urgency: string;
  }[];
  strategicActionItems: {
    team: 'Product' | 'Engineering' | 'Support' | 'Leadership';
    action: string;
    priority: 'P0' | 'P1' | 'P2';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: {
    id: string;
    customer: string;
    company: string;
    tier: string;
    channel: string;
    sentiment: SentimentType;
    content: string;
  }[];
  suggestedFollowUps?: string[];
}

export interface FilterState {
  searchQuery: string;
  channel: FeedbackChannel | 'all';
  sentiment: SentimentType | 'all';
  urgency: UrgencyLevel | 'all';
  tier: CustomerTier | 'all';
  theme: string | 'all';
  status: string | 'all';
  dateRange: '7d' | '30d' | '90d' | 'all';
}
