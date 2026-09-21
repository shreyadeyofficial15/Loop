import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Trash2,
  ChevronRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  X,
  Building,
} from 'lucide-react';
import {
  FeedbackItem,
  FeedbackChannel,
  SentimentType,
  UrgencyLevel,
  CustomerTier,
  CategoryTheme,
  UserRole,
} from '../types';
import { ChannelIcon } from './ChannelIcon';

interface FeedbackTableProps {
  feedbacks: FeedbackItem[];
  userRole: UserRole;
  onSelectFeedback: (item: FeedbackItem) => void;
  onUpdateStatus: (id: string, status: 'new' | 'investigating' | 'planned' | 'resolved') => void;
  onDeleteFeedback: (id: string) => void;
  initialFilterKey?: string;
  initialFilterValue?: string;
  theme?: 'light' | 'dark';
}

export function FeedbackTable({
  feedbacks,
  userRole,
  onSelectFeedback,
  onUpdateStatus,
  onDeleteFeedback,
  initialFilterKey,
  initialFilterValue,
  theme = 'light',
}: FeedbackTableProps) {
  const isDark = theme === 'dark';

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<FeedbackChannel | 'all'>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentType | 'all'>(
    initialFilterKey === 'sentiment' ? (initialFilterValue as SentimentType) : 'all'
  );
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | 'all'>(
    initialFilterKey === 'urgency' ? (initialFilterValue as UrgencyLevel) : 'all'
  );
  const [selectedTier, setSelectedTier] = useState<CustomerTier | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>(
    initialFilterKey === 'theme' ? initialFilterValue || 'all' : 'all'
  );
  const [quickPreset, setQuickPreset] = useState<string>('all');

  // Sync if initial props change
  React.useEffect(() => {
    if (initialFilterKey === 'urgency' && initialFilterValue) {
      setSelectedUrgency(initialFilterValue as UrgencyLevel);
      setQuickPreset('critical');
    }
    if (initialFilterKey === 'sentiment' && initialFilterValue) {
      setSelectedSentiment(initialFilterValue as SentimentType);
      if (initialFilterValue === 'positive') setQuickPreset('positive');
      if (initialFilterValue === 'negative') setQuickPreset('negative');
    }
    if (initialFilterKey === 'theme' && initialFilterValue) {
      setSelectedTheme(initialFilterValue);
    }
  }, [initialFilterKey, initialFilterValue]);

  // Preset Handlers
  const handleApplyPreset = (preset: string) => {
    setQuickPreset(preset);
    if (preset === 'all') {
      resetFilters();
    } else if (preset === 'critical') {
      setSelectedUrgency('critical');
      setSelectedSentiment('all');
      setSelectedTier('all');
    } else if (preset === 'churn') {
      setSelectedUrgency('all');
      setSelectedSentiment('negative');
      setSelectedTier('enterprise');
    } else if (preset === 'positive') {
      setSelectedSentiment('positive');
      setSelectedUrgency('all');
    } else if (preset === 'negative') {
      setSelectedSentiment('negative');
      setSelectedUrgency('all');
    } else if (preset === 'enterprise') {
      setSelectedTier('enterprise');
      setSelectedSentiment('all');
    }
  };

  // Filter logic
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (selectedChannel !== 'all' && item.channel !== selectedChannel) return false;
    if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) return false;
    if (selectedUrgency !== 'all' && item.urgency !== selectedUrgency) return false;
    if (selectedTier !== 'all' && item.customerTier !== selectedTier) return false;
    if (selectedTheme !== 'all' && !item.themes.includes(selectedTheme as CategoryTheme)) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchText =
        item.content.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerCompany.toLowerCase().includes(q) ||
        item.aiSummary.toLowerCase().includes(q) ||
        item.themes.some((t) => t.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedChannel('all');
    setSelectedSentiment('all');
    setSelectedUrgency('all');
    setSelectedTier('all');
    setSelectedTheme('all');
    setQuickPreset('all');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedChannel !== 'all' ||
    selectedSentiment !== 'all' ||
    selectedUrgency !== 'all' ||
    selectedTier !== 'all' ||
    selectedTheme !== 'all' ||
    quickPreset !== 'all';

  return (
    <div id="feedback-table-wrapper" className="space-y-4">
      {/* Top Filter & Control Card */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              id="feedback-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across signals, customer accounts, AI themes, or quotes..."
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm border transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500'
              }`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode & Signal Counter */}
          <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-end">
            <span className={`text-xs whitespace-nowrap font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{filteredFeedbacks.length}</strong> of{' '}
              {feedbacks.length} signals
            </span>

            {/* View Mode Toggle */}
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                id="view-mode-cards-btn"
                onClick={() => setViewMode('cards')}
                title="Cards View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? isDark
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                id="view-mode-table-btn"
                onClick={() => setViewMode('table')}
                title="Dense Table View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? isDark
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Quick Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800">
          <span className={`text-[11px] font-semibold mr-1 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Presets:
          </span>
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'critical', label: '🚨 Critical Urgency' },
            { id: 'churn', label: '📉 High Churn Risk' },
            { id: 'positive', label: '👍 Positive Praise' },
            { id: 'negative', label: '👎 Negative Complaints' },
            { id: 'enterprise', label: '🏢 Enterprise Accounts' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                quickPreset === preset.id
                  ? isDark
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-indigo-600 text-white border-indigo-600'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Row 3: Dropdown Detailed Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
          <span className={`font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Channel */}
          <select
            id="filter-channel-select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Channels (9)</option>
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

          {/* Sentiment */}
          <select
            id="filter-sentiment-select"
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Sentiments</option>
            <option value="positive">🟢 Positive</option>
            <option value="neutral">🔵 Neutral</option>
            <option value="mixed">🟣 Mixed</option>
            <option value="negative">🔴 Negative</option>
          </select>

          {/* Urgency */}
          <select
            id="filter-urgency-select"
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Urgencies</option>
            <option value="critical">🚨 Critical Urgency</option>
            <option value="high">⚠️ High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Customer Tier */}
          <select
            id="filter-tier-select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Customer Tiers</option>
            <option value="enterprise">Enterprise Tier</option>
            <option value="growth">Growth Tier</option>
            <option value="starter">Starter</option>
            <option value="free">Free</option>
          </select>

          {/* Theme */}
          <select
            id="filter-theme-select"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Themes</option>
            <option value="Performance & Speed">Performance & Speed</option>
            <option value="Pricing & Billing">Pricing & Billing</option>
            <option value="UI & Usability">UI & Usability</option>
            <option value="Integrations & API">Integrations & API</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Bugs & Reliability">Bugs & Reliability</option>
            <option value="Security & Compliance">Security & Compliance</option>
            <option value="Onboarding">Onboarding</option>
          </select>
        </div>
      </div>

      {/* View Mode: Cards or Dense Table */}
      {filteredFeedbacks.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <Filter className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className="text-sm font-semibold">No customer signals match your criteria</h3>
          <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try adjusting your active channel, urgency, or sentiment filters, or clear your search query.
          </p>
          <button
            onClick={resetFilters}
            className={`mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* DENSE TABLE VIEW */
        <div
          className={`rounded-2xl border overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`border-b font-semibold uppercase tracking-wider text-[10px] ${
                  isDark ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Customer & Account</th>
                  <th className="py-3 px-4">Signal Content</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredFeedbacks.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectFeedback(item)}
                    className={`transition-colors cursor-pointer ${
                      item.urgency === 'critical'
                        ? isDark
                          ? 'bg-rose-950/20 hover:bg-rose-950/40'
                          : 'bg-rose-50/40 hover:bg-rose-50/80'
                        : isDark
                        ? 'hover:bg-slate-800/50 text-slate-200'
                        : 'hover:bg-slate-50/80 text-slate-800'
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <ChannelIcon channel={item.channel} showLabel={false} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-xs">{item.customerName}</div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.customerCompany} • {item.customerTier}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="line-clamp-2 text-xs">{item.content}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {item.themes.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.sentiment === 'positive'
                            ? isDark
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.sentiment === 'negative'
                            ? isDark
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                            : isDark
                            ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        <span className="capitalize">{item.sentiment}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.urgency === 'critical' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Critical
                        </span>
                      ) : item.urgency === 'high' ? (
                        <span className="text-[10px] font-semibold text-amber-500">High</span>
                      ) : (
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.urgency}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border cursor-pointer ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="investigating">Investigating</option>
                        <option value="planned">Planned</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectFeedback(item)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                            isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          Inspect
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        {userRole === 'admin' && (
                          <button
                            onClick={() => onDeleteFeedback(item.id)}
                            title="Delete signal"
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="space-y-3">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              id={`feedback-card-${item.id}`}
              className={`rounded-2xl border transition-all p-4 ${
                item.urgency === 'critical'
                  ? isDark
                    ? 'border-rose-900/60 bg-rose-950/20'
                    : 'border-rose-300 bg-rose-50/30'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-100'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <ChannelIcon channel={item.channel} showLabel />

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{item.customerName}</span>
                    <span className="opacity-40">•</span>
                    <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.customerCompany}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        item.customerTier === 'enterprise'
                          ? isDark
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                          : item.customerTier === 'growth'
                          ? isDark
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.customerTier}
                    </span>
                  </div>
                </div>

                {/* Badges: Sentiment, Urgency, Churn */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Sentiment Pill */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.sentiment === 'positive'
                        ? isDark
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.sentiment === 'negative'
                        ? isDark
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.sentiment === 'mixed'
                        ? isDark
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                        : isDark
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    <span className="capitalize">{item.sentiment}</span>
                    <span className="font-mono text-[10px] opacity-80">
                      ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                    </span>
                  </span>

                  {/* Urgency Pill */}
                  {item.urgency === 'critical' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Critical Urgency
                    </span>
                  )}

                  {/* Churn Risk Pill */}
                  {item.churnRisk === 'high' && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      High Churn Risk
                    </span>
                  )}

                  {/* Rating Stars */}
                  {typeof item.rating === 'number' && (
                    <div
                      className={`flex items-center text-xs px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span className="font-bold">{item.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Content Text */}
              <p
                className={`mt-3 text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-800 text-slate-200'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-800'
                }`}
              >
                "{item.content}"
              </p>

              {/* AI Summary and Recommendation */}
              <div className={`mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-start gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">AI Intelligence Summary: </span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.aiSummary}</span>
                  </div>
                </div>

                {item.actionableNextStep && (
                  <div
                    className={`flex items-start gap-2 text-xs p-2 rounded-lg border ${
                      isDark
                        ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200'
                        : 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Recommended Action: </span>
                      <span>{item.actionableNextStep}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer row: Themes tags + Status + Details Trigger */}
              <div
                className={`mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 text-xs border-t ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-medium opacity-60">Themes:</span>
                  {item.themes.map((theme) => (
                    <span
                      key={theme}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTheme(theme);
                      }}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border-slate-200'
                      }`}
                    >
                      {theme}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 justify-between sm:justify-end">
                  {/* Status Dropdown */}
                  <select
                    id={`status-select-${item.id}`}
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="new">Status: New</option>
                    <option value="investigating">Status: Investigating</option>
                    <option value="planned">Status: Planned</option>
                    <option value="resolved">Status: Resolved</option>
                  </select>

                  {/* Inspect Button */}
                  <button
                    id={`inspect-feedback-${item.id}`}
                    onClick={() => onSelectFeedback(item)}
                    className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      isDark
                        ? 'bg-slate-100 hover:bg-white text-slate-900'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete if admin */}
                  {userRole === 'admin' && (
                    <button
                      id={`delete-feedback-${item.id}`}
                      onClick={() => onDeleteFeedback(item.id)}
                      title="Delete signal (Admin)"
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
