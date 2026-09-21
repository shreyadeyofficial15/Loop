import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  Wand2,
  CheckCircle2,
} from 'lucide-react';
import { FeedbackChannel, CustomerTier, FeedbackItem } from '../types';

interface NewFeedbackModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<FeedbackItem>) => void;
  theme?: 'light' | 'dark';
}

const SAMPLE_FEEDBACKS = [
  {
    name: 'Harrison Reed',
    company: 'Cobalt Media',
    email: 'harrison@cobaltmedia.com',
    tier: 'enterprise' as CustomerTier,
    channel: 'zendesk' as FeedbackChannel,
    rating: 1,
    content:
      'We experienced another database timeout during our global synchronized marketing broadcast. 80,000 push notifications failed silently. This is the second time in 30 days. We need immediate architectural review or we cancel our annual subscription.',
  },
  {
    name: 'Siddharth Rao',
    company: 'FinLogic India',
    email: 'siddharth@finlogic.in',
    tier: 'growth' as CustomerTier,
    channel: 'intercom' as FeedbackChannel,
    rating: 5,
    content:
      'The automated classification of our customer support tickets using LOOP is phenomenal. It categorized 4,000 inbound tickets in under two minutes with 96% accuracy. Our team saved 35 hours this week alone!',
  },
  {
    name: 'Natalie Dupond',
    company: 'Aura Skincare Paris',
    email: 'natalie@auraskincare.fr',
    tier: 'starter' as CustomerTier,
    channel: 'app_store' as FeedbackChannel,
    rating: 3,
    content:
      'The mobile dashboard is gorgeous, but dark mode contrast on the trend line makes the negative numbers difficult to read under direct sunlight. Please add high contrast toggle.',
  },
];

export function NewFeedbackModal({
  workspaceId,
  isOpen,
  onClose,
  onSubmit,
  theme = 'light',
}: NewFeedbackModalProps) {
  const isDark = theme === 'dark';

  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTier, setCustomerTier] = useState<CustomerTier>('growth');
  const [channel, setChannel] = useState<FeedbackChannel>('zendesk');
  const [rating, setRating] = useState<number>(3);
  const [content, setContent] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoadSample = () => {
    const sample = SAMPLE_FEEDBACKS[Math.floor(Math.random() * SAMPLE_FEEDBACKS.length)];
    setCustomerName(sample.name);
    setCustomerCompany(sample.company);
    setCustomerEmail(sample.email);
    setCustomerTier(sample.tier);
    setChannel(sample.channel);
    setRating(sample.rating);
    setContent(sample.content);
    setAiAnalysis(null);
    setError('');
  };

  const handleAnalyzeWithAI = async () => {
    if (!content.trim()) {
      setError('Please provide feedback text before running AI intelligence analysis.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/feedback/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          channel,
          customerCompany,
          customerTier,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze feedback');
      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError('AI classification fallback activated. Ingestion will continue with local heuristic parser.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !customerCompany.trim()) {
      setError('Company name and feedback content are required.');
      return;
    }

    const payload: Partial<FeedbackItem> = {
      workspaceId,
      customerName: customerName || 'Anonymous Customer',
      customerCompany,
      customerEmail: customerEmail || `feedback@${customerCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      customerTier,
      channel,
      content,
      rating,
      sentiment: aiAnalysis?.sentiment || (rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral'),
      sentimentScore: aiAnalysis?.sentimentScore || (rating >= 4 ? 0.75 : rating <= 2 ? -0.7 : 0),
      urgency: aiAnalysis?.urgency || (rating === 1 ? 'critical' : rating <= 2 ? 'high' : 'medium'),
      churnRisk: aiAnalysis?.churnRisk || (rating === 1 && customerTier === 'enterprise' ? 'high' : 'low'),
      themes: aiAnalysis?.themes || ['Feature Request', 'UI & Usability'],
      aiSummary: aiAnalysis?.aiSummary || content.slice(0, 100),
      actionableNextStep: aiAnalysis?.actionableNextStep || 'Review and triage to team lead',
      assignedTeam: aiAnalysis?.assignedTeam || 'Product',
      status: 'new',
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div
      id="new-feedback-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border transition-all animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-tight">Manual Ingest & AI Intelligence Analysis</h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Inject customer voice signals into LOOP with automated classification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sample</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Company / Account Name *
              </label>
              <input
                type="text"
                required
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="e.g. Apex Financial Corp"
                className={`w-full px-3 py-2 text-xs rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Customer Contact Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className={`w-full px-3 py-2 text-xs rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Source Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className={`w-full px-2.5 py-2 text-xs rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="zendesk">Zendesk</option>
                <option value="intercom">Intercom</option>
                <option value="app_store">App Store</option>
                <option value="g2">G2 Crowd</option>
                <option value="trustpilot">Trustpilot</option>
                <option value="email">Inbound Email</option>
                <option value="in_app_survey">In-App Survey</option>
                <option value="slack">Slack Connect</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Account Tier
              </label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value as any)}
                className={`w-full px-2.5 py-2 text-xs rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="enterprise">Enterprise</option>
                <option value="growth">Growth</option>
                <option value="starter">Starter</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Rating (1 to 5)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={`w-full px-2.5 py-2 text-xs rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Delighted)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Neutral)</option>
                <option value={2}>⭐⭐ (2 - Poor)</option>
                <option value={1}>⭐ (1 - Critical / Broken)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Raw Customer Feedback Content *
              </label>
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={analyzing || !content.trim()}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 disabled:opacity-50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>Test Live AI Analysis</span>
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw customer feedback, support ticket transcript, app store review, or G2 commentary..."
              className={`w-full p-3 text-xs rounded-xl border resize-none leading-relaxed transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* AI Pre-Analysis Output (if run) */}
          {aiAnalysis && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                isDark ? 'bg-indigo-950/30 border-indigo-900/60' : 'bg-indigo-50/70 border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Instant AI Classification Results
                </span>
                <span
                  className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                    aiAnalysis.sentiment === 'positive'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : aiAnalysis.sentiment === 'negative'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {aiAnalysis.sentiment.toUpperCase()} ({aiAnalysis.sentimentScore > 0 ? `+${aiAnalysis.sentimentScore}` : aiAnalysis.sentimentScore})
                </span>
              </div>
              <div className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                <strong>Summary:</strong> {aiAnalysis.aiSummary}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-indigo-400">
                <span className="font-semibold">Urgency: {aiAnalysis.urgency}</span>
                <span>•</span>
                <span className="font-semibold">Churn Risk: {aiAnalysis.churnRisk}</span>
                <span>•</span>
                <span className="font-semibold">Assigned: {aiAnalysis.assignedTeam}</span>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className={`pt-3 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={analyzing}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ingest & Classify</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
