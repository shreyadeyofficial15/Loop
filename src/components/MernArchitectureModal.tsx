import React, { useEffect, useState } from 'react';
import {
  Database,
  Server,
  Code2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface MernArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function MernArchitectureModal({
  isOpen,
  onClose,
  theme = 'light',
}: MernArchitectureModalProps) {
  const isDark = theme === 'dark';
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mern-status');
      const data = await res.json();
      setDiagnostics(data);
    } catch (err) {
      console.error('Failed to fetch MERN status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUriTemplate = () => {
    navigator.clipboard.writeText(
      'MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/loop?retryWrites=true&w=majority"'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="mern-architecture-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border transition-all animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-xs">
              MERN
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">MERN Stack Architecture Inspector</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                MongoDB (Mongoose ODM) • Express.js • React 19 • Node.js Runtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Refresh Diagnostics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* MongoDB Pillar */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-850/80 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  MongoDB
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                  Mongoose ODM
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Document Data Layer</p>
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Status:</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {diagnostics?.database?.status === 'connected' ? 'Atlas Live' : 'Embedded Live'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Feedback Docs:</span>
                  <span className="font-mono font-bold">{diagnostics?.database?.counts?.feedback ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Workspaces:</span>
                  <span className="font-mono font-bold">{diagnostics?.database?.counts?.workspaces ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Express Pillar */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-850/80 border-slate-800' : 'bg-indigo-50/50 border-indigo-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-500 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  Express.js
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                  v4.21 REST
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Application Server</p>
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Port:</span>
                  <span className="font-mono font-bold">3000 (0.0.0.0)</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Active Routes:</span>
                  <span className="font-mono font-bold">10 Endpoints</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>JSON Parser:</span>
                  <span className="font-mono text-emerald-500 font-semibold">10mb Limit</span>
                </div>
              </div>
            </div>

            {/* React Pillar */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-850/80 border-slate-800' : 'bg-sky-50/50 border-sky-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-500 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  React.js
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 font-bold">
                  React 19 + Vite
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Client User Interface</p>
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Theme Engine:</span>
                  <span className="font-semibold text-sky-500 capitalize">{theme} Mode</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>CSS Framework:</span>
                  <span className="font-mono font-bold">Tailwind v4</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Charts:</span>
                  <span className="font-mono font-bold">Recharts</span>
                </div>
              </div>
            </div>

            {/* Node Pillar */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-850/80 border-slate-800' : 'bg-amber-50/50 border-amber-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  Node.js
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                  ESM Runtime
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Execution Environment</p>
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Container:</span>
                  <span className="font-mono font-bold">Cloud Run Linux</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Engine:</span>
                  <span className="font-mono font-bold">Node.js LTS</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Vite Middleware:</span>
                  <span className="font-mono text-emerald-500 font-semibold">Mounted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mongoose ODM Schemas Details */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>MongoDB Collections & Mongoose Schemas</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Database: loop</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold mb-1">
                  <span className="text-emerald-500">models/Feedback.ts</span>
                  <span className="text-[11px] text-slate-400">{diagnostics?.database?.counts?.feedback ?? 0} docs</span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Stores multi-channel customer voice signals with sentiment score, churn risk, themes, rating, and AI summary.
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold mb-1">
                  <span className="text-emerald-500">models/Workspace.ts</span>
                  <span className="text-[11px] text-slate-400">{diagnostics?.database?.counts?.workspaces ?? 0} docs</span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Multi-tenant isolation documents containing industry classification, plan tier, and tenant health indicators.
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold mb-1">
                  <span className="text-emerald-500">models/Insight.ts</span>
                  <span className="text-[11px] text-slate-400">{diagnostics?.database?.counts?.insights ?? 0} docs</span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Actionable strategic recommendations with impact levels, effort categorization, and projected sentiment lift.
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold mb-1">
                  <span className="text-emerald-500">models/VoCReport.ts</span>
                  <span className="text-[11px] text-slate-400">{diagnostics?.database?.counts?.vocReports ?? 0} docs</span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Executive Voice-of-Customer briefings with health metrics, emerging risk matrices, and team action roadmaps.
                </p>
              </div>
            </div>
          </div>

          {/* Express.js REST API Registry */}
          <div>
            <h3 className="text-xs font-bold mb-2.5 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              <span>Express.js REST API Pipeline</span>
            </h3>

            <div className={`rounded-xl border overflow-hidden text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <table className="w-full text-left">
                <thead className={`text-[11px] uppercase font-bold border-b ${isDark ? 'bg-slate-850 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th className="px-3 py-2">Method</th>
                    <th className="px-3 py-2 font-mono">Route Path</th>
                    <th className="px-3 py-2">MongoDB Controller Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono text-[11px] ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">GET</span></td>
                    <td className="px-3 py-2">/api/feedback</td>
                    <td className="px-3 py-2 font-sans text-xs">Query customer feedback documents with MongoDB filter</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-500 font-bold">POST</span></td>
                    <td className="px-3 py-2">/api/feedback</td>
                    <td className="px-3 py-2 font-sans text-xs">Create and validate feedback document with FeedbackModel</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">PUT</span></td>
                    <td className="px-3 py-2">/api/feedback/:id</td>
                    <td className="px-3 py-2 font-sans text-xs">Update status, triage team, or resolution details</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 font-bold">DELETE</span></td>
                    <td className="px-3 py-2">/api/feedback/:id</td>
                    <td className="px-3 py-2 font-sans text-xs">Remove feedback document by _id from MongoDB collection</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-500 font-bold">POST</span></td>
                    <td className="px-3 py-2">/api/feedback/ask</td>
                    <td className="px-3 py-2 font-sans text-xs">Execute natural language Q&A over MongoDB feedback corpus</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-500 font-bold">POST</span></td>
                    <td className="px-3 py-2">/api/feedback/voc-report</td>
                    <td className="px-3 py-2 font-sans text-xs">Synthesize and persist executive VoC intelligence briefing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Connection String Helper */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              isDark ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                MongoDB Atlas Connection String Configuration
              </span>
              <button
                onClick={handleCopyUriTemplate}
                className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy env template'}</span>
              </button>
            </div>
            <p className={`text-[11px] leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The application automatically handles both remote MongoDB Atlas clusters (via <code className="font-mono text-indigo-400">MONGODB_URI</code>) and embedded high-speed MongoDB-compatible storage.
            </p>
            <div className={`p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-800 border'}`}>
              MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/loop?retryWrites=true&amp;w=majority"
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${isDark ? 'border-slate-800 bg-slate-850' : 'border-slate-100 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
