import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Building,
} from 'lucide-react';
import { VoCReport, WorkspaceTenant, UserRole } from '../types';

interface VoCReportsViewProps {
  workspace: WorkspaceTenant;
  userRole: UserRole;
  currentReport: VoCReport | null;
  onGenerateReport: (customFocus?: string) => Promise<void>;
  isGenerating: boolean;
  theme?: 'light' | 'dark';
}

export function VoCReportsView({
  workspace,
  userRole,
  currentReport,
  onGenerateReport,
  isGenerating,
  theme = 'light',
}: VoCReportsViewProps) {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [customFocus, setCustomFocus] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCopyMarkdown = () => {
    if (!currentReport) return;
    const md = `# ${currentReport.title}
**Workspace**: ${workspace.name} (${workspace.industry})
**Date Range**: ${currentReport.dateRange}
**Generated**: ${new Date(currentReport.generatedAt).toLocaleString()}

## Executive Summary
${currentReport.executiveSummary}

## Platform Health Metrics
- **NPS Score**: +${currentReport.overallHealth.nps}
- **Average CSAT**: ${currentReport.overallHealth.csat} / 5.0
- **Positive Feedback**: ${currentReport.overallHealth.positivePercentage}%
- **Negative Feedback**: ${currentReport.overallHealth.negativePercentage}%
- **Total Signals Analyzed**: ${currentReport.overallHealth.totalFeedbackAnalyzed}

## Key Themes & Voice-of-Customer Signals
${currentReport.keyThemes.map((t) => `- **${t.theme}** (${t.sentimentRatio}, ${t.volume} mentions): ${t.summary}`).join('\n')}

## Emerging Trends & Anomaly Alerts
${currentReport.emergingTrends.map((tr) => `- [${tr.type.toUpperCase()}] **${tr.trend}**: ${tr.evidence}`).join('\n')}

## High Churn Risk Accounts
${currentReport.criticalChurnRisks.map((cr) => `- **${cr.account}** (${cr.tier}): ${cr.issue} [${cr.urgency}]`).join('\n')}

## Cross-Functional Action Plan
${currentReport.strategicActionItems.map((ai) => `- [${ai.priority}] **${ai.team}**: ${ai.action}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="voc-reports-container" className="space-y-6">
      {/* Top Header & Generator Bar */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">Executive VoC Briefing</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isDark
                    ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                Boardroom Intelligence
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Synthesizes customer sentiment, recurring product friction, emerging anomalies, and renewal risks into an actionable report.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {showCustomInput ? 'Standard Focus' : 'Custom Report Focus'}
            </button>

            <button
              id="copy-voc-markdown-btn"
              onClick={handleCopyMarkdown}
              disabled={!currentReport}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Export Brief'}</span>
            </button>

            <button
              id="generate-new-voc-btn"
              onClick={() => onGenerateReport(customFocus || undefined)}
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer shadow-xs ${
                isDark ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing VoC...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Fresh Brief</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Focus Prompt Input */}
        {showCustomInput && (
          <div className={`mt-4 pt-3 border-t flex gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g. Focus specifically on enterprise churn risk, SSO stability, and Q3 billing disputes..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              onClick={() => onGenerateReport(customFocus)}
              disabled={isGenerating || !customFocus.trim()}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold disabled:opacity-50"
            >
              Run Customized
            </button>
          </div>
        )}
      </div>

      {/* Report Document Presentation */}
      {!currentReport ? (
        <div
          className={`rounded-2xl border p-12 text-center ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <FileText className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className="text-sm font-semibold">No Voice-of-Customer report generated yet</h3>
          <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Click "Generate Fresh Brief" to synthesize customer feedback signals into an executive intelligence brief.
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border p-6 md:p-8 space-y-6 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          {/* Brief Header */}
          <div className={`border-b pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  CONFIDENTIAL EXECUTIVE BRIEF
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  • {currentReport.dateRange}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-2">{currentReport.title}</h2>
              <div className={`flex items-center gap-4 text-xs mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Workspace: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{workspace.name}</strong></span>
                <span>Industry: {workspace.industry}</span>
                <span>Generated: {new Date(currentReport.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Overall Scorecard Pill */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-center px-2">
                <div className="text-lg font-bold text-emerald-500">+{currentReport.overallHealth.nps}</div>
                <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NPS Index</div>
              </div>
              <div className={`w-px h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className="text-center px-2">
                <div className="text-lg font-bold">{currentReport.overallHealth.csat}</div>
                <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CSAT / 5.0</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Executive Summary & Sentiment Overview
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed p-4 rounded-xl border ${
                isDark
                  ? 'bg-slate-800/40 border-slate-800 text-slate-200'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-800'
              }`}
            >
              {currentReport.executiveSummary}
            </p>
          </div>

          {/* Section 2: Key Themes Grid */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Recurring Customer Friction & Feature Themes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentReport.keyThemes.map((theme, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold">{theme.theme}</span>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {theme.volume} signals
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{theme.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: High Churn Accounts */}
          {currentReport.criticalChurnRisks && currentReport.criticalChurnRisks.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Enterprise Accounts at Critical Churn Risk
              </h3>
              <div className="space-y-2">
                {currentReport.criticalChurnRisks.map((risk, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isDark
                        ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{risk.account}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.2 rounded font-bold border border-rose-300/40">
                          {risk.tier}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 opacity-90">{risk.issue}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white self-start sm:self-auto shrink-0">
                      {risk.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Cross-Functional Action Plan */}
          {currentReport.strategicActionItems && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cross-Functional Action Roadmap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentReport.strategicActionItems.map((action, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                      isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-indigo-500">{action.team}</span>
                        <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          [{action.priority}]
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{action.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
