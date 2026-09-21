import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  MessageSquareText,
  Lightbulb,
  Sparkles,
  FileText,
  Cable,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
} from 'lucide-react';
import {
  FeedbackItem,
  WorkspaceTenant,
  UserRole,
  VoCReport,
  InsightRecommendation,
} from './types';
import { WORKSPACES, INITIAL_FEEDBACK, INITIAL_INSIGHTS, INITIAL_VOC_REPORTS } from './data/mockData';
import { Header } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FeedbackTable } from './components/FeedbackTable';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';
import { NewFeedbackModal } from './components/NewFeedbackModal';
import { AskLoopAssistant } from './components/AskLoopAssistant';
import { VoCReportsView } from './components/VoCReportsView';
import { InsightsView } from './components/InsightsView';
import { IntegrationsHub } from './components/IntegrationsHub';
import { MernArchitectureModal } from './components/MernArchitectureModal';

export default function App() {
  // Navigation & Multi-Tenant State
  const [currentTab, setCurrentTab] = useState<
    'analytics' | 'feedback' | 'insights' | 'ask_loop' | 'voc_reports' | 'integrations'
  >('analytics');

  const [workspaces, setWorkspaces] = useState<WorkspaceTenant[]>(WORKSPACES);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceTenant>(WORKSPACES[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Core Data Stores
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [insights, setInsights] = useState<InsightRecommendation[]>(INITIAL_INSIGHTS);
  const [vocReport, setVocReport] = useState<VoCReport | null>(INITIAL_VOC_REPORTS[0]);

  // Modals & Active Selections
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [newFeedbackOpen, setNewFeedbackOpen] = useState(false);
  const [mernModalOpen, setMernModalOpen] = useState(false);
  const [askAiInitialQuery, setAskAiInitialQuery] = useState<string | undefined>(undefined);

  // Drilldown Filter passing between views
  const [tableFilterKey, setTableFilterKey] = useState<string | undefined>(undefined);
  const [tableFilterValue, setTableFilterValue] = useState<string | undefined>(undefined);

  // Status & Telemetry
  const [hasGeminiKey, setHasGeminiKey] = useState(true);
  const [isGeneratingVoC, setIsGeneratingVoC] = useState(false);
  const [isGeneratingSynthetic, setIsGeneratingSynthetic] = useState(false);
  const [isSimulatingStream, setIsSimulatingStream] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // Initial load from server
  useEffect(() => {
    fetchHealthAndWorkspaces();
    loadFeedbackData(currentWorkspace.id);
  }, [currentWorkspace.id]);

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const fetchHealthAndWorkspaces = async () => {
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const hData = await healthRes.json();
        setHasGeminiKey(hData.hasGeminiKey ?? true);
      }

      const wsRes = await fetch('/api/workspaces');
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        if (wsData.length > 0) {
          setWorkspaces(wsData);
        }
      }
    } catch (e) {
      console.warn('Using local fallback state:', e);
    }
  };

  const loadFeedbackData = async (workspaceId: string) => {
    try {
      const res = await fetch(`/api/feedback?workspaceId=${workspaceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setFeedbacks(data);
        }
      }
    } catch (e) {
      console.warn('Feedback fetch error:', e);
    }
  };

  // Live Stream Simulation interval
  useEffect(() => {
    if (!isSimulatingStream) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/feedback/synthetic-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspaceId: currentWorkspace.id, count: 1 }),
        });
        if (res.ok) {
          const newItems = await res.json();
          if (newItems.length > 0) {
            const newItem = newItems[0];
            setFeedbacks((prev) => [newItem, ...prev]);
            showToast(
              `Live Signal Ingested: ${newItem.channel.toUpperCase()}`,
              `${newItem.customerCompany} (${newItem.sentiment}) • ${newItem.aiSummary}`,
              newItem.urgency === 'critical' ? 'warning' : 'info'
            );
          }
        }
      } catch (err) {
        console.error('Simulation tick error:', err);
      }
    }, 16000);

    return () => clearInterval(interval);
  }, [isSimulatingStream, currentWorkspace.id]);

  // Workspace Switch
  const handleSelectWorkspace = (ws: WorkspaceTenant) => {
    setCurrentWorkspace(ws);
    const existingReport = INITIAL_VOC_REPORTS.find((r) => r.workspaceId === ws.id) || INITIAL_VOC_REPORTS[0];
    setVocReport({
      ...existingReport,
      workspaceId: ws.id,
      title: `${ws.name} – Executive Voice-of-Customer Intelligence Brief`,
    });
    showToast('Workspace Switched', `Active tenant: ${ws.name} (${ws.plan})`, 'info');
  };

  // Role Switch
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    showToast('Role Switched (RBAC)', `Active Persona: ${role.replace('_', ' ').toUpperCase()}`, 'info');
  };

  // Feedback mutations
  const handleAddFeedback = async (newItem: Partial<FeedbackItem>) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const saved = await res.json();
      setFeedbacks((prev) => [saved, ...prev]);
      showToast('Signal Ingested', `Successfully classified feedback from ${saved.customerCompany}`, 'success');
    } catch (err) {
      const fallbackItem: FeedbackItem = {
        id: `fb-${Date.now()}`,
        workspaceId: currentWorkspace.id,
        customerName: newItem.customerName || 'Anonymous',
        customerCompany: newItem.customerCompany || 'Direct Account',
        customerEmail: newItem.customerEmail || 'support@client.com',
        customerTier: newItem.customerTier || 'growth',
        channel: newItem.channel || 'zendesk',
        rating: newItem.rating,
        content: newItem.content || '',
        createdAt: new Date().toISOString(),
        sentiment: newItem.sentiment || 'neutral',
        sentimentScore: newItem.sentimentScore || 0,
        urgency: newItem.urgency || 'low',
        churnRisk: newItem.churnRisk || 'none',
        themes: newItem.themes || ['Customer Support'],
        aiSummary: newItem.aiSummary || 'Signal logged via intake modal.',
        actionableNextStep: newItem.actionableNextStep,
        assignedTeam: newItem.assignedTeam || 'Product',
        status: 'new',
      };
      setFeedbacks((prev) => [fallbackItem, ...prev]);
      showToast('Signal Ingested', `Successfully logged feedback locally`, 'success');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'investigating' | 'planned' | 'resolved') => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback((prev) => (prev ? { ...prev, status } : null));
    }
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast('Status Updated', `Feedback marked as ${status.toUpperCase()}`, 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTeam = async (id: string, assignedTeam: 'Product' | 'Support' | 'Engineering' | 'Executive') => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, assignedTeam } : f)));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback((prev) => (prev ? { ...prev, assignedTeam } : null));
    }
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTeam }),
      });
      showToast('Team Reassigned', `Assigned to ${assignedTeam}`, 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    if (selectedFeedback?.id === id) setSelectedFeedback(null);
    try {
      await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      showToast('Feedback Removed', 'Signal deleted from intelligence store', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateInsightStatus = async (id: string, status: 'open' | 'in_progress' | 'completed') => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await fetch(`/api/insights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast('Initiative Updated', `Status changed to ${status.replace('_', ' ').toUpperCase()}`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // VoC Generation
  const handleGenerateVoCReport = async (customFocus?: string) => {
    setIsGeneratingVoC(true);
    try {
      const res = await fetch('/api/feedback/voc-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: currentWorkspace.id, customFocus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'VoC Generation Failed');
      setVocReport(data);
      showToast('Executive VoC Generated', 'Generated comprehensive analysis with Gemini 3.8 Flash', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('VoC Report', 'Updated executive analysis with current signals', 'info');
    } finally {
      setIsGeneratingVoC(false);
    }
  };

  // Synthetic Signal Generation
  const handleGenerateSynthetic = async (count: number, topic?: string) => {
    setIsGeneratingSynthetic(true);
    try {
      const res = await fetch('/api/feedback/synthetic-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: currentWorkspace.id, count, topic }),
      });
      const newItems = await res.json();
      if (!res.ok) throw new Error(newItems.error || 'Generation failed');
      setFeedbacks((prev) => [...newItems, ...prev]);
      showToast(
        'Signals Generated',
        `Successfully generated ${newItems.length} multi-channel signals via Gemini`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast('Generation Error', err.message || 'Failed to generate synthetic signals', 'warning');
    } finally {
      setIsGeneratingSynthetic(false);
    }
  };

  // Navigation helpers
  const handleNavigateToFeedbackWithFilter = (filterKey?: string, filterValue?: string) => {
    setTableFilterKey(filterKey);
    setTableFilterValue(filterValue);
    setCurrentTab('feedback');
  };

  const handleOpenAskAi = (query?: string) => {
    setAskAiInitialQuery(query);
    setCurrentTab('ask_loop');
  };

  // Tab definitions
  interface TabItem {
    id: 'analytics' | 'feedback' | 'insights' | 'ask_loop' | 'voc_reports' | 'integrations';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badge?: string;
  }

  const TABS: TabItem[] = [
    { id: 'analytics', label: 'Analytics & KPIs', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback Explorer', icon: MessageSquareText, count: feedbacks.length },
    { id: 'insights', label: 'Actionable Insights', icon: Lightbulb, count: insights.length },
    { id: 'ask_loop', label: 'Ask LOOP AI', icon: Sparkles, badge: 'Agent' },
    { id: 'voc_reports', label: 'VoC Executive Brief', icon: FileText },
    { id: 'integrations', label: 'Connectors & Ingest', icon: Cable, count: 9 },
  ];

  const isDark = theme === 'dark';

  return (
    <div
      id="project-loop-app"
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/80 text-slate-900'
      }`}
    >
      {/* Global SaaS Header */}
      <Header
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onOpenNewFeedback={() => setNewFeedbackOpen(true)}
        onOpenAskAi={() => handleOpenAskAi()}
        isSimulating={isSimulatingStream}
        onToggleSimulation={() => {
          setIsSimulatingStream(!isSimulatingStream);
          showToast(
            isSimulatingStream ? 'Simulation Paused' : 'Simulation Started',
            isSimulatingStream ? 'Inbound stream stopped' : 'Streaming incoming customer feedback every 16s',
            'info'
          );
        }}
        hasGeminiKey={hasGeminiKey}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenMernInspector={() => setMernModalOpen(true)}
      />

      {/* Main Tab Navigation Bar */}
      <div
        className={`border-b transition-colors sticky top-16 z-30 ${
          isDark ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-slate-200/90 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setAskAiInitialQuery(undefined);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                          : 'bg-slate-900 text-white shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? isDark
                              ? 'bg-indigo-700/80 text-white'
                              : 'bg-slate-800 text-slate-200'
                            : isDark
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isDark
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick KPI Ticker */}
            <div className="hidden xl:flex items-center gap-3 text-xs shrink-0 font-medium">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-emerald-500 font-bold">NSS: +38%</span>
                <span className="opacity-40">•</span>
                <span>{feedbacks.length} Signals</span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                  isDark ? 'bg-indigo-950/40 border-indigo-900/60 text-indigo-300' : 'bg-indigo-50/70 border-indigo-100 text-indigo-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Pipeline Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            feedbacks={feedbacks}
            workspace={currentWorkspace}
            userRole={currentRole}
            onNavigateToFeedback={handleNavigateToFeedbackWithFilter}
            onNavigateToVoC={() => setCurrentTab('voc_reports')}
            onOpenAskAi={handleOpenAskAi}
            theme={theme}
          />
        )}

        {currentTab === 'feedback' && (
          <FeedbackTable
            feedbacks={feedbacks}
            userRole={currentRole}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteFeedback={handleDeleteFeedback}
            initialFilterKey={tableFilterKey}
            initialFilterValue={tableFilterValue}
            theme={theme}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            insights={insights}
            workspace={currentWorkspace}
            userRole={currentRole}
            feedbacks={feedbacks}
            onUpdateInsightStatus={handleUpdateInsightStatus}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
            theme={theme}
          />
        )}

        {currentTab === 'ask_loop' && (
          <AskLoopAssistant
            workspace={currentWorkspace}
            feedbacks={feedbacks}
            initialQuery={askAiInitialQuery}
            onSelectFeedback={(item) => setSelectedFeedback(item)}
            theme={theme}
          />
        )}

        {currentTab === 'voc_reports' && (
          <VoCReportsView
            workspace={currentWorkspace}
            userRole={currentRole}
            currentReport={vocReport}
            onGenerateReport={handleGenerateVoCReport}
            isGenerating={isGeneratingVoC}
            theme={theme}
          />
        )}

        {currentTab === 'integrations' && (
          <IntegrationsHub
            workspace={currentWorkspace}
            onGenerateSynthetic={handleGenerateSynthetic}
            isGeneratingSynthetic={isGeneratingSynthetic}
            onBatchUploadMock={() => {
              showToast(
                'CSV Batch Ingestion',
                'Simulated 24 rows imported from Zendesk & G2 export dataset',
                'success'
              );
            }}
            theme={theme}
          />
        )}
      </main>

      {/* Global Ingestion Modal */}
      <NewFeedbackModal
        workspaceId={currentWorkspace.id}
        isOpen={newFeedbackOpen}
        onClose={() => setNewFeedbackOpen(false)}
        onSubmit={handleAddFeedback}
        theme={theme}
      />

      {/* MERN Stack Architecture Inspector Modal */}
      <MernArchitectureModal
        isOpen={mernModalOpen}
        onClose={() => setMernModalOpen(false)}
        theme={theme}
      />

      {/* Feedback Item Inspection Drawer */}
      <FeedbackDetailModal
        item={selectedFeedback}
        userRole={currentRole}
        onClose={() => setSelectedFeedback(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateTeam={handleUpdateTeam}
        theme={theme}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className={`fixed bottom-5 right-5 z-50 max-w-sm w-full rounded-2xl shadow-2xl border p-4 animate-in slide-in-from-bottom-5 duration-200 flex items-start justify-between gap-3 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold">{toastMessage.title}</h4>
              <p className={`text-xs mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{toastMessage.desc}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className={`p-0.5 rounded transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
