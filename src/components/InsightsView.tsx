import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building,
  Layers,
  Check,
  AlertCircle,
} from 'lucide-react';
import { InsightRecommendation, WorkspaceTenant, UserRole, FeedbackItem } from '../types';

interface InsightsViewProps {
  insights: InsightRecommendation[];
  workspace: WorkspaceTenant;
  userRole: UserRole;
  feedbacks: FeedbackItem[];
  onUpdateInsightStatus: (id: string, status: 'open' | 'in_progress' | 'completed') => void;
  onSelectFeedback: (item: FeedbackItem) => void;
  theme?: 'light' | 'dark';
}

export function InsightsView({
  insights,
  workspace,
  userRole,
  feedbacks,
  onUpdateInsightStatus,
  onSelectFeedback,
  theme = 'light',
}: InsightsViewProps) {
  const isDark = theme === 'dark';

  const openCount = insights.filter((i) => i.status === 'open').length;
  const inProgressCount = insights.filter((i) => i.status === 'in_progress').length;
  const completedCount = insights.filter((i) => i.status === 'completed').length;

  return (
    <div id="insights-view-container" className="space-y-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">Actionable Insights & Initiatives</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                AI Prioritized
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Initiatives automatically identified from recurring customer friction, feature requests, and churn warnings.
            </p>
          </div>

          {/* Status Counters */}
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-rose-950/50 text-rose-300 border-rose-900/60' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {openCount} Open Initiatives
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-amber-950/50 text-amber-300 border-amber-900/60' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {inProgressCount} In Progress
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-emerald-950/50 text-emerald-300 border-emerald-900/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {completedCount} Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            id={`insight-card-${insight.id}`}
            className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
              insight.impact === 'Critical'
                ? isDark
                  ? 'border-rose-900/70 bg-slate-900'
                  : 'border-rose-300 bg-white shadow-xs'
                : isDark
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-xs'
            }`}
          >
            <div>
              {/* Header row: Impact & Team */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      insight.impact === 'Critical'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : insight.impact === 'High'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {insight.impact} impact
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {insight.department.toUpperCase()} TEAM
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'
                    }`}
                  >
                    {insight.effort}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {insight.affectedAccounts} accounts affected
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-sm tracking-tight mb-1">{insight.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {insight.description}
              </p>

              {/* Category tag */}
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                  isDark ? 'bg-slate-800 text-indigo-300 border-slate-700' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  {insight.category}
                </span>
              </div>

              {/* Estimated Metric Impact */}
              <div className={`mt-3 flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Projected Sentiment Lift: </span>
                <span className="font-semibold text-emerald-500">{insight.sentimentLiftEstimate}</span>
              </div>
            </div>

            {/* Footer: Status Toggle Controls */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Status: <strong className="capitalize">{insight.status.replace('_', ' ')}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                {insight.status !== 'open' && (
                  <button
                    onClick={() => onUpdateInsightStatus(insight.id, 'open')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Open
                  </button>
                )}
                {insight.status !== 'in_progress' && (
                  <button
                    onClick={() => onUpdateInsightStatus(insight.id, 'in_progress')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                      isDark ? 'bg-amber-950/50 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    In Progress
                  </button>
                )}
                {insight.status !== 'completed' && (
                  <button
                    onClick={() => onUpdateInsightStatus(insight.id, 'completed')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                      isDark ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
