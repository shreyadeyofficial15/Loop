import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Filter,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { FeedbackItem, WorkspaceTenant, UserRole } from '../types';

interface AnalyticsDashboardProps {
  feedbacks: FeedbackItem[];
  workspace: WorkspaceTenant;
  userRole: UserRole;
  onNavigateToFeedback: (filterKey?: string, filterValue?: string) => void;
  onNavigateToVoC: () => void;
  onOpenAskAi: (initialQuery?: string) => void;
  theme?: 'light' | 'dark';
}

export function AnalyticsDashboard({
  feedbacks,
  workspace,
  userRole,
  onNavigateToFeedback,
  onNavigateToVoC,
  onOpenAskAi,
  theme = 'light',
}: AnalyticsDashboardProps) {
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('7d');

  // Calculations
  const totalSignals = feedbacks.length;
  const positiveCount = feedbacks.filter((f) => f.sentiment === 'positive').length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === 'negative').length;
  const neutralCount = feedbacks.filter((f) => f.sentiment === 'neutral' || f.sentiment === 'mixed').length;

  const positivePercent = totalSignals > 0 ? Math.round((positiveCount / totalSignals) * 100) : 0;
  const negativePercent = totalSignals > 0 ? Math.round((negativeCount / totalSignals) * 100) : 0;
  const netSentimentScore = positivePercent - negativePercent;

  const criticalUrgencyCount = feedbacks.filter((f) => f.urgency === 'critical').length;
  const highChurnRiskCount = feedbacks.filter((f) => f.churnRisk === 'high').length;

  const ratedItems = feedbacks.filter((f) => typeof f.rating === 'number');
  const avgRating =
    ratedItems.length > 0
      ? (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
      : '4.2';

  // Sentiment distribution pie data
  const sentimentPieData = [
    { name: 'Positive', value: positiveCount, color: '#10b981' },
    { name: 'Neutral / Mixed', value: neutralCount, color: isDark ? '#818cf8' : '#6366f1' },
    { name: 'Negative', value: negativeCount, color: '#f43f5e' },
  ];

  // Channel Breakdown
  const channelCounts: Record<string, { total: number; positive: number; negative: number }> = {};
  feedbacks.forEach((f) => {
    const ch = f.channel;
    if (!channelCounts[ch]) {
      channelCounts[ch] = { total: 0, positive: 0, negative: 0 };
    }
    channelCounts[ch].total += 1;
    if (f.sentiment === 'positive') channelCounts[ch].positive += 1;
    if (f.sentiment === 'negative') channelCounts[ch].negative += 1;
  });

  const channelChartData = Object.entries(channelCounts)
    .map(([channel, data]) => ({
      channel: channel.replace('_', ' ').toUpperCase(),
      rawChannel: channel,
      Total: data.total,
      Positive: data.positive,
      Negative: data.negative,
    }))
    .sort((a, b) => b.Total - a.Total);

  // Category Themes Breakdown
  const themeCounts: Record<string, { total: number; positive: number; negative: number }> = {};
  feedbacks.forEach((f) => {
    f.themes.forEach((t) => {
      if (!themeCounts[t]) {
        themeCounts[t] = { total: 0, positive: 0, negative: 0 };
      }
      themeCounts[t].total += 1;
      if (f.sentiment === 'positive') themeCounts[t].positive += 1;
      if (f.sentiment === 'negative') themeCounts[t].negative += 1;
    });
  });

  const themeChartData = Object.entries(themeCounts)
    .map(([themeName, data]) => ({
      theme: themeName,
      count: data.total,
      positiveRatio: Math.round((data.positive / data.total) * 100),
      negativeRatio: Math.round((data.negative / data.total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Timeline Trend Data
  const timelineData = [
    { date: 'Sep 14', positive: 14, neutral: 5, negative: 4 },
    { date: 'Sep 15', positive: 18, neutral: 6, negative: 3 },
    { date: 'Sep 16', positive: 16, neutral: 4, negative: 7 },
    { date: 'Sep 17', positive: 22, neutral: 8, negative: 5 },
    { date: 'Sep 18', positive: 19, neutral: 7, negative: 9 },
    { date: 'Sep 19', positive: 25, neutral: 9, negative: 6 },
    { date: 'Sep 20', positive: Math.max(12, positiveCount), neutral: neutralCount, negative: negativeCount },
  ];

  // Chart theme tokens
  const chartGridColor = isDark ? '#334155' : '#f1f5f9';
  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  return (
    <div id="analytics-dashboard-container" className="space-y-6">
      {/* Top Header & Controls */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">Intelligence Dashboard</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                Live Telemetry
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Analyzing customer signals across 9 channels for{' '}
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {workspace.name}
              </span>
            </p>
          </div>

          {/* Timeframe selector & Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Timeframe pill selector */}
            <div
              className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {(['7d', '30d', '90d', 'all'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    timeframe === tf
                      ? isDark
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf === 'all' ? 'All' : tf.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              id="ask-ai-trend-btn"
              onClick={() => onOpenAskAi('What are the main drivers behind our net sentiment score this week?')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800 hover:bg-indigo-900/80'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sentiment Drivers</span>
            </button>

            <button
              id="view-voc-brief-btn"
              onClick={onNavigateToVoC}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-slate-100 hover:bg-white text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>VoC Executive Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner (if high churn or critical urgency exists) */}
      {criticalUrgencyCount > 0 && (
        <div
          id="critical-alerts-strip"
          className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark
              ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
              : 'bg-rose-50/90 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? 'bg-rose-900/50 text-rose-300' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Action Required • {criticalUrgencyCount} Critical Feedback Items Flagged
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-rose-300/80' : 'text-rose-800'}`}>
                Active authentication and billing disputes threaten high-tier enterprise renewals.
              </p>
            </div>
          </div>
          <button
            id="triage-critical-feedback-btn"
            onClick={() => onNavigateToFeedback('urgency', 'critical')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all shrink-0 cursor-pointer ${
              isDark
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-rose-700 hover:bg-rose-800 text-white'
            }`}
          >
            Triage Critical Queue
          </button>
        </div>
      )}

      {/* Modern High-Contrast KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Signals */}
        <div
          id="kpi-total-signals"
          onClick={() => onNavigateToFeedback()}
          className={`rounded-xl border p-4 transition-all cursor-pointer group ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-100'
              : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Signals Ingested
            </span>
            <Layers className={`w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`} />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight">{totalSignals}</div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18% 7d
            </span>
          </div>
          <div className={`mt-2.5 text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Across 9 customer channels</span>
          </div>
        </div>

        {/* Card 2: Net Sentiment Score */}
        <div
          id="kpi-net-sentiment"
          onClick={() => onNavigateToFeedback('sentiment', 'positive')}
          className={`rounded-xl border p-4 transition-all cursor-pointer group ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 text-slate-100'
              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Net Sentiment (NSS)
            </span>
            <TrendingUp className={`w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-600'}`} />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-emerald-500">
              {netSentimentScore > 0 ? `+${netSentimentScore}%` : `${netSentimentScore}%`}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-emerald-500 font-semibold">{positivePercent}% pos</span>
              <span className="opacity-40">/</span>
              <span className="text-rose-500 font-semibold">{negativePercent}% neg</span>
            </div>
          </div>
          {/* Visual bar */}
          <div className={`mt-2.5 w-full h-1.5 rounded-full overflow-hidden flex ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="bg-emerald-500 h-full" style={{ width: `${positivePercent}%` }} />
            <div className="bg-indigo-500 h-full" style={{ width: `${100 - positivePercent - negativePercent}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${negativePercent}%` }} />
          </div>
        </div>

        {/* Card 3: Churn Risk Accounts */}
        <div
          id="kpi-churn-risk"
          onClick={() => onNavigateToFeedback('urgency', 'critical')}
          className={`rounded-xl border p-4 transition-all cursor-pointer group ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-rose-500/50 text-slate-100'
              : 'bg-white border-slate-200 hover:border-rose-300 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              High Churn Risk
            </span>
            <AlertTriangle className={`w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-rose-600'}`} />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-rose-500">{highChurnRiskCount} Accounts</div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-500">
              Immediate SLA
            </span>
          </div>
          <div className={`mt-2.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ARR Exposure: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>$360,000</strong>
          </div>
        </div>

        {/* Card 4: NPS & CSAT */}
        <div
          id="kpi-nps-csat"
          className={`rounded-xl border p-4 transition-all group ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              NPS & Rating CSAT
            </span>
            <Activity className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight">+{workspace.npsScore} NPS</div>
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {avgRating} / 5.0
            </div>
          </div>
          <div className={`mt-2.5 text-xs flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Benchmark: Top Tier</span>
            <span className="text-emerald-500 font-semibold">+6 pts vs Q2</span>
          </div>
        </div>
      </div>

      {/* Charts Row: Trend Timeline + Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Trend (2 Cols) */}
        <div
          className={`lg:col-span-2 rounded-2xl border p-5 transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-sm font-bold tracking-tight">Sentiment Trajectory Over Time</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Daily signal volume classified into positive, neutral, and negative
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="flex items-center gap-1.5 text-indigo-500">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  name="Positive"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPositive)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  name="Neutral"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNeutral)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  name="Negative"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNegative)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Donut & Breakdown (1 Col) */}
        <div
          className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div>
            <h2 className="text-sm font-bold tracking-tight">Sentiment Breakdown</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Aggregate distribution across customer base
            </p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={`space-y-2 border-t pt-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive Sentiment
              </span>
              <span className="font-semibold">
                {positiveCount} ({positivePercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Neutral / Mixed
              </span>
              <span className="font-semibold">{neutralCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative Complaints
              </span>
              <span className="font-semibold text-rose-500">
                {negativeCount} ({negativePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Channel Volume + Top Themes Clustering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Volume Chart */}
        <div
          className={`rounded-2xl border p-5 transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold tracking-tight">Signal Volume by Channel</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Channel distribution with positive vs negative ratio
              </p>
            </div>
            <button
              onClick={() => onNavigateToFeedback()}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Explore All →
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="channel" tick={{ fontSize: 10, fill: chartTextColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Bar dataKey="Positive" name="Positive Signals" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Negative" name="Negative Signals" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Recurring Themes & Category Heat */}
        <div
          className={`rounded-2xl border p-5 transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold tracking-tight">Top Clustered Themes & Topics</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                AI-identified topics with customer sentiment ratio
              </p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Gemini Clustered
            </span>
          </div>

          <div className="space-y-3">
            {themeChartData.map((themeItem) => (
              <div
                key={themeItem.theme}
                onClick={() => onNavigateToFeedback('theme', themeItem.theme)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80'
                    : 'bg-slate-50/70 border-slate-200/70 hover:border-indigo-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold group-hover:text-indigo-400 transition-colors">
                    {themeItem.theme}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {themeItem.count} signals
                    </span>
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded-full border ${
                        themeItem.positiveRatio >= 60
                          ? isDark
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : themeItem.negativeRatio >= 40
                          ? isDark
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                          : isDark
                          ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {themeItem.positiveRatio}% pos
                    </span>
                  </div>
                </div>

                {/* Sentiment Ratio Bar */}
                <div className={`w-full h-1.5 rounded-full overflow-hidden flex ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="bg-emerald-500 h-full" style={{ width: `${themeItem.positiveRatio}%` }} />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${Math.max(0, 100 - themeItem.positiveRatio)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
