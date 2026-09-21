import React from 'react';
import {
  Cable,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Code2,
  Copy,
  Check,
  Plus,
  Radio,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import { WorkspaceTenant, FeedbackChannel } from '../types';
import { CHANNEL_CONFIG } from './ChannelIcon';

interface IntegrationsHubProps {
  workspace: WorkspaceTenant;
  onGenerateSynthetic: (count: number, topic?: string) => Promise<void>;
  isGeneratingSynthetic: boolean;
  onBatchUploadMock: () => void;
  theme?: 'light' | 'dark';
}

const CONNECTOR_LIST: {
  channel: FeedbackChannel;
  status: 'connected' | 'syncing' | 'paused';
  syncRate: string;
  lastSync: string;
}[] = [
  { channel: 'zendesk', status: 'connected', syncRate: 'Real-time Webhook', lastSync: '1 min ago' },
  { channel: 'intercom', status: 'connected', syncRate: 'Event Stream', lastSync: '3 mins ago' },
  { channel: 'g2', status: 'connected', syncRate: 'Daily Scrape', lastSync: '2 hrs ago' },
  { channel: 'app_store', status: 'connected', syncRate: 'App Store Connect API', lastSync: '4 hrs ago' },
  { channel: 'trustpilot', status: 'connected', syncRate: 'Partner Webhook', lastSync: '6 hrs ago' },
  { channel: 'email', status: 'connected', syncRate: 'IMAP / Forwarder', lastSync: 'Just now' },
  { channel: 'in_app_survey', status: 'connected', syncRate: 'Client SDK Event', lastSync: '12 mins ago' },
  { channel: 'slack', status: 'connected', syncRate: 'Slack Bot #customer-voice', lastSync: '5 mins ago' },
  { channel: 'twitter', status: 'connected', syncRate: 'Social Mention Filter', lastSync: '30 mins ago' },
];

export function IntegrationsHub({
  workspace,
  onGenerateSynthetic,
  isGeneratingSynthetic,
  onBatchUploadMock,
  theme = 'light',
}: IntegrationsHubProps) {
  const isDark = theme === 'dark';
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [topicPrompt, setTopicPrompt] = React.useState('');

  const webhookUrl = `${window.location.origin}/api/webhook/feedback?workspaceId=${workspace.id}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div id="integrations-hub-container" className="space-y-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">Feedback Connectors & Ingestion</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                9 Live Connectors
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Aggregate customer sentiment, reviews, bug reports, and survey scores into a single unified stream.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="batch-upload-csv-btn"
              onClick={onBatchUploadMock}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Upload CSV / Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Synthetic Signal Generator Tool */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-indigo-950/80 text-slate-100'
            : 'bg-linear-to-r from-indigo-50/70 to-purple-50/70 border-indigo-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-tight">Simulate Multi-Channel Signals with Gemini AI</h2>
        </div>
        <p className={`text-xs max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Simulate how LOOP handles complex billing disputes, praise for newly launched features, or urgent outages.
          Synthetic feedback items will flow through the real-time classification pipeline immediately.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            placeholder="e.g. 'enterprise SSO lockouts', 'pricing pushback', 'mobile praise'"
            className={`flex-1 w-full px-3 py-2 text-xs rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="generate-3-signals-btn"
              onClick={() => onGenerateSynthetic(3, topicPrompt)}
              disabled={isGeneratingSynthetic}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {isGeneratingSynthetic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Generate 3 Signals</span>
            </button>

            <button
              id="generate-1-signal-btn"
              onClick={() => onGenerateSynthetic(1, topicPrompt)}
              disabled={isGeneratingSynthetic}
              className={`flex-1 sm:flex-none px-3.5 py-2 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>+1 Signal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Webhook Endpoint Box */}
      <div
        className={`rounded-2xl border p-5 space-y-3 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Live Inbound Webhook Listener
            </h3>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            HTTP POST 200 Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={webhookUrl}
            className={`flex-1 px-3 py-2 text-xs font-mono rounded-xl border focus:outline-hidden ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          />
          <button
            id="copy-webhook-url-btn"
            onClick={handleCopyWebhook}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isDark
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      {/* 9 Channel Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONNECTOR_LIST.map((conn) => {
          const config = CHANNEL_CONFIG[conn.channel];
          const IconComp = config.icon;

          return (
            <div
              key={conn.channel}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all space-y-3 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-100'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${config.bg} border`}>
                    <IconComp className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{config.label}</h4>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{conn.syncRate}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                <span>Last sync: {conn.lastSync}</span>
                <button className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors cursor-pointer">
                  Configure →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
