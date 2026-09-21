import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  Building,
  User,
  Mail,
  Calendar,
  Send,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
} from 'lucide-react';
import { FeedbackItem, UserRole } from '../types';
import { ChannelIcon } from './ChannelIcon';

interface FeedbackDetailModalProps {
  item: FeedbackItem | null;
  userRole: UserRole;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'new' | 'investigating' | 'planned' | 'resolved') => void;
  onUpdateTeam: (id: string, team: 'Product' | 'Support' | 'Engineering' | 'Executive') => void;
  theme?: 'light' | 'dark';
}

export function FeedbackDetailModal({
  item,
  userRole,
  onClose,
  onUpdateStatus,
  onUpdateTeam,
  theme = 'light',
}: FeedbackDetailModalProps) {
  const isDark = theme === 'dark';
  const [draftType, setDraftType] = useState<'customer_reply' | 'jira_ticket'>('customer_reply');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      generateDraftFor(item, draftType);
    }
  }, [item, draftType]);

  if (!item) return null;

  const generateDraftFor = (feedback: FeedbackItem, type: 'customer_reply' | 'jira_ticket') => {
    setIsGenerating(true);
    setTimeout(() => {
      if (type === 'customer_reply') {
        const greeting = `Hi ${feedback.customerName.split(' ')[0] || 'there'},\n\n`;
        let body = '';
        if (feedback.sentiment === 'negative' || feedback.urgency === 'critical') {
          body = `Thank you for sharing this critical feedback regarding ${feedback.themes.join(' and ')} at ${feedback.customerCompany}. I want to personally apologize for the disruption this caused your team.\n\nOur engineering team has been mobilized on this issue (${feedback.actionableNextStep || 'active investigation in progress'}). I have also escalated this to our leadership team.\n\nWould you have 15 minutes tomorrow for a direct call with our technical lead to ensure your workflow is fully stabilized?\n\nWarm regards,\nLOOP Customer Success & Support`;
        } else {
          body = `Thank you so much for the fantastic feedback! We are thrilled to hear that our recent updates to ${feedback.themes.join(' and ')} are delivering measurable results for ${feedback.customerCompany}.\n\nYour feedback directly informs our quarterly roadmap. Please let us know if there is anything else our team can support you with.\n\nBest regards,\nLOOP Team`;
        }
        setGeneratedDraft(greeting + body);
      } else {
        const ticket = `[ISSUE - ${feedback.customerTier.toUpperCase()}] ${feedback.themes[0] || 'Feature'} Friction Reported by ${feedback.customerCompany}
Severity: ${feedback.urgency.toUpperCase()}
Customer Tier: ${feedback.customerTier.toUpperCase()}
Source Channel: ${feedback.channel}
Assigned Department: ${feedback.assignedTeam || 'Engineering'}

1. Customer Signal Context:
"${feedback.content}"

2. AI Intelligence Summary:
${feedback.aiSummary}

3. Recommended Remediation:
${feedback.actionableNextStep}

4. Acceptance Criteria:
- Root cause identified for ${feedback.customerCompany}
- Regression test suite expanded
- Customer account manager notified upon resolution deployment`;
        setGeneratedDraft(ticket);
      }
      setIsGenerating(false);
    }, 200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="feedback-detail-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in"
    >
      <div
        className={`w-full max-w-2xl h-full shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <ChannelIcon channel={item.channel} showLabel />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>ID: {item.id}</span>
          </div>
          <button
            id="close-feedback-detail-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Customer Metadata Card */}
          <div
            className={`rounded-2xl border p-4 ${
              isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className={`block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Customer</span>
                <span className="font-semibold mt-0.5 block">{item.customerName}</span>
              </div>
              <div>
                <span className={`block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Company</span>
                <span className="font-semibold mt-0.5 block">{item.customerCompany}</span>
              </div>
              <div>
                <span className={`block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Account Tier</span>
                <span className="font-bold text-indigo-500 capitalize mt-0.5 block">{item.customerTier}</span>
              </div>
              <div>
                <span className={`block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email</span>
                <span className="truncate mt-0.5 block font-mono text-[11px]">{item.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Raw Feedback Card */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Raw Customer Voice
            </h3>
            <div
              className={`rounded-2xl border p-4 shadow-xs ${
                isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <p className="text-sm leading-relaxed italic">"{item.content}"</p>
              <div
                className={`mt-3 flex items-center justify-between text-xs pt-2 border-t ${
                  isDark ? 'border-slate-700/60 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}
              >
                <span>Received {new Date(item.createdAt).toLocaleString()}</span>
                {typeof item.rating === 'number' && (
                  <span className="font-semibold text-amber-500">Customer Rating: {item.rating}/5.0</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Intelligence Classification Matrix */}
          <div
            className={`rounded-2xl border p-4 space-y-3 ${
              isDark ? 'bg-indigo-950/20 border-indigo-900/40' : 'bg-indigo-50/50 border-indigo-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Intelligence Diagnosis</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-400">Gemini 3.8 Flash</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                className={`rounded-xl p-2.5 border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-indigo-100/60 shadow-2xs'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  Sentiment Score
                </span>
                <span
                  className={`text-sm font-bold mt-1 block ${
                    item.sentimentScore > 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore} ({item.sentiment})
                </span>
              </div>

              <div
                className={`rounded-xl p-2.5 border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-indigo-100/60 shadow-2xs'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  Urgency Level
                </span>
                <span
                  className={`text-sm font-bold mt-1 uppercase block ${
                    item.urgency === 'critical' ? 'text-rose-500 animate-pulse' : isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {item.urgency}
                </span>
              </div>

              <div
                className={`rounded-xl p-2.5 border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-indigo-100/60 shadow-2xs'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  Churn Probability
                </span>
                <span
                  className={`text-sm font-bold mt-1 uppercase block ${
                    item.churnRisk === 'high' ? 'text-amber-500' : 'text-emerald-500'
                  }`}
                >
                  {item.churnRisk}
                </span>
              </div>
            </div>

            {/* AI Summary and Next Step */}
            <div className="space-y-2 pt-2">
              <div className="text-xs">
                <span className="font-bold text-indigo-400">Executive Synthesis: </span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{item.aiSummary}</span>
              </div>

              <div className="text-xs">
                <span className="font-bold text-emerald-500">Recommended Action: </span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{item.actionableNextStep}</span>
              </div>
            </div>
          </div>

          {/* Management Controls: Status & Team Assignment */}
          <div
            className={`rounded-2xl border p-4 space-y-3 ${
              isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Lifecycle Status & Department Routing
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`block font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Resolution Status</label>
                <select
                  value={item.status}
                  onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="investigating">Investigating</option>
                  <option value="planned">Planned for Sprint</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Assigned Team</label>
                <select
                  value={item.assignedTeam || 'Product'}
                  onChange={(e) => onUpdateTeam(item.id, e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="Product">Product Management</option>
                  <option value="Engineering">Core Engineering</option>
                  <option value="Support">Customer Support</option>
                  <option value="Executive">Executive Leadership</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Response & Jira Ticket Generator */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Automated Resolution Draft</span>
              </div>

              <div
                className={`flex p-0.5 rounded-lg border text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  onClick={() => setDraftType('customer_reply')}
                  className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                    draftType === 'customer_reply'
                      ? isDark
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  Customer Reply
                </button>
                <button
                  onClick={() => setDraftType('jira_ticket')}
                  className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                    draftType === 'jira_ticket'
                      ? isDark
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  Jira Issue
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                rows={7}
                className={`w-full p-3.5 rounded-2xl text-xs font-mono border leading-relaxed focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
              <button
                onClick={handleCopy}
                className={`absolute right-3 top-3 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border shadow-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
